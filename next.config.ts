/**
 * Next.js 16 Configuration for Hypelive Dashboard
 *
 * This configuration includes:
 * - Comprehensive security headers (HSTS, CSP, etc.)
 * - Performance budgets for bundle size monitoring
 * - Advanced webpack optimizations (code splitting, tree shaking, compression)
 * - Next.js 16 features (Cache Components, React Compiler)
 *
 * Optional Dependencies (install if needed):
 * - css-minimizer-webpack-plugin: For CSS minification
 * - compression-webpack-plugin: For gzip compression (enable via ENABLE_COMPRESSION=true)
 *
 * Usage:
 * - Development: npm run dev
 * - Production: npm run build
 * - Analyze: ANALYZE=true npm run build
 */

import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const isAnalyze = process.env.ANALYZE === 'true'

const nextConfig: NextConfig = {
  // ============================================
  // NEXT.JS 16 CORE FEATURES
  // ============================================
  cacheComponents: true,              // Enable Cache Components - revolutionary caching
  reactCompiler: true,                // Enable React Compiler for automatic memoization

  // Server component external packages (moved from experimental in Next.js 16)
  // Note: recharts is optimized via optimizePackageImports instead
  serverExternalPackages: [],

  // ============================================
  // EXPERIMENTAL OPTIMIZATIONS
  // ============================================
  experimental: {
    // Turbopack optimizations for development
    turbopackFileSystemCacheForDev: true,  // Faster development builds with persistent cache

    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      'recharts',           // Chart library optimization
      'lucide-react',       // Icon library tree-shaking
      'date-fns',          // Date utility optimization
      '@radix-ui/react-*'  // UI component library optimization
    ],

    // React 19 and Next.js 16 optimizations
    webpackBuildWorker: true,          // Parallel webpack builds for faster compilation
    optimizeCss: true,                 // Optimize CSS delivery and minimize size
  },
  
  // ============================================
  // IMAGE OPTIMIZATION (Next.js 16)
  // ============================================
  images: {
    // Cache settings - 4 hours for better performance
    minimumCacheTTL: 14400,           // 4 hours (increased from default 1 hour)

    // Quality settings - 75 provides great balance between size and quality
    qualities: [75],                  // Optimized quality for dashboard images

    // Security settings
    maximumRedirects: 3,              // Limit redirects to prevent abuse
    dangerouslyAllowLocalIP: isDevelopment, // Only in dev for local testing

    // Modern image formats for better compression
    formats: ['image/webp', 'image/avif'], // WebP and AVIF for optimal size

    // Responsive image sizes for different devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Remote image sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],

    // Custom loader configuration
    loaderFile: './lib/image-loader.ts',
    path: '/_next/image',
    loader: 'default',
  },

  // ============================================
  // PERFORMANCE BUDGETS (Webpack Configuration)
  // ============================================
  // Note: Performance budgets are handled in webpack configuration below
  // See webpack.performance section for bundle size monitoring

  // ============================================
  // SECURITY HEADERS
  // ============================================
  // Comprehensive security headers following Next.js 16 best practices
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          // ----------------
          // HTTP Strict Transport Security (HSTS)
          // ----------------
          // Forces HTTPS for 2 years (includes subdomains)
          // Prevents downgrade attacks and cookie hijacking
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },

          // ----------------
          // Content Security Policy (CSP)
          // ----------------
          // Controls what resources can be loaded/executed
          // Prevents XSS, clickjacking, and other code injection attacks
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'", // Default: only load from same origin
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Scripts: allow inline for Next.js
              "style-src 'self' 'unsafe-inline'", // Styles: allow inline for styled-components
              "img-src 'self' data: https:", // Images: allow data URIs and HTTPS
              "font-src 'self' data:", // Fonts: allow self and data URIs
              "connect-src 'self' https:", // API calls: allow HTTPS
              "frame-ancestors 'none'", // Don't allow embedding in frames
              "base-uri 'self'", // Restrict base tag URLs
              "form-action 'self'", // Form submissions only to same origin
              "upgrade-insecure-requests", // Upgrade HTTP to HTTPS
            ].join('; '),
          },

          // ----------------
          // X-Frame-Options
          // ----------------
          // Prevents clickjacking by disallowing page embedding in frames
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          // ----------------
          // X-Content-Type-Options
          // ----------------
          // Prevents MIME type sniffing
          // Forces browser to respect declared content type
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          // ----------------
          // X-XSS-Protection
          // ----------------
          // Legacy XSS filter (older browsers)
          // Modern browsers use CSP instead
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },

          // ----------------
          // Referrer-Policy
          // ----------------
          // Controls referrer information sent with requests
          // Balances privacy and functionality
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // ----------------
          // Permissions-Policy
          // ----------------
          // Controls browser features and APIs
          // Disables unnecessary features to reduce attack surface
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',           // Disable camera access
              'microphone=()',       // Disable microphone access
              'geolocation=()',      // Disable location access
              'interest-cohort=()',  // Disable FLoC tracking
              'payment=()',          // Disable payment API
              'usb=()',             // Disable USB access
              'magnetometer=()',     // Disable magnetometer
              'gyroscope=()',       // Disable gyroscope
              'accelerometer=()',   // Disable accelerometer
            ].join(', '),
          },

          // ----------------
          // X-DNS-Prefetch-Control
          // ----------------
          // Disable DNS prefetching for privacy
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },

          // ----------------
          // X-Download-Options
          // ----------------
          // Prevents IE from executing downloads in site context
          {
            key: 'X-Download-Options',
            value: 'noopen',
          },

          // ----------------
          // X-Permitted-Cross-Domain-Policies
          // ----------------
          // Restricts Adobe Flash and PDF cross-domain requests
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
        ],
      },

      // ----------------
      // API Routes Security Headers
      // ----------------
      {
        source: '/api/:path*',
        headers: [
          // CORS configuration for API routes
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL || '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
          // Cache control for API responses
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },

      // ----------------
      // Static Assets Caching
      // ----------------
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // ============================================
  // WEBPACK OPTIMIZATIONS
  // ============================================
  // Advanced webpack configuration for production builds
  webpack: (config, { isServer, dev }) => {
    // ----------------
    // Module Concatenation (Scope Hoisting)
    // ----------------
    // Enables faster execution by reducing function call overhead
    if (!dev) {
      config.optimization.concatenateModules = true
    }

    // ----------------
    // Tree Shaking Configuration
    // ----------------
    // Removes unused code from bundles
    config.optimization.usedExports = true
    config.optimization.sideEffects = true

    // Client-side optimizations only
    if (!isServer) {
      // ----------------
      // Advanced Code Splitting Strategy
      // ----------------
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,                    // Minimum size for a chunk (20KB)
        minRemainingSize: 0,               // Minimum size for remaining chunk
        minChunks: 1,                      // Minimum number of chunks that must share a module
        maxAsyncRequests: 30,              // Maximum parallel requests
        maxInitialRequests: 30,            // Maximum initial requests
        enforceSizeThreshold: 50000,       // Size threshold to enforce splitting (50KB)

        cacheGroups: {
          // Core framework bundle (React, Next.js)
          defaultVendors: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            priority: 40,
            reuseExistingChunk: true,
            enforce: true,
          },

          // Recharts bundle (large charting library)
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: 'recharts',
            priority: 30,
            reuseExistingChunk: true,
            enforce: true,
          },

          // Radix UI components bundle
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            priority: 25,
            reuseExistingChunk: true,
          },

          // Date utilities bundle
          dateUtils: {
            test: /[\\/]node_modules[\\/](date-fns|dayjs)[\\/]/,
            name: 'date-utils',
            priority: 20,
            reuseExistingChunk: true,
          },

          // Other vendor dependencies
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },

          // Application UI components
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui-components',
            priority: 5,
            reuseExistingChunk: true,
            minChunks: 2,                    // Split if used in 2+ places
          },

          // Common application code
          common: {
            minChunks: 2,                    // Split if used in 2+ places
            priority: 0,
            reuseExistingChunk: true,
            name: 'common',
          },
        },
      }

      // ----------------
      // Deterministic Module/Chunk IDs
      // ----------------
      // Ensures consistent IDs across builds for better caching
      config.optimization.chunkIds = 'deterministic'
      config.optimization.moduleIds = 'deterministic'

      // ----------------
      // Runtime Chunk Optimization
      // ----------------
      // Separates webpack runtime into its own chunk for better caching
      config.optimization.runtimeChunk = {
        name: 'runtime',
      }

      // ----------------
      // CSS Optimization
      // ----------------
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

      // ----------------
      // Compression (if not handled by CDN/server)
      // ----------------
      if (isProduction && process.env.ENABLE_COMPRESSION === 'true') {
        const CompressionPlugin = require('compression-webpack-plugin')
        config.plugins.push(
          new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,                // Only compress files > 10KB
            minRatio: 0.8,                   // Only compress if 20%+ reduction
          })
        )
      }
    }

    // ----------------
    // Module Resolution Optimization
    // ----------------
    config.resolve.alias = {
      ...config.resolve.alias,
      // Ensure single React instance
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
    }

    // ----------------
    // Build Performance Optimization
    // ----------------
    if (!dev) {
      // Disable source maps in production for smaller bundles
      // (enable if you need them for debugging)
      config.devtool = false

      // Performance hints
      config.performance = {
        hints: isProduction ? 'warning' : false,
        maxAssetSize: 512000,              // 512KB warning for assets
        maxEntrypointSize: 512000,         // 512KB warning for entry points
        assetFilter: (assetFilename) => {
          // Only check JS/CSS files
          return /\.(js|css)$/.test(assetFilename)
        },
      }
    }

    // ----------------
    // Build Cache Configuration
    // ----------------
    if (config.cache && config.cache.type === 'filesystem') {
      config.cache = {
        ...config.cache,
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: '.next/cache/webpack',
        compression: 'gzip',
        hashAlgorithm: 'md4',
        maxAge: 1000 * 60 * 60 * 24 * 7,  // 7 days cache
        name: `${process.env.NODE_ENV}-cache`,
        version: '1.0.0',
      }
    }

    return config
  },
  
  // ============================================
  // ENVIRONMENT VARIABLES
  // ============================================
  env: {
    // Custom environment variables exposed to the client
    CUSTOM_KEY: 'my-value',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },

  // ============================================
  // GENERAL OPTIMIZATIONS
  // ============================================

  // Hide X-Powered-By header for security
  poweredByHeader: false,

  // Enable ETags for efficient caching
  generateEtags: true,

  // Enable gzip compression for faster transfers
  compress: true,

  // Disable trailing slashes in URLs
  trailingSlash: false,

  // ============================================
  // INTERNATIONALIZATION
  // ============================================
  // Note: i18n configuration is not supported in App Router
  // For App Router i18n, use middleware and custom routing
  // See: https://nextjs.org/docs/app/building-your-application/routing/internationalization
  // Future enhancement: Implement App Router i18n with middleware
}

// ============================================
// EXPORT CONFIGURATION
// ============================================
// Conditionally wrap with bundle analyzer for size analysis
// Usage: ANALYZE=true npm run build
export default isAnalyze
  ? withBundleAnalyzer({
      enabled: true,
      openAnalyzer: false,
    })(nextConfig)
  : nextConfig