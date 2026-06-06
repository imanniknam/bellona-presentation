'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cpu, CheckCircle2, Zap, TrendingUp } from 'lucide-react'
import { AGENTS, type Agent } from '@/lib/mock-data'
import StatusBadge from '@/components/ui/StatusBadge'
import { cn } from '@/lib/utils'

const COLOR_MAP: Record<string, { from: string; to: string; text: string; bg: string; glow: string; ring: string }> = {
  emerald: { from: 'from-emerald-500', to: 'to-green-400',  text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/30', ring: 'ring-emerald-500/30' },
  blue:    { from: 'from-blue-500',    to: 'to-cyan-400',   text: 'text-blue-400',    bg: 'bg-blue-500/10',    glow: 'shadow-blue-500/30',    ring: 'ring-blue-500/30' },
  purple:  { from: 'from-purple-500',  to: 'to-violet-400', text: 'text-purple-400',  bg: 'bg-purple-500/10',  glow: 'shadow-purple-500/30',  ring: 'ring-purple-500/30' },
  amber:   { from: 'from-amber-500',   to: 'to-orange-400', text: 'text-amber-400',   bg: 'bg-amber-500/10',   glow: 'shadow-amber-500/30',   ring: 'ring-amber-500/30' },
  cyan:    { from: 'from-cyan-500',    to: 'to-teal-400',   text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    glow: 'shadow-cyan-500/30',    ring: 'ring-cyan-500/30' },
  pink:    { from: 'from-pink-500',    to: 'to-rose-400',   text: 'text-pink-400',    bg: 'bg-pink-500/10',    glow: 'shadow-pink-500/30',    ring: 'ring-pink-500/30' },
}

function AgentNode({ agent, index, onSelect }: { agent: Agent; index: number; onSelect: (a: Agent) => void }) {
  const c = COLOR_MAP[agent.color]
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, scale: 1.03 }}
      onClick={() => onSelect(agent)}
      className={cn(
        'relative glass border border-slate-700/60 rounded-2xl p-4 cursor-pointer transition-all duration-300',
        `hover:shadow-xl hover:${c.glow} hover:border-${agent.color}-500/30`,
      )}
    >
      {/* Top accent bar */}
      <div className={cn('absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r', c.from, c.to)} />

      {/* Connector line from top */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-slate-600/60 to-slate-700/30" />

      <div className="flex flex-col items-center text-center gap-2">
        <div className={cn(
          'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center font-bold font-mono text-xl text-slate-950 shadow-lg ring-2',
          c.from, c.to, c.ring,
        )}>
          {agent.name[0]}
        </div>

        <div>
          <div className={cn('font-bold font-mono tracking-wider text-sm', c.text)}>{agent.name}</div>
          <div className="text-xs text-slate-500 mt-0.5 leading-tight">{agent.role}</div>
        </div>

        <StatusBadge status={agent.status} />

        <div className={cn('text-sm font-bold font-mono', c.text)}>{agent.keyValue}</div>
        <div className="text-[10px] text-slate-600">{agent.keyMetric}</div>

        {/* Confidence mini bar */}
        <div className="w-full mt-1">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${agent.confidence}%` }}
              transition={{ duration: 1.2, delay: 0.6 + index * 0.08 }}
              className={cn('h-full rounded-full bg-gradient-to-r', c.from, c.to)}
            />
          </div>
          <div className="text-[10px] text-slate-700 mt-1">{agent.confidence}% confidence</div>
        </div>
      </div>
    </motion.div>
  )
}

function AgentDetailPanel({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const c = COLOR_MAP[agent.color]
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="fixed right-0 top-0 h-full w-96 glass border-l border-slate-700/60 p-6 z-50 overflow-y-auto"
      style={{ background: 'rgba(4, 9, 20, 0.97)', backdropFilter: 'blur(20px)' }}
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
        <X className="w-5 h-5" />
      </button>

      <div className="space-y-5 mt-2">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center font-bold font-mono text-xl text-slate-950 shadow-lg flex-shrink-0', c.from, c.to)}>
            {agent.name[0]}
          </div>
          <div>
            <div className={cn('font-bold font-mono text-lg tracking-wider', c.text)}>{agent.name}</div>
            <div className="text-xs text-slate-400">{agent.fullName}</div>
            <StatusBadge status={agent.status} className="mt-2" />
          </div>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">{agent.description}</p>

        {/* Key metric */}
        <div className={cn('rounded-xl p-4 border', c.bg, `border-${agent.color}-500/20`)}>
          <div className={cn('text-2xl font-bold font-mono', c.text)}>{agent.keyValue}</div>
          <div className="text-xs text-slate-500 mt-1">{agent.keyMetric}</div>
        </div>

        {/* Today stats */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Today's Stats</h4>
          <div className="grid grid-cols-2 gap-2">
            {agent.todayStats.map(stat => (
              <div key={stat.label} className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
                <div className={cn('font-bold font-mono text-base', c.text)}>{stat.value}</div>
                <div className="text-xs text-slate-600 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.map(cap => (
              <span key={cap} className={cn('text-xs px-2.5 py-1 rounded-lg font-medium', c.bg, c.text)}>
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* System stats */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">System Health</h4>
          <div className="space-y-3">
            {[
              { label: 'Confidence',    value: agent.confidence, suffix: '%', color: c.from + ' ' + c.to },
              { label: 'Uptime',        value: agent.uptime,     suffix: '%', color: 'from-emerald-500 to-green-400' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">{m.label}</span>
                  <span className={cn('font-mono font-bold', c.text)}>{m.value}{m.suffix}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={cn('h-full rounded-full bg-gradient-to-r', m.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-800/60 text-xs text-slate-600">
          <Zap className="w-3.5 h-3.5" />
          <span>{agent.tasksToday.toLocaleString()} tasks completed today</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function OrgChartPage() {
  const [selected, setSelected] = useState<Agent | null>(null)

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-1">Agent Organization Chart</h1>
        <p className="text-slate-500 text-sm">AI department hierarchy · Click any agent to view full profile</p>
      </motion.div>

      {/* Chart */}
      <div className="flex flex-col items-center gap-0">

        {/* CEO */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-slate-700/60 rounded-2xl px-8 py-4 text-center"
        >
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">You</div>
          <div className="text-base font-bold text-white">Chief Revenue Officer</div>
          <div className="text-xs text-slate-500 mt-1">Strategic oversight & final decisions</div>
        </motion.div>

        {/* Connector */}
        <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-slate-700" />

        {/* AI Dept node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass border border-emerald-500/25 rounded-2xl px-10 py-4 text-center shadow-lg shadow-emerald-500/10"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
              <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs text-emerald-400 font-medium uppercase tracking-widest">AI-Powered</span>
          </div>
          <div className="text-lg font-bold gradient-text-green">AI Revenue Department</div>
          <div className="text-xs text-slate-500 mt-1">6 specialized agents · 24/7 operation · 2,172 tasks today</div>
        </motion.div>

        {/* Horizontal connector bar */}
        <div className="relative w-full max-w-5xl h-8 flex items-end justify-center">
          <div className="absolute top-0 left-[8.33%] right-[8.33%] h-px bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />
          {AGENTS.map((_, i) => (
            <div
              key={i}
              className="absolute top-0 w-px h-8 bg-gradient-to-b from-slate-600/60 to-transparent"
              style={{ left: `${(i + 0.5) * (100 / AGENTS.length)}%` }}
            />
          ))}
        </div>

        {/* Agent Nodes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-5xl">
          {AGENTS.map((agent, i) => (
            <AgentNode key={agent.id} agent={agent} index={i} onSelect={setSelected} />
          ))}
        </div>

        {/* FLUX — orchestrator label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 flex items-center gap-2 text-xs text-slate-600 border border-dashed border-slate-800 rounded-xl px-4 py-2"
        >
          <Cpu className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-pink-400 font-mono font-bold">FLUX</span>
          <span>orchestrates all agents — routing, coordination, and escalation</span>
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-slate-600"
      >
        <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Click agent to view details</span>
        <span className="flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-blue-400" /> All agents operating at full capacity</span>
        <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-amber-400" /> 2,172 tasks completed today</span>
      </motion.div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/40 z-40 cursor-pointer"
            />
            <AgentDetailPanel agent={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
