'use client'
import { motion } from 'framer-motion'
import { Cpu, TrendingUp, Zap, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Agent } from '@/lib/mock-data'
import StatusBadge from './StatusBadge'

interface AgentCardProps {
  agent:   Agent
  delay?:  number
  compact?:boolean
  onClick?:() => void
}

const COLOR_MAP: Record<string, { ring: string; text: string; bg: string; gradient: string; glow: string }> = {
  emerald: { ring: 'ring-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10', gradient: 'from-emerald-500 to-green-400',  glow: 'shadow-emerald-500/20' },
  blue:    { ring: 'ring-blue-500/30',    text: 'text-blue-400',    bg: 'bg-blue-500/10',    gradient: 'from-blue-500 to-cyan-400',     glow: 'shadow-blue-500/20' },
  purple:  { ring: 'ring-purple-500/30',  text: 'text-purple-400',  bg: 'bg-purple-500/10',  gradient: 'from-purple-500 to-violet-400', glow: 'shadow-purple-500/20' },
  amber:   { ring: 'ring-amber-500/30',   text: 'text-amber-400',   bg: 'bg-amber-500/10',   gradient: 'from-amber-500 to-orange-400',  glow: 'shadow-amber-500/20' },
  cyan:    { ring: 'ring-cyan-500/30',    text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    gradient: 'from-cyan-500 to-teal-400',     glow: 'shadow-cyan-500/20' },
  pink:    { ring: 'ring-pink-500/30',    text: 'text-pink-400',    bg: 'bg-pink-500/10',    gradient: 'from-pink-500 to-rose-400',     glow: 'shadow-pink-500/20' },
}

export default function AgentCard({ agent, delay = 0, compact = false, onClick }: AgentCardProps) {
  const c = COLOR_MAP[agent.color] ?? COLOR_MAP.emerald

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        'glass rounded-2xl border border-slate-800/60 relative overflow-hidden group transition-all duration-300',
        onClick && 'cursor-pointer',
        `hover:shadow-lg hover:${c.glow}`,
        compact ? 'p-4' : 'p-5',
      )}
    >
      {/* Top gradient bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity', c.gradient)} />

      {/* Shimmer */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={cn(
            'relative flex-shrink-0 rounded-xl flex items-center justify-center font-bold font-mono text-slate-950 shadow-lg',
            `bg-gradient-to-br ${c.gradient}`,
            compact ? 'w-9 h-9 text-xs' : 'w-11 h-11 text-sm',
          )}>
            {agent.name[0]}
            {agent.status === 'active' && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-ai-surface" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn('font-bold font-mono tracking-wider', compact ? 'text-sm' : 'text-base', c.text)}>
                {agent.name}
              </span>
              <StatusBadge status={agent.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{agent.role}</p>
          </div>

          <div className={cn('text-right flex-shrink-0')}>
            <div className={cn('font-bold font-mono', compact ? 'text-base' : 'text-lg', c.text)}>
              {agent.keyValue}
            </div>
            <div className="text-xs text-slate-600">{agent.keyMetric}</div>
          </div>
        </div>

        {!compact && (
          <>
            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
              {agent.description}
            </p>

            {/* Today stats */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {agent.todayStats.map((stat) => (
                <div key={stat.label} className={cn('rounded-lg p-2 text-center', c.bg)}>
                  <div className={cn('font-bold font-mono text-sm', c.text)}>{stat.value}</div>
                  <div className="text-xs text-slate-600 leading-tight mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Confidence bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Confidence
                </span>
                <span className={cn('font-mono font-semibold', c.text)}>{agent.confidence}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.confidence}%` }}
                  transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
                  className={cn('h-full rounded-full bg-gradient-to-r', c.gradient)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/60 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {agent.tasksToday.toLocaleString()} tasks today
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {agent.uptime}% uptime
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
