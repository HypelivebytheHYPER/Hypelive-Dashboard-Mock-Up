/**
 * Server-side API Client
 * For use in Server Components and Server Actions only
 */

import { ApiClient } from './api-client-core'
import { logger } from '@/lib/core/observability/logger'

// Create server-side API client instance
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

// Server-side data fetching functions (no React cache needed on server)
export const getDashboardData = async (timeframe: string) => {
  logger.debug('Fetching dashboard data (server)', { timeframe })
  return await apiClient.get(`/analytics/dashboard?timeframe=${timeframe}`, undefined, {
    ttl: 300,
    tags: ['dashboard', 'metrics', timeframe]
  })
}

export const getCampaignData = async (campaignId: string) => {
  logger.debug('Fetching campaign data (server)', { campaignId })
  return await apiClient.get(`/analytics/campaigns/${campaignId}`, undefined, {
    ttl: 600,
    tags: ['campaign', 'analytics', campaignId]
  })
}

export const getKolData = async (kolId: string) => {
  logger.debug('Fetching KOL data (server)', { kolId })
  return await apiClient.get(`/analytics/kols/${kolId}`, undefined, {
    ttl: 900,
    tags: ['kol', 'analytics', kolId]
  })
}

export const getRealTimeData = async () => {
  logger.debug('Fetching real-time data (server)')
  return await apiClient.get('/analytics/realtime', undefined, {
    ttl: 60,
    tags: ['realtime', 'metrics']
  })
}

// Export for server components and server actions
export { apiClient as default, apiClient as serverApiClient }
