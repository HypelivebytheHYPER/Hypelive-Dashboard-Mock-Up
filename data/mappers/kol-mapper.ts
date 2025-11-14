/**
 * KOL Data Mapper - Transforms between API and domain models
 * Handles data transformation, validation, and business logic mapping
 */

import { KOL, KOLLevel, KOLStats, SocialMedia, ContactInfo, BusinessInfo } from '@/lib/types/kol.types';
import { LarkbaseRecord, LarkbaseTableData } from '@/lib/api/types/api.types';
import { logger } from '@/lib/core/observability/logger';

/**
 * API KOL interface as received from Larkbase
 */
export interface ApiKOL {
  record_id: string;
  kol_id: string;
  nickname: string;
  handle: string;
  profile_image_url?: string;
  follower: number;
  views: number;
  live_gmv: number;
  video_gmv: number;
  live_num: number;
  video_num: number;
  product_count: number;
  engagement_rate?: number;
  quality_score: number;
  levels_of_kols: 'Mega' | 'Macro' | 'Micro' | 'Nano';
  kols_type: string;
  specialization?: string[];
  categories?: string[];
  products?: string[];
  location?: string[];
  tiktok_url: string;
  instagram_url?: string;
  youtube_url?: string;
  x_url?: string;
  facebook_url?: string;
  contact_email?: string;
  contact_phone?: string;
  line_id?: string;
  collaboration_stage?: string;
  internal_contact?: string;
  mcn_agency?: string;
  avg_monthly_gmv?: string;
  avg_live_gmv?: string;
  live_streaming_or_short_video?: string;
  creator_debut_time?: string;
  detailed_information?: string;
  bio_th?: string;
  bio_en?: string;
  created_time?: string;
  updated_time?: string;
}

/**
 * Domain mapper for KOL entities
 */
export class KOLDataMapper {
  /**
   * Transform API record to domain KOL model
   */
  mapSingleRecord(record: LarkbaseRecord): KOL {
    const fields = record.fields as ApiKOL;
    
    try {
      return {
        id: record.record_id,
        kolId: fields.kol_id,
        nickname: fields.nickname,
        handle: fields.handle,
        profileImageUrl: fields.profile_image_url || this.generateAvatarUrl(fields.nickname),
        
        // Metrics
        followers: fields.follower,
        views: fields.views,
        revenue: this.calculateRevenue(fields.live_gmv, fields.video_gmv),
        engagementRate: this.calculateEngagementRate(fields.views, fields.follower, fields.engagement_rate),
        qualityScore: fields.quality_score,
        level: this.mapKOLLevel(fields.levels_of_kols, fields.follower),
        
        // Classifications
        specializations: fields.specialization || [],
        categories: fields.categories || [],
        products: fields.products || [],
        locations: fields.location || [],
        
        // Social Media
        socialMedia: {
          tiktok: fields.tiktok_url,
          instagram: fields.instagram_url,
          youtube: fields.youtube_url,
          twitter: fields.x_url,
          facebook: fields.facebook_url
        },
        
        // Contact Information
        contact: {
          email: fields.contact_email,
          phone: fields.contact_phone,
          lineId: fields.line_id
        },
        
        // Business Information
        businessInfo: {
          collaborationStage: fields.collaboration_stage,
          internalContact: fields.internal_contact,
          mcnAgency: fields.mcn_agency,
          avgMonthlyGMV: fields.avg_monthly_gmv,
          avgLiveGMV: fields.avg_live_gmv,
          contentType: fields.live_streaming_or_short_video
        },
        
        // Additional Info
        bio: {
          th: fields.bio_th,
          en: fields.bio_en
        },
        detailedInformation: fields.detailed_information,
        creatorDebutTime: fields.creator_debut_time,
        
        // Metadata
        createdAt: fields.created_time || record.created_time,
        updatedAt: fields.updated_time || record.updated_time
      };
    } catch (error) {
      logger.error('Failed to map KOL record', { 
        error, 
        recordId: record.record_id,
        fields: Object.keys(fields) 
      });
      throw new Error(`Failed to map KOL record: ${record.record_id}`);
    }
  }

  /**
   * Transform paginated API response to domain model
   */
  mapPaginatedResponse(data: LarkbaseTableData): PaginatedResponse<KOL> {
    const items = data.items.map(record => this.mapSingleRecord(record));
    
    return {
      items,
      total: data.total,
      page: 1, // Will be calculated from page_token
      limit: items.length,
      totalPages: Math.ceil(data.total / items.length),
      hasNext: data.has_more,
      hasPrev: false // Will be calculated based on page_token
    };
  }

  /**
   * Transform API stats to domain stats
   */
  mapStats(data: any): KOLStats {
    return {
      totalKOLs: data.total_kols || 0,
      totalRevenue: data.total_revenue || 0,
      avgEngagement: data.avg_engagement_rate || 0,
      activeCollabs: data.active_collaborations || 0,
      growthPercent: data.growth_percent || 0,
      revenueGrowth: data.revenue_growth || 0,
      sampleSize: data.sample_size || 0,
      
      // Additional calculated metrics
      megaKOLs: data.mega_kols || 0,
      macroKOLs: data.macro_kols || 0,
      microKOLs: data.micro_kols || 0,
      nanoKOLs: data.nano_kols || 0,
      
      // Platform distribution
      platformDistribution: {
        tiktok: data.tiktok_count || 0,
        instagram: data.instagram_count || 0,
        youtube: data.youtube_count || 0,
        facebook: data.facebook_count || 0
      },
      
      // Location distribution
      locationDistribution: data.location_distribution || {},
      
      // Specialization distribution
      specializationDistribution: data.specialization_distribution || {}
    };
  }

  /**
   * Transform domain model to API format for create/update operations
   */
  mapToApiFormat(kol: Partial<KOL>): Record<string, unknown> {
    return {
      kol_id: kol.kolId,
      nickname: kol.nickname,
      handle: kol.handle,
      profile_image_url: kol.profileImageUrl,
      follower: kol.followers,
      views: kol.views,
      live_gmv: kol.businessInfo?.avgLiveGMV ? this.parseGMV(kol.businessInfo.avgLiveGMV) : 0,
      video_gmv: 0, // Will be calculated
      live_num: 0, // Will be calculated
      video_num: 0, // Will be calculated
      product_count: kol.products?.length || 0,
      quality_score: kol.qualityScore,
      levels_of_kols: this.mapLevelToApi(kol.level),
      kols_type: this.mapTypeToApi(kol.level),
      specialization: kol.specializations,
      categories: kol.categories,
      products: kol.products,
      location: kol.locations,
      tiktok_url: kol.socialMedia?.tiktok,
      instagram_url: kol.socialMedia?.instagram,
      youtube_url: kol.socialMedia?.youtube,
      x_url: kol.socialMedia?.twitter,
      facebook_url: kol.socialMedia?.facebook,
      contact_email: kol.contact?.email,
      contact_phone: kol.contact?.phone,
      line_id: kol.contact?.lineId,
      collaboration_stage: kol.businessInfo?.collaborationStage,
      internal_contact: kol.businessInfo?.internalContact,
      mcn_agency: kol.businessInfo?.mcnAgency,
      avg_monthly_gmv: kol.businessInfo?.avgMonthlyGMV,
      avg_live_gmv: kol.businessInfo?.avgLiveGMV,
      live_streaming_or_short_video: kol.businessInfo?.contentType,
      bio_th: kol.bio?.th,
      bio_en: kol.bio?.en,
      detailed_information: kol.detailedInformation
    };
  }

  /**
   * Calculate total revenue from live and video GMV
   */
  private calculateRevenue(liveGMV: number, videoGMV: number): number {
    return (liveGMV || 0) + (videoGMV || 0);
  }

  /**
   * Calculate engagement rate with fallback to provided rate
   */
  private calculateEngagementRate(views: number, followers: number, providedRate?: number): number {
    if (providedRate && providedRate > 0) {
      return providedRate;
    }
    
    if (followers > 0) {
      return (views / followers) * 100;
    }
    
    return 0;
  }

  /**
   * Map KOL level from API format to domain format
   */
  private mapKOLLevel(apiLevel: string, followers: number): KOLLevel {
    // Use provided level if valid
    const levelMap: Record<string, KOLLevel> = {
      'Mega': 'mega',
      'Macro': 'macro', 
      'Micro': 'micro',
      'Nano': 'nano'
    };

    if (levelMap[apiLevel]) {
      return levelMap[apiLevel];
    }

    // Calculate based on followers if level is invalid
    if (followers >= 1000000) return 'mega';
    if (followers >= 100000) return 'macro';
    if (followers >= 10000) return 'micro';
    return 'nano';
  }

  /**
   * Map level back to API format
   */
  private mapLevelToApi(level: KOLLevel): string {
    const levelMap: Record<KOLLevel, string> = {
      'mega': 'Mega',
      'macro': 'Macro',
      'micro': 'Micro', 
      'nano': 'Nano'
    };

    return levelMap[level] || 'Nano';
  }

  /**
   * Map level to KOL type
   */
  private mapTypeToApi(level: KOLLevel): string {
    const typeMap: Record<KOLLevel, string> = {
      'mega': 'Mega Creator',
      'macro': 'Macro Creator',
      'micro': 'Micro Creator',
      'nano': 'Nano Creator'
    };

    return typeMap[level] || 'Creator';
  }

  /**
   * Parse GMV string to number
   */
  private parseGMV(gmvString: string): number {
    if (!gmvString) return 0;
    
    // Remove currency symbols and convert to number
    const cleaned = gmvString.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
  }

  /**
   * Generate avatar URL from nickname
   */
  private generateAvatarUrl(nickname: string): string {
    // Use a placeholder avatar service or generate initials
    const initials = nickname
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
  }

  /**
   * Batch transform multiple records
   */
  mapMultipleRecords(records: LarkbaseRecord[]): KOL[] {
    return records.map(record => this.mapSingleRecord(record));
  }

  /**
   * Transform API error to domain error
   */
  mapError(error: any): Error {
    if (error.code) {
      return new Error(`Larkbase API Error ${error.code}: ${error.msg}`);
    }
    
    return new Error(`Mapping Error: ${error.message}`);
  }

  /**
   * Validate KOL data before mapping
   */
  validateKOLData(data: Partial<ApiKOL>): string[] {
    const errors: string[] = [];

    if (!data.kol_id) errors.push('KOL ID is required');
    if (!data.nickname) errors.push('Nickname is required');
    if (!data.handle) errors.push('Handle is required');
    if (data.follower === undefined || data.follower < 0) errors.push('Valid follower count is required');
    if (data.quality_score === undefined || data.quality_score < 0 || data.quality_score > 5) {
      errors.push('Quality score must be between 0 and 5');
    }

    return errors;
  }

  /**
   * Extract insights from KOL data
   */
  extractInsights(kol: KOL): Record<string, unknown> {
    return {
      engagementQuality: this.calculateEngagementQuality(kol.engagementRate),
      revenuePerFollower: kol.followers > 0 ? kol.revenue / kol.followers : 0,
      platformDominance: this.calculatePlatformDominance(kol.socialMedia),
      collaborationReadiness: this.assessCollaborationReadiness(kol),
      contentStrategy: this.analyzeContentStrategy(kol)
    };
  }

  /**
   * Calculate engagement quality score
   */
  private calculateEngagementQuality(engagementRate: number): 'poor' | 'average' | 'good' | 'excellent' {
    if (engagementRate >= 10) return 'excellent';
    if (engagementRate >= 5) return 'good';
    if (engagementRate >= 2) return 'average';
    return 'poor';
  }

  /**
   * Calculate platform dominance
   */
  private calculatePlatformDominance(socialMedia: SocialMedia): Record<string, number> {
    const platforms = Object.values(socialMedia).filter(Boolean);
    const total = platforms.length;
    
    return {
      tiktok: socialMedia.tiktok ? 1 / total : 0,
      instagram: socialMedia.instagram ? 1 / total : 0,
      youtube: socialMedia.youtube ? 1 / total : 0,
      facebook: socialMedia.facebook ? 1 / total : 0,
      twitter: socialMedia.twitter ? 1 / total : 0
    };
  }

  /**
   * Assess collaboration readiness
   */
  private assessCollaborationReadiness(kol: KOL): 'ready' | 'interested' | 'not-ready' {
    if (kol.businessInfo?.collaborationStage && 
        ['GMV', 'Sales', 'Sample'].includes(kol.businessInfo.collaborationStage)) {
      return 'ready';
    }
    
    if (kol.businessInfo?.collaborationStage === 'Contacted') {
      return 'interested';
    }
    
    return 'not-ready';
  }

  /**
   * Analyze content strategy
   */
  private analyzeContentStrategy(kol: KOL): 'live-focused' | 'video-focused' | 'balanced' {
    // This would require additional data about content types
    // For now, return based on GMV distribution
    const liveGMV = kol.revenue * 0.7; // Assume 70% from live
    const videoGMV = kol.revenue * 0.3; // Assume 30% from video
    
    if (liveGMV > videoGMV * 2) return 'live-focused';
    if (videoGMV > liveGMV * 2) return 'video-focused';
    return 'balanced';
  }
}

export const kolDataMapper = new KOLDataMapper();