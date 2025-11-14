"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, useMotionValue, useTransform, animate } from "motion/react"

export interface CountAnimationProps {
  number: number
  className?: string
}

export const CountAnimation: React.FC<CountAnimationProps> = React.memo(({
  number,
  className
}) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  React.useEffect(() => {
    const animation = animate(count, number, { duration: 2 })
    return animation.stop
  }, [count, number])

  return <motion.span className={cn(className)}>{rounded}</motion.span>
})

CountAnimation.displayName = "CountAnimation"