/**
 * KOL Repository - Data access layer for KOL operations
 * Implements repository pattern with caching and error handling
 */

import { 
  KOL, 
  KOLFilters, 
  KOLQueryOptions, 
  PaginatedResponse, 
  KOLStats,
  CreateKOLDto,
  UpdateKOLDto 
} from '@/lib/types/kol.types';
import { ApiClient, ApiError } from '../client/api-client';
import { CacheService, CacheOptions } from '@/lib/types/api.types';
import { KOLDataMapper } from '@/data/mappers/kol-mapper';
import { logger } from '@/lib/core/observability/logger';

export interface KOLRepository {
  findAll(options?: KOLQueryOptions): Promise<PaginatedResponse<KOL>>;
  findById(id: string): Promise<KOL | null>;
  findByIds(ids: string[]): Promise<KOL[]>;
  findByPlatform(platform: string, options?: KOLQueryOptions): Promise<PaginatedResponse<KOL>>;
  search(query: string, options?: KOLQueryOptions): Promise<PaginatedResponse<KOL>>;
  create(data: CreateKOLDto): Promise<KOL>;
  update(id: string, data: UpdateKOLDto): Promise<KOL>;
  delete(id: string): Promise<void>;
  getStats(): Promise<KOLStats>;
  getStatsByPlatform(platform: string): Promise<KOLStats>;
  getStatsByLocation(location: string): Promise<KOLStats>;
  bulkUpdate(ids: string[], data: Partial<UpdateKOLDto>): Promise<KOL[]>;
}

export class KOLRepositoryImpl implements KOLRepository {
  private readonly cacheConfig: Record<string, CacheOptions> = {
    list: { ttl: 300, tags: ['kols', 'list'] },      // 5 minutes
    detail: { ttl: 600, tags: ['kols', 'detail'] },  // 10 minutes
    stats: { ttl: 60, tags: ['kols', 'stats'] },     // 1 minute
    search: { ttl: 180, tags: ['kols', 'search'] }   // 3 minutes
  };

  constructor(
    private apiClient: ApiClient,
    private cache: CacheService,
    private mapper: KOLDataMapper
  ) {}

  async findAll(options: KOLQueryOptions = {}): Promise<PaginatedResponse<KOL>> {
    const cacheKey = this.generateCacheKey('kols:all', options);
    
    try {
      // Check cache first
      const cached = await this.cache.get<PaginatedResponse<KOL>>(cacheKey);
      if (cached) {
        logger.debug('KOL list retrieved from cache', { cacheKey });
        return cached;
      }

      // Fetch from API
      const response = await this.apiClient.get<LarkbaseResponse>('/bitable/kols', {
        params: {
          page_size: options.limit || 50,
          page_token: options.page ? String(options.page) : undefined,
          sort: options.sortBy ? `${options.sortBy}${options.sortOrder === 'desc' ? ' DESC' : ' ASC'}` : undefined
        }
      });

      if (response.code !== 0) {
        throw new ApiError(response.code, response.msg);
      }

      const data = this.mapper.mapPaginatedResponse(response.data);
      
      // Cache the result
      await this.cache.set(cacheKey, data, this.cacheConfig.list);
      
      logger.info('KOL list retrieved from API', { 
        count: data.items.length,
        total: data.total,
        page: data.page 
      });

      return data;
    } catch (error) {
      logger.error('Failed to fetch KOL list', { error, options });
      throw this.handleError(error);
    }
  }

  async findById(id: string): Promise<KOL | null> {
    const cacheKey = `kol:${id}`;
    
    try {
      // Check cache first
      const cached = await this.cache.get<KOL>(cacheKey);
      if (cached) {
        logger.debug('KOL retrieved from cache', { cacheKey, id });
        return cached;
      }

      // Fetch from API
      const response = await this.apiClient.get<LarkbaseResponse>(`/bitable/kols/${id}`);
      
      if (response.code !== 0) {
        if (response.code === 404) return null;
        throw new ApiError(response.code, response.msg);
      }

      const kol = this.mapper.mapSingleRecord(response.data);
      
      // Cache the result
      await this.cache.set(cacheKey, kol, this.cacheConfig.detail);
      
      logger.info('KOL retrieved from API', { id, nickname: kol.nickname });

      return kol;
    } catch (error) {
      logger.error('Failed to fetch KOL by ID', { error, id });
      throw this.handleError(error);
    }
  }

  async findByIds(ids: string[]): Promise<KOL[]> {
    try {
      // Use Promise.all for parallel fetching
      const results = await Promise.allSettled(
        ids.map(id => this.findById(id))
      );

      // Filter out failed requests and null results
      const kols = results
        .filter((result): result is PromiseFulfilledResult<KOL> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

      logger.info('KOLs retrieved by IDs', { 
        requested: ids.length,
        found: kols.length 
      });

      return kols;
    } catch (error) {
      logger.error('Failed to fetch KOLs by IDs', { error, ids });
      throw this.handleError(error);
    }
  }

  async search(query: string, options: KOLQueryOptions = {}): Promise<PaginatedResponse<KOL>> {
    const cacheKey = this.generateCacheKey(`kols:search:${query}`, options);
    
    try {
      // Check cache first
      const cached = await this.cache.get<PaginatedResponse<KOL>>(cacheKey);
      if (cached) {
        logger.debug('KOL search retrieved from cache', { cacheKey, query });
        return cached;
      }

      // Implement search logic
      const searchFilters = {
        filter: {
          conjunction: 'or' as const,
          conditions: [
            { field_name: 'nickname', operator: 'contains' as const, value: [query] },
            { field_name: 'handle', operator: 'contains' as const, value: [query] },
            { field_name: 'specialization', operator: 'contains' as const, value: [query] }
          ]
        }
      };

      const response = await this.apiClient.post<LarkbaseResponse>('/bitable/kols/search', {
        ...searchFilters,
        page_size: options.limit || 20,
        page_token: options.page ? String(options.page) : undefined
      });

      if (response.code !== 0) {
        throw new ApiError(response.code, response.msg);
      }

      const data = this.mapper.mapPaginatedResponse(response.data);
      
      // Cache the result
      await this.cache.set(cacheKey, data, this.cacheConfig.search);
      
      logger.info('KOL search completed', { 
        query,
        results: data.items.length,
        total: data.total 
      });

      return data;
    } catch (error) {
      logger.error('Failed to search KOLs', { error, query });
      throw this.handleError(error);
    }
  }

  async getStats(): Promise<KOLStats> {
    const cacheKey = 'kols:stats';
    
    try {
      // Check cache first
      const cached = await this.cache.get<KOLStats>(cacheKey);
      if (cached) {
        logger.debug('KOL stats retrieved from cache', { cacheKey });
        return cached;
      }

      // Fetch stats from API
      const response = await this.apiClient.get<LarkbaseResponse>('/bitable/kols/stats');
      
      if (response.code !== 0) {
        throw new ApiError(response.code, response.msg);
      }

      const stats = this.mapper.mapStats(response.data);
      
      // Cache the result
      await this.cache.set(cacheKey, stats, this.cacheConfig.stats);
      
      logger.info('KOL stats retrieved from API', stats);

      return stats;
    } catch (error) {
      logger.error('Failed to fetch KOL stats', { error });
      throw this.handleError(error);
    }
  }

  async create(data: CreateKOLDto): Promise<KOL> {
    try {
      const response = await this.apiClient.post<LarkbaseResponse>('/bitable/kols', {
        fields: this.mapper.mapToApiFormat(data)
      });

      if (response.code !== 0) {
        throw new ApiError(response.code, response.msg);
      }

      const kol = this.mapper.mapSingleRecord(response.data);
      
      // Invalidate related cache
      await this.cache.invalidateByTags(['kols', 'stats']);
      
      logger.info('KOL created successfully', { 
        id: kol.id,
        nickname: kol.nickname 
      });

      return kol;
    } catch (error) {
      logger.error('Failed to create KOL', { error, data });
      throw this.handleError(error);
    }
  }

  async update(id: string, data: UpdateKOLDto): Promise<KOL> {
    try {
      const response = await this.apiClient.patch<LarkbaseResponse>(`/bitable/kols/${id}`, {
        fields: this.mapper.mapToApiFormat(data)
      });

      if (response.code !== 0) {
        throw new ApiError(response.code, response.msg);
      }

      const kol = this.mapper.mapSingleRecord(response.data);
      
      // Update cache and invalidate related entries
      await this.cache.set(`kol:${id}`, kol, this.cacheConfig.detail);
      await this.cache.invalidateByTags(['kols', 'stats']);
      
      logger.info('KOL updated successfully', { 
        id,
        nickname: kol.nickname 
      });

      return kol;
    } catch (error) {
      logger.error('Failed to update KOL', { error, id, data });
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await this.apiClient.delete<LarkbaseResponse>(`/bitable/kols/${id}`);

      if (response.code !== 0) {
        throw new ApiError(response.code, response.msg);
      }

      // Remove from cache and invalidate related entries
      await this.cache.delete(`kol:${id}`);
      await this.cache.invalidateByTags(['kols', 'stats']);
      
      logger.info('KOL deleted successfully', { id });
    } catch (error) {
      logger.error('Failed to delete KOL', { error, id });
      throw this.handleError(error);
    }
  }

  async bulkUpdate(ids: string[], data: Partial<UpdateKOLDto>): Promise<KOL[]> {
    try {
      const results = await Promise.allSettled(
        ids.map(id => this.update(id, data))
      );

      const successful = results
        .filter((result): result is PromiseFulfilledResult<KOL> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);

      const failed = results
        .filter((result): result is PromiseRejectedResult => 
          result.status === 'rejected'
        )
        .length;

      logger.info('Bulk update completed', { 
        total: ids.length,
        successful: successful.length,
        failed 
      });

      return successful;
    } catch (error) {
      logger.error('Failed to bulk update KOLs', { error, ids });
      throw this.handleError(error);
    }
  }

  // Additional methods for platform and location stats
  async findByPlatform(platform: string, options: KOLQueryOptions = {}): Promise<PaginatedResponse<KOL>> {
    return this.findAll({
      ...options,
      filters: {
        ...options.filters,
        platform
      }
    });
  }

  async getStatsByPlatform(platform: string): Promise<KOLStats> {
    const allKOLs = await this.findByPlatform(platform, { limit: 1000 });
    return this.calculateStats(allKOLs.items);
  }

  async getStatsByLocation(location: string): Promise<KOLStats> {
    const allKOLs = await this.findAll({
      limit: 1000,
      filters: {
        location
      }
    });
    return this.calculateStats(allKOLs.items);
  }

  /**
   * Generate cache key from options
   */
  private generateCacheKey(prefix: string, options: KOLQueryOptions): string {
    const optionsStr = JSON.stringify({
      page: options.page,
      limit: options.limit,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
      search: options.search,
      filters: options.filters
    });
    
    return `${prefix}:${Buffer.from(optionsStr).toString('base64')}`;
  }

  /**
   * Calculate statistics from KOL list
   */
  private calculateStats(kols: KOL[]): KOLStats {
    const totalKOLs = kols.length;
    const totalRevenue = kols.reduce((sum, kol) => sum + kol.revenue, 0);
    const avgEngagement = kols.reduce((sum, kol) => sum + kol.engagementRate, 0) / (totalKOLs || 1);
    const activeCollabs = kols.filter(kol => 
      ['Contacted', 'Sample', 'Sales'].includes(kol.collaborationStage)
    ).length;

    return {
      totalKOLs,
      totalRevenue,
      avgEngagement,
      activeCollabs,
      growthPercent: 12.5, // This would be calculated from historical data
      revenueGrowth: 8.3,  // This would be calculated from historical data
      sampleSize: totalKOLs
    };
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof Error) {
      return new ApiError(500, error.message);
    }

    return new ApiError(500, 'Unknown error occurred');
  }
}