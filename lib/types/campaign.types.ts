/**
 * Campaign Type Definitions
 * Comprehensive types for campaign management system
 */

import { KOL } from './kol.types';
import { PaginatedResponse } from './api.types';

// Campaign Status
export type CampaignStatus = 
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

// Campaign Objective
export type CampaignObjective =
  | 'brand_awareness'
  | 'product_launch'
  | 'sales_driving'
  | 'engagement'
  | 'user_generated_content'
  | 'event_promotion';

// Content Type Requirements
export type ContentRequirement =
  | 'live_streaming'
  | 'short_video'
  | 'long_video'
  | 'post'
  | 'story'
  | 'review'
  | 'tutorial'
  | 'unboxing';

// Campaign Deliverable
export interface CampaignDeliverable {
  id: string;
  type: ContentRequirement;
  quantity: number;
  specifications: string;
  deadline: string;
  approval_required: boolean;
  samples?: string[];
}

// Campaign Budget
export interface CampaignBudget {
  total: number;
  currency: string;
  kolfee_budget: number;
  product_costs: number;
  shipping_costs: number;
  additional_costs: number;
  breakdown: BudgetBreakdown[];
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  description?: string;
}

// Campaign Timeline
export interface CampaignTimeline {
  phase: string;
  start_date: string;
  end_date: string;
  milestones: CampaignMilestone[];
  dependencies?: string[];
}

export interface CampaignMilestone {
  id: string;
  name: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  responsible_party: string;
}

// Target Audience
export interface TargetAudience {
  demographics: {
    age_range: [number, number];
    gender: 'male' | 'female' | 'all';
    locations: string[];
    languages: string[];
  };
  interests: string[];
  behaviors: string[];
  platform_preferences: PlatformType[];
  budget_range?: {
    min: number;
    max: number;
    currency: string;
  };
}

// Campaign Metrics
export interface CampaignMetrics {
  impressions: number;
  reach: number;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    total: number;
  };
  video_metrics?: {
    views: number;
    completion_rate: number;
    average_watch_time: number;
  };
  conversion_metrics?: {
    clicks: number;
    conversions: number;
    conversion_rate: number;
    revenue_generated: number;
  };
  roi: number;
  cost_per_engagement: number;
  cost_per_conversion?: number;
  engagement_rate: number;
}

// Campaign Performance
export interface CampaignPerformance {
  current_metrics: CampaignMetrics;
  target_metrics: CampaignMetrics;
  variance: {
    impressions: number;
    engagement: number;
    conversions: number;
    roi: number;
  };
  recommendations: string[];
  optimization_score: number;
}

// Campaign Approval
export interface CampaignApproval {
  id: string;
  approver_id: string;
  approver_role: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approved_at?: string;
  rejected_at?: string;
  created_at: string;
}

// Main Campaign Interface
export interface Campaign {
  id: string;
  name: string;
  description: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  
  // Organization
  organization_id: string;
  created_by: string;
  updated_by?: string;
  
  // Timeline
  start_date: string;
  end_date: string;
  timeline: CampaignTimeline;
  
  // Budget
  budget: number;
  currency: string;
  spent_budget: number;
  budget_breakdown: BudgetBreakdown[];
  
  // Targeting
  target_audience: TargetAudience;
  selected_kols: string[]; // KOL IDs
  kol_requirements: {
    min_followers: number;
    max_followers: number;
    engagement_rate_min: number;
    specializations: string[];
    locations: string[];
  };
  
  // Content Requirements
  content_requirements: ContentRequirement[];
  deliverables: CampaignDeliverable[];
  brand_guidelines: string;
  dos_and_donts: string[];
  
  // Performance
  metrics?: CampaignMetrics;
  performance?: CampaignPerformance;
  progress: number;
  
  // Workflow
  approval_chain: CampaignApproval[];
  current_approval_step: number;
  
  // Settings
  is_public: boolean;
  is_template: boolean;
  template_id?: string;
  tags: string[];
  
  // Metadata
  created_at: string;
  updated_at: string;
  completed_at?: string;
  
  // Relationships (populated on demand)
  kols?: KOL[];
  analytics?: CampaignAnalytics;
  performance?: CampaignPerformance;
}

// Campaign Analytics
export interface CampaignAnalytics {
  daily_metrics: DailyMetric[];
  platform_breakdown: PlatformBreakdown[];
  kol_performance: KOLPerformance[];
  content_performance: ContentPerformance[];
  audience_insights: AudienceInsights;
  conversion_funnel: ConversionFunnel;
}

export interface DailyMetric {
  date: string;
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface PlatformBreakdown {
  platform: PlatformType;
  impressions: number;
  engagement: number;
  conversions: number;
  revenue: number;
  cost: number;
  roi: number;
}

export interface KOLPerformance {
  kol_id: string;
  kol_name: string;
  impressions: number;
  engagement: number;
  conversions: number;
  revenue: number;
  cost: number;
  roi: number;
  engagement_rate: number;
  content_pieces: number;
}

export interface ContentPerformance {
  content_type: ContentRequirement;
  impressions: number;
  engagement: number;
  conversions: number;
  revenue: number;
  engagement_rate: number;
  best_performing: boolean;
}

export interface AudienceInsights {
  demographics: {
    age_distribution: Record<string, number>;
    gender_distribution: Record<string, number>;
    location_distribution: Record<string, number>;
  };
  engagement_patterns: {
    best_times: string[];
    best_days: string[];
    peak_hours: number[];
  };
  interests: string[];
  behaviors: string[];
}

export interface ConversionFunnel {
  stages: FunnelStage[];
  total_conversions: number;
  conversion_rate: number;
  average_order_value: number;
  customer_lifetime_value: number;
}

export interface FunnelStage {
  name: string;
  visitors: number;
  conversions: number;
  conversion_rate: number;
  drop_off_rate: number;
}

// Campaign Template
export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  objective: CampaignObjective;
  
  // Pre-configured settings
  default_timeline: CampaignTimeline;
  suggested_budget: {
    min: number;
    max: number;
    currency: string;
  };
  target_audience_template: TargetAudience;
  content_requirements: ContentRequirement[];
  deliverables_template: CampaignDeliverable[];
  
  // Customization options
  customizable_fields: string[];
  required_fields: string[];
  
  // Usage stats
  usage_count: number;
  average_roi: number;
  success_rate: number;
  
  // Metadata
  created_by: string;
  created_at: string;
  is_active: boolean;
  tags: string[];
}

// Campaign Filters
export interface CampaignFilters {
  status?: CampaignStatus[];
  objective?: CampaignObjective[];
  start_date_from?: string;
  start_date_to?: string;
  budget_min?: number;
  budget_max?: number;
  organization_id?: string;
  created_by?: string;
  tags?: string[];
}

// Campaign Stats
export interface CampaignStats {
  activeCampaigns: number;
  totalRevenue: number;
  engagedKOLs: number;
  avgROI: number;
  campaignsGrowth: number;
  revenueGrowth: number;
  kolGrowth: number;
  roiGrowth: number;
  conversionRate: number;
  avgCampaignDuration: number;
  topPerformingCampaigns: Array<{
    id: string;
    name: string;
    roi: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: string;
    user: string;
  }>;
}

// Campaign Queries
export interface CampaignQueryOptions {
  page: number;
  limit: number;
  status?: CampaignStatus;
  filters?: CampaignFilters;
  sort_by?: 'name' | 'start_date' | 'budget' | 'roi' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// Paginated Response
export interface PaginatedCampaigns extends PaginatedResponse<Campaign> {}

// Create Campaign DTO
export interface CreateCampaignDto {
  name: string;
  description: string;
  objective: CampaignObjective;
  budget: number;
  currency: string;
  start_date: string;
  end_date: string;
  target_audience: TargetAudience;
  kol_requirements: {
    min_followers: number;
    max_followers: number;
    engagement_rate_min: number;
    specializations: string[];
    locations: string[];
  };
  content_requirements: ContentRequirement[];
  deliverables: CampaignDeliverable[];
  brand_guidelines: string;
  dos_and_donts: string[];
  template_id?: string;
  tags?: string[];
}

// Update Campaign DTO
export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {
  status?: CampaignStatus;
  metrics?: Partial<CampaignMetrics>;
  performance?: Partial<CampaignPerformance>;
  progress?: number;
}

// Platform Type (reuse from KOL types)
import { PlatformType } from './kol.types';

export {
  Campaign,
  CampaignStatus,
  CampaignObjective,
  CampaignMetrics,
  CampaignPerformance,
  CampaignAnalytics,
  CampaignTemplate,
  CampaignFilters,
  CampaignStats,
  PaginatedCampaigns,
  CreateCampaignDto,
  UpdateCampaignDto
};