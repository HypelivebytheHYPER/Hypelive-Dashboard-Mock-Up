/**
 * Custom Image Loader for Next.js
 *
 * This loader provides custom image optimization and loading behavior.
 * It's referenced in next.config.ts for the images.loaderFile configuration.
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js/images#loaderfile
 */

import { ImageLoaderProps } from 'next/image'

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  // For local images, use Next.js default optimization
  if (src.startsWith('/') || src.startsWith('./')) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
  }

  // For external images, return as-is
  return src
}
