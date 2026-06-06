'use client'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import AnimatedCounter from './AnimatedCounter'

interface MetricCardProps {
  title:       string
  value:       number
  prefix?:     string
  suffix?:     string
  decimals?:   number
  trend?:      number
  trendLabel?: string
  icon:        LucideIcon
  iconColor?:  string
  iconBg?:     string
  delay?:      number
  compact?:    boolean
  subValue?:   string
  live?:       boolean
}

export default function MetricCard({
  title, value, prefix = '', suffix = '', decimals = 0,
  trend, trendLabel, icon: Icon, iconColor = 'text-emerald-400',
  iconBg = 'bg-emerald-400/10', delay = 0,
  compact = false, subValue, live = false,
}: MetricCardProps) {
  const isPositive = trend !== undefined && trend >= 0
  const TrendIcon  = trend === undefined ? Minus : isPositive ? TrendingUp : TrendingDown

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
      className="glass glass-green rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/25 transition-colors duration-300"
    >
      {/* Shimmer */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
            <Icon className={cn('w-5 h-5', iconColor)} />
          </div>
          {live && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              LIVE
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className={cn('font-bold font-mono text-white', compact ? 'text-2xl' : 'text-3xl')}>
            <AnimatedCounter
              target={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
              duration={1600}
            />
          </p>
          {subValue && <p className="text-xs text-slate-500">{subValue}</p>}
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-1.5 mt-3">
            <TrendIcon className={cn('w-3.5 h-3.5', isPositive ? 'text-emerald-400' : 'text-red-400')} />
            <span className={cn('text-xs font-semibold', isPositive ? 'text-emerald-400' : 'text-red-400')}>
              {isPositive ? '+' : ''}{trend}%
            </span>
            {trendLabel && <span className="text-xs text-slate-600">{trendLabel}</span>}
          </div>
        )}
      </div>
    </motion.div>
  )
}
