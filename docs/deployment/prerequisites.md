# Deployment Prerequisites

This document outlines all requirements for deploying the Hypelive Dashboard with Next.js 16 and the modernized configuration.

## System Requirements

### Node.js & npm

```bash
# Required versions
Node.js: >= 18.17.0 (Recommended: 20.x LTS)
npm: >= 9.0.0 (Recommended: 10.x)

# Check your versions
node --version
npm --version
```

**Why these versions?**
- Next.js 16 requires Node.js 18.17.0 minimum for React 19 support
- npm 9+ provides better dependency resolution and security features
- Node.js 20 LTS offers enhanced performance and stability

### Build Dependencies

#### Required Dependencies (Always Needed)

```bash
# Installed automatically with npm install
- next: 16.0.3
- react: 19.2.0
- react-dom: 19.2.0
- typescript: 5.7.2
- @next/bundle-analyzer: 16.0.3 (for bundle analysis)
```

#### Optional Dependencies (Install as Needed)

```bash
# CSS Optimization (Recommended for Production)
npm install --save-dev css-minimizer-webpack-plugin

# Gzip Compression (If not using CDN compression)
npm install --save-dev compression-webpack-plugin
```

**When to install optional dependencies:**
- **css-minimizer-webpack-plugin**: Always recommended for production to reduce CSS bundle sizes by 20-40%
- **compression-webpack-plugin**: Only if your hosting platform doesn't provide built-in gzip compression (Vercel, Cloudflare, etc. handle this automatically)

## Environment Variables

### Required Variables

Create a `.env.production` file with these essential variables:

```bash
# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# API Endpoints
NEXT_PUBLIC_LARKBASE_URL=https://larksuite-hype-server.hypelive.workers.dev
LARKBASE_APP_TOKEN=your_app_token_here
LARKBASE_APP_SECRET=your_app_secret_here

# Database Tables
NEXT_PUBLIC_APP_TOKEN=H2GQbZBFqaUW2usqPswlczYggWg
NEXT_PUBLIC_KOLS_TABLE_ID=tbl5864QVOiEokTQ
NEXT_PUBLIC_CAMPAIGNS_TABLE_ID=tbldcqoLHjrdN1vM
NEXT_PUBLIC_RATES_TABLE_ID=tblMM5mBcbxzEiJ2
```

### Optional Variables

```bash
# Build Optimization
ANALYZE=false                    # Set to 'true' to analyze bundle size
ENABLE_COMPRESSION=false         # Set to 'true' to enable gzip compression

# Feature Flags
NEXT_PUBLIC_ENABLE_THAI_SEARCH=true
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_SMART_SEARCH=true

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Performance Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn_here
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

### Environment Variable Security

**Best Practices:**
1. **Never commit** `.env.production` to version control
2. **Use platform secrets** (Vercel Secrets, GitHub Secrets, etc.)
3. **Rotate tokens** regularly (quarterly recommended)
4. **Limit access** to production environment variables

**Variable Naming Convention:**
- `NEXT_PUBLIC_*`: Exposed to browser (client-side)
- Without prefix: Server-side only (secure)

## Platform-Specific Requirements

### Vercel

```bash
# Recommended settings for Vercel deployment
Node.js Version: 20.x
Build Command: npm run build
Output Directory: .next
Install Command: npm install

# Framework Preset
Framework: Next.js
Build Settings: Auto-detected
```

**Vercel-specific environment variables:**
```bash
# Automatically provided by Vercel
VERCEL=1
VERCEL_ENV=production
VERCEL_URL=your-project.vercel.app
```

### Cloudflare Pages

```bash
# Build configuration
Build command: npm run build
Build output directory: .next
Root directory: /
Node.js version: 20

# Environment variables
NODE_VERSION=20
NEXT_PUBLIC_APP_URL=https://yourdomain.pages.dev
```

### Docker

```dockerfile
# Required base image
FROM node:20-alpine

# Build arguments
ARG NODE_ENV=production
ARG NEXT_PUBLIC_APP_URL
ARG LARKBASE_APP_TOKEN

# Install dependencies
RUN apk add --no-cache libc6-compat
```

### Custom Server

```bash
# System requirements
- Linux (Ubuntu 20.04+ recommended)
- Node.js 20.x installed
- npm or yarn package manager
- nginx or similar reverse proxy
- SSL certificate (Let's Encrypt recommended)

# Process manager
pm2 or systemd for process management
```

## Storage & Caching

### Optional Redis (For Advanced Caching)

```bash
# If using Redis for caching
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
CACHE_KEY_PREFIX=hypelive:

# Redis version
Redis: >= 7.0 (Recommended: 7.2+)
```

**When to use Redis:**
- High-traffic applications (1000+ requests/minute)
- Need for cross-instance caching
- Advanced cache invalidation strategies

### File System Caching (Built-in)

Next.js 16 includes built-in file system caching with Turbopack:

```typescript
// next.config.ts (already configured)
experimental: {
  turbopackFileSystemCacheForDev: true  // Faster development builds
}
```

**No additional setup required** - works out of the box!

## Security Requirements

### SSL/TLS Certificate

**Production Requirements:**
- Valid SSL/TLS certificate (Let's Encrypt free option)
- TLS 1.2 or higher
- Strong cipher suites

**Testing SSL:**
```bash
# Test SSL configuration
curl -I https://yourdomain.com

# Check SSL grade
https://www.ssllabs.com/ssltest/
```

### Security Headers

Already configured in `next.config.ts`:
- HSTS (Strict-Transport-Security)
- CSP (Content-Security-Policy)
- X-Frame-Options
- X-Content-Type-Options
- And 6 more security headers

**No additional configuration needed!**

## Network Requirements

### Firewall Rules

```bash
# Required open ports
Port 443 (HTTPS): Inbound traffic
Port 3000 (Next.js): Internal only (if using reverse proxy)

# Optional
Port 80 (HTTP): For redirect to HTTPS
Port 6379 (Redis): Internal only
```

### DNS Configuration

```bash
# Required DNS records
A record: yourdomain.com -> Your server IP
CNAME: www.yourdomain.com -> yourdomain.com

# Optional (for CDN)
CNAME: cdn.yourdomain.com -> Your CDN URL
```

## Monitoring & Logging

### Optional Monitoring Setup

```bash
# Performance monitoring (Optional)
Sentry, DataDog, New Relic, or similar

# Log aggregation (Optional)
LogRocket, Papertrail, or similar

# Uptime monitoring (Recommended)
UptimeRobot, Pingdom, or similar
```

## Pre-Deployment Checklist

### 1. System Check

```bash
# Verify Node.js version
node --version  # Should be >= 18.17.0

# Verify npm version
npm --version   # Should be >= 9.0.0

# Check disk space
df -h           # Need at least 2GB free
```

### 2. Dependencies Check

```bash
# Clean install
rm -rf node_modules .next
npm install

# Verify all dependencies installed
npm list --depth=0
```

### 3. Environment Variables Check

```bash
# Check required variables are set
echo $NODE_ENV
echo $NEXT_PUBLIC_APP_URL
echo $LARKBASE_APP_TOKEN

# Or check .env.production file
cat .env.production
```

### 4. Build Test

```bash
# Test production build
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization

# Check build size
du -sh .next
```

### 5. Optional Dependencies Check

```bash
# If using CSS minification
npm list css-minimizer-webpack-plugin

# If using compression
npm list compression-webpack-plugin
```

## Common Prerequisites Issues

### Issue: Node.js Version Mismatch

**Symptoms:**
```
Error: The engine "node" is incompatible with this module
```

**Solution:**
```bash
# Use nvm to install correct Node.js version
nvm install 20
nvm use 20

# Or download from nodejs.org
# https://nodejs.org/en/download/
```

### Issue: npm Version Too Old

**Symptoms:**
```
npm WARN old lockfile
npm WARN deprecated dependencies
```

**Solution:**
```bash
# Update npm
npm install -g npm@latest

# Verify version
npm --version
```

### Issue: Missing Build Dependencies

**Symptoms:**
```
Module not found: Can't resolve 'css-minimizer-webpack-plugin'
```

**Solution:**
```bash
# Install optional dependencies
npm install --save-dev css-minimizer-webpack-plugin
npm install --save-dev compression-webpack-plugin
```

### Issue: Environment Variables Not Set

**Symptoms:**
```
TypeError: Cannot read property 'NEXT_PUBLIC_APP_URL' of undefined
```

**Solution:**
```bash
# Create .env.production file
cp .env.example .env.production

# Or set variables in hosting platform
# Vercel: Project Settings > Environment Variables
# Cloudflare: Pages > Settings > Environment variables
```

## Next Steps

After verifying all prerequisites:

1. Read the [Security Configuration Guide](./security-configuration.md)
2. Review the [Performance Optimization Guide](./performance-optimization.md)
3. Follow the [Production Deployment Checklist](./production-checklist.md)

## Support

If you encounter any prerequisites issues:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Review Next.js 16 documentation: https://nextjs.org/docs
3. Contact support: tech@hypelive.com

---

**Last Updated:** November 2025
**Next.js Version:** 16.0.3
**Node.js Required:** >= 18.17.0
