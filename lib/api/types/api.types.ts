/**
 * API Type Definitions
 * Common types for API responses, errors, and request/response structures
 */

/**
 * Generic type for error details
 * Use specific types when possible instead of Record<string, unknown>
 */
export type ErrorDetails = Record<string, unknown>;

/**
 * API Error with typed details
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: ErrorDetails
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API Response Wrapper with generic data type
 * @template T - Type of the response data
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: ErrorDetails;
  };
  metadata?: {
    timestamp: string;
    request_id: string;
    version: string;
    processing_time: number;
  };
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// Filters
export interface BaseFilters {
  search?: string;
  date_from?: string;
  date_to?: string;
  status?: string | string[];
  platform?: string | string[];
  tags?: string[];
}

export interface CampaignFilters extends BaseFilters {
  campaign_type?: string;
  budget_min?: number;
  budget_max?: number;
  kol_count_min?: number;
  kol_count_max?: number;
  is_active?: boolean;
}

export interface KolFilters extends BaseFilters {
  follower_count_min?: number;
  follower_count_max?: number;
  engagement_rate_min?: number;
  engagement_rate_max?: number;
  categories?: string[];
  locations?: string[];
  price_range_min?: number;
  price_range_max?: number;
}

export interface ContentFilters extends BaseFilters {
  content_type?: string;
  campaign_id?: string;
  kol_id?: string;
  is_approved?: boolean;
  is_published?: boolean;
  has_performance?: boolean;
}

/**
 * Demographic information structure
 */
export interface Demographics {
  age_range?: string;
  gender?: string;
  income_level?: string;
  education?: string;
  occupation?: string;
  marital_status?: string;
  [key: string]: string | undefined;
}

/**
 * KPI metrics structure
 */
export interface KPIMetrics {
  target_reach?: number;
  target_engagement?: number;
  target_conversions?: number;
  target_roi?: number;
  [key: string]: number | undefined;
}

/**
 * Performance metrics structure
 */
export interface PerformanceMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  click_through_rate?: number;
  conversion_rate?: number;
  [key: string]: number | undefined;
}

// API Request/Response Types
export interface CreateCampaignRequest {
  name: string;
  description: string;
  type: string;
  budget: number;
  start_date: string;
  end_date: string;
  target_audience: {
    demographics: Demographics;
    interests: string[];
    locations: string[];
  };
  goals: {
    primary: string;
    secondary?: string[];
    kpis: KPIMetrics;
  };
  platforms: string[];
  content_requirements?: {
    types: string[];
    themes: string[];
    guidelines: string[];
  };
}

export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  target_audience?: {
    demographics?: Demographics;
    interests?: string[];
    locations?: string[];
  };
  goals?: {
    primary?: string;
    secondary?: string[];
    kpis?: KPIMetrics;
  };
  platforms?: string[];
}

export interface CreateKolRequest {
  name: string;
  platform: string;
  platform_username: string;
  follower_count: number;
  categories: string[];
  location: string;
  contact_info: {
    email: string;
    phone?: string;
    line_id?: string;
  };
  demographics: {
    age?: number;
    gender?: string;
    language?: string[];
  };
  pricing: {
    post_rate?: number;
    story_rate?: number;
    video_rate?: number;
    package_deals?: Record<string, number>;
  };
  portfolio: {
    previous_campaigns?: string[];
    content_samples?: string[];
    performance_metrics?: PerformanceMetrics;
  };
}

export interface CreateContentRequest {
  title: string;
  description: string;
  type: string;
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
    }>;
    hashtags?: string[];
    mentions?: string[];
  };
  scheduled_for?: string;
  tags?: string[];
  metadata?: ContentMetadata;
}

/**
 * Content metadata structure
 */
export interface ContentMetadata {
  category?: string;
  language?: string;
  accessibility?: string;
  copyright?: string;
  [key: string]: string | undefined;
}

// API Client Configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
  auth?: {
    type: 'bearer' | 'api_key' | 'basic';
    token?: string;
    api_key?: string;
    username?: string;
    password?: string;
  };
}

// Cache Configuration
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  tags?: string[];
  stale_while_revalidate?: number;
  priority?: 'high' | 'medium' | 'low';
}

// Rate Limiting
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // timestamp
  retry_after?: number;
}

/**
 * Webhook event data
 * Generic type for flexibility while maintaining type safety
 */
export type WebhookEventData = Record<string, unknown>;

// Webhook Events
export interface WebhookEvent {
  id: string;
  type: string;
  timestamp: string;
  data: WebhookEventData;
  signature?: string;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
  last_triggered?: string;
}

/**
 * File metadata structure
 */
export interface FileMetadata {
  description?: string;
  alt_text?: string;
  tags?: string[];
  category?: string;
  [key: string]: string | string[] | undefined;
}

// File Upload
export interface FileUploadRequest {
  file: File;
  purpose: 'content' | 'profile' | 'document' | 'other';
  metadata?: FileMetadata;
}

export interface FileUploadResponse {
  file_id: string;
  url: string;
  filename: string;
  size: number;
  mime_type: string;
  uploaded_at: string;
}

// Export/Import
export interface ExportRequest {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  entity_type: 'campaigns' | 'kols' | 'content' | 'analytics';
  filters?: BaseFilters;
  date_range?: {
    start: string;
    end: string;
  };
  include_metadata?: boolean;
}

export interface ExportResponse {
  export_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_url?: string;
  file_size?: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

/**
 * Bulk update data structure
 * Use specific types when possible
 */
export type BulkUpdateData = Record<string, unknown>;

// Bulk Operations
export interface BulkOperationRequest {
  operation: 'update' | 'delete' | 'export';
  entity_type: string;
  entity_ids: string[];
  updates?: BulkUpdateData;
}

export interface BulkOperationResponse {
  operation_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_items: number;
  processed_items: number;
  successful_items: number;
  failed_items: number;
  errors?: Array<{
    entity_id: string;
    error: string;
  }>;
  started_at: string;
  completed_at?: string;
}

// Search
export interface SearchRequest {
  query: string;
  entity_types?: ('campaigns' | 'kols' | 'content' | 'analytics')[];
  filters?: BaseFilters;
  limit?: number;
  include_related?: boolean;
}

/**
 * Search result metadata
 */
export interface SearchResultMetadata {
  highlights?: string[];
  matched_fields?: string[];
  category?: string;
  [key: string]: string | string[] | undefined;
}

export interface SearchResponse {
  query: string;
  results: Array<{
    entity_type: string;
    entity_id: string;
    title: string;
    description: string;
    relevance_score: number;
    metadata?: SearchResultMetadata;
  }>;
  total_results: number;
  search_time: number; // milliseconds
}

// Analytics
export interface AnalyticsRequest {
  metric: string;
  timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year';
  entity_type?: 'campaign' | 'kol' | 'platform' | 'content';
  entity_id?: string;
  group_by?: 'day' | 'week' | 'month';
  filters?: BaseFilters;
  comparison_period?: {
    previous: boolean;
    year_over_year: boolean;
  };
}

export interface AnalyticsResponse {
  metric: string;
  timeframe: string;
  data: Array<{
    date: string;
    value: number;
    breakdown?: Record<string, number>;
  }>;
  summary: {
    total: number;
    average: number;
    min: number;
    max: number;
    change?: number;
    change_percentage?: number;
  };
  comparison?: {
    previous_period?: {
      total: number;
      change: number;
      change_percentage: number;
    };
    year_over_year?: {
      total: number;
      change: number;
      change_percentage: number;
    };
  };
}

/**
 * Integration credentials structure
 * Store sensitive data securely
 */
export interface IntegrationCredentials {
  api_key?: string;
  api_secret?: string;
  access_token?: string;
  refresh_token?: string;
  [key: string]: string | undefined;
}

/**
 * Integration settings structure
 */
export interface IntegrationSettings {
  sync_frequency?: string;
  auto_sync?: boolean;
  data_mapping?: Record<string, string>;
  [key: string]: string | boolean | Record<string, string> | undefined;
}

// Integration Types
export interface IntegrationConfig {
  platform: string;
  is_enabled: boolean;
  credentials: IntegrationCredentials;
  settings: IntegrationSettings;
  webhook_url?: string;
  last_sync?: string;
  sync_status: 'active' | 'paused' | 'error';
}

export interface IntegrationStatus {
  platform: string;
  status: 'connected' | 'disconnected' | 'error';
  last_sync: string;
  last_error?: string;
  metrics: {
    total_synced: number;
    failed_syncs: number;
    avg_sync_time: number;
  };
}

// Notification Types
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  in_app: boolean;
  categories: {
    campaign_updates: boolean;
    kol_activity: boolean;
    content_approval: boolean;
    performance_alerts: boolean;
    system_updates: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
  quiet_hours?: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

/**
 * Notification metadata structure
 */
export interface NotificationMetadata {
  entity_type?: string;
  entity_id?: string;
  action_type?: string;
  user_id?: string;
  [key: string]: string | undefined;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
  metadata?: NotificationMetadata;
  action_url?: string;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetails;
    validation_errors?: ValidationError[];
  };
  metadata: {
    timestamp: string;
    request_id: string;
    version: string;
  };
}

// Export all types
export {
  ApiError,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  BaseFilters,
  CampaignFilters,
  KolFilters,
  ContentFilters,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CreateKolRequest,
  CreateContentRequest,
  ApiClientConfig,
  CacheConfig,
  RateLimitInfo,
  WebhookEvent,
  WebhookSubscription,
  FileUploadRequest,
  FileUploadResponse,
  ExportRequest,
  ExportResponse,
  BulkOperationRequest,
  BulkOperationResponse,
  SearchRequest,
  SearchResponse,
  AnalyticsRequest,
  AnalyticsResponse,
  IntegrationConfig,
  IntegrationStatus,
  NotificationPreferences,
  Notification,
  ValidationError,
  ApiErrorResponse
};