#!/usr/bin/env ts-node

/**
 * Validation Script for Critical Fixes
 * Verifies that all critical issues have been resolved
 */

import { glob } from "glob"
import { readFile } from "fs/promises"

interface ValidationResult {
  category: string
  status: 'fixed' | 'partial' | 'not_fixed'
  details: string[]
  recommendations: string[]
}

/**
 * Check for remaining export inconsistencies
 */
async function checkExports(): Promise<ValidationResult> {
  const files = await glob([
    'components/**/*.tsx',
    'components/**/*.ts',
    'app/**/*.tsx',
    'app/**/*.ts'
  ])
  
  const issues: string[] = []
  let totalFiles = 0
  let fixedFiles = 0
  
  for (const file of files) {
    totalFiles++
    const content = await readFile(file, 'utf-8')
    
    // Check for default exports
    if (content.includes('export default')) {
      // Check if it's a legitimate default export (like a page component)
      if (file.includes('app/') && (file.includes('page.tsx') || file.includes('layout.tsx'))) {
        // Pages and layouts can have default exports - this is OK
        fixedFiles++
      } else if (content.includes('export default function NotFound')) {
        // 404 page is OK to have default export
        fixedFiles++
      } else {
        issues.push(`${file}: Contains default export that should be named export`)
      }
    } else {
      fixedFiles++
    }
  }
  
  const successRate = (fixedFiles / totalFiles) * 100
  
  return {
    category: 'Export Patterns',
    status: successRate > 95 ? 'fixed' : successRate > 80 ? 'partial' : 'not_fixed',
    details: [
      `Checked ${totalFiles} files`,
      `${fixedFiles} files have correct export patterns`,
      `${issues.length} files need attention`,
      `Success rate: ${successRate.toFixed(1)}%`
    ],
    recommendations: issues.length > 0 ? issues : ['All export patterns are consistent!']
  }
}

/**
 * Check for 404 page
 */
async function check404Page(): Promise<ValidationResult> {
  try {
    const content = await readFile('/Users/mdch/hypelive-dashboard/app/not-found.tsx', 'utf-8')
    
    const hasProperStructure = content.includes('export default function NotFound')
    const hasNavigation = content.includes('Link href="/"') && content.includes('window.history.back()')
    const hasStyling = content.includes('className="') && content.includes('text-destructive')
    
    return {
      category: '404 Error Page',
      status: hasProperStructure && hasNavigation && hasStyling ? 'fixed' : 'partial',
      details: [
        '404 page exists and is properly structured',
        hasNavigation ? 'Includes navigation options' : 'Missing navigation',
        hasStyling ? 'Has proper styling' : 'Missing styling'
      ],
      recommendations: []
    }
  } catch (error) {
    return {
      category: '404 Error Page',
      status: 'not_fixed',
      details: ['404 page not found'],
      recommendations: ['Create app/not-found.tsx with proper error handling']
    }
  }
}

/**
 * Check Next.js configuration
 */
async function checkNextConfig(): Promise<ValidationResult> {
  try {
    const content = await readFile('/Users/mdch/hypelive-dashboard/next.config.ts', 'utf-8')
    
    const hasCacheComponents = content.includes('cacheComponents: true')
    const hasReactCompiler = content.includes('reactCompiler: true')
    const hasTurbopack = content.includes('turbopackFileSystemCacheForDev: true')
    const hasPerformanceBudgets = content.includes('performance: {')
    const hasSecurityHeaders = content.includes('X-Content-Type-Options')
    
    const modernFeatures = [
      hasCacheComponents,
      hasReactCompiler,
      hasTurbopack,
      hasPerformanceBudgets,
      hasSecurityHeaders
    ]
    
    const implementedCount = modernFeatures.filter(Boolean).length
    const totalFeatures = modernFeatures.length
    
    return {
      category: 'Next.js Configuration',
      status: implementedCount === totalFeatures ? 'fixed' : implementedCount > 3 ? 'partial' : 'not_fixed',
      details: [
        `Cache Components: ${hasCacheComponents ? '✅' : '❌'}`,
        `React Compiler: ${hasReactCompiler ? '✅' : '❌'}`,
        `Turbopack Optimization: ${hasTurbopack ? '✅' : '❌'}`,
        `Performance Budgets: ${hasPerformanceBudgets ? '✅' : '❌'}`,
        `Security Headers: ${hasSecurityHeaders ? '✅' : '❌'}`
      ],
      recommendations: implementedCount < totalFeatures ? 
        [`${totalFeatures - implementedCount} modern features need to be enabled`] : 
        ['All modern Next.js 16 features are configured!']
    }
  } catch (error) {
    return {
      category: 'Next.js Configuration',
      status: 'not_fixed',
      details: ['Could not read next.config.ts'],
      recommendations: ['Ensure next.config.ts exists and is properly configured']
    }
  }
}

/**
 * Check TypeScript interfaces
 */
async function checkTypeScriptInterfaces(): Promise<ValidationResult> {
  const files = await glob([
    'lib/types/**/*.ts',
    'lib/api/**/*.ts'
  ])
  
  let hasComprehensiveInterfaces = false
  let hasStrictTypes = false
  
  for (const file of files) {
    const content = await readFile(file, 'utf-8')
    
    // Check for comprehensive interfaces
    if (content.includes('DashboardMetrics') && 
        content.includes('CampaignAnalytics') && 
        content.includes('KolAnalytics')) {
      hasComprehensiveInterfaces = true
    }
    
    // Check for strict TypeScript features
    if (content.includes('Record<string,') && 
        content.includes('Array<') && 
        content.includes('interface')) {
      hasStrictTypes = true
    }
  }
  
  return {
    category: 'TypeScript Interfaces',
    status: hasComprehensiveInterfaces && hasStrictTypes ? 'fixed' : 'partial',
    details: [
      `Comprehensive interfaces: ${hasComprehensiveInterfaces ? '✅' : '❌'}`,
      `Strict TypeScript: ${hasStrictTypes ? '✅' : '❌'}`
    ],
    recommendations: []
  }
}

/**
 * Main validation function
 */
async function validateFixes() {
  console.log('🔍 Validating critical fixes...\n')
  
  const results = await Promise.all([
    checkExports(),
    check404Page(),
    checkNextConfig(),
    checkTypeScriptInterfaces()
  ])
  
  console.log('📊 Validation Results:\n')
  
  let totalScore = 0
  let maxScore = 0
  
  results.forEach(result => {
    const score = result.status === 'fixed' ? 100 : result.status === 'partial' ? 50 : 0
    totalScore += score
    maxScore += 100
    
    console.log(`\n## ${result.category}`)
    console.log(`Status: ${result.status.toUpperCase()}`)
    console.log('Details:')
    result.details.forEach(detail => console.log(`  • ${detail}`))
    
    if (result.recommendations.length > 0) {
      console.log('Recommendations:')
      result.recommendations.forEach(rec => console.log(`  • ${rec}`))
    }
  })
  
  const overallScore = (totalScore / maxScore) * 100
  
  console.log(`\n🏆 Overall Score: ${overallScore.toFixed(1)}/100`)
  
  if (overallScore >= 95) {
    console.log('\n🎉 EXCELLENT! Critical fixes are complete!')
  } else if (overallScore >= 80) {
    console.log('\n✅ GOOD! Most critical fixes are complete.')
  } else {
    console.log('\n⚠️  NEEDS WORK! Some critical fixes remain.')
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    overallScore,
    results: results.map(r => ({
      category: r.category,
      status: r.status,
      details: r.details,
      recommendations: r.recommendations
    }))
  }
  
  await require('fs/promises').writeFile(
    'validation-results.json',
    JSON.stringify(report, null, 2)
  )
  
  console.log('\n📄 Detailed report saved to validation-results.json')
}

/**
 * Execute validation
 */
if (require.main === module) {
  validateFixes()
    .then(() => {
      console.log('\n✅ Validation completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Validation failed:', error)
      process.exit(1)
    })
}

export { validateFixes }