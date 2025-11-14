# Production Deployment Checklist

Complete pre-deployment, deployment, and post-deployment checklist for the Hypelive Dashboard with Next.js 16.

## Pre-Deployment Steps

### 1. Code Quality Verification

#### TypeScript Compilation
```bash
npm run type-check

# Expected output:
# ✓ No TypeScript errors found
```

**If errors occur:**
- Fix type errors before deployment
- No `any` types in production code
- All imports properly typed

#### ESLint Check
```bash
npm run lint

# Expected output:
# ✓ No ESLint errors
# ⚠ Warnings acceptable (document why)
```

**Acceptable warnings:**
- `react-hooks/exhaustive-deps` (if intentional)
- Unused variables in development utilities

**Must fix:**
- All errors
- Console.log statements in production code
- Unhandled promise rejections

#### Code Review Checklist
- [ ] All features tested
- [ ] No hardcoded credentials
- [ ] No console.log/console.error in production
- [ ] Error boundaries implemented
- [ ] Loading states for async operations
- [ ] Proper TypeScript types (no `any`)

### 2. Environment Variables Setup

#### Required Variables Check
```bash
# Verify all required variables are set
./scripts/check-env.sh

# Or manually:
cat .env.production | grep "NEXT_PUBLIC_APP_URL"
cat .env.production | grep "LARKBASE_APP_TOKEN"
```

**Required variables:**
```bash
# Core
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# API
NEXT_PUBLIC_LARKBASE_URL=https://larksuite-hype-server.hypelive.workers.dev
LARKBASE_APP_TOKEN=your_token
LARKBASE_APP_SECRET=your_secret

# Database
NEXT_PUBLIC_APP_TOKEN=your_app_token
NEXT_PUBLIC_KOLS_TABLE_ID=your_table_id
NEXT_PUBLIC_CAMPAIGNS_TABLE_ID=your_table_id
NEXT_PUBLIC_RATES_TABLE_ID=your_table_id
```

#### Security Check
- [ ] No `.env.production` in git
- [ ] All secrets in secure storage
- [ ] API tokens have restricted permissions
- [ ] CORS origins properly configured

### 3. Dependency Audit

#### Security Audit
```bash
npm audit

# Fix critical and high vulnerabilities
npm audit fix

# Review remaining issues
npm audit --audit-level=moderate
```

**Acceptable vulnerabilities:**
- Low severity in dev dependencies
- Issues with no available fix (document)

**Must fix:**
- Critical and high severity
- Vulnerabilities in production dependencies

#### Dependency Check
```bash
# Check for outdated packages
npm outdated

# Update with caution (test after)
npm update --save
```

**Optional dependencies check:**
```bash
# CSS optimization
npm list css-minimizer-webpack-plugin

# Compression (if needed)
npm list compression-webpack-plugin
```

### 4. Build Test

#### Clean Build
```bash
# Clean previous builds
rm -rf .next node_modules

# Fresh install
npm install

# Production build
npm run build
```

**Expected build output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (5/5)
✓ Finalizing page optimization

Route (app)                        Size     First Load JS
├ ○ /                             5.02 kB        92.3 kB
├ ○ /dashboard                    45.2 kB        234 kB
└ ○ /kol-discovery                32.1 kB        221 kB

○  (Static)  prerendered as static content
```

**Build must succeed with:**
- [ ] No compilation errors
- [ ] All routes generated
- [ ] Bundle sizes under budgets (see warnings)
- [ ] No critical warnings

#### Bundle Size Check
```bash
# Analyze bundle
ANALYZE=true npm run build

# Check budgets met:
# Bundle: < 350KB
# Asset: < 150KB
# Script: < 150KB
# Initial: < 500KB
# Total: < 800KB
```

#### Test Production Build Locally
```bash
# Start production server
npm run start

# Access http://localhost:3000
# Test all features
```

**Local production test checklist:**
- [ ] Homepage loads correctly
- [ ] All navigation works
- [ ] Forms submit successfully
- [ ] Data displays correctly
- [ ] No console errors
- [ ] Images load properly
- [ ] Fonts render correctly

### 5. Performance Validation

#### Lighthouse Audit
```bash
# Run Lighthouse (with production build running)
npx lighthouse http://localhost:3000 --view

# Target scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 90
```

**If scores below target:**
- Review [Performance Optimization Guide](./performance-optimization.md)
- Check for unoptimized images
- Verify code splitting working
- Test with production build, not dev

#### Core Web Vitals Check
```bash
# Check Web Vitals
npx web-vitals http://localhost:3000

# Targets:
# LCP (Largest Contentful Paint): < 2.5s
# FID (First Input Delay): < 100ms
# CLS (Cumulative Layout Shift): < 0.1
```

### 6. Security Header Testing

#### Test Security Headers
```bash
# Check all security headers present
curl -I http://localhost:3000 | grep -E "(Strict-Transport-Security|Content-Security-Policy|X-Frame-Options)"

# Or use online tool (after deployment)
# https://securityheaders.com/?q=https://yourdomain.com
```

**Expected headers:**
- [x] Strict-Transport-Security (HSTS)
- [x] Content-Security-Policy (CSP)
- [x] X-Frame-Options
- [x] X-Content-Type-Options
- [x] X-XSS-Protection
- [x] Referrer-Policy
- [x] Permissions-Policy
- [x] X-DNS-Prefetch-Control
- [x] X-Download-Options

**Target grade:** A+ on securityheaders.com

#### CSP Validation
```bash
# Test in browser console (production build)
# Should see NO CSP violations
# Open DevTools > Console
# Look for: "Content Security Policy"
```

**If CSP violations:**
- See [Security Configuration Guide](./security-configuration.md#csp-customization)
- Add necessary domains to CSP
- Test again

## Deployment Steps

### Option 1: Vercel Deployment (Recommended)

#### Initial Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project (first time)
vercel link
```

#### Set Environment Variables
```bash
# Add required variables
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add LARKBASE_APP_TOKEN production
vercel env add LARKBASE_APP_SECRET production
vercel env add NEXT_PUBLIC_APP_TOKEN production
vercel env add NEXT_PUBLIC_KOLS_TABLE_ID production
vercel env add NEXT_PUBLIC_CAMPAIGNS_TABLE_ID production
vercel env add NEXT_PUBLIC_RATES_TABLE_ID production

# Add optional variables
vercel env add NEXT_PUBLIC_GA_ID production
vercel env add SENTRY_DSN production
```

#### Deploy to Production
```bash
# Deploy to production
vercel --prod

# Expected output:
# ✓ Deployment ready
# Production: https://your-project.vercel.app
```

**Deployment checklist:**
- [ ] Build succeeds on Vercel
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Deployment preview tested

#### Vercel-Specific Settings
```
Project Settings:
├── Framework: Next.js
├── Node.js Version: 20.x
├── Build Command: npm run build
├── Output Directory: .next
└── Install Command: npm install

Performance:
├── Edge Functions: Enabled
├── Analytics: Enabled (optional)
└── Speed Insights: Enabled (optional)
```

### Option 2: Cloudflare Pages

#### Build Configuration
```bash
# In Cloudflare Pages dashboard
Build command: npm run build
Build output directory: .next
Root directory: /
Node.js version: 20

# Or use Wrangler CLI
wrangler pages deploy .next --project-name=hypelive-dashboard
```

#### Environment Variables
```bash
# Set in Cloudflare Pages dashboard
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.pages.dev
# ... (all other required variables)
```

### Option 3: Docker Deployment

#### Build Docker Image
```bash
# Build production image
docker build -t hypelive-dashboard:latest -f docker/production/Dockerfile .

# Test locally
docker run -p 3000:3000 --env-file .env.production hypelive-dashboard:latest
```

#### Docker Compose Deployment
```bash
# Start all services
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### Option 4: Custom Server

#### Setup Process
```bash
# 1. Build application
npm run build

# 2. Copy files to server
scp -r .next package*.json node_modules user@server:/var/www/hypelive-dashboard

# 3. On server: Install dependencies
ssh user@server
cd /var/www/hypelive-dashboard
npm install --production

# 4. Set environment variables
cp .env.production.example .env.production
nano .env.production  # Edit with production values

# 5. Start with PM2
pm2 start npm --name "hypelive-dashboard" -- start
pm2 save
pm2 startup
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/hypelive-dashboard
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

```bash
# Enable site and restart nginx
ln -s /etc/nginx/sites-available/hypelive-dashboard /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl restart nginx
```

## Post-Deployment Verification

### 1. Immediate Checks (First 5 Minutes)

#### Application Health
```bash
# Check application is running
curl -I https://yourdomain.com

# Expected response:
HTTP/2 200
```

#### Smoke Tests
- [ ] Homepage loads: https://yourdomain.com
- [ ] Dashboard accessible: https://yourdomain.com/dashboard
- [ ] API endpoints responding: https://yourdomain.com/api/health
- [ ] No 404 errors for static assets
- [ ] Images loading correctly
- [ ] Fonts rendering properly

#### Console Check
```bash
# Open browser DevTools > Console
# Should see:
- No JavaScript errors
- No CSP violations
- No network errors
- Clean console output
```

### 2. Functional Testing (First 30 Minutes)

#### Core Features
- [ ] User authentication (if applicable)
- [ ] Data fetching and display
- [ ] Forms submit successfully
- [ ] Search/filtering works
- [ ] Export functionality works
- [ ] Navigation between pages
- [ ] Mobile responsive layout

#### Data Integrity
- [ ] API calls return correct data
- [ ] Data transformations working
- [ ] Caching working properly
- [ ] Real-time updates (if applicable)

### 3. Security Verification

#### SSL/TLS Check
```bash
# Test SSL configuration
curl -I https://yourdomain.com | grep -i "strict-transport"

# Check SSL grade
# https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

**Target:** A or A+ grade

#### Security Headers Check
```bash
# Use SecurityHeaders.com
https://securityheaders.com/?q=https://yourdomain.com

# Target: A+ grade
```

#### CSP Violations Check
```bash
# Browser console should show:
# No "Content Security Policy" errors or warnings
```

### 4. Performance Testing

#### Lighthouse Audit (Production)
```bash
# Run Lighthouse on production URL
npx lighthouse https://yourdomain.com --view

# Target scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 90
```

#### Page Load Testing
```bash
# Test from different locations
https://www.webpagetest.org/

# Run tests from:
- USA (East Coast)
- Europe (London)
- Asia (Tokyo)

# Target metrics:
# First Contentful Paint: < 1.8s
# Largest Contentful Paint: < 2.5s
# Time to Interactive: < 3.8s
```

#### Bundle Size Verification
```bash
# Check actual bundle sizes in browser
# DevTools > Network > Disable cache > Reload

# Check JS bundles are:
- framework.js: ~130KB (gzipped)
- vendors.js: ~150KB (gzipped)
- page bundles: <100KB each (gzipped)
```

### 5. Monitoring Setup

#### Error Tracking
```bash
# If using Sentry
# Check Sentry dashboard for errors
# https://sentry.io/organizations/your-org/issues/

# Should see:
- Zero errors in first hour
- No unhandled promise rejections
```

#### Analytics Setup
```bash
# If using Google Analytics
# Verify GA4 receiving data:
# https://analytics.google.com/analytics/web/

# Check:
- Pageviews tracking
- Events firing correctly
- Real-time users visible
```

#### Uptime Monitoring
```bash
# Set up uptime monitor (e.g., UptimeRobot)
Monitor:
- URL: https://yourdomain.com
- Check interval: 5 minutes
- Alert if down: Email/SMS

# Or use:
# https://uptimerobot.com/
# https://www.pingdom.com/
```

### 6. 24-Hour Monitoring

#### Key Metrics to Track

**Performance:**
- [ ] Average response time < 200ms
- [ ] 95th percentile < 500ms
- [ ] Error rate < 0.1%
- [ ] Uptime > 99.9%

**Usage:**
- [ ] Active users tracked
- [ ] Page views recorded
- [ ] User flows working
- [ ] No stuck sessions

**Errors:**
- [ ] Zero critical errors
- [ ] < 5 warnings per hour
- [ ] All errors logged properly

### 7. One-Week Monitoring

#### Performance Trends
```bash
# Check for:
- Memory leaks (memory usage stable)
- Database connection issues
- Cache hit rates > 80%
- API response times stable
```

#### User Feedback
- [ ] No user-reported bugs
- [ ] Performance complaints < 1%
- [ ] Feature requests tracked

## Rollback Plan

### When to Rollback

**Immediate rollback if:**
- Critical functionality broken
- Data corruption detected
- Security vulnerability exposed
- > 10% error rate
- Site completely down

### Rollback Methods

#### Vercel Rollback
```bash
# Instant rollback to previous deployment
vercel rollback

# Or via dashboard:
# Deployments > Select previous > Promote to Production
```

#### Git Rollback
```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main

# Then redeploy
vercel --prod
```

#### Docker Rollback
```bash
# Use previous image
docker pull hypelive-dashboard:previous-tag
docker-compose down
docker-compose up -d
```

### Emergency Hotfix Process

```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-issue

# 2. Fix the issue
# ... make fixes ...

# 3. Test locally
npm run build
npm start

# 4. Commit and push
git add .
git commit -m "hotfix: critical issue description"
git push origin hotfix/critical-issue

# 5. Deploy hotfix
vercel --prod

# 6. Merge to main
git checkout main
git merge hotfix/critical-issue
git push origin main
```

## Deployment Sign-Off

### Developer Checklist
- [ ] All code reviewed and tested
- [ ] Build succeeds locally
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Bundle sizes under budgets
- [ ] Security headers configured
- [ ] Performance targets met

**Developer:** _________________ **Date:** _________

### QA Checklist
- [ ] All features tested in production
- [ ] No critical bugs found
- [ ] Mobile responsive verified
- [ ] Cross-browser testing complete
- [ ] Performance acceptable
- [ ] Security headers verified

**QA Engineer:** _________________ **Date:** _________

### DevOps Checklist
- [ ] Environment variables set
- [ ] SSL certificate active
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Rollback plan tested
- [ ] Alerts configured

**DevOps:** _________________ **Date:** _________

### Product Owner Checklist
- [ ] Features meet requirements
- [ ] User experience acceptable
- [ ] Ready for production traffic
- [ ] Success metrics defined
- [ ] Support team briefed

**Product Owner:** _________________ **Date:** _________

## Post-Deployment Tasks

### Communication

#### Internal Team Notification
```
Subject: ✅ Hypelive Dashboard - Production Deployment Complete

Team,

The Hypelive Dashboard v2.0 has been successfully deployed to production.

✅ Deployment Details:
- URL: https://dashboard.yourdomain.com
- Version: 2.0.0 (Next.js 16)
- Deployment time: [timestamp]
- Status: All systems operational

🎯 Key Features:
- Next.js 16 with React 19
- Enterprise-grade security (A+ rating)
- Performance optimized (Lighthouse 90+)
- Enhanced caching and code splitting

📊 Performance Metrics:
- Build time: 45s
- Bundle size: 640KB (under 800KB budget)
- Lighthouse score: 94
- Security headers: 9 implemented

🔍 Monitoring:
- Sentry: [link]
- Analytics: [link]
- Uptime: [link]

⚠️ Known Issues:
- None

For any issues, contact: tech@hypelive.com

Thanks,
DevOps Team
```

#### User Communication
```
Subject: 🚀 Platform Update - Enhanced Performance

Dear Valued User,

We've just deployed a major platform update with significant improvements:

✅ What's New:
- Faster page loads (2x improvement)
- Enhanced security
- Better mobile experience
- Improved reliability

🎯 What You'll Notice:
- Smoother navigation
- Faster data loading
- Better overall performance

No action required on your end. All your data and settings are preserved.

Questions? Contact support@hypelive.com

Best regards,
Hypelive Team
```

### Documentation Updates

- [ ] Update deployment history
- [ ] Document any issues encountered
- [ ] Update runbook if needed
- [ ] Share lessons learned
- [ ] Update deployment version in docs

### Next Sprint Planning

- [ ] Review deployment metrics
- [ ] Plan next optimizations
- [ ] Schedule performance review
- [ ] Plan security updates
- [ ] Review user feedback

## Support & Resources

### Quick Links
- **Deployment History:** `docs/deployment/history/`
- **Troubleshooting:** [troubleshooting.md](./troubleshooting.md)
- **Performance Guide:** [performance-optimization.md](./performance-optimization.md)
- **Security Guide:** [security-configuration.md](./security-configuration.md)

### Emergency Contacts
- **DevOps On-Call:** [phone/slack]
- **Technical Lead:** [phone/slack]
- **Product Owner:** [phone/slack]

### Monitoring Dashboards
- **Application:** https://dashboard.yourdomain.com/admin
- **Sentry:** https://sentry.io/organizations/your-org
- **Analytics:** https://analytics.google.com
- **Uptime:** https://uptimerobot.com

---

**Last Updated:** November 2025
**Next.js Version:** 16.0.3
**Deployment Method:** [Vercel/Cloudflare/Docker/Custom]
**Status:** Ready for Production ✅
