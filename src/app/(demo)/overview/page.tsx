'use client'
import { motion } from 'framer-motion'
import { Cpu, Zap, Clock, TrendingUp, Activity } from 'lucide-react'
import AgentCard from '@/components/ui/AgentCard'
import ActivityFeed from '@/components/ui/ActivityFeed'
import { AGENTS, DEPT_KPIS } from '@/lib/mock-data'

const DEPT_STATS = [
  { label: 'Total Tasks Today', value: '2,172', icon: Zap,        color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Avg Response Time', value: '47s',   icon: Clock,       color: 'text-blue-400',    bg: 'bg-blue-400/10' },
  { label: 'Combined Accuracy', value: '94.7%', icon: TrendingUp,  color: 'text-amber-400',   bg: 'bg-amber-400/10' },
  { label: 'Agents Online',     value: '6/6',   icon: Cpu,         color: 'text-purple-400',  bg: 'bg-purple-400/10' },
]

export default function OverviewPage() {
  return (
    <div className="min-h-screen p-8 space-y-6">
      {/* ── Header ────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">AI Department Overview</h1>
            <p className="text-slate-500 text-sm">All 6 agents active · Department performance at a glance</p>
          </div>
          <div className="flex items-center gap-2 glass border border-emerald-500/20 rounded-xl px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
              <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs text-emerald-400 font-semibold">All Systems Nominal</span>
          </div>
        </div>
      </motion.div>

      {/* ── Dept KPIs ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DEPT_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass border border-slate-800/60 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className={`font-bold font-mono text-xl ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-600">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Agent Grid ────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-slate-400 mb-4">Active Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} delay={0.1 + i * 0.08} />
          ))}
        </div>
      </div>

      {/* ── Activity + Throughput ─────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 glass border border-slate-800/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Live Agent Feed</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Auto-updating
            </div>
          </div>
          <ActivityFeed maxItems={8} />
        </div>

        {/* Throughput */}
        <div className="glass border border-slate-800/60 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-slate-500" />
            <h3 className="text-base font-semibold text-white">Agent Throughput</h3>
          </div>

          <div className="space-y-4">
            {AGENTS.map(agent => {
              const pct = Math.round((agent.tasksToday / 2000) * 100)
              const colorMap: Record<string, string> = {
                emerald: 'from-emerald-500 to-green-400',
                blue:    'from-blue-500 to-cyan-400',
                purple:  'from-purple-500 to-violet-400',
                amber:   'from-amber-500 to-orange-400',
                cyan:    'from-cyan-500 to-teal-400',
                pink:    'from-pink-500 to-rose-400',
              }
              const textMap: Record<string, string> = {
                emerald: 'text-emerald-400',
                blue:    'text-blue-400',
                purple:  'text-purple-400',
                amber:   'text-amber-400',
                cyan:    'text-cyan-400',
                pink:    'text-pink-400',
              }

              return (
                <div key={agent.id}>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className={`font-mono font-bold ${textMap[agent.color]}`}>{agent.name}</span>
                    <span className="text-slate-500">{agent.tasksToday.toLocaleString()} tasks</span>
                  </div>
                  <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${colorMap[agent.color]}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/60 text-center">
            <div className="text-2xl font-bold font-mono text-white">2,172</div>
            <div className="text-xs text-slate-500 mt-1">Total tasks completed today</div>
          </div>
        </div>
      </div>
    </div>
  )
}
