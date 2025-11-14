/**
 * HypeUI Phase 2: Framer Motion Animation Variants
 *
 * Comprehensive motion system for the Hypelive Dashboard.
 * All animations use consistent easing (cubic-bezier) and timing
 * to maintain a cohesive feel across the application.
 *
 * @package framer-motion
 * @version 11.15.0
 */

import { Variants } from 'framer-motion'

/**
 * Standard easing function used throughout HypeUI
 * cubic-bezier(0.4, 0, 0.2, 1) provides smooth, natural motion
 */
const EASING = [0.4, 0, 0.2, 1] as const

/**
 * Fade In Up Animation
 * Ideal for: Cards, sections, content blocks
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={fadeInUp}
 *   initial="hidden"
 *   animate="visible"
 * >
 *   Content here
 * </motion.div>
 * ```
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING,
    },
  },
}

/**
 * Fade In Down Animation
 * Ideal for: Headers, navigation, dropdowns
 */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING,
    },
  },
}

/**
 * Scale In Animation
 * Ideal for: Modals, dialogs, tooltips, badges
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={scaleIn}
 *   initial="hidden"
 *   animate="visible"
 * >
 *   Modal content
 * </motion.div>
 * ```
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: EASING,
    },
  },
}

/**
 * Slide In Left Animation
 * Ideal for: Sidebars, side panels, drawers
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: EASING,
    },
  },
}

/**
 * Slide In Right Animation
 * Ideal for: Right sidebars, notifications
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: EASING,
    },
  },
}

/**
 * Stagger Container Animation
 * Parent container for staggered children animations
 * Delay between each child: 0.12s
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={staggerContainer}
 *   initial="hidden"
 *   animate="visible"
 * >
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={fadeInUp}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

/**
 * Stagger Container (Fast)
 * Faster stagger effect for smaller items
 * Delay between each child: 0.08s
 */
export const staggerContainerFast: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

/**
 * Stagger Container (Slow)
 * Slower stagger effect for hero sections
 * Delay between each child: 0.2s
 */
export const staggerContainerSlow: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
}

/**
 * Scroll Reveal Animation
 * Triggered when element enters viewport
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={scrollReveal}
 *   initial="hidden"
 *   whileInView="visible"
 *   viewport={{ once: true, margin: "-100px" }}
 * >
 *   Content revealed on scroll
 * </motion.div>
 * ```
 */
export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASING,
    },
  },
}

/**
 * Scale Pulse Animation
 * Subtle breathing effect for elements
 * Ideal for: Active indicators, loading states
 */
export const scalePulse: Variants = {
  hidden: {
    scale: 1,
  },
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: EASING,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
}

/**
 * Rotate In Animation
 * Ideal for: Icons, badges, status indicators
 */
export const rotateIn: Variants = {
  hidden: {
    opacity: 0,
    rotate: -10,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: EASING,
    },
  },
}

/**
 * Bounce In Animation
 * Playful entrance effect
 * Ideal for: Success messages, celebrations, notifications
 */
export const bounceIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      duration: 0.6,
    },
  },
}

/**
 * Expand Height Animation
 * Ideal for: Accordions, expandable sections
 */
export const expandHeight: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.4,
        ease: EASING,
      },
      opacity: {
        duration: 0.25,
        delay: 0.15,
      },
    },
  },
}

/**
 * Blur In Animation
 * Modern entrance with blur effect
 * Ideal for: Hero sections, overlays
 */
export const blurIn: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: EASING,
    },
  },
}

/**
 * Preset Viewport Configuration
 * Recommended settings for scroll-triggered animations
 */
export const viewportConfig = {
  once: true, // Animation triggers only once
  margin: '-100px', // Trigger 100px before element enters viewport
  amount: 0.3, // Trigger when 30% of element is visible
} as const

/**
 * Preset Hover Animations
 * Common hover effects for interactive elements
 */
export const hoverEffects = {
  lift: {
    y: -4,
    scale: 1.01,
    transition: {
      duration: 0.3,
      ease: EASING,
    },
  },
  scale: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: EASING,
    },
  },
  glow: {
    boxShadow: '0 0 20px rgba(136, 192, 208, 0.4)',
    transition: {
      duration: 0.3,
      ease: EASING,
    },
  },
} as const

/**
 * Preset Tap Animations
 * Feedback for button and interactive element clicks
 */
export const tapEffects = {
  shrink: {
    scale: 0.95,
  },
  press: {
    scale: 0.98,
    y: 1,
  },
} as const

/**
 * Preset Exit Animations
 * Consistent exit effects for all components
 */
export const exitVariants: Variants = {
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: EASING,
    },
  },
}
