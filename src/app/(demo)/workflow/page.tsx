'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus, Search, Brain, Star, Mail, RefreshCw,
  Calendar, Database, TrendingUp, Zap, Activity,
  CheckCircle2, AlertTriangle, ArrowDown, BarChart3,
  ChevronRight, Cpu, Radio, Wifi,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type StageColor = 'cyan'|'blue'|'purple'|'amber'|'emerald'|'teal'|'green'|'indigo'|'yellow'
type EventType  = 'info'|'success'|'warning'|'milestone'

interface StageConfig {
  id:             string
  name:           string
  icon:           React.ElementType
  agent:          string
  agentShort:     string
  desc:           string
  color:          StageColor
  avgTime:        string
  processedToday: number
  particleSpeed:  number
  particleCount:  number
}

interface ActiveLead {
  id:         string
  company:    string
  contact:    string
  value:      number
  stageIndex: number
  progress:   number
  score?:     number
  entered:    number
}

interface FeedEvent {
  id:         string
  stageIndex: number
  text:       string
  detail?:    string
  company:    string
  ts:         string
  type:       EventType
}

// ─── Stage Config ─────────────────────────────────────────────────────────────

const STAGES: StageConfig[] = [
  { id:'new-lead',     name:'New Lead Detected',       icon:UserPlus,   agent:'Lead Monitor',       agentShort:'MONITOR', desc:'Inbound lead captured from web, LinkedIn, or referral',              color:'cyan',    avgTime:'< 1s',      processedToday:47, particleSpeed:1.2, particleCount:3 },
  { id:'research',     name:'Research Agent',           icon:Search,     agent:'NEXUS Intelligence',  agentShort:'NEXUS',   desc:'Deep research: company, tech stack, funding, hiring signals',       color:'blue',    avgTime:'4.2s',      processedToday:44, particleSpeed:1.6, particleCount:2 },
  { id:'intelligence', name:'Lead Intelligence',        icon:Brain,      agent:'SIGIL Analytics',     agentShort:'SIGIL',   desc:'Intent scoring, buying signals, decision-maker mapping',            color:'purple',  avgTime:'2.1s',      processedToday:41, particleSpeed:1.4, particleCount:2 },
  { id:'scoring',      name:'Lead Scoring',             icon:Star,       agent:'ARIA Qualifier',      agentShort:'ARIA',    desc:'AI-powered ICP fit score and priority tier assignment',             color:'amber',   avgTime:'0.8s',      processedToday:39, particleSpeed:1.0, particleCount:3 },
  { id:'outreach',     name:'Personalized Outreach',    icon:Mail,       agent:'ECHO Outreach',       agentShort:'ECHO',    desc:'Custom email crafted from research, persona and pain-point data',  color:'emerald', avgTime:'3.4s',      processedToday:34, particleSpeed:1.5, particleCount:2 },
  { id:'followup',     name:'Follow-up Automation',     icon:RefreshCw,  agent:'ECHO Sequences',      agentShort:'ECHO',    desc:'Multi-touch follow-up sequence over 7–14 days',                    color:'teal',    avgTime:'Automated', processedToday:28, particleSpeed:2.0, particleCount:1 },
  { id:'meeting',      name:'Meeting Booked',           icon:Calendar,   agent:'ARIA Scheduler',      agentShort:'ARIA',    desc:'Discovery call confirmed, calendar invite sent to both parties',   color:'green',   avgTime:'2.3 days',  processedToday:12, particleSpeed:1.3, particleCount:2 },
  { id:'crm',          name:'CRM Updated',              icon:Database,   agent:'FLUX Sync',           agentShort:'FLUX',    desc:'All intelligence auto-synced to Salesforce in real time',          color:'indigo',  avgTime:'1.2s',      processedToday:12, particleSpeed:1.1, particleCount:2 },
  { id:'pipeline',     name:'Revenue Pipeline',         icon:TrendingUp, agent:'VANCE Forecast',      agentShort:'VANCE',   desc:'Active deal in pipeline — revenue projected and tracked',          color:'yellow',  avgTime:'—',         processedToday:12, particleSpeed:1.4, particleCount:1 },
]

// ─── Color Tokens ─────────────────────────────────────────────────────────────

const C: Record<StageColor, { bg:string; border:string; text:string; glow:string; hex:string; label:string }> = {
  cyan:    { bg:'bg-cyan-500/10',    border:'border-cyan-500/25',    text:'text-cyan-400',    glow:'shadow-cyan-500/20',    hex:'#06b6d4', label:'bg-cyan-400/15 text-cyan-400 border-cyan-400/20'    },
  blue:    { bg:'bg-blue-500/10',    border:'border-blue-500/25',    text:'text-blue-400',    glow:'shadow-blue-500/20',    hex:'#3b82f6', label:'bg-blue-400/15 text-blue-400 border-blue-400/20'    },
  purple:  { bg:'bg-purple-500/10',  border:'border-purple-500/25',  text:'text-purple-400',  glow:'shadow-purple-500/20',  hex:'#8b5cf6', label:'bg-purple-400/15 text-purple-400 border-purple-400/20' },
  amber:   { bg:'bg-amber-500/10',   border:'border-amber-500/25',   text:'text-amber-400',   glow:'shadow-amber-500/20',   hex:'#f59e0b', label:'bg-amber-400/15 text-amber-400 border-amber-400/20'  },
  emerald: { bg:'bg-emerald-500/10', border:'border-emerald-500/25', text:'text-emerald-400', glow:'shadow-emerald-500/20', hex:'#10b981', label:'bg-emerald-400/15 text-emerald-400 border-emerald-400/20' },
  teal:    { bg:'bg-teal-500/10',    border:'border-teal-500/25',    text:'text-teal-400',    glow:'shadow-teal-500/20',    hex:'#14b8a6', label:'bg-teal-400/15 text-teal-400 border-teal-400/20'    },
  green:   { bg:'bg-green-500/10',   border:'border-green-500/25',   text:'text-green-400',   glow:'shadow-green-500/20',   hex:'#22c55e', label:'bg-green-400/15 text-green-400 border-green-400/20'  },
  indigo:  { bg:'bg-indigo-500/10',  border:'border-indigo-500/25',  text:'text-indigo-400',  glow:'shadow-indigo-500/20',  hex:'#6366f1', label:'bg-indigo-400/15 text-indigo-400 border-indigo-400/20' },
  yellow:  { bg:'bg-yellow-500/10',  border:'border-yellow-500/25',  text:'text-yellow-400',  glow:'shadow-yellow-500/20',  hex:'#eab308', label:'bg-yellow-400/15 text-yellow-400 border-yellow-400/20' },
}

// ─── Initial State ────────────────────────────────────────────────────────────

const INIT_LEADS: ActiveLead[] = [
  { id:'l1', company:'TechCorp Global',   contact:'Sarah Thompson', value:480, stageIndex:6, progress:70, score:94, entered:Date.now()-3600000 },
  { id:'l2', company:'Nexwave Solutions', contact:'James Carter',   value:210, stageIndex:4, progress:40, score:82, entered:Date.now()-1800000 },
  { id:'l3', company:'Pinnacle Ventures', contact:'Emma Wilson',    value:520, stageIndex:7, progress:85, score:91, entered:Date.now()-7200000 },
  { id:'l4', company:'Vertex Analytics',  contact:'Mike Chen',      value:175, stageIndex:2, progress:55, score:76, entered:Date.now()-900000  },
  { id:'l5', company:'DataDrive Inc',     contact:'Lisa Park',      value:380, stageIndex:3, progress:20, score:88, entered:Date.now()-600000  },
  { id:'l6', company:'InnovateCo',        contact:'Ryan Brooks',    value:320, stageIndex:1, progress:65, score:79, entered:Date.now()-300000  },
]

const EXTRA_EVENTS: Array<Omit<FeedEvent,'id'|'ts'>> = [
  { stageIndex:1, text:'NEXUS found $40M Series B announcement',         detail:'TechCorp Global · ICP score +12 · Budget signal strong',       company:'TechCorp Global',   type:'success'   },
  { stageIndex:2, text:'SIGIL detected competitor displacement signal',  detail:'Vertex Analytics · Acme outage — 14 accounts evaluating now',  company:'Vertex Analytics',  type:'warning'   },
  { stageIndex:4, text:'Open rate 78% — reply received within 4 min',   detail:'DataDrive Inc · CMO replied personally · Hot lead flagged',    company:'DataDrive Inc',     type:'milestone' },
  { stageIndex:5, text:'Follow-up #3 sent — LinkedIn touch added',       detail:'Nexwave Solutions · InMail + email + call in sequence',        company:'Nexwave Solutions', type:'info'      },
  { stageIndex:3, text:'ICP score recalculated after new data',          detail:'InnovateCo · New CMO hired — authority level: HIGH',           company:'InnovateCo',        type:'success'   },
  { stageIndex:6, text:'Reschedule handled automatically by ARIA',       detail:'Pinnacle Ventures · New slot confirmed · No rep needed',       company:'Pinnacle Ventures', type:'info'      },
  { stageIndex:0, text:'NEXUS monitoring 847 target accounts live',      detail:'Watching for buying signals, job changes, funding events',     company:'System',            type:'info'      },
  { stageIndex:8, text:'VANCE updated Q4 forecast +$480K',              detail:'TechCorp Global · Close probability: 87% · 18 days to close', company:'TechCorp Global',   type:'milestone' },
]

function buildSeedEvent(lead: ActiveLead, offsetMs: number): FeedEvent {
  const templates: Record<number, { text:string; detail:string; type:EventType }> = {
    0: { text:`New lead captured — ${lead.company}`,                       detail:'Source: LinkedIn outbound · ICP match detected',                              type:'info'      },
    1: { text:`NEXUS researching ${lead.company}`,                         detail:'Scanning 200+ data sources, funding history, tech stack',                    type:'info'      },
    2: { text:`SIGIL: 3 buying signals detected at ${lead.company}`,       detail:'Hiring 4 sales ops roles · Competitor visited pricing · Budget Q4',          type:'success'   },
    3: { text:`Lead score: ${lead.score}/100 — Priority HIGH`,             detail:`${lead.company} is a strong ICP match — routed to outreach`,                 type:'success'   },
    4: { text:`ECHO generated personalized email for ${lead.company}`,     detail:'Tailored to CMO pain points · ROI hook · Case study included',               type:'info'      },
    5: { text:`Follow-up sequence activated for ${lead.company}`,          detail:'7-touch sequence over 14 days · A/B subject lines enabled',                  type:'info'      },
    6: { text:`🎉 Meeting booked — ${lead.company}`,                      detail:'Discovery call · Tomorrow 2:00 PM · Zoom link sent',                          type:'milestone' },
    7: { text:`FLUX synced ${lead.company} to Salesforce`,                 detail:'Contact, company, score, notes and next steps all logged',                   type:'success'   },
    8: { text:`${lead.company} entered Revenue Pipeline`,                  detail:`Deal value: $${lead.value}K · Stage: Discovery · VANCE projecting close Q4`, type:'milestone' },
  }
  const tpl = templates[lead.stageIndex]
  return {
    id: `seed-${lead.id}`,
    stageIndex: lead.stageIndex,
    company: lead.company,
    ts: new Date(Date.now() - offsetMs).toLocaleTimeString('en', { hour:'2-digit', minute:'2-digit', second:'2-digit' }),
    ...tpl,
  }
}

function nowStr() {
  return new Date().toLocaleTimeString('en', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
}

// ─── Particle ─────────────────────────────────────────────────────────────────

const CONN_H = 52

function Particle({ delay, speed, hex }: { delay: number; speed: number; hex: string }) {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
      style={{ width:6, height:6, backgroundColor:hex, boxShadow:`0 0 6px 2px ${hex}88`, top:-3 }}
      initial={{ y:0, opacity:0 }}
      animate={{ y: CONN_H+3, opacity:[0, 0.9, 0.9, 0] }}
      transition={{
        duration: speed, delay, repeat: Infinity, ease:'linear',
        opacity: { times:[0,0.08,0.92,1], duration:speed, delay, repeat:Infinity },
      }}
    />
  )
}

// ─── Stage Connector ──────────────────────────────────────────────────────────

function StageConnector({ from, to }: { from: StageConfig; to: StageConfig }) {
  const fHex = C[from.color].hex
  const tHex = C[to.color].hex
  return (
    <div className="relative flex items-center justify-center" style={{ height: CONN_H }}>
      {/* Gradient rail */}
      <div className="absolute left-1/2 -translate-x-px w-px top-0 bottom-0" style={{ background:`linear-gradient(to bottom, ${fHex}55, ${tHex}55)` }} />
      {/* Animated arrow */}
      <motion.div
        animate={{ y:[0,4,0] }}
        transition={{ duration:1.5, repeat:Infinity, ease:'easeInOut' }}
        className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center"
        style={{ backgroundColor:`${fHex}20`, border:`1px solid ${fHex}45` }}
      >
        <ArrowDown className="w-2.5 h-2.5" style={{ color:fHex }} />
      </motion.div>
      {/* Particles */}
      {Array.from({ length: from.particleCount }).map((_, i) => (
        <Particle
          key={i}
          delay={i * (from.particleSpeed / from.particleCount)}
          speed={from.particleSpeed}
          hex={fHex}
        />
      ))}
    </div>
  )
}

// ─── Stage Card ───────────────────────────────────────────────────────────────

function StageCard({ stage, index, leads }: { stage: StageConfig; index: number; leads: ActiveLead[] }) {
  const Icon      = stage.icon
  const palette   = C[stage.color]
  const here      = leads.filter(l => l.stageIndex === index)
  const isActive  = here.length > 0

  return (
    <motion.div
      initial={{ opacity:0, x:-20 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay: index * 0.07, duration:0.4 }}
      className={cn(
        'relative glass border rounded-2xl px-4 py-3 transition-all duration-500',
        isActive ? `${palette.bg} ${palette.border} shadow-lg ${palette.glow}` : 'border-slate-800/50',
      )}
    >
      {/* Active pulse badge */}
      {isActive && (
        <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inset-0 rounded-full opacity-70" style={{ backgroundColor: palette.hex + 'aa' }} />
          <span className="relative rounded-full h-3.5 w-3.5" style={{ backgroundColor: palette.hex }} />
        </span>
      )}

      <div className="flex items-center gap-3">
        {/* Icon bubble */}
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', palette.bg)}>
          <Icon className={cn('w-5 h-5', palette.text)} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-200">{stage.name}</span>
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full border', palette.label)}>
              {stage.agentShort}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight mt-0.5 truncate">{stage.desc}</p>
        </div>

        {/* Count */}
        <div className="flex-shrink-0 text-right space-y-0.5">
          <div className={cn('text-sm font-bold font-mono', palette.text)}>{stage.processedToday}</div>
          <div className="text-[10px] text-slate-700">today</div>
        </div>

        {/* Avg time */}
        <div className="flex-shrink-0 text-right pl-3 border-l border-slate-800/60 space-y-0.5 hidden md:block">
          <div className="text-xs font-mono text-slate-400">{stage.avgTime}</div>
          <div className="text-[10px] text-slate-700">avg</div>
        </div>
      </div>

      {/* Lead chips */}
      {here.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/40 flex flex-wrap gap-1.5">
          {here.map(lead => (
            <div key={lead.id} className="flex items-center gap-1.5">
              <div className="text-[10px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700/50 rounded-full px-2 py-0.5 flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inset-0 rounded-full opacity-70" style={{ backgroundColor: palette.hex }} />
                  <span className="relative rounded-full h-1.5 w-1.5" style={{ backgroundColor: palette.hex }} />
                </span>
                {lead.company}
              </div>
              <div className="w-10 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div animate={{ width:`${lead.progress}%` }} transition={{ duration:0.8 }} className="h-full rounded-full" style={{ backgroundColor: palette.hex }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Active Lead Row ──────────────────────────────────────────────────────────

function ActiveLeadRow({ lead, isNew }: { lead: ActiveLead; isNew: boolean }) {
  const stage   = STAGES[lead.stageIndex]
  const palette = C[stage.color]
  return (
    <motion.div
      layout
      initial={isNew ? { opacity:0, y:-8 } : false}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, height:0 }}
      className={cn(
        'p-3 rounded-xl border transition-all duration-300',
        isNew ? `${palette.bg} ${palette.border}` : 'bg-slate-900/40 border-slate-800/50',
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-200 truncate">{lead.company}</div>
          <div className="text-[10px] text-slate-600 truncate">{lead.contact}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs font-bold font-mono text-slate-300">${lead.value}K</div>
          {lead.score && <div className="text-[10px]" style={{ color: palette.hex }}>Score: {lead.score}</div>}
        </div>
      </div>
      {/* 9-segment progress track */}
      <div className="flex gap-0.5 items-center mb-2">
        {STAGES.map((s, i) => (
          <div
            key={s.id}
            className="flex-1 h-1 rounded-full transition-all duration-700"
            style={{
              backgroundColor: i < lead.stageIndex ? C[s.color].hex + 'cc' : i === lead.stageIndex ? C[s.color].hex + '60' : '#1e293b',
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full border', palette.label)}>
          {stage.name}
        </span>
        <span className="text-[10px] text-slate-700 font-mono">Step {lead.stageIndex + 1}/9</span>
      </div>
    </motion.div>
  )
}

// ─── Feed Row ─────────────────────────────────────────────────────────────────

const EV_ICON: Record<EventType, { icon: React.ElementType; cls: string }> = {
  info:      { icon: Activity,      cls: 'text-blue-400'    },
  success:   { icon: CheckCircle2,  cls: 'text-emerald-400' },
  warning:   { icon: AlertTriangle, cls: 'text-amber-400'   },
  milestone: { icon: Zap,           cls: 'text-yellow-400'  },
}

function FeedRow({ event, isNew }: { event: FeedEvent; isNew: boolean }) {
  const { icon: EIcon, cls } = EV_ICON[event.type]
  const stage   = STAGES[event.stageIndex]
  const palette = C[stage.color]
  return (
    <motion.div
      layout
      initial={isNew ? { opacity:0, y:-12 } : false}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, height:0, marginBottom:0 }}
      transition={{ duration:0.35 }}
      className={cn(
        'p-2.5 rounded-xl border mb-2 transition-all duration-300',
        isNew ? `${palette.bg} ${palette.border} shadow-md ${palette.glow}` : 'bg-slate-900/30 border-slate-800/40',
      )}
    >
      <div className="flex gap-2">
        <EIcon className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5', cls)} />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-300 leading-snug">{event.text}</div>
          {event.detail && <div className="text-[10px] text-slate-600 leading-snug mt-0.5">{event.detail}</div>}
          <div className="flex items-center gap-1.5 mt-1">
            <span className={cn('text-[10px] font-mono font-bold px-1 py-0.5 rounded border', palette.label)}>{stage.agentShort}</span>
            <span className="text-[10px] text-slate-700 font-mono">{event.ts}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, bgClass, icon: Icon, pulse }: {
  label: string; value: string; sub: string; bgClass: string; icon: React.ElementType; pulse?: boolean
}) {
  return (
    <div className="glass border border-slate-800/60 rounded-2xl p-4 flex items-center gap-3">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bgClass)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold font-mono text-white">{value}</div>
          {pulse && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 truncate">{label}</div>
        <div className="text-[10px] text-slate-700 truncate">{sub}</div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkflowPage() {
  const [leads, setLeads]             = useState<ActiveLead[]>(INIT_LEADS)
  const [feed, setFeed]               = useState<FeedEvent[]>([])
  const [newFeedIds, setNewFeedIds]   = useState<Set<string>>(new Set())
  const [newLeadIds, setNewLeadIds]   = useState<Set<string>>(new Set())
  const [leadsToday, setLeadsToday]   = useState(47)
  const [emailsSent, setEmailsSent]   = useState(34)
  const [meetings, setMeetings]       = useState(12)
  const [pipeline, setPipeline]       = useState(5.04)
  const poolIdx = useRef(0)
  const feedRef = useRef<HTMLDivElement>(null)

  // Seed initial feed from current lead states
  useEffect(() => {
    const seed = [...INIT_LEADS]
      .reverse()
      .map((lead, i) => buildSeedEvent(lead, (6 - i) * 45000))
    setFeed(seed)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Helper: flash a new ID then clear it
  const flash = (set: React.Dispatch<React.SetStateAction<Set<string>>>, id: string, ms = 4000) => {
    set(s => new Set([...s, id]))
    setTimeout(() => set(s => { const n = new Set(s); n.delete(id); return n }), ms)
  }

  // Helper: add a feed event
  const addFeed = (event: FeedEvent) => {
    setFeed(f => [event, ...f.slice(0, 29)])
    flash(setNewFeedIds, event.id)
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Auto-advance leads every 7s
  useEffect(() => {
    const t = setInterval(() => {
      setLeads(prev => {
        const eligible = prev.filter(l => l.stageIndex < STAGES.length - 1)
        if (!eligible.length) return prev
        const target = eligible[Math.floor(Math.random() * eligible.length)]

        return prev.map(l => {
          if (l.id !== target.id) return l
          const newProg = l.progress + Math.floor(Math.random() * 30 + 20)
          if (newProg >= 100) {
            const nextIdx = l.stageIndex + 1
            // Fire feed event
            setTimeout(() => {
              const templates: Record<number, { text:string; detail:string; type:EventType }> = {
                1: { text:`NEXUS researching ${l.company}`,                        detail:'Scanning 200+ data sources · Funding, tech stack, hiring',          type:'info'      },
                2: { text:`SIGIL: buying signals detected at ${l.company}`,        detail:'3 intent signals · Decision-maker mapped · Budget: confirmed',       type:'success'   },
                3: { text:`Lead score: ${l.score ?? 85}/100 — Priority HIGH`,      detail:`${l.company} is strong ICP match — queued for outreach`,             type:'success'   },
                4: { text:`ECHO generated email for ${l.company}`,                 detail:'ROI hook · Case study · Personalized to CMO pain points',            type:'info'      },
                5: { text:`Follow-up sequence live for ${l.company}`,              detail:'7-touch over 14 days · A/B subject lines · LinkedIn added',          type:'info'      },
                6: { text:`🎉 Meeting booked — ${l.company}`,                     detail:'Discovery call · Tomorrow 2:00 PM · Zoom link sent',                  type:'milestone' },
                7: { text:`FLUX synced ${l.company} to Salesforce`,                detail:'Contact, score, notes, next steps — all logged automatically',       type:'success'   },
                8: { text:`${l.company} entered Revenue Pipeline`,                 detail:`Deal: $${l.value}K · Stage: Discovery · VANCE projecting Q4 close`, type:'milestone' },
              }
              const tpl = templates[nextIdx] ?? { text:`${l.company} advanced to ${STAGES[nextIdx].name}`, detail:'', type:'info' as EventType }
              addFeed({ id:`adv-${Date.now()}-${l.id}`, stageIndex:nextIdx, company:l.company, ts:nowStr(), ...tpl })
              if (nextIdx === 4) setEmailsSent(c => c + 1)
              if (nextIdx === 6) setMeetings(c => c + 1)
              if (nextIdx === 8) setPipeline(c => Math.round((c + Math.random() * 0.3 + 0.1) * 100) / 100)
            }, 0)
            return { ...l, stageIndex: nextIdx, progress: Math.floor(Math.random() * 25) }
          }
          return { ...l, progress: Math.min(newProg, 95) }
        })
      })
    }, 7000)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Inject pool events every 3.5s
  useEffect(() => {
    const t = setInterval(() => {
      const src   = EXTRA_EVENTS[poolIdx.current % EXTRA_EVENTS.length]
      poolIdx.current++
      addFeed({ ...src, id:`pool-${Date.now()}`, ts:nowStr() })
    }, 3500)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // New lead enters every 18s
  useEffect(() => {
    const COS = ['Quantum Systems','Meridian Partners','CloudNine Corp','Atlas Group','Orion Tech']
    const CON = ['Alex Reed','Jordan Blake','Sam Rivera','Casey Morgan','Dana Kim']
    let ci = 0
    const t = setInterval(() => {
      const company = COS[ci % COS.length]
      const contact = CON[ci % CON.length]
      ci++
      const id  = `new-${Date.now()}`
      const ev: FeedEvent = {
        id:`ev-${id}`, stageIndex:0, company, type:'info', ts:nowStr(),
        text:`New lead captured — ${company}`,
        detail:'Source: LinkedIn outbound · ICP match detected',
      }
      const lead: ActiveLead = { id, company, contact, value: Math.floor(Math.random()*300+150), stageIndex:0, progress:10, entered:Date.now() }
      setLeads(prev => [lead, ...prev.slice(0, 5)])
      setLeadsToday(c => c + 1)
      addFeed(ev)
      flash(setNewLeadIds, id, 5000)
    }, 18000)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalToday = STAGES.reduce((s, st) => s + st.processedToday, 0)

  return (
    <div className="min-h-screen p-6 space-y-5">

      {/* Header */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Workflow</h1>
          <p className="text-slate-500 text-sm mt-0.5">Real-time AI Revenue Pipeline — mission control</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass border border-emerald-500/20 rounded-xl px-4 py-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold">All Systems Active</span>
          </div>
          <div className="flex items-center gap-2 glass border border-slate-700/50 rounded-xl px-4 py-2">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-slate-400">6 Agents Running</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Row */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Leads Processed Today"  value={leadsToday.toString()}           sub="+3 in last hour"              bgClass="bg-cyan-600"    icon={UserPlus}    pulse />
        <KpiCard label="Emails Generated"        value={emailsSent.toString()}           sub="ECHO agent · 94% open rate"  bgClass="bg-emerald-600" icon={Mail}        />
        <KpiCard label="Meetings Booked"         value={meetings.toString()}             sub="This week · 4 tomorrow"      bgClass="bg-green-600"   icon={Calendar}    />
        <KpiCard label="Pipeline Value Added"    value={`$${pipeline.toFixed(2)}M`}     sub="AI-sourced leads only"       bgClass="bg-yellow-600"  icon={TrendingUp}  pulse />
      </motion.div>

      {/* Main two-column layout */}
      <div className="flex gap-5 items-start">

        {/* LEFT: Pipeline */}
        <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }} className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-300">AI Revenue Pipeline</span>
            <span className="text-xs text-slate-600 ml-2">{totalToday} steps processed today</span>
            <div className="ml-auto flex items-center gap-1.5 text-[11px] text-emerald-500">
              <Wifi className="w-3 h-3" />
              Live
            </div>
          </div>

          <div className="relative">
            {STAGES.map((stage, i) => (
              <div key={stage.id}>
                <StageCard stage={stage} index={i} leads={leads} />
                {i < STAGES.length - 1 && <StageConnector from={stage} to={STAGES[i + 1]} />}
              </div>
            ))}
          </div>

          {/* End state */}
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:1 }}
            className="mt-4 glass border border-yellow-500/20 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Pipeline Complete ✓</div>
              <div className="text-xs text-slate-500">Lead fully processed · Deal active · VANCE monitoring for close signals</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-base font-bold font-mono text-yellow-400">{meetings}</div>
              <div className="text-[10px] text-slate-700">deals added</div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: Active Leads + Feed + Agent Status */}
        <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25 }} className="w-80 xl:w-96 flex-shrink-0 space-y-4">

          {/* Active Leads */}
          <div className="glass border border-slate-800/60 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/60 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-300">Active Leads</span>
              <span className="ml-auto text-[10px] bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 rounded-full px-2 py-0.5 font-semibold">
                {leads.length} in flight
              </span>
            </div>
            <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {leads.map(lead => (
                  <ActiveLeadRow key={lead.id} lead={lead} isNew={newLeadIds.has(lead.id)} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="glass border border-slate-800/60 rounded-2xl overflow-hidden" style={{ maxHeight:460 }}>
            <div className="px-4 py-3 border-b border-slate-800/60 flex items-center gap-2 flex-shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
                <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs font-bold text-slate-300">Live Activity Feed</span>
              <span className="ml-auto text-[10px] text-slate-700">{feed.length} events</span>
            </div>
            <div ref={feedRef} className="overflow-y-auto p-3" style={{ maxHeight:400 }}>
              <AnimatePresence mode="popLayout" initial={false}>
                {feed.map(event => (
                  <FeedRow key={event.id} event={event} isNew={newFeedIds.has(event.id)} />
                ))}
              </AnimatePresence>
              {feed.length === 0 && <div className="text-center py-8 text-slate-700 text-xs">Initializing...</div>}
            </div>
          </div>

          {/* Agent Status */}
          <div className="glass border border-slate-800/60 rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              Agent Status
            </div>
            <div className="space-y-2.5">
              {[
                { name:'NEXUS', task:'Researching 3 leads',   color:'text-blue-400',    hex:'#3b82f6' },
                { name:'SIGIL', task:'Scanning market intel',  color:'text-cyan-400',    hex:'#06b6d4' },
                { name:'ARIA',  task:'Scoring 7 leads',        color:'text-purple-400',  hex:'#8b5cf6' },
                { name:'ECHO',  task:'Running sequences',      color:'text-emerald-400', hex:'#10b981' },
                { name:'FLUX',  task:'Syncing to Salesforce',  color:'text-indigo-400',  hex:'#6366f1' },
                { name:'VANCE', task:'Updating Q4 forecast',   color:'text-yellow-400',  hex:'#eab308' },
              ].map(a => (
                <div key={a.name} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: a.hex }} />
                  <span className={cn('text-xs font-mono font-bold w-12 flex-shrink-0', a.color)}>{a.name}</span>
                  <span className="text-[10px] text-slate-600 flex-1 truncate">{a.task}</span>
                  <ChevronRight className="w-3 h-3 text-slate-800 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
