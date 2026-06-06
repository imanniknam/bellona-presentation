'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign, TrendingUp, Calendar, Users, Percent, Clock,
  ArrowUpRight, ArrowDownRight, Download, RefreshCw,
  Zap, Brain, Target, ChevronRight, BarChart3,
  Lightbulb, Shield, AlertTriangle, CheckCircle2,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend,
} from 'recharts'
import { cn } from '@/lib/utils'

// ─── Data ─────────────────────────────────────────────────────────────────────

const REVENUE_TREND = [
  { month:'Jan', revenue:680,  forecast:660,  target:700  },
  { month:'Feb', revenue:724,  forecast:700,  target:720  },
  { month:'Mar', revenue:695,  forecast:730,  target:740  },
  { month:'Apr', revenue:812,  forecast:760,  target:760  },
  { month:'May', revenue:878,  forecast:820,  target:800  },
  { month:'Jun', revenue:923,  forecast:880,  target:840  },
  { month:'Jul', revenue:887,  forecast:920,  target:880  },
  { month:'Aug', revenue:1024, forecast:960,  target:920  },
  { month:'Sep', revenue:1083, forecast:1020, target:960  },
  { month:'Oct', revenue:1152, forecast:1090, target:1000 },
  { month:'Nov', revenue:1198, forecast:1150, target:1050 },
  { month:'Dec', revenue:1247, forecast:1210, target:1100 },
]

const FORECAST_DATA = [
  { month:'Dec',  revenue:1247, lo:1180, hi:1310 },
  { month:'Jan',  revenue:null, lo:1290, hi:1440, forecast:1365 },
  { month:'Feb',  revenue:null, lo:1380, hi:1550, forecast:1465 },
  { month:'Mar',  revenue:null, lo:1450, hi:1680, forecast:1565 },
  { month:'Apr',  revenue:null, lo:1530, hi:1810, forecast:1670 },
]

const PIPELINE_STAGES = [
  { stage:'Discovery',    deals:42, value:2100, pct:100, color:'#06b6d4', conv:'—'    },
  { stage:'Qualified',    deals:28, value:1400, pct:67,  color:'#3b82f6', conv:'67%'  },
  { stage:'Proposal',     deals:18, value:780,  pct:43,  color:'#8b5cf6', conv:'64%'  },
  { stage:'Negotiation',  deals:11, value:520,  pct:26,  color:'#f59e0b', conv:'61%'  },
  { stage:'Closed Won',   deals:12, value:480,  pct:29,  color:'#22c55e', conv:'109%' },
]

const WEEKLY_MEETINGS = [
  { week:'W1', meetings:4,  target:6  },
  { week:'W2', meetings:6,  target:6  },
  { week:'W3', meetings:5,  target:6  },
  { week:'W4', meetings:8,  target:7  },
  { week:'W5', meetings:7,  target:7  },
  { week:'W6', meetings:9,  target:8  },
  { week:'W7', meetings:11, target:9  },
  { week:'W8', meetings:12, target:10 },
]

const CONVERSION_FUNNEL = [
  { label:'Leads Captured',   count:1284, pct:100, color:'#06b6d4' },
  { label:'Contacted',        count:847,  pct:66,  color:'#3b82f6' },
  { label:'Replied',          count:312,  pct:37,  color:'#8b5cf6' },
  { label:'Meetings Booked',  count:147,  pct:47,  color:'#f59e0b' },
  { label:'Proposals Sent',   count:47,   pct:32,  color:'#f97316' },
  { label:'Closed Won',       count:12,   pct:26,  color:'#22c55e' },
]

const HOURS_SAVED = [
  { category:'Lead Research',  hours:320, color:'#06b6d4' },
  { category:'Email Writing',  hours:180, color:'#8b5cf6' },
  { category:'Data Entry',     hours:147, color:'#3b82f6' },
  { category:'Follow-ups',     hours:124, color:'#f59e0b' },
  { category:'Reporting',      hours:76,  color:'#22c55e' },
]

const RADAR_DATA = [
  { metric:'Lead Quality',       score:87 },
  { metric:'Response Speed',     score:94 },
  { metric:'Email Personalization', score:91 },
  { metric:'Meeting Conversion', score:78 },
  { metric:'Data Accuracy',      score:96 },
  { metric:'Forecast Precision', score:83 },
]

const AI_INSIGHTS = [
  { type:'opportunity', icon:TrendingUp,   color:'text-emerald-400', bg:'bg-emerald-400/8 border-emerald-500/20', text:'Revenue trajectory suggests Q1 target of $1.47M is achievable — 7% ahead of plan if APAC outreach launches this week.' },
  { type:'warning',     icon:AlertTriangle, color:'text-amber-400',   bg:'bg-amber-400/8 border-amber-500/20',   text:'Negotiation stage conversion dropped 4pts MoM. NEXUS flagged 3 deals at risk — champion mapping suggests new stakeholders.' },
  { type:'insight',     icon:Lightbulb,     color:'text-blue-400',    bg:'bg-blue-400/8 border-blue-500/20',     text:'Tuesday 10–11am outreach has 3.4× higher reply rate. ECHO has auto-shifted all new sequences to this window.' },
]

const ROI_METRICS = [
  { label:'Lead Research',     before:'4 hours',    after:'8 seconds',   gain:'1800×' },
  { label:'Email Writing',     before:'45 min/each', after:'12 seconds', gain:'225×'  },
  { label:'Pipeline Updates',  before:'2 hrs/week', after:'Real-time',   gain:'∞'     },
  { label:'Forecast Reports',  before:'4 hrs/week', after:'Always live', gain:'∞'     },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt$(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function fmtN(n: number): string {
  return n.toLocaleString()
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function Counter({ target, prefix = '', suffix = '', decimals = 0 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number
}) {
  const [val, setVal] = useState(0)
  const frameRef = useRef<number>(0)
  useEffect(() => {
    const start = performance.now()
    const dur   = 1800
    const animate = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(parseFloat((target * e).toFixed(decimals)))
      if (p < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, decimals])
  return <>{prefix}{decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()}{suffix}</>
}

// ─── Period Selector ──────────────────────────────────────────────────────────

type Period = 'MTD'|'QTD'|'YTD'

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, prefix = '$', suffix = 'K' }: {
  active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string; prefix?: string; suffix?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass border border-slate-700/60 rounded-xl px-3 py-2 text-xs shadow-xl">
      <div className="text-slate-400 font-semibold mb-1.5">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500 capitalize">{p.name}</span>
          <span className="ml-auto font-mono font-semibold text-white">{prefix}{p.value?.toLocaleString()}{suffix}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
      <div className="w-3 h-px bg-slate-700" />
      {children}
      <div className="flex-1 h-px bg-slate-800/80" />
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KPICardProps {
  label:    string
  value:    number
  prefix?:  string
  suffix?:  string
  decimals?: number
  delta:    number   // percent change
  sub:      string
  icon:     React.ElementType
  color:    string   // tailwind text color
  glow:     string   // tailwind shadow
  delay?:   number
}

function KPICard({ label, value, prefix='', suffix='', decimals=0, delta, sub, icon:Icon, color, glow, delay=0 }: KPICardProps) {
  const positive = delta >= 0
  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.45, ease:[0.23,1,0.32,1] }}
      className={cn('glass border border-slate-800/60 rounded-2xl p-5 relative overflow-hidden group cursor-default hover:border-slate-700/60 transition-all duration-300', glow)}
    >
      {/* Subtle corner glow */}
      <div className={cn('absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity', color.replace('text-', 'bg-'))} />

      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color.replace('text-', 'bg-').replace('-400', '-500/15'))}>
          <Icon className={cn('w-4.5 h-4.5', color)} style={{ width: 18, height: 18 }} />
        </div>
        <div className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full', positive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400')}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(delta)}%
        </div>
      </div>

      <div className={cn('text-2xl font-bold font-mono tracking-tight mb-1', color)}>
        <Counter target={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      <div className="text-sm font-semibold text-slate-300 mb-0.5">{label}</div>
      <div className="text-[11px] text-slate-600">{sub}</div>
    </motion.div>
  )
}

// ─── Funnel Bar ───────────────────────────────────────────────────────────────

function FunnelRow({ item, maxCount, index }: { item: typeof CONVERSION_FUNNEL[0]; maxCount: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity:0, x:-12 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay: 0.4 + index * 0.07 }}
      className="flex items-center gap-3"
    >
      <div className="w-32 text-[11px] text-slate-500 text-right leading-tight flex-shrink-0">{item.label}</div>
      <div className="flex-1 h-7 bg-slate-900/60 rounded-lg overflow-hidden relative">
        <motion.div
          initial={{ width:0 }}
          animate={{ width:`${item.pct}%` }}
          transition={{ duration:1.2, delay:0.5 + index*0.08, ease:[0.23,1,0.32,1] }}
          className="h-full rounded-lg flex items-center pr-2 justify-end"
          style={{ backgroundColor: item.color + '30', borderRight:`2px solid ${item.color}` }}
        >
          <span className="text-[10px] font-bold font-mono" style={{ color: item.color }}>{fmtN(item.count)}</span>
        </motion.div>
        {index > 0 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-700 font-mono">
            {item.pct}%
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── ROI Row ──────────────────────────────────────────────────────────────────

function ROIRow({ item, index }: { item: typeof ROI_METRICS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity:0, y:8 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: 0.3 + index * 0.08 }}
      className="grid grid-cols-[1fr_1fr_1fr_80px] gap-3 py-3 border-b border-slate-800/40 items-center text-xs"
    >
      <span className="text-slate-400 font-medium">{item.label}</span>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500/60 flex-shrink-0" />
        <span className="text-slate-600 font-mono">{item.before}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
        <span className="text-emerald-400 font-mono">{item.after}</span>
      </div>
      <div className="text-right font-bold font-mono text-white">{item.gain}</div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [period, setPeriod]       = useState<Period>('MTD')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [refreshing, setRefreshing]   = useState(false)
  const [selectedStage, setSelectedStage] = useState<number | null>(null)

  // Tick last-updated every 30s
  useEffect(() => {
    const t = setInterval(() => setLastUpdated(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => { setRefreshing(false); setLastUpdated(new Date()) }, 1400)
  }

  const totalHours = HOURS_SAVED.reduce((s, h) => s + h.hours, 0)
  const roiMultiple = Math.round(((847 * 75) + 487000) / 3500)

  return (
    <div className="min-h-screen p-6 space-y-7">

      {/* ── Page Header ────────────────────────────────────── */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">Executive Dashboard</h1>
            <span className="text-[10px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-1">
              LIVE
            </span>
          </div>
          <p className="text-slate-500 text-sm">AI Revenue Department · Real-time performance intelligence</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex items-center glass border border-slate-700/50 rounded-xl overflow-hidden p-1 gap-1">
            {(['MTD','QTD','YTD'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer',
                  period === p ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300',
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Last updated */}
          <div className="text-[10px] text-slate-700 font-mono hidden sm:block">
            Updated {lastUpdated.toLocaleTimeString('en', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="w-8 h-8 glass border border-slate-700/50 rounded-lg flex items-center justify-center hover:border-slate-600/60 transition-colors cursor-pointer"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 text-slate-400', refreshing && 'animate-spin')} />
          </button>

          {/* Export */}
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Board Report
          </button>
        </div>
      </motion.div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div>
        <SectionLabel>Key Performance Indicators — {period}</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard label="Revenue Generated"  value={1247}  prefix="$" suffix="K" delta={+18.4} sub="vs $1.05M last month"  icon={DollarSign}  color="text-emerald-400" glow="hover:shadow-lg hover:shadow-emerald-500/5" delay={0.05} />
          <KPICard label="Pipeline Value"     value={5.04}  prefix="$" suffix="M" decimals={2} delta={+23.1} sub="111 active deals"     icon={TrendingUp}  color="text-blue-400"    glow="hover:shadow-lg hover:shadow-blue-500/5"    delay={0.10} />
          <KPICard label="Meetings Booked"    value={47}    delta={+34.3} sub="vs 35 last month"    icon={Calendar}    color="text-purple-400"  glow="hover:shadow-lg hover:shadow-purple-500/5"  delay={0.15} />
          <KPICard label="Leads Processed"    value={1284}  delta={+41.2} sub="AI-qualified leads"  icon={Users}       color="text-cyan-400"    glow="hover:shadow-lg hover:shadow-cyan-500/5"    delay={0.20} />
          <KPICard label="Conversion Rate"    value={12.4}  suffix="%" decimals={1} delta={+2.1}  sub="Lead → Meeting"     icon={Percent}     color="text-amber-400"   glow="hover:shadow-lg hover:shadow-amber-500/5"   delay={0.25} />
          <KPICard label="Hours Saved"        value={847}   suffix="h" delta={+19.7} sub="$63.5K value created" icon={Clock}       color="text-pink-400"    glow="hover:shadow-lg hover:shadow-pink-500/5"    delay={0.30} />
        </div>
      </div>

      {/* ── Revenue Trend + Pipeline ───────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Revenue trend chart (2/3 width) */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.35 }}
          className="xl:col-span-2 glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm font-semibold text-white">Revenue vs Forecast vs Target</div>
              <div className="text-xs text-slate-600 mt-0.5">12-month trailing — thousands USD</div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 bg-emerald-400 inline-block rounded" /> Actual</span>
              <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 bg-blue-400 inline-block rounded border-dashed" style={{borderTop:'2px dashed #3b82f6',height:0}} /> Forecast</span>
              <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 bg-slate-600 inline-block rounded" /> Target</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={REVENUE_TREND} margin={{ top:8, right:8, left:-16, bottom:0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'#475569', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#475569', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} />
              <Tooltip content={<ChartTooltip prefix="$" suffix="K" />} />
              <ReferenceLine y={1000} stroke="#334155" strokeDasharray="4 4" label={{ value:'$1M', fill:'#475569', fontSize:10, position:'right' }} />
              <Area type="monotone" dataKey="target"   stroke="#334155" strokeWidth={1.5} fill="none"         strokeDasharray="4 4" name="Target"   />
              <Area type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={1.5} fill="url(#foreGrad)" name="Forecast" />
              <Area type="monotone" dataKey="revenue"  stroke="#22c55e" strokeWidth={2.5} fill="url(#revGrad)"  name="Revenue" dot={false} activeDot={{ r:5, fill:'#22c55e', stroke:'#020617', strokeWidth:2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pipeline stages (1/3 width) */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.40 }}
          className="glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="text-sm font-semibold text-white mb-1">Pipeline by Stage</div>
          <div className="text-xs text-slate-600 mb-5">111 active deals · $5.04M total</div>
          <div className="space-y-3">
            {PIPELINE_STAGES.map((s, i) => (
              <motion.div
                key={s.stage}
                initial={{ opacity:0, x:12 }}
                animate={{ opacity:1, x:0 }}
                transition={{ delay:0.5 + i*0.07 }}
                onClick={() => setSelectedStage(selectedStage === i ? null : i)}
                className={cn(
                  'rounded-xl p-3 border cursor-pointer transition-all duration-200',
                  selectedStage === i
                    ? 'border-slate-600/60 bg-slate-800/40'
                    : 'border-slate-800/40 hover:border-slate-700/40',
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">{s.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">{s.deals} deals</span>
                    {s.conv !== '—' && (
                      <span className={cn('text-[10px] font-bold', parseFloat(s.conv) >= 100 ? 'text-emerald-400' : 'text-slate-500')}>
                        {s.conv}
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                  <motion.div
                    initial={{ width:0 }}
                    animate={{ width:`${s.pct}%` }}
                    transition={{ duration:1.1, delay:0.6+i*0.07 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                </div>
                <div className="text-xs font-bold font-mono" style={{ color: s.color }}>
                  ${(s.value / 1000).toFixed(1)}M
                </div>
                <AnimatePresence>
                  {selectedStage === i && (
                    <motion.div
                      initial={{ height:0, opacity:0 }}
                      animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }}
                      transition={{ duration:0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 pt-2 border-t border-slate-700/40 grid grid-cols-2 gap-2 text-[10px]">
                        <div><div className="text-slate-700">Avg Deal Size</div><div className="text-slate-300 font-mono">${Math.round(s.value/s.deals)}K</div></div>
                        <div><div className="text-slate-700">Conversion</div><div className="font-mono" style={{ color: s.color }}>{s.conv}</div></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Conversion Funnel + Hours Saved + Radar ────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.45 }}
          className="glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="text-sm font-semibold text-white mb-1">Conversion Funnel</div>
          <div className="text-xs text-slate-600 mb-5">Lead to closed — this month</div>
          <div className="space-y-2">
            {CONVERSION_FUNNEL.map((item, i) => (
              <FunnelRow key={item.label} item={item} maxCount={CONVERSION_FUNNEL[0].count} index={i} />
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Overall conversion</span>
              <span className="font-bold font-mono text-emerald-400">0.93% → Close</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-600">Lead → Meeting</span>
              <span className="font-bold font-mono text-blue-400">11.4%</span>
            </div>
          </div>
        </motion.div>

        {/* Meetings trend + Hours saved */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.50 }}
          className="glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="text-sm font-semibold text-white mb-1">Meetings Booked — Trend</div>
          <div className="text-xs text-slate-600 mb-4">8-week rolling · vs weekly target</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={WEEKLY_MEETINGS} margin={{ top:4, right:4, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="week" tick={{ fill:'#475569', fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#475569', fontSize:10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip prefix="" suffix=" meetings" />} />
              <Bar dataKey="target"   fill="#1e293b" radius={[3,3,0,0]} name="Target"   />
              <Bar dataKey="meetings" fill="#8b5cf6" radius={[3,3,0,0]} name="Meetings" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-5 pt-4 border-t border-slate-800/60">
            <div className="text-xs font-semibold text-white mb-3">Hours Saved by Category</div>
            <div className="space-y-2">
              {HOURS_SAVED.map((h, i) => (
                <motion.div key={h.category} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.7+i*0.06 }} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-28 flex-shrink-0">{h.category}</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width:0 }} animate={{ width:`${(h.hours/320)*100}%` }} transition={{ duration:1, delay:0.8+i*0.06 }} className="h-full rounded-full" style={{ backgroundColor: h.color }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{h.hours}h</span>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50 text-xs">
              <span className="text-slate-600">Total hours saved</span>
              <span className="font-bold font-mono text-pink-400">{totalHours}h · $63.5K value</span>
            </div>
          </div>
        </motion.div>

        {/* AI Performance Radar */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.55 }}
          className="glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="text-sm font-semibold text-white mb-1">AI Agent Performance</div>
          <div className="text-xs text-slate-600 mb-2">Multi-dimensional quality score</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="metric" tick={{ fill:'#475569', fontSize:9 }} />
              <Radar dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} dot={{ fill:'#22c55e', r:3 }} />
            </RadarChart>
          </ResponsiveContainer>
          {/* Score breakdown */}
          <div className="mt-2 space-y-1.5">
            {RADAR_DATA.map(r => (
              <div key={r.metric} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 flex-1 truncate">{r.metric}</span>
                <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width:0 }}
                    animate={{ width:`${r.score}%` }}
                    transition={{ duration:1.1, delay:0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: r.score >= 90 ? '#22c55e' : r.score >= 80 ? '#3b82f6' : '#f59e0b' }}
                  />
                </div>
                <span className={cn('text-[10px] font-mono font-bold w-6 text-right', r.score >= 90 ? 'text-emerald-400' : r.score >= 80 ? 'text-blue-400' : 'text-amber-400')}>
                  {r.score}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Forecast + ROI + Insights ──────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Q1 Revenue Forecast */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.60 }}
          className="glass border border-emerald-500/15 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-emerald-400" />
            <div className="text-sm font-semibold text-white">Q1 Revenue Forecast</div>
          </div>
          <div className="text-xs text-slate-600 mb-4">VANCE AI · 90% confidence interval</div>

          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={FORECAST_DATA} margin={{ top:8, right:8, left:-16, bottom:0 }}>
              <defs>
                <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'#475569', fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#475569', fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} />
              <Tooltip content={<ChartTooltip prefix="$" suffix="K" />} />
              <Area type="monotone" dataKey="hi"       stroke="none" fill="#22c55e" fillOpacity={0.06} name="Upper Bound" />
              <Area type="monotone" dataKey="lo"       stroke="none" fill="url(#confGrad)"              name="Lower Bound" />
              <Line type="monotone" dataKey="revenue"  stroke="#22c55e" strokeWidth={2.5} dot={false}  name="Actual" />
              <Line type="monotone" dataKey="forecast" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 3" dot={{ fill:'#22c55e', r:3 }} name="Forecast" />
            </AreaChart>
          </ResponsiveContainer>

          {/* Forecast callouts */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label:'Jan Forecast', value:'$1.37M', color:'text-emerald-400' },
              { label:'Q1 Target',    value:'$4.20M', color:'text-blue-400'    },
              { label:'Probability',  value:'84%',    color:'text-purple-400'  },
            ].map(f => (
              <div key={f.label} className="text-center bg-slate-900/50 rounded-xl p-2.5 border border-slate-800/60">
                <div className={cn('text-sm font-bold font-mono', f.color)}>{f.value}</div>
                <div className="text-[10px] text-slate-700 mt-0.5">{f.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ROI Comparison */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.65 }}
          className="glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <div className="text-sm font-semibold text-white">Before vs After AI</div>
          </div>
          <div className="text-xs text-slate-600 mb-3">Efficiency gains from AI Revenue Department</div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr_80px] gap-3 py-2 border-b border-slate-800/60 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <span>Task</span>
            <span>Before</span>
            <span>After AI</span>
            <span className="text-right">Gain</span>
          </div>
          {ROI_METRICS.map((item, i) => <ROIRow key={item.label} item={item} index={i} />)}

          {/* ROI summary */}
          <div className="mt-4 pt-4 border-t border-slate-800/60">
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-black font-mono text-emerald-400 mb-1">
                <Counter target={roiMultiple} suffix="×" />
              </div>
              <div className="text-xs text-slate-400 font-semibold">Return on AI Investment</div>
              <div className="text-[10px] text-slate-600 mt-1">$3,500/mo cost · ${(3500 * roiMultiple / 1000).toFixed(0)}K value delivered</div>
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.70 }}
          className="glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <div className="text-sm font-semibold text-white">AI Executive Insights</div>
          </div>
          <div className="text-xs text-slate-600 mb-4">Generated from 68,573+ data points</div>

          <div className="space-y-3">
            {AI_INSIGHTS.map((ins, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, x:12 }}
                animate={{ opacity:1, x:0 }}
                transition={{ delay:0.75+i*0.1 }}
                className={cn('rounded-xl p-3.5 border', ins.bg)}
              >
                <div className="flex items-start gap-2.5">
                  <ins.icon className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5', ins.color)} />
                  <p className="text-xs text-slate-300 leading-relaxed">{ins.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* System health */}
          <div className="mt-5 pt-4 border-t border-slate-800/60">
            <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              System Health
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label:'Data Sources',  value:'7/7 connected',  ok:true },
                { label:'Agents',        value:'6/6 active',     ok:true },
                { label:'API Latency',   value:'47ms avg',       ok:true },
                { label:'Data Freshness',value:'< 30s lag',      ok:true },
              ].map(s => (
                <div key={s.label} className="bg-slate-900/50 rounded-lg p-2 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CheckCircle2 className={cn('w-2.5 h-2.5', s.ok ? 'text-emerald-400' : 'text-red-400')} />
                    <span className="text-[10px] text-slate-600">{s.label}</span>
                  </div>
                  <div className="text-[10px] font-mono font-semibold text-slate-300">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom: Agent Leaderboard + Quick Stats ─────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Agent contribution table */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.75 }}
          className="glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="text-sm font-semibold text-white mb-1">Agent Revenue Contribution</div>
          <div className="text-xs text-slate-600 mb-4">Attribution by AI agent — this month</div>

          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 py-2 border-b border-slate-800/60 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <span>Agent</span>
            <span className="text-right">Leads</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">Efficiency</span>
          </div>

          {[
            { name:'NEXUS',  role:'Intelligence',  leads:1284, rev:312, eff:97, color:'#3b82f6' },
            { name:'ECHO',   role:'Outreach',      leads:847,  rev:487, eff:94, color:'#22c55e' },
            { name:'ARIA',   role:'Qualification', leads:1284, rev:156, eff:91, color:'#8b5cf6' },
            { name:'SIGIL',  role:'Research',      leads:421,  rev:89,  eff:88, color:'#06b6d4' },
            { name:'FLUX',   role:'Operations',    leads:1284, rev:48,  eff:99, color:'#6366f1' },
            { name:'VANCE',  role:'Forecasting',   leads:0,    rev:155, eff:86, color:'#eab308' },
          ].map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity:0, x:-8 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.85+i*0.06 }}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 py-3 border-b border-slate-800/30 items-center hover:bg-slate-800/20 rounded-lg transition-colors cursor-default"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                <div>
                  <div className="text-xs font-bold font-mono" style={{ color: a.color }}>{a.name}</div>
                  <div className="text-[10px] text-slate-700">{a.role}</div>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400 text-right">{a.leads > 0 ? fmtN(a.leads) : '—'}</div>
              <div className="text-xs font-bold font-mono text-emerald-400 text-right">${a.rev}K</div>
              <div className="text-right">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width:0 }}
                    animate={{ width:`${a.eff}%` }}
                    transition={{ duration:1, delay:0.9+i*0.06 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: a.color }}
                  />
                </div>
                <div className="text-[10px] font-mono mt-0.5" style={{ color: a.color }}>{a.eff}%</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary stats + deal velocity */}
        <div className="space-y-5">

          {/* Deal velocity */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.80 }}
            className="glass border border-slate-800/60 rounded-2xl p-5"
          >
            <div className="text-sm font-semibold text-white mb-1">Deal Velocity</div>
            <div className="text-xs text-slate-600 mb-4">Average days per stage — this quarter</div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart
                data={[
                  { stage:'Discovery',   days:3.2 },
                  { stage:'Qualified',   days:5.8 },
                  { stage:'Proposal',    days:8.4 },
                  { stage:'Negotiation', days:12.1 },
                  { stage:'Closed',      days:2.3 },
                ]}
                layout="vertical"
                margin={{ top:0, right:40, left:0, bottom:0 }}
              >
                <XAxis type="number" tick={{ fill:'#475569', fontSize:10 }} axisLine={false} tickLine={false} unit="d" />
                <YAxis type="category" dataKey="stage" tick={{ fill:'#475569', fontSize:10 }} axisLine={false} tickLine={false} width={72} />
                <Tooltip content={<ChartTooltip prefix="" suffix=" days" />} />
                <Bar dataKey="days" fill="#3b82f6" radius={[0,4,4,0]} name="Days" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-slate-600">Total cycle time</span>
              <span className="font-bold font-mono text-blue-400">31.8 days avg → Closed</span>
            </div>
          </motion.div>

          {/* Benchmark comparison */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.85 }}
            className="glass border border-purple-500/15 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-purple-400" />
              <div className="text-sm font-semibold text-white">Industry Benchmark</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:'Email Reply Rate',  you:'23%',  bench:'7%',   win:true  },
                { label:'Meeting Rate',      you:'11.4%', bench:'4.2%', win:true  },
                { label:'Sales Cycle',       you:'32d',  bench:'47d',  win:true  },
                { label:'Lead-to-Close',     you:'0.93%',bench:'0.61%',win:true  },
                { label:'Rep Productivity',  you:'3.2×', bench:'1×',   win:true  },
                { label:'Forecast Accuracy', you:'94%',  bench:'61%',  win:true  },
              ].map(m => (
                <div key={m.label} className="bg-slate-900/50 rounded-xl p-3 border border-slate-800/50 text-center">
                  <div className="text-[10px] text-slate-600 leading-tight mb-1.5">{m.label}</div>
                  <div className={cn('text-sm font-bold font-mono', m.win ? 'text-emerald-400' : 'text-red-400')}>{m.you}</div>
                  <div className="text-[10px] text-slate-700 mt-0.5">bench: {m.bench}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center text-[10px] text-slate-700">
              Outperforming industry average across all 6 benchmarks
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-4" />
    </div>
  )
}
