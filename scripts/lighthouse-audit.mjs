#!/usr/bin/env node
/**
 * Lighthouse Performance Audit Script
 * Runs Lighthouse audits on production URLs and generates performance reports
 *
 * Usage:
 *   npm run lighthouse
 *   npm run lighthouse:kol-discovery
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

const PRODUCTION_URL = 'https://dashboard.hypelive.studio';

const PAGES_TO_AUDIT = [
  {
    path: '/dashboard/kol-discovery',
    name: 'KOL Discovery (Phase 1 Optimized)',
  },
  {
    path: '/dashboard/website-analytics',
    name: 'Website Analytics',
  },
  {
    path: '/dashboard/default',
    name: 'Default Dashboard',
  },
  {
    path: '/dashboard/apps/calendar',
    name: 'Calendar App (Phase 3 - Dynamic Import)',
  },
  {
    path: '/dashboard/apps/kanban',
    name: 'Kanban Board (Phase 3 - Dynamic Import)',
  },
];

const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

async function runLighthouseAudit(url, name) {
  console.log(`\n🔍 Auditing: ${name}`);
  console.log(`   URL: ${url}`);

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  try {
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      ...LIGHTHOUSE_CONFIG,
    });

    const { lhr } = runnerResult;

    // Extract key metrics
    const metrics = {
      name,
      url,
      timestamp: new Date().toISOString(),
      scores: {
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
      },
      metrics: {
        firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
        totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
        speedIndex: lhr.audits['speed-index'].numericValue,
        timeToInteractive: lhr.audits['interactive'].numericValue,
      },
    };

    return metrics;
  } finally {
    await chrome.kill();
  }
}

async function main() {
  console.log('🚀 Starting Lighthouse Performance Audit');
  console.log('================================================\n');

  const results = [];

  for (const page of PAGES_TO_AUDIT) {
    const url = `${PRODUCTION_URL}${page.path}`;
    try {
      const metrics = await runLighthouseAudit(url, page.name);
      results.push(metrics);

      console.log('\n✅ Results:');
      console.log(`   Performance: ${metrics.scores.performance}/100`);
      console.log(`   FCP: ${Math.round(metrics.metrics.firstContentfulPaint)}ms`);
      console.log(`   LCP: ${Math.round(metrics.metrics.largestContentfulPaint)}ms`);
      console.log(`   TBT: ${Math.round(metrics.metrics.totalBlockingTime)}ms`);
      console.log(`   CLS: ${metrics.metrics.cumulativeLayoutShift.toFixed(3)}`);

    } catch (error) {
      console.error(`\n❌ Error auditing ${page.name}:`, error.message);
    }
  }

  // Save results
  const reportsDir = path.join(process.cwd(), 'lighthouse-reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportsDir, `audit-${timestamp}.json`);

  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  console.log('\n\n================================================');
  console.log('✅ Lighthouse Audit Complete!');
  console.log(`📄 Report saved to: ${reportPath}`);
  console.log('\n📊 Summary:');

  results.forEach(result => {
    console.log(`\n${result.name}:`);
    console.log(`   Performance: ${result.scores.performance}/100`);
    console.log(`   LCP: ${Math.round(result.metrics.largestContentfulPaint)}ms`);
    console.log(`   TBT: ${Math.round(result.metrics.totalBlockingTime)}ms`);
  });
}

main().catch(console.error);
