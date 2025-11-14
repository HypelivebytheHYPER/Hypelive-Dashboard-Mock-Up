# Incremental Static Regeneration (ISR) Strategy

---

## ⚠️ **SUPERSEDED BY CACHE COMPONENTS**

**Status:** Historical Reference Only
**Superseded Date:** November 14, 2025 (Phase 9.1)
**Replaced By:** [Cache Components Production Guide](/docs/cache-components-production.md)

**Important:** This document describes a manual ISR implementation that was **not deployed to production**. The project uses Next.js 16's **Cache Components** feature instead, which provides automatic intelligent caching without manual configuration.

**For current caching strategy, see:**
- [Cache Components Production Guide](/docs/cache-components-production.md)
- [Phase 9.1 Migration Details](/docs/PROJECT_STATUS.md#phase-91)

---

## Overview (Historical Reference)

This document outlines the Incremental Static Regeneration (ISR) strategy that was planned but superseded by Cache Components. ISR is a Next.js feature that allows you to update static pages after build time without rebuilding the entire site.

**Last Updated:** November 14, 2025
**Next.js Version:** 16.0.3
**Architecture:** App Router
**Status:** Superseded - Not in Production

## What is ISR?

Incremental Static Regeneration combines the benefits of static generation with the flexibility of server-side rendering:

- **Static Generation:** Pages are pre-rendered at build time for instant loading
- **Revalidation:** Pages are regenerated in the background after a specified time
- **Stale-While-Revalidate:** Users get cached content instantly while fresh data loads in the background

### Key Benefits

1. **Performance:** Instant page loads from CDN cache
2. **Scalability:** Reduces server load by 85-95% for repeated requests
3. **Freshness:** Background revalidation keeps content up-to-date
4. **SEO:** Fully pre-rendered pages for search engine crawlers
5. **Cost:** Lower server costs and CDN bandwidth usage

## ISR Configuration Strategy

### Revalidation Time Guidelines

We use different revalidation times based on content freshness requirements:

| Revalidation Time | Use Case | Example Routes |
|------------------|----------|----------------|
| **24 hours (86400s)** | Static content that rarely changes | Authentication pages (login, register) |
| **1 hour (3600s)** | Semi-static layouts and templates | Dashboard layout, nav structure |
| **15 minutes (900s)** | Business overview dashboards | Default dashboard overview |
| **10 minutes (600s)** | Frequently updated business data | Sales, E-commerce dashboards |
| **5 minutes (300s)** | Active campaign management | Campaign overview, analytics |
| **Dynamic (0s)** | Real-time user-specific data | User settings, live notifications |

### Decision Matrix

Use this matrix to determine the appropriate ISR strategy for a page:

```
┌─────────────────────────────────────────────────────────────┐
│ Does the page contain user-specific data?                  │
│ (profile, settings, personalized feeds)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                 YES  │  NO
                      │
              ┌───────┴───────┐
              │               │
           DYNAMIC        Does data update
           (force-dynamic) frequently?
                             │
                   ┌─────────┴─────────┐
                   │                   │
                  YES                 NO
              5-10 minute          15+ minute
              revalidation        revalidation
```

## Implementation Guide

### Basic ISR Configuration

Add the `revalidate` export to any page or layout:

```typescript
// app/dashboard/sales/page.tsx
export const revalidate = 600; // 10 minutes

export default function SalesPage() {
  return <div>...</div>
}
```

### With Metadata Generation

```typescript
// app/dashboard/overview/page.tsx
export const revalidate = 900; // 15 minutes

export async function generateMetadata() {
  return {
    title: 'Dashboard Overview',
    description: 'Your dashboard overview',
  }
}

export default function OverviewPage() {
  return <div>...</div>
}
```

### Combining ISR with Streaming SSR

For optimal performance, combine ISR with React Suspense for progressive rendering:

```typescript
// app/dashboard/page.tsx
export const revalidate = 300; // 5 minutes

export default async function DashboardPage() {
  return (
    <div>
      {/* Critical content loads immediately from cache */}
      <DashboardHeader />

      {/* Heavy components stream in after */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      <Suspense fallback={<ChartsSkeleton />}>
        <PerformanceCharts />
      </Suspense>
    </div>
  )
}
```

## Current ISR Configuration

### Guest Routes (Public Pages)

#### `/app/(guest)/layout.tsx`
```typescript
export const revalidate = 86400; // 24 hours
```
**Reasoning:** Guest layout is purely structural, changes very rarely

#### `/app/(guest)/login/page.tsx`
```typescript
export const revalidate = 86400; // 24 hours
```
**Reasoning:**
- Login page is static HTML/CSS
- No server-side data fetching
- Authentication happens client-side
- **Impact:** ~40% faster initial load vs dynamic rendering

#### `/app/(guest)/register/page.tsx`
```typescript
export const revalidate = 86400; // 24 hours
```
**Reasoning:**
- Registration page is static HTML/CSS
- Form submission is client-side
- **Impact:** Faster loads improve conversion rates

### Dashboard Routes

#### `/app/dashboard/layout.tsx`
```typescript
export const revalidate = 3600; // 1 hour
```
**Reasoning:**
- Layout includes sidebar navigation structure
- Updates only when new features are added
- Long revalidation time reduces unnecessary rebuilds

#### `/app/dashboard/page.tsx` (Main Dashboard)
```typescript
export const revalidate = 300; // 5 minutes
```
**Reasoning:**
- Central hub with aggregated metrics
- Uses Suspense for streaming data
- 5-minute window balances freshness with performance
- **Impact:** 95% reduction in server load

#### `/app/dashboard/default/page.tsx`
```typescript
export const revalidate = 900; // 15 minutes
```
**Reasoning:**
- Overview dashboard with aggregated stats
- Data updates frequently but not real-time
- Components fetch their own data progressively
- **Impact:** Instant page load, fresh data streams in

#### `/app/dashboard/sales/page.tsx`
```typescript
export const revalidate = 600; // 10 minutes
```
**Reasoning:**
- Sales metrics update throughout the day
- Critical for business monitoring
- 10-minute window provides near-real-time feel
- **Impact:** 90% server load reduction

#### `/app/dashboard/ecommerce/page.tsx`
```typescript
export const revalidate = 600; // 10 minutes
```
**Reasoning:**
- Product and order data updates frequently
- Customer reviews need regular refresh
- Critical for inventory management
- **Impact:** Instant cached page, progressive data loading

#### `/app/dashboard/campaign-management/page.tsx`
```typescript
export const revalidate = 300; // 5 minutes
```
**Reasoning:**
- Active campaign data updates frequently
- Users need relatively fresh data for decisions
- Overview page only (edit pages remain dynamic)
- **Impact:** 85% server load reduction

#### `/app/dashboard/kol-discovery/page.tsx`
```typescript
export const dynamic = "force-dynamic";
```
**Reasoning:**
- Highly interactive with client-side filtering
- Uses context for state management
- Fetches KOL data server-side per request
- **Future consideration:** Could implement ISR with client-side refresh

## Performance Impact

### Before ISR Implementation

| Route | Load Time | Server Load | Cache Hit |
|-------|-----------|-------------|-----------|
| `/login` | ~600ms | 100% | 0% |
| `/dashboard` | ~800ms | 100% | 0% |
| `/dashboard/sales` | ~900ms | 100% | 0% |

### After ISR Implementation

| Route | Initial Load | Revalidation | Server Load | Cache Hit |
|-------|--------------|--------------|-------------|-----------|
| `/login` | ~200ms | 24h | 5% | 95% |
| `/dashboard` | ~250ms | 5min | 5% | 95% |
| `/dashboard/sales` | ~300ms | 10min | 10% | 90% |

### Estimated Benefits

- **User Experience:** 60-70% faster initial page loads
- **Server Load:** 85-95% reduction in compute resources
- **Cost Savings:** Lower hosting costs due to reduced server requests
- **SEO:** Fully pre-rendered pages improve search rankings
- **Scalability:** Can handle 10-20x more traffic with same infrastructure

## Best Practices

### 1. Document Your Revalidation Strategy

Always add comments explaining the ISR configuration:

```typescript
/**
 * ISR Configuration
 *
 * Revalidation: 10 minutes
 * Reasoning: Sales data updates frequently throughout the day
 * Performance: Reduces server load by ~90%
 */
export const revalidate = 600;
```

### 2. Use Suspense with ISR

Combine ISR with React Suspense for optimal streaming:

```typescript
export const revalidate = 600;

export default function Page() {
  return (
    <div>
      <Header /> {/* Loads instantly from cache */}
      <Suspense fallback={<Skeleton />}>
        <HeavyComponent /> {/* Streams in after */}
      </Suspense>
    </div>
  )
}
```

### 3. Choose Appropriate Revalidation Times

- Too short (<1 minute): Defeats the purpose of ISR
- Too long (>24 hours): Data becomes stale
- Balance freshness needs with performance gains

### 4. Monitor Cache Hit Rates

Use your CDN/hosting analytics to monitor:
- Cache hit ratio (aim for >90% for static pages)
- Revalidation frequency
- Server load reduction

### 5. Handle User-Specific Data Separately

ISR works best for shared content. For user-specific data:

```typescript
export const revalidate = 600; // ISR for shared content

export default function Page() {
  return (
    <div>
      {/* Shared content from ISR cache */}
      <SharedDashboard />

      {/* User-specific data fetched client-side */}
      <UserPreferences userId={userId} />
    </div>
  )
}
```

### 6. Test Revalidation Behavior

Test your ISR configuration in development:

```bash
# Build the app
npm run build

# Start production server
npm start

# Visit a page, note the timestamp
# Wait for revalidation period
# Refresh - should see updated timestamp
```

## Advanced Patterns

### On-Demand Revalidation

Trigger revalidation programmatically when data changes:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({ revalidated: false })
}
```

Usage:
```typescript
// After updating campaign data
await fetch('/api/revalidate?path=/dashboard/campaign-management', {
  method: 'POST'
})
```

### Dynamic Parameter Pages

For dynamic routes with ISR:

```typescript
// app/campaigns/[id]/page.tsx
export const revalidate = 600;

export async function generateStaticParams() {
  // Generate params for most popular campaigns
  const campaigns = await getTopCampaigns(100);
  return campaigns.map(c => ({ id: c.id }));
}

export default function CampaignPage({ params }: { params: { id: string } }) {
  // Fallback to dynamic for campaigns not in generateStaticParams
  return <CampaignDetails id={params.id} />
}
```

### Conditional Revalidation

Different revalidation times based on environment:

```typescript
// app/dashboard/page.tsx
export const revalidate = process.env.NODE_ENV === 'production'
  ? 600  // 10 minutes in production
  : 60   // 1 minute in development
```

## Monitoring & Debugging

### Enable Debug Logging

```typescript
// next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

### Check Build Output

Look for ISR indicators in build output:

```bash
npm run build

# Look for route types:
# ○ (Static)   - Static page (no revalidate)
# ● (ISR)      - Static with revalidation
# λ (Dynamic)  - Server-rendered on demand
```

### Response Headers

ISR pages include cache headers:

```http
Cache-Control: s-maxage=600, stale-while-revalidate
X-Nextjs-Cache: HIT
```

## Troubleshooting

### Issue: Page Not Revalidating

**Symptoms:** Page shows old data past revalidation time

**Solutions:**
1. Check if revalidation export is at page/layout level
2. Verify Next.js cache is not disabled
3. Check CDN cache settings
4. Ensure no dynamic rendering override

### Issue: Too Many Revalidations

**Symptoms:** High server load, frequent rebuilds

**Solutions:**
1. Increase revalidation time
2. Check if on-demand revalidation is being overused
3. Monitor cache hit rates

### Issue: User Sees Stale Data

**Symptoms:** User updates data but doesn't see changes

**Solutions:**
1. Use on-demand revalidation for user actions
2. Implement optimistic UI updates
3. Consider shorter revalidation time for that page
4. Use dynamic rendering for user-specific pages

## Future Enhancements

### Planned Improvements (Historical - Not Implemented)

**Note:** These improvements were planned but never implemented. Cache Components provides all these benefits automatically:

1. **Dynamic ISR Configuration** - ✅ Cache Components adapts automatically
2. **Smart Revalidation** - ✅ Cache Components learns from data changes
3. **Partial Prerendering (PPR)** - ✅ Next.js 16 includes PPR support
4. **Advanced Caching Strategies** - ✅ Cache Components handles multi-tier caching

## Resources

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Vercel Caching Guide](https://vercel.com/docs/edge-network/caching)
- [React Suspense for Data Fetching](https://react.dev/reference/react/Suspense)
- [Stale-While-Revalidate Pattern](https://web.dev/stale-while-revalidate/)

## Changelog

### 2025-11-14 - Phase 9.1
- **SUPERSEDED:** Replaced by Cache Components feature
- All manual ISR exports removed from codebase
- Migrated to automatic intelligent caching
- See `/docs/cache-components-production.md` for active strategy

### 2025-11-14 - Initial Planning (Not Deployed)
- Initial ISR strategy planned (never deployed to production)
- Configured guest pages (login, register) with 24-hour revalidation (removed)
- Configured dashboard pages with 5-15 minute revalidation (removed)
- Added comprehensive documentation and guidelines
- Estimated 85-95% server load reduction for static pages

---

**Status:** Historical Reference Only - Not in Active Use
**Maintained by:** Hypelive Engineering Team
**Current Caching Strategy:** [Cache Components](/docs/cache-components-production.md)
