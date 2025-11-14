"use client"

/**
 * Client-side API Client
 * For use in Client Components only
 */

import { cache } from 'react'
import { ApiClient } from './api-client-core'
import { logger } from '@/lib/core/observability/logger'

// Create client-side API client instance
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

// Create cached API functions using React 19 cache (client-side only)
export const getCachedDashboardData = cache(async (timeframe: string) => {
  logger.debug('Fetching cached dashboard data (client)', { timeframe })
  return await apiClient.get(`/analytics/dashboard?timeframe=${timeframe}`, undefined, {
    ttl: 300,
    tags: ['dashboard', 'metrics', timeframe]
  })
})

export const getCachedCampaignData = cache(async (campaignId: string) => {
  logger.debug('Fetching cached campaign data (client)', { campaignId })
  return await apiClient.get(`/analytics/campaigns/${campaignId}`, undefined, {
    ttl: 600,
    tags: ['campaign', 'analytics', campaignId]
  })
})

export const getCachedKolData = cache(async (kolId: string) => {
  logger.debug('Fetching cached KOL data (client)', { kolId })
  return await apiClient.get(`/analytics/kols/${kolId}`, undefined, {
    ttl: 900,
    tags: ['kol', 'analytics', kolId]
  })
})

export const getCachedRealTimeData = cache(async () => {
  logger.debug('Fetching cached real-time data (client)')
  return await apiClient.get('/analytics/realtime', undefined, {
    ttl: 60,
    tags: ['realtime', 'metrics']
  })
})

// Export for client components
export { apiClient as default, apiClient as clientApiClient }
