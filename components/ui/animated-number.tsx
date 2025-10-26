"use client";

/**
 * Minimal client component for animated numbers
 * Extracts only the interactive/animation part to reduce bundle size
 */

import NumberTicker from "@/components/magic-ui/number-ticker";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedNumber({ value, className, prefix, suffix }: AnimatedNumberProps) {
  return (
    <span className={className}>
      {prefix}
      <NumberTicker value={value} />
      {suffix}
    </span>
  );
}

interface AnimatedPercentageProps {
  value: number;
  className?: string;
}

export function AnimatedPercentage({ value, className }: AnimatedPercentageProps) {
  return (
    <span className={className}>
      <NumberTicker value={Math.round(value)} />%
    </span>
  );
}
