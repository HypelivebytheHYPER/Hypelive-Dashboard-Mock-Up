"use client"

/**
 * Enhanced API Client for Next.js 16 with React 19 optimizations
 * Centralized HTTP client with advanced caching, retry logic, and performance optimizations
 */

import { cache } from 'react'
import { logger } from '@/lib/core/observability/logger'
import { ApiError, ApiResponse, ApiClientConfig, RateLimitInfo, CacheConfig } from '../types/api.types'

// ====================
// TYPE DEFINITIONS
// ====================

export interface EnhancedApiClientConfig extends ApiClientConfig {
  enableMetrics?: boolean
  enableRetry?: boolean
  enableCaching?: boolean
  priorityRequests?: string[]
  circuitBreaker?: {
    enabled: boolean
    failureThreshold: number
    resetTimeout: number
  }
}

export interface RequestMetrics {
  url: string
  method: string
  duration: number
  status: number
  cached: boolean
  retryCount: number
  timestamp: string
}

export interface CircuitBreakerState {
  failures: number
  lastFailureTime: number
  state: 'closed' | 'open' | 'half-open'
}

// ====================
// MAIN API CLIENT CLASS
// ====================

export class ApiClient {
  private config: EnhancedApiClientConfig
  private cache: Map<string, { data: any; expires: number; tags: string[]; hits: number }>
  private rateLimitInfo: Map<string, RateLimitInfo>
  private circuitBreakers: Map<string, CircuitBreakerState>
  private metrics: RequestMetrics[]

  constructor(config: EnhancedApiClientConfig) {
    this.config = {
      ...config,
      timeout: config.timeout || 30000,
      enableMetrics: config.enableMetrics ?? true,
      enableRetry: config.enableRetry ?? true,
      enableCaching: config.enableCaching ?? true,
      priorityRequests: config.priorityRequests ?? [],
      circuitBreaker: config.circuitBreaker ?? {
        enabled: true,
        failureThreshold: 5,
        resetTimeout: 60000
      }
    }
    
    this.cache = new Map()
    this.rateLimitInfo = new Map()
    this.circuitBreakers = new Map()
    this.metrics = []
    
    // Start cleanup interval
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanupCache(), 60000)
      setInterval(() => this.cleanupMetrics(), 300000)
    }
  }

  // ====================
// HTTP METHODS
// ====================

  /**
   * GET request with React 19 caching and optimizations
   */
  async get<T>(url: string, params?: Record<string, any>, cacheConfig?: CacheConfig): Promise<T> {
    return this.request<T>('GET', url, undefined, params, cacheConfig)
  }

  /**
   * POST request with optimizations
   */
  async post<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>('POST', url, data, params)
  }

  /**
   * PUT request with optimizations
   */
  async put<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>('PUT', url, data, params)
  }

  /**
   * PATCH request with optimizations
   */
  async patch<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>('PATCH', url, data, params)
  }

  /**
   * DELETE request with optimizations
   */
  async delete<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>('DELETE', url, undefined, params)
  }

  /**
   * Upload file with progress tracking and optimizations
   */
  async upload<T>(url: string, file: File, metadata?: Record<string, any>, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (metadata) {
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key])
      })
    }

    return this.request<T>('POST', url, formData, undefined, undefined, onProgress)
  }

  // ====================
// CORE REQUEST METHOD
// ====================

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    params?: Record<string, any>,
    cacheConfig?: CacheConfig,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const startTime = performance.now()
    const requestId = this.generateRequestId()
    
    // Check circuit breaker
    if (!this.checkCircuitBreaker(url)) {
      throw new ApiError(503, 'Circuit breaker is open')
    }
    
    // Build full URL
    const fullUrl = this.buildUrl(url, params)
    
    // Check cache for GET requests
    if (method === 'GET' && cacheConfig && this.config.enableCaching) {
      const cachedData = this.getFromCache(fullUrl, cacheConfig.tags)
      if (cachedData) {
        this.recordMetrics(fullUrl, method, 200, startTime, true, 0)
        return cachedData.data
      }
    }

    // Check rate limiting
    await this.checkRateLimit(url)

    // Create request options with optimizations
    const requestOptions: RequestInit = {
      method,
      headers: this.buildHeaders(data),
      signal: AbortSignal.timeout(this.config.timeout),
      // Next.js 16 optimizations
      priority: this.getRequestPriority(method, url),
      keepalive: method === 'POST' || method === 'PUT',
    }

    if (data && !(data instanceof FormData)) {
      requestOptions.body = JSON.stringify(data)
    } else if (data instanceof FormData) {
      requestOptions.body = data
    }

    let attempt = 0
    const maxRetries = this.config.enableRetry ? this.config.retries : 0

    while (attempt <= maxRetries) {
      try {
        logger.debug(`API request attempt ${attempt + 1}`, {
          method,
          url: fullUrl,
          requestId,
          attempt: attempt + 1,
          priority: requestOptions.priority,
          circuitBreaker: this.getCircuitBreakerState(url)?.state
        })

        const response = await fetch(fullUrl, requestOptions)
        
        // Update rate limit info
        this.updateRateLimitInfo(url, response)

        const duration = performance.now() - startTime
        
        // Record metrics
        this.recordMetrics(fullUrl, method, response.status, duration, false, attempt)

        if (!response.ok) {
          throw await this.createApiError(response)
        }

        // Handle progress for file uploads
        if (onProgress && response.body) {
          return await this.handleProgressResponse(response, onProgress)
        }

        const responseData = await this.parseResponse(response)
        
        // Update circuit breaker success
        this.updateCircuitBreakerSuccess(url)
        
        // Cache successful GET responses
        if (method === 'GET' && cacheConfig && this.config.enableCaching && responseData) {
          this.setCache(fullUrl, responseData, cacheConfig)
        }

        return responseData

      } catch (error) {
        attempt++
        
        // Update circuit breaker failure
        this.updateCircuitBreakerFailure(url, error)
        
        if (attempt > maxRetries) {
          logger.error(`API request failed after ${maxRetries} retries`, {
            method,
            url: fullUrl,
            requestId,
            error: error instanceof Error ? error.message : String(error),
            duration: performance.now() - startTime,
            circuitBreaker: this.getCircuitBreakerState(url)?.state
          })
          throw error
        }

        // Check if error is retryable
        if (!this.isRetryableError(error)) {
          throw error
        }

        // Wait before retrying with exponential backoff
        await this.waitBeforeRetry(attempt)
        
        logger.warn(`Retrying API request after failed attempt ${attempt}`, {
          method,
          url: fullUrl,
          requestId,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    throw new ApiError(500, 'Max retries exceeded')
  }

  // ====================
// UTILITY METHODS
// ====================

  /**
   * Build full URL with parameters
   */
  private buildUrl(url: string, params?: Record<string, any>): string {
    const baseUrl = url.startsWith('http') ? url : `${this.config.baseURL}${url}`
    
    if (!params || Object.keys(params).length === 0) {
      return baseUrl
    }

    const urlParams = new URLSearchParams()
    
    Object.keys(params).forEach(key => {
      const value = params[key]
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => urlParams.append(key, String(v)))
        } else {
          urlParams.append(key, String(value))
        }
      }
    })

    return `${baseUrl}?${urlParams.toString()}`
  }

  /**
   * Build request headers with optimizations
   */
  private buildHeaders(data?: any): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-Request-ID': this.generateRequestId(),
      'User-Agent': 'Hypelive-Dashboard-Client/1.0 (Next.js 16)',
      'Cache-Control': data ? 'no-cache' : 'no-cache',
      'X-Client-Version': '16.0.3',
      'X-Performance-Optimized': 'true'
    }

    // Add authentication headers
    if (this.config.auth) {
      switch (this.config.auth.type) {
        case 'bearer':
          if (this.config.auth.token) {
            headers['Authorization'] = `Bearer ${this.config.auth.token}`
          }
          break
        case 'api_key':
          if (this.config.auth.api_key) {
            headers['X-API-Key'] = this.config.auth.api_key
          }
          break
        case 'basic':
          if (this.config.auth.username && this.config.auth.password) {
            const basicAuth = btoa(`${this.config.auth.username}:${this.config.auth.password}`)
            headers['Authorization'] = `Basic ${basicAuth}`
          }
          break
      }
    }

    // Add custom headers
    if (this.config.headers) {
      Object.assign(headers, this.config.headers)
    }

    // Add content-type for non-file uploads
    if (data && !(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }

  /**
   * Get request priority for Next.js 16 optimizations
   */
  private getRequestPriority(method: string, url: string): 'high' | 'low' {
    if (method === 'GET') return 'high'
    if (this.config.priorityRequests?.some(pattern => url.includes(pattern))) return 'high'
    return 'low'
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      return await response.json()
    } else if (contentType?.includes('text/')) {
      return await response.text()
    } else if (contentType?.includes('application/octet-stream') || contentType?.includes('image/')) {
      return await response.blob()
    } else {
      return await response.text()
    }
  }

  /**
   * Create API error from response
   */
  private async createApiError(response: Response): Promise<ApiError> {
    let errorData: any
    try {
      errorData = await response.json()
    } catch {
      errorData = await response.text()
    }

    const errorMessage = errorData?.message || errorData || `HTTP ${response.status}`
    
    return new ApiError(
      response.status,
      errorMessage,
      {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData,
        timestamp: new Date().toISOString(),
        requestId: response.headers.get('X-Request-ID')
      }
    )
  }

  /**
   * Handle progress for file uploads
   */
  private async handleProgressResponse<T>(response: Response, onProgress: (progress: number) => void): Promise<T> {
    const reader = response.body!.getReader()
    const contentLength = parseInt(response.headers.get('content-length') || '0')
    let receivedLength = 0
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      chunks.push(value)
      receivedLength += value.length
      
      // Calculate and report progress
      if (contentLength > 0) {
        const progress = Math.round((receivedLength / contentLength) * 100)
        onProgress(progress)
      }
    }

    // Combine chunks into final result
    const result = new Uint8Array(receivedLength)
    let position = 0
    for (const chunk of chunks) {
      result.set(chunk, position)
      position += chunk.length
    }

    // Parse the final result
    const text = new TextDecoder().decode(result)
    try {
      return JSON.parse(text)
    } catch {
      return text as T
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true
    }

    // Timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      return true
    }

    // API errors with retryable status codes
    if (error instanceof ApiError) {
      const retryableStatuses = [408, 429, 500, 502, 503, 504]
      return retryableStatuses.includes(error.statusCode)
    }

    return false
  }

  /**
   * Wait before retrying with exponential backoff
   */
  private async waitBeforeRetry(attempt: number): Promise<void> {
    const baseDelay = 1000 // 1 second
    const maxDelay = 30000 // 30 seconds
    const jitter = Math.random() * 1000 // Add jitter to prevent thundering herd
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1) + jitter, maxDelay)
    
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  // ====================
// CIRCUIT BREAKER
// ====================

  /**
   * Check circuit breaker state
   */
  private checkCircuitBreaker(url: string): boolean {
    if (!this.config.circuitBreaker?.enabled) return true
    
    const state = this.getCircuitBreakerState(url)
    
    if (state.state === 'open') {
      const now = Date.now()
      if (now - state.lastFailureTime > (this.config.circuitBreaker?.resetTimeout || 60000)) {
        state.state = 'half-open'
        state.failures = 0
        return true
      }
      return false
    }
    
    return true
  }

  /**
   * Get circuit breaker state
   */
  private getCircuitBreakerState(url: string): CircuitBreakerState {
    let state = this.circuitBreakers.get(url)
    
    if (!state) {
      state = {
        failures: 0,
        lastFailureTime: 0,
        state: 'closed'
      }
      this.circuitBreakers.set(url, state)
    }
    
    return state
  }

  /**
   * Update circuit breaker on success
   */
  private updateCircuitBreakerSuccess(url: string): void {
    const state = this.getCircuitBreakerState(url)
    if (state.state === 'half-open') {
      state.state = 'closed'
      state.failures = 0
    }
  }

  /**
   * Update circuit breaker on failure
   */
  private updateCircuitBreakerFailure(url: string, error: any): void {
    if (!this.config.circuitBreaker?.enabled) return
    
    const state = this.getCircuitBreakerState(url)
    state.failures++
    state.lastFailureTime = Date.now()
    
    if (state.failures >= (this.config.circuitBreaker?.failureThreshold || 5)) {
      state.state = 'open'
      logger.warn('Circuit breaker opened', { url, failures: state.failures })
    }
  }

  // ====================
// RATE LIMITING
// ====================

  /**
   * Check rate limiting
   */
  private async checkRateLimit(url: string): Promise<void> {
    const rateLimitInfo = this.rateLimitInfo.get(url)
    
    if (rateLimitInfo && rateLimitInfo.remaining === 0) {
      const now = Date.now()
      const resetTime = rateLimitInfo.reset * 1000
      
      if (now < resetTime) {
        const waitTime = resetTime - now
        logger.warn(`Rate limit exceeded, waiting ${waitTime}ms`, { url })
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  /**
   * Update rate limit info from response headers
   */
  private updateRateLimitInfo(url: string, response: Response): void {
    const limit = response.headers.get('X-RateLimit-Limit')
    const remaining = response.headers.get('X-RateLimit-Remaining')
    const reset = response.headers.get('X-RateLimit-Reset')
    const retryAfter = response.headers.get('Retry-After')

    if (limit && remaining && reset) {
      this.rateLimitInfo.set(url, {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        retry_after: retryAfter ? parseInt(retryAfter) : undefined
      })
    }
  }

  // ====================
// CACHING SYSTEM
// ====================

  /**
   * Get from cache
   */
  private getFromCache(key: string, tags?: string[]): { data: any; hits: number } | null {
    const cached = this.cache.get(key)
    
    if (!cached) {
      return null
    }

    // Check if expired
    if (Date.now() > cached.expires) {
      this.cache.delete(key)
      return null
    }

    // Increment hit counter
    cached.hits++
    
    return { data: cached.data, hits: cached.hits }
  }

  /**
   * Set cache
   */
  private setCache(key: string, data: any, config: CacheConfig): void {
    const expires = Date.now() + (config.ttl * 1000)
    
    this.cache.set(key, {
      data,
      expires,
      tags: config.tags || [],
      hits: 0
    })

    logger.debug('Data cached', { key, ttl: config.ttl, tags: config.tags })
  }

  /**
   * Invalidate cache by tags
   */
  public invalidateCache(tags: string[]): void {
    const keysToDelete: string[] = []
    
    for (const [key, cached] of this.cache.entries()) {
      if (cached.tags.some(tag => tags.includes(tag))) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key)
      logger.debug('Cache invalidated', { key, tags })
    })
  }

  /**
   * Cleanup expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expires) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key)
      logger.debug('Expired cache entry cleaned up', { key })
    })

    if (keysToDelete.length > 0) {
      logger.info('Cache cleanup completed', { cleaned_count: keysToDelete.length })
    }
  }

  // ====================
// METRICS AND MONITORING
// ====================

  /**
   * Record request metrics
   */
  private recordMetrics(
    url: string,
    method: string,
    status: number,
    duration: number,
    cached: boolean,
    retryCount: number
  ): void {
    if (!this.config.enableMetrics) return
    
    const metric: RequestMetrics = {
      url,
      method,
      duration,
      status,
      cached,
      retryCount,
      timestamp: new Date().toISOString()
    }
    
    this.metrics.push(metric)
    
    // Log performance metrics
    logger.logApiCall(method, url, status, duration, {
      cached,
      retryCount,
      circuitBreaker: this.getCircuitBreakerState(url)?.state
    })
  }

  /**
   * Cleanup old metrics
   */
  private cleanupMetrics(): void {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000 // 24 hours
    this.metrics = this.metrics.filter(metric => 
      new Date(metric.timestamp).getTime() > cutoff
    )
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): RequestMetrics[] {
    return [...this.metrics]
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    total_entries: number
    memory_usage: number
    hit_rate: number
    miss_rate: number
    avg_hits: number
  } {
    let memoryUsage = 0
    let totalHits = 0
    let totalRequests = 0
    
    for (const [key, value] of this.cache.entries()) {
      memoryUsage += key.length * 2
      memoryUsage += JSON.stringify(value).length * 2
      totalHits += value.hits
      totalRequests += value.hits + 1 // +1 for the initial request
    }

    return {
      total_entries: this.cache.size,
      memory_usage: memoryUsage,
      hit_rate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
      miss_rate: totalRequests > 0 ? ((totalRequests - totalHits) / totalRequests) * 100 : 0,
      avg_hits: this.cache.size > 0 ? totalHits / this.cache.size : 0
    }
  }

  // ====================
// UTILITY METHODS
// ====================

  /**
   * Generate request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Update auth token
   */
  public setAuthToken(token: string): void {
    if (this.config.auth && this.config.auth.type === 'bearer') {
      this.config.auth.token = token
    }
  }

  /**
   * Update base URL
   */
  public setBaseURL(url: string): void {
    this.config.baseURL = url
  }

  /**
   * Get rate limit info for a specific URL
   */
  public getRateLimitInfo(url: string): RateLimitInfo | undefined {
    return this.rateLimitInfo.get(url)
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear()
    logger.info('Cache cleared')
  }

  /**
   * Get circuit breaker states
   */
  public getCircuitBreakerStates(): Record<string, CircuitBreakerState> {
    return Object.fromEntries(this.circuitBreakers)
  }
}

// ====================
// CACHED API FUNCTIONS
// ====================

// Create optimized API client instance with React 19 cache
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  retries: 3,
  enableMetrics: true,
  enableRetry: true,
  enableCaching: true,
  priorityRequests: ['/analytics/dashboard', '/analytics/realtime'],
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': '16.0.3',
    'X-Performance-Optimized': 'true'
  },
  circuitBreaker: {
    enabled: true,
    failureThreshold: 5,
    resetTimeout: 60000
  }
})

// Create cached API functions using React 19 cache
export const getCachedDashboardData = cache(async (timeframe: string) => {
  logger.debug('Fetching cached dashboard data', { timeframe })
  return await apiClient.get(`/analytics/dashboard?timeframe=${timeframe}`, undefined, {
    ttl: 300,
    tags: ['dashboard', 'metrics', timeframe]
  })
})

export const getCachedCampaignData = cache(async (campaignId: string) => {
  logger.debug('Fetching cached campaign data', { campaignId })
  return await apiClient.get(`/analytics/campaigns/${campaignId}`, undefined, {
    ttl: 600,
    tags: ['campaign', 'analytics', campaignId]
  })
})

export const getCachedKolData = cache(async (kolId: string) => {
  logger.debug('Fetching cached KOL data', { kolId })
  return await apiClient.get(`/analytics/kols/${kolId}`, undefined, {
    ttl: 900,
    tags: ['kol', 'analytics', kolId]
  })
})

export const getCachedRealTimeData = cache(async () => {
  logger.debug('Fetching cached real-time data')
  return await apiClient.get('/analytics/realtime', undefined, {
    ttl: 60,
    tags: ['realtime', 'metrics']
  })
})

// Export enhanced configuration type
export type { EnhancedApiClientConfig, RequestMetrics, CircuitBreakerState }

// Export service instance and cached functions
export { apiClient, getCachedDashboardData, getCachedCampaignData, getCachedKolData, getCachedRealTimeData }