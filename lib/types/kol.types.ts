/**
 * KOL (Key Opinion Leader) Type Definitions
 * Comprehensive type definitions for influencer management system
 */

// Base KOL Types
export type KOLLevel = 'mega' | 'macro' | 'micro' | 'nano';

export type KOLType = 'creator' | 'seller' | 'live-creator' | 'brand-ambassador';

export type CollaborationStage = 
  | 'contacted' 
  | 'sample' 
  | 'sales' 
  | 'gmv' 
  | 'completed' 
  | 'cancelled';

export type ContentType = 'live-streaming' | 'short-video' | 'long-video' | 'post' | 'story';

export type PlatformType = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'twitter' | 'line';

// Social Media Type
export interface SocialMedia {
  tiktok?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
  line?: string;
}

// Contact Information
export interface ContactInfo {
  email?: string;
  phone?: string;
  lineId?: string;
  wechat?: string;
  whatsapp?: string;
}

// Business Information
export interface BusinessInfo {
  collaborationStage?: CollaborationStage;
  internalContact?: string;
  mcnAgency?: string;
  avgMonthlyGMV?: string;
  avgLiveGMV?: string;
  contentType?: ContentType;
  rateCard?: RateCard;
  availability?: 'available' | 'busy' | 'unavailable';
  preferredContent?: ContentType[];
  brandSafetyScore?: number;
}

// Rate Card
export interface RateCard {
  liveStreaming?: Rate;
  shortVideo?: Rate;
  longVideo?: Rate;
  post?: Rate;
  story?: Rate;
  monthlyPackage?: Rate;
}

export interface Rate {
  baseRate: number;
  clientRate: number;
  currency: string;
  duration?: string;
  conditions?: string[];
}

// Performance Metrics
export interface KOLMetrics {
  followers: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;
  reach: number;
  impressions: number;
  
  // Revenue metrics
  revenue: number;
  liveGMV: number;
  videoGMV: number;
  avgOrderValue: number;
  conversionRate: number;
  
  // Growth metrics
  followerGrowth: number;
  engagementGrowth: number;
  revenueGrowth: number;
}

// Content Performance
export interface ContentPerformance {
  totalPosts: number;
  totalVideos: number;
  totalLives: number;
  avgViews: number;
  avgEngagement: number;
  bestPerformingContent: string[];
  contentStrategy: 'live-focused' | 'video-focused' | 'balanced' | 'post-focused';
}

// Audience Demographics
export interface AudienceDemographics {
  ageGroups: {
    '13-17': number;
    '18-24': number;
    '25-34': number;
    '35-44': number;
    '45-54': number;
    '55+': number;
  };
  gender: {
    male: number;
    female: number;
    other: number;
  };
  locations: Record<string, number>;
  interests: string[];
  languages: string[];
}

// Main KOL Interface
export interface KOL {
  // Identity
  id: string;
  kolId: string;
  nickname: string;
  handle: string;
  profileImageUrl: string;
  
  // Classification
  level: KOLLevel;
  type: KOLType;
  specializations: string[];
  categories: string[];
  products: string[];
  locations: string[];
  tags: string[];
  
  // Platforms and Links
  socialMedia: SocialMedia;
  primaryPlatform: PlatformType;
  
  // Contact and Business
  contact: ContactInfo;
  businessInfo: BusinessInfo;
  
  // Performance Metrics
  metrics: KOLMetrics;
  contentPerformance: ContentPerformance;
  audienceDemographics: AudienceDemographics;
  
  // Content and Bio
  bio: {
    th?: string;
    en?: string;
  };
  detailedInformation?: string;
  creatorDebutTime?: string;
  
  // Quality and Scoring
  qualityScore: number;
  brandSafetyScore: number;
  collaborationHistory: CollaborationHistory[];
  
  // Status and Availability
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  availability: 'available' | 'busy' | 'unavailable';
  lastActivityDate?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Collaboration History
export interface CollaborationHistory {
  campaignId: string;
  campaignName: string;
  brandName: string;
  startDate: string;
  endDate: string;
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
    revenue: number;
    roi: number;
  };
  status: 'completed' | 'ongoing' | 'cancelled';
  rating?: number;
  review?: string;
}

// KOL Statistics
export interface KOLStats {
  // Basic counts
  totalKOLs: number;
  activeKOLs: number;
  newKOLsThisMonth: number;
  
  // Performance metrics
  totalRevenue: number;
  avgEngagement: number;
  avgQualityScore: number;
  activeCollabs: number;
  
  // Growth metrics
  growthPercent: number;
  revenueGrowth: number;
  engagementGrowth: number;
  
  // Distribution
  levelDistribution: Record<KOLLevel, number>;
  platformDistribution: Record<PlatformType, number>;
  locationDistribution: Record<string, number>;
  specializationDistribution: Record<string, number>;
  
  // Additional insights
  sampleSize: number;
  topPerformers: string[];
  emergingKOLs: string[];
  
  // Time-based metrics
  lastUpdated: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// KOL Filters
export interface KOLFilters {
  level?: KOLLevel[];
  type?: KOLType[];
  platforms?: PlatformType[];
  locations?: string[];
  specializations?: string[];
  categories?: string[];
  status?: ('active' | 'inactive' | 'suspended' | 'pending')[];
  availability?: ('available' | 'busy' | 'unavailable')[];
  collaborationStage?: CollaborationStage[];
  hasMCN?: boolean;
  
  // Numeric filters
  minFollowers?: number;
  maxFollowers?: number;
  minEngagementRate?: number;
  maxEngagementRate?: number;
  minQualityScore?: number;
  maxQualityScore?: number;
  minRevenue?: number;
  maxRevenue?: number;
  
  // Date filters
  activeAfter?: string;
  activeBefore?: string;
  joinedAfter?: string;
  joinedBefore?: string;
}

// KOL Query Options
export interface KOLQueryOptions {
  filters?: KOLFilters;
  includeStats?: boolean;
  includeAnalytics?: boolean;
  includeHistory?: boolean;
  fields?: (keyof KOL)[];
}

// Create KOL DTO
export interface CreateKOLDto {
  kolId: string;
  nickname: string;
  handle: string;
  profileImageUrl?: string;
  level: KOLLevel;
  type: KOLType;
  specializations: string[];
  categories: string[];
  products: string[];
  locations: string[];
  socialMedia: SocialMedia;
  primaryPlatform: PlatformType;
  contact: ContactInfo;
  businessInfo: BusinessInfo;
  bio?: {
    th?: string;
    en?: string;
  };
  detailedInformation?: string;
  creatorDebutTime?: string;
  tags?: string[];
}

// Update KOL DTO
export interface UpdateKOLDto extends Partial<CreateKOLDto> {
  metrics?: Partial<KOLMetrics>;
  contentPerformance?: Partial<ContentPerformance>;
  audienceDemographics?: Partial<AudienceDemographics>;
  qualityScore?: number;
  brandSafetyScore?: number;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  availability?: 'available' | 'busy' | 'unavailable';
}

// KOL Comparison
export interface KOLComparison {
  kols: KOL[];
  metrics: {
    followers: number[];
    engagement: number[];
    revenue: number[];
    qualityScore: number[];
  };
  similarities: string[];
  differences: string[];
  recommendations: string[];
}

// KOL Recommendation
export interface KOLRecommendation {
  kol: KOL;
  score: number;
  reasons: string[];
  matchType: 'exact' | 'similar' | 'alternative';
  confidence: 'high' | 'medium' | 'low';
}

// KOL Analytics
export interface KOLAnalytics {
  kolId: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    current: KOLMetrics;
    previous: KOLMetrics;
    change: {
      followers: number;
      engagement: number;
      revenue: number;
    };
  };
  topContent: Array<{
    id: string;
    type: ContentType;
    platform: PlatformType;
    performance: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
      engagementRate: number;
    };
  }>;
  audienceInsights: {
    growth: number;
    demographics: AudienceDemographics;
    topLocations: Array<{ location: string; percentage: number }>;
    engagementPatterns: {
      bestTimes: string[];
      bestDays: string[];
      contentTypes: ContentType[];
    };
  };
}