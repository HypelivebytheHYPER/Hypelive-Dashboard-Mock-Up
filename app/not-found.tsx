'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations/motion-variants'

export default function NotFound() {
  return (
    <div className="mesh-gradient-subtle flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <motion.div
        className="mx-auto max-w-md text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Error Icon */}
        <motion.div className="mb-8" variants={fadeInUp}>
          <div className="card-glass mx-auto flex h-24 w-24 items-center justify-center rounded-full">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div className="mb-6" variants={fadeInUp}>
          <h1 className="text-8xl font-bold text-muted-foreground font-display">404</h1>
        </motion.div>

        {/* Error Message */}
        <motion.div className="mb-8 space-y-4" variants={fadeInUp}>
          <h2 className="text-2xl font-semibold tracking-tight font-display">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Helpful Links */}
        <motion.div className="mb-8 grid gap-4" variants={fadeInUp}>
          <div className="card-glass rounded-lg border border-border/50 p-4">
            <h3 className="mb-3 font-semibold font-display">Try these instead:</h3>
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
                Go to Dashboard
              </Link>
              <Link href="/dashboard/campaign-management" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Search className="h-4 w-4" />
                Browse Campaigns
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div className="flex flex-col gap-3 sm:flex-row" variants={fadeInUp}>
          <Button asChild variant="default" size="lg" className="gap-2 lift-on-hover">
            <Link href="/" className="flex items-center">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="gap-2 lift-on-hover"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </motion.div>

        {/* Additional Help */}
        <motion.div className="mt-8 text-center" variants={fadeInUp}>
          <p className="text-sm text-muted-foreground">
            Still need help?{' '}
            <Link href="/support" className="font-medium text-primary hover:underline transition-colors">
              Contact Support
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}