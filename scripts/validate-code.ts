#!/usr/bin/env ts-node

/**
 * Code Validation and Standardization Script
 * Ensures all React components follow consistent patterns and clean code principles
 */

import { glob } from "glob"
import { readFile, writeFile } from "fs/promises"
import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import generate from "@babel/generator"
import * as t from "@babel/types"

interface ValidationResult {
  file: string
  issues: ValidationIssue[]
  fixed: boolean
}

interface ValidationIssue {
  type: 'import' | 'export' | 'interface' | 'naming' | 'structure'
  severity: 'error' | 'warning' | 'info'
  message: string
  line?: number
  column?: number
}

// Component validation rules
const VALIDATION_RULES = {
  IMPORTS: {
    // Enforce named imports for React
    react: {
      required: ['useState', 'useEffect', 'useCallback', 'useMemo', 'memo'],
      forbidden: ['* as React']
    },
    // Enforce consistent import patterns
    patterns: {
      components: /^@\/components/,
      utils: /^@\/lib\/utils/,
      types: /^@\/types/
    }
  },
  EXPORTS: {
    // Enforce named exports
    namedOnly: true,
    // Required exports for components
    componentExports: ['ComponentName', 'ComponentNameProps', 'ComponentNameVariants']
  },
  INTERFACES: {
    // All components must have explicit interfaces
    required: true,
    // Standard interface pattern
    pattern: /^ComponentNameProps$/
  },
  NAMING: {
    // File naming convention
    files: /^[a-z-]+\.(tsx?|ts)$/,
    // Component naming convention
    components: /^[A-Z][a-zA-Z]*$/,
    // Interface naming convention
    interfaces: /^[A-Z][a-zA-Z]*Props$/
  },
  STRUCTURE: {
    // Required component structure
    elements: [
      'interface ComponentNameProps',
      'export const ComponentName = React.forwardRef',
      'ComponentName.displayName = "ComponentName"'
    ]
  }
}

/**
 * Validate a single component file
 */
async function validateComponentFile(filePath: string): Promise<ValidationResult> {
  const content = await readFile(filePath, 'utf-8')
  const issues: ValidationIssue[] = []
  
  try {
    // Parse the file
    const ast = parse(content, {
      sourceType: "module",
      plugins: ["typescript", "jsx"]
    })

    // Check imports
    const importIssues = checkImports(ast, filePath)
    issues.push(...importIssues)

    // Check exports
    const exportIssues = checkExports(ast, filePath)
    issues.push(...exportIssues)

    // Check interfaces
    const interfaceIssues = checkInterfaces(ast, filePath)
    issues.push(...interfaceIssues)

    // Check naming conventions
    const namingIssues = checkNaming(ast, filePath)
    issues.push(...namingIssues)

    // Check component structure
    const structureIssues = checkStructure(ast, filePath)
    issues.push(...structureIssues)

    // Apply fixes if possible
    const fixed = await applyFixes(filePath, ast, issues)

    return {
      file: filePath,
      issues,
      fixed
    }

  } catch (error) {
    return {
      file: filePath,
      issues: [{
        type: 'structure',
        severity: 'error',
        message: `Failed to parse file: ${error instanceof Error ? error.message : String(error)}`
      }],
      fixed: false
    }
  }
}

/**
 * Check import statements
 */
function checkImports(ast: any, filePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const reactImports: string[] = []
  
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value
      const specifiers = path.node.specifiers
      
      // Check React imports
      if (source === 'react') {
        specifiers.forEach(spec => {
          if (t.isImportNamespaceSpecifier(spec)) {
            issues.push({
              type: 'import',
              severity: 'error',
              message: 'Use named imports instead of wildcard import for React',
              line: spec.loc?.start.line,
              column: spec.loc?.start.column
            })
          } else if (t.isImportDefaultSpecifier(spec)) {
            reactImports.push(spec.local.name)
          } else if (t.isImportSpecifier(spec)) {
            reactImports.push((spec.imported as t.Identifier).name)
          }
        })
      }
      
      // Check for required React hooks
      if (source === 'react') {
        const hasRequiredHooks = VALIDATION_RULES.IMPORTS.react.required.every(hook => 
          specifiers.some(spec => 
            t.isImportSpecifier(spec) && (spec.imported as t.Identifier).name === hook
          )
        )
        
        if (!hasRequiredHooks) {
          issues.push({
            type: 'import',
            severity: 'warning',
            message: 'Component should import required React hooks',
            line: path.node.loc?.start.line
          })
        }
      }
    }
  })
  
  return issues
}

/**
 * Check export statements
 */
function checkExports(ast: any, filePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  let hasDefaultExport = false
  let hasNamedExports = false
  
  traverse(ast, {
    ExportDefaultDeclaration() {
      hasDefaultExport = true
    },
    ExportNamedDeclaration() {
      hasNamedExports = true
    }
  })
  
  if (hasDefaultExport && VALIDATION_RULES.EXPORTS.namedOnly) {
    issues.push({
      type: 'export',
      severity: 'error',
      message: 'Use named exports instead of default exports for better tree-shaking'
    })
  }
  
  if (!hasNamedExports) {
    issues.push({
      type: 'export',
      severity: 'warning',
      message: 'Component should export named exports'
    })
  }
  
  return issues
}

/**
 * Check interface definitions
 */
function checkInterfaces(ast: any, filePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  let hasComponentInterface = false
  
  traverse(ast, {
    TSInterfaceDeclaration(path) {
      const interfaceName = path.node.id.name
      if (interfaceName.endsWith('Props')) {
        hasComponentInterface = true
      }
    }
  })
  
  if (!hasComponentInterface && VALIDATION_RULES.INTERFACES.required) {
    issues.push({
      type: 'interface',
      severity: 'error',
      message: 'Component must have a TypeScript interface for props'
    })
  }
  
  return issues
}

/**
 * Check naming conventions
 */
function checkNaming(ast: any, filePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const fileName = filePath.split('/').pop() || ''
  
  // Check file naming
  if (!VALIDATION_RULES.NAMING.files.test(fileName)) {
    issues.push({
      type: 'naming',
      severity: 'warning',
      message: `File name should follow kebab-case convention: ${fileName}`
    })
  }
  
  // Check component naming
  traverse(ast, {
    FunctionDeclaration(path) {
      if (path.node.id && !path.node.id.name.match(VALIDATION_RULES.NAMING.components)) {
        issues.push({
          type: 'naming',
          severity: 'warning',
          message: `Function name should follow PascalCase convention: ${path.node.id.name}`
        })
      }
    },
    VariableDeclarator(path) {
      if (path.node.id.type === 'Identifier' && 
          !path.node.id.name.match(VALIDATION_RULES.NAMING.components) &&
          path.parent.type === 'VariableDeclaration' &&
          path.parent.declarations.length === 1) {
        issues.push({
          type: 'naming',
          severity: 'warning',
          message: `Component name should follow PascalCase convention: ${path.node.id.name}`
        })
      }
    }
  })
  
  return issues
}

/**
 * Check component structure
 */
function checkStructure(ast: any, filePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  
  // Check for React.forwardRef usage
  let hasForwardRef = false
  let hasDisplayName = false
  
  traverse(ast, {
    CallExpression(path) {
      if (t.isMemberExpression(path.node.callee) &&
          t.isIdentifier(path.node.callee.object, { name: 'React' }) &&
          t.isIdentifier(path.node.callee.property, { name: 'forwardRef' })) {
        hasForwardRef = true
      }
    },
    AssignmentExpression(path) {
      if (t.isMemberExpression(path.node.left) &&
          t.isIdentifier(path.node.left.property, { name: 'displayName' })) {
        hasDisplayName = true
      }
    }
  })
  
  if (!hasForwardRef) {
    issues.push({
      type: 'structure',
      severity: 'info',
      message: 'Consider using React.forwardRef for better ref handling'
    })
  }
  
  if (!hasDisplayName) {
    issues.push({
      type: 'structure',
      severity: 'info',
      message: 'Consider adding displayName for better debugging'
    })
  }
  
  return issues
}

/**
 * Apply fixes to the AST
 */
async function applyFixes(filePath: string, ast: any, issues: ValidationIssue[]): Promise<boolean> {
  let modified = false
  
  for (const issue of issues) {
    if (issue.severity === 'error') {
      switch (issue.type) {
        case 'import':
          modified = fixImports(ast) || modified
          break
        case 'export':
          modified = fixExports(ast) || modified
          break
        case 'interface':
          modified = fixInterfaces(ast, filePath) || modified
          break
      }
    }
  }
  
  if (modified) {
    const { code } = generate(ast, {
      retainLines: true,
      compact: false
    })
    
    await writeFile(filePath, code)
    logger.info(`Applied fixes to ${filePath}`)
  }
  
  return modified
}

/**
 * Fix import statements
 */
function fixImports(ast: any): boolean {
  let modified = false
  
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value
      
      if (source === 'react') {
        // Convert wildcard import to named imports
        const specifiers = path.node.specifiers
        const hasWildcard = specifiers.some(spec => t.isImportNamespaceSpecifier(spec))
        
        if (hasWildcard) {
          // Create new named imports
          const namedImports = [
            t.importSpecifier(t.identifier('useState'), t.identifier('useState')),
            t.importSpecifier(t.identifier('useEffect'), t.identifier('useEffect')),
            t.importSpecifier(t.identifier('useCallback'), t.identifier('useCallback')),
            t.importSpecifier(t.identifier('useMemo'), t.identifier('useMemo')),
            t.importSpecifier(t.identifier('memo'), t.identifier('memo'))
          ]
          
          path.node.specifiers = namedImports
          modified = true
        }
      }
    }
  })
  
  return modified
}

/**
 * Fix export statements
 */
function fixExports(ast: any): boolean {
  let modified = false
  
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      // Convert default export to named export
      const declaration = path.node.declaration
      
      if (t.isFunctionDeclaration(declaration) && declaration.id) {
        const functionName = declaration.id.name
        
        // Create named function declaration
        const namedDeclaration = t.functionDeclaration(
          declaration.id,
          declaration.params,
          declaration.body
        )
        
        // Create named export
        const namedExport = t.exportNamedDeclaration(namedDeclaration)
        
        // Replace default export with named export
        path.replaceWith(namedExport)
        modified = true
      }
    }
  })
  
  return modified
}

/**
 * Fix interface definitions
 */
function fixInterfaces(ast: any, filePath: string): boolean {
  let modified = false
  const componentName = extractComponentName(filePath)
  
  if (!componentName) return modified
  
  // Check if interface already exists
  let hasInterface = false
  traverse(ast, {
    TSInterfaceDeclaration(path) {
      hasInterface = true
    }
  })
  
  if (!hasInterface) {
    // Create standard interface
    const interfaceDecl = t.tsInterfaceDeclaration(
      t.identifier(`${componentName}Props`),
      null,
      [
        t.tsExpressionWithTypeArguments(
          t.memberExpression(
            t.memberExpression(t.identifier('React'), t.identifier('ComponentPropsWithoutRef')),
            t.identifier('"div"')
          )
        )
      ],
      t.tsInterfaceBody([
        t.tsPropertySignature(
          t.identifier('className'),
          t.tsTypeAnnotation(t.tsStringKeyword())
        ),
        t.tsPropertySignature(
          t.identifier('children'),
          t.tsTypeAnnotation(t.tsArrayType(t.tsAnyKeyword()))
        )
      ])
    )
    
    // Add interface at the top of the file
    const program = ast.program
    program.body.unshift(interfaceDecl)
    modified = true
  }
  
  return modified
}

/**
 * Extract component name from file path
 */
function extractComponentName(filePath: string): string | null {
  const fileName = filePath.split('/').pop()?.replace(/\.(tsx?|ts)$/, '')
  if (!fileName) return null
  
  // Convert kebab-case to PascalCase
  return fileName.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('')
}

/**
 * Main validation function
 */
async function validateComponents() {
  console.log('🚀 Starting component validation and standardization...')
  
  // Find all component files
  const componentFiles = await glob([
    'components/**/*.tsx',
    'components/**/*.ts',
    'app/**/*.tsx',
    'app/**/*.ts'
  ], {
    ignore: [
      '**/node_modules/**',
      '**/*.test.*',
      '**/*.spec.*'
    ]
  })
  
  console.log(`📁 Found ${componentFiles.length} component files to validate`)
  
  const results: ValidationResult[] = []
  let totalIssues = 0
  let totalFixed = 0
  
  // Process each file
  for (const file of componentFiles) {
    console.log(`🔍 Validating ${file}...`)
    
    const result = await validateComponentFile(file)
    results.push(result)
    
    totalIssues += result.issues.length
    if (result.fixed) totalFixed++
    
    if (result.issues.length > 0) {
      console.log(`❌ Found ${result.issues.length} issues in ${file}`)
      result.issues.forEach(issue => {
        console.log(`  ${issue.severity}: ${issue.message}`)
      })
    } else {
      console.log(`✅ ${file} passed validation`)
    }
  }
  
  // Generate report
  console.log('\n📊 Validation Report:')
  console.log(`Total files validated: ${results.length}`)
  console.log(`Total issues found: ${totalIssues}`)
  console.log(`Total files fixed: ${totalFixed}`)
  
  const severityCounts = results.reduce((acc, result) => {
    result.issues.forEach(issue => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)
  
  console.log('\nIssue breakdown by severity:')
  Object.entries(severityCounts).forEach(([severity, count]) => {
    console.log(`  ${severity}: ${count}`)
  })
  
  const typeCounts = results.reduce((acc, result) => {
    result.issues.forEach(issue => {
      acc[issue.type] = (acc[issue.type] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)
  
  console.log('\nIssue breakdown by type:')
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`)
  })
  
  console.log('\n✨ Component validation and standardization complete!')
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.length,
      totalIssues,
      totalFixed,
      severityCounts,
      typeCounts
    },
    results: results.map(result => ({
      file: result.file,
      issueCount: result.issues.length,
      fixed: result.fixed,
      issues: result.issues
    }))
  }
  
  await writeFile('validation-report.json', JSON.stringify(report, null, 2))
  console.log('\n📄 Detailed report saved to validation-report.json')
}

/**
 * Main execution
 */
if (require.main === module) {
  validateComponents()
    .then(() => {
      console.log('✅ Code validation completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Code validation failed:', error)
      process.exit(1)
    })
}

export { validateComponents, validateComponentFile, VALIDATION_RULES }