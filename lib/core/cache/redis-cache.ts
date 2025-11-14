/**
 * Redis Cache Implementation
 * High-performance caching with tag-based invalidation
 */

import { CacheService, CacheOptions } from '@/lib/api/types/api.types';
import { createClient, RedisClientType } from 'redis';
import { logger } from '@/lib/core/observability/logger';

export interface RedisCacheConfig {
  url: string;
  password?: string;
  db?: number;
  keyPrefix?: string;
  defaultTTL?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export class RedisCache implements CacheService {
  private client: RedisClientType;
  private config: Required<RedisCacheConfig>;
  private isConnected: boolean = false;

  constructor(config: RedisCacheConfig) {
    this.config = {
      db: 0,
      keyPrefix: 'hypelive:',
      defaultTTL: 300, // 5 minutes
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    };

    this.client = createClient({
      url: this.config.url,
      password: this.config.password,
      database: this.config.db,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > this.config.maxRetries) {
            logger.error('Redis max retries exceeded');
            return new Error('Max retries exceeded');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    this.setupEventHandlers();
  }

  /**
   * Connect to Redis server
   */
  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      await this.client.connect();
      this.isConnected = true;
      logger.info('Redis cache connected successfully');
    } catch (error) {
      logger.error('Failed to connect to Redis', { error });
      throw error;
    }
  }

  /**
   * Disconnect from Redis server
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.client.disconnect();
      this.isConnected = false;
      logger.info('Redis cache disconnected');
    } catch (error) {
      logger.error('Error disconnecting from Redis', { error });
      throw error;
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.buildKey(key);
    
    try {
      const value = await this.client.get(fullKey);
      
      if (value === null) {
        logger.debug('Cache miss', { key: fullKey });
        return null;
      }

      logger.debug('Cache hit', { key: fullKey });
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Cache get error', { key: fullKey, error });
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const fullKey = this.buildKey(key);
    const ttl = options?.ttl ?? this.config.defaultTTL;
    
    try {
      const serialized = JSON.stringify(value);
      
      if (ttl > 0) {
        await this.client.setEx(fullKey, ttl, serialized);
      } else {
        await this.client.set(fullKey, serialized);
      }

      // Add to tag index if tags are provided
      if (options?.tags && options.tags.length > 0) {
        await this.addToTagIndex(fullKey, options.tags);
      }

      logger.debug('Cache set successful', { 
        key: fullKey, 
        ttl,
        tags: options?.tags 
      });
    } catch (error) {
      logger.error('Cache set error', { key: fullKey, error });
      // Don't throw - cache failures shouldn't break the app
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    const fullKey = this.buildKey(key);
    
    try {
      await this.client.del(fullKey);
      logger.debug('Cache delete successful', { key: fullKey });
    } catch (error) {
      logger.error('Cache delete error', { key: fullKey, error });
    }
  }

  /**
   * Invalidate cache entries by tags
   */
  async invalidateByTags(tags: string[]): Promise<void> {
    try {
      const keysToDelete: string[] = [];
      
      // Get all keys associated with the tags
      for (const tag of tags) {
        const tagKey = this.buildTagKey(tag);
        const taggedKeys = await this.client.sMembers(tagKey);
        keysToDelete.push(...taggedKeys);
        
        // Clean up the tag set
        if (taggedKeys.length > 0) {
          await this.client.sRem(tagKey, taggedKeys);
        }
      }

      // Remove duplicate keys
      const uniqueKeys = [...new Set(keysToDelete)];
      
      if (uniqueKeys.length > 0) {
        await this.client.del(uniqueKeys);
        logger.info('Cache invalidation by tags', { 
          tags,
          keysDeleted: uniqueKeys.length 
        });
      }
    } catch (error) {
      logger.error('Cache invalidation error', { tags, error });
    }
  }

  /**
   * Get multiple values from cache
   */
  async getMany<T>(keys: string[]): Promise<Array<T | null>> {
    const fullKeys = keys.map(key => this.buildKey(key));
    
    try {
      const values = await this.client.mGet(fullKeys);
      
      return values.map(value => 
        value ? JSON.parse(value) as T : null
      );
    } catch (error) {
      logger.error('Cache getMany error', { keys: fullKeys, error });
      return new Array(keys.length).fill(null);
    }
  }

  /**
   * Set multiple values in cache
   */
  async setMany<T>(entries: Array<{ key: string; value: T; options?: CacheOptions }>): Promise<void> {
    const pipeline = this.client.multi();
    
    try {
      for (const entry of entries) {
        const fullKey = this.buildKey(entry.key);
        const serialized = JSON.stringify(entry.value);
        const ttl = entry.options?.ttl ?? this.config.defaultTTL;
        
        if (ttl > 0) {
          pipeline.setEx(fullKey, ttl, serialized);
        } else {
          pipeline.set(fullKey, serialized);
        }

        // Add to tag index if tags are provided
        if (entry.options?.tags && entry.options.tags.length > 0) {
          this.addToTagIndexInPipeline(pipeline, fullKey, entry.options.tags);
        }
      }

      await pipeline.exec();
      
      logger.debug('Cache setMany successful', { 
        count: entries.length 
      });
    } catch (error) {
      logger.error('Cache setMany error', { error });
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    const fullKey = this.buildKey(key);
    
    try {
      const exists = await this.client.exists(fullKey);
      return exists === 1;
    } catch (error) {
      logger.error('Cache exists error', { key: fullKey, error });
      return false;
    }
  }

  /**
   * Get TTL (time to live) for a key
   */
  async getTTL(key: string): Promise<number> {
    const fullKey = this.buildKey(key);
    
    try {
      const ttl = await this.client.ttl(fullKey);
      return ttl;
    } catch (error) {
      logger.error('Cache getTTL error', { key: fullKey, error });
      return -2; // Key doesn't exist
    }
  }

  /**
   * Increment numeric value
   */
  async increment(key: string, amount = 1): Promise<number> {
    const fullKey = this.buildKey(key);
    
    try {
      const result = await this.client.incrBy(fullKey, amount);
      logger.debug('Cache increment successful', { key: fullKey, amount, result });
      return result;
    } catch (error) {
      logger.error('Cache increment error', { key: fullKey, error });
      throw error;
    }
  }

  /**
   * Decrement numeric value
   */
  async decrement(key: string, amount = 1): Promise<number> {
    const fullKey = this.buildKey(key);
    
    try {
      const result = await this.client.decrBy(fullKey, amount);
      logger.debug('Cache decrement successful', { key: fullKey, amount, result });
      return result;
    } catch (error) {
      logger.error('Cache decrement error', { key: fullKey, error });
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    connected: boolean;
    keyCount: number;
    memoryUsage: number;
    hitRate: number;
  }> {
    try {
      const info = await this.client.info('stats');
      const memory = await this.client.info('memory');
      
      return {
        connected: this.isConnected,
        keyCount: parseInt(info.match(/keyspace_hits:(\d+)/)?.[1] || '0'),
        memoryUsage: parseInt(memory.match(/used_memory:(\d+)/)?.[1] || '0'),
        hitRate: this.calculateHitRate(info)
      };
    } catch (error) {
      logger.error('Failed to get cache stats', { error });
      return {
        connected: this.isConnected,
        keyCount: 0,
        memoryUsage: 0,
        hitRate: 0
      };
    }
  }

  /**
   * Build full cache key with prefix
   */
  private buildKey(key: string): string {
    return `${this.config.keyPrefix}${key}`;
  }

  /**
   * Build tag key
   */
  private buildTagKey(tag: string): string {
    return `${this.config.keyPrefix}tag:${tag}`;
  }

  /**
   * Add key to tag index
   */
  private async addToTagIndex(key: string, tags: string[]): Promise<void> {
    try {
      for (const tag of tags) {
        const tagKey = this.buildTagKey(tag);
        await this.client.sAdd(tagKey, key);
      }
    } catch (error) {
      logger.error('Failed to add to tag index', { key, tags, error });
    }
  }

  /**
   * Add key to tag index in pipeline
   */
  private addToTagIndexInPipeline(pipeline: any, key: string, tags: string[]): void {
    for (const tag of tags) {
      const tagKey = this.buildTagKey(tag);
      pipeline.sAdd(tagKey, key);
    }
  }

  /**
   * Calculate hit rate from Redis info
   */
  private calculateHitRate(info: string): number {
    const hits = parseInt(info.match(/keyspace_hits:(\d+)/)?.[1] || '0');
    const misses = parseInt(info.match(/keyspace_misses:(\d+)/)?.[1] || '0');
    const total = hits + misses;
    
    return total > 0 ? (hits / total) * 100 : 0;
  }

  /**
   * Setup Redis client event handlers
   */
  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      logger.info('Redis client connected');
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      logger.error('Redis client error', { error });
      this.isConnected = false;
    });

    this.client.on('end', () => {
      logger.info('Redis client disconnected');
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis client reconnecting');
    });
  }
}

// Create default cache instance
export const cacheService = new RedisCache({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  keyPrefix: process.env.CACHE_KEY_PREFIX || 'hypelive:',
  defaultTTL: 300 // 5 minutes
});