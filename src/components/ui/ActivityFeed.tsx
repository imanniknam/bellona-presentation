'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, AlertTriangle, Mail, BarChart3, Eye, CheckSquare, TrendingUp, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACTIVITY_FEED, type ActivityItem } from '@/lib/mock-data'

const ICON_MAP: Record<string, React.ElementType> = {
  star:    Star,
  alert:   AlertTriangle,
  mail:    Mail,
  chart:   BarChart3,
  eye:     Eye,
  task:    CheckSquare,
  deal:    TrendingUp,
  default: Zap,
}

const COLOR_MAP: Record<string, { text: string; bg: string; border: string }> = {
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  blue:    { text: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20' },
  purple:  { text: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/20' },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20' },
  cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/20' },
  pink:    { text: 'text-pink-400',    bg: 'bg-pink-400/10',    border: 'border-pink-400/20' },
}

// Extra synthetic items for the auto-rotation
const EXTRA_ITEMS: ActivityItem[] = [
  { id: 'e1', agent: 'ARIA',  agentColor: 'emerald', action: 'New ICP match detected',          detail: 'Apex Technologies: 94/100 lead score. Budget confirmed $500K+.', time: 'Just now', icon: 'star', type: 'lead' },
  { id: 'e2', agent: 'NEXUS', agentColor: 'blue',    action: 'Deal velocity alert',             detail: 'InnovateCo advancing 2x faster than average. Accelerate closing.', time: 'Just now', icon: 'deal', type: 'deal' },
  { id: 'e3', agent: 'ECHO',  agentColor: 'purple',  action: 'A/B test winner identified',      detail: '"ROI-first" subject line outperforming control by 34%. Deploying.', time: 'Just now', icon: 'mail', type: 'communication' },
  { id: 'e4', agent: 'SIGIL', agentColor: 'cyan',    action: 'Competitor weakness detected',    detail: 'Rival product down 2h. 14 of their customers visiting your pricing.', time: 'Just now', icon: 'eye', type: 'insight' },
  { id: 'e5', agent: 'VANCE', agentColor: 'amber',   action: 'Q3 target exceeded early',        detail: 'Revenue $467K closes Q3 12% above target. Board deck updated.', time: 'Just now', icon: 'chart', type: 'insight' },
  { id: 'e6', agent: 'FLUX',  agentColor: 'pink',    action: 'Workflow bottleneck resolved',    detail: 'Automated proposal approval cuts deal cycle from 4d → 18h.', time: 'Just now', icon: 'task', type: 'task' },
]

interface ActivityFeedProps {
  maxItems?:  number
  autoUpdate?: boolean
  compact?:   boolean
  className?: string
}

export default function ActivityFeed({
  maxItems = 8, autoUpdate = true, compact = false, className,
}: ActivityFeedProps) {
  const allItems = [...ACTIVITY_FEED, ...EXTRA_ITEMS]
  const [items, setItems] = useState<ActivityItem[]>(() =>
    ACTIVITY_FEED.slice(0, maxItems).map((i, idx) => ({
      ...i,
      time: idx === 0 ? 'Just now' : `${idx * 3 + 2}s ago`,
    }))
  )

  useEffect(() => {
    if (!autoUpdate) return
    let cursor = 0
    const interval = setInterval(() => {
      const next = EXTRA_ITEMS[cursor % EXTRA_ITEMS.length]
      cursor++
      setItems(prev => [
        { ...next, id: `live-${Date.now()}`, time: 'Just now' },
        ...prev.map(i => ({ ...i, time: advanceTime(i.time) })).slice(0, maxItems - 1),
      ])
    }, 4500)
    return () => clearInterval(interval)
  }, [autoUpdate, maxItems])

  return (
    <div className={cn('space-y-2', className)}>
      <AnimatePresence mode="popLayout">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? ICON_MAP.default
          const c    = COLOR_MAP[item.agentColor] ?? COLOR_MAP.emerald
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -12, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 12, height: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                'flex gap-3 p-3 rounded-xl border transition-all duration-200 hover:border-slate-700/80',
                'bg-slate-900/40 border-slate-800/50',
                item.time === 'Just now' && 'border-emerald-500/20 bg-emerald-500/[0.03]',
              )}
            >
              {/* Agent badge */}
              <div className="flex-shrink-0 pt-0.5">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', c.bg)}>
                  <Icon className={cn('w-3.5 h-3.5', c.text)} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn('font-mono font-bold text-xs', c.text)}>
                    {item.agent}
                  </span>
                  <span className="text-xs text-slate-400 font-medium truncate">{item.action}</span>
                  {item.time === 'Just now' && (
                    <span className="flex-shrink-0 text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">NEW</span>
                  )}
                </div>
                {!compact && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">{item.detail}</p>
                )}
              </div>

              <span className="flex-shrink-0 text-xs text-slate-700 self-start pt-0.5 whitespace-nowrap">{item.time}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function advanceTime(time: string): string {
  if (time === 'Just now') return '5s ago'
  const match = time.match(/^(\d+)(s|m|h) ago$/)
  if (!match) return time
  const [, n, unit] = match
  const num = parseInt(n)
  if (unit === 's') {
    if (num + 5 >= 60) return '1m ago'
    return `${num + 5}s ago`
  }
  if (unit === 'm') {
    if (num + 1 >= 60) return '1h ago'
    return `${num + 1}m ago`
  }
  return time
}
