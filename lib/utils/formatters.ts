/**
 * Formatting Utilities
 *
 * Helper functions for formatting data display across the application.
 * Includes formatters for numbers, currency, dates, percentages, and
 * domain-specific data like KOL metrics and campaign information.
 *
 * @module lib/utils/formatters
 */

/**
 * Formats a number with thousand separators using US locale formatting.
 *
 * @param num - Number to format
 * @returns Formatted string with thousand separators (e.g., "1,234,567")
 *
 * @example
 * ```typescript
 * formatNumber(1234567)
 * // => "1,234,567"
 *
 * formatNumber(1000)
 * // => "1,000"
 *
 * formatNumber(42)
 * // => "42"
 * ```
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats a number as Thai Baht currency.
 *
 * Uses Thai locale formatting with customizable currency code.
 * Rounds to whole numbers (no decimal places) by default.
 *
 * @param amount - Amount to format
 * @param currency - ISO 4217 currency code (default: 'THB')
 * @returns Formatted currency string (e.g., "฿1,234")
 *
 * @example
 * ```typescript
 * formatCurrency(1234.56)
 * // => "฿1,235"
 *
 * formatCurrency(1000000)
 * // => "฿1,000,000"
 *
 * formatCurrency(100, 'USD')
 * // => "$100" (uses USD formatting)
 * ```
 */
export function formatCurrency(amount: number, currency: string = 'THB'): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number as a percentage with customizable decimal places.
 *
 * @param value - Numeric value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string with % symbol
 *
 * @example
 * ```typescript
 * formatPercentage(12.345)
 * // => "12.3%"
 *
 * formatPercentage(99.9999, 2)
 * // => "100.00%"
 *
 * formatPercentage(5, 0)
 * // => "5%"
 * ```
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a date in Thai locale with multiple format options.
 *
 * Supports short format (e.g., "15 ม.ค. 2024"), long format (e.g., "15 มกราคม 2024"),
 * and relative format (e.g., "2 days ago", "Yesterday").
 *
 * @param date - Date string or Date object to format
 * @param format - Format type: 'short', 'long', or 'relative' (default: 'short')
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDate('2024-01-15', 'short')
 * // => "15 ม.ค. 2024"
 *
 * formatDate(new Date('2024-01-15'), 'long')
 * // => "15 มกราคม 2024"
 *
 * formatDate(new Date(Date.now() - 86400000), 'relative')
 * // => "Yesterday"
 *
 * formatDate(new Date(Date.now() - 3 * 86400000), 'relative')
 * // => "3 days ago"
 * ```
 *
 * @remarks
 * Relative format ranges:
 * - Same day: "Today"
 * - 1 day ago: "Yesterday"
 * - 2-6 days ago: "X days ago"
 * - 1-4 weeks ago: "X weeks ago"
 * - 1-11 months ago: "X months ago"
 * - 12+ months ago: "X years ago"
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return new Intl.DateTimeFormat('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(dateObj);
    
    case 'long':
      return new Intl.DateTimeFormat('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(dateObj);
    
    case 'relative':
      const now = new Date();
      const diff = now.getTime() - dateObj.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
      if (days < 365) return `${Math.floor(days / 30)} months ago`;
      return `${Math.floor(days / 365)} years ago`;
    
    default:
      return dateObj.toISOString().split('T')[0];
  }
}

/**
 * Formats a duration in days to human-readable format.
 *
 * Automatically selects the most appropriate unit (days, weeks, months, years)
 * based on the duration value.
 *
 * @param days - Duration in days
 * @returns Human-readable duration string
 *
 * @example
 * ```typescript
 * formatDuration(0.5)
 * // => "Less than a day"
 *
 * formatDuration(1)
 * // => "1 day"
 *
 * formatDuration(5)
 * // => "5 days"
 *
 * formatDuration(14)
 * // => "2 weeks"
 *
 * formatDuration(60)
 * // => "2 months"
 *
 * formatDuration(400)
 * // => "1 years"
 * ```
 */
export function formatDuration(days: number): string {
  if (days < 1) return 'Less than a day';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  if (days < 365) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years`;
}

/**
 * Formats an engagement rate with 2 decimal places.
 *
 * @param rate - Engagement rate as a number
 * @returns Formatted percentage string with 2 decimal places
 *
 * @example
 * ```typescript
 * formatEngagementRate(5.678)
 * // => "5.68%"
 *
 * formatEngagementRate(12.3)
 * // => "12.30%"
 * ```
 */
export function formatEngagementRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/**
 * Formats follower count with K/M/B suffixes for large numbers.
 *
 * Automatically abbreviates numbers using thousand (K), million (M), or
 * billion (B) suffixes when appropriate. Shows one decimal place for
 * abbreviated numbers.
 *
 * @param count - Follower count to format
 * @returns Formatted string with abbreviation suffix
 *
 * @example
 * ```typescript
 * formatFollowers(999)
 * // => "999"
 *
 * formatFollowers(1500)
 * // => "1.5K"
 *
 * formatFollowers(1500000)
 * // => "1.5M"
 *
 * formatFollowers(2300000000)
 * // => "2.3B"
 * ```
 *
 * @remarks
 * - Numbers < 1,000: No suffix
 * - Numbers >= 1,000: K suffix
 * - Numbers >= 1,000,000: M suffix
 * - Numbers >= 1,000,000,000: B suffix
 */
export function formatFollowers(count: number): string {
  if (count >= 1000000000) {
    return `${(count / 1000000000).toFixed(1)}B`;
  }
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Formats social media platform names with correct capitalization.
 *
 * Converts lowercase platform identifiers to their properly branded names.
 * Falls back to the input string (capitalized) if platform is unknown.
 *
 * @param platform - Platform identifier (case-insensitive)
 * @returns Properly formatted platform name
 *
 * @example
 * ```typescript
 * formatPlatformName('tiktok')
 * // => "TikTok"
 *
 * formatPlatformName('INSTAGRAM')
 * // => "Instagram"
 *
 * formatPlatformName('youtube')
 * // => "YouTube"
 *
 * formatPlatformName('snapchat')
 * // => "snapchat" (unknown platform, returns input)
 * ```
 *
 * @remarks
 * Supported platforms: TikTok, Instagram, YouTube, Facebook, Twitter, LINE
 */
export function formatPlatformName(platform: string): string {
  const platformMap: Record<string, string> = {
    tiktok: 'TikTok',
    instagram: 'Instagram',
    youtube: 'YouTube',
    facebook: 'Facebook',
    twitter: 'Twitter',
    line: 'LINE'
  };

  return platformMap[platform.toLowerCase()] || platform;
}

/**
 * Formats campaign objective identifiers to human-readable text.
 *
 * @param objective - Campaign objective identifier (snake_case)
 * @returns Formatted objective name in Title Case
 *
 * @example
 * ```typescript
 * formatCampaignObjective('brand_awareness')
 * // => "Brand Awareness"
 *
 * formatCampaignObjective('product_launch')
 * // => "Product Launch"
 * ```
 */
export function formatCampaignObjective(objective: string): string {
  const objectiveMap: Record<string, string> = {
    brand_awareness: 'Brand Awareness',
    product_launch: 'Product Launch',
    sales_driving: 'Sales Driving',
    engagement: 'Engagement',
    user_generated_content: 'User Generated Content',
    event_promotion: 'Event Promotion'
  };

  return objectiveMap[objective] || objective;
}

/**
 * Formats campaign status identifiers to human-readable text.
 *
 * @param status - Campaign status identifier (lowercase)
 * @returns Formatted status name in Title Case
 *
 * @example
 * ```typescript
 * formatCampaignStatus('active')
 * // => "Active"
 *
 * formatCampaignStatus('paused')
 * // => "Paused"
 * ```
 */
export function formatCampaignStatus(status: string): string {
  const statusMap: Record<string, string> = {
    draft: 'Draft',
    active: 'Active',
    paused: 'Paused',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  return statusMap[status] || status;
}

/**
 * Formats KOL (Key Opinion Leader) level identifiers to display names.
 *
 * @param level - KOL level identifier (lowercase)
 * @returns Formatted KOL level with "KOL" suffix
 *
 * @example
 * ```typescript
 * formatKOLLevel('mega')
 * // => "Mega KOL"
 *
 * formatKOLLevel('micro')
 * // => "Micro KOL"
 * ```
 *
 * @remarks
 * KOL levels are typically based on follower count:
 * - Mega: 1M+ followers
 * - Macro: 100K-1M followers
 * - Micro: 10K-100K followers
 * - Nano: <10K followers
 */
export function formatKOLLevel(level: string): string {
  const levelMap: Record<string, string> = {
    mega: 'Mega KOL',
    macro: 'Macro KOL',
    micro: 'Micro KOL',
    nano: 'Nano KOL'
  };

  return levelMap[level] || level;
}

/**
 * Formats content type identifiers to human-readable names.
 *
 * @param type - Content type identifier (snake_case)
 * @returns Formatted content type in Title Case
 *
 * @example
 * ```typescript
 * formatContentType('live_streaming')
 * // => "Live Streaming"
 *
 * formatContentType('short_video')
 * // => "Short Video"
 * ```
 */
export function formatContentType(type: string): string {
  const typeMap: Record<string, string> = {
    live_streaming: 'Live Streaming',
    short_video: 'Short Video',
    long_video: 'Long Video',
    post: 'Post',
    story: 'Story',
    review: 'Review',
    tutorial: 'Tutorial',
    unboxing: 'Unboxing'
  };

  return typeMap[type] || type;
}

/**
 * Truncates text to a maximum length and adds ellipsis if truncated.
 *
 * @param text - Text string to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 *
 * @example
 * ```typescript
 * truncateText('This is a long text', 10)
 * // => "This is a ..."
 *
 * truncateText('Short', 10)
 * // => "Short"
 * ```
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Formats file size in bytes to human-readable format with appropriate units.
 *
 * Automatically selects the best unit (Bytes, KB, MB, GB) and rounds to
 * 2 decimal places for readability.
 *
 * @param bytes - File size in bytes
 * @returns Formatted file size string with unit
 *
 * @example
 * ```typescript
 * formatFileSize(0)
 * // => "0 Bytes"
 *
 * formatFileSize(1024)
 * // => "1 KB"
 *
 * formatFileSize(1536000)
 * // => "1.46 MB"
 *
 * formatFileSize(5368709120)
 * // => "5 GB"
 * ```
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Formats a date as relative time from now (e.g., "2 hours ago").
 *
 * For times less than a week ago, displays relative format. For older dates,
 * falls back to short date format.
 *
 * @param date - Date string or Date object to format
 * @returns Relative time string or short date format
 *
 * @example
 * ```typescript
 * formatTimeAgo(new Date(Date.now() - 30000))
 * // => "Just now"
 *
 * formatTimeAgo(new Date(Date.now() - 300000))
 * // => "5 minutes ago"
 *
 * formatTimeAgo(new Date(Date.now() - 7200000))
 * // => "2 hours ago"
 *
 * formatTimeAgo(new Date(Date.now() - 172800000))
 * // => "2 days ago"
 *
 * formatTimeAgo(new Date(Date.now() - 864000000))
 * // => "15 ม.ค. 2024" (falls back to short date)
 * ```
 *
 * @remarks
 * Relative format ranges:
 * - < 1 minute: "Just now"
 * - 1-59 minutes: "X minute(s) ago"
 * - 1-23 hours: "X hour(s) ago"
 * - 1-6 days: "X day(s) ago"
 * - 7+ days: Uses formatDate('short')
 */
export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  return formatDate(date, 'short');
}

/**
 * Formats status with associated Tailwind CSS color class.
 *
 * Returns an object with formatted text and appropriate color class for
 * consistent status styling across the application.
 *
 * @param status - Status identifier (lowercase)
 * @returns Object with formatted text and Tailwind color class
 *
 * @example
 * ```typescript
 * formatStatusWithColor('active')
 * // => { text: 'Active', color: 'text-green-600' }
 *
 * formatStatusWithColor('failed')
 * // => { text: 'Failed', color: 'text-red-600' }
 *
 * formatStatusWithColor('unknown')
 * // => { text: 'unknown', color: 'text-gray-600' }
 * ```
 *
 * @remarks
 * Color mappings:
 * - active: green (success)
 * - paused: yellow (warning)
 * - completed: blue (info)
 * - draft: gray (neutral)
 * - cancelled/failed: red (error)
 * - pending: orange (caution)
 */
export function formatStatusWithColor(status: string): { text: string; color: string } {
  const statusConfig: Record<string, { text: string; color: string }> = {
    active: { text: 'Active', color: 'text-green-600' },
    paused: { text: 'Paused', color: 'text-yellow-600' },
    completed: { text: 'Completed', color: 'text-blue-600' },
    draft: { text: 'Draft', color: 'text-gray-600' },
    cancelled: { text: 'Cancelled', color: 'text-red-600' },
    pending: { text: 'Pending', color: 'text-orange-600' },
    failed: { text: 'Failed', color: 'text-red-600' }
  };

  return statusConfig[status] || { text: status, color: 'text-gray-600' };
}

/**
 * Formats percentage change with color coding and directional icon.
 *
 * Positive changes get green color and up arrow, negative changes get
 * red color and down arrow. Perfect for displaying metrics changes.
 *
 * @param change - Percentage change value (positive or negative)
 * @returns Object with formatted text, color class, and directional icon
 *
 * @example
 * ```typescript
 * formatPercentageChange(15.5)
 * // => { text: '+15.5%', color: 'text-green-600', icon: '↗' }
 *
 * formatPercentageChange(-8.2)
 * // => { text: '-8.2%', color: 'text-red-600', icon: '↘' }
 *
 * formatPercentageChange(0)
 * // => { text: '+0.0%', color: 'text-green-600', icon: '↗' }
 * ```
 *
 * @remarks
 * - Positive/zero values: green with up arrow (↗)
 * - Negative values: red with down arrow (↘)
 * - Always formats to 1 decimal place
 */
export function formatPercentageChange(change: number): { text: string; color: string; icon: string } {
  const isPositive = change >= 0;
  const color = isPositive ? 'text-green-600' : 'text-red-600';
  const icon = isPositive ? '↗' : '↘';
  const sign = isPositive ? '+' : '';

  return {
    text: `${sign}${change.toFixed(1)}%`,
    color: color,
    icon: icon
  };
}