# Deployment Troubleshooting Guide

Common issues and solutions for deploying the Hypelive Dashboard with Next.js 16.

## Quick Issue Lookup

| Issue | Section | Quick Fix |
|-------|---------|-----------|
| CSP violations | [CSP Issues](#csp-issues) | Add domain to CSP |
| Bundle too large | [Bundle Size](#bundle-size-issues) | Dynamic imports |
| Build fails | [Build Failures](#build-failures) | Check Node.js version |
| Images not loading | [Asset Issues](#asset-issues) | Check image config |
| CORS errors | [CORS Issues](#cors-issues) | Update API headers |
| Slow performance | [Performance](#performance-issues) | Enable caching |
| Memory leaks | [Memory Issues](#memory-issues) | Check for leaks |
| Cache problems | [Cache Issues](#cache-issues) | Clear cache |

## CSP Issues

### Issue: Inline Script Blocked

**Symptom:**
```
Refused to execute inline script because it violates Content Security Policy
```

**Cause:** CSP blocks inline scripts by default.

**Solution 1:** Add unsafe-inline (already included)
```typescript
// next.config.ts - Already configured
"script-src 'self' 'unsafe-inline' 'unsafe-eval'"
```

**Solution 2:** Use nonces (advanced)
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export function middleware(request: Request) {
  const nonce = crypto.randomBytes(16).toString('base64')
  const cspHeader = `script-src 'nonce-${nonce}' 'strict-dynamic'`

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', cspHeader)
  return response
}
```

### Issue: External API Blocked

**Symptom:**
```
Blocked by Content Security Policy: "connect-src"
```

**Browser Console:**
```
Failed to fetch https://api.external.com/data
CSP: connect-src 'self' https:
```

**Solution:**
```typescript
// next.config.ts
// Add specific domain to connect-src
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "connect-src 'self' https: https://api.external.com",  // Add this
    // ... other directives
  ].join('; ')
}
```

### Issue: Google Analytics Blocked

**Symptom:**
```
Refused to load script from 'https://www.googletagmanager.com'
```

**Solution:**
```typescript
// next.config.ts
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "connect-src 'self' https: https://www.google-analytics.com",
    "img-src 'self' data: https: https://www.google-analytics.com",
    // ... other directives
  ].join('; ')
}
```

### Issue: Third-Party Widgets Broken

**Symptom:**
```
Chat widget / Social media embed not loading
```

**Common third-party CSP requirements:**

**Intercom:**
```typescript
"script-src 'self' https://widget.intercom.io",
"connect-src 'self' https://api.intercom.io wss://nexus-websocket-a.intercom.io",
"img-src 'self' data: https: https://static.intercomcdn.com",
"frame-src https://intercom-sheets.com"
```

**Facebook Pixel:**
```typescript
"script-src 'self' https://connect.facebook.net",
"connect-src 'self' https: https://www.facebook.com",
"img-src 'self' data: https: https://www.facebook.com"
```

**Twitter Embed:**
```typescript
"script-src 'self' https://platform.twitter.com",
"frame-src https://platform.twitter.com",
"style-src 'self' 'unsafe-inline' https://platform.twitter.com"
```

### CSP Testing Tool

```bash
# Test CSP locally
npm install -g csp-evaluator

# Evaluate your CSP
csp-evaluator "default-src 'self'; script-src 'self' 'unsafe-inline'"

# Or use online tool
https://csp-evaluator.withgoogle.com/
```

## Bundle Size Issues

### Issue: Bundle Exceeds Maximum Size

**Symptom:**
```
⚠ Exceeded maximum size for bundle
  Expected: 250 KB
  Actual: 380 KB
```

**Diagnosis:**
```bash
# Analyze what's large
ANALYZE=true npm run build

# Look for:
# 1. Large dependencies
# 2. Duplicate code
# 3. Unused imports
```

**Solution 1: Dynamic Imports**
```typescript
// Before (all imported upfront)
import HeavyChart from '@/components/heavy-chart'
import HeavyTable from '@/components/heavy-table'

// After (load on demand)
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false  // Don't load on server if not needed
})

const HeavyTable = dynamic(() => import('@/components/heavy-table'))
```

**Solution 2: Replace Heavy Dependencies**
```bash
# Example: Replace moment.js with date-fns
npm uninstall moment
npm install date-fns

# Moment: 67KB → date-fns: 13KB
# Savings: 54KB
```

**Solution 3: Tree Shaking**
```typescript
// ❌ Bad - Imports everything
import _ from 'lodash'

// ✅ Good - Only imports what you need
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

// Or even better
import { debounce, throttle } from 'lodash-es'  // ES modules for better tree shaking
```

**Solution 4: Code Splitting**
```typescript
// Split routes manually
// app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}

// DashboardContent only loads when needed
```

### Issue: Individual Script Too Large

**Symptom:**
```
⚠ Script exceeds maximum size
  File: recharts-abc123.js
  Size: 180 KB (max: 150 KB)
```

**Solution:**
```typescript
// Load chart library on-demand
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const ChartComponent = dynamic(() => import('recharts').then(mod => mod.LineChart), {
  ssr: false
})

export function ChartPage() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Chart
      </button>
      {showChart && <ChartComponent />}
    </div>
  )
}
```

### Issue: Initial Load Too Large

**Symptom:**
```
⚠ Initial load exceeds budget
  Size: 550 KB (max: 500 KB)
```

**Solution: Streaming SSR**
```typescript
// app/page.tsx
export default async function Page() {
  return (
    <>
      {/* Critical content - loads first */}
      <Header />
      <Hero />

      {/* Non-critical - streams in */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <PerformanceChart />
      </Suspense>
    </>
  )
}
```

## Build Failures

### Issue: TypeScript Errors

**Symptom:**
```bash
Type error: Property 'X' does not exist on type 'Y'
```

**Solution:**
```bash
# Run type check
npm run type-check

# Common fixes:

# 1. Update types
npm install --save-dev @types/node@latest
npm install --save-dev @types/react@latest

# 2. Fix type errors
# Add proper types instead of 'any'

# 3. Strict mode issues
# Check tsconfig.json
{
  "compilerOptions": {
    "strict": true,  // May need to fix strict errors
  }
}
```

### Issue: Module Not Found

**Symptom:**
```bash
Module not found: Can't resolve '@/components/ui/button'
```

**Solution:**
```bash
# 1. Check file exists
ls -la components/ui/button.tsx

# 2. Check tsconfig paths
cat tsconfig.json | grep "@"

# Should have:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# 3. Restart dev server
npm run dev
```

### Issue: Out of Memory

**Symptom:**
```bash
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Or in package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}

# For CI/CD (GitHub Actions)
env:
  NODE_OPTIONS: --max-old-space-size=4096
```

### Issue: Missing Dependencies

**Symptom:**
```bash
Module not found: Can't resolve 'css-minimizer-webpack-plugin'
```

**Solution:**
```bash
# Install missing optional dependencies
npm install --save-dev css-minimizer-webpack-plugin
npm install --save-dev compression-webpack-plugin

# Or disable feature
# Remove from next.config.ts if not needed
```

## Asset Issues

### Issue: Images Not Loading

**Symptom:**
```
GET https://yourdomain.com/_next/image?url=/logo.png 404
```

**Solution 1: Check Image Path**
```typescript
// ❌ Wrong - relative path
<Image src="./logo.png" />

// ✅ Correct - from public folder
<Image src="/logo.png" width={200} height={200} alt="Logo" />
```

**Solution 2: Configure Remote Domains**
```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.yourdomain.com',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    }
  ],
}
```

**Solution 3: Image Loader Issues**
```typescript
// If using custom loader
// next.config.ts
images: {
  loader: 'custom',
  loaderFile: './lib/image-loader.ts',
}

// lib/image-loader.ts
export default function cloudflareLoader({ src, width, quality }) {
  return `https://cdn.yourdomain.com/${src}?w=${width}&q=${quality || 75}`
}
```

### Issue: Large Images Slowing Down Page

**Symptom:**
```
Lighthouse: "Properly size images" warning
Image: 2MB uncompressed
```

**Solution:**
```typescript
// Use Next.js Image component (auto-optimization)
import Image from 'next/image'

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  quality={75}        // Reduce quality
  priority           // For above-fold images
  placeholder="blur"  // Show blur while loading
  blurDataURL="data:image/jpeg;base64,..."
/>

// Or for static imports
import heroImage from '@/public/hero.jpg'

<Image
  src={heroImage}
  placeholder="blur"  // Automatic blur
  alt="Hero"
/>
```

### Issue: Fonts Not Loading

**Symptom:**
```
Font flash (FOUT)
Custom font not applying
```

**Solution 1: Use Next.js Font Optimization**
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // Show fallback while loading
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

**Solution 2: Preload Critical Fonts**
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link
          rel="preload"
          href="/fonts/custom-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## CORS Issues

### Issue: API Request Blocked by CORS

**Symptom:**
```
Access to fetch at 'https://api.yourdomain.com/data' from origin 'https://yourdomain.com' has been blocked by CORS policy
```

**Solution: Update API Headers**
```typescript
// next.config.ts - Already configured for /api/* routes
{
  source: '/api/:path*',
  headers: [
    {
      key: 'Access-Control-Allow-Origin',
      value: process.env.NEXT_PUBLIC_APP_URL || '*'
    },
    {
      key: 'Access-Control-Allow-Methods',
      value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS'
    },
    {
      key: 'Access-Control-Allow-Headers',
      value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    }
  ]
}
```

**Solution: Handle OPTIONS Requests**
```typescript
// app/api/your-endpoint/route.ts
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

### Issue: Credentials Not Sent

**Symptom:**
```
Cookies/Authorization header not included in request
```

**Solution:**
```typescript
// Client-side fetch
fetch('https://api.yourdomain.com/data', {
  credentials: 'include',  // Send cookies
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// Server-side headers
{
  key: 'Access-Control-Allow-Credentials',
  value: 'true'
}
```

## Performance Issues

### Issue: Slow Server Response Time

**Symptom:**
```
Server response time > 500ms
Time to First Byte (TTFB) > 600ms
```

**Diagnosis:**
```bash
# Check server response
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com

# curl-format.txt:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

**Solution 1: Enable Caching**
```typescript
// app/api/data/route.ts
export async function GET() {
  const data = await fetchData()

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
    }
  })
}
```

**Solution 2: Use Edge Runtime**
```typescript
// app/api/fast/route.ts
export const runtime = 'edge'  // Run on edge for lower latency

export async function GET() {
  return Response.json({ fast: true })
}
```

**Solution 3: Optimize Database Queries**
```typescript
// Add database indexes
// Use connection pooling
// Implement query caching
```

### Issue: Large Layout Shifts (CLS)

**Symptom:**
```
Cumulative Layout Shift (CLS) > 0.1
Content "jumps" as page loads
```

**Solution 1: Reserve Space**
```typescript
// ❌ Bad - no dimensions
<Image src="/logo.png" />

// ✅ Good - dimensions specified
<Image src="/logo.png" width={200} height={200} alt="Logo" />

// ❌ Bad - no height
<div>Loading...</div>

// ✅ Good - min-height reserved
<div className="min-h-[200px]">Loading...</div>
```

**Solution 2: Use Skeletons**
```typescript
// components/skeleton.tsx
export function ChartSkeleton() {
  return (
    <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg" />
  )
}

// app/page.tsx
<Suspense fallback={<ChartSkeleton />}>
  <Chart />
</Suspense>
```

## Memory Issues

### Issue: Memory Leak

**Symptom:**
```
Memory usage increases over time
Application becomes slow
Eventually crashes
```

**Diagnosis:**
```typescript
// Add memory monitoring
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const used = process.memoryUsage()
    console.log({
      rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
    })
  }, 10000)
}
```

**Common Causes:**

**1. Event Listeners Not Cleaned Up**
```typescript
// ❌ Bad
useEffect(() => {
  window.addEventListener('resize', handleResize)
  // No cleanup!
}, [])

// ✅ Good
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [handleResize])
```

**2. Timers Not Cleared**
```typescript
// ❌ Bad
useEffect(() => {
  setInterval(() => fetchData(), 5000)
  // No cleanup!
}, [])

// ✅ Good
useEffect(() => {
  const interval = setInterval(() => fetchData(), 5000)
  return () => clearInterval(interval)
}, [])
```

**3. Circular References**
```typescript
// ❌ Bad
const obj1 = {}
const obj2 = {}
obj1.ref = obj2
obj2.ref = obj1  // Circular reference

// ✅ Good
// Avoid circular references
// Use WeakMap if needed
```

## Cache Issues

### Issue: Stale Data Displayed

**Symptom:**
```
Old data showing after deployment
Changes not reflecting
```

**Solution 1: Clear Browser Cache**
```bash
# Hard refresh
# Chrome/Firefox: Ctrl+Shift+R
# Safari: Cmd+Shift+R

# Clear cache via DevTools
# DevTools > Network > Disable cache
```

**Solution 2: Invalidate Server Cache**
```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { path, tag } = await request.json()

  if (path) {
    revalidatePath(path)
  }

  if (tag) {
    revalidateTag(tag)
  }

  return Response.json({ revalidated: true })
}
```

**Solution 3: Update Cache Headers**
```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate'
        }
      ]
    }
  ]
}
```

### Issue: Cache Not Working

**Symptom:**
```
Every request hits server
No cache hits
Slow performance
```

**Solution: Verify Cache Configuration**
```typescript
// Check fetch cache
fetch('https://api.example.com', {
  cache: 'force-cache',  // or 'no-store'
  next: {
    revalidate: 3600  // Revalidate every hour
  }
})

// Check component cache
'use cache'  // Add to server components

export default async function CachedComponent() {
  // This will be cached
}
```

## Environment Variable Issues

### Issue: Environment Variable Not Defined

**Symptom:**
```
TypeError: Cannot read property 'NEXT_PUBLIC_API_URL' of undefined
```

**Solution:**
```bash
# 1. Check variable is set
printenv | grep NEXT_PUBLIC_API_URL

# 2. Check .env file
cat .env.production

# 3. Rebuild (env vars baked into build)
npm run build

# 4. Restart server
npm start
```

**Common mistakes:**
```bash
# ❌ Wrong - no NEXT_PUBLIC prefix (server-only)
API_URL=https://api.com

# ✅ Correct - NEXT_PUBLIC prefix (client-side)
NEXT_PUBLIC_API_URL=https://api.com
```

## Getting More Help

### Enable Debug Mode

```bash
# Debug build
DEBUG=* npm run build

# Debug Next.js
NODE_OPTIONS='--inspect' npm run dev

# Verbose logging
npm run build -- --debug
```

### Collect Diagnostic Info

```bash
# System info
node --version
npm --version
next info

# Package info
npm list next react react-dom

# Build info
cat .next/build-manifest.json | jq
```

### Report Issues

Include:
1. Next.js version (`next info`)
2. Error messages (full stack trace)
3. Steps to reproduce
4. Expected vs actual behavior
5. `next.config.ts` (sanitized)

### Resources

- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Issues:** https://github.com/vercel/next.js/issues
- **Discord:** https://nextjs.org/discord
- **Stack Overflow:** `[next.js]` tag

---

**Last Updated:** November 2025
**Next.js Version:** 16.0.3
**Common Issues Covered:** 30+
