# Exact Larkbase Field Mapping & Data Format Reference

**Last Updated:** 2025-10-26
**Database:** Hypelive KOL Management System
**Total KOLs:** 1,960 records

---

## 🎯 CRITICAL: Exact Field Names from Database

**IMPORTANT:** Always use these EXACT field names when accessing Larkbase API. Field names are case-sensitive and must match precisely.

---

## 📊 Table 1: KOLs Management (tbl5864QVOiEokTQ)

### **Complete Field Reference (41 Fields)**

| # | Exact Field Name | Field ID | Type | UI Type | Format/Options | Example Value |
|---|------------------|----------|------|---------|----------------|---------------|
| 1 | `KOLs ID` | `fldvb0GkLQ` | 1005 | AutoNumber | `HYPKOL{3}{yyyyMMdd}` | `"HYPKOL00120250914"` |
| 2 | `Nickname` | `fldbw116up` | 1 | Text | - | `"มินมิน ช็อป88 (ช่องหลัก)"` |
| 3 | `Handle` | `fldvD3Prg4` | 1 | Text | - | `"mintrako8764"` |
| 4 | `Follower` | `fldoyR05M5` | 2 | Number | Formatted: `"1,000"` | `"506350"` (string!) |
| 5 | `Views` | `fldc0g9U0y` | 2 | Number | - | `54990000` (number) |
| 6 | `Engagement Rate` | `fldcMDcosn` | 20 | Formula | `(Views/Follower)*100` | `10860.08` (number) |
| 7 | `LiveGmv` | `fld8bNv0ne` | 2 | Number | - | `"0"` (string!) |
| 8 | `VideoGmv` | `fldQJNUHxc` | 2 | Number | - | `"22770000"` (string!) |
| 9 | `Revenue` | `fld6nQts0P` | 20 | Formula | `LiveGmv + VideoGmv` (THB) | `22770000` (number) |
| 10 | `LiveNum` | `fldsFOcrFz` | 2 | Number | - | `"39"` (string!) |
| 11 | `VideoNum` | `fldL3BVWjX` | 2 | Number | - | `"181"` (string!) |
| 12 | `ProductCount` | `fldO5cb37o` | 2 | Number | - | `"114"` (string!) |
| 13 | `Levels of KOLs` | `fldb49WE0v` | 20 | Formula | Array of option IDs | `["optHMhw7yb"]` |
| 14 | `KOLs Type` | `fldlpjHxgq` | 20 | Formula | Array of option IDs | `["optepVUy1S"]` |
| 15 | `Quality Score` | `fldDOuSNFi` | 20 | Formula | 0.0 - 5.0 | `3` (number) |
| 16 | `Specialization` | `fldI2SxB9M` | 4 | MultiSelect | See options below | `null` or `["optnRcHzto", "optSPQmyzw"]` |
| 17 | `Categories` | `fldEyygahd` | 4 | MultiSelect | See options below | `null` |
| 18 | `Products` | `fld8mPNRia` | 4 | MultiSelect | See options below | `null` |
| 19 | `Location` | `fldn3ObNH5` | 4 | MultiSelect | See options below | `["Bangkok", "Thailand"]` |
| 20 | `TiktokUrl` | `fldwUzQESb` | 15 | Url | `{link, text}` object | `{"link": "https://...", "text": "https://..."}` |
| 21 | `InstagramUrl` | `fldGpbTVdB` | 1 | Text | - | `"\\"` or `null` |
| 22 | `YoutubeUrl` | `fldD4Lpu2C` | 1 | Text | - | `null` |
| 23 | `XUrl` | `fldxcfD2Cd` | 1 | Text | - | `null` |
| 24 | `FacebookUrl` | `fldtghNFjh` | 1 | Text | - | `null` |
| 25 | `SourceUrl` | `fldr5AU8ZL` | 15 | Url | `{link, text}` object | `{"link": "https://...", "text": "https://..."}` |
| 26 | `Contact_Email` | `fldfzCGhOc` | 1 | Email | - | `null` |
| 27 | `Contact_Phone` | `fld977i85B` | 13 | Phone | - | `null` |
| 28 | `LineId` | `fldAOWIGyK` | 1 | Text | - | `"\\"` or `null` |
| 29 | `Collaboration stage` | `fldy8yCwUh` | 3 | SingleSelect | See options below | `"Contacted"` |
| 30 | `Live streaming or short video` | `fldd2Lav43` | 3 | SingleSelect | See options below | `"Short video"` |
| 31 | `Avg Monthly GMV` | `fldqTOCHBj` | 3 | SingleSelect | See options below | `null` |
| 32 | `Avg Live GMV` | `fldRGW5aJA` | 3 | SingleSelect | See options below | `null` |
| 33 | `Internal Contact` | `fldGb6rfOJ` | 3 | SingleSelect | See options below | `null` |
| 34 | `MCN Agency` | `fld6LbdmPR` | 3 | SingleSelect | `"No"`, `"Y"` | `null` |
| 35 | `Bio_TH` | `fldZkNJIGX` | 1 | Text | - | `"\\"` or `null` |
| 36 | `Bio_EN` | `fldjHsTMah` | 1 | Text | - | `null` |
| 37 | `Profile_Image_URL` | `fldfg71upG` | 15 | Url | - | `null` |
| 38 | `CreatorDebutTime` | `fldteLNZr1` | 5 | DateTime | Unix timestamp (ms) | `1517850000000` |
| 39 | `Detailed information` | `fldPysFn0z` | 1 | Text | - | `null` |
| 40 | `Attachment` | `fldgNktI8K` | 17 | Attachment | - | `null` |
| 41 | `Record ID` | `flda440kK7` | 20 | Formula | `RECORD_ID()` | `[{"text": "recJUbNGjn", "type": "text"}]` |

---

## 🔍 Field Options & Enums

### **Location Options** (Multi-Select)
```typescript
type LocationOption =
  | "Thailand"    // optuk8ODCp
  | "Bangkok"     // optVIEb3En
  | "Chiang Mai"; // opt7vVHchq
```

### **Specialization Options** (Multi-Select)
```typescript
type SpecializationOption =
  | "Fashion"   // optnRcHzto
  | "Beauty"    // optSPQmyzw
  | "Tech"      // optElBjAHR
  | "Lifestyle" // optm5rFqme
  | "Food"      // optPLWbIxC
  | "Travel"    // opt31cpll3
  | "Fitness"   // optewwmaRx
  | "Gaming";   // optGXmSCEP
```

### **Categories Options** (Multi-Select)
```typescript
type CategoryOption =
  | "Mom & Baby"              // optSlNiM56
  | "Computer & Accessories"  // optmZeyAwR
  | "Cosmetic"                // opt6PO1HqT
  | "Beauty & Care"           // optYsOFrDN
  | "Food & Beverage"         // optJHg9i6y
  | "Health"                  // optppxFeas
  | "Men Clothes"             // optv9McODo
  | "Fresh"                   // opt3yzCpZW
  | "Baby & Kids Fashion"     // optPos0VOv
  | "Women Clothes"           // optKnWTePK
  | "Electronics"             // opt4iHrdd5
  | "Toys";                   // optqK8EEQP
```

### **Products Options** (Multi-Select - 33 options)
```typescript
type ProductOption =
  | "Diapers" | "Pants" | "Children's Wear" | "Kids Food"
  | "Beauty" | "Cleansing" | "Glass" | "Health" | "Skin Care"
  | "Slippers" | "Food & Beverage" | "Milk Powder" | "Baby Shoes"
  | "Learning Machine" | "Men Clothes" | "Corns" | "Underwear"
  | "Socks" | "Women Clothes" | "Home Furnishings" | "Kids products"
  | "Pet Food" | "Clothes" | "Pet Products" | "Fresh food"
  | "Baby Food" | "Snack" | "Baby Toys" | "Baby Products"
  | "Baby Toiletries" | "Maternity Wear" | "Children's Educational Toys"
  | "Cosmetic";
```

### **Collaboration Stage Options** (Single-Select)
```typescript
type CollaborationStage =
  | "Contacted"    // optPHclJBD
  | "Sample test"  // optvQNapQV
  | "Sales stage"  // optBGfOnzm
  | "GMV";         // optxCvHZGi
```

### **Live Streaming or Short Video Options** (Single-Select)
```typescript
type ContentType =
  | "Live streaming"                  // optONcQmLP
  | "Short video"                     // optQmJ3uIs
  | "Live streaming + short video";  // optqnDrXbU
```

### **Avg Monthly GMV / Avg Live GMV Options** (Single-Select)
```typescript
type GMVRange =
  | "$2500~5000"   // optViZxvou
  | "$5000-7500"   // optvG68N2E
  | "$10k-$25k"    // optLcwGBRF
  | "$25k-$50k"    // optDX1XLyj
  | "$50-$75k"     // optgYTViXK
  | "$75k-$10k"    // optN1dQrMP (typo in database?)
  | "$100k-$250k"  // optjHuN0Hb
  | "$250k-$500k"  // optfaAVqGv
  | "$500-$750k"   // opt11v3Fle
  | "$750-$1m"     // optmkHDAL4
  | "$1m-$2.5m"    // optbjQrTn2
  | "$2.5m-$5m"    // optFIYqol1
  | "$5m-$7.5m"    // opttkI6wPV
  | "$7.5m-$10m"   // opteatZkjs
  | "$10m-$25m";   // optLVtLvT5
```

### **Internal Contact Options** (Single-Select)
```typescript
type InternalContact =
  | "Sarah"    // optBBxHFyg
  | "Felix"    // optlBrqmk5
  | "Benjamin" // optkkAWLNM
  | "Charles"  // optFtjbDH4
  | "Chris"    // optO7h9Q6B
  | "Bruce"    // optenFIiRg
  | "David"    // opt4FQ6lBU
  | "Celine"   // optZ4hmgxq
  | "Ali";     // optboNaArH
```

### **MCN Agency Options** (Single-Select)
```typescript
type MCNAgency =
  | "No" // optxDhNWbS
  | "Y"; // opths01WVB
```

---

## 📊 Table 2: Campaign Management (tbldcqoLHjrdN1vM)

### **Complete Field Reference (13 Fields)**

| # | Exact Field Name | Field ID | Type | UI Type | Format | Example Value |
|---|------------------|----------|------|---------|--------|---------------|
| 1 | `Campaign ID` | `fldoM6zrIN` | 1005 | AutoNumber | Auto-generated | `"CAM001..."` |
| 2 | `Campaign Name` | `fldPky9Ybz` | 1 | Text | - | `"Summer Beauty Campaign"` |
| 3 | `KOL` | `fldDVIbPIp` | 18 | SingleLink | Linked record array | See structure below |
| 4 | `Campaign Type` | `fldh85T8ia` | 3 | SingleSelect | - | `"Short Video"` |
| 5 | `Status` | `fldpDjWWEF` | 3 | SingleSelect | - | `"In Progress"` |
| 6 | `Start Date` | `fldGyBm3LG` | 5 | DateTime | Unix timestamp (ms) | `1725148800000` |
| 7 | `End Date` | `fldIRl0enA` | 5 | DateTime | Unix timestamp (ms) | `1727827200000` |
| 8 | `Budget` | `fld9469ha3` | 2 | Currency | THB | `"500000"` (string) |
| 9 | `Campaign Manager` | `fldLF1lB0l` | 3 | SingleSelect | - | `"Sarah"` |
| 10 | `Actual GMV` | `fldpZeMcql` | 2 | Currency | THB | `"750000"` (string) |
| 11 | `ROI` | `fldu5BqZ9a` | 20 | Formula | `(Actual GMV - Budget) / Budget × 100` | `50` (number) |
| 12 | `Internal Cost` | `fldgPdwRkW` | 2 | Currency | THB | `null` |
| 13 | `Profit Margin` | `fldf8yrM2m` | 20 | Formula | `(Budget - Internal Cost) / Budget × 100` | `0` (number) |

### **KOL Linked Field Structure**
```typescript
{
  "KOL": [
    {
      "record_ids": ["recJUbNGjn"],
      "table_id": "tbl5864QVOiEokTQ",
      "text": "มินมิน ช็อป88 (ช่องหลัก)",
      "text_arr": ["มินมิน ช็อป88 (ช่องหลัก)"],
      "type": "text"
    }
  ]
}
```

---

## 📊 Table 3: Rate Management (tblMM5mBcbxzEiJ2)

### **Complete Field Reference (12 Fields)**

| # | Exact Field Name | Field ID | Type | UI Type | Format | Example Value |
|---|------------------|----------|------|---------|--------|---------------|
| 1 | `Rate ID` | `fldVsZb987` | 1005 | AutoNumber | Auto-generated | `"RATE001"` |
| 2 | `KOL` | `fldRtuVOdf` | 18 | SingleLink | Linked record array | See structure above |
| 3 | `KOL Name` | `fldsLRhRHf` | 19 | Lookup | From KOL table | `[{"text": "...", "type": "text"}]` |
| 4 | `KOL Handle` | `fldVb6j5DT` | 19 | Lookup | From KOL table | `[{"text": "...", "type": "text"}]` |
| 5 | `Service Type` | `fldFMPPls7` | 3 | SingleSelect | - | `"Short Video"` |
| 6 | `Rate (THB)` | `fldJ9yFAgR` | 2 | Currency | THB | `"45000"` (string) |
| 7 | `Duration` | `fldmJp6aaS` | 3 | SingleSelect | - | `"Per Post"` |
| 8 | `Status` | `fld8O5p34r` | 3 | SingleSelect | - | `"Active"` |
| 9 | `Client Rate (THB)` | `fldLf7ZqaF` | 2 | Currency | THB | `90000` (number) |
| 10 | `Markup %` | `flddz450d0` | 20 | Formula | `(Client Rate - Rate) / Rate × 100` | `100` (number) |
| 11 | `Profit Amount` | `fldnIGLxPV` | 20 | Formula | `Client Rate - Rate` | `45000` (number) |
| 12 | `Effective Date` | `fld8nDKbd4` | 5 | DateTime | Unix timestamp (ms) | `1725148800000` |

---

## ⚠️ Critical Data Type Notes

### **String vs Number Inconsistencies**

**IMPORTANT:** Some numeric fields return as STRINGS, not numbers!

```typescript
// ❌ WRONG - Assuming all numbers are numbers
const followers = record.fields.Follower; // "506350" (string!)
const total = followers + 1000; // "5063501000" (string concat!)

// ✅ CORRECT - Parse strings to numbers
const followers = parseInt(record.fields.Follower); // 506350 (number)
const total = followers + 1000; // 507350 (number)
```

**Fields that return as STRINGS (must parse):**
- `Follower` → `"506350"` (string)
- `LiveGmv` → `"0"` (string)
- `VideoGmv` → `"22770000"` (string)
- `LiveNum` → `"39"` (string)
- `VideoNum` → `"181"` (string)
- `ProductCount` → `"114"` (string)
- `Budget` → `"500000"` (string)
- `Actual GMV` → `"750000"` (string)
- `Rate (THB)` → `"45000"` (string)

**Fields that return as NUMBERS (no parsing needed):**
- `Views` → `54990000` (number)
- `Engagement Rate` → `10860.08` (number)
- `Revenue` → `22770000` (number)
- `Quality Score` → `3` (number)
- `ROI` → `50` (number)
- `Profit Margin` → `0` (number)
- `Client Rate (THB)` → `90000` (number)
- `Markup %` → `100` (number)
- `Profit Amount` → `45000` (number)

### **URL Field Structure**

URL fields return as objects, not strings:

```typescript
// ❌ WRONG
const url = record.fields.TiktokUrl; // {link: "...", text: "..."}

// ✅ CORRECT
const url = record.fields.TiktokUrl?.link || null;
const displayText = record.fields.TiktokUrl?.text || null;
```

### **Multi-Select Fields**

Multi-select fields return as arrays of option names (NOT IDs):

```typescript
// Example
record.fields.Location = ["Bangkok", "Thailand"]
record.fields.Specialization = null // when empty

// ✅ CORRECT - Check for null first
const locations = record.fields.Location || [];
```

### **Formula Fields Returning Option IDs**

Some formula fields return option IDs instead of names:

```typescript
// Returns array of option IDs
record.fields["Levels of KOLs"] = ["optHMhw7yb"]
record.fields["KOLs Type"] = ["optepVUy1S"]

// You'll need to map these to readable names
// Or use the field definition to look up option names
```

### **DateTime Fields**

All dates are Unix timestamps in milliseconds:

```typescript
// ✅ CORRECT
const date = new Date(record.fields.CreatorDebutTime); // 1517850000000
const formatted = date.toISOString(); // "2018-02-05T17:00:00.000Z"
```

### **Null vs Empty String vs Backslash**

Some fields use different "empty" representations:

```typescript
// Different empty states
record.fields.Bio_EN = null           // Truly empty
record.fields.Bio_TH = "\\"           // Backslash as empty marker
record.fields.InstagramUrl = "\\"     // Backslash as empty marker
record.fields.LineId = "\\"           // Backslash as empty marker

// ✅ CORRECT - Handle all cases
const bio = record.fields.Bio_TH && record.fields.Bio_TH !== "\\"
  ? record.fields.Bio_TH
  : null;
```

---

## 🔧 TypeScript Interface (Exact Field Names)

```typescript
interface LarkbaseKOLRecord {
  id: string;
  record_id: string;
  fields: {
    // Identity (exact field names from database)
    "KOLs ID": string;
    "Nickname": string;
    "Handle": string;

    // Metrics (note: some are strings!)
    "Follower": string;              // ⚠️ STRING, not number
    "Views": number;
    "Engagement Rate": number;
    "LiveGmv": string;               // ⚠️ STRING, not number
    "VideoGmv": string;              // ⚠️ STRING, not number
    "Revenue": number;               // Formula field
    "LiveNum": string;               // ⚠️ STRING, not number
    "VideoNum": string;              // ⚠️ STRING, not number
    "ProductCount": string;          // ⚠️ STRING, not number

    // Classification (formula fields return option IDs)
    "Levels of KOLs": string[];      // Array of option IDs
    "KOLs Type": string[];           // Array of option IDs
    "Quality Score": number;

    // Multi-select (arrays of option names)
    "Specialization": string[] | null;
    "Categories": string[] | null;
    "Products": string[] | null;
    "Location": string[] | null;

    // URLs (objects with link and text)
    "TiktokUrl": { link: string; text: string } | null;
    "SourceUrl": { link: string; text: string } | null;
    "InstagramUrl": string | null;   // Text field, not URL object
    "YoutubeUrl": string | null;
    "XUrl": string | null;
    "FacebookUrl": string | null;

    // Contact
    "Contact_Email": string | null;
    "Contact_Phone": string | null;
    "LineId": string | null;

    // Business
    "Collaboration stage": string | null;
    "Live streaming or short video": string | null;
    "Avg Monthly GMV": string | null;
    "Avg Live GMV": string | null;
    "Internal Contact": string | null;
    "MCN Agency": string | null;

    // Additional
    "Bio_TH": string | null;
    "Bio_EN": string | null;
    "Profile_Image_URL": string | null;
    "CreatorDebutTime": number | null; // Unix timestamp (ms)
    "Detailed information": string | null;
    "Attachment": any | null;
    "Record ID": Array<{ text: string; type: string }>;
  };
}

interface LarkbaseCampaignRecord {
  id: string;
  record_id: string;
  fields: {
    "Campaign ID": string;
    "Campaign Name": string;
    "Campaign Type": string | null;
    "Status": string | null;
    "Start Date": number | null;     // Unix timestamp (ms)
    "End Date": number | null;       // Unix timestamp (ms)
    "Budget": string | null;         // ⚠️ STRING, not number
    "Campaign Manager": string | null;
    "Actual GMV": string | null;     // ⚠️ STRING, not number
    "ROI": number;                   // Formula field
    "Internal Cost": number | null;
    "Profit Margin": number;         // Formula field
    "KOL": Array<{
      record_ids: string[];
      table_id: string;
      text: string;
      text_arr: string[];
      type: string;
    }> | null;
  };
}

interface LarkbaseRateRecord {
  id: string;
  record_id: string;
  fields: {
    "Rate ID": string;
    "Service Type": string | null;
    "Rate (THB)": string | null;     // ⚠️ STRING, not number
    "Duration": string | null;
    "Status": string | null;
    "Client Rate (THB)": number | null; // Number (not string!)
    "Markup %": number;              // Formula field
    "Profit Amount": number;         // Formula field
    "Effective Date": number | null; // Unix timestamp (ms)
    "KOL": Array<{
      record_ids: string[];
      table_id: string;
      text: string;
      text_arr: string[];
      type: string;
    }> | null;
    "KOL Name": Array<{ text: string; type: string }> | null;
    "KOL Handle": Array<{ text: string; type: string }> | null;
  };
}
```

---

## 🎯 Naming Convention Rules

### **For Dashboard Components:**

1. **File names:** `kebab-case.tsx`
   - ✅ `total-kols-card.tsx`
   - ✅ `kol-detail-modal.tsx`
   - ❌ `TotalKOLsCard.tsx`

2. **Component names:** `PascalCase`
   - ✅ `TotalKOLsCard`
   - ✅ `KOLDetailModal`
   - ❌ `totalKOLsCard`

3. **Variables for database fields:** Use exact field names in quotes
   - ✅ `record.fields["KOLs ID"]`
   - ✅ `record.fields["Engagement Rate"]`
   - ❌ `record.fields.kolsId` (won't work!)

4. **Transformed data:** `camelCase` after parsing
   - ✅ `kolId`, `engagementRate`, `videoGmv`
   - ❌ `kol_id`, `engagement_rate`

5. **TypeScript interfaces:** `PascalCase` for types
   - ✅ `KOLRecord`, `CampaignRecord`
   - ❌ `kol_record`, `campaign_record`

---

## 📝 Data Transformation Example

```typescript
// Raw API response
const rawRecord = {
  id: "recJUbNGjn",
  record_id: "recJUbNGjn",
  fields: {
    "KOLs ID": "HYPKOL00120250914",
    "Nickname": "มินมิน ช็อป88 (ช่องหลัก)",
    "Follower": "506350",           // ⚠️ STRING
    "Views": 54990000,              // ✅ NUMBER
    "Engagement Rate": 10860.08,
    "Revenue": 22770000,
    "TiktokUrl": {                  // ⚠️ OBJECT
      "link": "https://www.tiktok.com/@mintrako8764",
      "text": "https://www.tiktok.com/@mintrako8764"
    },
    "Location": ["Bangkok", "Thailand"], // ⚠️ ARRAY
    "Levels of KOLs": ["optHMhw7yb"],    // ⚠️ Option ID
    "InstagramUrl": "\\",           // ⚠️ Backslash = empty
  }
};

// ✅ CORRECT transformation
const transformedRecord = {
  id: rawRecord.record_id,
  kolId: rawRecord.fields["KOLs ID"],
  nickname: rawRecord.fields["Nickname"],
  follower: parseInt(rawRecord.fields["Follower"]),           // Parse to number
  views: rawRecord.fields["Views"],
  engagementRate: rawRecord.fields["Engagement Rate"],
  revenue: rawRecord.fields["Revenue"],
  tiktokUrl: rawRecord.fields["TiktokUrl"]?.link || null,     // Extract link
  location: rawRecord.fields["Location"] || [],               // Handle null
  levelOfKOL: mapOptionIdToName(rawRecord.fields["Levels of KOLs"]?.[0]), // Map ID to name
  instagramUrl: rawRecord.fields["InstagramUrl"] !== "\\"
    ? rawRecord.fields["InstagramUrl"]
    : null                                                     // Handle backslash
};
```

---

## ✅ Checklist for Consistency

- [x] All field names match EXACT database field names (case-sensitive)
- [x] Parse string numbers to actual numbers before calculations
- [x] Extract `.link` property from URL objects
- [x] Handle `null`, `"\\"`, and empty arrays consistently
- [x] Map option IDs to human-readable names
- [x] Convert Unix timestamps to Date objects
- [x] Use camelCase for transformed data
- [x] Use exact field names in quotes when accessing raw data

---

**Generated:** 2025-10-26
**Status:** Complete & Verified Against Live Database
**Next:** Ready for dashboard implementation with zero field name confusion
