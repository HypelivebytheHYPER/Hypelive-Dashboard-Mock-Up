/**
 * Core Utility Functions
 *
 * This module provides essential utility functions used throughout the application,
 * including CSS class manipulation, avatar generation, and metadata creation.
 *
 * @module lib/utils
 */

import { Metadata } from "next";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges CSS class names using clsx and tailwind-merge.
 *
 * This utility function intelligently merges Tailwind CSS classes, handling conflicts
 * by keeping the last occurrence of conflicting utilities. Perfect for conditional
 * className props in React components.
 *
 * @param inputs - Variable number of class values (strings, objects, arrays, etc.)
 * @returns Merged and optimized class string
 *
 * @example
 * ```typescript
 * // Basic usage
 * cn('px-4 py-2', 'bg-blue-500')
 * // => 'px-4 py-2 bg-blue-500'
 *
 * // Conditional classes
 * cn('base-class', isActive && 'active-class', { 'disabled-class': isDisabled })
 * // => 'base-class active-class' (if isActive is true)
 *
 * // Tailwind conflict resolution
 * cn('px-4 py-2', 'px-6')
 * // => 'py-2 px-6' (px-6 overrides px-4)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates avatar fallback initials from a full name string.
 *
 * Extracts the first letter of each word in the name (up to all words),
 * converts them to uppercase, and joins them together. Useful for creating
 * avatar placeholders when no profile image is available.
 *
 * @param string - Full name string to generate initials from
 * @returns Uppercase initials string
 *
 * @example
 * ```typescript
 * generateAvatarFallback('John Doe')
 * // => 'JD'
 *
 * generateAvatarFallback('Mary Jane Watson')
 * // => 'MJW'
 *
 * generateAvatarFallback('Prince')
 * // => 'P'
 *
 * // Handles extra spaces
 * generateAvatarFallback('  John   Doe  ')
 * // => 'JD'
 * ```
 *
 * @see {@link getInitials} for a two-letter variant
 */
export function generateAvatarFallback(string: string) {
  const names = string.split(" ").filter((name: string) => name);
  const mapped = names.map((name: string) => name.charAt(0).toUpperCase());

  return mapped.join("");
}

/**
 * Generates comprehensive Next.js metadata for SEO and social sharing.
 *
 * Creates a full metadata object including OpenGraph tags for social media
 * previews, Twitter card configuration, and canonical URL setup. Automatically
 * prefixes paths with '/dashboard' and uses environment-based base URL.
 *
 * @param options - Metadata configuration options
 * @param options.title - Page title for browser tab and social cards
 * @param options.description - Page description for SEO and social previews
 * @param options.canonical - Canonical path (will be prefixed with /dashboard)
 * @returns Next.js Metadata object
 *
 * @example
 * ```typescript
 * // In a Next.js page or layout
 * export const metadata = generateMeta({
 *   title: 'KOL Management - Hypelive Dashboard',
 *   description: 'Manage your KOL partnerships and campaigns',
 *   canonical: '/kols'
 * });
 * // Generates full metadata with OpenGraph and Twitter cards
 *
 * // Campaign detail page
 * export const metadata = generateMeta({
 *   title: 'Summer Sale Campaign 2024',
 *   description: 'Track performance and manage influencers for the summer sale',
 *   canonical: '/campaigns/summer-sale-2024'
 * });
 * ```
 *
 * @remarks
 * - Uses NEXT_PUBLIC_APP_URL environment variable or defaults to production URL
 * - OpenGraph image uses /og-image.png at 1200x630 dimensions
 * - Twitter card set to summary_large_image format
 * - Canonical URLs automatically prefixed with /dashboard
 */
export function generateMeta({
  title,
  description,
  canonical
}: {
  title: string;
  description: string;
  canonical: string;
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard.hypelive.studio';

  return {
    title: title,
    description: description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/dashboard${canonical}`
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `/dashboard${canonical}`,
      siteName: 'Hypelive Dashboard',
      title: title,
      description: description,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Hypelive Dashboard'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/og-image.png']
    }
  };
}

/**
 * Extracts two-letter initials from a full name (first and last name only).
 *
 * Gets the first letter of the first name and first letter of the last name,
 * converts both to uppercase, and returns them concatenated. Assumes the name
 * has at least two words (first name and last name).
 *
 * @param fullName - Full name string with at least two words
 * @returns Two uppercase letters (first and last name initials)
 *
 * @example
 * ```typescript
 * getInitials('John Doe')
 * // => 'JD'
 *
 * getInitials('Mary Jane Watson')
 * // => 'MW' (only first and last)
 *
 * getInitials('Prince') // ⚠️ Will throw error - needs two names
 * ```
 *
 * @throws {TypeError} Implicitly throws if fullName has less than 2 words
 *
 * @see {@link generateAvatarFallback} for all-initials variant that handles any number of names
 */
export const getInitials = (fullName: string) => {
  const nameParts = fullName.split(" ");
  const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  const lastNameInitial = nameParts[1].charAt(0).toUpperCase();
  return `${firstNameInitial}${lastNameInitial}`;
};
