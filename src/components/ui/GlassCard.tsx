'use client'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type GlowColor = 'green' | 'blue' | 'purple' | 'amber' | 'cyan' | 'pink' | 'none'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children:   React.ReactNode
  className?: string
  glow?:      GlowColor
  hover?:     boolean
  delay?:     number
  padding?:   boolean
  border?:    boolean
}

const glowMap: Record<GlowColor, string> = {
  green:  'glass-green',
  blue:   'glass-blue',
  purple: 'glass-purple',
  amber:  'glass-amber',
  cyan:   'shadow-[0_0_40px_rgba(6,182,212,0.08)] border-cyan-500/15',
  pink:   'shadow-[0_0_40px_rgba(236,72,153,0.08)] border-pink-500/15',
  none:   'border-slate-800/60',
}

export default function GlassCard({
  children,
  className,
  glow = 'none',
  hover = false,
  delay = 0,
  padding = true,
  border = true,
  ...rest
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'glass rounded-2xl',
        border && glowMap[glow],
        padding && 'p-5',
        hover && 'cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
