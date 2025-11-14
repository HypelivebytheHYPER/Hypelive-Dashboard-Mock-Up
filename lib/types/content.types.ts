/**
 * Content Management Type Definitions
 * Types for content creation, approval, and performance tracking
 */

// Content Asset
export interface ContentAsset {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'image' | 'carousel' | 'story' | 'blog' | 'reel' | 'live';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'scheduled';
  campaign_id: string;
  kol_id: string;
  platform: string;
  content: {
    text: string;
    media?: Array<{
      type: string;
      url: string;
      thumbnail?: string;
      duration?: number;
      size?: string;
      alt_text?: string;
    }>;
    hashtags?: string[];
    mentions?: string[];
    links?: string[];
    location?: {
      name: string;
      latitude?: number;
      longitude?: number;
    };
  };
  scheduled_for?: string;
  published_at?: string;
  performance?: ContentPerformance;
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  tags: string[];
  metadata: Record<string, any>;
}

// Content Performance
export interface ContentPerformance {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  profile_visits: number;
  link_clicks: number;
  story_replies: number;
  mentions: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
  video_metrics?: {
    views: number;
    completion_rate: number;
    average_watch_time: number;
    retention_rate: number;
  };
  story_metrics?: {
    taps_forward: number;
    taps_back: number;
    exits: number;
    replies: number;
  };
}

// Content Calendar
export interface ContentCalendar {
  month: string;
  total_posts: number;
  scheduled_posts: number;
  published_posts: number;
  posts_by_platform: Record<string, number>;
  posts_by_status: Record<string, number>;
  daily_schedule: Array<{
    date: string;
    posts: Array<{
      id: string;
      title: string;
      platform: string;
      status: string;
      scheduled_time: string;
      kol_name: string;
      campaign_name: string;
      performance?: ContentPerformance;
    }>;
  }>;
}

// Content Analytics
export interface ContentAnalytics {
  platform_performance: Record<string, PlatformPerformance>;
  content_trends: Array<{
    date: string;
    posts: number;
    engagement: number;
    reach: number;
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
  engagement_insights: {
    best_posting_times: string[];
    optimal_content_length: string;
    most_engaging_hashtags: string[];
    content_types_performance: Record<string, number>;
  };
}

export interface PlatformPerformance {
  total_posts: number;
  avg_engagement_rate: number;
  avg_reach: number;
  top_performing_content: string[];
  growth_rate: number;
}

// Content Template
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  content_structure: {
    introduction?: string;
    body?: string;
    conclusion?: string;
    call_to_action?: string;
    hashtags?: string[];
    media_requirements?: string[];
  };
  guidelines: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  usage_count?: number;
  avg_performance?: number;
}

// Content Workflow
export interface ContentWorkflow {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStage[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  usage_count?: number;
}

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  order: number;
  approvers: string[];
  requirements: string[];
  estimated_duration: number; // in hours
  is_optional: boolean;
}

// Post Performance
export interface PostPerformance {
  post_id: string;
  platform: string;
  post_date: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    profile_visits: number;
    link_clicks: number;
    story_replies: number;
    mentions: number;
    reach: number;
    impressions: number;
    engagement_rate: number;
  };
  audience_insights: {
    age_distribution: Record<string, number>;
    gender_distribution: {
      female: number;
      male: number;
      other: number;
    };
    location_distribution: Record<string, number>;
    active_times: string[];
  };
  competitor_comparison: {
    avg_engagement_rate: number;
    avg_reach: number;
    performance_vs_avg: string;
    ranking: number;
  };
  insights: {
    top_hashtags: string[];
    best_performing_content: string;
    audience_engagement: string;
    optimization_suggestions: string[];
  };
}

// Asset Library
export interface AssetLibrary {
  total_assets: number;
  categories: Record<string, number>;
  recent_assets: Asset[];
  search_results: Asset[];
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  category: string;
  url: string;
  thumbnail: string;
  size: string;
  file_size: string;
  duration?: number; // for videos
  tags: string[];
  usage_count: number;
  last_used?: string;
  uploaded_by: string;
  uploaded_at: string;
  metadata?: Record<string, any>;
}

// Content Approval
export interface ContentApproval {
  id: string;
  content_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  approvers: Array<{
    id: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    decided_at?: string;
    assigned_at: string;
  }>;
  submission_date: string;
  due_date: string;
  comments: Array<{
    id: string;
    author_id: string;
    content: string;
    created_at: string;
    is_internal: boolean;
  }>;
  revision_history: Array<{
    version: number;
    changes: string[];
    submitted_by: string;
    submitted_at: string;
    approved_at?: string;
  }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Content Workflow Analytics
export interface ContentWorkflowAnalytics {
  total_workflows: number;
  active_workflows: number;
  completed_workflows: number;
  avg_approval_time: number; // in hours
  approval_rates: {
    first_attempt: number;
    with_revisions: number;
    rejected: number;
  };
  bottleneck_analysis: Array<{
    stage: string;
    avg_duration: number;
    approval_rate: number;
    revision_rate: number;
  }>;
  team_performance: Record<string, TeamPerformance>;
}

export interface TeamPerformance {
  total_reviews: number;
  avg_review_time: number;
  approval_rate: number;
  revision_rate: number;
  on_time_delivery: number;
}

// Content Asset Creation
export interface CreateContentAsset {
  title: string;
  description: string;
  type: 'video' | 'image' | 'carousel' | 'story' | 'blog' | 'reel' | 'live';
  campaign_id: string;
  kol_id: string;
  platform: string;
  content: {
    text: string;
    media?: Array<{
      type: string;
      url: string;
      thumbnail?: string;
      duration?: number;
      size?: string;
      alt_text?: string;
    }>;
    hashtags?: string[];
    mentions?: string[];
    links?: string[];
    location?: {
      name: string;
      latitude?: number;
      longitude?: number;
    };
  };
  scheduled_for?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Content Scheduling
export interface ContentSchedule {
  id: string;
  content_id: string;
  platform: string;
  scheduled_time: string;
  timezone: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  auto_publish: boolean;
  publish_attempts: number;
  last_attempt?: string;
  published_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// Content Collaboration
export interface ContentCollaboration {
  id: string;
  content_id: string;
  collaborators: Array<{
    user_id: string;
    role: 'creator' | 'reviewer' | 'approver';
    permissions: string[];
    joined_at: string;
    last_active?: string;
  }>;
  comments: Array<{
    id: string;
    user_id: string;
    content: string;
    timestamp: string;
    resolved: boolean;
    replies: Array<{
      id: string;
      user_id: string;
      content: string;
      timestamp: string;
    }>;
  }>;
  version_history: Array<{
    version: number;
    changes: string[];
    author_id: string;
    timestamp: string;
    diff_url?: string;
  }>;
  current_version: number;
  is_locked: boolean;
  locked_by?: string;
  locked_at?: string;
  created_at: string;
  updated_at: string;
}

// Export all types
export {
  ContentAsset,
  ContentPerformance,
  ContentCalendar,
  ContentAnalytics,
  ContentTemplate,
  ContentWorkflow,
  WorkflowStage,
  PostPerformance,
  AssetLibrary,
  Asset,
  ContentApproval,
  ContentWorkflowAnalytics,
  TeamPerformance,
  CreateContentAsset,
  ContentSchedule,
  ContentCollaboration
};