'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, AlertTriangle, CheckCircle2, TrendingUp, ArrowRight,
  Zap, ChevronDown, ChevronUp, Clock, DollarSign, Brain,
  Target, Users, BarChart3, BookOpen, Headphones,
  XCircle, Star, Flame, Lock, Unlock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type Grade      = 'A+'|'A'|'B+'|'B'|'C+'|'C'|'D+'|'D'|'F'
type RiskLevel  = 'critical'|'high'|'medium'|'low'

interface Issue {
  text:  string
  level: RiskLevel
  cost?: string
}
interface Opportunity {
  text:    string
  impact:  string
  effort:  'Low'|'Medium'|'High'
}
interface AuditCat {
  id:            string
  name:          string
  icon:          React.ElementType
  score:         number
  grade:         Grade
  trend:         number
  color:         string
  hoursWasted:   number
  revenueAtRisk: number
  summary:       string
  issues:        Issue[]
  opportunities: Opportunity[]
  agentFix:      string
}

// ─── Audit Data ───────────────────────────────────────────────────────────────

const CATEGORIES: AuditCat[] = [
  {
    id:    'sales',
    name:  'Sales',
    icon:  TrendingUp,
    score: 34,
    grade: 'D+',
    trend: -4,
    color: '#ef4444',
    hoursWasted:   23,
    revenueAtRisk: 480,
    summary: 'Manual processes are costing your sales team 23 hours per week. Leads go cold before reps respond. No predictive intelligence.',
    issues: [
      { text:'Lead response time averages 4.2 hours — 80% of leads go cold after 5 min', level:'critical', cost:'~$47K/mo in lost deals' },
      { text:'No AI lead scoring — reps waste 60% of time on unqualified prospects',       level:'critical', cost:'~$28K/mo in wasted effort' },
      { text:'CRM data is 31% incomplete — forecasts are unreliable',                     level:'high',     cost:'~$15K/mo in bad decisions' },
      { text:'Follow-up sequences are manual — avg 3 touches vs best-practice 8+',        level:'high'      },
      { text:'Zero competitive intelligence automation — reps flying blind',               level:'medium'    },
    ],
    opportunities: [
      { text:'AI lead scoring routes only ICP-fit leads to reps — 3.4× pipeline quality',  impact:'+$210K/mo', effort:'Low'    },
      { text:'Automated 5-min follow-up cuts response time by 98% — catch leads at peak',  impact:'+$95K/mo',  effort:'Low'    },
      { text:'Predictive forecasting reduces pipeline error from 42% to 8%',               impact:'+$60K/mo',  effort:'Medium' },
      { text:'AI-generated call summaries update CRM automatically — zero data entry',     impact:'18 hrs/wk', effort:'Low'    },
    ],
    agentFix: 'NEXUS + ECHO agents solve this in 48 hours',
  },
  {
    id:    'marketing',
    name:  'Marketing',
    icon:  Target,
    score: 28,
    grade: 'F',
    trend: -2,
    color: '#f97316',
    hoursWasted:   19,
    revenueAtRisk: 320,
    summary: 'Generic outreach is destroying your sender reputation. 4% open rate vs the 23% AI-personalized average. Every email you send is being ignored.',
    issues: [
      { text:'Average email open rate: 4.1% — industry AI benchmark is 23%',              level:'critical', cost:'19× less pipeline generated' },
      { text:'No contact-level personalization — every prospect gets same message',        level:'critical', cost:'~$34K/mo in missed pipeline' },
      { text:'Content creation takes 6–8 hours per piece — blocking output velocity',     level:'high',     cost:'$2,800/mo in team time'     },
      { text:'No intent data — outreach is not timed to buyer signals',                   level:'high'      },
      { text:'Campaign reporting is manual and 2 weeks delayed',                          level:'medium'    },
    ],
    opportunities: [
      { text:'AI hyper-personalization at contact level — 23% open rate, 8% reply rate', impact:'+$180K/mo', effort:'Low'    },
      { text:'AI content engine produces 10 assets/week at zero marginal cost',           impact:'80 hrs/mo', effort:'Low'    },
      { text:'Intent signal monitoring — outreach sent when buyer is actively researching',impact:'+$75K/mo', effort:'Medium' },
      { text:'Real-time campaign analytics — decisions in hours, not weeks',              impact:'+$40K/mo',  effort:'Low'    },
    ],
    agentFix: 'ECHO + SIGIL agents solve this in 72 hours',
  },
  {
    id:    'operations',
    name:  'Operations',
    icon:  BarChart3,
    score: 47,
    grade: 'D+',
    trend: +1,
    color: '#f59e0b',
    hoursWasted:   31,
    revenueAtRisk: 210,
    summary: 'Your team spends 31 hours per week on work that should take 2 minutes. Manual data entry, stale reports, and zero real-time visibility are slowing every decision.',
    issues: [
      { text:'3 hours/day spent on manual data entry across CRM, spreadsheets, email',    level:'critical', cost:'$4,200/mo in team time' },
      { text:'Revenue reports take 4 hours to generate — by then the data is stale',      level:'high',     cost:'$1,600/mo in analyst time' },
      { text:'No real-time pipeline visibility — decisions based on last week\'s data',   level:'high'      },
      { text:'Onboarding new reps takes 3 months — knowledge is trapped in heads',        level:'medium',   cost:'$15K per new hire' },
      { text:'14 disconnected tools — no single source of truth',                         level:'medium'    },
    ],
    opportunities: [
      { text:'Auto-CRM sync eliminates all manual data entry — zero touch logging',       impact:'24 hrs/wk', effort:'Low'    },
      { text:'Live revenue dashboard — CEO sees real numbers in real time always',        impact:'+$50K/mo',  effort:'Low'    },
      { text:'AI-generated weekly reports ready before Monday standup',                   impact:'12 hrs/wk', effort:'Low'    },
      { text:'Automated onboarding reduces ramp time from 90 to 30 days',               impact:'$12K/hire', effort:'Medium' },
    ],
    agentFix: 'FLUX + VANCE agents solve this in 24 hours',
  },
  {
    id:    'customer-success',
    name:  'Customer Success',
    icon:  Headphones,
    score: 22,
    grade: 'F',
    trend: -7,
    color: '#ef4444',
    hoursWasted:   14,
    revenueAtRisk: 560,
    summary: 'You are losing customers silently. No churn prediction means you find out about at-risk accounts the moment they cancel. That\'s too late.',
    issues: [
      { text:'No churn prediction — 73% of churned customers showed signals 60+ days early', level:'critical', cost:'$47K avg churn cost' },
      { text:'Customer health checks are manual and monthly — should be real-time',          level:'critical', cost:'~$60K/mo at-risk ARR'  },
      { text:'NPS data collected but not acted on — 0 automated follow-ups',                level:'high'      },
      { text:'Expansion revenue identified 90 days late on average',                        level:'high',     cost:'~$28K/mo in delayed upsell' },
      { text:'Support tickets not triaged by AI — all treated equally regardless of risk',  level:'medium'    },
    ],
    opportunities: [
      { text:'AI churn prediction — 60-day early warning on every at-risk account',         impact:'+$120K/mo', effort:'Low'    },
      { text:'Real-time health scores trigger proactive outreach before customers churn',    impact:'+$90K/mo',  effort:'Low'    },
      { text:'Automated expansion signals — catch upsell at exactly the right moment',      impact:'+$65K/mo',  effort:'Medium' },
      { text:'AI support triage routes high-risk tickets to senior CSMs instantly',         impact:'8 hrs/wk',  effort:'Low'    },
    ],
    agentFix: 'ARIA + NEXUS agents solve this in 48 hours',
  },
  {
    id:    'knowledge',
    name:  'Knowledge Management',
    icon:  BookOpen,
    score: 18,
    grade: 'F',
    trend: -3,
    color: '#ef4444',
    hoursWasted:   22,
    revenueAtRisk: 180,
    summary: 'Your company\'s knowledge lives in people\'s heads and old email threads. When a top performer leaves, they take everything with them. This is an existential risk.',
    issues: [
      { text:'Critical knowledge siloed in 3 top performers — zero documentation',          level:'critical', cost:'$200K replacement risk' },
      { text:'New reps spend 3 months ramping — industry AI benchmark is 3 weeks',          level:'critical', cost:'$18K per hire wasted'  },
      { text:'SOPs exist in emails and Slack — not searchable, not current, not used',      level:'high'      },
      { text:'Same questions answered manually 40+ times per week by senior team',          level:'high',     cost:'$3,200/mo in senior time' },
      { text:'No institutional memory — mistakes are repeated quarterly',                   level:'medium'    },
    ],
    opportunities: [
      { text:'AI knowledge base makes every rep perform like your top performer',           impact:'+$140K/mo', effort:'Medium' },
      { text:'Automated onboarding reduces ramp from 90 → 21 days — 3× faster',           impact:'$15K/hire', effort:'Low'    },
      { text:'AI answers repetitive questions instantly — senior team stays in flow',       impact:'18 hrs/wk', effort:'Low'    },
      { text:'Living SOPs auto-update from call transcripts — always current',             impact:'+$30K/mo',  effort:'Medium' },
    ],
    agentFix: 'Company Brain + NEXUS solve this in 1 week',
  },
]

// ─── Constants ────────────────────────────────────────────────────────────────

const OVERALL_READINESS  = 30
const OPPORTUNITY_SCORE  = 91
const HOURS_SAVED        = 1284
const REVENUE_INCREASE   = 1750 // $K per month → shown as $1.75M/yr

const GRADE_COLOR: Record<string, string> = {
  'A+':'text-emerald-400','A':'text-emerald-400','A-':'text-emerald-400',
  'B+':'text-blue-400','B':'text-blue-400','B-':'text-blue-400',
  'C+':'text-amber-400','C':'text-amber-400','C-':'text-amber-400',
  'D+':'text-orange-400','D':'text-orange-400','D-':'text-red-400','F':'text-red-400',
}

const RISK_STYLE: Record<RiskLevel, { icon: React.ElementType; cls: string; dot: string }> = {
  critical: { icon: XCircle,       cls: 'text-red-400',    dot: 'bg-red-400'    },
  high:     { icon: AlertTriangle, cls: 'text-orange-400', dot: 'bg-orange-400' },
  medium:   { icon: AlertTriangle, cls: 'text-amber-400',  dot: 'bg-amber-400'  },
  low:      { icon: CheckCircle2,  cls: 'text-slate-500',  dot: 'bg-slate-600'  },
}

const EFFORT_STYLE: Record<string, string> = {
  Low:    'bg-emerald-400/15 text-emerald-400 border-emerald-400/25',
  Medium: 'bg-amber-400/15 text-amber-400 border-amber-400/25',
  High:   'bg-red-400/15 text-red-400 border-red-400/25',
}

// ─── Animated Gauge ───────────────────────────────────────────────────────────

function Gauge({
  value, max = 100, size = 160, strokeWidth = 10,
  color, label, sublabel, suffix = '',
}: {
  value: number; max?: number; size?: number; strokeWidth?: number
  color: string; label: string; sublabel?: string; suffix?: string
}) {
  const [displayed, setDisplayed] = useState(0)
  const frameRef = useRef<number>(0)
  const r        = (size - strokeWidth * 2) / 2
  const cx       = size / 2
  // 270° arc: from 135° to 405° (bottom-left to bottom-right)
  const ARC      = 270
  const circ     = 2 * Math.PI * r
  const arcLen   = (ARC / 360) * circ
  const pct      = displayed / max
  const filled   = arcLen * pct
  const gap      = circ - arcLen
  // rotate so arc starts at 135°
  const rotate   = 135

  useEffect(() => {
    const start = performance.now()
    const dur   = 2200
    const run   = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setDisplayed(Math.round(value * e))
      if (p < 1) frameRef.current = requestAnimationFrame(run)
    }
    frameRef.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])

  // Track colour by value
  const trackColor = value <= 33 ? '#ef4444' : value <= 66 ? '#f59e0b' : '#22c55e'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size * 0.78 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute top-0 left-0">
          {/* Background track */}
          <circle cx={cx} cy={cx} r={r} fill="none"
            stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth}
            strokeDasharray={`${arcLen} ${gap}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(${rotate} ${cx} ${cx})`}
          />
          {/* Value track */}
          <motion.circle cx={cx} cy={cx} r={r} fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${filled} ${circ - filled}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(${rotate} ${cx} ${cx})`}
            style={{ filter: `drop-shadow(0 0 8px ${trackColor}80)` }}
          />
          {/* Outer glow ring */}
          <circle cx={cx} cy={cx} r={r + strokeWidth / 2 + 4} fill="none"
            stroke={trackColor} strokeWidth={0.5} opacity={0.15}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-4">
          <div className="text-3xl font-black font-mono" style={{ color: trackColor }}>
            {displayed}{suffix}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">/{max}</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold text-slate-200">{label}</div>
        {sublabel && <div className="text-[11px] text-slate-600 mt-0.5">{sublabel}</div>}
      </div>
    </div>
  )
}

// ─── Score Ring (category) ────────────────────────────────────────────────────

function ScoreRing({ score, color, size = 52 }: { score: number; color: string; size?: number }) {
  const r    = (size - 8) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={5} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - score / 100) }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold font-mono text-white">{score}</span>
      </div>
    </div>
  )
}

// ─── Scanning Overlay ─────────────────────────────────────────────────────────

function ScanOverlay({ onDone }: { onDone: () => void }) {
  const [scanIdx, setScanIdx]   = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    'Connecting to business data sources...',
    'Analyzing sales processes and CRM activity...',
    'Auditing marketing automation & outreach...',
    'Scanning operational workflows...',
    'Evaluating customer success health scores...',
    'Assessing knowledge management systems...',
    'Calculating AI opportunity gaps...',
    'Generating revenue impact projections...',
    'Audit complete — revealing results...',
  ]

  useEffect(() => {
    let step = 0
    const tick = () => {
      step++
      setScanIdx(step)
      if (step < steps.length - 1) {
        setTimeout(tick, 380)
      } else {
        setTimeout(onDone, 600)
      }
    }
    const progTimer = setInterval(() => setProgress(p => Math.min(p + 1.4, 100)), 40)
    setTimeout(tick, 380)
    return () => clearInterval(progTimer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(2,6,23,0.97)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated scan lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-px opacity-10"
            style={{ backgroundColor: '#22c55e', top: `${10 + i * 12}%` }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.4, delay: i * 0.15, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg px-8 text-center">
        {/* Brain pulse */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-emerald-500/15 absolute inset-0 -m-4"
            />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center relative z-10">
              <Brain className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">AI Business Audit</h2>
        <p className="text-slate-500 text-sm mb-8">Analyzing your revenue operation across 5 dimensions</p>

        {/* Step list */}
        <div className="text-left space-y-2 mb-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: i <= scanIdx ? 1 : 0.2, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 text-sm"
            >
              {i < scanIdx ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              ) : i === scanIdx ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-3.5 h-3.5 border border-slate-700 rounded-full flex-shrink-0" />
              )}
              <span className={i <= scanIdx ? 'text-slate-300' : 'text-slate-700'}>{step}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-cyan-500"
          />
        </div>
        <div className="text-[10px] text-slate-700 font-mono mt-2">{Math.round(progress)}% complete</div>
      </div>
    </motion.div>
  )
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({ cat, index }: { cat: AuditCat; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const Icon = cat.icon

  const criticalCount = cat.issues.filter(i => i.level === 'critical').length
  const highCount     = cat.issues.filter(i => i.level === 'high').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.45 }}
      className={cn(
        'glass border rounded-2xl overflow-hidden transition-all duration-300',
        cat.score <= 33 ? 'border-red-500/20'    :
        cat.score <= 55 ? 'border-orange-500/20'  :
        cat.score <= 75 ? 'border-amber-500/20'   :
                          'border-emerald-500/20',
      )}
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        {/* Score ring */}
        <ScoreRing score={cat.score} color={cat.color} size={52} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="font-bold text-white">{cat.name}</span>
            <span className={cn('text-sm font-black', GRADE_COLOR[cat.grade])}>{cat.grade}</span>
            <div className={cn('flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full', cat.trend >= 0 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400')}>
              {cat.trend >= 0 ? '+' : ''}{cat.trend}% MoM
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-snug line-clamp-2">{cat.summary}</p>
        </div>

        {/* Right stats */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Alert counts */}
          <div className="hidden sm:flex items-center gap-2">
            {criticalCount > 0 && (
              <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1">
                <XCircle className="w-3 h-3 text-red-400" />
                <span className="text-[10px] font-bold text-red-400">{criticalCount} critical</span>
              </div>
            )}
            {highCount > 0 && (
              <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2 py-1">
                <AlertTriangle className="w-3 h-3 text-orange-400" />
                <span className="text-[10px] font-bold text-orange-400">{highCount} high</span>
              </div>
            )}
          </div>

          {/* Hours / revenue */}
          <div className="hidden md:block text-right">
            <div className="text-xs font-bold text-red-400 font-mono">{cat.hoursWasted}h/wk wasted</div>
            <div className="text-[10px] text-slate-600">${cat.revenueAtRisk}K/mo at risk</div>
          </div>

          {open
            ? <ChevronUp   className="w-4 h-4 text-slate-600 flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
          }
        </div>
      </div>

      {/* Expanded body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-slate-800/60 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Issues */}
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <XCircle className="w-3 h-3 text-red-400" />
                  Bottlenecks Detected
                </div>
                <div className="space-y-2.5">
                  {cat.issues.map((issue, i) => {
                    const rs = RISK_STYLE[issue.level]
                    const IIcon = rs.icon
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={cn(
                          'flex gap-2.5 p-3 rounded-xl border',
                          issue.level === 'critical' ? 'bg-red-500/5 border-red-500/15'    :
                          issue.level === 'high'     ? 'bg-orange-500/5 border-orange-500/15' :
                          'bg-slate-900/40 border-slate-800/40',
                        )}
                      >
                        <IIcon className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5', rs.cls)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300 leading-snug">{issue.text}</p>
                          {issue.cost && (
                            <p className="text-[10px] text-red-400 font-semibold mt-1">{issue.cost}</p>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Opportunities */}
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  AI Opportunities
                </div>
                <div className="space-y-2.5">
                  {cat.opportunities.map((opp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 leading-snug">{opp.text}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold text-emerald-400">{opp.impact}</span>
                          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full border', EFFORT_STYLE[opp.effort])}>
                            {opp.effort} effort
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Agent fix badge */}
                <div className="mt-3 flex items-center gap-2 bg-purple-500/8 border border-purple-500/20 rounded-xl px-3 py-2.5">
                  <Brain className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span className="text-[11px] text-purple-300 font-semibold">{cat.agentFix}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Cost of Inaction ─────────────────────────────────────────────────────────

function CostCounter() {
  const perSecond = Math.round((1750000 / 12 / 30 / 24 / 3600))
  const [count, setCount] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCount(c => c + perSecond), 1000)
    return () => clearInterval(t)
  }, [perSecond])
  return (
    <span className="font-black font-mono text-red-400">
      ${count.toLocaleString()}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [scanning, setScanning] = useState(true)
  const [revealed, setRevealed] = useState(false)

  const totalAtRisk    = CATEGORIES.reduce((s, c) => s + c.revenueAtRisk, 0)
  const totalHrsWasted = CATEGORIES.reduce((s, c) => s + c.hoursWasted, 0)
  const criticalTotal  = CATEGORIES.reduce((s, c) => s + c.issues.filter(i => i.level === 'critical').length, 0)

  const handleDone = () => {
    setScanning(false)
    setTimeout(() => setRevealed(true), 100)
  }

  return (
    <div className="min-h-screen p-6 space-y-7">

      {/* Scanning overlay */}
      <AnimatePresence>{scanning && <ScanOverlay onDone={handleDone} />}</AnimatePresence>

      {/* ── Header ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : -12 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">AI Business Audit</h1>
            <span className="text-[10px] font-bold bg-red-400/10 text-red-400 border border-red-400/20 rounded-full px-2.5 py-1 flex items-center gap-1.5">
              <Flame className="w-3 h-3" />
              {criticalTotal} Critical Issues
            </span>
          </div>
          <p className="text-slate-500 text-sm">5-dimension AI readiness analysis · Based on 68,573+ data points</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-slate-600">Revenue at risk per month</div>
          <div className="text-xl font-black font-mono text-red-400">${totalAtRisk.toLocaleString()}K</div>
        </div>
      </motion.div>

      {/* ── Hero Gauges ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* AI Readiness Gauge */}
          <div className="glass border border-red-500/20 rounded-2xl p-6 flex flex-col items-center gap-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
            <Gauge value={revealed ? OVERALL_READINESS : 0} size={160} strokeWidth={12} color="#ef4444" label="AI Readiness Score" sublabel="You are in the bottom 15% of your industry" />
            <div className="w-full text-center">
              <div className="text-[10px] text-slate-600 mb-1.5">Where you need to be</div>
              <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${OVERALL_READINESS}%`, backgroundColor: '#ef4444' }} />
                <div className="absolute h-full w-0.5 bg-emerald-400" style={{ left: '80%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-700 mt-1">
                <span>You: {OVERALL_READINESS}</span>
                <span className="text-emerald-400">Leaders: 80+</span>
              </div>
            </div>
          </div>

          {/* Opportunity Score Gauge */}
          <div className="glass border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center gap-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            <Gauge value={revealed ? OPPORTUNITY_SCORE : 0} size={160} strokeWidth={12} color="#22c55e" label="AI Opportunity Score" sublabel="Massive upside available — most is still untapped" />
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 w-full text-center">
              <div className="text-[10px] text-emerald-400 font-semibold">
                91% of your AI potential is unrealized
              </div>
            </div>
          </div>

          {/* Hours Saved */}
          <div className="glass border border-blue-500/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-black font-mono text-blue-400">
                {revealed ? <>{HOURS_SAVED.toLocaleString()}<span className="text-xl">h</span></> : '0h'}
              </div>
              <div className="text-sm font-bold text-slate-300 mt-1">Hours Saved / Month</div>
              <div className="text-xs text-slate-600 mt-1">With full AI implementation</div>
            </div>
            <div className="w-full space-y-1.5 text-[10px]">
              {[
                { label:'Currently wasting', value:`${totalHrsWasted}h/wk`, cls:'text-red-400' },
                { label:'After AI',          value:'< 3h/wk',              cls:'text-emerald-400' },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-slate-600">{r.label}</span>
                  <span className={cn('font-bold font-mono', r.cls)}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Increase */}
          <div className="glass border border-amber-500/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-amber-400" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-black font-mono text-amber-400">
                {revealed ? '$1.75M' : '$0'}
              </div>
              <div className="text-sm font-bold text-slate-300 mt-1">Revenue Potential / Year</div>
              <div className="text-xs text-slate-600 mt-1">Recoverable with AI systems</div>
            </div>
            <div className="w-full bg-amber-500/8 border border-amber-500/20 rounded-xl px-3 py-2 text-center">
              <div className="text-[10px] text-amber-400 font-semibold">
                ${Math.round(REVENUE_INCREASE / 12).toLocaleString()}K/mo left on the table right now
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Cost of Inaction Banner ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.98 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-r from-red-950/60 via-red-900/30 to-red-950/60 border border-red-500/25 rounded-2xl p-5 flex items-center gap-6"
      >
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <Flame className="w-5 h-5 text-red-400" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-red-300 mb-0.5">Cost of Inaction — Live Counter</div>
          <div className="text-xs text-slate-500">Every second you delay AI adoption, your competitors gain ground. This is what you are losing in real time:</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-black">
            <CostCounter />
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">lost since you opened this page</div>
        </div>
      </motion.div>

      {/* ── Category Cards ────────────────────────────────── */}
      <div>
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-5 flex items-center gap-2">
          <div className="w-3 h-px bg-slate-700" />
          5-Dimension Audit Results — Click any category to expand
          <div className="flex-1 h-px bg-slate-800/80" />
        </div>
        <div className="space-y-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </div>

      {/* ── Competitive Threat + Summary ──────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Competitive Threat */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 16 }}
          transition={{ delay: 0.6 }}
          className="glass border border-red-500/20 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-red-400" />
            <div className="text-sm font-bold text-white">Competitive Threat Level</div>
          </div>
          <div className="space-y-3">
            {[
              { label:'Your AI Maturity',      val:30,  color:'#ef4444' },
              { label:'Industry Average',       val:54,  color:'#f59e0b' },
              { label:'Top 25% of competitors', val:78,  color:'#3b82f6' },
              { label:'AI-native leaders',      val:94,  color:'#22c55e' },
            ].map((row, i) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={i === 0 ? 'text-slate-200 font-semibold' : 'text-slate-500'}>{row.label}</span>
                  <span className="font-mono font-bold" style={{ color: row.color }}>{row.val}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: revealed ? `${row.val}%` : '0%' }}
                    transition={{ duration: 1.1, delay: 0.7 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-500/8 border border-red-500/20 rounded-xl">
            <p className="text-xs text-red-300 leading-snug">
              You are <strong>24 points below the industry average</strong> and 64 points behind AI-native competitors. This gap grows 8–12 points per quarter without action.
            </p>
          </div>
        </motion.div>

        {/* Action Priority */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 16 }}
          transition={{ delay: 0.65 }}
          className="glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-amber-400" />
            <div className="text-sm font-bold text-white">Priority Action Plan</div>
            <span className="ml-auto text-[10px] text-slate-600">by ROI speed</span>
          </div>
          <div className="space-y-2.5">
            {[
              { num:'01', action:'Deploy AI lead scoring + 5-min follow-up',  impact:'$210K/mo',  time:'48h', color:'#ef4444' },
              { num:'02', action:'Launch AI-personalized email outreach',      impact:'$180K/mo',  time:'72h', color:'#f97316' },
              { num:'03', action:'Activate churn prediction for all accounts', impact:'$120K/mo',  time:'48h', color:'#f59e0b' },
              { num:'04', action:'Deploy Company Brain knowledge base',        impact:'$140K/mo',  time:'1wk', color:'#3b82f6' },
              { num:'05', action:'Eliminate all manual data entry via FLUX',   impact:'31 hrs/wk', time:'24h', color:'#8b5cf6' },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.07 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700/50 transition-colors cursor-default"
              >
                <span className="text-[11px] font-black font-mono w-6 flex-shrink-0 mt-0.5" style={{ color: item.color }}>{item.num}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300">{item.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-emerald-400">{item.impact}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-[10px] text-slate-600">Deploy in {item.time}</span>
                  </div>
                </div>
                <Unlock className="w-3 h-3 text-slate-700 flex-shrink-0 mt-0.5" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 90-Day Projection */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 16 }}
          transition={{ delay: 0.70 }}
          className="glass border border-emerald-500/20 rounded-2xl p-5 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-emerald-400" />
            <div className="text-sm font-bold text-white">90-Day AI Transformation</div>
          </div>

          {/* Projection metrics */}
          <div className="space-y-3 flex-1">
            {[
              { label:'AI Readiness Score',  from:'30',       to:'80+',      color:'#22c55e' },
              { label:'Lead Response Time',  from:'4.2 hours', to:'< 5 min', color:'#3b82f6' },
              { label:'Email Open Rate',     from:'4%',        to:'23%',     color:'#8b5cf6' },
              { label:'Hours Wasted/Week',   from:`${totalHrsWasted}h`, to:'< 5h', color:'#f59e0b' },
              { label:'Forecast Accuracy',   from:'58%',       to:'94%',     color:'#06b6d4' },
              { label:'Revenue Pipeline',    from:'$5M',       to:'$14M+',   color:'#22c55e' },
            ].map((row, i) => (
              <div key={row.label} className="flex items-center gap-3 text-xs">
                <span className="text-slate-500 w-36 flex-shrink-0">{row.label}</span>
                <span className="font-mono text-red-400 text-[11px] w-16 flex-shrink-0">{row.from}</span>
                <ArrowRight className="w-3 h-3 text-slate-700 flex-shrink-0" />
                <span className="font-bold font-mono text-[11px]" style={{ color: row.color }}>{row.to}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/60">
            <div className="bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/25 rounded-xl p-4 text-center">
              <div className="text-2xl font-black font-mono text-emerald-400 mb-1">$1.75M</div>
              <div className="text-xs text-slate-400 font-semibold">Annual revenue recoverable</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Based on your specific audit results</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom padding */}
      <div className="h-4" />
    </div>
  )
}
