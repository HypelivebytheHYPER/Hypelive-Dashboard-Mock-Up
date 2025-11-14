# Quick Reference - Deployment Guide

One-page reference for deploying the Hypelive Dashboard with Next.js 16.

## Prerequisites Checklist

```bash
# System Requirements
Node.js: >= 18.17.0 (Recommended: 20.x)
npm: >= 9.0.0

# Verify
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

## Essential Commands

### Development
```bash
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run lint            # Run linting
npm run type-check      # Check TypeScript
```

### Build & Deploy
```bash
npm run build           # Production build
npm run start           # Start production server
npm run build:analyze   # Analyze bundle size
```

### Testing
```bash
npm run test           # Run tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## Environment Variables (Required)

```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_LARKBASE_URL=https://larksuite-hype-server.hypelive.workers.dev
LARKBASE_APP_TOKEN=your_token_here
LARKBASE_APP_SECRET=your_secret_here
NEXT_PUBLIC_APP_TOKEN=your_app_token
NEXT_PUBLIC_KOLS_TABLE_ID=your_table_id
NEXT_PUBLIC_CAMPAIGNS_TABLE_ID=your_table_id
NEXT_PUBLIC_RATES_TABLE_ID=your_table_id
```

## Configuration Highlights

### Security Headers (9 Implemented)

1. **HSTS**: 2-year max-age with preload
2. **CSP**: Comprehensive Content Security Policy
3. **X-Frame-Options**: DENY (no iframes)
4. **X-Content-Type-Options**: nosniff
5. **X-XSS-Protection**: 1; mode=block
6. **Referrer-Policy**: strict-origin-when-cross-origin
7. **Permissions-Policy**: 9 features disabled
8. **X-DNS-Prefetch-Control**: off
9. **X-Download-Options**: noopen

**Security Grade:** A+ (securityheaders.com)

### Performance Budgets (5 Configured)

| Type | Warning | Error | Purpose |
|------|---------|-------|---------|
| Bundle | 250KB | 350KB | Total JS bundles |
| Asset | 100KB | 150KB | Individual assets |
| Script | 100KB | 150KB | JS files |
| Initial | 400KB | 500KB | First page load |
| Total | 600KB | 800KB | All chunks |

### Webpack Optimizations (7 Active)

1. **Code Splitting**: 7 cache groups (framework, recharts, radix-ui, etc.)
2. **Tree Shaking**: Remove unused code
3. **Module Concatenation**: Scope hoisting
4. **Deterministic IDs**: Better caching
5. **Runtime Chunk**: Separate webpack runtime
6. **CSS Optimization**: Minimize CSS files
7. **Gzip Compression**: Optional (enable via ENABLE_COMPRESSION=true)

## Deployment Quick Starts

### Vercel (Recommended)

```bash
# One-time setup
npm install -g vercel
vercel login
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add LARKBASE_APP_TOKEN production
# ... (add all required variables)

# Deploy
vercel --prod
```

**Settings:**
- Framework: Next.js (auto-detected)
- Node.js: 20.x
- Build Command: `npm run build`
- Output Directory: `.next`

### Cloudflare Pages

```bash
# Build settings
Build command: npm run build
Build output: .next
Node.js version: 20

# Deploy via dashboard or Wrangler
wrangler pages deploy .next --project-name=hypelive-dashboard
```

### Docker

```bash
# Build image
docker build -t hypelive-dashboard:latest -f docker/production/Dockerfile .

# Run container
docker run -p 3000:3000 --env-file .env.production hypelive-dashboard:latest

# Or use Docker Compose
docker-compose -f docker-compose.production.yml up -d
```

### Custom Server

```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "hypelive-dashboard" -- start
pm2 save
pm2 startup
```

## Critical Testing Points

### Pre-Deployment
```bash
# 1. Build test
npm run build
# Expected: ✓ Compiled successfully

# 2. Type check
npm run type-check
# Expected: 0 errors

# 3. Lint check
npm run lint
# Expected: 0 errors (warnings OK)

# 4. Local production test
npm run start
# Test at http://localhost:3000
```

### Post-Deployment
```bash
# 1. Health check
curl -I https://yourdomain.com
# Expected: HTTP/2 200

# 2. Security headers
curl -I https://yourdomain.com | grep -i strict-transport
# Expected: Strict-Transport-Security header present

# 3. Performance (Lighthouse)
npx lighthouse https://yourdomain.com --view
# Target: Performance > 90

# 4. Bundle size
# Check in browser DevTools > Network
# framework.js: ~130KB (gzipped)
# Total: <500KB initial load
```

## Common Issues & Quick Fixes

### CSP Violation
```typescript
// Add domain to CSP in next.config.ts
"connect-src 'self' https: https://your-api.com"
```

### Bundle Too Large
```typescript
// Use dynamic imports
const Heavy = dynamic(() => import('./heavy-component'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

### Images Not Loading
```typescript
// Check remotePatterns in next.config.ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.yourdomain.com' }
  ]
}
```

### CORS Error
```typescript
// Already configured for /api/* routes
// Check NEXT_PUBLIC_APP_URL matches origin
```

### Slow Performance
```bash
# 1. Enable caching
# 2. Check bundle analyzer
ANALYZE=true npm run build
# 3. Use dynamic imports
```

## Performance Targets

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Build Metrics
- **Build Time**: < 60s
- **Bundle Size**: < 640KB total
- **Initial Load**: < 400KB

### Lighthouse Scores
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 90

## Security Testing

```bash
# 1. SSL/TLS test
https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
# Target: A or A+ grade

# 2. Security headers test
https://securityheaders.com/?q=https://yourdomain.com
# Target: A+ grade

# 3. CSP test
# Browser Console should show NO CSP violations
```

## Monitoring Setup

### Essential Monitoring

1. **Uptime Monitor** (UptimeRobot / Pingdom)
   - URL: https://yourdomain.com
   - Check interval: 5 minutes

2. **Error Tracking** (Sentry / Bugsnag)
   - Set up with SENTRY_DSN env var
   - Monitor error rates

3. **Analytics** (Google Analytics 4)
   - Set up with NEXT_PUBLIC_GA_ID
   - Track user behavior

4. **Performance** (Vercel Analytics / Lighthouse CI)
   - Monitor Core Web Vitals
   - Track page load times

## Rollback Plan

### Vercel
```bash
vercel rollback
# Or via dashboard: Deployments > Select previous > Promote
```

### Git
```bash
git revert HEAD
git push origin main
vercel --prod
```

### Docker
```bash
docker pull hypelive-dashboard:previous-tag
docker-compose down
docker-compose up -d
```

## File Structure

```
hypelive-dashboard/
├── next.config.ts              # Next.js 16 configuration
├── package.json                # Dependencies (Next.js 16.0.3, React 19.2.0)
├── tsconfig.json               # TypeScript configuration
├── .env.production             # Production environment variables
├── app/                        # Next.js 16 App Router
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/                 # React components
│   └── ui/                    # UI component library
├── lib/                       # Utilities and services
│   ├── api/                   # API client
│   └── core/                  # Core utilities
├── public/                    # Static assets
└── docs/                      # Documentation
    └── deployment/            # Deployment guides
        ├── prerequisites.md
        ├── security-configuration.md
        ├── performance-optimization.md
        ├── production-checklist.md
        ├── troubleshooting.md
        └── quick-reference.md (this file)
```

## Key Configuration Files

### next.config.ts
- Security headers (9 configured)
- Performance budgets (5 configured)
- Webpack optimizations (7 active)
- Image optimization
- Cache configuration

### package.json
```json
{
  "next": "16.0.3",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "typescript": "5.7.2"
}
```

### tsconfig.json
- Strict mode enabled
- Path aliases configured
- React 19 types

## Emergency Contacts

- **Documentation:** `docs/deployment/`
- **Troubleshooting:** `docs/deployment/troubleshooting.md`
- **Support Email:** tech@hypelive.com
- **Status Page:** https://status.hypelive.studio (if available)

## Version Info

- **Next.js:** 16.0.3
- **React:** 19.2.0
- **Node.js:** >= 18.17.0 (Recommended: 20.x)
- **TypeScript:** 5.7.2
- **Documentation Version:** November 2025

## Useful Links

- **Next.js 16 Docs:** https://nextjs.org/docs
- **Security Headers:** https://securityheaders.com
- **SSL Labs:** https://www.ssllabs.com/ssltest/
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse
- **Web Vitals:** https://web.dev/vitals/
- **Bundle Analyzer:** https://www.npmjs.com/package/@next/bundle-analyzer

## Quick Command Reference

```bash
# Development
npm run dev                    # Start dev server
npm run lint                   # Lint code
npm run type-check            # Check types

# Building
npm run build                  # Production build
npm run build:analyze         # Analyze bundles
npm run start                 # Start production

# Testing
npm run test                  # Run tests
npm run test:watch           # Watch mode
npm run test:coverage        # Coverage

# Deployment
vercel --prod                # Deploy to Vercel
wrangler pages deploy       # Deploy to Cloudflare
docker-compose up -d        # Docker deployment

# Maintenance
npm audit                    # Security audit
npm update                   # Update deps
npm outdated                 # Check outdated

# Debugging
DEBUG=* npm run build       # Debug build
NODE_OPTIONS='--inspect' npm run dev  # Debug dev
```

## Best Practices Summary

1. **Always test locally** before deploying
2. **Use environment variables** for configuration
3. **Enable all security headers** (already done)
4. **Monitor bundle sizes** (budgets configured)
5. **Test on multiple devices** (mobile, tablet, desktop)
6. **Set up monitoring** (uptime, errors, performance)
7. **Have a rollback plan** (documented above)
8. **Document changes** in deployment history
9. **Review security regularly** (quarterly recommended)
10. **Keep dependencies updated** (monthly recommended)

---

**Quick Reference Version:** 1.0
**Last Updated:** November 2025
**Status:** Production Ready ✅
