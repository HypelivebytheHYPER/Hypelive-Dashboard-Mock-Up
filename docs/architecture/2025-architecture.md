# 🏗️ Hypelive Dashboard - 2025 Modern Architecture

## 🎯 Executive Summary

This document outlines the comprehensive architecture for Hypelive Dashboard using 2025 best practices, featuring React Server Components, edge-native deployment, and enterprise-grade scalability patterns.

## 📁 Modern Project Structure

```
hypelive-dashboard/
├── app/                          # Next.js 16 App Router
│   ├── (auth)/                  # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/             # Dashboard routes
│   │   ├── kol-discovery/       # Main KOL management
│   │   ├── analytics/          # Analytics dashboard
│   │   ├── campaigns/          # Campaign management
│   │   └── settings/           # User settings
│   ├── api/                    # API routes
│   │   ├── v1/                 # Versioned API
│   │   ├── webhooks/           # Webhook handlers
│   │   └── health/             # Health checks
│   ├── layout.tsx              # Root layout
│   ├── loading.tsx             # Global loading
│   └── error.tsx               # Global error boundary
│
├── components/                  # React Components
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── shared/                 # Shared business components
│   │   ├── header/
│   │   ├── sidebar/
│   │   ├── filters/
│   │   └── charts/
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── kol-discovery/
│   │   │   ├── stats-cards/
│   │   │   ├── kol-table/
│   │   │   ├── filters/
│   │   │   └── charts/
│   │   ├── analytics/
│   │   └── campaigns/
│   └── forms/                  # Form components
│       ├── kol-form/
│       ├── campaign-form/
│       └── user-form/
│
├── lib/                        # Core Library Code
│   ├── api/                    # API layer
│   │   ├── client/            # API client configuration
│   │   ├── services/          # Business services
│   │   ├── repositories/      # Data repositories
│   │   └── types/             # API types
│   ├── core/                   # Core utilities
│   │   ├── config/            # Configuration
│   │   ├── constants/         # Constants
│   │   ├── errors/            # Error handling
│   │   └── utils/             # Utility functions
│   ├── hooks/                  # React hooks
│   │   ├── use-auth.ts
│   │   ├── use-kols.ts
│   │   ├── use-campaigns.ts
│   │   └── use-analytics.ts
│   ├── stores/                 # State management
│   │   ├── auth-store.ts
│   │   ├── kol-store.ts
│   │   └── ui-store.ts
│   └── types/                  # Global TypeScript types
│       ├── kol.ts
│       ├── campaign.ts
│       └── api.ts
│
├── data/                       # Data layer
│   ├── mappers/               # Data transformation
│   ├── validators/            # Data validation
│   └── seeders/               # Database seeders
│
├── middleware.ts              # Next.js middleware
├── middleware/                # Custom middleware
│   ├── auth.ts               # Authentication
│   ├── rate-limit.ts         # Rate limiting
│   └── security.ts           # Security headers
│
├── public/                    # Static assets
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── scripts/                   # Build and utility scripts
│   ├── build/
│   ├── deploy/
│   └── migrate/
│
├── tests/                     # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docker/                    # Docker configuration
    ├── development/
    ├── staging/
    └── production/
```

## 🔄 Data Layer Architecture

### Repository Pattern Implementation

```typescript
// lib/api/repositories/kol-repository.ts
export interface KOLRepository {
  findAll(options: KOLQueryOptions): Promise<PaginatedResult<KOL>>;
  findById(id: string): Promise<KOL | null>;
  findByPlatform(platform: string): Promise<KOL[]>;
  create(data: CreateKOLDto): Promise<KOL>;
  update(id: string, data: UpdateKOLDto): Promise<KOL>;
  delete(id: string): Promise<void>;
  getStats(): Promise<KOLStats>;
}

export class KOLRepositoryImpl implements KOLRepository {
  constructor(
    private apiClient: ApiClient,
    private cache: CacheService,
    private mapper: KOLDataMapper
  ) {}

  async findAll(options: KOLQueryOptions): Promise<PaginatedResult<KOL>> {
    const cacheKey = `kols:${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = await this.cache.get<PaginatedResult<KOL>>(cacheKey);
    if (cached) return cached;

    // Fetch from API
    const response = await this.apiClient.get('/kols', { params: options });
    const data = this.mapper.toDomainList(response.data);
    
    // Cache for 5 minutes
    await this.cache.set(cacheKey, data, { ttl: 300 });
    
    return data;
  }

  async findById(id: string): Promise<KOL | null> {
    const cacheKey = `kol:${id}`;
    
    const cached = await this.cache.get<KOL>(cacheKey);
    if (cached) return cached;

    const response = await this.apiClient.get(`/kols/${id}`);
    const data = this.mapper.toDomain(response.data);
    
    await this.cache.set(cacheKey, data, { ttl: 600 });
    
    return data;
  }
}
```

### Data Mapper Pattern

```typescript
// data/mappers/kol-mapper.ts
export class KOLDataMapper {
  toDomain(apiData: ApiKOL): KOL {
    return {
      id: apiData.record_id,
      kolId: apiData.kol_id,
      nickname: apiData.nickname,
      handle: apiData.handle,
      profileImageUrl: apiData.profile_image_url,
      followers: apiData.follower,
      views: apiData.views,
      revenue: apiData.live_gmv + apiData.video_gmv,
      engagementRate: this.calculateEngagementRate(apiData.views, apiData.follower),
      qualityScore: apiData.quality_score,
      level: this.mapLevel(apiData.follower),
      specializations: apiData.specialization || [],
      locations: apiData.location || [],
      collaborationStage: apiData.collaboration_stage,
      socialMedia: {
        tiktok: apiData.tiktok_url,
        instagram: apiData.instagram_url,
        youtube: apiData.youtube_url,
        facebook: apiData.facebook_url
      },
      contact: {
        email: apiData.contact_email,
        phone: apiData.contact_phone,
        lineId: apiData.line_id
      },
      businessInfo: {
        mcnAgency: apiData.mcn_agency,
        avgMonthlyGMV: apiData.avg_monthly_gmv,
        internalContact: apiData.internal_contact
      },
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at
    };
  }

  toDomainList(apiData: ApiKOL[]): KOL[] {
    return apiData.map(item => this.toDomain(item));
  }

  private calculateEngagementRate(views: number, followers: number): number {
    return followers > 0 ? (views / followers) * 100 : 0;
  }

  private mapLevel(followers: number): KOLLevel {
    if (followers >= 1000000) return 'mega';
    if (followers >= 100000) return 'macro';
    if (followers >= 10000) return 'micro';
    return 'nano';
  }
}
```

## ⚛️ Component Architecture

### Server Component Pattern

```tsx
// app/dashboard/kol-discovery/page.tsx
import { Suspense } from 'react';
import { KOLDiscoveryClient } from '@/components/dashboard/kol-discovery/kol-discovery-client';
import { KOLStatsServer } from '@/components/dashboard/kol-discovery/stats-cards-server';
import { KOLTableServer } from '@/components/dashboard/kol-discovery/kol-table-server';

export const dynamic = 'force-dynamic';

export default function KOLDiscoveryPage() {
  return (
    <KOLDiscoveryClient>
      <div className="space-y-6">
        {/* Streaming stats cards */}
        <Suspense fallback={<StatsCardsSkeleton />}>
          <KOLStatsServer />
        </Suspense>

        {/* Streaming KOL table */}
        <Suspense fallback={<KOLTableSkeleton />}>
          <KOLTableServer />
        </Suspense>
      </div>
    </KOLDiscoveryClient>
  );
}
```

### Composite Component Pattern

```tsx
// components/dashboard/kol-discovery/kol-table-card.tsx
export function KOLsTableCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>KOL Management</CardTitle>
          <div className="flex items-center gap-2">
            <SearchInput />
            <FilterToggle />
            <ExportButton />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <KOLTable />
        <KPagination />
      </CardContent>
    </Card>
  );
}
```

## 🔌 API Integration Patterns

### Type-Safe API Client

```typescript
// lib/api/client/api-client.ts
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders
    };
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  async post<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, { ...options, body: JSON.stringify(data) });
  }

  private async request<T>(method: string, path: string, options?: RequestOptions): Promise<T> {
    const url = `${this.baseURL}${path}`;
    const headers = { ...this.defaultHeaders, ...options?.headers };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options?.body,
        signal: options?.signal
      });

      if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
      }

      const data = await response.json();
      
      // Validate response with Zod
      if (options?.schema) {
        return options.schema.parse(data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error');
    }
  }
}
```

### Service Layer Pattern

```typescript
// lib/api/services/kol-service.ts
export class KOLService {
  constructor(
    private kolRepository: KOLRepository,
    private analyticsService: AnalyticsService
  ) {}

  async getKOLsWithAnalytics(options: KOLQueryOptions): Promise<KOLWithAnalytics[]> {
    const kols = await this.kolRepository.findAll(options);
    
    // Enrich with analytics data
    const analyticsPromises = kols.items.map(kol => 
      this.analyticsService.getKOLAnalytics(kol.id)
    );
    
    const analytics = await Promise.allSettled(analyticsPromises);
    
    return kols.items.map((kol, index) => ({
      ...kol,
      analytics: analytics[index].status === 'fulfilled' 
        ? analytics[index].value 
        : null
    }));
  }

  async searchKOLs(query: string, filters: KOLFilters): Promise<KOL[]> {
    // Implement fuzzy search
    const searchResults = await this.kolRepository.search(query);
    
    // Apply additional filters
    return this.applyFilters(searchResults, filters);
  }

  private applyFilters(kols: KOL[], filters: KOLFilters): KOL[] {
    return kols.filter(kol => {
      if (filters.level && kol.level !== filters.level) return false;
      if (filters.minFollowers && kol.followers < filters.minFollowers) return false;
      if (filters.location && !kol.locations.includes(filters.location)) return false;
      if (filters.specialization && !kol.specializations.includes(filters.specialization)) return false;
      return true;
    });
  }
}
```

## 🏪 State Management Architecture

### Zustand Store Pattern

```typescript
// lib/stores/kol-store.ts
interface KOLStore {
  // State
  kols: KOL[];
  selectedKOLs: string[];
  filters: KOLFilters;
  sortBy: SortOption;
  viewMode: 'table' | 'grid';
  
  // Actions
  setKOLs: (kols: KOL[]) => void;
  toggleKOLSelection: (id: string) => void;
  setFilters: (filters: KOLFilters) => void;
  setSortBy: (sortBy: SortOption) => void;
  setViewMode: (mode: 'table' | 'grid') => void;
  
  // Selectors
  filteredKOLs: () => KOL[];
  selectedKOLCount: () => number;
}

export const useKOLStore = create<KOLStore>()(
  persist(
    (set, get) => ({
      kols: [],
      selectedKOLs: [],
      filters: {},
      sortBy: 'name',
      viewMode: 'table',

      setKOLs: (kols) => set({ kols }),
      
      toggleKOLSelection: (id) => set((state) => ({
        selectedKOLs: state.selectedKOLs.includes(id)
          ? state.selectedKOLs.filter(kolId => kolId !== id)
          : [...state.selectedKOLs, id]
      })),

      setFilters: (filters) => set({ filters }),
      setSortBy: (sortBy) => set({ sortBy }),
      setViewMode: (viewMode) => set({ viewMode }),

      filteredKOLs: () => {
        const { kols, filters } = get();
        return kols.filter(kol => {
          // Apply filters logic
          return true;
        });
      },

      selectedKOLCount: () => get().selectedKOLs.length
    }),
    {
      name: 'kol-store',
      partialize: (state) => ({
        filters: state.filters,
        sortBy: state.sortBy,
        viewMode: state.viewMode
      })
    }
  )
);
```

## ⚡ Performance Optimization

### React Server Components Strategy

```tsx
// components/dashboard/kol-discovery/stats-cards-server.tsx
export async function KOLStatsServer() {
  // This runs on the server
  const stats = await getKOLStats();
  
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <TotalKOLsCard stats={stats} />
      <TotalRevenueCard stats={stats} />
      <AvgEngagementCard stats={stats} />
      <ActiveCollabsCard stats={stats} />
    </div>
  );
}

// components/dashboard/kol-discovery/total-kols-card.tsx
"use client";

export function TotalKOLsCard({ stats }: { stats: KOLStats }) {
  // This runs on the client only for interactivity
  return (
    <Card>
      <CardHeader>
        <CardDescription>Total KOLs</CardDescription>
        <CardTitle className="text-2xl">
          {stats.totalKOLs.toLocaleString()}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <span className={stats.growthPercent >= 0 ? "text-green-600" : "text-red-600"}>
            {stats.growthPercent >= 0 ? "+" : ""}{stats.growthPercent}%
          </span>
          {" "}from last month
        </div>
      </CardHeader>
    </Card>
  );
}
```

### Intelligent Caching Strategy

```typescript
// lib/core/cache/cache-strategy.ts
export class CacheStrategy {
  constructor(
    private redis: RedisClient,
    private cacheConfig: CacheConfig
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const ttl = options?.ttl || this.cacheConfig.defaultTTL;
      
      if (ttl > 0) {
        await this.redis.setex(key, ttl, serialized);
      } else {
        await this.redis.set(key, serialized);
      }

      // Add to tag index for invalidation
      if (options?.tags) {
        await this.addToTagIndex(key, options.tags);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async invalidateByTags(tags: string[]): Promise<void> {
    try {
      for (const tag of tags) {
        const keys = await this.redis.smembers(`tag:${tag}`);
        if (keys.length > 0) {
          await this.redis.del(...keys);
          await this.redis.srem(`tag:${tag}`, ...keys);
        }
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  private async addToTagIndex(key: string, tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.redis.sadd(`tag:${tag}`, key);
    }
  }
}

// Cache configuration
export const cacheConfig = {
  defaultTTL: 300, // 5 minutes
  kols: {
    list: 300,     // 5 minutes
    detail: 600,   // 10 minutes
    stats: 60      // 1 minute
  },
  campaigns: {
    list: 180,     // 3 minutes
    detail: 300    // 5 minutes
  },
  analytics: {
    overview: 120, // 2 minutes
    realTime: 30   // 30 seconds
  }
};
```

## 🔒 Security Architecture

### Authentication & Authorization

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/core/auth/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  // Public routes
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = await verifyToken(token);
    
    // Add user info to headers for server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Input Validation & Sanitization

```typescript
// lib/core/security/validation.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// KOL validation schema
export const createKOLSchema = z.object({
  nickname: z.string().min(1).max(100).trim(),
  handle: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_.]+$/),
  followers: z.number().int().min(0).max(100000000),
  specializations: z.array(z.string()).max(10),
  locations: z.array(z.string()).max(5),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().regex(/^\+?[0-9]{10,15}$/).optional(),
  socialMedia: z.object({
    tiktok: z.string().url().optional(),
    instagram: z.string().url().optional(),
    youtube: z.string().url().optional(),
    facebook: z.string().url().optional()
  })
});

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

export function validateKOLData(data: unknown) {
  // Sanitize string inputs
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    
    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value);
      }
    }
    
    return createKOLSchema.parse(sanitized);
  }
  
  return createKOLSchema.parse(data);
}
```

## 🧪 Testing Strategy

### Unit Testing Pattern

```typescript
// tests/unit/api/kol-service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { KOLService } from '@/lib/api/services/kol-service';
import { mockKOLs, mockAnalytics } from '@/tests/fixtures/kol-data';

describe('KOLService', () => {
  const mockKOLRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    search: vi.fn()
  };

  const mockAnalyticsService = {
    getKOLAnalytics: vi.fn()
  };

  const kolService = new KOLService(
    mockKOLRepository as any,
    mockAnalyticsService as any
  );

  describe('getKOLsWithAnalytics', () => {
    it('should return KOLs with analytics data', async () => {
      mockKOLRepository.findAll.mockResolvedValue({
        items: mockKOLs,
        total: mockKOLs.length,
        hasMore: false
      });

      mockAnalyticsService.getKOLAnalytics.mockResolvedValue(mockAnalytics);

      const result = await kolService.getKOLsWithAnalytics({});

      expect(result).toHaveLength(mockKOLs.length);
      expect(result[0]).toHaveProperty('analytics');
      expect(result[0].analytics).toEqual(mockAnalytics);
    });

    it('should handle analytics fetch failures gracefully', async () => {
      mockKOLRepository.findAll.mockResolvedValue({
        items: mockKOLs,
        total: mockKOLs.length,
        hasMore: false
      });

      mockAnalyticsService.getKOLAnalytics.mockRejectedValue(new Error('API Error'));

      const result = await kolService.getKOLsWithAnalytics({});

      expect(result).toHaveLength(mockKOLs.length);
      expect(result[0]).toHaveProperty('analytics');
      expect(result[0].analytics).toBeNull();
    });
  });
});
```

### Integration Testing

```typescript
// tests/integration/api/kols.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTestServer } from '@/tests/utils/test-server';

describe('KOL API Integration', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = await createTestServer();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /api/v1/kols', () => {
    it('should return paginated KOL list', async () => {
      const response = await server.get('/api/v1/kols?page=1&limit=10');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          items: expect.any(Array),
          total: expect.any(Number),
          hasMore: expect.any(Boolean)
        }
      });
    });

    it('should filter KOLs by level', async () => {
      const response = await server.get('/api/v1/kols?level=mega');
      
      expect(response.status).toBe(200);
      expect(response.body.data.items).toSatisfy((items: KOL[]) => 
        items.every(kol => kol.level === 'mega')
      );
    });
  });
});
```

## 🚀 Deployment Architecture

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hypelive-dashboard
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hypelive-dashboard
  template:
    metadata:
      labels:
        app: hypelive-dashboard
    spec:
      containers:
      - name: dashboard
        image: hypelive/dashboard:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_API_URL
          valueFrom:
            secretKeyRef:
              name: dashboard-secrets
              key: api-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: dashboard-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: hypelive-dashboard-service
  namespace: production
spec:
  selector:
    app: hypelive-dashboard
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Run Lighthouse CI
      run: npm run lighthouse:ci

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Kubernetes
      uses: azure/k8s-deploy@v4
      with:
        manifests: |
          k8s/deployment.yaml
          k8s/service.yaml
        images: |
          ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        kubectl-version: 'latest'
```

## 📊 Monitoring & Observability

### Comprehensive Logging

```typescript
// lib/core/observability/logger.ts
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: {
    service: 'hypelive-dashboard',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION
  },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

export default logger;
```

### Metrics Collection

```typescript
// lib/core/observability/metrics.ts
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

export const register = new Registry();

// HTTP Request metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Business metrics
export const kolViewsTotal = new Counter({
  name: 'kol_views_total',
  help: 'Total number of KOL profile views',
  labelNames: ['kol_id', 'user_id']
});

export const activeUsersGauge = new Gauge({
  name: 'active_users_total',
  help: 'Number of active users in the last 5 minutes'
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(kolViewsTotal);
register.registerMetric(activeUsersGauge);
```

## 🎯 2025 Best Practices Summary

### ✅ Modern React Patterns
- **Server Components First**: Minimize client-side JavaScript
- **Streaming SSR**: Progressive page loading
- **Suspense Boundaries**: Graceful loading states
- **Error Boundaries**: Robust error handling

### ✅ Performance Optimization
- **Edge Runtime**: Deploy close to users
- **Intelligent Caching**: Multi-layer caching strategy
- **Bundle Splitting**: Optimal code loading
- **Image Optimization**: Next.js Image component

### ✅ Type Safety
- **Strict TypeScript**: No unchecked indexed access
- **Zod Validation**: Runtime type validation
- **Generic Utilities**: Flexible type transformations
- **API Type Safety**: End-to-end type coverage

### ✅ Security
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Input Validation**: XSS prevention
- **PDPA Compliance**: Thailand data protection

### ✅ Monitoring
- **Structured Logging**: Winston with JSON
- **Metrics Collection**: Prometheus integration
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Real User Monitoring

This architecture provides a solid foundation for building a production-ready, scalable, and maintainable KOL management platform that can handle millions of users while providing excellent performance and user experience.