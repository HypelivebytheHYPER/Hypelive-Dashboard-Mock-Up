# KOL Discovery Dashboard - Architecture Plan

## 🎯 Project Overview

**Goal:** Build a dedicated KOL (Key Opinion Leader) Discovery Dashboard for Hypelive team and clients to easily find and manage TikTok influencers.

**Template Base:** CRM Dashboard (`app/dashboard/crm`)
**Target Location:** `app/dashboard/kol-discovery`
**Database:** Larkbase (Hypelive KOL Management System)
**API Endpoint:** `https://larksuite-hype-server.hypelive.workers.dev`

---

## 📊 Component Mapping: CRM → KOL Dashboard

| CRM Component | KOL Dashboard Component | Data Source | Purpose |
|---------------|-------------------------|-------------|---------|
| `total-customers.tsx` | `total-kols-card.tsx` | Count of all KOLs | Display total KOL count with growth % |
| `total-revenue.tsx` | `total-revenue-card.tsx` | Sum of all KOL revenues | Display total ฿ revenue generated |
| `target-card.tsx` | `avg-engagement-card.tsx` | Avg of engagement rates | Show average engagement rate across KOLs |
| `total-deals.tsx` | `active-collabs-card.tsx` | Count of active campaigns | Number of ongoing collaborations |
| `leads.tsx` (table) | `kols-table.tsx` | KOLs Management table | Main searchable/filterable KOL table |
| `sales-pipeline.tsx` | `collaboration-pipeline.tsx` | Collaboration stages | Funnel: Contacted → Sample → Sales → GMV |
| `leads-by-source.tsx` | `kols-by-location.tsx` | Location distribution | Pie chart of KOLs by location |
| `recent-tasks.tsx` | `recent-campaigns.tsx` | Campaign Management table | Latest campaign activities |

---

## 🗂️ Data Structure & API Integration

### **1. Main KOL Interface**

```typescript
interface KOL {
  // Identity
  record_id: string;
  kol_id: string;              // HYPKOL00120250914
  nickname: string;
  handle: string;
  profile_image_url: string;

  // Metrics (raw)
  follower: number;
  views: number;
  live_gmv: number;
  video_gmv: number;
  live_num: number;
  video_num: number;
  product_count: number;

  // Calculated Fields (formulas from Larkbase)
  engagement_rate: number;     // (Views/Followers)*100
  revenue: number;             // LiveGmv + VideoGmv
  quality_score: number;       // 0.0 - 5.0
  levels_of_kols: "Mega" | "Macro" | "Micro" | "Nano";
  kols_type: string;           // Live Creator/Seller/Creator/No Category

  // Classification
  specialization: string[];    // Multi-select
  categories: string[];        // Multi-select
  products: string[];          // Multi-select
  location: string[];          // Multi-select

  // Social Media
  tiktok_url: string;
  instagram_url?: string;
  youtube_url?: string;
  x_url?: string;
  facebook_url?: string;

  // Contact
  contact_email?: string;
  contact_phone?: string;
  line_id?: string;

  // Business
  collaboration_stage?: string;
  internal_contact?: string;
  mcn_agency?: string;
  avg_monthly_gmv?: string;
  avg_live_gmv?: string;
  live_streaming_or_short_video?: string;

  // Metadata
  creator_debut_time?: string;
  detailed_information?: string;
  bio_th?: string;
  bio_en?: string;
}
```

### **2. Campaign Interface**

```typescript
interface Campaign {
  record_id: string;
  campaign_id: string;         // CAM001yyyyMM
  campaign_name: string;
  campaign_type: string;       // Live Streaming/Short Video/Post/etc.
  start_date: string;
  end_date: string;
  status: string;              // Planning/Proposal Sent/Confirmed/In Progress/Completed/Cancelled
  budget: number;              // THB
  actual_gmv: number;          // THB
  internal_cost: number;       // THB
  roi: number;                 // Formula: (Actual GMV - Budget) / Budget × 100
  profit_margin: number;       // Formula: (Budget - Internal Cost) / Budget × 100
  campaign_manager: string;
  kol: string[];               // Linked KOL record IDs
}
```

### **3. Rate Interface**

```typescript
interface Rate {
  record_id: string;
  rate_id: string;             // RATE001
  kol: string;                 // Linked KOL record ID
  kol_name: string;            // Lookup
  kol_handle: string;          // Lookup
  rate: number;                // THB
  client_rate: number;         // THB
  markup_percent: number;      // Formula: (Client Rate - Rate) / Rate × 100
  profit_amount: number;       // Formula: Client Rate - Rate
  service_type: string;        // Live Streaming/Short Video/Post/etc.
  duration: string;            // 1 Hour/2 Hours/Half Day/Full Day/Per Post/Monthly
  status: string;              // Active/Inactive/Pending
  effective_date: string;
}
```

---

## 🔌 API Service Layer

### **API Endpoints Structure**

```typescript
// lib/api/larkbase.ts

const BASE_URL = "https://larksuite-hype-server.hypelive.workers.dev";
const APP_TOKEN = "H2GQbZBFqaUW2usqPswlczYggWg";

// Table IDs
const TABLES = {
  KOLS: "tbl5864QVOiEokTQ",
  CAMPAIGNS: "tbldcqoLHjrdN1vM",
  RATES: "tblMM5mBcbxzEiJ2",
  KOLS_TECH: "tbl8rJWSTEemTeJh"
};

// Get all KOLs with filters
export async function fetchKOLs(params?: {
  page_size?: number;
  page_token?: string;
  filter?: string;  // Larkbase filter syntax
  sort?: string;
}) {
  const url = `${BASE_URL}/bitable/${APP_TOKEN}/${TABLES.KOLS}/records`;
  // Implementation...
}

// Search KOLs
export async function searchKOLs(params: {
  filter?: string;
  sort?: { field_name: string; desc?: boolean }[];
  page_size?: number;
}) {
  const url = `${BASE_URL}/bitable/${APP_TOKEN}/${TABLES.KOLS}/records/search`;
  // Implementation...
}

// Get single KOL details
export async function fetchKOLById(recordId: string) {
  const url = `${BASE_URL}/bitable/${APP_TOKEN}/${TABLES.KOLS}/records/${recordId}`;
  // Implementation...
}

// Get campaigns for a KOL
export async function fetchKOLCampaigns(kolRecordId: string) {
  const url = `${BASE_URL}/bitable/${APP_TOKEN}/${TABLES.CAMPAIGNS}/records/search`;
  // Filter: KOL field contains kolRecordId
  // Implementation...
}

// Get rates for a KOL
export async function fetchKOLRates(kolRecordId: string) {
  const url = `${BASE_URL}/bitable/${APP_TOKEN}/${TABLES.RATES}/records/search`;
  // Filter: KOL field equals kolRecordId
  // Implementation...
}

// Get all campaigns
export async function fetchCampaigns(params?: {
  page_size?: number;
  page_token?: string;
  filter?: string;
}) {
  const url = `${BASE_URL}/bitable/${APP_TOKEN}/${TABLES.CAMPAIGNS}/records`;
  // Implementation...
}
```

### **Filter Examples**

```typescript
// Filter by follower count (Macro level: 100K-1M)
const filter = {
  conjunction: "and",
  conditions: [
    { field_name: "Follower", operator: "isGreaterEqual", value: ["100000"] },
    { field_name: "Follower", operator: "isLess", value: ["1000000"] }
  ]
};

// Filter by location
const filter = {
  conjunction: "or",
  conditions: [
    { field_name: "Location", operator: "contains", value: ["Bangkok"] },
    { field_name: "Location", operator: "contains", value: ["Chiang Mai"] }
  ]
};

// Filter by specialization
const filter = {
  field_name: "Specialization",
  operator: "contains",
  value: ["Beauty"]
};

// Sort by revenue (descending)
const sort = [{ field_name: "Revenue", desc: true }];

// Sort by engagement rate (descending)
const sort = [{ field_name: "Engagement Rate", desc: true }];
```

---

## 🎨 Component Structure

### **Page Layout: `/app/dashboard/kol-discovery/page.tsx`**

```typescript
export default function KOLDiscoveryPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
          KOL Discovery Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker />
          <Button>Export KOLs</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TotalKOLsCard />
        <TotalRevenueCard />
        <AvgEngagementCard />
        <ActiveCollabsCard />
      </div>

      {/* Charts & Pipeline */}
      <div className="grid gap-4 xl:grid-cols-3">
        <KOLsByLocationCard />
        <RecentCampaignsCard />
        <CollaborationPipelineCard />
      </div>

      {/* Main KOL Table */}
      <KOLsTableCard />
    </div>
  );
}
```

### **Component 1: Total KOLs Card**

**File:** `components/total-kols-card.tsx`

```typescript
"use client";

import { UsersIcon } from "lucide-react";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";
import { useKOLStats } from "@/hooks/use-kol-stats";

export function TotalKOLsCard() {
  const { totalKOLs, growthPercent, isLoading } = useKOLStats();

  return (
    <Card>
      <CardHeader>
        <CardDescription>Total KOLs</CardDescription>
        <div className="flex flex-col gap-2">
          <h4 className="font-display text-2xl lg:text-3xl">
            {isLoading ? "..." : totalKOLs.toLocaleString()}
          </h4>
          <div className="text-muted-foreground text-sm">
            <span className={growthPercent >= 0 ? "text-green-600" : "text-red-600"}>
              {growthPercent >= 0 ? "+" : ""}{growthPercent}%
            </span>{" "}
            from last month
          </div>
        </div>
        <CardAction>
          <div className="flex gap-4">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full border">
              <UsersIcon className="size-5" />
            </div>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
```

### **Component 2: KOLs Table Card**

**File:** `components/kols-table-card.tsx`

Key features:
- TanStack Table with sorting, filtering, pagination
- Column visibility toggle
- Search by nickname/handle
- Advanced filters (followers, location, specialization, quality score)
- Row selection for bulk actions
- Clickable rows to open KOL detail modal

**Columns:**
1. Checkbox (select)
2. Profile Image (with avatar)
3. KOL ID (HYPKOL001...)
4. Nickname + Handle
5. Level (badge: Mega/Macro/Micro/Nano)
6. Followers (formatted number)
7. Engagement Rate (percentage)
8. Revenue (฿ formatted)
9. Quality Score (0.0 - 5.0 with stars)
10. Location (multi-select chips)
11. Specialization (multi-select chips)
12. Collaboration Stage (badge)
13. Internal Contact (avatar)
14. Actions (dropdown: View Details, View Campaigns, View Rates, Copy TikTok URL)

### **Component 3: KOL Detail Modal**

**File:** `components/kol-detail-modal.tsx`

Layout:
```
┌────────────────────────────────────────┐
│  [Profile Image]  Nickname (@handle)  │
│                   KOL ID: HYPKOL001    │
│                   Level: Mega KOL      │
├────────────────────────────────────────┤
│  📊 Metrics                            │
│  Followers: 3.09M | Views: 94.74M     │
│  Engagement: 3,065% | Quality: 4.8/5  │
│  Revenue: ฿20.5M (Live: ฿15M + Vid: ฿5.5M) │
├────────────────────────────────────────┤
│  🎯 Specialization                     │
│  [Beauty] [Fashion] [Lifestyle]       │
├────────────────────────────────────────┤
│  🔗 Social Media                       │
│  TikTok | Instagram | YouTube | X     │
├────────────────────────────────────────┤
│  📞 Contact                            │
│  Email: xxx@example.com               │
│  Phone: +66-XXX-XXX-XXXX              │
│  Line ID: @xxxxx                       │
├────────────────────────────────────────┤
│  💼 Business Info                      │
│  Stage: GMV                           │
│  Contact: Sarah                       │
│  MCN Agency: Yes                      │
│  Avg Monthly GMV: $500k - $1M         │
├────────────────────────────────────────┤
│  📋 Campaigns (3 active)              │
│  [Campaign table/list]                │
├────────────────────────────────────────┤
│  💰 Rates                             │
│  [Rates table by service type]        │
└────────────────────────────────────────┘
```

### **Component 4: Advanced Filters Panel**

**File:** `components/kol-filters.tsx`

Filters:
1. **KOL Level** (checkboxes)
   - [ ] Mega (≥1M)
   - [ ] Macro (100K-1M)
   - [ ] Micro (10K-100K)
   - [ ] Nano (<10K)

2. **Followers Range** (slider)
   - Min: 0
   - Max: 5,000,000

3. **Engagement Rate Range** (slider)
   - Min: 0%
   - Max: 20,000%

4. **Revenue Range** (slider)
   - Min: ฿0
   - Max: ฿25M

5. **Location** (multi-select)
   - Thailand
   - Bangkok
   - Chiang Mai

6. **Specialization** (multi-select)
   - Fashion
   - Beauty
   - Tech
   - Lifestyle
   - Food
   - Travel
   - Fitness
   - Gaming

7. **Collaboration Stage** (select)
   - All
   - Contacted
   - Sample test
   - Sales stage
   - GMV

8. **Internal Contact** (select)
   - All
   - Sarah
   - Felix
   - Benjamin
   - Charles
   - Chris
   - Bruce
   - David
   - Celine
   - Ali

9. **Quality Score Range** (slider)
   - Min: 0.0
   - Max: 5.0

10. **MCN Agency** (radio)
    - All
    - Yes
    - No

---

## 🎨 UI/UX Design Decisions

### **Color Coding**

- **Mega KOL**: Purple badge (#9333EA)
- **Macro KOL**: Blue badge (#2563EB)
- **Micro KOL**: Green badge (#16A34A)
- **Nano KOL**: Gray badge (#6B7280)

### **Collaboration Stage Colors**

- **Contacted**: Gray
- **Sample test**: Yellow
- **Sales stage**: Orange
- **GMV**: Green

### **Typography**

- Numbers: `font-mono` for consistent alignment
- Currency: Thai Baht symbol (฿) with formatted numbers
- Percentages: Always show sign (+/-)

### **Icons**

- Profile: User avatar with fallback initials
- TikTok: Custom TikTok icon
- Social media: Lucide icons (Instagram, Youtube, Twitter, Facebook)
- Metrics: TrendingUp, Users, DollarSign, Zap (engagement)

---

## 📱 Responsive Design

### **Mobile (<768px)**
- Stack stat cards vertically
- Hide less important table columns
- Collapse filters into a slide-over panel
- Show simplified KOL cards instead of table

### **Tablet (768px-1024px)**
- 2-column stat cards
- Show essential table columns only
- Filters in sidebar

### **Desktop (>1024px)**
- 4-column stat cards
- Full table with all columns
- Filters in left sidebar
- Charts in 3-column grid

---

## 🚀 Implementation Phases

### **Phase 1: Foundation (Day 1)**
✅ Database analysis complete
- [x] Understand all tables, fields, formulas
- [x] Document data structure
- [x] Plan component architecture

### **Phase 2: API Layer (Day 2)**
- [ ] Create API service functions
- [ ] Test API endpoints with Postman/curl
- [ ] Implement error handling
- [ ] Add TypeScript interfaces
- [ ] Create custom hooks (useKOLs, useKOLStats, useCampaigns, useRates)

### **Phase 3: Stat Cards (Day 3)**
- [ ] Total KOLs Card
- [ ] Total Revenue Card
- [ ] Avg Engagement Card
- [ ] Active Collaborations Card
- [ ] Real-time data fetching
- [ ] Loading states

### **Phase 4: Main KOL Table (Day 4-5)**
- [ ] Setup TanStack Table
- [ ] Define columns with proper formatting
- [ ] Implement sorting
- [ ] Add search functionality
- [ ] Implement pagination
- [ ] Add column visibility toggle
- [ ] Style table cells (badges, chips, avatars)

### **Phase 5: Filters (Day 6)**
- [ ] Build filter panel UI
- [ ] Implement filter logic
- [ ] Connect filters to API calls
- [ ] Add clear filters button
- [ ] Persist filter state in URL params

### **Phase 6: Charts & Visualizations (Day 7)**
- [ ] KOLs by Location (pie chart)
- [ ] Collaboration Pipeline (funnel/bar chart)
- [ ] Recent Campaigns (list/timeline)
- [ ] Revenue by Specialization (bar chart)

### **Phase 7: KOL Detail Modal (Day 8-9)**
- [ ] Build modal UI
- [ ] Fetch KOL details with related data
- [ ] Display campaigns
- [ ] Display rates
- [ ] Social media links
- [ ] Contact information

### **Phase 8: Polish & Testing (Day 10)**
- [ ] Add loading skeletons
- [ ] Error states
- [ ] Empty states
- [ ] Responsive design tweaks
- [ ] Performance optimization
- [ ] End-to-end testing

---

## 🧪 Testing Strategy

### **Unit Tests**
- API service functions
- Filter logic
- Data transformation utilities
- Number formatting functions

### **Integration Tests**
- Table sorting and filtering
- Pagination
- Search functionality
- Modal interactions

### **E2E Tests**
- Complete user flow: Search → Filter → View Details → View Campaigns
- Data consistency across components
- Real API integration

---

## 🎯 Success Metrics

- **Performance**: Page load < 2s, table interaction < 100ms
- **Data Accuracy**: All formulas match Larkbase calculations
- **UX**: Intuitive filtering, easy navigation, clear data visualization
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Works seamlessly on mobile, tablet, desktop

---

## 🔐 Security & Permissions

- API authentication via headers
- Rate limiting handling
- Error message sanitization
- No sensitive data in client-side logs
- Secure handling of contact information

---

## 📝 Next Steps

1. Get user approval on architecture
2. Start Phase 2: Build API layer
3. Test API endpoints with real data
4. Build components iteratively
5. Deploy to staging for review

---

**Generated:** 2025-10-26
**Status:** Architecture Planning Complete
**Awaiting:** User Approval to Proceed with Implementation
