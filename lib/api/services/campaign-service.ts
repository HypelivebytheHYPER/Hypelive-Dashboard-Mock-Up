/**
 * Campaign Service
 * Business logic for campaign management operations
 */

import { campaignRepository } from '../repositories/campaign-repository';
import { analyticsService } from './analytics-service';
import { logger } from '@/lib/core/observability/logger';
import { Campaign, CampaignFilters, CampaignStats, PaginatedCampaigns } from '@/lib/types/campaign.types';
import { ApiError } from '../types/api.types';

export class CampaignService {
  /**
   * Get campaign statistics for dashboard overview
   */
  async getCampaignStats(): Promise<CampaignStats> {
    try {
      logger.info('Fetching campaign statistics');
      
      const [
        activeCampaigns,
        totalRevenue,
        engagedKOLs,
        avgROI,
        historicalData
      ] = await Promise.all([
        campaignRepository.countActiveCampaigns(),
        campaignRepository.getTotalRevenue(),
        campaignRepository.countEngagedKOLs(),
        campaignRepository.getAverageROI(),
        campaignRepository.getHistoricalStats(30) // 30 days
      ]);

      const stats: CampaignStats = {
        activeCampaigns,
        totalRevenue,
        engagedKOLs,
        avgROI,
        campaignsGrowth: this.calculateGrowth(historicalData.current.campaigns, historicalData.previous.campaigns),
        revenueGrowth: this.calculateGrowth(historicalData.current.revenue, historicalData.previous.revenue),
        kolGrowth: this.calculateGrowth(historicalData.current.kols, historicalData.previous.kols),
        roiGrowth: this.calculateGrowth(historicalData.current.roi, historicalData.previous.roi),
        conversionRate: historicalData.current.conversionRate,
        avgCampaignDuration: historicalData.current.avgDuration,
        topPerformingCampaigns: await campaignRepository.getTopPerformingCampaigns(5),
        recentActivity: await campaignRepository.getRecentActivity(10)
      };

      logger.info('Campaign statistics retrieved successfully', stats);
      return stats;
    } catch (error) {
      logger.error('Failed to fetch campaign statistics', { error });
      throw new ApiError(500, 'Failed to fetch campaign statistics');
    }
  }

  /**
   * Get active campaigns with pagination and filtering
   */
  async getActiveCampaigns(options: {
    page: number;
    limit: number;
    status?: CampaignStatus;
  }): Promise<PaginatedCampaigns> {
    try {
      logger.info('Fetching active campaigns', options);
      
      const campaigns = await campaignRepository.findActiveCampaigns(options);
      
      // Enrich campaigns with analytics data
      const enrichedCampaigns = await Promise.all(
        campaigns.items.map(async (campaign) => {
          const analytics = await analyticsService.getCampaignAnalytics(campaign.id);
          return {
            ...campaign,
            engagementRate: analytics.engagementRate,
            roi: analytics.roi,
            progress: this.calculateCampaignProgress(campaign),
            kolCount: campaign.kols?.length || 0,
            spentBudget: analytics.totalSpent
          };
        })
      );

      return {
        ...campaigns,
        items: enrichedCampaigns
      };
    } catch (error) {
      logger.error('Failed to fetch active campaigns', { error, options });
      throw new ApiError(500, 'Failed to fetch active campaigns');
    }
  }

  /**
   * Get campaign by ID with full details
   */
  async getCampaignById(id: string): Promise<Campaign> {
    try {
      logger.info('Fetching campaign by ID', { campaignId: id });
      
      const campaign = await campaignRepository.findById(id);
      if (!campaign) {
        throw new ApiError(404, 'Campaign not found');
      }

      // Enrich with analytics and related data
      const [analytics, performance, kols] = await Promise.all([
        analyticsService.getCampaignAnalytics(id),
        analyticsService.getCampaignPerformance(id),
        campaignRepository.getCampaignKOLs(id)
      ]);

      return {
        ...campaign,
        analytics,
        performance,
        kols
      };
    } catch (error) {
      logger.error('Failed to fetch campaign by ID', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to fetch campaign');
    }
  }

  /**
   * Create new campaign
   */
  async createCampaign(data: CreateCampaignDto): Promise<Campaign> {
    try {
      logger.info('Creating new campaign', { campaignData: data });
      
      // Validate campaign data
      this.validateCampaignData(data);

      // Generate campaign ID and initial setup
      const campaignData = {
        ...data,
        id: this.generateCampaignId(),
        status: 'draft' as CampaignStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0
      };

      const campaign = await campaignRepository.create(campaignData);
      
      logger.info('Campaign created successfully', { campaignId: campaign.id });
      return campaign;
    } catch (error) {
      logger.error('Failed to create campaign', { error, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to create campaign');
    }
  }

  /**
   * Update campaign
   */
  async updateCampaign(id: string, data: UpdateCampaignDto): Promise<Campaign> {
    try {
      logger.info('Updating campaign', { campaignId: id, updateData: data });
      
      // Validate update data
      if (data.budget && data.budget < 0) {
        throw new ApiError(400, 'Budget cannot be negative');
      }

      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      const campaign = await campaignRepository.update(id, updateData);
      
      logger.info('Campaign updated successfully', { campaignId: id });
      return campaign;
    } catch (error) {
      logger.error('Failed to update campaign', { error, id, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to update campaign');
    }
  }

  /**
   * Update campaign status
   */
  async updateCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign> {
    try {
      logger.info('Updating campaign status', { campaignId: id, status });
      
      // Validate status transition
      const currentCampaign = await campaignRepository.findById(id);
      if (!currentCampaign) {
        throw new ApiError(404, 'Campaign not found');
      }

      this.validateStatusTransition(currentCampaign.status, status);

      const campaign = await campaignRepository.updateStatus(id, status);
      
      logger.info('Campaign status updated successfully', { campaignId: id, status });
      return campaign;
    } catch (error) {
      logger.error('Failed to update campaign status', { error, id, status });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to update campaign status');
    }
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(id: string): Promise<void> {
    try {
      logger.info('Deleting campaign', { campaignId: id });
      
      const campaign = await campaignRepository.findById(id);
      if (!campaign) {
        throw new ApiError(404, 'Campaign not found');
      }

      // Check if campaign can be deleted
      if (campaign.status === 'active') {
        throw new ApiError(400, 'Cannot delete active campaign. Please pause or complete it first.');
      }

      await campaignRepository.delete(id);
      
      logger.info('Campaign deleted successfully', { campaignId: id });
    } catch (error) {
      logger.error('Failed to delete campaign', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to delete campaign');
    }
  }

  /**
   * Get campaign templates
   */
  async getCampaignTemplates(): Promise<CampaignTemplate[]> {
    try {
      logger.info('Fetching campaign templates');
      
      const templates = await campaignRepository.getTemplates();
      
      logger.info('Campaign templates retrieved successfully', { count: templates.length });
      return templates;
    } catch (error) {
      logger.error('Failed to fetch campaign templates', { error });
      throw new ApiError(500, 'Failed to fetch campaign templates');
    }
  }

  /**
   * Duplicate campaign
   */
  async duplicateCampaign(id: string): Promise<Campaign> {
    try {
      logger.info('Duplicating campaign', { sourceCampaignId: id });
      
      const original = await this.getCampaignById(id);
      
      const duplicatedData: CreateCampaignDto = {
        name: `${original.name} (Copy)`,
        description: original.description,
        objective: original.objective,
        budget: original.budget,
        startDate: original.startDate,
        endDate: original.endDate,
        targetAudience: original.targetAudience,
        kols: [], // Don't duplicate KOL assignments
        contentRequirements: original.contentRequirements,
        deliverables: original.deliverables,
        templateId: original.templateId
      };

      const duplicated = await this.createCampaign(duplicatedData);
      
      logger.info('Campaign duplicated successfully', { 
        originalId: id, 
        newId: duplicated.id 
      });
      
      return duplicated;
    } catch (error) {
      logger.error('Failed to duplicate campaign', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to duplicate campaign');
    }
  }

  // Private helper methods

  private validateCampaignData(data: CreateCampaignDto): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new ApiError(400, 'Campaign name is required');
    }

    if (!data.budget || data.budget <= 0) {
      throw new ApiError(400, 'Campaign budget must be greater than 0');
    }

    if (!data.startDate || !data.endDate) {
      throw new ApiError(400, 'Campaign start and end dates are required');
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    if (startDate >= endDate) {
      throw new ApiError(400, 'Campaign end date must be after start date');
    }

    if (startDate < new Date()) {
      throw new ApiError(400, 'Campaign start date cannot be in the past');
    }
  }

  private validateStatusTransition(currentStatus: CampaignStatus, newStatus: CampaignStatus): void {
    const allowedTransitions: Record<CampaignStatus, CampaignStatus[]> = {
      draft: ['active', 'cancelled'],
      active: ['paused', 'completed', 'cancelled'],
      paused: ['active', 'cancelled'],
      completed: [], // Cannot change from completed
      cancelled: [] // Cannot change from cancelled
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new ApiError(400, `Cannot transition from ${currentStatus} to ${newStatus}`);
    }
  }

  private calculateCampaignProgress(campaign: Campaign): number {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    
    if (now < start) return 0;
    if (now >= end) return 100;
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    return Math.round((elapsed / totalDuration) * 100);
  }

  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  private generateCampaignId(): string {
    return `CMP${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
}

export const campaignService = new CampaignService();