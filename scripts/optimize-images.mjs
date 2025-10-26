#!/usr/bin/env node
/**
 * Image Optimization Script
 * Optimizes PNG, JPG, and JPEG images in the public directory
 * Converts to WebP format for better compression
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const IMAGE_QUALITY = 80;
const WEBP_QUALITY = 85;

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, ext);
  const dirName = path.dirname(filePath);

  // Skip SVG files
  if (ext === '.svg') {
    console.log(`⏭️  Skipping SVG: ${path.relative(PUBLIC_DIR, filePath)}`);
    return;
  }

  try {
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;

    console.log(`\n🔍 Processing: ${path.relative(PUBLIC_DIR, filePath)}`);
    console.log(`   Original size: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Optimize original format
    let optimized;
    if (ext === '.png') {
      optimized = await image
        .png({ quality: IMAGE_QUALITY, compressionLevel: 9 })
        .toBuffer();
    } else if (ext === '.jpg' || ext === '.jpeg') {
      optimized = await image
        .jpeg({ quality: IMAGE_QUALITY, mozjpeg: true })
        .toBuffer();
    }

    // Write optimized original format
    if (optimized) {
      fs.writeFileSync(filePath, optimized);
      const newSize = optimized.length;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      console.log(`   ✅ Optimized ${ext}: ${(newSize / 1024 / 1024).toFixed(2)}MB (-${savings}%)`);
    }

    // Create WebP version
    const webpPath = path.join(dirName, `${fileName}.webp`);
    await sharp(filePath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);

    const webpStats = fs.statSync(webpPath);
    const webpSavings = ((originalSize - webpStats.size) / originalSize * 100).toFixed(1);
    console.log(`   ✅ Created WebP: ${(webpStats.size / 1024 / 1024).toFixed(2)}MB (-${webpSavings}%)`);

  } catch (error) {
    console.error(`   ❌ Error processing ${filePath}:`, error.message);
  }
}

async function findImages(dir) {
  const files = fs.readdirSync(dir);
  const images = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      images.push(...await findImages(filePath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        images.push(filePath);
      }
    }
  }

  return images;
}

async function main() {
  console.log('🚀 Image Optimization Script');
  console.log('============================\n');

  const images = await findImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to optimize\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const image of images) {
    const beforeSize = fs.statSync(image).size;
    await optimizeImage(image);
    const afterSize = fs.statSync(image).size;

    totalOriginalSize += beforeSize;
    totalOptimizedSize += afterSize;
  }

  console.log('\n============================');
  console.log('✅ Optimization Complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   Images processed: ${images.length}`);
  console.log(`   Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Total savings: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%`);
  console.log(`   Savings: ${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)}MB`);
}

main().catch(console.error);
