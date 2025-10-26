/**
 * Data Transformation Utilities for KOL Records
 * Transforms raw Larkbase data into clean, typed objects
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
 * Parse string to number, handling null/undefined
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
 * Fix engagement rate - database stores values multiplied by 100
 * E.g. 10860.08 should be 108.6% but we cap at realistic max of 15%
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
 * Calculate KOL level from follower count
 * Formula: Mega (≥1M), Macro (100K-1M), Micro (10K-100K), Nano (<10K)
 */
function calculateLevel(followerCount: number): string {
  if (followerCount >= 1000000) return "Mega";
  if (followerCount >= 100000) return "Macro";
  if (followerCount >= 10000) return "Micro";
  return "Nano";
}

/**
 * Extract URL from Larkbase URL object
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
 * Clean string field (handle backslash empty markers)
 */
function cleanString(value: any): string | null {
  if (!value || value === "\\") {
    return null;
  }

  return typeof value === "string" ? value : null;
}

/**
 * Map option ID to name
 */
function mapOptionId(optionIds: string[] | null, mapping: Record<string, string>): string {
  if (!optionIds || optionIds.length === 0) {
    return "Unknown";
  }

  return mapping[optionIds[0]] || optionIds[0];
}

/**
 * Transform raw KOL record from Larkbase to typed KOL object
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
 * Transform raw Campaign record from Larkbase
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
 * Transform raw Rate record from Larkbase
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
 * Format currency in Thai Baht
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
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format percentage
 */
export function formatPercent(num: number, decimals: number = 2): string {
  return `${num.toFixed(decimals)}%`;
}

/**
 * Get level badge color
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
 * Get collaboration stage color
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
