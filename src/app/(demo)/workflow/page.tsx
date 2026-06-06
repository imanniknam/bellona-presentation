'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, DollarSign, Zap, RefreshCw, Star, AlertTriangle } from 'lucide-react'
import { WORKFLOW_CARDS, WORKFLOW_STAGES, type WorkflowCard } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const STAGE_META: Record<string, { color: string; bg: string; border: string; count: string }> = {
  'New Leads':      { color: 'text-slate-400',   bg: 'bg-slate-500/10',   border: 'border-slate-500/20', count: '2' },
  'Qualifying':     { color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',  count: '2' },
  'Proposal Sent':  { color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20',count: '2' },
  'Negotiating':    { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20', count: '1' },
  'Closed':         { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',count: '1' },
}

const PRIORITY_MAP: Record<string, { text: string; icon: React.ElementType }> = {
  critical: { text: 'text-red-400',    icon: AlertTriangle },
  high:     { text: 'text-amber-400',  icon: Star },
  medium:   { text: 'text-blue-400',   icon: ArrowRight },
  low:      { text: 'text-slate-500',  icon: ArrowRight },
}

const AGENT_COLORS: Record<string, { text: string; bg: string }> = {
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  blue:    { text: 'text-blue-400',    bg: 'bg-blue-400/10' },
  purple:  { text: 'text-purple-400',  bg: 'bg-purple-400/10' },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-400/10' },
  pink:    { text: 'text-pink-400',    bg: 'bg-pink-400/10' },
}

// Auto-advance a random card every 12 seconds for "live" feel
const STAGE_ORDER = WORKFLOW_STAGES

function WorkflowCardItem({ card }: { card: WorkflowCard }) {
  const p  = PRIORITY_MAP[card.priority]
  const ag = AGENT_COLORS[card.agentColor] ?? AGENT_COLORS.emerald
  const PIcon = p.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="glass border border-slate-800/60 rounded-xl p-3 cursor-pointer hover:border-slate-700/80 transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-200 text-sm truncate">{card.company}</div>
          <div className="text-[10px] text-slate-600">{card.contact}</div>
        </div>
        <PIcon className={cn('w-3.5 h-3.5 flex-shrink-0 ml-2', p.text)} />
      </div>

      {/* Value + Score */}
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1 text-xs font-bold font-mono text-white">
          <DollarSign className="w-3 h-3 text-slate-500" />
          {(card.value / 1000).toFixed(0)}K
        </span>
        <span className={cn(
          'text-xs font-mono font-bold px-1.5 py-0.5 rounded',
          card.score >= 90 ? 'text-emerald-400 bg-emerald-400/10' :
          card.score >= 75 ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 bg-slate-400/10',
        )}>
          {card.score}/100
        </span>
      </div>

      {/* Last action */}
      <div className="text-[10px] text-slate-500 mb-3 truncate">{card.lastAction}</div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {card.tags.map(tag => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-500">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={cn('font-mono font-bold text-[10px] px-1.5 py-0.5 rounded', ag.bg, ag.text)}>
          {card.agent}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-slate-600">
          <Clock className="w-3 h-3" />
          {card.due}
        </span>
      </div>
    </motion.div>
  )
}

export default function WorkflowPage() {
  const [cards, setCards] = useState<WorkflowCard[]>(WORKFLOW_CARDS)
  const [moveLog, setMoveLog] = useState<string[]>([])
  const [totalMoved, setTotalMoved] = useState(0)

  // Auto-advance a random card every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const eligible = prev.filter(c => {
          const idx = STAGE_ORDER.indexOf(c.stage)
          return idx < STAGE_ORDER.length - 1
        })
        if (!eligible.length) return prev

        const card  = eligible[Math.floor(Math.random() * eligible.length)]
        const curIdx = STAGE_ORDER.indexOf(card.stage)
        const next  = STAGE_ORDER[curIdx + 1]

        setMoveLog(log => [
          `${card.agent} → ${card.company} moved to "${next}"`,
          ...log.slice(0, 4),
        ])
        setTotalMoved(n => n + 1)

        return prev.map(c => c.id === card.id ? { ...c, stage: next } : c)
      })
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const getStageCards = (stage: string) => cards.filter(c => c.stage === stage)
  const totalValue = cards.reduce((s, c) => s + c.value, 0)

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Live Workflow</h1>
          <p className="text-slate-500 text-sm">AI-managed deal pipeline · Cards auto-advance as agents work</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass border border-emerald-500/20 rounded-xl px-4 py-2">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-xs text-emerald-400 font-semibold">Auto-Advancing</span>
          </div>
          <div className="glass border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-400 font-mono">
            ${(totalValue / 1_000_000).toFixed(1)}M total
          </div>
        </div>
      </motion.div>

      {/* Move log ticker */}
      <AnimatePresence>
        {moveLog.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 glass border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-3 max-w-2xl"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs text-emerald-400 font-mono">{moveLog[0]}</span>
            <span className="text-xs text-slate-600 ml-auto">{totalMoved} auto-advance{totalMoved !== 1 ? 's' : ''}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban board */}
      <div className="grid grid-cols-5 gap-4 overflow-x-auto">
        {WORKFLOW_STAGES.map((stage) => {
          const meta    = STAGE_META[stage]
          const stageCards = getStageCards(stage)
          const stageValue = stageCards.reduce((s, c) => s + c.value, 0)

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: WORKFLOW_STAGES.indexOf(stage) * 0.07 }}
              className="flex flex-col min-w-[200px]"
            >
              {/* Column header */}
              <div className={cn('rounded-xl px-3 py-2.5 border mb-3', meta.bg, meta.border)}>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-xs font-bold', meta.color)}>{stage}</span>
                  <span className={cn('text-xs font-mono font-bold', meta.color)}>
                    {stageCards.length}
                  </span>
                </div>
                <div className={cn('text-[10px] font-mono', meta.color, 'opacity-70')}>
                  ${(stageValue / 1000).toFixed(0)}K
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 flex-1">
                <AnimatePresence>
                  {stageCards.map(card => (
                    <WorkflowCardItem key={card.id} card={card} />
                  ))}
                </AnimatePresence>

                {stageCards.length === 0 && (
                  <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center text-[10px] text-slate-700">
                    No deals
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
      >
        {[
          { label: 'Total Deals',    value: cards.length.toString(),                   color: 'text-white' },
          { label: 'Pipeline Value', value: `$${(totalValue / 1_000_000).toFixed(1)}M`, color: 'text-emerald-400' },
          { label: 'Auto-Advances',  value: totalMoved.toString(),                      color: 'text-blue-400' },
          { label: 'Avg Deal Score', value: `${Math.round(cards.reduce((s, c) => s + c.score, 0) / cards.length)}/100`, color: 'text-amber-400' },
        ].map(stat => (
          <div key={stat.label} className="glass border border-slate-800/60 rounded-xl p-4 text-center">
            <div className={cn('text-xl font-bold font-mono', stat.color)}>{stat.value}</div>
            <div className="text-xs text-slate-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
