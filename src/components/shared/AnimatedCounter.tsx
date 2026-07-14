"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type AnimatedCounterProps = {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
};

export function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const prefersReduced = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.35,
  });

  const idleValue = `${prefix}${(0).toFixed(decimals)}${suffix}`;
  const finalValue = `${prefix}${end.toFixed(decimals)}${suffix}`;

  return (
    <span ref={ref} className={cn("statistic-number tabular-nums", className)}>
      {prefersReduced ? (
        finalValue
      ) : inView ? (
        <CountUp
          start={0}
          end={end}
          duration={duration}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          separator=","
        />
      ) : (
        idleValue
      )}
    </span>
  );
}
