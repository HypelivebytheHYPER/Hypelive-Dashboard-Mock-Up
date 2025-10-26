# Larkbase Database Deep Dive Analysis
## Hypelive KOL Management System

---

## 🗂️ Database Architecture

### **3 Core Tables + 2 Additional**

```
┌─────────────────────┐
│  KOLs Management    │◄─────┐
│  (tbl5864QVOiEokTQ) │      │
└─────────────────────┘      │
         ▲                   │
         │                   │
         │ Links to          │ Links to
         │                   │
┌─────────────────────┐      │
│ Campaign Management │──────┤
│ (tbldcqoLHjrdN1vM)  │      │
└─────────────────────┘      │
                             │
┌─────────────────────┐      │
│  Rate Management    │──────┘
│  (tblMM5mBcbxzEiJ2) │
└─────────────────────┘

Additional:
- KOLs Management_Tech (tbl8rJWSTEemTeJh) - Tech-focused influencers
- Table (tblCOrc79l38CdgE) - Unknown purpose
```

---

## 📊 Table 1: KOLs Management (Main Database)

**Purpose:** Central repository for TikTok creator/influencer data
**Records:** 100+ creators
**Revisions:** 317 (highly active)

### Field Categories (41 Total Fields)

#### **1. Identity & Profile (6 fields)**
| Field | Type | Format | Description |
|-------|------|--------|-------------|
| KOLs ID | AutoNumber | `HYPKOL001yyyyMMdd` | Primary key |
| Nickname | Text | - | Display name (Thai) |
| Handle | Text | - | TikTok username |
| Bio_TH | Text | - | Thai biography |
| Bio_EN | Text | - | English biography |
| Profile_Image_URL | URL | - | Profile photo link |

#### **2. Audience Metrics (3 fields)**
| Field | Type | Format | Calculation |
|-------|------|--------|-------------|
| Follower | Number | `1,000` | Raw follower count |
| Views | Number | `1,000` | Total video views |
| Engagement Rate | **Formula** | `0.00` | `(Views/Followers)*100` |

**Business Logic:**
- Engagement Rate is the KEY performance indicator
- Higher engagement = better audience interaction
- Typical range: 500-15,000 (5x-150x follower count in views)

#### **3. Revenue & Performance (6 fields)**
| Field | Type | Format | Calculation |
|-------|------|--------|-------------|
| LiveGmv | Number | `฿1,000` | Live stream sales |
| VideoGmv | Number | `฿1,000` | Short video sales |
| Revenue | **Formula** | `฿0.00` | `LiveGmv + VideoGmv` |
| LiveNum | Number | `0` | # of live streams |
| VideoNum | Number | `0` | # of short videos |
| ProductCount | Number | `0.0` | # products promoted |

**Business Logic:**
- Most revenue from VideoGmv (short videos dominate)
- LiveGmv often ฿0 (not all creators do live streams)
- Revenue range: ฿0 - ฿22M+ per creator

#### **4. Classification (3 formula fields)**
| Field | Type | Options | Formula Logic |
|-------|------|---------|---------------|
| Levels of KOLs | **Formula** | Mega/Macro/Micro/Nano | `IF(Follower>=1M, "Mega", IF(Follower>=100K, "Macro", IF(Follower>=10K, "Micro", "Nano")))` |
| KOLs Type | **Formula** | Live Creator/Live Seller/Creator/No Category | Based on LiveNum, VideoNum, GMV ratios |
| Quality Score | **Formula** | `0.0 - 5.0` | Weighted: Engagement Rate + Revenue + Follower count |

**Business Logic:**
- **Mega KOL** (≥1M followers): Top-tier influencers
- **Macro KOL** (100K-1M): Mid-tier influencers
- **Micro KOL** (10K-100K): Niche influencers
- **Nano KOL** (<10K): Emerging creators

#### **5. Content & Specialization (4 multi-select fields)**
| Field | Type | Options |
|-------|------|---------|
| Specialization | MultiSelect | Fashion, Beauty, Tech, Lifestyle, Food, Travel, Fitness, Gaming |
| Categories | MultiSelect | 11 options (Mom & Baby, Cosmetic, Food & Beverage, etc.) |
| Products | MultiSelect | 27+ options (Diapers, Beauty, Skin Care, Electronics, etc.) |
| Location | MultiSelect | Thailand, Bangkok, Chiang Mai |

**Business Logic:**
- Multi-select allows cross-niche creators
- Specialization = broad category
- Categories & Products = specific verticals

#### **6. Social Media Presence (6 fields)**
| Field | Type | Example |
|-------|------|---------|
| TiktokUrl | URL | `https://www.tiktok.com/@username` |
| InstagramUrl | Text | Instagram handle |
| YoutubeUrl | Text | YouTube channel |
| XUrl | Text | X (Twitter) handle |
| FacebookUrl | Text | Facebook page |
| SourceUrl | URL | Data source reference |

**Business Logic:**
- TikTok is PRIMARY platform (always populated)
- Other platforms optional (multi-platform reach)

#### **7. Contact Information (3 fields)**
| Field | Type | Format |
|-------|------|--------|
| Contact_Email | Email | `name@example.com` |
| Contact_Phone | Phone | `+66-XXX-XXX-XXXX` |
| LineId | Text | Line messaging ID |

**Data Status:** Mostly null (contact info collected separately)

#### **8. Business Management (6 fields)**
| Field | Type | Options |
|-------|------|---------|
| Collaboration stage | SingleSelect | Contacted → Sample test → Sales stage → GMV |
| Live streaming or short video | SingleSelect | Live streaming / Short video / Both |
| Avg Monthly GMV | SingleSelect | 15 brackets ($2.5k - $5m+) |
| Avg Live GMV | SingleSelect | 15 brackets (same) |
| Internal Contact | SingleSelect | Sarah, Felix, Benjamin, Charles, Chris, Bruce, David, Celine, Ali |
| MCN Agency | SingleSelect | Yes / No |

**Business Logic:**
- **Collaboration Stage** = Sales pipeline
- Internal Contact = Account manager
- MCN Agency = Represents multiple creators

#### **9. Additional Fields (4 fields)**
| Field | Type | Purpose |
|-------|------|---------|
| CreatorDebutTime | DateTime | When creator started |
| Detailed information | Text | Notes/comments |
| Attachment | Attachment | Documents/media |
| Record ID | Formula | `RECORD_ID()` system ID |

---

## 📊 Table 2: Campaign Management

**Purpose:** Track marketing campaigns with KOLs
**Relationships:** Links to KOLs Management (many-to-many)

### Field Structure (13 fields)

#### **Campaign Info**
- Campaign ID (AutoNumber): `CAM001yyyyMM`
- Campaign Name (Text)
- Campaign Type (SingleSelect): Live Streaming / Short Video / Post / Product Review / Brand Ambassador

#### **Timeline**
- Start Date / End Date (DateTime)
- Status: Planning → Proposal Sent → Confirmed → In Progress → Completed/Cancelled

#### **Financial Tracking**
- Budget (Currency THB)
- Actual GMV (Currency THB)
- Internal Cost (Currency THB)
- **ROI (Formula)**: `(Actual GMV - Budget) / Budget × 100`
- **Profit Margin (Formula)**: `(Budget - Internal Cost) / Budget × 100`

#### **Relationships**
- Campaign Manager (SingleSelect): Same team list as KOLs table
- **KOL (Link)**: Multiple KOLs per campaign

**Business Logic:**
```
Campaign → assigns multiple KOLs → generates GMV → calculates ROI
```

---

## 📊 Table 3: Rate Management

**Purpose:** KOL pricing and profit margins
**Relationships:** Links to KOLs Management (one-to-many)

### Field Structure (12 fields)

#### **Pricing**
- Rate (THB): Base KOL rate
- Client Rate (THB): Amount charged to client
- **Markup % (Formula)**: `(Client Rate - Rate) / Rate × 100`
- **Profit Amount (Formula)**: `Client Rate - Rate`

#### **Service Configuration**
- Service Type: Live Streaming / Short Video / Post / Story / Product Review / Brand Ambassador
- Duration: 1 Hour / 2 Hours / Half Day / Full Day / Per Post / Monthly
- Status: Active / Inactive / Pending
- Effective Date (DateTime)

#### **Reference**
- Rate ID (AutoNumber): `RATE001`
- KOL (Link)
- KOL Name / KOL Handle (Lookup from KOLs table)

**Business Logic:**
```
KOL has multiple rates → Different service types → Different durations → Calculate markup
```

---

## 🎯 Data Patterns & Insights

### **Key Formulas Explained**

1. **Engagement Rate = (Views / Followers) × 100**
   - Measures content virality
   - Higher = better content reach
   - Example: 500K followers, 50M views = 10,000% engagement

2. **Revenue = LiveGmv + VideoGmv**
   - Total sales generated
   - Currency: Thai Baht (฿)
   - Range: ฿0 - ฿22M+

3. **Quality Score = Weighted Algorithm**
   - Factors: Engagement Rate, Revenue, Followers
   - Scale: 0.0 - 5.0
   - Used for KOL ranking

4. **KOL Levels (Tiered)**
   ```
   Mega:  ≥1,000,000 followers (Top tier)
   Macro: ≥100,000 followers (Mid tier)
   Micro: ≥10,000 followers (Niche)
   Nano:  <10,000 followers (Emerging)
   ```

### **Revenue Distribution**
- **VideoGmv**: Primary revenue source (most creators)
- **LiveGmv**: Secondary (requires live streaming capability)
- Average revenue: ฿5M - ฿20M for top performers

### **Collaboration Pipeline**
```
1. Contacted → Initial outreach
2. Sample test → Trial collaboration
3. Sales stage → Negotiating rates
4. GMV → Active revenue generation
```

### **Data Quality Notes**
- ✅ **Well populated**: Follower, Views, Revenue, URLs
- ⚠️ **Partially populated**: Contact info, Bio translations
- ❌ **Mostly empty**: Attachments, Detailed information

---

## 🏗️ Dashboard Requirements

### **Must-Have Features**

1. **KOL Discovery & Filtering**
   - Filter by: Followers, Engagement Rate, Location, Specialization
   - Sort by: Revenue, Quality Score, Engagement Rate
   - Search: Nickname, Handle

2. **Performance Analytics**
   - Total KOLs count
   - Total Revenue sum
   - Average Engagement Rate
   - KOL distribution by level

3. **KOL Detail View**
   - Profile card with image
   - Social media links (clickable)
   - Performance metrics chart
   - Contact information
   - Collaboration history (from Campaigns)

4. **Campaign Management**
   - Link KOLs to campaigns
   - Track ROI and profit margins
   - Campaign timeline view

5. **Rate Calculator**
   - View KOL rates by service type
   - Calculate markup and profit
   - Compare rates across KOLs

---

## 🔌 API Integration Plan

### **Endpoints to Use**

```javascript
// Get all KOLs with filters
GET /bitable/H2GQbZBFqaUW2usqPswlczYggWg/tbl5864QVOiEokTQ/records
  ?page_size=50
  &filter={"Follower":{"gt":100000}}
  &sort={"Revenue":"desc"}

// Get single KOL details
GET /bitable/.../tbl5864QVOiEokTQ/records/{record_id}

// Get campaigns for a KOL
GET /bitable/.../tbldcqoLHjrdN1vM/records
  ?filter={"KOL":{"contains":"record_id"}}

// Get rates for a KOL
GET /bitable/.../tblMM5mBcbxzEiJ2/records
  ?filter={"KOL":"record_id"}
```

### **Data Transformation**

```typescript
interface KOL {
  id: string;
  kolId: string;           // HYPKOL00120250914
  nickname: string;
  handle: string;
  follower: number;
  views: number;
  engagementRate: number;  // Formula calculated
  revenue: number;         // Formula: LiveGmv + VideoGmv
  liveGmv: number;
  videoGmv: number;
  qualityScore: number;    // Formula
  level: "Mega" | "Macro" | "Micro" | "Nano";  // Formula
  type: string;            // Formula
  specialization: string[];
  location: string[];
  tiktokUrl: string;
  profileImageUrl: string;
  collaborationStage: string;
  internalContact: string;
}
```

---

## 🎨 Recommended Dashboard Structure

### **Layout: CRM Template Adaptation**

```
┌─────────────────────────────────────────────────────┐
│  KOL Discovery Dashboard                    [Date]  │
├──────────┬──────────┬──────────┬─────────────────────┤
│ Total    │ Total    │ Avg Eng  │ Active Collabs      │
│ KOLs     │ Revenue  │ Rate     │                     │
│ 100+     │ ฿500M    │ 8,500%   │ 25                  │
├──────────┴──────────┴──────────┴─────────────────────┤
│                                                       │
│  [Filters]                    [Search]               │
│  □ Mega (≥1M)                 🔍 Search by name...  │
│  □ Macro (100K-1M)                                   │
│  □ Micro (10K-100K)           [Add KOL] [Export]     │
│                                                       │
├───────────────────────────────────────────────────────┤
│  KOL Table                                            │
│  ┌──────┬────────┬──────────┬──────────┬──────┬────┐ │
│  │ ✓    │ Profile│ Name     │ Followers│ Rev  │ ...│ │
│  ├──────┼────────┼──────────┼──────────┼──────┼────┤ │
│  │ □    │ [IMG]  │ มินมิน   │ 506K     │ ฿22M │ ...│ │
│  │ □    │ [IMG]  │ Win Win  │ 3.09M    │ ฿20M │ ...│ │
│  └──────┴────────┴──────────┴──────────┴──────┴────┘ │
│                                    [1][2][3]...[10]   │
└───────────────────────────────────────────────────────┘
```

### **Component Mapping**

| CRM Component | KOL Dashboard Component |
|---------------|-------------------------|
| `total-customers.tsx` | Total KOLs Card |
| `total-revenue.tsx` | Total Revenue Card |
| `target-card.tsx` | Avg Engagement Rate Card |
| `total-deals.tsx` | Active Collaborations Card |
| `leads.tsx` (table) | KOL Table with filters |
| `sales-pipeline.tsx` | Collaboration Pipeline |

---

## ✅ Next Steps

1. ✅ Database analysis complete
2. 🔄 Design dashboard mockup
3. ⏳ Build components with real data
4. ⏳ Integrate Larkbase API
5. ⏳ Test and deploy

---

**Generated:** 2025-10-26
**Database:** Hypelive KOL Management System
**Tables Analyzed:** 3/5 (KOLs, Campaigns, Rates)
