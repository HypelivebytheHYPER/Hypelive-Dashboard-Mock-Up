/**
 * Larkbase API Service Layer
 * Handles all API calls to the Hypelive KOL Management System
 */

const BASE_URL = "https://larksuite-hype-server.hypelive.workers.dev";
const APP_TOKEN = "H2GQbZBFqaUW2usqPswlczYggWg";

export const TABLES = {
  KOLS: "tbl5864QVOiEokTQ",
  CAMPAIGNS: "tbldcqoLHjrdN1vM",
  RATES: "tblMM5mBcbxzEiJ2",
  KOLS_TECH: "tbl8rJWSTEemTeJh"
} as const;

// API Response Types
export interface LarkbaseResponse<T> {
  code: number;
  msg: string;
  data: {
    has_more: boolean;
    items: T[];
    page_token?: string;
    total: number;
  };
}

export interface LarkbaseFieldsResponse {
  code: number;
  msg: string;
  data: {
    fields: Array<{
      field_id: string;
      field_name: string;
      type: number;
      ui_type: string;
      property?: Record<string, any>;
    }>;
  };
}

// Filter and Sort Types
export interface LarkbaseFilter {
  conjunction: "and" | "or";
  conditions: Array<{
    field_name: string;
    operator: "is" | "isNot" | "contains" | "doesNotContain" | "isEmpty" | "isNotEmpty" | "isGreater" | "isGreaterEqual" | "isLess" | "isLessEqual";
    value?: string[];
  }>;
}

export interface LarkbaseSort {
  field_name: string;
  desc?: boolean;
}

// Fetch options
export interface FetchOptions {
  page_size?: number;
  page_token?: string;
}

export interface SearchOptions extends FetchOptions {
  filter?: LarkbaseFilter;
  sort?: LarkbaseSort[];
  automatic_fields?: boolean;
}

/**
 * Generic fetch function for Larkbase records
 */
async function fetchLarkbase<T>(
  tableId: string,
  endpoint: "records" | "fields",
  options?: FetchOptions
): Promise<T> {
  const params = new URLSearchParams();

  if (options?.page_size) {
    params.append("page_size", options.page_size.toString());
  }

  if (options?.page_token) {
    params.append("page_token", options.page_token);
  }

  const url = `${BASE_URL}/bitable/${APP_TOKEN}/${tableId}/${endpoint}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Larkbase API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search records with filters and sorting
 */
async function searchLarkbase<T>(
  tableId: string,
  options: SearchOptions
): Promise<T> {
  const url = `${BASE_URL}/bitable/${APP_TOKEN}/${tableId}/records/search`;

  const body: Record<string, any> = {};

  if (options.filter) {
    body.filter = options.filter;
  }

  if (options.sort) {
    body.sort = options.sort;
  }

  if (options.page_size) {
    body.page_size = options.page_size;
  }

  if (options.page_token) {
    body.page_token = options.page_token;
  }

  if (options.automatic_fields !== undefined) {
    body.automatic_fields = options.automatic_fields;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Larkbase API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all KOLs with optional pagination
 */
export async function fetchKOLs(options?: FetchOptions) {
  return fetchLarkbase<LarkbaseResponse<any>>(
    TABLES.KOLS,
    "records",
    options
  );
}

/**
 * Search KOLs with filters and sorting
 */
export async function searchKOLs(options: SearchOptions) {
  return searchLarkbase<LarkbaseResponse<any>>(
    TABLES.KOLS,
    options
  );
}

/**
 * Get single KOL by record ID
 */
export async function fetchKOLById(recordId: string) {
  const url = `${BASE_URL}/bitable/${APP_TOKEN}/${TABLES.KOLS}/records/${recordId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch KOL: ${response.status}`);
  }

  return response.json();
}

/**
 * Get all campaigns
 */
export async function fetchCampaigns(options?: FetchOptions) {
  return fetchLarkbase<LarkbaseResponse<any>>(
    TABLES.CAMPAIGNS,
    "records",
    options
  );
}

/**
 * Search campaigns with filters
 */
export async function searchCampaigns(options: SearchOptions) {
  return searchLarkbase<LarkbaseResponse<any>>(
    TABLES.CAMPAIGNS,
    options
  );
}

/**
 * Get campaigns for a specific KOL
 */
export async function fetchKOLCampaigns(kolRecordId: string) {
  return searchCampaigns({
    filter: {
      conjunction: "and",
      conditions: [
        {
          field_name: "KOL",
          operator: "contains",
          value: [kolRecordId]
        }
      ]
    }
  });
}

/**
 * Get all rates
 */
export async function fetchRates(options?: FetchOptions) {
  return fetchLarkbase<LarkbaseResponse<any>>(
    TABLES.RATES,
    "records",
    options
  );
}

/**
 * Search rates with filters
 */
export async function searchRates(options: SearchOptions) {
  return searchLarkbase<LarkbaseResponse<any>>(
    TABLES.RATES,
    options
  );
}

/**
 * Get rates for a specific KOL
 */
export async function fetchKOLRates(kolRecordId: string) {
  return searchRates({
    filter: {
      conjunction: "and",
      conditions: [
        {
          field_name: "KOL",
          operator: "contains",
          value: [kolRecordId]
        }
      ]
    }
  });
}

/**
 * Get field definitions for a table
 */
export async function fetchTableFields(tableId: string) {
  return fetchLarkbase<LarkbaseFieldsResponse>(
    tableId,
    "fields"
  );
}

/**
 * Build filter for follower range
 */
export function buildFollowerFilter(min?: number, max?: number): LarkbaseFilter["conditions"][0][] {
  const conditions: LarkbaseFilter["conditions"] = [];

  if (min !== undefined) {
    conditions.push({
      field_name: "Follower",
      operator: "isGreaterEqual",
      value: [min.toString()]
    });
  }

  if (max !== undefined) {
    conditions.push({
      field_name: "Follower",
      operator: "isLess",
      value: [max.toString()]
    });
  }

  return conditions;
}

/**
 * Build filter for location
 */
export function buildLocationFilter(locations: string[]): LarkbaseFilter {
  return {
    conjunction: "or",
    conditions: locations.map((location) => ({
      field_name: "Location",
      operator: "contains",
      value: [location]
    }))
  };
}

/**
 * Build filter for specialization
 */
export function buildSpecializationFilter(specializations: string[]): LarkbaseFilter {
  return {
    conjunction: "or",
    conditions: specializations.map((spec) => ({
      field_name: "Specialization",
      operator: "contains",
      value: [spec]
    }))
  };
}
