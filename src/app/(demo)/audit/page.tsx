'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, AlertTriangle, CheckCircle2, TrendingUp,
  ArrowRight, Zap, ChevronDown, ChevronUp, Star,
  BarChart3, Target, Clock,
} from 'lucide-react'
import { AUDIT_CATEGORIES, OVERALL_SCORE, AGENTS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const GRADE_COLOR: Record<string, string> = {
  'A+': 'text-emerald-400', 'A': 'text-emerald-400', 'A-': 'text-emerald-400',
  'B+': 'text-blue-400',    'B': 'text-blue-400',    'B-': 'text-blue-400',
  'C+': 'text-amber-400',   'C': 'text-amber-400',   'D': 'text-red-400', 'F': 'text-red-400',
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius      = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const [displayed, setDisplayed] = useState(0)
  const dashOffset  = circumference - (displayed / 100) * circumference

  useEffect(() => {
    let frame: number
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / 1800, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(score * eased))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"
        />
        {/* Score ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.05s' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono text-white">{displayed}</span>
        <span className="text-xs text-slate-500">/ 100</span>
      </div>
    </div>
  )
}

function CategoryCard({ cat, index }: { cat: typeof AUDIT_CATEGORIES[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08 }}
      className="glass border border-slate-800/60 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        {/* Score */}
        <div className="flex-shrink-0 w-12 h-12 relative">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <motion.circle
              cx="24" cy="24" r="18"
              fill="none"
              stroke={cat.color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 18}
              initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - cat.score / 100) }}
              transition={{ duration: 1.2, delay: 0.5 + index * 0.08 }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono text-white">
            {cat.score}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200 text-sm">{cat.name}</span>
            <span className={cn('font-mono font-bold text-sm', GRADE_COLOR[cat.grade] ?? 'text-slate-400')}>
              {cat.grade}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cat.score}%` }}
                transition={{ duration: 1.2, delay: 0.4 + index * 0.08 }}
                className="h-full rounded-full"
                style={{ backgroundColor: cat.color }}
              />
            </div>
            <span className={cn(
              'text-xs font-medium flex items-center gap-0.5',
              cat.trend >= 0 ? 'text-emerald-400' : 'text-red-400',
            )}>
              {cat.trend >= 0 ? '+' : ''}{cat.trend}%
            </span>
          </div>
        </div>

        {cat.issues.length > 0 && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-400">{cat.issues.length}</span>
          </div>
        )}

        {open ? <ChevronUp className="w-4 h-4 text-slate-600 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />}
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Issues */}
              <div>
                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Issues Found
                </h4>
                <ul className="space-y-1.5">
                  {cat.issues.map(issue => (
                    <li key={issue} className="flex gap-2 text-xs text-slate-500">
                      <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div>
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> AI Opportunities
                </h4>
                <ul className="space-y-1.5">
                  {cat.opportunities.map(opp => (
                    <li key={opp} className="flex gap-2 text-xs text-slate-400">
                      <ArrowRight className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AuditPage() {
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setScanning(false), 2500)
    return () => clearTimeout(t)
  }, [])

  const avgTrend = Math.round(AUDIT_CATEGORIES.reduce((s, c) => s + c.trend, 0) / AUDIT_CATEGORIES.length)

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Business Revenue Audit</h1>
          <p className="text-slate-500 text-sm">AI-powered 360° analysis of your revenue operation</p>
        </div>
        <AnimatePresence mode="wait">
          {scanning ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 glass border border-blue-500/20 rounded-xl px-4 py-2"
            >
              <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
              <span className="text-xs text-blue-400 font-semibold">Scanning business...</span>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 glass border border-emerald-500/20 rounded-xl px-4 py-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">Audit Complete</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* ── Left: Score + Summary ──────────────── */}
        <div className="xl:col-span-1 space-y-5">

          {/* Overall score */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: scanning ? 0 : 1, y: scanning ? 16 : 0 }}
            transition={{ duration: 0.5 }}
            className="glass border border-emerald-500/20 rounded-2xl p-5 text-center"
          >
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Overall Score</p>
            <div className="flex justify-center mb-4">
              <ScoreRing score={scanning ? 0 : OVERALL_SCORE} size={120} />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">B+</div>
            <p className="text-xs text-slate-500">Strong foundation — significant AI upside available</p>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              +{avgTrend}% avg improvement
            </div>
          </motion.div>

          {/* Quick wins */}
          <div className="glass border border-amber-500/15 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> Quick Wins
            </h3>
            <ul className="space-y-2">
              {[
                'Enable 24/7 lead scoring (ARIA)',
                'Automate pipeline alerts (NEXUS)',
                'Set up email sequences (ECHO)',
                'Activate market monitoring (SIGIL)',
              ].map((win, i) => (
                <motion.li
                  key={win}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-start gap-2 text-xs text-slate-400"
                >
                  <ArrowRight className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                  {win}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Agent recommendations */}
          <div className="glass border border-slate-800/60 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recommended Agents</h3>
            <div className="space-y-2">
              {[
                { name: 'SIGIL', reason: 'Market intel gap', priority: 'High', color: 'text-cyan-400 bg-cyan-400/10' },
                { name: 'NEXUS', reason: 'Pipeline risk',    priority: 'High', color: 'text-blue-400 bg-blue-400/10' },
                { name: 'ARIA',  reason: 'Lead quality',     priority: 'Med',  color: 'text-emerald-400 bg-emerald-400/10' },
              ].map(rec => (
                <div key={rec.name} className="flex items-center gap-2">
                  <span className={cn('text-xs font-mono font-bold px-1.5 py-0.5 rounded', rec.color)}>
                    {rec.name}
                  </span>
                  <span className="text-xs text-slate-500 flex-1">{rec.reason}</span>
                  <span className="text-[10px] text-amber-400">{rec.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Categories ──────────────────── */}
        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-white">Category Breakdown</h2>
            <span className="text-xs text-slate-600">Click any row to expand</span>
          </div>

          {AUDIT_CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} index={i} />
          ))}

          {/* AI impact projection */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass border border-purple-500/20 rounded-2xl p-5 mt-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">AI Impact Projection</h3>
              <span className="ml-auto text-xs text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded-full">90-day forecast</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Revenue Increase',  value: '+$420K',  color: 'text-emerald-400', icon: TrendingUp },
                { label: 'Leads Qualified',   value: '+340%',   color: 'text-blue-400',    icon: Target },
                { label: 'Response Time',     value: '60x faster', color: 'text-purple-400', icon: Clock },
                { label: 'Pipeline Health',   value: 'A → A+', color: 'text-amber-400',   icon: BarChart3 },
              ].map(proj => (
                <div key={proj.label} className="text-center">
                  <proj.icon className={cn('w-5 h-5 mx-auto mb-2', proj.color)} />
                  <div className={cn('font-bold font-mono text-base', proj.color)}>{proj.value}</div>
                  <div className="text-[10px] text-slate-600 mt-1">{proj.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
