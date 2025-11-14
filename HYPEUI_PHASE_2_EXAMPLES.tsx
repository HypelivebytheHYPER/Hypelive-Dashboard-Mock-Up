/**
 * HypeUI Phase 2: Complete Implementation Examples
 *
 * This file demonstrates all Phase 2 features in action.
 * Copy and adapt these examples for your components.
 *
 * @requires framer-motion@^11.15.0
 */

'use client'

import { motion } from 'framer-motion'
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerContainerSlow,
  scrollReveal,
  blurIn,
  hoverEffects,
  tapEffects,
  viewportConfig,
} from '@/lib/animations/motion-variants'

/**
 * Example 1: Hero Section with Mesh Gradient & Blur In Animation
 */
export function HeroSectionExample() {
  return (
    <section className="mesh-gradient-hero min-h-screen flex items-center noise-texture relative overflow-hidden">
      <motion.div
        className="container mx-auto px-4 relative z-10"
        variants={staggerContainerSlow}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-display text-6xl lg:text-7xl mb-6 text-foreground"
          variants={blurIn}
        >
          Hypelive Dashboard
        </motion.h1>
        <motion.p
          className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl"
          variants={fadeInUp}
        >
          Professional live streaming analytics with beautiful design and smooth animations
        </motion.p>
        <motion.div className="flex gap-4" variants={fadeInUp}>
          <motion.button
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
            whileHover={hoverEffects.scale}
            whileTap={tapEffects.shrink}
          >
            Get Started
          </motion.button>
          <motion.button
            className="px-8 py-3 bg-card text-card-foreground border border-border rounded-lg font-medium"
            whileHover={hoverEffects.lift}
            whileTap={tapEffects.press}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

/**
 * Example 2: Dashboard Metrics Grid with Glass Cards & Stagger Animation
 */
export function MetricsGridExample() {
  const metrics = [
    { id: 1, label: 'Total Views', value: '2.4M', trend: '+12.5%', positive: true },
    { id: 2, label: 'Active Users', value: '48.3K', trend: '+8.2%', positive: true },
    { id: 3, label: 'Watch Time', value: '1.2M hrs', trend: '+15.7%', positive: true },
    { id: 4, label: 'Engagement', value: '89.4%', trend: '-2.1%', positive: false },
    { id: 5, label: 'Revenue', value: '$124K', trend: '+22.4%', positive: true },
    { id: 6, label: 'Subscribers', value: '156K', trend: '+31.8%', positive: true },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <motion.h2
          className="font-display text-4xl mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          Performance Overview
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.id}
              variants={fadeInUp}
              className="card-glass card-glass-hover shadow-depth-2 shadow-depth-hover rounded-lg p-6 group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </h3>
                <span
                  className={`text-sm font-medium ${
                    metric.positive ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {metric.trend}
                </span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground">
                {metric.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Example 3: Featured Card with Accent Bar & Scale In Animation
 */
export function FeaturedCardExample() {
  return (
    <section className="mesh-gradient-subtle py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="accent-bar-frost card-glass shadow-depth-3 rounded-lg overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-3xl">Premium Analytics</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Unlock advanced insights with real-time data, custom reports, and
              AI-powered recommendations. Take your live streaming to the next level.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Upgrade Now
              </motion.button>
              <motion.button
                className="px-6 py-3 border border-border rounded-lg font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Features
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Example 4: Vertical Accent Bar Callout
 */
export function CalloutExample() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="accent-bar-vertical relative pl-8 py-6"
        >
          <h3 className="font-display text-2xl mb-4">Pro Tip</h3>
          <p className="text-muted-foreground leading-relaxed">
            Combine glass morphism cards with stagger animations for maximum visual
            impact. The 0.12s delay creates a natural, cascading effect that guides
            user attention through your content.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Example 5: Interactive Card List with Scroll Reveal
 */
export function CardListExample() {
  const features = [
    {
      id: 1,
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Monitor your streams with live data updates every second.',
    },
    {
      id: 2,
      icon: '🎯',
      title: 'Audience Insights',
      description: 'Understand your viewers with detailed demographic breakdowns.',
    },
    {
      id: 3,
      icon: '🚀',
      title: 'Growth Tools',
      description: 'Optimize your content with AI-powered recommendations.',
    },
    {
      id: 4,
      icon: '💰',
      title: 'Revenue Tracking',
      description: 'Track donations, subscriptions, and sponsorship revenue.',
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <motion.h2
          className="font-display text-4xl mb-12 text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          Powerful Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              transition={{ delay: index * 0.1 }}
              className="lift-on-hover shadow-depth-1 shadow-depth-hover bg-card border border-border rounded-lg p-6"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-display text-xl mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Example 6: Modal/Dialog with Scale In
 */
export function ModalExample({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="card-glass shadow-depth-3 rounded-lg max-w-md w-full p-8"
      >
        <h2 className="font-display text-2xl mb-4">Confirm Action</h2>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to proceed? This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <motion.button
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            whileHover={hoverEffects.scale}
            whileTap={tapEffects.shrink}
            onClick={onClose}
          >
            Confirm
          </motion.button>
          <motion.button
            className="flex-1 px-4 py-2 border border-border rounded-lg"
            whileHover={hoverEffects.lift}
            whileTap={tapEffects.press}
            onClick={onClose}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

/**
 * Example 7: Full Page Layout Combining All Features
 */
export function FullPageExample() {
  return (
    <div className="min-h-screen">
      {/* Hero with Mesh Gradient */}
      <HeroSectionExample />

      {/* Metrics Grid with Glass Cards */}
      <MetricsGridExample />

      {/* Featured Card with Accent Bar */}
      <FeaturedCardExample />

      {/* Callout with Vertical Accent */}
      <CalloutExample />

      {/* Card List with Scroll Reveal */}
      <CardListExample />
    </div>
  )
}

/**
 * Usage Instructions:
 *
 * 1. Import the example you need:
 *    import { HeroSectionExample } from './HYPEUI_PHASE_2_EXAMPLES'
 *
 * 2. Add to your page:
 *    export default function Page() {
 *      return <HeroSectionExample />
 *    }
 *
 * 3. Customize colors, text, and data
 * 4. Adjust animation variants as needed
 * 5. Test across browsers and devices
 */

/**
 * CSS Classes Quick Reference:
 *
 * Backgrounds:
 * - .mesh-gradient-hero      → Atmospheric hero gradient
 * - .mesh-gradient-subtle    → Subtle section gradient
 * - .noise-texture           → Film grain overlay
 *
 * Glass Morphism:
 * - .card-glass              → Base glass effect
 * - .card-glass-hover        → Interactive glass card
 *
 * Shadows:
 * - .shadow-depth-1          → Subtle elevation
 * - .shadow-depth-2          → Medium elevation
 * - .shadow-depth-3          → High elevation
 * - .shadow-depth-hover      → Enhanced hover shadow
 *
 * Accent Bars:
 * - .accent-bar-frost        → Top gradient bar
 * - .accent-bar-vertical     → Left gradient bar
 *
 * Transitions:
 * - .transition-fast         → 0.2s duration
 * - .transition-base         → 0.4s duration
 * - .transition-slow         → 0.6s duration
 * - .transition-smooth       → Cubic-bezier easing
 * - .lift-on-hover           → Lift and scale on hover
 */
