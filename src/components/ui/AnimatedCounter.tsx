'use client'
import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  target:    number
  duration?: number
  decimals?: number
  prefix?:   string
  suffix?:   string
  className?: string
}

export default function AnimatedCounter({
  target,
  duration = 1800,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const [value, setValue]     = useState(0)
  const frameRef              = useRef<number>(0)
  const startRef              = useRef<number>(0)
  const startValRef           = useRef(0)

  useEffect(() => {
    startValRef.current = 0
    startRef.current    = 0

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed  = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      setValue(parseFloat((startValRef.current + (target - startValRef.current) * eased).toFixed(decimals)))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration, decimals])

  return (
    <span className={className}>
      {prefix}
      {decimals > 0
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString('en-US')}
      {suffix}
    </span>
  )
}
