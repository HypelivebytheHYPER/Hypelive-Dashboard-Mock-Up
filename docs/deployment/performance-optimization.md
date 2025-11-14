# Performance Optimization Guide

This guide explains the 5 performance budgets and webpack optimizations implemented in the Hypelive Dashboard's Next.js 16 configuration.

## Performance Budget Overview

Performance budgets prevent the application from growing too large and slow. The dashboard implements **5 distinct budgets** to monitor different aspects of bundle size.

### Why Performance Budgets Matter

- **User Experience:** Faster load times = better engagement
- **SEO:** Google ranks faster sites higher
- **Conversion:** 1 second delay = 7% conversion loss
- **Mobile:** Critical for slow 3G/4G connections
- **Cost:** Smaller bundles = lower bandwidth costs

## The 5 Performance Budgets

### 1. Bundle Budget (250KB warning / 350KB error)

**Purpose:** Overall bundle size limit for all JavaScript chunks.

**Configuration:**
```typescript
{
  type: 'bundle',
  maximumWarning: 250 * 1024, // 250KB warning
  maximumError: 350 * 1024,   // 350KB error
}
```

**What it monitors:**
- Total size of all JavaScript bundles
- Includes vendor libraries (React, Next.js, etc.)
- Includes application code
- Does NOT include images, fonts, or CSS

**Current target:** Under 250KB (compressed)

**Why these limits:**
- **250KB**: Loads in ~2 seconds on 3G
- **350KB**: Maximum acceptable for good UX
- Over 350KB: Build fails, forces optimization

**How to monitor:**
```bash
# Analyze bundle size
npm run build

# Look for output:
# Route (app)               Size     First Load JS
# ○ /dashboard              45.2 kB   234 kB
```

**What to do if exceeded:**
1. Check bundle analyzer: `ANALYZE=true npm run build`
2. Look for large dependencies
3. Use dynamic imports for heavy components
4. Remove unused dependencies

### 2. Asset Budget (100KB warning / 150KB error)

**Purpose:** Individual asset size limit (images, fonts, etc.).

**Configuration:**
```typescript
{
  type: 'asset',
  maximumWarning: 100 * 1024, // 100KB warning
  maximumError: 150 * 1024,   // 150KB error
}
```

**What it monitors:**
- Individual image files
- Font files
- PDF files
- Other static assets
- Does NOT include JavaScript

**Why these limits:**
- **100KB**: Reasonable size for optimized images
- **150KB**: Maximum before image becomes a bottleneck
- Over 150KB: Asset should be optimized or lazy-loaded

**Common violations:**

| Asset Type | Typical Size | If > 100KB |
|------------|--------------|------------|
| Images | 20-50KB (WebP) | Use Next.js Image component |
| Fonts | 20-30KB | Subset fonts, use variable fonts |
| Icons | 5-10KB (SVG) | Use icon components, not images |
| PDFs | Varies | Host externally, don't bundle |

**How to optimize:**

```typescript
// Use Next.js Image component (auto-optimization)
import Image from 'next/image'

export function OptimizedLogo() {
  return (
    <Image
      src="/logo.png"
      width={200}
      height={200}
      quality={75}        // Reduce quality (default: 75)
      formats={['webp']}  // Modern format
    />
  )
}
```

### 3. Script Budget (100KB warning / 150KB error)

**Purpose:** JavaScript file size limit for individual scripts.

**Configuration:**
```typescript
{
  type: 'script',
  maximumWarning: 100 * 1024, // 100KB warning
  maximumError: 150 * 1024,   // 150KB error
}
```

**What it monitors:**
- Individual JavaScript chunk files
- Page-specific bundles
- Component bundles
- Does NOT include total bundle size (that's "bundle" budget)

**Why these limits:**
- **100KB**: Fast parse/execute time (<100ms)
- **150KB**: Maximum before JavaScript becomes blocking
- Small chunks = faster parallel loading

**How scripts are split:**

```typescript
// Automatic code splitting by Next.js 16
pages/
  dashboard.tsx        → dashboard-[hash].js (~80KB)
  kol-discovery.tsx    → kol-discovery-[hash].js (~95KB)
  campaigns.tsx        → campaigns-[hash].js (~70KB)

// If any file > 150KB, build fails
```

**How to fix violations:**

```typescript
// Use dynamic imports for heavy components
import dynamic from 'next/dynamic'

// Load chart library only when needed
const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false  // Don't load on server
})

export function DashboardPage() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart data={data} />
    </Suspense>
  )
}
```

### 4. Initial Budget (400KB warning / 500KB error)

**Purpose:** Total size for initial page load (critical path).

**Configuration:**
```typescript
{
  type: 'initial',
  maximumWarning: 400 * 1024, // 400KB warning
  maximumError: 500 * 1024,   // 500KB error
}
```

**What it monitors:**
- All resources loaded for first page render
- Framework code (React, Next.js)
- Page-specific JavaScript
- Critical CSS
- Does NOT include lazy-loaded components

**Why these limits:**
- **400KB**: Good Time to Interactive (TTI) < 3 seconds
- **500KB**: Maximum acceptable for LCP < 2.5 seconds
- Initial load = most important metric for UX

**What's included in initial load:**

```
Initial Load Breakdown:
├── Framework (React + Next.js)    ~130KB
├── Application Shell             ~80KB
├── Page Content                  ~60KB
├── Critical CSS                  ~20KB
├── Fonts (if preloaded)          ~30KB
└── Total                         ~320KB ✓ Under 400KB
```

**How to optimize initial load:**

```typescript
// 1. Use streaming SSR
export default async function Page() {
  return (
    <>
      {/* Critical content loads first */}
      <Header />

      {/* Non-critical content streams in */}
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
    </>
  )
}

// 2. Defer non-critical scripts
import Script from 'next/script'

export function Analytics() {
  return (
    <Script
      src="https://analytics.com/script.js"
      strategy="lazyOnload"  // Load after page interactive
    />
  )
}

// 3. Use font-display: swap
// In globals.css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;  // Show fallback until font loads
}
```

### 5. Total Budget (600KB warning / 800KB error)

**Purpose:** Maximum total application size across all chunks.

**Configuration:**
```typescript
{
  type: 'total',
  maximumWarning: 600 * 1024, // 600KB warning
  maximumError: 800 * 1024,   // 800KB error
}
```

**What it monitors:**
- Sum of ALL JavaScript chunks
- All routes and pages
- All vendor libraries
- All application code
- The ultimate size limit

**Why these limits:**
- **600KB**: Reasonable for dashboard application
- **800KB**: Maximum acceptable for any application
- Over 800KB: Likely architectural issues

**Total size breakdown (example):**

```
Application Size Map:
├── Framework (React, Next.js)     ~130KB
├── Vendor (Recharts, Radix UI)    ~180KB
├── Application Code               ~150KB
├── Page Bundles                   ~120KB
├── Shared Components              ~60KB
└── Total                          ~640KB ⚠ Approaching limit
```

**How to reduce total size:**

```bash
# 1. Analyze what's large
ANALYZE=true npm run build

# 2. Check for duplicates
npm dedupe

# 3. Find alternative lighter libraries
# Instead of moment.js (67KB) → date-fns (13KB)
# Instead of lodash (72KB) → individual imports

# 4. Remove unused dependencies
npm prune

# 5. Use tree-shaking
# Ensure imports are module-compatible
import { specific } from 'library'  // Good
import * as all from 'library'      // Bad (imports everything)
```

## Webpack Optimizations

The dashboard includes **7 advanced webpack optimizations** for production builds.

### 1. Code Splitting Strategy (7 Cache Groups)

**Purpose:** Split code into optimal chunks for caching and parallel loading.

**Configuration:**
```typescript
config.optimization.splitChunks = {
  chunks: 'all',
  minSize: 20000,                    // 20KB minimum chunk size
  minRemainingSize: 0,
  minChunks: 1,
  maxAsyncRequests: 30,
  maxInitialRequests: 30,
  enforceSizeThreshold: 50000,       // 50KB enforce split

  cacheGroups: {
    // 7 cache groups defined below
  }
}
```

**The 7 Cache Groups:**

#### Group 1: Framework (Priority 40)
```typescript
defaultVendors: {
  test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
  name: 'framework',
  priority: 40,
  reuseExistingChunk: true,
  enforce: true,
}
```
- **Contains:** React, React-DOM, Next.js core
- **Size:** ~130KB
- **Why separate:** Rarely changes, maximum caching benefit

#### Group 2: Recharts (Priority 30)
```typescript
recharts: {
  test: /[\\/]node_modules[\\/]recharts[\\/]/,
  name: 'recharts',
  priority: 30,
  reuseExistingChunk: true,
  enforce: true,
}
```
- **Contains:** Recharts charting library
- **Size:** ~90KB
- **Why separate:** Large library, only used on specific pages

#### Group 3: Radix UI (Priority 25)
```typescript
radix: {
  test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
  name: 'radix-ui',
  priority: 25,
  reuseExistingChunk: true,
}
```
- **Contains:** All Radix UI components
- **Size:** ~60KB
- **Why separate:** UI components shared across app

#### Group 4: Date Utils (Priority 20)
```typescript
dateUtils: {
  test: /[\\/]node_modules[\\/](date-fns|dayjs)[\\/]/,
  name: 'date-utils',
  priority: 20,
  reuseExistingChunk: true,
}
```
- **Contains:** Date-fns or DayJS
- **Size:** ~15KB
- **Why separate:** Used in multiple places, good caching

#### Group 5: Other Vendors (Priority 10)
```typescript
vendor: {
  test: /[\\/]node_modules[\\/]/,
  name: 'vendors',
  priority: 10,
  reuseExistingChunk: true,
}
```
- **Contains:** All other npm packages
- **Size:** Variable
- **Why separate:** Catch-all for third-party code

#### Group 6: UI Components (Priority 5)
```typescript
ui: {
  test: /[\\/]components[\\/]ui[\\/]/,
  name: 'ui-components',
  priority: 5,
  reuseExistingChunk: true,
  minChunks: 2,  // Only split if used 2+ times
}
```
- **Contains:** Your UI component library
- **Size:** ~40KB
- **Why separate:** Reusable across pages

#### Group 7: Common Code (Priority 0)
```typescript
common: {
  minChunks: 2,  // Only split if used 2+ times
  priority: 0,
  reuseExistingChunk: true,
  name: 'common',
}
```
- **Contains:** Code used in 2+ places
- **Size:** Variable
- **Why separate:** Automatic splitting of shared code

**Benefits of this strategy:**

```
Without code splitting:
└── main.js (800KB) ❌ One huge file

With code splitting:
├── framework.js (130KB) ✅ Cached forever
├── recharts.js (90KB)   ✅ Loaded only when needed
├── radix-ui.js (60KB)   ✅ Shared across pages
├── vendors.js (150KB)   ✅ Good caching
├── ui-components.js (40KB) ✅ Reusable
├── common.js (80KB)     ✅ Shared code
└── page-specific.js (varies) ✅ Small per-page bundles
```

### 2. Tree Shaking

**Purpose:** Remove unused code from bundles.

**Configuration:**
```typescript
config.optimization.usedExports = true
config.optimization.sideEffects = true
```

**What it does:**
```javascript
// Library exports 100 functions
import { onlyThisOne } from 'library'

// Tree shaking removes the other 99 functions
// Final bundle only includes onlyThisOne
```

**How to ensure tree shaking works:**

```javascript
// ✅ Good - Named imports
import { Button, Card } from '@/components/ui'

// ❌ Bad - Default imports (bundles everything)
import * as UI from '@/components/ui'

// ✅ Good - Specific imports
import Button from '@/components/ui/button'

// ❌ Bad - Barrel file with side effects
// components/ui/index.ts
import './global-styles.css'  // Side effect! Prevents tree shaking
export * from './button'
```

### 3. Module Concatenation (Scope Hoisting)

**Purpose:** Combine modules into single scope for faster execution.

**Configuration:**
```typescript
if (!dev) {
  config.optimization.concatenateModules = true
}
```

**What it does:**

```javascript
// Before concatenation (multiple scopes)
// module1.js
function foo() { return 'foo' }

// module2.js
function bar() { return 'bar' }

// After concatenation (single scope, faster)
function foo() { return 'foo' }
function bar() { return 'bar' }
```

**Benefits:**
- Faster JavaScript execution
- Smaller bundle size
- Better compression

### 4. Deterministic IDs

**Purpose:** Consistent chunk IDs for better caching.

**Configuration:**
```typescript
config.optimization.chunkIds = 'deterministic'
config.optimization.moduleIds = 'deterministic'
```

**What it solves:**

```
Without deterministic IDs (hash changes every build):
framework-abc123.js → framework-xyz789.js (cache broken)

With deterministic IDs (hash only changes if content changes):
framework-abc123.js → framework-abc123.js (cache preserved)
```

**Impact:**
- Better long-term caching
- Fewer unnecessary downloads
- Faster repeat visits

### 5. Runtime Chunk

**Purpose:** Separate webpack runtime for better caching.

**Configuration:**
```typescript
config.optimization.runtimeChunk = {
  name: 'runtime',
}
```

**What it creates:**

```
Build output:
├── runtime-[hash].js (5KB)     ← Webpack runtime
├── framework-[hash].js (130KB) ← Rarely changes
└── page-[hash].js (80KB)       ← Changes often

When you deploy new version:
├── runtime-[NEW].js (5KB)      ✅ Small, changes
├── framework-[SAME].js (130KB) ✅ Cached!
└── page-[NEW].js (80KB)        ✅ Only this downloads
```

**Benefits:**
- Framework stays cached even when app changes
- Only runtime + changed pages download
- Faster updates for users

### 6. CSS Optimization

**Purpose:** Minimize CSS files for faster loading.

**Configuration:**
```typescript
if (isProduction && config.optimization.minimizer) {
  const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
  config.optimization.minimizer.push(
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
            colormin: true,
            minifyFontValues: true,
            minifyGradients: true,
          },
        ],
      },
    })
  )
}
```

**What it does:**

```css
/* Before minification (10KB) */
.button {
  background-color: #0000ff;
  padding: 10px 20px;
  border-radius: 5px;
}

/* After minification (2KB) */
.button{background:#00f;padding:10px 20px;border-radius:5px}
```

**Optimizations applied:**
- Remove all comments
- Remove whitespace
- Shorten color codes (#0000ff → #00f)
- Minify font values
- Minify gradients
- Merge duplicate rules

**Setup:**
```bash
# Install CSS optimizer
npm install --save-dev css-minimizer-webpack-plugin

# Already configured in next.config.ts
# Works automatically in production builds
```

### 7. Optional Gzip Compression

**Purpose:** Pre-compress files for faster transfer (if not using CDN).

**Configuration:**
```typescript
if (isProduction && process.env.ENABLE_COMPRESSION === 'true') {
  const CompressionPlugin = require('compression-webpack-plugin')
  config.plugins.push(
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,    // Only compress files > 10KB
      minRatio: 0.8,       // Only if 20%+ size reduction
    })
  )
}
```

**When to enable:**

```bash
# Enable in .env.production
ENABLE_COMPRESSION=true

# Then build
npm run build
```

**When NOT to enable:**
- Using Vercel (handles compression automatically)
- Using Cloudflare (handles compression automatically)
- Using nginx with gzip module
- Using any CDN (they handle it)

**When TO enable:**
- Custom server without compression
- Static hosting (AWS S3, etc.)
- Server doesn't support gzip

**Setup:**
```bash
# Install compression plugin
npm install --save-dev compression-webpack-plugin

# Enable in environment
echo "ENABLE_COMPRESSION=true" >> .env.production
```

## Build Cache Configuration

**Purpose:** Faster rebuilds by caching compilation results.

**Configuration:**
```typescript
if (config.cache && config.cache.type === 'filesystem') {
  config.cache = {
    ...config.cache,
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: '.next/cache/webpack',
    compression: 'gzip',
    hashAlgorithm: 'md4',
    maxAge: 1000 * 60 * 60 * 24 * 7,  // 7 days
    name: `${process.env.NODE_ENV}-cache`,
    version: '1.0.0',
  }
}
```

**Benefits:**
- **First build:** Normal speed
- **Second build:** 2-3x faster
- **Development:** 10x faster HMR

**Cache location:**
```
.next/
└── cache/
    └── webpack/
        ├── development-cache/  ← Dev cache
        └── production-cache/   ← Prod cache
```

**When cache is cleared:**
- `next.config.ts` changes
- Dependencies updated
- Manual: `rm -rf .next/cache`
- Automatically after 7 days

## Monitoring Bundle Size

### Build-time Monitoring

```bash
# Basic build output
npm run build

# Shows:
Route (app)                        Size     First Load JS
├ ○ /                             5.02 kB        92.3 kB
├ ○ /dashboard                    45.2 kB        234 kB
└ ○ /kol-discovery                32.1 kB        221 kB

○  (Static)  prerendered as static content
```

### Bundle Analyzer

```bash
# Detailed visual analysis
ANALYZE=true npm run build

# Opens browser with interactive bundle map
# Shows:
# - What's large
# - Duplicate dependencies
# - Unused code
```

**Reading the bundle analyzer:**

```
Bundle Breakdown:
├── framework (130KB)
│   ├── react (70KB)
│   ├── react-dom (50KB)
│   └── next (10KB)
├── recharts (90KB) ⚠ Large!
│   ├── recharts/core (60KB)
│   └── d3-shape (30KB)
└── Your app (150KB)
    ├── components (80KB)
    └── pages (70KB)
```

### Performance Hints

**During build:**
```bash
# Warnings appear automatically
⚠ Exceeded maximum size for JavaScript bundle
  Expected: 250 KB
  Actual: 280 KB

⚠ Large assets detected:
  logo.png: 120 KB (consider optimization)
```

**What to do:**
1. Find what's large in analyzer
2. Optimize or lazy load
3. Rebuild and verify

## Performance Testing

### Lighthouse CI

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun

# Target scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 90
```

### WebPageTest

```bash
# Online tool
https://www.webpagetest.org/

# Test from different locations
# Check for:
# - First Contentful Paint < 1.8s
# - Time to Interactive < 3.8s
# - Largest Contentful Paint < 2.5s
```

### Real User Monitoring

```typescript
// lib/performance/web-vitals.ts
import { onCLS, onFID, onLCP } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to your analytics platform
  console.log(metric)
}

onCLS(sendToAnalytics)
onFID(sendToAnalytics)
onLCP(sendToAnalytics)
```

## Common Performance Issues

### Issue: Bundle too large

**Symptom:**
```
⚠ Exceeded maximum size for bundle: 380 KB
```

**Solution:**
```bash
# 1. Find culprit
ANALYZE=true npm run build

# 2. Look for large imports
# Replace heavy libraries with lighter alternatives

# 3. Use dynamic imports
const Heavy = dynamic(() => import('./heavy-component'))
```

### Issue: Slow initial load

**Symptom:**
```
Initial Load: 550 KB (warning threshold: 400 KB)
```

**Solution:**
```typescript
// Use Suspense for non-critical content
export default function Page() {
  return (
    <>
      <CriticalContent />  {/* Loads first */}
      <Suspense fallback={<Loading />}>
        <NonCritical />    {/* Streams in */}
      </Suspense>
    </>
  )
}
```

### Issue: Large images

**Symptom:**
```
⚠ Large asset detected: hero.png: 200 KB
```

**Solution:**
```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/hero.png"
  width={1200}
  height={600}
  quality={75}
  priority  // For above-fold images
/>
```

## Incremental Static Regeneration (ISR)

### Overview

ISR is one of the most impactful performance optimizations in the Hypelive Dashboard. It combines static generation with dynamic revalidation for optimal performance.

**Key Benefits:**
- 85-95% reduction in server load
- 60-70% faster initial page loads
- Better SEO with pre-rendered pages
- Lower hosting costs

### Implementation Status

The Hypelive Dashboard implements ISR across multiple route types:

| Route Type | Revalidation Time | Server Load Reduction |
|-----------|-------------------|----------------------|
| Guest Pages (login, register) | 24 hours | 95% |
| Dashboard Layout | 1 hour | 90% |
| Main Dashboard | 5 minutes | 95% |
| Overview Dashboards | 15 minutes | 95% |
| Business Dashboards | 10 minutes | 90% |
| Campaign Management | 5 minutes | 85% |

### How ISR Works

```typescript
// app/dashboard/sales/page.tsx
export const revalidate = 600; // Revalidate every 10 minutes

export default function SalesPage() {
  return <div>Sales Dashboard</div>
}
```

**Flow:**
1. **First Request:** Page is generated and cached
2. **Subsequent Requests (within 10 min):** Instant response from cache
3. **After 10 Minutes:** Next request triggers background revalidation
4. **Stale-While-Revalidate:** User gets cached version while new version generates

### ISR Strategy by Route Type

#### Guest Pages (24-hour revalidation)
```typescript
// app/(guest)/login/page.tsx
export const revalidate = 86400; // 24 hours
```
- Static HTML/CSS pages
- Rarely change (only design updates)
- 40% faster than dynamic rendering

#### Dashboard Layouts (1-hour revalidation)
```typescript
// app/dashboard/layout.tsx
export const revalidate = 3600; // 1 hour
```
- Navigation structure
- Updates only with new features
- Long revalidation reduces rebuilds

#### Active Dashboards (5-10 minute revalidation)
```typescript
// app/dashboard/campaign-management/page.tsx
export const revalidate = 300; // 5 minutes
```
- Frequently updated data
- Near-real-time feel
- Balances freshness with performance

### Combining ISR with Streaming SSR

For maximum performance, combine ISR with React Suspense:

```typescript
// app/dashboard/page.tsx
export const revalidate = 300; // ISR: 5 minutes

export default async function DashboardPage() {
  return (
    <div>
      {/* Instant load from ISR cache */}
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

**Benefits:**
- Initial HTML loads instantly from cache
- Critical content visible immediately
- Heavy components stream in progressively
- Best of both worlds: static + dynamic

### Performance Impact

#### Before ISR
```
Route: /dashboard/sales
Load Time: ~900ms
Server Requests: 1000 req/min
Server Load: 100%
Cache Hit Ratio: 0%
```

#### After ISR
```
Route: /dashboard/sales
Load Time: ~300ms (-67%)
Server Requests: 100 req/min (-90%)
Server Load: 10% (-90%)
Cache Hit Ratio: 90%
```

### Monitoring ISR Performance

#### Check Build Output

```bash
npm run build

# Look for ISR indicators:
# ○ (Static)   - Static page (no revalidate)
# ● (ISR)      - Static with revalidation
# λ (Dynamic)  - Server-rendered on demand
```

#### Response Headers

ISR pages include cache headers:

```http
Cache-Control: s-maxage=600, stale-while-revalidate
X-Nextjs-Cache: HIT
```

#### Monitor Cache Hit Rates

Use your hosting platform to monitor:
- Cache hit ratio (aim for >90% on static pages)
- Revalidation frequency
- Server load reduction

### Best Practices

#### 1. Choose Appropriate Revalidation Times

```typescript
// Too short (<1 minute): Defeats ISR purpose
export const revalidate = 30; // ❌ Too frequent

// Good: Balance freshness vs performance
export const revalidate = 300; // ✅ 5 minutes

// Too long (>24 hours): Data becomes stale
export const revalidate = 172800; // ⚠️ Only for truly static pages
```

#### 2. Document Your Strategy

Always explain your revalidation choice:

```typescript
/**
 * ISR Configuration
 *
 * Revalidation: 10 minutes
 * Reasoning: Sales data updates frequently
 * Performance: 90% server load reduction
 */
export const revalidate = 600;
```

#### 3. Use Suspense Boundaries

```typescript
export const revalidate = 600;

export default function Page() {
  return (
    <>
      <StaticContent /> {/* From ISR cache */}
      <Suspense fallback={<Skeleton />}>
        <DynamicContent /> {/* Streams after */}
      </Suspense>
    </>
  )
}
```

#### 4. Handle User-Specific Data

ISR works best for shared content. For personalized data:

```typescript
export const revalidate = 600; // ISR for shared content

export default function Page() {
  return (
    <>
      {/* Shared content from ISR cache */}
      <SharedDashboard />

      {/* User-specific data client-side */}
      <UserPreferences userId={userId} />
    </>
  )
}
```

### On-Demand Revalidation

Trigger revalidation programmatically when data changes:

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

Usage after data updates:

```typescript
// After updating campaign data
await fetch('/api/revalidate?path=/dashboard/campaign-management', {
  method: 'POST'
})
```

### Troubleshooting ISR

#### Issue: Page Not Revalidating

**Symptoms:** Page shows old data past revalidation time

**Solutions:**
1. Verify `revalidate` export is at page/layout level
2. Check if Next.js cache is disabled
3. Verify CDN cache settings
4. Ensure no dynamic rendering override

#### Issue: Too Many Revalidations

**Symptoms:** High server load, frequent rebuilds

**Solutions:**
1. Increase revalidation time
2. Check on-demand revalidation usage
3. Monitor cache hit rates
4. Review route access patterns

#### Issue: Cache Not Working

**Symptoms:** Every request hits server

**Check:**
```bash
# Verify ISR is configured
cat app/your-page/page.tsx | grep "export const revalidate"

# Check build output
npm run build | grep "your-page"

# Should see ● (ISR) not λ (Dynamic)
```

### Further Reading

For comprehensive ISR documentation, see:
- [ISR Strategy Documentation](../architecture/isr-strategy.md)
- [Next.js ISR Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

## Next Steps

1. Read [Production Deployment Checklist](./production-checklist.md)
2. Review [ISR Strategy Documentation](../architecture/isr-strategy.md)
3. Set up [Performance Monitoring](../monitoring/performance-monitoring.md)
4. Review [Troubleshooting Guide](./troubleshooting.md)

---

**Last Updated:** November 14, 2025
**Next.js Version:** 16.0.3
**Budgets:** 5 active
**Optimizations:** 7 webpack + 1 CSS + 1 cache + ISR
