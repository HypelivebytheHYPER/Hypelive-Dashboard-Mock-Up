/**
 * Core API Client (Server & Client Compatible)
 * Centralized HTTP client with advanced caching, retry logic, and performance optimizations
 *
 * This is the core implementation that works in both server and client contexts
 */

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
  }

  // ====================
  // HTTP METHODS
  // ====================

  async get<T>(url: string, params?: Record<string, any>, cacheConfig?: CacheConfig): Promise<T> {
    return this.request<T>('GET', url, undefined, params, cacheConfig)
  }

  async post<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>('POST', url, data, params)
  }

  async put<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>('PUT', url, data, params)
  }

  async patch<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>('PATCH', url, data, params)
  }

  async delete<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>('DELETE', url, undefined, params)
  }

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

    if (!this.checkCircuitBreaker(url)) {
      throw new ApiError(503, 'Circuit breaker is open')
    }

    const fullUrl = this.buildUrl(url, params)

    if (method === 'GET' && cacheConfig && this.config.enableCaching) {
      const cachedData = this.getFromCache(fullUrl, cacheConfig.tags)
      if (cachedData) {
        this.recordMetrics(fullUrl, method, 200, performance.now() - startTime, true, 0)
        return cachedData.data
      }
    }

    await this.checkRateLimit(url)

    const requestOptions: RequestInit = {
      method,
      headers: this.buildHeaders(data),
      signal: AbortSignal.timeout(this.config.timeout),
    }

    if (data && !(data instanceof FormData)) {
      requestOptions.body = JSON.stringify(data)
    } else if (data instanceof FormData) {
      requestOptions.body = data
    }

    let attempt = 0
    const maxRetries = this.config.enableRetry ? (this.config.retries || 0) : 0

    while (attempt <= maxRetries) {
      try {
        logger.debug(`API request attempt ${attempt + 1}`, {
          method,
          url: fullUrl,
          requestId,
          attempt: attempt + 1,
        })

        const response = await fetch(fullUrl, requestOptions)

        this.updateRateLimitInfo(url, response)
        const duration = performance.now() - startTime
        this.recordMetrics(fullUrl, method, response.status, duration, false, attempt)

        if (!response.ok) {
          throw await this.createApiError(response)
        }

        if (onProgress && response.body) {
          return await this.handleProgressResponse(response, onProgress)
        }

        const responseData = await this.parseResponse(response)
        this.updateCircuitBreakerSuccess(url)

        if (method === 'GET' && cacheConfig && this.config.enableCaching && responseData) {
          this.setCache(fullUrl, responseData, cacheConfig)
        }

        return responseData

      } catch (error) {
        attempt++
        this.updateCircuitBreakerFailure(url, error)

        if (attempt > maxRetries) {
          logger.error(`API request failed after ${maxRetries} retries`, {
            method,
            url: fullUrl,
            requestId,
            error: error instanceof Error ? error.message : String(error),
            duration: performance.now() - startTime,
          })
          throw error
        }

        if (!this.isRetryableError(error)) {
          throw error
        }

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

  private buildHeaders(data?: any): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-Request-ID': this.generateRequestId(),
      'User-Agent': 'Hypelive-Dashboard-Client/1.0 (Next.js 16)',
      'Cache-Control': data ? 'no-cache' : 'no-cache',
      'X-Client-Version': '16.0.3',
      'X-Performance-Optimized': 'true'
    }

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

    if (this.config.headers) {
      Object.assign(headers, this.config.headers)
    }

    if (data && !(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }

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

      if (contentLength > 0) {
        const progress = Math.round((receivedLength / contentLength) * 100)
        onProgress(progress)
      }
    }

    const result = new Uint8Array(receivedLength)
    let position = 0
    for (const chunk of chunks) {
      result.set(chunk, position)
      position += chunk.length
    }

    const text = new TextDecoder().decode(result)
    try {
      return JSON.parse(text)
    } catch {
      return text as T
    }
  }

  private isRetryableError(error: any): boolean {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return true
    }

    if (error instanceof ApiError) {
      const retryableStatuses = [408, 429, 500, 502, 503, 504]
      return retryableStatuses.includes(error.statusCode)
    }

    return false
  }

  private async waitBeforeRetry(attempt: number): Promise<void> {
    const baseDelay = 1000
    const maxDelay = 30000
    const jitter = Math.random() * 1000
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1) + jitter, maxDelay)

    await new Promise(resolve => setTimeout(resolve, delay))
  }

  // Circuit Breaker methods
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

  private updateCircuitBreakerSuccess(url: string): void {
    const state = this.getCircuitBreakerState(url)
    if (state.state === 'half-open') {
      state.state = 'closed'
      state.failures = 0
    }
  }

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

  // Rate Limiting
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

  // Caching
  private getFromCache(key: string, tags?: string[]): { data: any; hits: number } | null {
    const cached = this.cache.get(key)

    if (!cached) {
      return null
    }

    if (Date.now() > cached.expires) {
      this.cache.delete(key)
      return null
    }

    cached.hits++
    return { data: cached.data, hits: cached.hits }
  }

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

  // Metrics
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
    logger.logApiCall(method, url, status, duration, { cached, retryCount })
  }

  public getMetrics(): RequestMetrics[] {
    return [...this.metrics]
  }

  public getCacheStats() {
    let memoryUsage = 0
    let totalHits = 0
    let totalRequests = 0

    for (const [key, value] of this.cache.entries()) {
      memoryUsage += key.length * 2
      memoryUsage += JSON.stringify(value).length * 2
      totalHits += value.hits
      totalRequests += value.hits + 1
    }

    return {
      total_entries: this.cache.size,
      memory_usage: memoryUsage,
      hit_rate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
      miss_rate: totalRequests > 0 ? ((totalRequests - totalHits) / totalRequests) * 100 : 0,
      avg_hits: this.cache.size > 0 ? totalHits / this.cache.size : 0
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  public setAuthToken(token: string): void {
    if (this.config.auth && this.config.auth.type === 'bearer') {
      this.config.auth.token = token
    }
  }

  public setBaseURL(url: string): void {
    this.config.baseURL = url
  }

  public getRateLimitInfo(url: string): RateLimitInfo | undefined {
    return this.rateLimitInfo.get(url)
  }

  public clearCache(): void {
    this.cache.clear()
    logger.info('Cache cleared')
  }

  public getCircuitBreakerStates(): Record<string, CircuitBreakerState> {
    return Object.fromEntries(this.circuitBreakers)
  }
}

// Export types
export type { EnhancedApiClientConfig, RequestMetrics, CircuitBreakerState }
