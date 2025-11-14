/**
 * Data Transformation Utilities for KOL Records
 *
 * Transforms raw Larkbase API data into clean, typed TypeScript objects.
 * Handles data normalization, type conversion, and validation for KOL
 * (Key Opinion Leader), Campaign, and Rate records.
 *
 * @module lib/utils/kol-transform
 *
 * @remarks
 * This module addresses several data quality issues from the Larkbase source:
 * - Engagement rates stored as basis points (needs division by 100)
 * - Mixed string/number types requiring parsing
 * - Empty values represented as backslash ("\")
 * - URL fields wrapped in objects with .link property
 * - Missing KOL levels that need calculation from follower counts
 *
 * @example
 * ```typescript
 * import { transformKOL, transformCampaign } from '@/lib/utils/kol-transform';
 *
 * // Transform raw API response
 * const rawKOL = await larkbaseAPI.getKOLs();
 * const cleanKOL = transformKOL(rawKOL);
 * ```
 */

// Option ID to Name mappings based on Larkbase formulas
// Formula for Levels: IF(Follower >= 1000000, "Mega KOL", IF(Follower >= 100000, "Macro KOL", IF(Follower >= 10000, "Micro KOL", IF(Follower <= 10000, "Nano KOL", "Emerging KOL"))))
export const LEVEL_OPTIONS: Record<string, string> = {
  optS0lkMYn: "Mega", // ≥1M followers
  optHMhw7yb: "Macro", // ≥100K followers
  optqcVJV99: "Micro", // ≥10K followers
  // Nano and Emerging would have other option IDs
};

// Formula for KOLs Type: IF(LiveGmv>0 AND VideoGmv>0, "Live Creator", IF(LiveGmv>0, "Live Seller", IF(VideoGmv>0, "Creator", "No Category")))
export const KOL_TYPE_OPTIONS: Record<string, string> = {
  optepVUy1S: "Creator", // Has VideoGmv only
  // Other types would have different option IDs
};

// Type Definitions
export interface KOL {
  id: string;
  recordId: string;
  kolId: string;
  nickname: string;
  handle: string;

  // Metrics
  follower: number;
  views: number;
  engagementRate: number;
  liveGmv: number;
  videoGmv: number;
  revenue: number;
  liveNum: number;
  videoNum: number;
  productCount: number;
  avgViews?: number;
  avgLikes?: number;

  // Classification
  level: string;
  kolType: string;
  qualityScore: number;

  // Arrays
  specialization: string[];
  categories: string[];
  products: string[];
  location: string[];

  // URLs
  tiktokUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  xUrl: string | null;
  facebookUrl: string | null;
  sourceUrl: string | null;
  profileImageUrl: string | null;

  // Contact
  contactEmail: string | null;
  contactPhone: string | null;
  lineId: string | null;

  // Category Description (repurposed from LineId field)
  // Note: Database LineId field currently contains KOL category descriptions in Thai
  // instead of actual Line messenger IDs. This is useful for categorization.
  categoryDescription?: string;

  // Business
  collaborationStage: string | null;
  liveStreamingOrShortVideo: string | null;
  avgMonthlyGmv: string | null;
  avgLiveGmv: string | null;
  internalContact: string | null;
  mcnAgency: string | null;

  // Additional
  bioTh: string | null;
  bioEn: string | null;
  creatorDebutTime: Date | null;
  detailedInformation: string | null;
}

export interface Campaign {
  id: string;
  recordId: string;
  campaignId: string;
  campaignName: string;
  campaignType: string | null;
  status: string | null;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  actualGmv: number | null;
  internalCost: number | null;
  roi: number;
  profitMargin: number;
  campaignManager: string | null;
  kolIds: string[];
  kolNames: string[];
}

export interface Rate {
  id: string;
  recordId: string;
  rateId: string;
  kolId: string | null;
  kolName: string | null;
  kolHandle: string | null;
  serviceType: string | null;
  rate: number | null;
  clientRate: number | null;
  markupPercent: number;
  profitAmount: number;
  duration: string | null;
  status: string | null;
  effectiveDate: Date | null;
}

/**
 * Parses a value to a number, handling various input types and edge cases.
 *
 * Safely converts strings, numbers, null, and undefined to numbers. Handles
 * comma-separated numbers (e.g., "1,234.56") and returns 0 for invalid inputs.
 *
 * @param value - Value to parse (any type accepted)
 * @returns Parsed number or 0 if parsing fails
 *
 * @example
 * ```typescript
 * parseNumber(42)
 * // => 42
 *
 * parseNumber("1,234.56")
 * // => 1234.56
 *
 * parseNumber(null)
 * // => 0
 *
 * parseNumber("invalid")
 * // => 0
 *
 * parseNumber("")
 * // => 0
 * ```
 *
 * @remarks
 * - Null, undefined, and empty strings return 0
 * - Removes commas before parsing (handles formatted numbers)
 * - Invalid number strings return 0 (no exceptions thrown)
 */
function parseNumber(value: any): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/,/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

/**
 * Parses and corrects engagement rate from Larkbase data.
 *
 * The database stores engagement rates as basis points (multiplied by 100).
 * This function divides by 100 if needed and caps at a realistic maximum of 15%.
 *
 * @param value - Raw engagement rate value from database
 * @returns Corrected engagement rate (0-15%)
 *
 * @example
 * ```typescript
 * parseEngagementRate(10860.08)
 * // => 15 (capped at maximum)
 *
 * parseEngagementRate(580)
 * // => 5.8
 *
 * parseEngagementRate(5.5)
 * // => 5.5 (already in correct range)
 * ```
 *
 * @remarks
 * - Values > 100 are divided by 100 (basis points conversion)
 * - Result capped at 15% (realistic maximum engagement rate)
 * - Values 0-100 passed through unchanged
 */
function parseEngagementRate(value: any): number {
  const rawValue = parseNumber(value);

  // If value is > 100, it's stored as basis points (divide by 100)
  if (rawValue > 100) {
    const corrected = rawValue / 100;
    // Cap at realistic maximum of 15%
    return Math.min(corrected, 15);
  }

  // If value is already in correct range (0-100), return as is
  return rawValue;
}

/**
 * Calculates KOL level based on follower count.
 *
 * Uses industry-standard follower count ranges to categorize influencers.
 *
 * @param followerCount - Number of followers
 * @returns KOL level: "Mega", "Macro", "Micro", or "Nano"
 *
 * @example
 * ```typescript
 * calculateLevel(2500000)
 * // => "Mega"
 *
 * calculateLevel(500000)
 * // => "Macro"
 *
 * calculateLevel(50000)
 * // => "Micro"
 *
 * calculateLevel(5000)
 * // => "Nano"
 * ```
 *
 * @remarks
 * Level ranges:
 * - Mega: >= 1,000,000 followers
 * - Macro: 100,000 - 999,999 followers
 * - Micro: 10,000 - 99,999 followers
 * - Nano: < 10,000 followers
 */
function calculateLevel(followerCount: number): string {
  if (followerCount >= 1000000) return "Mega";
  if (followerCount >= 100000) return "Macro";
  if (followerCount >= 10000) return "Micro";
  return "Nano";
}

/**
 * Extracts URL from Larkbase URL field which can be object or string.
 *
 * Larkbase stores URLs in two formats: as objects with .link property
 * or as plain strings. This function handles both cases.
 *
 * @param urlField - URL field value from Larkbase (object or string)
 * @returns Extracted URL string or null if invalid
 *
 * @example
 * ```typescript
 * extractUrl({ link: "https://example.com" })
 * // => "https://example.com"
 *
 * extractUrl("https://example.com")
 * // => "https://example.com"
 *
 * extractUrl("\\")
 * // => null (backslash indicates empty)
 *
 * extractUrl(null)
 * // => null
 * ```
 */
function extractUrl(urlField: any): string | null {
  if (!urlField) return null;

  if (typeof urlField === "object" && urlField.link) {
    return urlField.link;
  }

  if (typeof urlField === "string" && urlField !== "\\") {
    return urlField;
  }

  return null;
}

/**
 * Cleans string fields by handling Larkbase empty value markers.
 *
 * Larkbase uses backslash ("\") to indicate empty fields. This function
 * normalizes such values to null for consistent handling.
 *
 * @param value - String value from Larkbase
 * @returns Cleaned string or null if empty/invalid
 *
 * @example
 * ```typescript
 * cleanString("John Doe")
 * // => "John Doe"
 *
 * cleanString("\\")
 * // => null (Larkbase empty marker)
 *
 * cleanString(null)
 * // => null
 *
 * cleanString("")
 * // => null
 * ```
 */
function cleanString(value: any): string | null {
  if (!value || value === "\\") {
    return null;
  }

  return typeof value === "string" ? value : null;
}

/**
 * Maps Larkbase option IDs to human-readable names.
 *
 * Larkbase stores select field values as option IDs (e.g., "optS0lkMYn").
 * This function converts them to readable names using a mapping object.
 *
 * @param optionIds - Array of option IDs from Larkbase
 * @param mapping - Mapping object from option IDs to names
 * @returns Mapped name or first option ID if not found, or "Unknown" if empty
 *
 * @example
 * ```typescript
 * const levelMap = { optS0lkMYn: "Mega", optHMhw7yb: "Macro" };
 * mapOptionId(["optS0lkMYn"], levelMap)
 * // => "Mega"
 *
 * mapOptionId(["unknown_id"], levelMap)
 * // => "unknown_id" (fallback to ID)
 *
 * mapOptionId(null, levelMap)
 * // => "Unknown"
 * ```
 */
function mapOptionId(optionIds: string[] | null, mapping: Record<string, string>): string {
  if (!optionIds || optionIds.length === 0) {
    return "Unknown";
  }

  return mapping[optionIds[0]] || optionIds[0];
}

/**
 * Transforms raw KOL record from Larkbase API to typed KOL object.
 *
 * Performs comprehensive data normalization including:
 * - Type conversion (strings to numbers, dates)
 * - Engagement rate correction (basis points to percentage)
 * - KOL level calculation from follower count
 * - URL extraction from object/string fields
 * - Empty value normalization ("\" to null)
 * - Option ID mapping to readable names
 *
 * @param rawRecord - Raw KOL record from Larkbase API
 * @returns Typed and normalized KOL object
 *
 * @example
 * ```typescript
 * const rawKOL = {
 *   id: "rec123",
 *   record_id: "rec123",
 *   fields: {
 *     "Nickname": "Thai Influencer",
 *     "Handle": "@thai_influencer",
 *     "Follower": "1500000",
 *     "Engagement Rate": "580.5",
 *     // ... other fields
 *   }
 * };
 *
 * const kol = transformKOL(rawKOL);
 * // => {
 * //   nickname: "Thai Influencer",
 * //   handle: "@thai_influencer",
 * //   follower: 1500000,
 * //   engagementRate: 5.805,
 * //   level: "Mega",
 * //   ...
 * // }
 * ```
 *
 * @remarks
 * Key transformations applied:
 * - Numeric fields: Parsed from strings, commas removed, defaults to 0
 * - Engagement rate: Divided by 100 if > 100, capped at 15%
 * - KOL level: Auto-calculated if database field is empty
 * - URLs: Extracted from { link: "..." } objects
 * - Empty markers: "\" converted to null
 * - Collaboration stage: Defaults to "Not Contacted" if empty
 *
 * @throws Does not throw - returns object with safe defaults for invalid data
 */
export function transformKOL(rawRecord: any): KOL {
  const fields = rawRecord.fields;

  // Parse follower count first (needed for level calculation)
  const followerCount = parseNumber(fields["Follower"]);

  // Get level from database field, or calculate from follower count if empty
  const dbLevel = mapOptionId(fields["Levels of KOLs"], LEVEL_OPTIONS);
  const calculatedLevel = calculateLevel(followerCount);
  const finalLevel = dbLevel !== "Unknown" ? dbLevel : calculatedLevel;

  return {
    id: rawRecord.id,
    recordId: rawRecord.record_id,
    kolId: fields["KOLs ID"] || "",
    nickname: fields["Nickname"] || "",
    handle: fields["Handle"] || "",

    // Parse numeric fields (some are strings!)
    follower: followerCount,
    views: parseNumber(fields["Views"]),
    engagementRate: parseEngagementRate(fields["Engagement Rate"]), // FIX: Use corrected parser
    liveGmv: parseNumber(fields["LiveGmv"]),
    videoGmv: parseNumber(fields["VideoGmv"]),
    revenue: parseNumber(fields["Revenue"]),
    liveNum: parseNumber(fields["LiveNum"]),
    videoNum: parseNumber(fields["VideoNum"]),
    productCount: parseNumber(fields["ProductCount"]),
    avgViews: parseNumber(fields["Avg Views"]) || undefined,
    avgLikes: parseNumber(fields["Avg Likes"]) || undefined,

    // Classification
    level: finalLevel, // FIX: Auto-calculate if database field is empty
    kolType: mapOptionId(fields["KOLs Type"], KOL_TYPE_OPTIONS),
    qualityScore: parseNumber(fields["Quality Score"]),

    // Multi-select arrays
    specialization: fields["Specialization"] || [],
    categories: fields["Categories"] || [],
    products: fields["Products"] || [],
    location: fields["Location"] || [],

    // URLs
    tiktokUrl: extractUrl(fields["TiktokUrl"]),
    instagramUrl: cleanString(fields["InstagramUrl"]),
    youtubeUrl: cleanString(fields["YoutubeUrl"]),
    xUrl: cleanString(fields["XUrl"]),
    facebookUrl: cleanString(fields["FacebookUrl"]),
    sourceUrl: extractUrl(fields["SourceUrl"]),
    profileImageUrl: extractUrl(fields["Profile_Image_URL"]),

    // Contact - currently all null (data collection in progress)
    contactEmail: cleanString(fields["Contact_Email"]),
    contactPhone: cleanString(fields["Contact_Phone"]),
    lineId: null, // LineId field contains descriptions, not actual Line IDs

    // Category Description (repurposed from LineId field)
    // Contains KOL specialization tags in Thai (e.g., "รีวิวสินค้า" = product reviews)
    categoryDescription: cleanString(fields["LineId"]) || undefined,

    // Business
    collaborationStage: fields["Collaboration stage"] || "Not Contacted", // FIX: Default to "Not Contacted"
    liveStreamingOrShortVideo: fields["Live streaming or short video"] || null,
    avgMonthlyGmv: fields["Avg Monthly GMV"] || null,
    avgLiveGmv: fields["Avg Live GMV"] || null,
    internalContact: fields["Internal Contact"] || null,
    mcnAgency: fields["MCN Agency"] || null,

    // Additional
    bioTh: cleanString(fields["Bio_TH"]),
    bioEn: cleanString(fields["Bio_EN"]),
    creatorDebutTime: fields["CreatorDebutTime"]
      ? new Date(fields["CreatorDebutTime"])
      : null,
    detailedInformation: cleanString(fields["Detailed information"])
  };
}

/**
 * Transforms raw Campaign record from Larkbase API to typed Campaign object.
 *
 * Extracts linked KOL data, parses numeric fields, and converts dates.
 *
 * @param rawRecord - Raw campaign record from Larkbase API
 * @returns Typed and normalized Campaign object
 *
 * @example
 * ```typescript
 * const rawCampaign = {
 *   id: "rec456",
 *   record_id: "rec456",
 *   fields: {
 *     "Campaign Name": "Summer Sale 2024",
 *     "Budget": "500000",
 *     "KOL": [{ record_ids: ["rec123"], text: "Thai Influencer" }],
 *     // ... other fields
 *   }
 * };
 *
 * const campaign = transformCampaign(rawCampaign);
 * // => {
 * //   campaignName: "Summer Sale 2024",
 * //   budget: 500000,
 * //   kolIds: ["rec123"],
 * //   kolNames: ["Thai Influencer"],
 * //   ...
 * // }
 * ```
 */
export function transformCampaign(rawRecord: any): Campaign {
  const fields = rawRecord.fields;

  // Extract KOL IDs and names from linked field
  let kolIds: string[] = [];
  let kolNames: string[] = [];

  if (fields["KOL"] && Array.isArray(fields["KOL"])) {
    fields["KOL"].forEach((kol: any) => {
      if (kol.record_ids) {
        kolIds = [...kolIds, ...kol.record_ids];
      }
      if (kol.text) {
        kolNames.push(kol.text);
      }
    });
  }

  return {
    id: rawRecord.id,
    recordId: rawRecord.record_id,
    campaignId: fields["Campaign ID"] || "",
    campaignName: fields["Campaign Name"] || "",
    campaignType: fields["Campaign Type"] || null,
    status: fields["Status"] || null,
    startDate: fields["Start Date"] ? new Date(fields["Start Date"]) : null,
    endDate: fields["End Date"] ? new Date(fields["End Date"]) : null,
    budget: parseNumber(fields["Budget"]),
    actualGmv: parseNumber(fields["Actual GMV"]),
    internalCost: parseNumber(fields["Internal Cost"]),
    roi: parseNumber(fields["ROI"]),
    profitMargin: parseNumber(fields["Profit Margin"]),
    campaignManager: fields["Campaign Manager"] || null,
    kolIds,
    kolNames
  };
}

/**
 * Transforms raw Rate record from Larkbase API to typed Rate object.
 *
 * Extracts linked KOL information and parses pricing data.
 *
 * @param rawRecord - Raw rate record from Larkbase API
 * @returns Typed and normalized Rate object
 *
 * @example
 * ```typescript
 * const rawRate = {
 *   id: "rec789",
 *   record_id: "rec789",
 *   fields: {
 *     "Rate (THB)": "50000",
 *     "Client Rate (THB)": "65000",
 *     "Service Type": "Live Streaming",
 *     // ... other fields
 *   }
 * };
 *
 * const rate = transformRate(rawRate);
 * // => {
 * //   rate: 50000,
 * //   clientRate: 65000,
 * //   serviceType: "Live Streaming",
 * //   markupPercent: 30,
 * //   ...
 * // }
 * ```
 */
export function transformRate(rawRecord: any): Rate {
  const fields = rawRecord.fields;

  // Extract KOL info from linked/lookup fields
  let kolId: string | null = null;
  let kolName: string | null = null;
  let kolHandle: string | null = null;

  if (fields["KOL"] && Array.isArray(fields["KOL"]) && fields["KOL"][0]) {
    kolId = fields["KOL"][0].record_ids?.[0] || null;
  }

  if (fields["KOL Name"] && Array.isArray(fields["KOL Name"]) && fields["KOL Name"][0]) {
    kolName = fields["KOL Name"][0].text || null;
  }

  if (fields["KOL Handle"] && Array.isArray(fields["KOL Handle"]) && fields["KOL Handle"][0]) {
    kolHandle = fields["KOL Handle"][0].text || null;
  }

  return {
    id: rawRecord.id,
    recordId: rawRecord.record_id,
    rateId: fields["Rate ID"] || "",
    kolId,
    kolName,
    kolHandle,
    serviceType: fields["Service Type"] || null,
    rate: parseNumber(fields["Rate (THB)"]),
    clientRate: parseNumber(fields["Client Rate (THB)"]),
    markupPercent: parseNumber(fields["Markup %"]),
    profitAmount: parseNumber(fields["Profit Amount"]),
    duration: fields["Duration"] || null,
    status: fields["Status"] || null,
    effectiveDate: fields["Effective Date"] ? new Date(fields["Effective Date"]) : null
  };
}

/**
 * Formats amount as Thai Baht currency (no decimals).
 *
 * @param amount - Amount to format
 * @returns Formatted THB string (e.g., "฿50,000")
 *
 * @example
 * ```typescript
 * formatCurrency(50000)
 * // => "฿50,000"
 * ```
 *
 * @deprecated Use formatCurrency from @/lib/utils/formatters instead
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats number with thousand separators.
 *
 * @param num - Number to format
 * @returns Formatted number string
 *
 * @example
 * ```typescript
 * formatNumber(1500000)
 * // => "1,500,000"
 * ```
 *
 * @deprecated Use formatNumber from @/lib/utils/formatters instead
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Formats number as percentage with customizable decimals.
 *
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 *
 * @example
 * ```typescript
 * formatPercent(5.678, 2)
 * // => "5.68%"
 * ```
 *
 * @deprecated Use formatPercentage from @/lib/utils/formatters instead
 */
export function formatPercent(num: number, decimals: number = 2): string {
  return `${num.toFixed(decimals)}%`;
}

/**
 * Returns Tailwind CSS classes for KOL level badge styling.
 *
 * Provides consistent color coding for different KOL levels:
 * - Mega: Purple (highest tier)
 * - Macro: Blue
 * - Micro: Green
 * - Nano: Gray (smallest tier)
 *
 * @param level - KOL level ("Mega", "Macro", "Micro", "Nano")
 * @returns Tailwind CSS class string for badge styling
 *
 * @example
 * ```typescript
 * getLevelColor("Mega")
 * // => "bg-purple-100 text-purple-800 border-purple-300"
 *
 * getLevelColor("Micro")
 * // => "bg-green-100 text-green-800 border-green-300"
 * ```
 */
export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    "Mega": "bg-purple-100 text-purple-800 border-purple-300",
    "Macro": "bg-blue-100 text-blue-800 border-blue-300",
    "Micro": "bg-green-100 text-green-800 border-green-300",
    "Nano": "bg-gray-100 text-gray-800 border-gray-300"
  };

  return colors[level] || colors["Nano"];
}

/**
 * Returns Tailwind CSS classes for collaboration stage badge styling.
 *
 * Color codes different stages of KOL collaboration pipeline:
 * - Contacted: Gray (initial contact)
 * - Sample test: Yellow (testing phase)
 * - Sales stage: Orange (negotiation)
 * - GMV: Green (active revenue generation)
 *
 * @param stage - Collaboration stage name
 * @returns Tailwind CSS class string for badge styling
 *
 * @example
 * ```typescript
 * getStageColor("GMV")
 * // => "bg-green-100 text-green-800"
 *
 * getStageColor("Sample test")
 * // => "bg-yellow-100 text-yellow-800"
 * ```
 */
export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    "Contacted": "bg-gray-100 text-gray-800",
    "Sample test": "bg-yellow-100 text-yellow-800",
    "Sales stage": "bg-orange-100 text-orange-800",
    "GMV": "bg-green-100 text-green-800"
  };

  return colors[stage] || colors["Contacted"];
}
