'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, TrendingUp, Users, Clock } from 'lucide-react'

const TICKS = [
  { agent: 'ARIA',  color: 'text-emerald-400', bg: 'bg-emerald-400/8',  msg: 'TechCorp Global scored 94/100 — $480K ARR qualified and routed'        },
  { agent: 'NEXUS', color: 'text-blue-400',    bg: 'bg-blue-400/8',     msg: 'Pipeline intelligence: +$240K delta detected vs prior week forecast'   },
  { agent: 'ECHO',  color: 'text-purple-400',  bg: 'bg-purple-400/8',   msg: '23-touch follow-up sequence deployed to Pinnacle Ventures — 78% open rate' },
  { agent: 'VANCE', color: 'text-amber-400',   bg: 'bg-amber-400/8',    msg: 'Q4 revenue forecast revised +12% — confidence interval narrowed to ±3%' },
  { agent: 'SIGIL', color: 'text-cyan-400',    bg: 'bg-cyan-400/8',     msg: 'Competitor price reduction detected — 8 accounts flagged for re-engagement' },
  { agent: 'FLUX',  color: 'text-pink-400',    bg: 'bg-pink-400/8',     msg: 'Deal cycle automated: 4.2 days → 18 hours — 5 workflows completed'     },
]

const LIVE_METRICS = [
  { icon: TrendingUp, label: 'Pipeline',  value: '$5.04M',  color: 'text-emerald-400' },
  { icon: Users,      label: 'Active',    value: '111 deals', color: 'text-blue-400' },
  { icon: Zap,        label: 'Qualified', value: '47 today',  color: 'text-amber-400' },
]

export default function TopBar() {
  const [tickIdx, setTickIdx]   = useState(0)
  const [clockStr, setClockStr] = useState('')

  useEffect(() => {
    const tick = () => setTickIdx(i => (i + 1) % TICKS.length)
    const t = setInterval(tick, 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setClockStr(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) +
        ' ' +
        now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      )
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  const tick = TICKS[tickIdx]

  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-4 px-6 border-b border-white/[0.04] h-9 flex-shrink-0"
      style={{ background: 'rgba(3, 7, 18, 0.96)', backdropFilter: 'blur(12px)' }}
    >
      {/* Live agent ticker — left */}
      <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
          <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        <AnimatePresence mode="wait">
          <motion.div
            key={tickIdx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 min-w-0"
          >
            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${tick.bg} ${tick.color} flex-shrink-0`}>
              {tick.agent}
            </span>
            <span className="text-[11px] text-slate-500 truncate">{tick.msg}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live metrics — center */}
      <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
        {LIVE_METRICS.map(m => {
          const Icon = m.icon
          return (
            <div key={m.label} className="flex items-center gap-1.5">
              <Icon className={`w-[11px] h-[11px] ${m.color}`} />
              <span className="text-[10px] text-slate-600">{m.label}</span>
              <span className={`text-[10px] font-mono font-semibold ${m.color}`}>{m.value}</span>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <div className="h-3 w-px bg-white/[0.06] flex-shrink-0" />

      {/* Clock — right */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Clock className="w-[11px] h-[11px] text-slate-700" />
        <span className="text-[10px] font-mono text-slate-700">{clockStr}</span>
      </div>
    </header>
  )
}
