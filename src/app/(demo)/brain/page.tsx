'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database, Mail, Users, Globe, Mic, Search,
  Brain, Zap, RefreshCw, CheckCircle2, AlertCircle,
  ChevronRight, TrendingUp,
} from 'lucide-react'
import { DATA_SOURCES, AGENTS, type DataSource } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ElementType> = {
  database: Database, mail: Mail, users: Users,
  globe: Globe, mic: Mic, search: Search,
}

const KNOWLEDGE_STATS = [
  { label: 'Total Records',    value: '1.4M+',  color: 'text-emerald-400' },
  { label: 'Data Sources',     value: '6',      color: 'text-blue-400' },
  { label: 'Last Full Sync',   value: '4m ago', color: 'text-purple-400' },
  { label: 'AI Embeddings',    value: '847K',   color: 'text-amber-400' },
  { label: 'Accuracy Score',   value: '98.4%',  color: 'text-cyan-400' },
  { label: 'Memory Depth',     value: '36 mo',  color: 'text-pink-400' },
]

const RECENT_INSIGHTS = [
  { agent: 'SIGIL', insight: 'Competitor Acme reduced pricing by 30% — 14 of our accounts at risk', time: '3m ago', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { agent: 'ARIA',  insight: 'ICP match rate improved 18% after adding "Series B+ funded" qualifier', time: '12m ago', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { agent: 'VANCE', insight: 'Q4 win rate historically 23% higher when deals close before Nov 15', time: '28m ago', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { agent: 'NEXUS', insight: 'Deals with 3+ stakeholders have 2.4x higher close rate', time: '41m ago', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { agent: 'ECHO',  insight: '"ROI-first" email subject line outperforms "pain-point" by 34%', time: '1h ago', color: 'text-purple-400', bg: 'bg-purple-400/10' },
]

const ORBIT_POSITIONS = [
  { x: 0,   y: -165 },
  { x: 143, y: -83  },
  { x: 143, y: 83   },
  { x: 0,   y: 165  },
  { x: -143,y: 83   },
  { x: -143,y: -83  },
]

function SourceNode({ source, index, selected, onSelect }: { source: DataSource; index: number; selected: boolean; onSelect: () => void }) {
  const Icon = ICON_MAP[source.icon] ?? Database
  const pos  = ORBIT_POSITIONS[index]

  return (
    <motion.div
      className="absolute flex flex-col items-center cursor-pointer group"
      style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)`, transform: 'translate(-50%, -50%)' }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + index * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      onClick={onSelect}
    >
      {/* Connector line */}
      <svg
        className="absolute pointer-events-none"
        style={{
          left: '50%', top: '50%',
          width: Math.abs(pos.x) + 50, height: Math.abs(pos.y) + 50,
          transform: `translate(${pos.x > 0 ? '-100%' : '0'}, ${pos.y > 0 ? '-100%' : '0'})`,
          overflow: 'visible',
        }}
      >
        <line
          x1={pos.x > 0 ? 100 : 0} y1={pos.y > 0 ? 100 : 0}
          x2={pos.x > 0 ? 0 : 100}  y2={pos.y > 0 ? 0 : 100}
          stroke={source.color}
          strokeWidth="1"
          strokeOpacity="0.25"
          strokeDasharray="4 4"
        />
      </svg>

      <div
        className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-lg',
          selected ? 'scale-110' : '',
        )}
        style={{
          background: `${source.color}15`,
          borderColor: selected ? source.color : `${source.color}40`,
          boxShadow: selected ? `0 0 24px ${source.color}40` : 'none',
        }}
      >
        <Icon className="w-6 h-6" style={{ color: source.color }} />
      </div>

      <div className="mt-2 text-center">
        <div className="text-xs font-medium text-slate-300 whitespace-nowrap">{source.name.split('/')[0]}</div>
        <div className="text-[10px] text-slate-600 whitespace-nowrap">{source.records} records</div>
      </div>

      {/* Sync indicator */}
      <div className={cn(
        'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-ai-bg',
        source.status === 'synced'  ? 'bg-emerald-400' :
        source.status === 'syncing' ? 'bg-blue-400 animate-pulse' : 'bg-red-400',
      )} />
    </motion.div>
  )
}

export default function BrainPage() {
  const [selected, setSelected] = useState<DataSource | null>(null)
  const [pulseRing, setPulseRing] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setPulseRing(r => r + 1), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Company Brain</h1>
        <p className="text-slate-500 text-sm">Unified knowledge graph · 6 data sources · Real-time learning</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ── Brain Visualization ────────────────── */}
        <div className="xl:col-span-3 space-y-6">

          {/* Orbital diagram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass border border-slate-800/60 rounded-2xl p-6 flex items-center justify-center"
            style={{ minHeight: '480px' }}
          >
            <div className="relative w-full" style={{ height: '420px' }}>

              {/* Orbit ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full border border-slate-700/30 border-dashed" />
                <div className="absolute w-56 h-56 rounded-full border border-slate-800/60" />
              </div>

              {/* Pulse rings from center */}
              {[1, 2, 3].map(ring => (
                <motion.div
                  key={`${pulseRing}-${ring}`}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 0, scale: 1.5 + ring * 0.3 }}
                  transition={{ duration: 2.5, delay: ring * 0.5, ease: 'easeOut' }}
                >
                  <div className="w-24 h-24 rounded-full border border-purple-500/30" />
                </motion.div>
              ))}

              {/* Central Brain node */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center shadow-2xl shadow-purple-500/40 border border-purple-400/30 cursor-pointer"
                >
                  <Brain className="w-10 h-10 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-ai-bg flex items-center justify-center">
                    <Zap className="w-2 h-2 text-slate-950" />
                  </div>
                </motion.div>
              </div>

              {/* Data source nodes */}
              {DATA_SOURCES.map((source, i) => (
                <SourceNode
                  key={source.id}
                  source={source}
                  index={i}
                  selected={selected?.id === source.id}
                  onSelect={() => setSelected(s => s?.id === source.id ? null : source)}
                />
              ))}
            </div>
          </motion.div>

          {/* Knowledge stats */}
          <div className="grid grid-cols-3 gap-3">
            {KNOWLEDGE_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="glass border border-slate-800/60 rounded-xl p-4 text-center"
              >
                <div className={cn('font-bold font-mono text-xl', stat.color)}>{stat.value}</div>
                <div className="text-xs text-slate-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">

          {/* Selected source detail */}
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="glass border rounded-2xl p-5"
                style={{ borderColor: `${selected.color}30` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {(() => { const Icon = ICON_MAP[selected.icon] ?? Database; return <Icon className="w-5 h-5" style={{ color: selected.color }} /> })()}
                  <div>
                    <div className="font-semibold text-white text-sm">{selected.name}</div>
                    <div className="text-xs text-slate-500">{selected.records} records · {selected.updated}</div>
                  </div>
                  <div className={cn('ml-auto text-xs font-medium px-2 py-0.5 rounded-full',
                    selected.status === 'synced'  ? 'text-emerald-400 bg-emerald-400/10' :
                    selected.status === 'syncing' ? 'text-blue-400 bg-blue-400/10' : 'text-red-400 bg-red-400/10',
                  )}>
                    {selected.status === 'syncing' ? <RefreshCw className="w-3 h-3 animate-spin inline mr-1" /> : null}
                    {selected.status}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Data Quality',  value: '97.8%',   color: selected.color },
                    { label: 'Sync Interval', value: 'Real-time', color: selected.color },
                    { label: 'Used By',       value: '4 agents', color: selected.color },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-500">{row.label}</span>
                      <span className="font-medium" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass border border-dashed border-slate-700/50 rounded-2xl p-5 text-center"
              >
                <Brain className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Click a data source node to view details</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Agent access */}
          <div className="glass border border-slate-800/60 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Agent Brain Access
            </h3>
            <div className="space-y-3">
              {AGENTS.map(agent => {
                const colorMap: Record<string, string> = {
                  emerald: 'text-emerald-400 bg-emerald-400/10',
                  blue:    'text-blue-400 bg-blue-400/10',
                  purple:  'text-purple-400 bg-purple-400/10',
                  amber:   'text-amber-400 bg-amber-400/10',
                  cyan:    'text-cyan-400 bg-cyan-400/10',
                  pink:    'text-pink-400 bg-pink-400/10',
                }
                return (
                  <div key={agent.id} className="flex items-center gap-3">
                    <span className={cn('font-mono font-bold text-xs px-2 py-0.5 rounded', colorMap[agent.color])}>
                      {agent.name}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${60 + Math.random() * 35}%` }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-400"
                      />
                    </div>
                    <span className="text-[10px] text-slate-600">Full</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent AI Insights */}
          <div className="glass border border-slate-800/60 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Latest AI Insights
              </h3>
              <span className="text-[10px] text-slate-600">From brain</span>
            </div>
            <div className="space-y-3">
              {RECENT_INSIGHTS.map((ins, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex gap-2"
                >
                  <span className={cn('text-[10px] font-mono font-bold px-1.5 py-0.5 rounded self-start flex-shrink-0 mt-0.5', ins.bg, ins.color)}>
                    {ins.agent}
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 leading-relaxed">{ins.insight}</p>
                    <p className="text-[10px] text-slate-700 mt-0.5">{ins.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
