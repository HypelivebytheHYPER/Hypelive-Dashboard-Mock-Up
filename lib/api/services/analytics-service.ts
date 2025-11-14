"use client"

import * as React from "react"
import { cache } from "react"
import { ApiError } from '@/lib/api/types/api.types'
import { logger } from '@/lib/core/observability/logger'
import {
  DashboardMetrics,
  CampaignAnalytics,
  KolAnalytics,
  PerformanceReport,
  TrendAnalysis,
  BenchmarkData,
  ROIAnalysis,
  PredictiveInsights,
  CustomReport,
  RealTimeMetrics
} from '@/lib/types/analytics.types'

// ====================
// CACHED DATA FUNCTIONS
n// ====================

/**
 * Cached dashboard metrics data fetching
 */
const getCachedDashboardData = cache(async (timeframe: string): Promise<DashboardMetrics> => {
  logger.info('Fetching cached dashboard metrics', { timeframe })
  
  // Simulate API delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const metrics: DashboardMetrics = {
    overview: {
      total_campaigns: 45,
      active_campaigns: 12,
      total_kols: 128,
      total_reach: 2850000,
      total_engagement: 156000,
      avg_engagement_rate: 5.48,
      total_spend: 850000,
      total_revenue: 2100000,
      roi: 2.47
    },
    performance_trends: [
      { date: '2024-01-01', campaigns: 8, reach: 125000, engagement: 6800, spend: 25000 },
      { date: '2024-01-08', campaigns: 10, reach: 185000, engagement: 10200, spend: 35000 },
      { date: '2024-01-15', campaigns: 12, reach: 220000, engagement: 12800, spend: 42000 },
      { date: '2024-01-22', campaigns: 11, reach: 195000, engagement: 11500, spend: 38000 },
      { date: '2024-01-29', campaigns: 14, reach: 285000, engagement: 15600, spend: 52000 }
    ],
    platform_distribution: {
      instagram: { campaigns: 18, reach: 1250000, engagement: 78000, spend: 380000 },
      tiktok: { campaigns: 12, reach: 980000, engagement: 52000, spend: 280000 },
      line: { campaigns: 8, reach: 420000, engagement: 18000, spend: 120000 },
      blog: { campaigns: 7, reach: 200000, engagement: 8000, spend: 70000 }
    },
    top_performing_campaigns: [
      {
        id: 'CMP001',
        name: 'Summer Beauty Campaign',
        reach: 185000,
        engagement: 12500,
        engagement_rate: 6.76,
        spend: 45000,
        revenue: 125000,
        roi: 2.78
      },
      {
        id: 'CMP002',
        name: 'Tech Product Launch',
        reach: 142000,
        engagement: 9800,
        engagement_rate: 6.90,
        spend: 38000,
        revenue: 95000,
        roi: 2.50
      }
    ],
    recent_activities: [
      {
        id: 'ACT001',
        type: 'campaign_launch',
        description: 'New campaign "Summer Beauty" launched',
        timestamp: '2024-01-15T10:30:00Z',
        user: 'USER001',
        campaign_id: 'CMP001'
      },
      {
        id: 'ACT002',
        type: 'kol_onboarded',
        description: '5 new KOLs onboarded for tech campaign',
        timestamp: '2024-01-14T14:20:00Z',
        user: 'USER002',
        campaign_id: 'CMP002'
      }
    ]
  }
  
  return metrics
})

/**
 * Cached campaign analytics data fetching
 */
const getCachedCampaignAnalyticsData = cache(async (campaignId: string, timeframe: string): Promise<CampaignAnalytics> => {
  logger.info('Fetching cached campaign analytics', { campaignId, timeframe })
  
  // Simulate API delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, 150))
  
  const analytics: CampaignAnalytics = {
    campaign_id: campaignId,
    campaign_name: 'Summer Beauty Campaign',
    overview: {
      total_spend: 125000,
      total_reach: 485000,
      total_engagement: 32500,
      avg_engagement_rate: 6.7,
      total_conversions: 1250,
      conversion_rate: 2.58,
      total_revenue: 312000,
      roi: 2.50,
      cost_per_engagement: 3.85,
      cost_per_conversion: 100
    },
    performance_over_time: [
      { date: '2024-01-01', spend: 15000, reach: 45000, engagement: 2800, conversions: 110 },
      { date: '2024-01-08', spend: 22000, reach: 62000, engagement: 4100, conversions: 165 },
      { date: '2024-01-15', spend: 28000, reach: 78000, engagement: 5200, conversions: 210 },
      { date: '2024-01-22', spend: 32000, reach: 85000, engagement: 5800, conversions: 235 },
      { date: '2024-01-29', spend: 28000, reach: 75000, engagement: 4900, conversions: 190 }
    ],
    kol_performance: [
      {
        kol_id: 'KOL001',
        kol_name: 'Beauty Influencer A',
        posts: 8,
        reach: 125000,
        engagement: 8500,
        engagement_rate: 6.8,
        conversions: 340,
        revenue: 85000,
        cost: 25000,
        roi: 3.4
      },
      {
        kol_id: 'KOL002',
        kol_name: 'Skincare Expert B',
        posts: 6,
        reach: 98000,
        engagement: 7200,
        engagement_rate: 7.3,
        conversions: 285,
        revenue: 71250,
        cost: 20000,
        roi: 3.56
      }
    ],
    content_performance: {
      by_type: {
        video: { posts: 12, avg_engagement: 4200, avg_reach: 45000 },
        image: { posts: 18, avg_engagement: 2800, avg_reach: 32000 },
        carousel: { posts: 8, avg_engagement: 3800, avg_reach: 38000 }
      },
      top_posts: [
        {
          id: 'CONTENT001',
          title: 'Summer Skincare Routine',
          type: 'video',
          engagement_rate: 12.5,
          reach: 45000,
          likes: 3200,
          comments: 180,
          shares: 95
        },
        {
          id: 'CONTENT007',
          title: 'Product Comparison',
          type: 'carousel',
          engagement_rate: 9.8,
          reach: 38000,
          likes: 2800,
          comments: 145,
          shares: 72
        }
      ]
    },
    audience_insights: {
      demographics: {
        age: { '18-24': 25, '25-34': 45, '35-44': 20, '45-54': 7, '55+': 3 },
        gender: { female: 78, male: 20, other: 2 },
        location: { 'Bangkok': 55, 'Chiang Mai': 15, 'Phuket': 12, 'Other': 18 }
      },
      interests: ['Beauty', 'Skincare', 'Fashion', 'Lifestyle'],
      behaviors: {
        avg_session_duration: 4.2,
        bounce_rate: 0.32,
        pages_per_session: 3.1
      }
    }
  }
  
  return analytics
})

/**
 * Cached KOL analytics data fetching
 */
const getCachedKolAnalyticsData = cache(async (kolId: string, timeframe: string): Promise<KolAnalytics> => {
  logger.info('Fetching cached KOL analytics', { kolId, timeframe })
  
  // Simulate API delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const analytics: KolAnalytics = {
    kol_id: kolId,
    kol_name: 'Beauty Influencer A',
    overview: {
      total_campaigns: 12,
      total_posts: 45,
      total_reach: 580000,
      total_engagement: 42000,
      avg_engagement_rate: 7.24,
      follower_growth: 8.5,
      avg_cost_per_post: 3500,
      total_earnings: 157500
    },
    performance_trends: [
      { date: '2024-01-01', posts: 3, reach: 38000, engagement: 2800, engagement_rate: 7.37 },
      { date: '2024-01-08', posts: 4, reach: 45000, engagement: 3200, engagement_rate: 7.11 },
      { date: '2024-01-15', posts: 5, reach: 52000, engagement: 3800, engagement_rate: 7.31 },
      { date: '2024-01-22', posts: 4, reach: 48000, engagement: 3500, engagement_rate: 7.29 },
      { date: '2024-01-29', posts: 6, reach: 58000, engagement: 4200, engagement_rate: 7.24 }
    ],
    platform_performance: {
      instagram: {
        followers: 125000,
        posts: 25,
        avg_engagement: 2800,
        avg_reach: 45000,
        engagement_rate: 6.22,
        follower_growth: 12.5
      },
      tiktok: {
        followers: 85000,
        posts: 15,
        avg_engagement: 3800,
        avg_reach: 52000,
        engagement_rate: 7.31,
        follower_growth: 18.2
      },
      line: {
        followers: 45000,
        posts: 5,
        avg_engagement: 1800,
        avg_reach: 28000,
        engagement_rate: 6.43,
        follower_growth: 8.7
      }
    },
    content_performance: {
      by_type: {
        video: { posts: 18, avg_engagement: 4200, avg_reach: 48000 },
        image: { posts: 22, avg_engagement: 2800, avg_reach: 35000 },
        carousel: { posts: 5, avg_engagement: 3800, avg_reach: 42000 }
      },
      top_performing_content: [
        {
          id: 'CONTENT001',
          title: 'Summer Skincare Routine',
          platform: 'instagram',
          engagement_rate: 12.5,
          reach: 58000,
          likes: 4200,
          comments: 280,
          shares: 150
        }
      ]
    },
    audience_demographics: {
      age: { '18-24': 35, '25-34': 42, '35-44': 15, '45-54': 6, '55+': 2 },
      gender: { female: 68, male: 30, other: 2 },
      location: { 'Bangkok': 65, 'Chiang Mai': 12, 'Phuket': 8, 'Other': 15 },
      interests: ['Beauty', 'Skincare', 'Fashion', 'Lifestyle', 'Travel']
    },
    collaboration_history: [
      {
        campaign_id: 'CMP001',
        campaign_name: 'Summer Beauty Campaign',
        brand: 'Beauty Brand A',
        performance: 8.5,
        revenue: 25000,
        collaboration_date: '2024-01-15T00:00:00Z'
      },
      {
        campaign_id: 'CMP005',
        campaign_name: 'Skincare Launch',
        brand: 'Skincare Brand B',
        performance: 9.2,
        revenue: 32000,
        collaboration_date: '2024-01-20T00:00:00Z'
      }
    ]
  }
  
  return analytics
})

/**
 * Cached report generation
 */
const getCachedReportData = cache(async (params: {
  report_type: 'campaign' | 'kol' | 'overview'
  timeframe: 'week' | 'month' | 'quarter' | 'year'
  entity_id?: string
  format: 'pdf' | 'excel' | 'json'
}): Promise<PerformanceReport> => {
  logger.info('Generating cached performance report', params)
  
  // Simulate report generation delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const report: PerformanceReport = {
    id: `REPORT${Date.now()}`,
    report_type: params.report_type,
    timeframe: params.timeframe,
    entity_id: params.entity_id,
    title: `${params.report_type.charAt(0).toUpperCase() + params.report_type.slice(1)} Performance Report`,
    generated_at: new Date().toISOString(),
    generated_by: 'USER001',
    status: 'completed',
    file_url: `https://example.com/reports/${params.entity_id || 'overview'}_${params.timeframe}.${params.format}`,
    file_size: '2.5MB',
    metrics_summary: {
      total_campaigns: 45,
      total_reach: 2850000,
      total_engagement: 156000,
      total_spend: 850000,
      total_revenue: 2100000,
      avg_roi: 2.47
    },
    key_insights: [
      'Instagram campaigns show highest engagement rates at 7.2%',
      'Video content performs 35% better than static images',
      'Peak engagement times are 7-9 PM across all platforms',
      'KOL campaigns in beauty sector show 2.8x higher ROI'
    ],
    recommendations: [
      'Increase budget allocation for Instagram video content',
      'Focus on KOLs with ROI above 2.5x',
      'Implement A/B testing for content formats',
      'Optimize posting schedules based on audience insights'
    ]
  }
  
  return report
})

/**
 * Cached trend analysis
 */
const getCachedTrendAnalysisData = cache(async (metric: string, timeframe: string): Promise<TrendAnalysis> => {
  logger.info('Getting cached trend analysis', { metric, timeframe })
  
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const analysis: TrendAnalysis = {
    metric: metric,
    timeframe: timeframe,
    current_value: 7.2,
    previous_value: 6.8,
    change: 0.4,
    change_percentage: 5.88,
    trend: 'increasing',
    trend_strength: 'strong',
    data_points: [
      { date: '2024-01-01', value: 6.2 },
      { date: '2024-01-08', value: 6.5 },
      { date: '2024-01-15', value: 6.8 },
      { date: '2024-01-22', value: 7.0 },
      { date: '2024-01-29', value: 7.2 }
    ],
    seasonal_patterns: [
      { period: 'Q1', avg_value: 6.5, description: 'Lower engagement during New Year period' },
      { period: 'Q2', avg_value: 7.1, description: 'Increased engagement during summer campaigns' },
      { period: 'Q3', avg_value: 6.8, description: 'Moderate engagement during rainy season' },
      { period: 'Q4', avg_value: 7.8, description: 'Highest engagement during holiday season' }
    ],
    contributing_factors: [
      'Improved content quality and relevance',
      'Better audience targeting and segmentation',
      'Optimized posting schedules',
      'Enhanced KOL selection process'
    ],
    predictions: [
      { date: '2024-02-05', predicted_value: 7.4, confidence: 0.85 },
      { date: '2024-02-12', predicted_value: 7.6, confidence: 0.82 },
      { date: '2024-02-19', predicted_value: 7.8, confidence: 0.78 }
    ],
    recommendations: [
      'Continue current content strategy as it shows positive momentum',
      'Increase budget allocation for high-performing KOLs',
      'Test new content formats to maintain growth trajectory',
      'Monitor competitor activities for benchmarking'
    ]
  }
  
  return analysis
})

/**
 * Cached predictive insights
 */
const getCachedPredictiveInsightsData = cache(async (entity_type: 'campaign' | 'kol' | 'platform', entity_id: string): Promise<PredictiveInsights> => {
  logger.info('Getting cached predictive insights', { entity_type, entity_id })
  
  // Simulate AI/ML processing delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const insights: PredictiveInsights = {
    entity_type: entity_type,
    entity_id: entity_id,
    prediction_date: new Date().toISOString(),
    model_accuracy: 0.87,
    performance_forecast: [
      { date: '2024-02-05', predicted_performance: 7.8, confidence: 0.85, actual_performance: null },
      { date: '2024-02-12', predicted_performance: 7.6, confidence: 0.82, actual_performance: null },
      { date: '2024-02-19', predicted_performance: 7.9, confidence: 0.78, actual_performance: null }
    ],
    risk_assessment: {
      overall_risk: 'medium',
      risk_factors: [
        { factor: 'Seasonal demand variation', impact: 'high', probability: 0.6 },
        { factor: 'Competitor campaign overlap', impact: 'medium', probability: 0.4 },
        { factor: 'Platform algorithm changes', impact: 'high', probability: 0.3 }
      ],
      mitigation_strategies: [
        'Diversify campaign timing to reduce seasonal impact',
        'Monitor competitor activities and adjust strategy',
        'Maintain platform relationship and stay updated on changes'
      ]
    },
    opportunity_identification: [
      {
        opportunity: 'Expand to emerging platforms',
        potential_impact: '25% increase in reach',
        confidence: 0.75,
        implementation_cost: 50000,
        expected_timeline: '2-3 months'
      },
      {
        opportunity: 'Partner with micro-influencers',
        potential_impact: '40% improvement in engagement rate',
        confidence: 0.82,
        implementation_cost: 80000,
        expected_timeline: '1-2 months'
      }
    ],
    optimization_suggestions: [
      'Increase posting frequency during peak engagement hours',
      'Focus on video content formats for better performance',
      'Target audience segments showing highest conversion rates',
      'Implement A/B testing for content optimization'
    ],
    budget_recommendations: [
      { category: 'KOL Fees', current_allocation: 70, recommended_allocation: 65, reason: 'Optimize for better ROI' },
      { category: 'Content Creation', current_allocation: 15, recommended_allocation: 20, reason: 'Improve content quality' },
      { category: 'Platform Tools', current_allocation: 10, recommended_allocation: 12, reason: 'Enhance analytics capabilities' },
      { category: 'Management', current_allocation: 5, recommended_allocation: 3, reason: 'Streamline operations' }
    ]
  }
  
  return insights
})

/**
 * Cached real-time metrics
 */
const getCachedRealTimeMetricsData = cache(async (): Promise<RealTimeMetrics> => {
  logger.info('Getting cached real-time metrics')
  
  // Simulate real-time data fetching
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const metrics: RealTimeMetrics = {
    timestamp: new Date().toISOString(),
    active_campaigns: 12,
    active_kols: 45,
    posts_today: 23,
    total_reach_today: 125000,
    total_engagement_today: 8500,
    current_engagement_rate: 6.8,
    trending_hashtags: ['#skincare', '#summer', '#beauty', '#review', '#tech'],
    top_performing_content: [
      {
        id: 'CONTENT001',
        title: 'Summer Skincare Routine',
        platform: 'instagram',
        current_performance: 8.5,
        trend: 'increasing',
        last_updated: new Date().toISOString()
      },
      {
        id: 'CONTENT007',
        title: 'Product Comparison',
        platform: 'tiktok',
        current_performance: 7.2,
        trend: 'stable',
        last_updated: new Date().toISOString()
      }
    ],
    system_status: {
      api_health: 'healthy',
      data_sync_status: 'synced',
      last_sync_time: new Date().toISOString(),
      active_connections: 156,
      queue_size: 12
    },
    alerts: [
      {
        id: 'ALERT001',
        type: 'performance_drop',
        severity: 'medium',
        message: 'Engagement rate dropped 15% compared to yesterday',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        entity_id: 'CMP001',
        acknowledged: false
      },
      {
        id: 'ALERT002',
        type: 'campaign_complete',
        severity: 'info',
        message: 'Tech Product Launch campaign completed successfully',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        entity_id: 'CMP002',
        acknowledged: true
      }
    ]
  }
  
  return metrics
})

// ====================
// MAIN SERVICE CLASS
// ====================

/**
 * Analytics Service - Main service class for analytics operations
 * Provides cached data access with React 19 cache integration
 */
export class AnalyticsService {
  /**
   * Get dashboard metrics with caching
   */
  async getDashboardMetrics(timeframe: 'day' | 'week' | 'month' | 'quarter'): Promise<DashboardMetrics> {
    try {
      logger.info('Getting dashboard metrics with caching', { timeframe })
      
      // Use cached function for better performance
      return await getCachedDashboardData(timeframe)
      
    } catch (error) {
      logger.error('Failed to get dashboard metrics', { error, timeframe })
      throw new ApiError(500, 'Failed to get dashboard metrics')
    }
  }

  /**
   * Get campaign analytics with caching
   */
  async getCampaignAnalytics(campaignId: string, timeframe: 'week' | 'month' | 'quarter'): Promise<CampaignAnalytics> {
    try {
      logger.info('Getting campaign analytics with caching', { campaignId, timeframe })
      
      // Use cached function for better performance
      return await getCachedCampaignAnalyticsData(campaignId, timeframe)
      
    } catch (error) {
      logger.error('Failed to get campaign analytics', { error, campaignId, timeframe })
      throw new ApiError(500, 'Failed to get campaign analytics')
    }
  }

  /**
   * Get KOL analytics with caching
   */
  async getKolAnalytics(kolId: string, timeframe: 'week' | 'month' | 'quarter'): Promise<KolAnalytics> {
    try {
      logger.info('Getting KOL analytics with caching', { kolId, timeframe })
      
      // Use cached function for better performance
      return await getCachedKolAnalyticsData(kolId, timeframe)
      
    } catch (error) {
      logger.error('Failed to get KOL analytics', { error, kolId, timeframe })
      throw new ApiError(500, 'Failed to get KOL analytics')
    }
  }

  /**
   * Generate performance report with enhanced caching
   */
  async generatePerformanceReport(params: {
    report_type: 'campaign' | 'kol' | 'overview'
    timeframe: 'week' | 'month' | 'quarter' | 'year'
    entity_id?: string
    format: 'pdf' | 'excel' | 'json'
  }): Promise<PerformanceReport> {
    try {
      logger.info('Generating performance report with caching', params)
      
      // Use cached function for better performance
      return await getCachedReportData(params)
      
    } catch (error) {
      logger.error('Failed to generate performance report', { error, params })
      throw new ApiError(500, 'Failed to generate performance report')
    }
  }

  /**
   * Get trend analysis with caching
   */
  async getTrendAnalysis(metric: string, timeframe: 'week' | 'month' | 'quarter'): Promise<TrendAnalysis> {
    try {
      logger.info('Getting trend analysis with caching', { metric, timeframe })
      
      // Use cached function for better performance
      return await getCachedTrendAnalysisData(metric, timeframe)
      
    } catch (error) {
      logger.error('Failed to get trend analysis', { error, metric, timeframe })
      throw new ApiError(500, 'Failed to get trend analysis')
    }
  }

  /**
   * Get benchmark data with caching
   */
  async getBenchmarkData(category: string, metric: string): Promise<BenchmarkData> {
    try {
      logger.info('Getting benchmark data with caching', { category, metric })
      
      // Mock benchmark data - replace with real API calls
      const benchmark: BenchmarkData = {
        category: category,
        metric: metric,
        industry_benchmarks: {
          average: 6.2,
          median: 6.0,
          percentile_25: 5.1,
          percentile_75: 7.2,
          percentile_90: 8.5,
          best_in_class: 12.3
        },
        our_performance: {
          current_value: 7.2,
          ranking: 3,
          percentile: 72,
          vs_average: '+16%',
          vs_best_in_class: '-41%'
        },
        competitor_comparison: [
          {
            competitor: 'Competitor A',
            value: 8.1,
            ranking: 1,
            strengths: ['High-quality content', 'Strong KOL relationships'],
            weaknesses: ['Limited platform diversity']
          },
          {
            competitor: 'Competitor B',
            value: 6.8,
            ranking: 4,
            strengths: ['Consistent posting schedule'],
            weaknesses: ['Lower content quality', 'Limited audience engagement']
          },
          {
            competitor: 'Competitor C',
            value: 7.5,
            ranking: 2,
            strengths: ['Innovative content formats'],
            weaknesses: ['Inconsistent brand messaging']
          }
        ],
        improvement_opportunities: [
          'Focus on content quality to reach best-in-class levels',
          'Diversify content formats to match top performers',
          'Enhance audience targeting for better engagement',
          'Optimize posting frequency and timing'
        ],
        market_trends: [
          'Video content showing 25% higher engagement rates',
          'Micro-influencers (10K-100K) outperforming macro-influencers',
          'Authentic, user-generated content gaining traction',
          'Short-form content (under 60s) showing best performance'
        ]
      }
      
      return benchmark
      
    } catch (error) {
      logger.error('Failed to get benchmark data', { error, category, metric })
      throw new ApiError(500, 'Failed to get benchmark data')
    }
  }

  /**
   * Get ROI analysis with caching
   */
  async getROIAnalysis(params: {
    entity_type: 'campaign' | 'kol' | 'platform'
    entity_id?: string
    timeframe: 'month' | 'quarter' | 'year'
  }): Promise<ROIAnalysis> {
    try {
      logger.info('Getting ROI analysis with caching', params)
      
      // Mock ROI analysis - replace with real API calls
      const analysis: ROIAnalysis = {
        entity_type: params.entity_type,
        entity_id: params.entity_id,
        timeframe: params.timeframe,
        total_investment: 850000,
        total_return: 2100000,
        gross_roi: 2.47,
        net_roi: 1.47,
        payback_period: 4.2,
        investment_breakdown: {
          kol_fees: 680000,
          content_creation: 85000,
          platform_fees: 42000,
          management_costs: 43000
        },
        return_breakdown: {
          direct_sales: 1680000,
          brand_awareness_value: 280000,
          customer_acquisition_value: 140000
        },
        roi_by_period: [
          { period: '2024-Q1', investment: 200000, return: 420000, roi: 2.1 },
          { period: '2024-Q2', investment: 280000, return: 735000, roi: 2.63 },
          { period: '2024-Q3', investment: 220000, return: 550000, roi: 2.5 },
          { period: '2024-Q4', investment: 150000, return: 395000, roi: 2.63 }
        ],
        risk_factors: [
          'Market saturation in beauty sector',
          'Platform algorithm changes affecting reach',
          'Increased competition for KOL partnerships',
          'Economic downturn impact on consumer spending'
        ],
        optimization_recommendations: [
          'Focus on KOLs with ROI above 2.5x',
          'Increase investment in high-performing platforms',
          'Negotiate better rates with proven KOLs',
          'Diversify across multiple content formats'
        ]
      }
      
      return analysis
      
    } catch (error) {
      logger.error('Failed to get ROI analysis', { error, params })
      throw new ApiError(500, 'Failed to get ROI analysis')
    }
  }

  /**
   * Get predictive insights with AI/ML (future enhancement)
   */
  async getPredictiveInsights(entity_type: 'campaign' | 'kol' | 'platform', entity_id: string): Promise<PredictiveInsights> {
    try {
      logger.info('Getting predictive insights with caching', { entity_type, entity_id })
      
      // Use cached function for better performance
      return await getCachedPredictiveInsightsData(entity_type, entity_id)
      
    } catch (error) {
      logger.error('Failed to get predictive insights', { error, entity_type, entity_id })
      throw new ApiError(500, 'Failed to get predictive insights')
    }
  }

  /**
   * Create custom report with caching
   */
  async createCustomReport(config: {
    name: string
    description: string
    metrics: string[]
    filters: Record<string, any>
    date_range: {
      start: string
      end: string
    }
    format: 'pdf' | 'excel' | 'json'
    schedule?: 'daily' | 'weekly' | 'monthly'
  }): Promise<CustomReport> {
    try {
      logger.info('Creating custom report with caching', config)
      
      // Simulate report creation with caching
      const createReport = cache(async (reportConfig: typeof config) => {
        const report: CustomReport = {
          id: `CUSTOM${Date.now()}`,
          name: reportConfig.name,
          description: reportConfig.description,
          config: reportConfig,
          status: 'active',
          created_at: new Date().toISOString(),
          created_by: 'USER001',
          last_generated: new Date().toISOString(),
          next_schedule: reportConfig.schedule ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
          file_url: `https://example.com/reports/custom/${Date.now()}.${reportConfig.format}`,
          file_size: '1.8MB',
          metrics_included: reportConfig.metrics,
          data_points: 1247,
          generation_time: 45,
          accuracy_score: 0.94
        }
        
        return report
      })
      
      return await createReport(config)
      
    } catch (error) {
      logger.error('Failed to create custom report', { error, config })
      throw new ApiError(500, 'Failed to create custom report')
    }
  }

  /**
   * Get real-time metrics with caching
   */
  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    try {
      logger.info('Getting real-time metrics with caching')
      
      // Use cached function for better performance
      return await getCachedRealTimeMetricsData()
      
    } catch (error) {
      logger.error('Failed to get real-time metrics', { error })
      throw new ApiError(500, 'Failed to get real-time metrics')
    }
  }
}

// ====================
// EXPORT CACHED FUNCTIONS
// ====================

// Export cached functions for direct use in components
export const getCachedDashboardMetrics = getCachedDashboardData
export const getCachedCampaignAnalytics = getCachedCampaignAnalyticsData
export const getCachedKolAnalytics = getCachedKolAnalyticsData

// Export service instance
export const analyticsService = new AnalyticsService()

// Export types for better TypeScript support
export type {
  DashboardMetrics,
  CampaignAnalytics,
  KolAnalytics,
  PerformanceReport,
  TrendAnalysis,
  BenchmarkData,
  ROIAnalysis,
  PredictiveInsights,
  CustomReport,
  RealTimeMetrics
}