# ISR Quick Reference Guide

---

## ⚠️ **HISTORICAL REFERENCE ONLY - SUPERSEDED**

**Status:** Superseded by Cache Components
**Date Superseded:** November 14, 2025 (Phase 9.1)
**Current Guide:** [Cache Components Production Guide](/docs/cache-components-production.md)

**Important:** This guide describes manual ISR configuration that is **not used in production**. The Hypelive Dashboard uses Next.js 16's **Cache Components** feature for automatic intelligent caching.

**Do NOT use these patterns** - they conflict with `cacheComponents: true` in `next.config.ts`.

---

## Historical Reference (Not in Active Use)

Quick reference for implementing and managing Incremental Static Regeneration (ISR) - **superseded by Cache Components**.

## Quick Start

### Adding ISR to a Page

```typescript
// app/your-page/page.tsx

/**
 * ISR Configuration
 * Revalidation: 10 minutes
 * Reasoning: [why this time?]
 */
export const revalidate = 600; // 10 minutes

export default function YourPage() {
  return <div>Your content</div>
}
```

### Revalidation Times Cheat Sheet

```typescript
// Static pages (login, register, landing)
export const revalidate = 86400; // 24 hours

// Layouts and navigation
export const revalidate = 3600; // 1 hour

// Overview dashboards
export const revalidate = 900; // 15 minutes

// Business dashboards (sales, analytics)
export const revalidate = 600; // 10 minutes

// Active management pages (campaigns)
export const revalidate = 300; // 5 minutes

// Real-time/user-specific pages
export const dynamic = "force-dynamic";
```

## ISR Decision Tree

```
Is the page user-specific?
├── YES → export const dynamic = "force-dynamic"
└── NO
    └── Does data change frequently?
        ├── YES
        │   └── How often?
        │       ├── Every few minutes → revalidate = 300 (5min)
        │       ├── Every 10-15 min → revalidate = 600 (10min)
        │       └── Every hour → revalidate = 3600 (1hr)
        └── NO
            └── revalidate = 86400 (24hr)
```

## Current Configuration

| Route | Revalidation | Use Case |
|-------|--------------|----------|
| Guest pages | 24 hours | Static auth pages |
| Dashboard layout | 1 hour | Navigation structure |
| Main dashboard | 5 minutes | Central metrics hub |
| Default dashboard | 15 minutes | Overview metrics |
| Sales/Ecommerce | 10 minutes | Business data |
| Campaign Management | 5 minutes | Active campaigns |
| KOL Discovery | Dynamic | Interactive filtering |

## ISR + Suspense Pattern

```typescript
export const revalidate = 600; // ISR: 10 minutes

export default async function Page() {
  return (
    <div>
      {/* Loads instantly from cache */}
      <Header />
      <StaticContent />

      {/* Streams in after initial load */}
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

## On-Demand Revalidation

Trigger revalidation when data changes:

```typescript
// After updating data
await fetch('/api/revalidate?path=/dashboard/campaigns', {
  method: 'POST'
})
```

Create revalidation endpoint:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const path = request.nextUrl.searchParams.get('path')
  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true })
  }
  return Response.json({ revalidated: false })
}
```

## Verification

### Check Build Output

```bash
npm run build

# Look for ISR indicators:
# ○ (Static)   - No revalidation
# ● (ISR)      - Has revalidation ← You want this
# λ (Dynamic)  - Server-rendered
```

### Check Response Headers

```bash
curl -I https://yourdomain.com/dashboard

# Should see:
Cache-Control: s-maxage=600, stale-while-revalidate
X-Nextjs-Cache: HIT
```

### Monitor Cache Hit Rate

Aim for:
- Guest pages: 95%+ cache hit rate
- Dashboard pages: 85-95% cache hit rate
- Management pages: 80-90% cache hit rate

## Common Patterns

### Marketing/Landing Pages
```typescript
export const revalidate = 86400; // 24 hours
```

### Admin Dashboards
```typescript
export const revalidate = 600; // 10 minutes
```

### Real-Time Dashboards
```typescript
export const revalidate = 300; // 5 minutes
```

### User Settings
```typescript
export const dynamic = "force-dynamic"; // No caching
```

## Troubleshooting

### Page Not Revalidating?
1. Check `export const revalidate` is at top level
2. Verify no `export const dynamic = "force-dynamic"`
3. Check CDN cache settings
4. Clear Next.js cache: `rm -rf .next`

### Cache Not Working?
1. Verify build shows ● (ISR) not λ (Dynamic)
2. Check response headers for Cache-Control
3. Test in production (not dev mode)
4. Verify no blocking client-side requests

### Too Many Server Requests?
1. Increase revalidation time
2. Implement on-demand revalidation
3. Check for cache bypass queries
4. Review route access patterns

## Best Practices

1. **Document Your Choice**
   ```typescript
   /**
    * ISR: 10 minutes
    * Why: Sales data updates frequently
    * Impact: 90% server load reduction
    */
   export const revalidate = 600;
   ```

2. **Use Suspense Boundaries**
   - Split heavy components
   - Progressive loading
   - Better perceived performance

3. **Monitor Performance**
   - Track cache hit rates
   - Monitor server load
   - Review revalidation frequency

4. **Test Before Deployment**
   - Build locally
   - Check route types
   - Verify response headers

## Performance Impact

Expected improvements with ISR:

- **Load Time:** 60-70% faster
- **Server Load:** 85-95% reduction
- **Cache Hit Rate:** 90%+ on static pages
- **Cost Savings:** Significant (lower compute)
- **Scalability:** 10-20x more capacity

## Links

- [Full ISR Strategy](../architecture/isr-strategy.md) (Historical reference only)
- [Cache Components Production Guide](/docs/cache-components-production.md) (Current strategy)
- [Performance Optimization](./performance-optimization.md)
- [Next.js ISR Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

---

**Status:** Historical Reference Only - Superseded by Cache Components
**Last Updated:** November 14, 2025 (Phase 9.1)
**Current Caching Strategy:** [Cache Components](/docs/cache-components-production.md)
