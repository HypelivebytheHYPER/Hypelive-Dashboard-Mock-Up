# Vercel Analytics Integration

## Overview

The Hypelive Dashboard integrates Vercel Analytics and Speed Insights to provide real-time performance monitoring and user behavior analytics. This integration enables data-driven decision making and continuous performance optimization.

## Installed Packages

### @vercel/analytics (v1.5.0)
Provides comprehensive web analytics including:
- Page view tracking
- User behavior analytics
- Custom event tracking
- Real-time visitor metrics
- Geographic distribution
- Traffic sources and referrers

### @vercel/speed-insights (v1.2.0)
Monitors application performance with:
- Real User Monitoring (RUM)
- Core Web Vitals tracking:
  - Largest Contentful Paint (LCP)
  - First Input Delay (FID)
  - Cumulative Layout Shift (CLS)
  - First Contentful Paint (FCP)
  - Time to First Byte (TTFB)
- Performance score tracking
- Device and connection-specific metrics

## Implementation

### Integration Location
Both Analytics and Speed Insights components are integrated in the root layout:

**File**: `/app/layout.tsx`

```typescript
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Why Root Layout?
- Ensures analytics tracking across all pages
- Minimizes bundle size by loading once
- Maintains consistent tracking throughout navigation
- Leverages Next.js App Router architecture

## Features

### Analytics Features

#### 1. Automatic Page View Tracking
- Tracks all page navigations automatically
- Works with Next.js App Router and client-side navigation
- No additional configuration required

#### 2. Custom Event Tracking
Track custom events for specific user actions:

```typescript
import { track } from '@vercel/analytics'

// Track campaign creation
track('campaign_created', {
  campaign_type: 'influencer',
  platform: 'instagram'
})

// Track KOL interaction
track('kol_contacted', {
  kol_id: '123',
  method: 'email'
})
```

#### 3. User Properties
Set custom properties for better segmentation:

```typescript
import { track } from '@vercel/analytics'

track('page_view', {
  user_role: 'campaign_manager',
  account_tier: 'premium'
})
```

### Speed Insights Features

#### 1. Core Web Vitals Monitoring
Automatically tracks all Core Web Vitals:
- **LCP**: Measures loading performance (target: < 2.5s)
- **FID**: Measures interactivity (target: < 100ms)
- **CLS**: Measures visual stability (target: < 0.1)

#### 2. Real User Monitoring
- Collects data from actual user sessions
- Provides device-specific insights
- Tracks performance across different networks
- Geographic performance variations

#### 3. Performance Insights
- Identifies slow pages and components
- Provides optimization recommendations
- Tracks performance trends over time
- Benchmarks against industry standards

## Dashboard Access

### Vercel Analytics Dashboard
Access comprehensive analytics at:
- URL: `https://vercel.com/[team-name]/[project-name]/analytics`
- Features:
  - Real-time visitor tracking
  - Top pages and traffic sources
  - User behavior flows
  - Custom event analysis
  - Geographic distribution maps

### Speed Insights Dashboard
Monitor performance metrics at:
- URL: `https://vercel.com/[team-name]/[project-name]/speed-insights`
- Features:
  - Core Web Vitals scores
  - Performance trends over time
  - Page-level performance analysis
  - Device and network breakdowns
  - Optimization recommendations

## Configuration

### Environment Variables
No environment variables required for basic functionality. Analytics automatically works when deployed to Vercel.

For advanced configuration:

```bash
# .env.local
# Optional: Enable debug mode (development only)
NEXT_PUBLIC_VERCEL_ANALYTICS_DEBUG=1
```

### Development Mode
Analytics are disabled in development by default to avoid polluting production data:
- Runs in debug mode locally when `NEXT_PUBLIC_VERCEL_ANALYTICS_DEBUG=1`
- Automatically enabled in production deployments

### Custom Configuration
For advanced use cases, configure Analytics with options:

```typescript
<Analytics
  mode="auto" // 'auto' | 'production' | 'development'
  debug={false}
  beforeSend={(event) => {
    // Filter or modify events before sending
    return event
  }}
/>
```

## Best Practices

### 1. Event Naming Conventions
Use consistent, descriptive event names:
```typescript
// Good
track('campaign_created')
track('kol_invitation_sent')
track('content_approved')

// Avoid
track('click')
track('action')
track('event')
```

### 2. Event Properties
Include relevant context in event properties:
```typescript
track('campaign_created', {
  campaign_type: 'influencer',
  platform: 'instagram',
  budget_range: '10k-50k',
  duration_days: 30
})
```

### 3. Performance Monitoring
Regularly review Speed Insights to:
- Identify performance regressions
- Optimize slow pages
- Track improvements after optimizations
- Maintain Core Web Vitals targets

### 4. Privacy Compliance
Vercel Analytics is privacy-friendly by default:
- No cookies required
- GDPR compliant
- CCPA compliant
- No personal data collection
- Aggregated metrics only

## Monitoring Strategy

### Daily Monitoring
- Check real-time visitor counts
- Monitor active user sessions
- Review top performing pages

### Weekly Analysis
- Analyze traffic trends
- Review custom event patterns
- Check Core Web Vitals scores
- Identify slow-performing pages

### Monthly Reports
- Compare month-over-month growth
- Analyze user behavior patterns
- Review performance improvements
- Plan optimization initiatives

## Troubleshooting

### Analytics Not Tracking

**Issue**: No data appearing in Analytics dashboard

**Solutions**:
1. Verify deployment to Vercel (Analytics only works on Vercel)
2. Check that components are properly imported and rendered
3. Wait 5-10 minutes for data to appear (initial delay is normal)
4. Verify project is not in development mode

### Speed Insights Not Recording

**Issue**: Core Web Vitals not showing

**Solutions**:
1. Ensure sufficient traffic (requires minimum sample size)
2. Check that SpeedInsights component is rendered
3. Verify no ad blockers are interfering
4. Allow 24 hours for initial data collection

### Debug Mode Not Working

**Issue**: Debug logs not appearing in console

**Solutions**:
1. Set environment variable: `NEXT_PUBLIC_VERCEL_ANALYTICS_DEBUG=1`
2. Restart development server
3. Check browser console (should see analytics events)

## Performance Impact

### Bundle Size
- **@vercel/analytics**: ~1.5KB gzipped
- **@vercel/speed-insights**: ~1.2KB gzipped
- **Total**: ~2.7KB gzipped (minimal impact)

### Runtime Performance
- Non-blocking async loading
- No impact on First Contentful Paint
- Minimal JavaScript execution time
- Optimized for Core Web Vitals

### Network Impact
- Batched analytics events
- Compressed payloads
- CDN-optimized delivery
- Minimal bandwidth usage

## Integration Benefits

### For Product Teams
- Understand user behavior and feature usage
- Make data-driven product decisions
- Track feature adoption rates
- Identify user pain points

### For Development Teams
- Monitor application performance in real-time
- Identify and fix performance regressions
- Track deployment impact on performance
- Optimize based on real user data

### For Business Teams
- Track conversion funnels
- Measure campaign effectiveness
- Understand traffic sources
- Optimize user acquisition

## Future Enhancements

### Planned Features
1. **Custom Dashboards**: Build custom analytics views
2. **Advanced Segmentation**: Create user cohorts
3. **A/B Testing Integration**: Track experiment performance
4. **Automated Alerts**: Get notified of anomalies
5. **API Access**: Programmatic access to analytics data

### Recommended Tracking Events
For the Hypelive Dashboard, consider tracking:
- Campaign lifecycle events (create, launch, complete)
- KOL interactions (invite, approve, communicate)
- Content workflow (submit, review, approve, publish)
- Analytics page views and interactions
- Export and report generation
- User authentication events
- Feature usage metrics

## Resources

### Official Documentation
- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Speed Insights Docs](https://vercel.com/docs/speed-insights)
- [Analytics API Reference](https://vercel.com/docs/analytics/api)

### Related Documentation
- [Performance Optimization Guide](../optimization/performance-optimization.md)
- [Deployment Guide](../deployment/deployment-guide-2025.md)
- [Architecture Overview](../architecture/2025-architecture.md)

### Support
- [Vercel Support](https://vercel.com/support)
- [Analytics Dashboard](https://vercel.com/dashboard)
- [Community Forum](https://github.com/vercel/analytics/discussions)

---

**Last Updated**: November 2025
**Version**: 1.0.0
**Status**: Production Ready
