/**
 * Campaign Repository
 * Data access layer for campaign operations
 */

import { Campaign, CampaignStatus, PaginatedCampaigns, CampaignStats, CampaignTemplate } from '@/lib/types/campaign.types';
import { PaginatedRequest } from '@/lib/api/types/api.types';
import { apiClient } from '../client/api-client.server';
import { logger } from '@/lib/core/observability/logger';

/**
 * Type definitions for Larkbase integration
 */
interface LarkbaseRecord {
  record_id: string;
  fields: Record<string, unknown>;
  created_time: number;
  last_modified_time: number;
}

interface LarkbaseFilterCondition {
  field_name: string;
  operator: 'is' | 'isNot' | 'contains' | 'doesNotContain' | 'isEmpty' | 'isNotEmpty';
  value: unknown[];
}

interface LarkbaseFilter {
  conjunction: 'and' | 'or';
  conditions: LarkbaseFilterCondition[];
}

interface LarkbaseFields {
  name?: string;
  description?: string;
  objective?: string;
  status?: CampaignStatus;
  budget?: number;
  start_date?: string;
  end_date?: string;
  target_kol_count?: number;
  platforms?: string;
  content_types?: string;
  tags?: string;
  metrics?: string;
}

// Larkbase table IDs
const TABLES = {
  CAMPAIGNS: 'tbldcqoLHjrdN1vM',
  CAMPAIGN_TEMPLATES: 'tblMM5mBcbxzEiJ2',
  CAMPAIGN_ANALYTICS: 'tbl8rJWSTEemTeJh'
} as const;

export class CampaignRepository {
  /**
   * Find campaigns with pagination and filters
   */
  async findActiveCampaigns(options: PaginatedRequest & { status?: CampaignStatus }): Promise<PaginatedCampaigns> {
    try {
      logger.debug('Finding active campaigns', options);

      const filter = this.buildCampaignFilter(options);
      const params = {
        page_size: options.limit || 10,
        page_token: options.page ? String(options.page) : undefined,
        ...(filter && { filter: JSON.stringify(filter) })
      };

      const response = await apiClient.get(`/bitable/${TABLES.CAMPAIGNS}/records`, { params });
      
      if (response.code !== 0) {
        throw new Error(response.msg);
      }

      const campaigns = response.data.items.map(this.mapCampaignRecord);
      
      return {
        items: campaigns,
        total: response.data.total,
        page: options.page || 1,
        limit: options.limit || 10,
        totalPages: Math.ceil(response.data.total / (options.limit || 10)),
        hasNext: response.data.has_more,
        hasPrev: (options.page || 1) > 1
      };
    } catch (error) {
      logger.error('Failed to find active campaigns', { error, options });
      throw error;
    }
  }

  /**
   * Find campaign by ID
   */
  async findById(id: string): Promise<Campaign | null> {
    try {
      logger.debug('Finding campaign by ID', { campaignId: id });

      const response = await apiClient.get(`/bitable/${TABLES.CAMPAIGNS}/records/${id}`);
      
      if (response.code === 404) {
        return null;
      }
      
      if (response.code !== 0) {
        throw new Error(response.msg);
      }

      const campaign = this.mapCampaignRecord(response.data);
      logger.debug('Campaign found', { campaignId: id });
      
      return campaign;
    } catch (error) {
      logger.error('Failed to find campaign by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create new campaign
   */
  async create(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
    try {
      logger.info('Creating campaign', { campaignName: campaign.name });

      const campaignData = this.mapToApiFormat(campaign);
      
      const response = await apiClient.post(`/bitable/${TABLES.CAMPAIGNS}/records`, {
        fields: campaignData
      });

      if (response.code !== 0) {
        throw new Error(response.msg);
      }

      const created = this.mapCampaignRecord(response.data);
      logger.info('Campaign created successfully', { campaignId: created.id });
      
      return created;
    } catch (error) {
      logger.error('Failed to create campaign', { error, campaign });
      throw error;
    }
  }

  /**
   * Update campaign
   */
  async update(id: string, data: Partial<Campaign>): Promise<Campaign> {
    try {
      logger.info('Updating campaign', { campaignId: id });

      const updateData = this.mapToApiFormat(data);
      
      const response = await apiClient.patch(`/bitable/${TABLES.CAMPAIGNS}/records/${id}`, {
        fields: updateData
      });

      if (response.code !== 0) {
        throw new Error(response.msg);
      }

      const updated = this.mapCampaignRecord(response.data);
      logger.info('Campaign updated successfully', { campaignId: id });
      
      return updated;
    } catch (error) {
      logger.error('Failed to update campaign', { error, id, data });
      throw error;
    }
  }

  /**
   * Update campaign status
   */
  async updateStatus(id: string, status: CampaignStatus): Promise<Campaign> {
    try {
      logger.info('Updating campaign status', { campaignId: id, status });

      const response = await apiClient.patch(`/bitable/${TABLES.CAMPAIGNS}/records/${id}`, {
        fields: { status }
      });

      if (response.code !== 0) {
        throw new Error(response.msg);
      }

      const updated = this.mapCampaignRecord(response.data);
      logger.info('Campaign status updated successfully', { campaignId: id, status });
      
      return updated;
    } catch (error) {
      logger.error('Failed to update campaign status', { error, id, status });
      throw error;
    }
  }

  /**
   * Delete campaign
   */
  async delete(id: string): Promise<void> {
    try {
      logger.info('Deleting campaign', { campaignId: id });

      const response = await apiClient.delete(`/bitable/${TABLES.CAMPAIGNS}/records/${id}`);

      if (response.code !== 0) {
        throw new Error(response.msg);
      }

      logger.info('Campaign deleted successfully', { campaignId: id });
    } catch (error) {
      logger.error('Failed to delete campaign', { error, id });
      throw error;
    }
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(): Promise<{
    activeCampaigns: number;
    totalRevenue: number;
    engagedKOLs: number;
    avgROI: number;
    historicalData: HistoricalCampaignData;
  }> {
    try {
      logger.debug('Getting campaign statistics');

      // Get active campaigns count
      const activeResponse = await apiClient.get(`/bitable/${TABLES.CAMPAIGNS}/records/search`, {
        params: {
          filter: JSON.stringify({
            field_name: 'status',
            operator: 'is',
            value: ['active']
          })
        }
      });

      // Get total campaigns for revenue calculation
      const totalResponse = await apiClient.get(`/bitable/${TABLES.CAMPAIGNS}/records`, {
        params: { page_size: 1 }
      });

      // Get historical data (simplified - in real implementation would be more complex)
      const historicalData = await this.getHistoricalStats(30);

      return {
        activeCampaigns: activeResponse.data?.total || 0,
        totalRevenue: this.calculateTotalRevenue(totalResponse.data?.total || 0),
        engagedKOLs: this.calculateEngagedKOLs(),
        avgROI: this.calculateAverageROI(),
        historicalData
      };
    } catch (error) {
      logger.error('Failed to get campaign statistics', { error });
      throw error;
    }
  }

  /**
   * Get campaign templates
   */
  async getTemplates(): Promise<CampaignTemplate[]> {
    try {
      logger.debug('Getting campaign templates');

      const response = await apiClient.get(`/bitable/${TABLES.CAMPAIGN_TEMPLATES}/records`, {
        params: {
          filter: JSON.stringify({
            field_name: 'is_active',
            operator: 'is',
            value: ['true']
          })
        }
      });

      if (response.code !== 0) {
        throw new Error(response.msg);
      }

      const templates = response.data.items.map(this.mapTemplateRecord);
      logger.debug('Campaign templates retrieved', { count: templates.length });
      
      return templates;
    } catch (error) {
      logger.error('Failed to get campaign templates', { error });
      throw error;
    }
  }

  /**
   * Count active campaigns
   */
  async countActiveCampaigns(): Promise<number> {
    try {
      const response = await apiClient.get(`/bitable/${TABLES.CAMPAIGNS}/records/search`, {
        params: {
          filter: JSON.stringify({
            field_name: 'status',
            operator: 'is',
            value: ['active']
          })
        }
      });

      return response.data?.total || 0;
    } catch (error) {
      logger.error('Failed to count active campaigns', { error });
      throw error;
    }
  }

  /**
   * Get total revenue
   */
  async getTotalRevenue(): Promise<number> {
    try {
      // This would be calculated from campaign analytics
      // For now, return mock data
      return 1250000; // 1.25M THB
    } catch (error) {
      logger.error('Failed to get total revenue', { error });
      throw error;
    }
  }

  /**
   * Get average ROI
   */
  async getAverageROI(): Promise<number> {
    try {
      // This would be calculated from campaign performance data
      // For now, return mock data
      return 285; // 285% average ROI
    } catch (error) {
      logger.error('Failed to get average ROI', { error });
      throw error;
    }
  }

  /**
   * Get top performing campaigns
   */
  async getTopPerformingCampaigns(limit: number): Promise<Array<{ id: string; name: string; roi: number; revenue: number }>> {
    try {
      // This would be calculated from campaign performance data
      // For now, return mock data
      return [
        { id: 'CMP001', name: 'Summer Beauty Campaign', roi: 450, revenue: 250000 },
        { id: 'CMP002', name: 'Tech Product Launch', roi: 380, revenue: 180000 },
        { id: 'CMP003', name: 'Fashion Week Promotion', roi: 320, revenue: 150000 },
        { id: 'CMP004', name: 'Food Festival Campaign', roi: 290, revenue: 120000 },
        { id: 'CMP005', name: 'Travel Season Push', roi: 275, revenue: 95000 }
      ];
    } catch (error) {
      logger.error('Failed to get top performing campaigns', { error });
      throw error;
    }
  }

  /**
   * Get historical statistics
   */
  async getHistoricalStats(days: number): Promise<HistoricalCampaignData> {
    try {
      // This would calculate historical data for the specified period
      // For now, return mock data
      return {
        current: {
          campaigns: 45,
          revenue: 1250000,
          kols: 156,
          roi: 285,
          conversionRate: 3.2,
          avgDuration: 30
        },
        previous: {
          campaigns: 40,
          revenue: 1080000,
          kols: 142,
          roi: 245,
          conversionRate: 2.8,
          avgDuration: 28
        }
      };
    } catch (error) {
      logger.error('Failed to get historical statistics', { error });
      throw error;
    }
  }

  /**
   * Get campaign KOLs
   */
  async getCampaignKOLs(campaignId: string): Promise<Array<{ id: string; name: string; platform: string }>> {
    try {
      logger.debug('Getting campaign KOLs', { campaignId });

      // This would fetch KOLs associated with the campaign
      // For now, return empty array
      return [];
    } catch (error) {
      logger.error('Failed to get campaign KOLs', { error, campaignId });
      throw error;
    }
  }

  // Private helper methods

  /**
   * Build filter conditions for campaign queries
   * @param options - Filter options with status
   * @returns Filter object or null if no conditions
   */
  private buildCampaignFilter(options: { status?: CampaignStatus }): LarkbaseFilter | null {
    const conditions: LarkbaseFilterCondition[] = [];

    if (options.status) {
      conditions.push({
        field_name: 'status',
        operator: 'is',
        value: [options.status]
      });
    }

    if (conditions.length === 0) return null;

    return {
      conjunction: 'and',
      conditions
    };
  }

  /**
   * Map Larkbase record to Campaign entity
   * @param record - Raw Larkbase record
   * @returns Typed Campaign object
   */
  private mapCampaignRecord(record: LarkbaseRecord): Campaign {
    const fields = record.fields;
    
    return {
      id: record.record_id,
      name: fields.name || '',
      description: fields.description || '',
      objective: fields.objective || 'brand_awareness',
      status: fields.status || 'draft',
      organization_id: fields.organization_id || '',
      created_by: fields.created_by || '',
      start_date: fields.start_date || '',
      end_date: fields.end_date || '',
      budget: Number(fields.budget) || 0,
      currency: fields.currency || 'THB',
      spent_budget: Number(fields.spent_budget) || 0,
      progress: Number(fields.progress) || 0,
      target_audience: fields.target_audience ? JSON.parse(fields.target_audience) : {},
      selected_kols: fields.selected_kols ? JSON.parse(fields.selected_kols) : [],
      content_requirements: fields.content_requirements ? JSON.parse(fields.content_requirements) : [],
      deliverables: fields.deliverables ? JSON.parse(fields.deliverables) : [],
      created_at: record.created_time,
      updated_at: record.updated_time,
      completed_at: fields.completed_at
    };
  }

  /**
   * Map Larkbase record to CampaignTemplate entity
   * @param record - Raw Larkbase record
   * @returns Typed CampaignTemplate object
   */
  private mapTemplateRecord(record: LarkbaseRecord): CampaignTemplate {
    const fields = record.fields;
    
    return {
      id: record.record_id,
      name: fields.name || '',
      description: fields.description || '',
      category: fields.category || '',
      objective: fields.objective || 'brand_awareness',
      usage_count: Number(fields.usage_count) || 0,
      average_roi: Number(fields.average_roi) || 0,
      success_rate: Number(fields.success_rate) || 0,
      created_by: fields.created_by || '',
      created_at: record.created_time,
      is_active: fields.is_active === 'true',
      tags: fields.tags ? JSON.parse(fields.tags) : []
    };
  }

  /**
   * Transform Campaign entity to Larkbase API format
   * @param campaign - Partial Campaign object
   * @returns Record with Larkbase field names
   */
  private mapToApiFormat(campaign: Partial<Campaign>): LarkbaseFields {
    return {
      name: campaign.name,
      description: campaign.description,
      objective: campaign.objective,
      status: campaign.status,
      organization_id: campaign.organization_id,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      budget: campaign.budget,
      currency: campaign.currency,
      spent_budget: campaign.spent_budget,
      progress: campaign.progress,
      target_audience: campaign.target_audience ? JSON.stringify(campaign.target_audience) : undefined,
      selected_kols: campaign.selected_kols ? JSON.stringify(campaign.selected_kols) : undefined,
      content_requirements: campaign.content_requirements ? JSON.stringify(campaign.content_requirements) : undefined,
      deliverables: campaign.deliverables ? JSON.stringify(campaign.deliverables) : undefined,
      completed_at: campaign.completed_at
    };
  }

  private calculateTotalRevenue(totalCampaigns: number): number {
    // Mock calculation - replace with real logic
    return totalCampaigns * 25000;
  }

  private calculateEngagedKOLs(): number {
    // Mock calculation - replace with real logic
    return 156;
  }

  private calculateAverageROI(): number {
    // Mock calculation - replace with real logic
    return 285;
  }
}

// Historical data interface
interface HistoricalCampaignData {
  current: {
    campaigns: number;
    revenue: number;
    kols: number;
    roi: number;
    conversionRate: number;
    avgDuration: number;
  };
  previous: {
    campaigns: number;
    revenue: number;
    kols: number;
    roi: number;
    conversionRate: number;
    avgDuration: number;
  };
}

export const campaignRepository = new CampaignRepository();