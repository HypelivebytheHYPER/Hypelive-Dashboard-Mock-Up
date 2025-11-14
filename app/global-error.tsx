'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations/motion-variants'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="mesh-gradient-subtle flex min-h-screen flex-col items-center justify-center p-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-md text-center flex flex-col items-center gap-4"
          >
            <motion.div className="card-glass rounded-full p-4" variants={fadeInUp}>
              <AlertCircle className="size-12 text-destructive" />
            </motion.div>

            <motion.div className="space-y-2" variants={fadeInUp}>
              <h1 className="text-5xl font-bold font-display">Critical Error</h1>
              <p className="text-lg text-muted-foreground">
                A critical error occurred. Please try refreshing the page.
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </motion.div>

            <motion.div className="flex gap-2" variants={fadeInUp}>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-md hover:bg-accent transition-colors lift-on-hover"
              >
                <Home className="size-4" />
                Go Home
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors lift-on-hover"
              >
                <RefreshCw className="size-4" />
                Try Again
              </button>
            </motion.div>

            {process.env.NODE_ENV === 'development' && (
              <motion.details className="mt-4 w-full text-left" variants={fadeInUp}>
                <summary className="cursor-pointer text-sm font-medium transition-colors hover:text-primary">
                  Error Details (Development Only)
                </summary>
                <pre className="card-glass mt-2 rounded-md p-4 text-xs overflow-auto border border-border/50">
                  {error.stack}
                </pre>
              </motion.details>
            )}
          </motion.div>
        </div>
      </body>
    </html>
  )
}
