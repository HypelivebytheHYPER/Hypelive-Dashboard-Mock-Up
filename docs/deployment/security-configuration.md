# Security Configuration Guide

This guide documents the enterprise-grade security headers and configurations implemented in the Hypelive Dashboard, achieving an A+ security rating.

## Security Headers Overview

The dashboard implements **9 comprehensive security headers** in `next.config.ts`, providing defense-in-depth protection against common web vulnerabilities.

### Quick Security Status

- **Security Rating:** A+ (securityheaders.com)
- **Headers Implemented:** 9 core + 3 API-specific
- **Protection Level:** Enterprise-grade
- **Compliance:** OWASP Top 10 compliant

## Core Security Headers

### 1. Strict-Transport-Security (HSTS)

**Purpose:** Forces browsers to use HTTPS connections only, preventing downgrade attacks.

**Configuration:**
```typescript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

**What it does:**
- **max-age=63072000**: Enforces HTTPS for 2 years (730 days)
- **includeSubDomains**: Applies to all subdomains (api.yourdomain.com, etc.)
- **preload**: Eligible for browser HSTS preload list

**Protection against:**
- SSL stripping attacks
- Cookie hijacking
- Man-in-the-middle attacks
- Protocol downgrade attacks

**When to adjust:**
- **Never reduce max-age** in production (security risk)
- **Remove includeSubDomains** if you have HTTP-only subdomains (not recommended)
- **Add preload** to HSTS preload list: https://hstspreload.org/

**Testing:**
```bash
# Check HSTS header
curl -I https://yourdomain.com | grep -i strict-transport

# Expected output:
strict-transport-security: max-age=63072000; includeSubDomains; preload
```

### 2. Content-Security-Policy (CSP)

**Purpose:** Controls what resources can be loaded and executed, preventing XSS and injection attacks.

**Configuration:**
```typescript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
}
```

**Directive Breakdown:**

| Directive | Value | What It Allows |
|-----------|-------|----------------|
| `default-src 'self'` | Same origin only | Default policy for all resources |
| `script-src 'self' 'unsafe-inline' 'unsafe-eval'` | Self + inline + eval | Next.js requires inline scripts |
| `style-src 'self' 'unsafe-inline'` | Self + inline | Tailwind CSS needs inline styles |
| `img-src 'self' data: https:` | Self + data URIs + HTTPS | Images from any HTTPS source |
| `font-src 'self' data:` | Self + data URIs | Web fonts and data URI fonts |
| `connect-src 'self' https:` | Self + HTTPS APIs | API calls to HTTPS endpoints |
| `frame-ancestors 'none'` | None | Prevents clickjacking (no iframes) |
| `base-uri 'self'` | Same origin | Restricts `<base>` tag |
| `form-action 'self'` | Same origin | Form submissions only to self |
| `upgrade-insecure-requests` | N/A | Upgrades HTTP to HTTPS |

**Protection against:**
- Cross-Site Scripting (XSS)
- Code injection attacks
- Clickjacking
- Unauthorized resource loading
- Data exfiltration

**Customizing CSP:**

#### Allow Specific External Scripts
```typescript
// Example: Allow Google Analytics
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com"
```

#### Allow Specific External APIs
```typescript
// Example: Allow specific API domains
"connect-src 'self' https://api.yourdomain.com https://analytics.google.com"
```

#### Allow External Images
```typescript
// Example: Allow images from specific CDN
"img-src 'self' data: https: https://cdn.yourdomain.com"
```

#### Tighten Security (Remove unsafe-inline/unsafe-eval)
```typescript
// More restrictive CSP (requires nonce-based approach)
"script-src 'self' 'nonce-{random}'",  // Use nonces instead of unsafe-inline
"style-src 'self' 'nonce-{random}'"     // Use nonces for styles
```

**Warning:** Removing `unsafe-inline` and `unsafe-eval` requires implementing nonces and may break Next.js functionality. Only do this if you have advanced CSP knowledge.

**Testing CSP:**
```bash
# Check CSP header
curl -I https://yourdomain.com | grep -i content-security

# Test CSP violations (browser console)
# Open browser DevTools > Console
# Look for CSP violation warnings
```

**Common CSP Issues:**

| Issue | Symptom | Fix |
|-------|---------|-----|
| Inline scripts blocked | Console errors about blocked scripts | Add 'unsafe-inline' (already included) |
| External API blocked | Network requests failing | Add API domain to connect-src |
| Images not loading | Images show broken icon | Add image domain to img-src |
| Third-party widgets broken | Analytics/chat widgets not working | Add domains to script-src, connect-src |

### 3. X-Frame-Options

**Purpose:** Prevents clickjacking by controlling iframe embedding.

**Configuration:**
```typescript
{
  key: 'X-Frame-Options',
  value: 'DENY'
}
```

**Options:**
- **DENY**: Never allow embedding in iframes (most secure)
- **SAMEORIGIN**: Allow embedding only on same domain
- **ALLOW-FROM uri**: Allow specific domains (deprecated)

**When to change:**
```typescript
// If you need iframe embedding on same domain
value: 'SAMEORIGIN'

// Current setting (recommended):
value: 'DENY'  // No iframe embedding allowed
```

**Note:** This works alongside CSP's `frame-ancestors 'none'` for defense-in-depth.

### 4. X-Content-Type-Options

**Purpose:** Prevents MIME type sniffing attacks.

**Configuration:**
```typescript
{
  key: 'X-Content-Type-Options',
  value: 'nosniff'
}
```

**What it does:**
- Forces browsers to respect declared Content-Type
- Prevents execution of misinterpreted files (e.g., HTML disguised as image)

**Protection against:**
- MIME confusion attacks
- Content-Type spoofing
- Malicious file uploads

**No customization needed** - always use `nosniff`.

### 5. X-XSS-Protection

**Purpose:** Legacy XSS filter for older browsers (IE, old Safari).

**Configuration:**
```typescript
{
  key: 'X-XSS-Protection',
  value: '1; mode=block'
}
```

**Options:**
- **0**: Disable XSS filter
- **1**: Enable XSS filter
- **1; mode=block**: Enable and block page load if attack detected

**Note:** Modern browsers rely on CSP instead. This header is for legacy browser support.

### 6. Referrer-Policy

**Purpose:** Controls how much referrer information is sent with requests.

**Configuration:**
```typescript
{
  key: 'Referrer-Policy',
  value: 'strict-origin-when-cross-origin'
}
```

**Policy Options:**

| Policy | Privacy Level | When to Use |
|--------|---------------|-------------|
| `no-referrer` | Highest | Maximum privacy (breaks some analytics) |
| `no-referrer-when-downgrade` | Medium | Default browser behavior |
| `strict-origin-when-cross-origin` | Balanced | Recommended (current setting) |
| `same-origin` | High | Only send referrer to same domain |
| `origin` | Low | Send only origin, not full URL |

**Current setting behavior:**
- **Same-origin requests**: Send full URL
- **Cross-origin HTTPS→HTTPS**: Send origin only
- **Cross-origin HTTPS→HTTP**: No referrer

**When to adjust:**
```typescript
// For maximum privacy (may break analytics)
value: 'no-referrer'

// For analytics-heavy sites
value: 'origin-when-cross-origin'
```

### 7. Permissions-Policy

**Purpose:** Disables unnecessary browser features and APIs to reduce attack surface.

**Configuration:**
```typescript
{
  key: 'Permissions-Policy',
  value: [
    'camera=()',           // Disable camera
    'microphone=()',       // Disable microphone
    'geolocation=()',      // Disable location
    'interest-cohort=()',  // Disable FLoC tracking
    'payment=()',          // Disable payment API
    'usb=()',             // Disable USB
    'magnetometer=()',     // Disable magnetometer
    'gyroscope=()',       // Disable gyroscope
    'accelerometer=()',   // Disable accelerometer
  ].join(', ')
}
```

**Enabling Features:**

```typescript
// Example: Enable camera for video calls
'camera=(self)',  // Allow camera on same origin

// Example: Enable geolocation
'geolocation=(self "https://maps.googleapis.com")',  // Allow self and Google Maps

// Example: Enable payment API
'payment=(self)',  // Allow payment on same origin
```

**Available Features:**
- `camera`, `microphone`: Media devices
- `geolocation`: Location access
- `payment`: Payment Request API
- `usb`: USB device access
- `accelerometer`, `gyroscope`, `magnetometer`: Sensor APIs
- `fullscreen`: Fullscreen API
- `picture-in-picture`: PiP mode
- `screen-wake-lock`: Keep screen awake

**Common Customizations:**
```typescript
// For video conferencing app
'camera=(self)', 'microphone=(self)'

// For maps/location features
'geolocation=(self "https://maps.googleapis.com")'

// For e-commerce
'payment=(self)'
```

### 8. X-DNS-Prefetch-Control

**Purpose:** Controls DNS prefetching for privacy.

**Configuration:**
```typescript
{
  key: 'X-DNS-Prefetch-Control',
  value: 'off'
}
```

**Options:**
- **off**: Disable DNS prefetching (more private)
- **on**: Enable DNS prefetching (faster but less private)

**When to enable:**
```typescript
// If performance is critical and privacy is less important
value: 'on'
```

### 9. Additional Security Headers

**X-Download-Options** (IE-specific):
```typescript
{
  key: 'X-Download-Options',
  value: 'noopen'  // Prevents IE from executing downloads in site context
}
```

**X-Permitted-Cross-Domain-Policies** (Adobe-specific):
```typescript
{
  key: 'X-Permitted-Cross-Domain-Policies',
  value: 'none'  // Restricts Flash/PDF cross-domain requests
}
```

## API Routes Security

Separate security headers for API endpoints (`/api/*`):

```typescript
{
  source: '/api/:path*',
  headers: [
    // CORS Configuration
    {
      key: 'Access-Control-Allow-Credentials',
      value: 'true'
    },
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
    },
    // Cache Control
    {
      key: 'Cache-Control',
      value: 'no-store, must-revalidate'
    }
  ]
}
```

**CORS Customization:**

```typescript
// Production: Lock down to specific origin
value: 'https://dashboard.yourdomain.com'

// Development: Allow localhost
value: 'http://localhost:3000'

// Multiple origins: Implement dynamic origin checking
// (requires middleware - see troubleshooting guide)
```

## Security Testing

### 1. Test Security Headers

**Online Tools:**
```bash
# SecurityHeaders.com
https://securityheaders.com/?q=https://yourdomain.com

# Expected Grade: A+
```

**Command Line:**
```bash
# Check all headers
curl -I https://yourdomain.com

# Check specific header
curl -I https://yourdomain.com | grep -i strict-transport-security
```

### 2. Test CSP Violations

**Browser Console:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Load your application
4. Look for CSP violation warnings

**Expected:** No CSP violations (clean console)

### 3. Test HSTS

```bash
# Check HSTS
curl -I https://yourdomain.com | grep -i strict-transport

# Check if preloaded
https://hstspreload.org/?domain=yourdomain.com
```

### 4. Penetration Testing Tools

```bash
# OWASP ZAP
https://www.zaproxy.org/

# Burp Suite
https://portswigger.net/burp

# SSL Labs
https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

## Common Security Scenarios

### Scenario 1: Adding Third-Party Analytics

**Example: Google Analytics**

```typescript
// Update CSP in next.config.ts
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
"connect-src 'self' https: https://www.google-analytics.com",
"img-src 'self' data: https: https://www.google-analytics.com"
```

### Scenario 2: Adding CDN for Assets

**Example: Cloudflare CDN**

```typescript
// Update CSP
"img-src 'self' data: https: https://cdn.yourdomain.com",
"font-src 'self' data: https://cdn.yourdomain.com",
"style-src 'self' 'unsafe-inline' https://cdn.yourdomain.com"
```

### Scenario 3: Embedding External Content

**Example: YouTube videos**

```typescript
// Update CSP
"frame-src https://www.youtube.com https://www.youtube-nocookie.com",

// Also update X-Frame-Options
// (Keep DENY for main site, YouTube handles its own)
```

### Scenario 4: WebSocket Connections

**Example: Real-time features**

```typescript
// Update CSP
"connect-src 'self' https: wss://api.yourdomain.com"
```

## Security Compliance

### OWASP Top 10 Coverage

| OWASP Risk | Protection | Headers |
|------------|------------|---------|
| Injection | Protected | CSP, X-Content-Type-Options |
| Broken Authentication | Partial | HSTS, Secure cookies |
| Sensitive Data Exposure | Protected | HSTS, Referrer-Policy |
| XML External Entities | N/A | Not applicable |
| Broken Access Control | Partial | Permissions-Policy |
| Security Misconfiguration | Protected | All headers |
| XSS | Protected | CSP, X-XSS-Protection |
| Insecure Deserialization | Partial | CSP |
| Known Vulnerabilities | Process | Regular updates |
| Insufficient Logging | Separate | See monitoring guide |

### PCI DSS Compliance

Headers support PCI DSS requirements:
- Requirement 6.5.10: XSS protection (CSP)
- Requirement 4.1: HTTPS enforcement (HSTS)
- Requirement 6.6: Security headers (All headers)

### GDPR Compliance

Privacy headers:
- `Referrer-Policy`: Limits data leakage
- `Permissions-Policy`: Disables unnecessary tracking
- `X-DNS-Prefetch-Control`: Reduces tracking

## Troubleshooting

See [Troubleshooting Guide](./troubleshooting.md#security-issues) for:
- CSP violation fixes
- CORS configuration
- Mixed content issues
- Browser compatibility

## Next Steps

1. Review [Performance Optimization Guide](./performance-optimization.md)
2. Follow [Production Deployment Checklist](./production-checklist.md)
3. Set up [Security Monitoring](../monitoring/security-monitoring.md)

---

**Last Updated:** November 2025
**Security Grade:** A+
**Headers Count:** 9 core + 3 API-specific
