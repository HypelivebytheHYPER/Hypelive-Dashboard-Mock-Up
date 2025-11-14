# API Client Migration Guide

## Overview

The API client has been refactored to fix the architectural issue where the entire 869-line API client was forced to run client-side only due to a `"use client"` directive at the top of the file. This caused:
- Server Components couldn't use the API client
- Increased client bundle size
- Suboptimal performance

## New Architecture

The API client has been split into three files:

### 1. **api-client-core.ts** (Server & Client Compatible)
Core implementation that works in both server and client contexts. Contains:
- `ApiClient` class with all functionality
- Circuit breaker pattern
- Retry logic with exponential backoff
- Rate limiting
- Request/response caching
- Performance metrics
- Type definitions

**Location:** `/lib/api/client/api-client-core.ts`

### 2. **api-client.client.ts** (Client Components Only)
Client-side wrapper with:
- `"use client"` directive
- React 19 `cache()` integration
- Cached data fetching functions:
  - `getCachedDashboardData()`
  - `getCachedCampaignData()`
  - `getCachedKolData()`
  - `getCachedRealTimeData()`
- Pre-configured `apiClient` instance

**Location:** `/lib/api/client/api-client.client.ts`

### 3. **api-client.server.ts** (Server Components & Server Actions)
Server-side wrapper with:
- No `"use client"` directive
- Server-optimized data fetching functions:
  - `getDashboardData()`
  - `getCampaignData()`
  - `getKolData()`
  - `getRealTimeData()`
- Pre-configured `apiClient` instance

**Location:** `/lib/api/client/api-client.server.ts`

## Migration Steps

### For Client Components

**Before:**
```typescript
import { apiClient } from '@/lib/api/client/api-client'

export default function MyClientComponent() {
  const fetchData = async () => {
    const data = await apiClient.get('/api/data')
    return data
  }
  // ...
}
```

**After:**
```typescript
import { apiClient } from '@/lib/api/client/api-client.client'
// Or use the cached functions:
import { getCachedDashboardData } from '@/lib/api/client/api-client.client'

export default function MyClientComponent() {
  const fetchData = async () => {
    // Option 1: Direct API client (same as before)
    const data = await apiClient.get('/api/data')

    // Option 2: Use cached function (recommended for performance)
    const dashboard = await getCachedDashboardData('week')
    return data
  }
  // ...
}
```

### For Server Components

**Before:**
```typescript
// This would throw an error because api-client.ts had "use client"
import { apiClient } from '@/lib/api/client/api-client'

export default async function MyServerComponent() {
  const data = await apiClient.get('/api/data')
  // ...
}
```

**After:**
```typescript
import { apiClient, getDashboardData } from '@/lib/api/client/api-client.server'

export default async function MyServerComponent() {
  // Option 1: Direct API client
  const data = await apiClient.get('/api/data')

  // Option 2: Use server data fetching function (recommended)
  const dashboard = await getDashboardData('week')

  // ...
}
```

### For Server Actions

**Before:**
```typescript
'use server'

// This would fail
import { apiClient } from '@/lib/api/client/api-client'

export async function myServerAction(formData: FormData) {
  const result = await apiClient.post('/api/submit', formData)
  return result
}
```

**After:**
```typescript
'use server'

import { apiClient } from '@/lib/api/client/api-client.server'

export async function myServerAction(formData: FormData) {
  const result = await apiClient.post('/api/submit', formData)
  return result
}
```

### For Repositories

Repositories that use dependency injection should import from the core:

**Before:**
```typescript
import { ApiClient } from '../client/api-client'

export class MyRepository {
  constructor(private apiClient: ApiClient) {}
  // ...
}
```

**After:**
```typescript
import { ApiClient } from '../client/api-client-core'

export class MyRepository {
  constructor(private apiClient: ApiClient) {}
  // ...
}
```

## Benefits

1. **Server Components Support**: Can now use API client in Server Components
2. **Reduced Bundle Size**: Client bundle no longer includes server-only code
3. **Better Performance**: Server Components fetch data server-side
4. **React 19 Caching**: Client components benefit from React 19 cache()
5. **Type Safety**: Full TypeScript support maintained across all variants

## Configuration

All three variants share the same configuration:

```typescript
{
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
}
```

## Caching Strategy

### Client-Side (React 19 cache())
- Dashboard data: 5 minutes (300s)
- Campaign data: 10 minutes (600s)
- KOL data: 15 minutes (900s)
- Real-time data: 1 minute (60s)

### Server-Side
- Same TTL values
- Tag-based invalidation
- Automatic cache warming for priority requests

## API Reference

### Common Methods (All Variants)

```typescript
// GET request
apiClient.get<T>(url: string, options?: RequestOptions, cache?: CacheConfig): Promise<T>

// POST request
apiClient.post<T>(url: string, data: any, options?: RequestOptions): Promise<T>

// PUT request
apiClient.put<T>(url: string, data: any, options?: RequestOptions): Promise<T>

// PATCH request
apiClient.patch<T>(url: string, data: any, options?: RequestOptions): Promise<T>

// DELETE request
apiClient.delete<T>(url: string, options?: RequestOptions): Promise<T>

// Cache invalidation
apiClient.invalidateCache(tags: string[]): Promise<void>

// Metrics
apiClient.getMetrics(): RequestMetrics[]
apiClient.clearMetrics(): void

// Circuit breaker
apiClient.getCircuitBreakerState(url: string): CircuitBreakerState
apiClient.resetCircuitBreaker(url: string): void
```

### Client-Specific Cached Functions

```typescript
getCachedDashboardData(timeframe: string): Promise<DashboardData>
getCachedCampaignData(campaignId: string): Promise<CampaignData>
getCachedKolData(kolId: string): Promise<KolData>
getCachedRealTimeData(): Promise<RealTimeData>
```

### Server-Specific Functions

```typescript
getDashboardData(timeframe: string): Promise<DashboardData>
getCampaignData(campaignId: string): Promise<CampaignData>
getKolData(kolId: string): Promise<KolData>
getRealTimeData(): Promise<RealTimeData>
```

## Troubleshooting

### Error: "use client" directive missing

**Problem:** Using client-side features in a Server Component
**Solution:** Import from `api-client.server` instead of `api-client.client`

### Error: Cannot use React hooks

**Problem:** Using Server Component in a client-only context
**Solution:** Add `"use client"` directive to your component and import from `api-client.client`

### Error: Module not found

**Problem:** Importing from the old `api-client.ts`
**Solution:** Update imports to use either `.client` or `.server` variant

## Status

- ✅ Core refactoring complete
- ✅ Client wrapper created
- ✅ Server wrapper created
- ✅ Campaign repository fixed (removed invalid `larkbaseClient` reference)
- ⏳ Old `api-client.ts` file deprecation pending
- ⏳ Import migration across codebase pending

## Next Steps

1. Update all imports throughout the codebase
2. Test both client and server components
3. Deprecate/remove old `api-client.ts` file
4. Update integration tests
5. Document in main README.md
