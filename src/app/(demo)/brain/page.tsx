'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Database, Mic, Mail, FileText, BookOpen, Users, Globe,
  Send, Zap, TrendingUp, AlertTriangle, Star, ChevronRight,
  RefreshCw, CheckCircle2, Clock, BarChart3, Lightbulb,
  ArrowRight, Target, Shield, Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

type BlockType = 'intro' | 'section' | 'bullets' | 'metrics' | 'summary' | 'warning' | 'divider'
type UrgencyLevel = 'critical' | 'high' | 'medium'
type SourceStatus = 'live' | 'synced' | 'syncing'

interface ContentBlock {
  type:   BlockType
  text?:  string
  items?: BulletItem[]
  stats?: MetricStat[]
}
interface BulletItem  { label?: string; text: string; badge?: string; badgeColor?: string; sub?: string }
interface MetricStat  { label: string; value: string; color?: string }
interface ChatMessage {
  id:        string
  role:      'user' | 'assistant'
  text?:     string
  blocks?:   ContentBlock[]
  sources?:  string[]
  followUps?: string[]
  actions?:  { label: string; color: string }[]
  ts:        string
}
interface DataSource  { id: string; name: string; icon: React.ElementType; records: number; synced: string; status: SourceStatus; color: string }
interface LeadAlert   { company: string; detail: string; value: number; urgency: UrgencyLevel; time: string; icon: React.ElementType }
interface Opportunity { title: string; detail: string; value: number; score: number; color: string }

// ─── Static Data ─────────────────────────────────────────────────────────────

const DATA_SOURCES: DataSource[] = [
  { id: 'crm',       name: 'CRM (Salesforce)',    icon: Database,  records: 12847,  synced: '30s ago', status: 'live',    color: '#3b82f6' },
  { id: 'calls',     name: 'Calls (Gong)',         icon: Mic,       records: 3847,   synced: 'Live',    status: 'live',    color: '#22c55e' },
  { id: 'emails',    name: 'Emails (Gmail)',        icon: Mail,      records: 48392,  synced: '2m ago',  status: 'synced',  color: '#8b5cf6' },
  { id: 'documents', name: 'Documents',             icon: FileText,  records: 1247,   synced: '15m ago', status: 'synced',  color: '#f59e0b' },
  { id: 'sops',      name: 'SOPs (Notion)',         icon: BookOpen,  records: 384,    synced: '1h ago',  status: 'synced',  color: '#06b6d4' },
  { id: 'kb',        name: 'Knowledge Base',        icon: Globe,     records: 2847,   synced: '30m ago', status: 'synced',  color: '#ec4899' },
  { id: 'linkedin',  name: 'LinkedIn Sales Nav',    icon: Users,     records: 8203,   synced: 'Live',    status: 'live',    color: '#0ea5e9' },
]

const LEAD_ALERTS: LeadAlert[] = [
  { company: 'TechCorp Global',    detail: 'CFO opened proposal 3× in 24h — high buying signal',       value: 480000, urgency: 'critical', time: '4m ago',  icon: AlertTriangle },
  { company: 'Pinnacle Ventures',  detail: '14 days silence in negotiation — deal going dark',          value: 520000, urgency: 'critical', time: '18m ago', icon: AlertTriangle },
  { company: 'Vertex Analytics',   detail: 'CMO visited your pricing page 4× — not in pipeline yet',   value: 175000, urgency: 'high',     time: '32m ago', icon: Star },
  { company: 'InnovateCo',         detail: 'Champion went quiet — new decision-maker detected',         value: 320000, urgency: 'high',     time: '1h ago',  icon: AlertTriangle },
  { company: 'DataDrive Inc',      detail: 'Champion viewed 3 competitor profiles on LinkedIn',         value: 380000, urgency: 'high',     time: '2h ago',  icon: Target },
]

const OPPORTUNITIES: Opportunity[] = [
  { title: 'APAC Expansion',           detail: '284 ICP-matched companies, zero competitor presence', value: 2100000, score: 87, color: '#22c55e' },
  { title: 'Customer Expansion',       detail: '8 accounts at 90%+ capacity — ready to upsell',      value: 840000,  score: 92, color: '#3b82f6' },
  { title: 'Competitor Displacement',  detail: 'Acme outage — 14 enterprise accounts evaluating',     value: 520000,  score: 78, color: '#f59e0b' },
  { title: 'Stalled Deal Revival',     detail: '6 late-stage deals, 34% historical re-engage rate',   value: 1200000, score: 65, color: '#8b5cf6' },
]

const INSIGHTS = [
  { text: 'Win rate up 12% vs last quarter — driven by ROI-first messaging', icon: TrendingUp, color: 'text-emerald-400' },
  { text: '"Too expensive" objection in 58% of calls — needs pricing narrative', icon: Lightbulb, color: 'text-amber-400' },
  { text: 'Best follow-up window: Tuesday 10–11am (3.4× higher reply rate)', icon: Clock, color: 'text-blue-400' },
]

// ─── Pre-built AI Responses ──────────────────────────────────────────────────

const RESPONSES: Record<string, ContentBlock[]> = {

  'follow-up': [
    { type: 'intro', text: "I've analyzed 12,847 CRM records, 847 emails, and behavioral engagement data across your pipeline. Here are the leads requiring immediate attention:" },
    { type: 'section', text: '🔴 CRITICAL — Respond within 2 hours' },
    { type: 'bullets', items: [
      { label: '$480K', text: 'TechCorp Global — CFO Sarah Thompson opened your proposal 3× in the last 24h, spent 8 min on pricing, and CC\'d procurement. Strongest buying signal this quarter.', badge: 'High Intent', badgeColor: 'red', sub: 'Action: Call now — offer to walk through ROI model live' },
      { label: '$520K', text: 'Pinnacle Ventures — 14 days of silence after negotiation call. Deals at this stage with 14+ days silence close at 12% without intervention.', badge: 'Stalled', badgeColor: 'red', sub: 'Action: VP-level executive outreach today — not rep' },
    ]},
    { type: 'section', text: '🟡 High Priority — Respond today' },
    { type: 'bullets', items: [
      { label: '$320K', text: 'InnovateCo — Champion Emma Davis went on leave. A new CMO joined their Slack channel 2 days ago. Window to introduce yourself is closing.', badge: 'New Stakeholder', badgeColor: 'amber' },
      { label: '$380K', text: 'DataDrive Inc — Proposal sent 8 days ago. LinkedIn shows your champion viewed 4 competitor profiles this week.', badge: 'Risk', badgeColor: 'amber' },
      { label: '$250K', text: 'Meridian Partners — Just announced a $40M Series B. Budget has likely expanded. Perfect re-engagement timing.', badge: 'Opportunity', badgeColor: 'blue' },
    ]},
    { type: 'metrics', stats: [
      { label: 'Leads Flagged', value: '5', color: 'text-white' },
      { label: 'Combined Value', value: '$1.95M', color: 'text-emerald-400' },
      { label: 'Avg Days Silent', value: '9.4', color: 'text-amber-400' },
      { label: 'Recovery Rate', value: '34%', color: 'text-blue-400' },
    ]},
    { type: 'summary', text: 'ECHO Agent has pre-written outreach sequences for all 5 leads — personalized to each contact\'s last engagement. Ready to deploy with one click.' },
  ],

  'calls': [
    { type: 'intro', text: "I've analyzed 12 sales calls from last week (9h 47m of recorded conversations across discovery, demo, and negotiation stages)." },
    { type: 'section', text: '📞 Volume & Performance' },
    { type: 'bullets', items: [
      { text: '4 Discovery calls · 6 Demo calls · 2 Negotiation calls' },
      { text: 'Average call score: 81/100 — up from 74 the previous week' },
      { text: 'Best performing day: Tuesday (3 calls, all advanced to next stage)' },
      { text: 'Avg talk-to-listen ratio: 38% rep / 62% prospect — ideal range' },
    ]},
    { type: 'section', text: '🎯 Critical Patterns Detected' },
    { type: 'bullets', items: [
      { label: '58%', text: '"Too expensive" objection — appeared in 7 of 12 calls. Reps are hitting resistance before establishing ROI.', badge: 'Coaching Needed', badgeColor: 'amber' },
      { label: '45%', text: '"We\'re evaluating [competitor]" — Acme mentioned in 4 calls. Battle card needs updating after their pricing change.', badge: 'Competitive', badgeColor: 'red' },
      { label: '73%', text: 'Calls that included a customer success story in minute 1-3 had 73% higher advancement rate. Winning pattern confirmed.', badge: 'Winner', badgeColor: 'emerald' },
    ]},
    { type: 'section', text: '📈 Rep Performance Leaderboard' },
    { type: 'bullets', items: [
      { label: '#1', text: 'Marcus Webb — 91/100 avg · 3 of 4 calls advanced to proposal (75% conversion)', badge: 'Top Performer', badgeColor: 'emerald' },
      { label: '#2', text: 'Sarah Chen — 84/100 avg · 2 of 3 calls advanced · Strong on discovery', badge: 'Strong', badgeColor: 'blue' },
      { label: '#3', text: 'Lisa Park — 71/100 avg · 1 of 3 advanced · Lost momentum during objection handling', badge: 'Coaching', badgeColor: 'amber' },
    ]},
    { type: 'warning', text: '⚡ ARIA flagged a high-urgency signal: Nexwave Solutions mentioned "we need to decide before Q4 budget freeze" — this was not followed up on. Recommend immediate outreach today.' },
    { type: 'summary', text: 'Share Marcus Webb\'s TechCorp call recording as team training material. Call Analysis Agent has clipped the 3 best moments for coaching.' },
  ],

  'opportunities': [
    { type: 'intro', text: "Cross-referencing 7 data sources — CRM, usage analytics, market intelligence, LinkedIn signals, email engagement, call transcripts, and funding data — here are your highest-value opportunities ranked by probability × impact:" },
    { type: 'bullets', items: [
      { label: '#1 · $2.1M', text: 'APAC Expansion — SIGIL identified 284 ICP-matched companies in Singapore, Australia, and Japan with zero competitor presence. Your compliance features uniquely suit APAC regulations. First-mover window: ~90 days.', badge: '87% confidence', badgeColor: 'emerald', sub: 'Action: Launch APAC outreach campaign via Outreach Agent this week' },
      { label: '#2 · $840K', text: 'Existing Customer Expansion — 8 accounts at 90%+ product usage. CloudNine, DataStream, and 6 others show usage curves that historically precede expansion by 30-45 days. Warm relationship — no new sales cycle.', badge: '92% confidence', badgeColor: 'emerald', sub: 'Action: Customer Success team introductions scheduled by FLUX' },
      { label: '#3 · $520K', text: 'Competitor Displacement — Acme Inc suffered a 2-hour outage Wednesday. 14 of their enterprise customers visited your pricing page that same day. Strike window is open now.', badge: '78% confidence', badgeColor: 'blue', sub: 'Action: Targeted campaign ready — ECHO has drafted outreach for all 14' },
      { label: '#4 · $1.2M', text: 'Stalled Deal Revival — 6 late-stage deals silent for 30-60 days. Historical win rate when re-engaged with a new champion approach: 34%. NEXUS identified 4 new stakeholders via LinkedIn.', badge: '65% confidence', badgeColor: 'amber', sub: 'Action: NEXUS has mapped new decision-makers — briefings prepared' },
      { label: '#5 · $380K', text: 'Referral Pipeline — Your top 3 customers (NPS 9-10) have never been asked for referrals. Each has 3-5 LinkedIn connections at ICP-matched companies. One warm intro = ~$127K in pipeline on average.', badge: '71% confidence', badgeColor: 'blue', sub: 'Action: Referral outreach sequence prepared for approval' },
    ]},
    { type: 'metrics', stats: [
      { label: 'Total Opportunity', value: '$5.04M', color: 'text-emerald-400' },
      { label: 'Avg Confidence', value: '78.6%', color: 'text-blue-400' },
      { label: 'Sources Used', value: '7', color: 'text-purple-400' },
      { label: 'Action Items', value: '14', color: 'text-amber-400' },
    ]},
    { type: 'summary', text: 'FLUX Agent is ready to assign all 14 action items to the appropriate agents and sales reps. Estimated revenue impact if all are executed: +$1.8M this quarter.' },
  ],

  'focus': [
    { type: 'intro', text: "Synthesizing pipeline health, agent outputs, rep performance, and historical close patterns — here is your team's optimal weekly plan:" },
    { type: 'section', text: '🚨 Priority 1 — Close TechCorp Global ($480K)' },
    { type: 'bullets', items: [
      { text: 'CFO engagement is at peak — proposal opened 3× in 24h, pricing page visited' },
      { text: 'Every day of delay decreases close probability by ~3% (historical data)' },
      { text: 'VANCE forecasts 89% close probability if contact happens today', badge: 'Act Now', badgeColor: 'red' },
    ]},
    { type: 'section', text: '🛡️ Priority 2 — Defend $1.95M in stalled pipeline' },
    { type: 'bullets', items: [
      { text: 'Re-engage Pinnacle Ventures with VP-level outreach before Friday' },
      { text: 'Introduce yourself to InnovateCo\'s new CMO (window closing in 3 days)' },
      { text: 'DataDrive: send competitive comparison before they go to Acme' },
    ]},
    { type: 'section', text: '📈 Priority 3 — Revenue Offense' },
    { type: 'bullets', items: [
      { text: 'Launch APAC prospect sequence — 284 ICP matches waiting', badge: '$2.1M upside', badgeColor: 'emerald' },
      { text: 'Activate competitor displacement campaign for Acme\'s at-risk accounts' },
      { text: 'Request referrals from 3 high-NPS customers (5-min ask, ~$127K per intro)' },
    ]},
    { type: 'section', text: '🎓 Priority 4 — Team Performance' },
    { type: 'bullets', items: [
      { text: 'Schedule 30-min objection-handling coaching with Lisa Park — could lift close rate 15-20%' },
      { text: 'Share Marcus Webb\'s TechCorp call as team training material (91/100 score)' },
      { text: 'Update Acme battle card with new pricing intel from SIGIL' },
    ]},
    { type: 'summary', text: 'Executing this plan this week has an estimated revenue impact of +$640K based on historical conversion rates. FLUX has pre-assigned all tasks.' },
  ],

  'competitors': [
    { type: 'intro', text: "Scanning 200+ intelligence feeds across news, review platforms, LinkedIn, job boards, and pricing pages. Here's what competitors are doing right now:" },
    { type: 'section', text: '🔴 Acme Inc — Primary Threat' },
    { type: 'bullets', items: [
      { text: 'Product outage Wednesday (2h downtime) — 14 enterprise customers visited your pricing page immediately after', badge: 'Opportunity', badgeColor: 'emerald' },
      { text: 'Dropped pricing 30% last month — burning cash to defend market share (G2 reviews confirm confusion)', badge: 'Weakness', badgeColor: 'amber' },
      { text: 'Just posted 14 engineering jobs — major product rewrite likely (instability signal)', badge: 'Risk for them', badgeColor: 'blue' },
      { text: '3 enterprise customers migrated away this month — migration docs shared in your knowledge base', badge: 'Intel', badgeColor: 'purple' },
    ]},
    { type: 'section', text: '🟡 TechRival — Growing Threat' },
    { type: 'bullets', items: [
      { text: 'Launched new analytics feature — directly competes with your reporting module. 12 of your prospects are evaluating them.', badge: 'Watch', badgeColor: 'amber' },
      { text: 'NPS dropped from 58 → 41 on G2 (yours: 72) — quality issues after rapid growth', badge: 'Advantage', badgeColor: 'emerald' },
      { text: 'CEO announced "enterprise pivot" on LinkedIn — changing their ICP, may vacate your mid-market segment' },
    ]},
    { type: 'section', text: '📊 Market Intelligence' },
    { type: 'bullets', items: [
      { text: 'Your category growing 23% YoY — rising tide for everyone, but first-mover advantage in APAC is critical' },
      { text: 'Gartner added your space to the Magic Quadrant (draft) — analyst briefing opportunity in Q4' },
      { text: '3 VC firms increased investment in this category — expect 2-3 new entrants in 6-12 months' },
    ]},
    { type: 'metrics', stats: [
      { label: 'Competitors Tracked', value: '12', color: 'text-blue-400' },
      { label: 'Opportunities Found', value: '14 accounts', color: 'text-emerald-400' },
      { label: 'Win Rate vs Acme', value: '67%', color: 'text-emerald-400' },
      { label: 'Win Rate vs TechRival', value: '58%', color: 'text-blue-400' },
    ]},
    { type: 'summary', text: 'SIGIL is monitoring all 12 competitors in real-time. Battle cards for Acme and TechRival have been updated. Displacement campaign for Acme\'s accounts is ready to launch.' },
  ],

  'generic': [
    { type: 'intro', text: "I've analyzed your company's data across all 7 connected sources to answer your question. Scanning 68,573+ records including CRM activity, email history, call transcripts, and market intelligence..." },
    { type: 'bullets', items: [
      { text: 'NEXUS cross-referenced your pipeline data and found 3 relevant patterns in your current deals' },
      { text: 'SIGIL scanned 200+ external sources for market context related to your query' },
      { text: 'ARIA matched your question against historical lead and customer data for pattern recognition' },
    ]},
    { type: 'summary', text: 'For a deeper analysis on this specific topic, I can assign a research task to SIGIL or pull a full report via Reporting Agent. Would you like me to do that?' },
  ],
}

const SUGGESTED_PROMPTS = [
  { key: 'follow-up',   label: 'Which leads need follow-up?',              icon: AlertTriangle, color: 'text-red-400',    bg: 'bg-red-400/8 border-red-400/20' },
  { key: 'calls',       label: "Summarize last week's sales calls.",         icon: Mic,           color: 'text-purple-400', bg: 'bg-purple-400/8 border-purple-400/20' },
  { key: 'opportunities', label: 'What are our biggest revenue opportunities?', icon: TrendingUp,  color: 'text-emerald-400',bg: 'bg-emerald-400/8 border-emerald-400/20' },
  { key: 'focus',       label: 'What should the team focus on this week?',  icon: Target,        color: 'text-blue-400',   bg: 'bg-blue-400/8 border-blue-400/20' },
  { key: 'competitors', label: 'Show me competitor intelligence.',           icon: Shield,        color: 'text-amber-400',  bg: 'bg-amber-400/8 border-amber-400/20' },
]

// ─── Initial conversation (pre-populated) ───────────────────────────────────

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'u1', role: 'user',
    text: 'Which leads need follow-up today?',
    ts: '9:14 AM',
  },
  {
    id: 'a1', role: 'assistant',
    blocks: RESPONSES['follow-up'],
    sources: ['CRM (Salesforce)', 'Emails (Gmail)', 'LinkedIn Sales Nav'],
    followUps: ['Draft follow-up emails for all 5', 'Show me the full pipeline view', 'What is the risk score for each?'],
    actions: [
      { label: 'Deploy ECHO Sequences', color: 'bg-emerald-500 text-slate-950' },
      { label: 'View in CRM', color: 'bg-slate-700 text-slate-200' },
    ],
    ts: '9:14 AM',
  },
  {
    id: 'u2', role: 'user',
    text: "Summarize last week's sales calls.",
    ts: '9:21 AM',
  },
  {
    id: 'a2', role: 'assistant',
    blocks: RESPONSES['calls'],
    sources: ['Calls (Gong)', 'CRM (Salesforce)', 'Knowledge Base'],
    followUps: ["Show me Marcus Webb's best call", 'Schedule coaching for Lisa Park', 'Update the Acme battle card'],
    actions: [
      { label: 'Schedule Coaching Session', color: 'bg-blue-500 text-white' },
      { label: 'Share to Slack', color: 'bg-slate-700 text-slate-200' },
    ],
    ts: '9:22 AM',
  },
  {
    id: 'u3', role: 'user',
    text: 'What are our biggest revenue opportunities right now?',
    ts: '9:31 AM',
  },
  {
    id: 'a3', role: 'assistant',
    blocks: RESPONSES['opportunities'],
    sources: ['CRM (Salesforce)', 'LinkedIn Sales Nav', 'Calls (Gong)', 'Emails (Gmail)'],
    followUps: ['Launch the APAC campaign', 'Assign all action items to agents', 'Show expansion-ready accounts'],
    actions: [
      { label: 'Assign to FLUX Agent', color: 'bg-emerald-500 text-slate-950' },
      { label: 'Generate Full Report', color: 'bg-slate-700 text-slate-200' },
    ],
    ts: '9:32 AM',
  },
]

const BADGE_COLORS: Record<string, string> = {
  red:     'bg-red-400/15 text-red-400 border-red-400/20',
  amber:   'bg-amber-400/15 text-amber-400 border-amber-400/20',
  emerald: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/20',
  blue:    'bg-blue-400/15 text-blue-400 border-blue-400/20',
  purple:  'bg-purple-400/15 text-purple-400 border-purple-400/20',
}

const URGENCY_STYLES: Record<UrgencyLevel, string> = {
  critical: 'border-l-red-400 bg-red-400/5',
  high:     'border-l-amber-400 bg-amber-400/5',
  medium:   'border-l-blue-400 bg-blue-400/5',
}

// ─── Rich Content Renderer ──────────────────────────────────────────────────

function RichContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        switch (block.type) {

          case 'intro':
            return <p key={i} className="text-sm text-slate-300 leading-relaxed">{block.text}</p>

          case 'section':
            return (
              <div key={i} className="pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{block.text}</p>
              </div>
            )

          case 'divider':
            return <div key={i} className="border-t border-slate-800/60" />

          case 'bullets':
            return (
              <ul key={i} className="space-y-2.5">
                {block.items?.map((item, j) => (
                  <li key={j} className="flex gap-2.5">
                    {item.label && (
                      <span className="text-xs font-bold font-mono text-slate-500 flex-shrink-0 pt-0.5 w-16 text-right">{item.label}</span>
                    )}
                    <div className={cn('flex-1', !item.label && 'pl-2 border-l border-slate-800/60')}>
                      <div className="flex items-start gap-2 flex-wrap">
                        <p className="text-sm text-slate-300 leading-snug flex-1">{item.text}</p>
                        {item.badge && (
                          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0', BADGE_COLORS[item.badgeColor ?? 'blue'])}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.sub && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">{item.sub}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )

          case 'metrics':
            return (
              <div key={i} className="grid grid-cols-4 gap-2 pt-1">
                {block.stats?.map((s, j) => (
                  <div key={j} className="bg-slate-900/60 rounded-xl p-3 text-center border border-slate-800/60">
                    <div className={cn('text-base font-bold font-mono', s.color ?? 'text-white')}>{s.value}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            )

          case 'summary':
            return (
              <div key={i} className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-3 flex gap-2.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-300 leading-relaxed">{block.text}</p>
              </div>
            )

          case 'warning':
            return (
              <div key={i} className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 flex gap-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300 leading-relaxed">{block.text}</p>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

// ─── Message Bubble ─────────────────────────────────────────────────────────

function MessageBubble({ msg, isNew }: { msg: ChatMessage; isNew?: boolean }) {
  if (msg.role === 'user') {
    return (
      <motion.div
        initial={isNew ? { opacity: 0, y: 12, x: 20 } : false}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex justify-end"
      >
        <div className="max-w-[70%]">
          <div className="bg-gradient-to-br from-emerald-600/80 to-cyan-600/70 rounded-2xl rounded-tr-sm px-4 py-3 border border-emerald-500/20">
            <p className="text-sm text-white">{msg.text}</p>
          </div>
          <div className="text-[10px] text-slate-700 text-right mt-1 pr-1">{msg.ts}</div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="flex gap-3"
    >
      {/* Brain avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-purple-500/20">
        <Brain className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 min-w-0 max-w-[calc(100%-44px)]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-purple-400">Company Brain</span>
          <span className="text-[10px] text-slate-700">{msg.ts}</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full ml-auto">
            AI · Enterprise
          </span>
        </div>

        {/* Content */}
        <div className="glass border border-slate-800/60 rounded-2xl rounded-tl-sm p-4 space-y-4">
          {msg.blocks && <RichContent blocks={msg.blocks} />}
          {msg.text && <p className="text-sm text-slate-300 leading-relaxed">{msg.text}</p>}

          {/* Sources */}
          {msg.sources && msg.sources.length > 0 && (
            <div className="pt-3 border-t border-slate-800/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-600 mr-1">Sources:</span>
                {msg.sources.map(src => (
                  <span key={src} className="text-[10px] bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/50">
                    {src}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {msg.actions && msg.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {msg.actions.map(action => (
                <button key={action.label} className={cn('text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-80', action.color)}>
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Follow-ups */}
        {msg.followUps && msg.followUps.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {msg.followUps.map(q => (
              <button
                key={q}
                className="text-[11px] text-slate-500 hover:text-slate-300 bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/60 hover:border-slate-700/60 rounded-full px-2.5 py-1 transition-all duration-150 cursor-pointer flex items-center gap-1"
              >
                <ChevronRight className="w-2.5 h-2.5" />
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Typing Indicator ───────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <div className="glass border border-slate-800/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, delay, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-purple-400"
            />
          ))}
        </div>
        <span className="text-xs text-slate-500 ml-1">Analyzing 68,573 records...</span>
      </div>
    </div>
  )
}

// ─── Left Sidebar ───────────────────────────────────────────────────────────

function LeftSidebar({ sources, activeSources }: { sources: DataSource[]; activeSources: Set<string> }) {
  const total = sources.reduce((s, src) => s + src.records, 0)

  return (
    <div className="w-56 flex-shrink-0 border-r border-slate-800/60 flex flex-col overflow-hidden"
      style={{ background: 'rgba(4, 9, 20, 0.8)' }}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-slate-300">Data Sources</span>
          <span className="ml-auto relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
        </div>
        <div className="text-[10px] text-slate-600">
          {total.toLocaleString()}+ records connected
        </div>
      </div>

      {/* Sources list */}
      <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {sources.map((src) => {
          const isActive = activeSources.has(src.id)
          const Icon = src.icon
          return (
            <motion.div
              key={src.id}
              whileHover={{ x: 2 }}
              className={cn(
                'flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all duration-200',
                isActive
                  ? 'bg-slate-800/60 border border-slate-700/60'
                  : 'hover:bg-slate-800/40 border border-transparent',
              )}
            >
              {/* Icon */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: src.color + '18' }}>
                <Icon className="w-3.5 h-3.5" style={{ color: src.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-300 truncate leading-tight">{src.name}</div>
                <div className="text-[10px] text-slate-600 leading-tight">{src.records.toLocaleString()} records</div>
              </div>

              {/* Status dot */}
              <div className={cn(
                'w-1.5 h-1.5 rounded-full flex-shrink-0',
                src.status === 'live'    && 'bg-emerald-400 animate-pulse',
                src.status === 'syncing' && 'bg-blue-400 animate-pulse',
                src.status === 'synced'  && 'bg-slate-600',
              )} />
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="text-[10px] text-slate-600 space-y-1">
          <div className="flex justify-between"><span>Last full sync</span><span className="text-slate-500">4m ago</span></div>
          <div className="flex justify-between"><span>Live connections</span><span className="text-emerald-400">3 active</span></div>
        </div>
      </div>
    </div>
  )
}

// ─── Right Sidebar ───────────────────────────────────────────────────────────

function RightSidebar({ alerts, opportunities }: { alerts: LeadAlert[]; opportunities: Opportunity[] }) {
  return (
    <div className="w-64 flex-shrink-0 border-l border-slate-800/60 flex flex-col overflow-hidden"
      style={{ background: 'rgba(4, 9, 20, 0.8)' }}
    >
      <div className="flex-1 overflow-y-auto">

        {/* Lead Alerts */}
        <div className="p-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-bold text-slate-300">Lead Alerts</span>
            <span className="ml-auto text-[10px] bg-red-400/15 text-red-400 px-1.5 py-0.5 rounded-full border border-red-400/20 font-semibold">
              {alerts.filter(a => a.urgency === 'critical').length} critical
            </span>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, i) => {
              const AlertIcon = alert.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={cn(
                    'rounded-xl p-2.5 border-l-2 cursor-pointer hover:brightness-110 transition-all',
                    URGENCY_STYLES[alert.urgency],
                  )}
                >
                  <div className="flex items-start gap-2">
                    <AlertIcon className={cn('w-3 h-3 flex-shrink-0 mt-0.5', alert.urgency === 'critical' ? 'text-red-400' : 'text-amber-400')} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate">{alert.company}</div>
                      <div className="text-[10px] text-slate-500 leading-snug mt-0.5">{alert.detail}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-mono text-slate-500">${(alert.value / 1000).toFixed(0)}K</span>
                        <span className="text-[10px] text-slate-700">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Revenue Opportunities */}
        <div className="p-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300">Revenue Opportunities</span>
          </div>
          <div className="space-y-2">
            {opportunities.map((opp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60 cursor-pointer hover:border-slate-700/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-200">{opp.title}</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: opp.color }}>
                    ${(opp.value / 1_000_000).toFixed(1)}M
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight mb-2">{opp.detail}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${opp.score}%` }}
                      transition={{ duration: 1.2, delay: 0.5 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: opp.color }}
                    />
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: opp.color }}>{opp.score}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">AI Insights</span>
          </div>
          <div className="space-y-2">
            {INSIGHTS.map((ins, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/50"
              >
                <ins.icon className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5', ins.color)} />
                <p className="text-[11px] text-slate-400 leading-snug">{ins.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Brain status footer */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="flex items-center gap-2 text-[10px] text-slate-600">
          <Activity className="w-3 h-3 text-emerald-500" />
          <span>Brain active · All agents reporting</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function BrainPage() {
  const [messages, setMessages]   = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput]         = useState('')
  const [isTyping, setIsTyping]   = useState(false)
  const [activeSources, setActiveSources] = useState<Set<string>>(new Set())
  const [liveAlerts, setLiveAlerts]       = useState<LeadAlert[]>(LEAD_ALERTS)
  const [newAlertFlash, setNewAlertFlash] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Add a new live alert every 12 seconds
  useEffect(() => {
    const EXTRA_ALERTS: LeadAlert[] = [
      { company: 'Nexwave Solutions', detail: 'New stakeholder joined — CMO added to deal room', value: 210000, urgency: 'high', time: 'Just now', icon: Star },
      { company: 'Quantum Systems',   detail: 'RFP received — responds to proposal you sent 6 days ago', value: 320000, urgency: 'critical', time: 'Just now', icon: AlertTriangle },
    ]
    let idx = 0
    const t = setInterval(() => {
      const alert = EXTRA_ALERTS[idx % EXTRA_ALERTS.length]
      idx++
      setLiveAlerts(prev => [{ ...alert, time: 'Just now' }, ...prev.slice(0, 4)])
      setNewAlertFlash(true)
      setTimeout(() => setNewAlertFlash(false), 3000)
    }, 14000)
    return () => clearInterval(t)
  }, [])

  const sendMessage = async (text: string, promptKey?: string) => {
    if (!text.trim() || isTyping) return

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`, role: 'user', text, ts: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Figure out which pre-built response to use
    const key = promptKey ?? 'generic'
    const blocks = RESPONSES[key] ?? RESPONSES['generic']

    // Highlight sources used
    const sourceMap: Record<string, string[]> = {
      'follow-up':    ['crm', 'emails', 'linkedin'],
      'calls':        ['calls', 'crm', 'kb'],
      'opportunities':['crm', 'linkedin', 'calls', 'emails'],
      'focus':        ['crm', 'calls', 'sops'],
      'competitors':  ['kb', 'documents', 'linkedin'],
    }
    const usedSources = new Set(sourceMap[key] ?? [])
    setActiveSources(usedSources)
    setTimeout(() => setActiveSources(new Set()), 8000)

    await new Promise(r => setTimeout(r, key === 'generic' ? 1800 : 2200))

    const sourceLabelMap: Record<string, string> = {
      crm: 'CRM (Salesforce)', emails: 'Emails (Gmail)', linkedin: 'LinkedIn Sales Nav',
      calls: 'Calls (Gong)', kb: 'Knowledge Base', documents: 'Documents', sops: 'SOPs (Notion)',
    }

    const aiMsg: ChatMessage = {
      id:       `a${Date.now()}`,
      role:     'assistant',
      blocks,
      sources:  [...usedSources].map(id => sourceLabelMap[id] ?? id),
      followUps: ['Tell me more', 'Show me the data', 'Assign to an agent'],
      actions:  [
        { label: 'Assign to FLUX Agent', color: 'bg-emerald-500 text-slate-950' },
        { label: 'Copy to Clipboard',    color: 'bg-slate-700 text-slate-200' },
      ],
      ts: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
    }
    setIsTyping(false)
    setMessages(prev => [...prev, aiMsg])
  }

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">

      {/* ── Left: Data Sources ──────────────────── */}
      <LeftSidebar sources={DATA_SOURCES} activeSources={activeSources} />

      {/* ── Center: Chat ─────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Chat Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-800/60 flex items-center gap-4"
          style={{ background: 'rgba(4, 9, 20, 0.6)' }}>
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <Brain className="w-5 h-5 text-white" />
            </motion.div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-ai-bg" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Company Brain</div>
            <div className="text-xs text-slate-500">Connected to 7 sources · 68,573+ records · Always learning</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 rounded-full px-3 py-1 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Live — All agents reporting
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Welcome state (shown above first messages) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <div className="inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-900/40 border border-slate-800/50 rounded-full px-4 py-2">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              Company Brain initialized · Conversation history loaded
            </div>
          </motion.div>

          {messages.map((msg, i) => (
            <MessageBubble key={msg.id} msg={msg} isNew={i >= INITIAL_MESSAGES.length} />
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <TypingIndicator />
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-slate-800/60 px-6 py-4 space-y-3"
          style={{ background: 'rgba(4, 9, 20, 0.8)' }}>

          {/* Suggested prompts */}
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map(p => {
              const Icon = p.icon
              return (
                <button
                  key={p.key}
                  onClick={() => sendMessage(p.label, p.key)}
                  disabled={isTyping}
                  className={cn(
                    'flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed',
                    p.bg, p.color,
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {p.label}
                </button>
              )
            })}
          </div>

          {/* Text input */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
                }}
                placeholder="Ask anything about your business — leads, pipeline, calls, competitors..."
                rows={2}
                disabled={isTyping}
                className={cn(
                  'w-full bg-slate-900/60 border border-slate-700/60 rounded-2xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600',
                  'focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20',
                  'resize-none transition-all duration-200 disabled:opacity-50',
                )}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer',
                input.trim() && !isTyping
                  ? 'bg-gradient-to-br from-purple-600 to-violet-500 shadow-lg shadow-purple-500/25 hover:brightness-110'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed',
              )}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-700">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-600" /> Powered by Company Brain · GPT-4 Enterprise</span>
            <span>Press Enter to send · Shift+Enter for new line</span>
          </div>
        </div>
      </div>

      {/* ── Right: Insights ──────────────────────── */}
      <div className="relative">
        {newAlertFlash && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 left-2 right-2 z-10 bg-red-500/20 border border-red-500/30 rounded-xl px-3 py-2 text-[11px] text-red-400 text-center font-medium"
          >
            🚨 New lead alert
          </motion.div>
        )}
        <RightSidebar alerts={liveAlerts} opportunities={OPPORTUNITIES} />
      </div>
    </div>
  )
}
