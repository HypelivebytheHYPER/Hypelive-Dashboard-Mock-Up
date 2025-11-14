/**
 * Analytics Type Definitions
 * Types for comprehensive analytics, reporting, and insights
 */

// Dashboard Metrics
export interface DashboardMetrics {
  overview: {
    total_campaigns: number;
    active_campaigns: number;
    total_kols: number;
    total_reach: number;
    total_engagement: number;
    avg_engagement_rate: number;
    total_spend: number;
    total_revenue: number;
    roi: number;
  };
  performance_trends: Array<{
    date: string;
    campaigns: number;
    reach: number;
    engagement: number;
    spend: number;
  }>;
  platform_distribution: Record<string, {
    campaigns: number;
    reach: number;
    engagement: number;
    spend: number;
  }>;
  top_performing_campaigns: Array<{
    id: string;
    name: string;
    reach: number;
    engagement: number;
    engagement_rate: number;
    spend: number;
    revenue: number;
    roi: number;
  }>;
  recent_activities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
    campaign_id?: string;
  }>;
}

// Campaign Analytics
export interface CampaignAnalytics {
  campaign_id: string;
  campaign_name: string;
  overview: {
    total_spend: number;
    total_reach: number;
    total_engagement: number;
    avg_engagement_rate: number;
    total_conversions: number;
    conversion_rate: number;
    total_revenue: number;
    roi: number;
    cost_per_engagement: number;
    cost_per_conversion: number;
  };
  performance_over_time: Array<{
    date: string;
    spend: number;
    reach: number;
    engagement: number;
    conversions: number;
  }>;
  kol_performance: Array<{
    kol_id: string;
    kol_name: string;
    posts: number;
    reach: number;
    engagement: number;
    engagement_rate: number;
    conversions: number;
    revenue: number;
    cost: number;
    roi: number;
  }>;
  content_performance: {
    by_type: Record<string, {
      posts: number;
      avg_engagement: number;
      avg_reach: number;
    }>;
    top_posts: Array<{
      id: string;
      title: string;
      type: string;
      engagement_rate: number;
      reach: number;
      likes: number;
      comments: number;
      shares: number;
    }>;
  };
  audience_insights: {
    demographics: {
      age: Record<string, number>;
      gender: Record<string, number>;
      location: Record<string, number>;
    };
    interests: string[];
    behaviors: {
      avg_session_duration: number;
      bounce_rate: number;
      pages_per_session: number;
    };
  };
}

// KOL Analytics
export interface KolAnalytics {
  kol_id: string;
  kol_name: string;
  overview: {
    total_campaigns: number;
    total_posts: number;
    total_reach: number;
    total_engagement: number;
    avg_engagement_rate: number;
    follower_growth: number;
    avg_cost_per_post: number;
    total_earnings: number;
  };
  performance_trends: Array<{
    date: string;
    posts: number;
    reach: number;
    engagement: number;
    engagement_rate: number;
  }>;
  platform_performance: Record<string, {
    followers: number;
    posts: number;
    avg_engagement: number;
    avg_reach: number;
    engagement_rate: number;
    follower_growth: number;
  }>;
  content_performance: {
    by_type: Record<string, {
      posts: number;
      avg_engagement: number;
      avg_reach: number;
    }>;
    top_performing_content: Array<{
      id: string;
      title: string;
      platform: string;
      engagement_rate: number;
      reach: number;
      likes: number;
      comments: number;
      shares: number;
    }>;
  };
  audience_demographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, number>;
    interests: string[];
  };
  collaboration_history: Array<{
    campaign_id: string;
    campaign_name: string;
    brand: string;
    performance: number;
    revenue: number;
    collaboration_date: string;
  }>;
}

// Performance Report
export interface PerformanceReport {
  id: string;
  report_type: 'campaign' | 'kol' | 'overview';
  timeframe: string;
  entity_id?: string;
  title: string;
  generated_at: string;
  generated_by: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  file_url: string;
  file_size: string;
  metrics_summary: Record<string, any>;
  key_insights: string[];
  recommendations: string[];
}

// Trend Analysis
export interface TrendAnalysis {
  metric: string;
  timeframe: string;
  current_value: number;
  previous_value: number;
  change: number;
  change_percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  trend_strength: 'weak' | 'moderate' | 'strong';
  data_points: Array<{
    date: string;
    value: number;
  }>;
  seasonal_patterns: Array<{
    period: string;
    avg_value: number;
    description: string;
  }>;
  contributing_factors: string[];
  predictions: Array<{
    date: string;
    predicted_value: number;
    confidence: number;
  }>;
  recommendations: string[];
}

// Benchmark Data
export interface BenchmarkData {
  category: string;
  metric: string;
  industry_benchmarks: {
    average: number;
    median: number;
    percentile_25: number;
    percentile_75: number;
    percentile_90: number;
    best_in_class: number;
  };
  our_performance: {
    current_value: number;
    ranking: number;
    percentile: number;
    vs_average: string;
    vs_best_in_class: string;
  };
  competitor_comparison: Array<{
    competitor: string;
    value: number;
    ranking: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  improvement_opportunities: string[];
  market_trends: string[];
}

// ROI Analysis
export interface ROIAnalysis {
  entity_type: 'campaign' | 'kol' | 'platform';
  entity_id?: string;
  timeframe: string;
  total_investment: number;
  total_return: number;
  gross_roi: number;
  net_roi: number;
  payback_period: number; // in months
  investment_breakdown: Record<string, number>;
  return_breakdown: Record<string, number>;
  roi_by_period: Array<{
    period: string;
    investment: number;
    return: number;
    roi: number;
  }>;
  risk_factors: string[];
  optimization_recommendations: string[];
}

// Predictive Insights
export interface PredictiveInsights {
  entity_type: 'campaign' | 'kol' | 'platform';
  entity_id: string;
  prediction_date: string;
  model_accuracy: number;
  performance_forecast: Array<{
    date: string;
    predicted_performance: number;
    confidence: number;
    actual_performance?: number;
  }>;
  risk_assessment: {
    overall_risk: 'low' | 'medium' | 'high';
    risk_factors: Array<{
      factor: string;
      impact: 'low' | 'medium' | 'high';
      probability: number;
    }>;
    mitigation_strategies: string[];
  };
  opportunity_identification: Array<{
    opportunity: string;
    potential_impact: string;
    confidence: number;
    implementation_cost: number;
    expected_timeline: string;
  }>;
  optimization_suggestions: string[];
  budget_recommendations: Array<{
    category: string;
    current_allocation: number;
    recommended_allocation: number;
    reason: string;
  }>;
}

// Custom Report
export interface CustomReport {
  id: string;
  name: string;
  description: string;
  config: {
    metrics: string[];
    filters: Record<string, any>;
    date_range: {
      start: string;
      end: string;
    };
    format: 'pdf' | 'excel' | 'json';
    schedule?: 'daily' | 'weekly' | 'monthly';
  };
  status: 'active' | 'inactive';
  created_at: string;
  created_by: string;
  last_generated: string;
  next_schedule: string | null;
  file_url: string;
  file_size: string;
  metrics_included: string[];
  data_points: number;
  generation_time: number; // in seconds
  accuracy_score: number;
}

// Real-time Metrics
export interface RealTimeMetrics {
  timestamp: string;
  active_campaigns: number;
  active_kols: number;
  posts_today: number;
  total_reach_today: number;
  total_engagement_today: number;
  current_engagement_rate: number;
  trending_hashtags: string[];
  top_performing_content: Array<{
    id: string;
    title: string;
    platform: string;
    current_performance: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    last_updated: string;
  }>;
  system_status: {
    api_health: 'healthy' | 'degraded' | 'unhealthy';
    data_sync_status: 'synced' | 'syncing' | 'failed';
    last_sync_time: string;
    active_connections: number;
    queue_size: number;
  };
  alerts: Array<{
    id: string;
    type: 'performance_drop' | 'campaign_complete' | 'system_error' | 'budget_alert';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
    entity_id?: string;
    acknowledged: boolean;
  }>;
}

// Audience Analytics
export interface AudienceAnalytics {
  total_audience: number;
  active_audience: number;
  growth_rate: number;
  demographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, number>;
    income?: Record<string, number>;
    education?: Record<string, number>;
  };
  interests: Array<{
    category: string;
    percentage: number;
    engagement_level: 'low' | 'medium' | 'high';
  }>;
  behaviors: {
    avg_session_duration: number;
    bounce_rate: number;
    pages_per_session: number;
    return_rate: number;
    sharing_frequency: number;
  };
  engagement_patterns: {
    peak_hours: string[];
    peak_days: string[];
    seasonal_variations: Array<{
      season: string;
      engagement_multiplier: number;
      description: string;
    }>;
  };
  audience_segments: Array<{
    id: string;
    name: string;
    size: number;
    characteristics: string[];
    engagement_rate: number;
    conversion_rate: number;
    value_score: number;
  }>;
}

// Content Performance Analytics
export interface ContentPerformanceAnalytics {
  total_content_pieces: number;
  content_by_type: Record<string, number>;
  avg_performance_by_type: Record<string, number>;
  top_performing_content: Array<{
    id: string;
    title: string;
    type: string;
    platform: string;
    performance_score: number;
    engagement_rate: number;
    reach: number;
    conversions: number;
  }>;
  content_trends: Array<{
    date: string;
    total_posts: number;
    avg_engagement: number;
    avg_reach: number;
    top_format: string;
  }>;
  format_effectiveness: Record<string, {
    usage_percentage: number;
    avg_engagement_rate: number;
    avg_reach: number;
    cost_efficiency: number;
    best_practices: string[];
  }>;
  seasonal_performance: Array<{
    season: string;
    content_performance: number;
    top_formats: string[];
    audience_preferences: string[];
  }>;
}

// Attribution Analytics
export interface AttributionAnalytics {
  attribution_model: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';
  total_attributed_conversions: number;
  total_attributed_revenue: number;
  attribution_paths: Array<{
    path_id: string;
    touchpoints: Array<{
      type: 'campaign' | 'kol' | 'content' | 'platform';
      id: string;
      name: string;
      contribution_score: number;
      timestamp: string;
    }>;
    total_conversions: number;
    total_revenue: number;
    avg_path_length: number;
  }>;
  touchpoint_effectiveness: Array<{
    touchpoint_type: string;
    total_touchpoints: number;
    conversion_rate: number;
    avg_contribution: number;
    cost_per_conversion: number;
  }>;
  customer_journey_insights: {
    avg_journey_length: number;
    most_common_paths: string[];
    conversion_time_distribution: Record<string, number>;
    drop_off_points: string[];
  };
}

// Export all types
export {
  DashboardMetrics,
  CampaignAnalytics,
  KolAnalytics,
  PerformanceReport,
  TrendAnalysis,
  BenchmarkData,
  ROIAnalysis,
  PredictiveInsights,
  CustomReport,
  RealTimeMetrics,
  AudienceAnalytics,
  ContentPerformanceAnalytics,
  AttributionAnalytics
};