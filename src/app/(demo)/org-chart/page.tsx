'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Target, Globe, Phone, RefreshCw, Database,
  Mic, Lightbulb, TrendingUp, BarChart3, Brain,
  X, CheckCircle2, Clock, Zap, AlertTriangle,
  Activity, Cpu, Shield, Star, ArrowRight, Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────

type AgentStatus  = 'active' | 'processing' | 'idle'
type TeamColor    = 'purple' | 'emerald' | 'blue' | 'amber'
type OutputType   = 'insight' | 'alert' | 'report' | 'action'
type TaskStatus   = 'done' | 'active' | 'queued'
type TabId        = 'tasks' | 'outputs' | 'metrics'

interface AgentTask    { label: string; status: TaskStatus }
interface AgentOutput  { text: string; time: string; type: OutputType }
interface AgentMetric  { label: string; value: string; color: string }

interface AgentData {
  id:           string
  name:         string
  shortName:    string
  team:         string
  teamId:       string
  teamColor:    TeamColor
  role:         string
  icon:         React.ElementType
  status:       AgentStatus
  currentTask:  string
  taskCount:    number
  accuracy:     number
  tasks:        AgentTask[]
  outputs:      AgentOutput[]
  metrics:      AgentMetric[]
  // Canvas position (center x, top y)
  cx: number
  cy: number
}

interface TeamData {
  id:       string
  name:     string
  color:    TeamColor
  icon:     React.ElementType
  agentIds: string[]
  cx:       number
  cy:       number
}

// ─── Canvas Layout (px) ────────────────────────────────────────────────────
// Canvas: 1450 × 640

const CX = {
  director:            775,
  // Team centers
  research:            200,
  sales:               540,
  intelligence:        900,
  executive:          1270,
  // Agent centers
  marketResearch:       60,
  competitorIntel:     200,
  icpDiscovery:        340,
  outreach:            400,
  followUp:            540,
  crm:                 680,
  callAnalysis:        760,
  opportunityDetect:   900,
  forecasting:        1040,
  reporting:          1185,
  strategy:           1355,
}

const NODE = { dirW: 230, dirH: 90, teamW: 176, teamH: 84, agentW: 145, agentH: 116 }
const Y    = { director: 20, team: 210, agent: 400 }

// Derived bottom-center Y
const BY = {
  director: Y.director + NODE.dirH,
  team:     Y.team     + NODE.teamH,
}
// Agent top-center Y
const AY = Y.agent

// ─── Full Agent Data ────────────────────────────────────────────────────────

const AGENTS: AgentData[] = [
  // ── Research Team ──────────────────────────────────────────────────────
  {
    id: 'market-research', name: 'Market Research Agent', shortName: 'Market Research',
    team: 'Research Team', teamId: 'research', teamColor: 'purple',
    role: 'Market Intelligence Specialist', icon: Search,
    status: 'active', currentTask: 'Analyzing Q3 market trends across 847 data points',
    taskCount: 89, accuracy: 96,
    cx: CX.marketResearch, cy: Y.agent,
    tasks: [
      { label: 'Scan 200+ industry news sources', status: 'done' },
      { label: 'Identify emerging market signals', status: 'active' },
      { label: 'Generate market opportunity report', status: 'queued' },
    ],
    outputs: [
      { text: 'SaaS market growing 23% YoY — 14 target segments identified', time: '4m ago', type: 'insight' },
      { text: 'New regulatory change impacts 3 pipeline prospects', time: '18m ago', type: 'alert' },
      { text: 'Q3 Market Report delivered to Forecasting + Strategy agents', time: '1h ago', type: 'report' },
      { text: 'Enterprise SaaS buyer intent spiking in APAC region', time: '2h ago', type: 'insight' },
    ],
    metrics: [
      { label: 'Reports Today', value: '7', color: 'text-purple-400' },
      { label: 'Sources Scanned', value: '847', color: 'text-purple-400' },
      { label: 'Accuracy', value: '96%', color: 'text-emerald-400' },
      { label: 'Uptime', value: '99.9%', color: 'text-emerald-400' },
    ],
  },
  {
    id: 'competitor-intel', name: 'Competitor Intelligence Agent', shortName: 'Competitor Intel',
    team: 'Research Team', teamId: 'research', teamColor: 'purple',
    role: 'Competitive Analysis Specialist', icon: Target,
    status: 'active', currentTask: 'Monitoring pricing changes across 12 competitors',
    taskCount: 64, accuracy: 94,
    cx: CX.competitorIntel, cy: Y.agent,
    tasks: [
      { label: 'Track Acme Inc pricing update', status: 'done' },
      { label: 'Analyze TechRival new feature launch', status: 'active' },
      { label: 'Alert sales team of new opportunities', status: 'queued' },
    ],
    outputs: [
      { text: 'Acme Inc dropped pricing 30% — 8 of our accounts at risk', time: '7m ago', type: 'alert' },
      { text: 'Competitor product outage: 14 customers searching alternatives', time: '22m ago', type: 'alert' },
      { text: 'Competitive battle card updated with fresh pricing intel', time: '45m ago', type: 'report' },
      { text: 'Rival lost 3 enterprise deals — messaging weakness detected', time: '1h ago', type: 'insight' },
    ],
    metrics: [
      { label: 'Competitors Tracked', value: '12', color: 'text-purple-400' },
      { label: 'Alerts Today', value: '5', color: 'text-red-400' },
      { label: 'Accuracy', value: '94%', color: 'text-emerald-400' },
      { label: 'Response Time', value: '<2m', color: 'text-emerald-400' },
    ],
  },
  {
    id: 'icp-discovery', name: 'ICP Discovery Agent', shortName: 'ICP Discovery',
    team: 'Research Team', teamId: 'research', teamColor: 'purple',
    role: 'Ideal Customer Profile Analyst', icon: Globe,
    status: 'processing', currentTask: 'Scanning 284M records for new ICP-matched companies',
    taskCount: 142, accuracy: 91,
    cx: CX.icpDiscovery, cy: Y.agent,
    tasks: [
      { label: 'Update ICP model from closed-won analysis', status: 'done' },
      { label: 'Match 284M records against ICP model', status: 'active' },
      { label: 'Enrich top 200 matches & deliver to Outreach', status: 'queued' },
    ],
    outputs: [
      { text: '284 new ICP-matched companies identified in EMEA', time: '12m ago', type: 'insight' },
      { text: 'ICP update: "Series B, 50-200 employees" adds 18% lead quality', time: '34m ago', type: 'report' },
      { text: 'Top prospect: Quantum AI — all 9 ICP signals matched', time: '1h ago', type: 'action' },
      { text: '142 enriched prospects delivered to Outreach Agent', time: '2h ago', type: 'action' },
    ],
    metrics: [
      { label: 'ICP Matches', value: '284', color: 'text-purple-400' },
      { label: 'Match Quality', value: '91%', color: 'text-emerald-400' },
      { label: 'Records Scanned', value: '284M', color: 'text-purple-400' },
      { label: 'Delivered', value: '142', color: 'text-blue-400' },
    ],
  },
  // ── Sales Team ──────────────────────────────────────────────────────────
  {
    id: 'outreach', name: 'Outreach Agent', shortName: 'Outreach',
    team: 'Sales Team', teamId: 'sales', teamColor: 'emerald',
    role: 'Personalized Outreach Specialist', icon: Phone,
    status: 'active', currentTask: 'Crafting personalized sequences for 23 ICP-matched accounts',
    taskCount: 847, accuracy: 98,
    cx: CX.outreach, cy: Y.agent,
    tasks: [
      { label: 'Personalize email for TechCorp Global CFO', status: 'done' },
      { label: 'Deploy LinkedIn outreach to 23 CFOs', status: 'active' },
      { label: 'A/B test subject lines across 3 segments', status: 'queued' },
    ],
    outputs: [
      { text: '23 hyper-personalized sequences launched — avg open rate 71%', time: '3m ago', type: 'action' },
      { text: 'TechCorp CFO replied positively — meeting booked Thursday', time: '15m ago', type: 'insight' },
      { text: '"ROI-first" subject line outperforms control by 34%', time: '40m ago', type: 'insight' },
      { text: '847 outreach messages sent today across all channels', time: '2h ago', type: 'report' },
    ],
    metrics: [
      { label: 'Messages Today', value: '847', color: 'text-emerald-400' },
      { label: 'Open Rate', value: '71%', color: 'text-emerald-400' },
      { label: 'Reply Rate', value: '28%', color: 'text-blue-400' },
      { label: 'Meetings Booked', value: '7', color: 'text-amber-400' },
    ],
  },
  {
    id: 'follow-up', name: 'Follow-up Agent', shortName: 'Follow-up',
    team: 'Sales Team', teamId: 'sales', teamColor: 'emerald',
    role: 'Pipeline Nurture Specialist', icon: RefreshCw,
    status: 'active', currentTask: 'Monitoring 34 active deals for follow-up triggers',
    taskCount: 312, accuracy: 97,
    cx: CX.followUp, cy: Y.agent,
    tasks: [
      { label: 'Follow up InnovateCo (3 days silent)', status: 'done' },
      { label: 'Nudge 4 stalled Proposal-stage deals', status: 'active' },
      { label: 'Re-engage 12 dark leads with new trigger', status: 'queued' },
    ],
    outputs: [
      { text: 'InnovateCo responded — deal reactivated ($320K)', time: '8m ago', type: 'insight' },
      { text: '4 stalled deals nudged with personalized case studies', time: '25m ago', type: 'action' },
      { text: 'Pinnacle Ventures unresponsive — escalated to human', time: '1h ago', type: 'alert' },
      { text: '12 re-engagement sequences launched for dark leads', time: '2h ago', type: 'action' },
    ],
    metrics: [
      { label: 'Deals Monitored', value: '34', color: 'text-emerald-400' },
      { label: 'Rescued This Week', value: '3', color: 'text-amber-400' },
      { label: 'Response Rate', value: '99.2%', color: 'text-emerald-400' },
      { label: 'Avg Follow-up', value: '47s', color: 'text-blue-400' },
    ],
  },
  {
    id: 'crm', name: 'CRM Agent', shortName: 'CRM',
    team: 'Sales Team', teamId: 'sales', teamColor: 'emerald',
    role: 'Data Integrity & CRM Specialist', icon: Database,
    status: 'active', currentTask: 'Syncing 2,847 activity records across Salesforce',
    taskCount: 2847, accuracy: 98,
    cx: CX.crm, cy: Y.agent,
    tasks: [
      { label: 'Sync all email activity to Salesforce', status: 'done' },
      { label: 'Enrich 12 stale contact records via ZoomInfo', status: 'active' },
      { label: 'Flag 3 duplicate accounts for review', status: 'queued' },
    ],
    outputs: [
      { text: 'CRM data accuracy improved to 98.4% — 127 records enriched', time: '5m ago', type: 'report' },
      { text: 'Duplicate: TechCorp + TechCorp Global merged automatically', time: '22m ago', type: 'alert' },
      { text: 'All Q3 activity synced — 2,847 records updated automatically', time: '1h ago', type: 'action' },
      { text: 'Missing fields populated for 34 accounts via enrichment', time: '3h ago', type: 'action' },
    ],
    metrics: [
      { label: 'Records Updated', value: '2,847', color: 'text-emerald-400' },
      { label: 'Data Quality', value: '98.4%', color: 'text-emerald-400' },
      { label: 'Duplicates Found', value: '3', color: 'text-amber-400' },
      { label: 'Uptime', value: '100%', color: 'text-emerald-400' },
    ],
  },
  // ── Intelligence Team ───────────────────────────────────────────────────
  {
    id: 'call-analysis', name: 'Call Analysis Agent', shortName: 'Call Analysis',
    team: 'Intelligence Team', teamId: 'intelligence', teamColor: 'blue',
    role: 'Conversation Intelligence Specialist', icon: Mic,
    status: 'active', currentTask: 'Analyzing 3 discovery calls for coaching insights',
    taskCount: 47, accuracy: 96,
    cx: CX.callAnalysis, cy: Y.agent,
    tasks: [
      { label: 'Transcribe & analyze TechCorp discovery call', status: 'done' },
      { label: 'Extract objections and winning patterns', status: 'active' },
      { label: 'Generate coaching brief for sales team', status: 'queued' },
    ],
    outputs: [
      { text: 'Top objection today: "too expensive" — in 60% of calls', time: '6m ago', type: 'insight' },
      { text: 'Winning pattern: ROI story at minute 3 → 73% higher close rate', time: '28m ago', type: 'insight' },
      { text: '3 reps flagged for objection-handling coaching', time: '1h ago', type: 'report' },
      { text: 'TechCorp call: 94% positive sentiment, strong buying signals', time: '2h ago', type: 'insight' },
    ],
    metrics: [
      { label: 'Calls Analyzed', value: '12', color: 'text-blue-400' },
      { label: 'Insights Extracted', value: '47', color: 'text-blue-400' },
      { label: 'Accuracy', value: '96.3%', color: 'text-emerald-400' },
      { label: 'Coaching Briefs', value: '4', color: 'text-purple-400' },
    ],
  },
  {
    id: 'opportunity-detection', name: 'Opportunity Detection Agent', shortName: 'Opportunity Detect',
    team: 'Intelligence Team', teamId: 'intelligence', teamColor: 'blue',
    role: 'Deal Intelligence Specialist', icon: Lightbulb,
    status: 'active', currentTask: 'Scanning pipeline for upsell and expansion signals',
    taskCount: 183, accuracy: 91,
    cx: CX.opportunityDetect, cy: Y.agent,
    tasks: [
      { label: 'Analyze usage data for expansion triggers', status: 'done' },
      { label: 'Identify cross-sell in existing accounts', status: 'active' },
      { label: 'Prioritize top 5 expansion opportunities', status: 'queued' },
    ],
    outputs: [
      { text: 'CloudNine ready for expansion — usage at 94% capacity', time: '9m ago', type: 'insight' },
      { text: '8 accounts using Product A need Product B (cross-sell)', time: '31m ago', type: 'action' },
      { text: '$840K expansion pipeline identified from existing base', time: '1h ago', type: 'report' },
      { text: 'Churn risk: Vertex Analytics usage dropped 40% this month', time: '2h ago', type: 'alert' },
    ],
    metrics: [
      { label: 'Opportunities', value: '24', color: 'text-blue-400' },
      { label: 'Pipeline Created', value: '$840K', color: 'text-emerald-400' },
      { label: 'Churn Risks', value: '2', color: 'text-red-400' },
      { label: 'Accuracy', value: '91%', color: 'text-emerald-400' },
    ],
  },
  {
    id: 'forecasting', name: 'Forecasting Agent', shortName: 'Forecasting',
    team: 'Intelligence Team', teamId: 'intelligence', teamColor: 'blue',
    role: 'Revenue Forecasting Specialist', icon: TrendingUp,
    status: 'processing', currentTask: 'Running Monte Carlo simulation for Q4 scenarios',
    taskCount: 12, accuracy: 94,
    cx: CX.forecasting, cy: Y.agent,
    tasks: [
      { label: 'Update pipeline probability weights', status: 'done' },
      { label: 'Run Q4 Monte Carlo simulation (10,000 runs)', status: 'active' },
      { label: 'Generate board-ready revenue forecast deck', status: 'queued' },
    ],
    outputs: [
      { text: 'Q4 forecast: $3.2M base case, $3.8M upside (94.7% accuracy)', time: '14m ago', type: 'report' },
      { text: 'Pipeline at risk: $480K depends on 3 deals in negotiation', time: '37m ago', type: 'alert' },
      { text: 'Historical: within 2% accuracy for 8 consecutive months', time: '2h ago', type: 'insight' },
      { text: 'Commit vs upside analysis delivered to VP Sales & CFO', time: '3h ago', type: 'report' },
    ],
    metrics: [
      { label: 'Forecast Accuracy', value: '94.7%', color: 'text-blue-400' },
      { label: 'Q4 Forecast', value: '$3.2M', color: 'text-emerald-400' },
      { label: 'At-Risk Pipeline', value: '$480K', color: 'text-red-400' },
      { label: 'Scenarios Run', value: '12', color: 'text-blue-400' },
    ],
  },
  // ── Executive Team ──────────────────────────────────────────────────────
  {
    id: 'reporting', name: 'Reporting Agent', shortName: 'Reporting',
    team: 'Executive Team', teamId: 'executive', teamColor: 'amber',
    role: 'Executive Intelligence Specialist', icon: BarChart3,
    status: 'active', currentTask: 'Compiling weekly executive briefing for board',
    taskCount: 4, accuracy: 100,
    cx: CX.reporting, cy: Y.agent,
    tasks: [
      { label: 'Aggregate all agent outputs for the week', status: 'done' },
      { label: 'Build executive summary + slide deck', status: 'active' },
      { label: 'Deliver board-ready report to leadership', status: 'queued' },
    ],
    outputs: [
      { text: 'Weekly report: $467K closed, 94 leads, 6 agents, 2,172 tasks', time: '2m ago', type: 'report' },
      { text: 'Board deck auto-generated: 12 slides, all charts live', time: '34m ago', type: 'action' },
      { text: 'KPI dashboard synced to Notion + Slack — zero manual work', time: '1h ago', type: 'action' },
      { text: 'Anomaly: Win rate up 12% — attributed to ECHO optimization', time: '2h ago', type: 'insight' },
    ],
    metrics: [
      { label: 'Reports Generated', value: '4', color: 'text-amber-400' },
      { label: 'Manual Hours Saved', value: '14h', color: 'text-emerald-400' },
      { label: 'Data Accuracy', value: '100%', color: 'text-emerald-400' },
      { label: 'Delivery Speed', value: '<5m', color: 'text-blue-400' },
    ],
  },
  {
    id: 'strategy', name: 'Strategy Agent', shortName: 'Strategy',
    team: 'Executive Team', teamId: 'executive', teamColor: 'amber',
    role: 'Strategic Intelligence Advisor', icon: Brain,
    status: 'active', currentTask: 'Synthesizing all agent insights into Q4 growth strategy',
    taskCount: 127, accuracy: 91,
    cx: CX.strategy, cy: Y.agent,
    tasks: [
      { label: 'Analyze Q3 performance across all 11 agents', status: 'done' },
      { label: 'Identify top 3 strategic priorities for Q4', status: 'active' },
      { label: 'Draft GTM strategy with agent recommendations', status: 'queued' },
    ],
    outputs: [
      { text: 'Q4 Priority #1: APAC expansion — 284 ICP matches, weak competition', time: '11m ago', type: 'insight' },
      { text: 'Strategic rec: Raise enterprise ICP threshold by 20%', time: '38m ago', type: 'action' },
      { text: 'Revenue playbook v3.2 updated with winning patterns from ECHO', time: '1h ago', type: 'report' },
      { text: 'Hire recommendation: 2 AEs needed to close $840K expansion', time: '3h ago', type: 'insight' },
    ],
    metrics: [
      { label: 'Strategies Generated', value: '3', color: 'text-amber-400' },
      { label: 'Insights Synthesized', value: '127', color: 'text-amber-400' },
      { label: 'Confidence Score', value: '91%', color: 'text-emerald-400' },
      { label: 'Decisions Influenced', value: '8', color: 'text-blue-400' },
    ],
  },
]

// ─── Teams ──────────────────────────────────────────────────────────────────

const TEAMS: TeamData[] = [
  { id: 'research',     name: 'Research Team',     color: 'purple',  icon: Search,    cx: CX.research,     cy: Y.team, agentIds: ['market-research','competitor-intel','icp-discovery'] },
  { id: 'sales',        name: 'Sales Team',         color: 'emerald', icon: TrendingUp, cx: CX.sales,       cy: Y.team, agentIds: ['outreach','follow-up','crm'] },
  { id: 'intelligence', name: 'Intelligence Team',  color: 'blue',    icon: Brain,      cx: CX.intelligence, cy: Y.team, agentIds: ['call-analysis','opportunity-detection','forecasting'] },
  { id: 'executive',    name: 'Executive Team',     color: 'amber',   icon: Shield,    cx: CX.executive,   cy: Y.team, agentIds: ['reporting','strategy'] },
]

// ─── Color Maps ─────────────────────────────────────────────────────────────

const C: Record<TeamColor, {
  from: string; to: string; text: string; bg: string; border: string
  stroke: string; glow: string; ring: string; packetFill: string
}> = {
  purple:  { from: 'from-purple-500',  to: 'to-violet-400',  text: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/25',  stroke: '#8b5cf6', glow: 'shadow-purple-500/25',  ring: 'ring-purple-500/20', packetFill: '#8b5cf6' },
  emerald: { from: 'from-emerald-500', to: 'to-green-400',   text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', stroke: '#22c55e', glow: 'shadow-emerald-500/25', ring: 'ring-emerald-500/20',packetFill: '#22c55e' },
  blue:    { from: 'from-blue-500',    to: 'to-cyan-400',    text: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/25',    stroke: '#3b82f6', glow: 'shadow-blue-500/25',    ring: 'ring-blue-500/20',   packetFill: '#3b82f6' },
  amber:   { from: 'from-amber-500',   to: 'to-orange-400',  text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   stroke: '#f59e0b', glow: 'shadow-amber-500/25',   ring: 'ring-amber-500/20',  packetFill: '#f59e0b' },
}

// ─── SVG Path Helpers ───────────────────────────────────────────────────────

function makePath(x1: number, y1: number, x2: number, y2: number): string {
  const mid = (y1 + y2) / 2
  return `M ${x1} ${y1} C ${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`
}

// Director → Team paths
const DIR_PATHS = TEAMS.map(t => ({
  teamId: t.id,
  color:  t.color,
  d:      makePath(CX.director, BY.director, t.cx, Y.team),
  dur:    t.id === 'research' ? '3.2s' : t.id === 'sales' ? '2.8s' : t.id === 'intelligence' ? '3s' : '4s',
}))

// Team → Agent paths
const TEAM_AGENT_PATHS = AGENTS.map(a => {
  const team = TEAMS.find(t => t.id === a.teamId)!
  return {
    agentId: a.id,
    teamId:  a.teamId,
    color:   a.teamColor,
    d:       makePath(team.cx, BY.team, a.cx, Y.agent),
    dur:     `${1.8 + Math.abs(a.cx - team.cx) / 300}s`,
  }
})

// ─── Status Helpers ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AgentStatus, { dot: string; ring: string; label: string; bg: string; text: string }> = {
  active:     { dot: 'bg-emerald-400', ring: 'bg-emerald-400/30', label: 'Active',     bg: 'bg-emerald-400/10', text: 'text-emerald-400' },
  processing: { dot: 'bg-blue-400',    ring: 'bg-blue-400/30',    label: 'Processing', bg: 'bg-blue-400/10',    text: 'text-blue-400' },
  idle:       { dot: 'bg-slate-400',   ring: 'bg-slate-400/30',   label: 'Idle',       bg: 'bg-slate-400/10',   text: 'text-slate-400' },
}

const OUTPUT_CONFIG: Record<OutputType, { icon: React.ElementType; text: string; bg: string }> = {
  insight: { icon: Lightbulb,      text: 'text-blue-400',   bg: 'bg-blue-400/10' },
  alert:   { icon: AlertTriangle,  text: 'text-red-400',    bg: 'bg-red-400/10' },
  report:  { icon: BarChart3,      text: 'text-purple-400', bg: 'bg-purple-400/10' },
  action:  { icon: Zap,            text: 'text-emerald-400',bg: 'bg-emerald-400/10' },
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function PulseDot({ color = 'bg-emerald-400', size = 'w-2 h-2' }: { color?: string; size?: string }) {
  return (
    <span className="relative flex" style={{ width: '8px', height: '8px' }}>
      <span className={cn('animate-ping absolute inset-0 rounded-full opacity-60', color)} />
      <span className={cn('relative rounded-full', size, color)} />
    </span>
  )
}

function TaskRow({ task }: { task: AgentTask }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-800/50 last:border-0">
      <div className="flex-shrink-0 mt-0.5">
        {task.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        {task.status === 'active' && (
          <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
        )}
        {task.status === 'queued' && (
          <div className="w-4 h-4 rounded-full border-2 border-slate-700 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          </div>
        )}
      </div>
      <span className={cn('text-sm leading-snug', {
        'text-slate-500 line-through': task.status === 'done',
        'text-slate-200':              task.status === 'active',
        'text-slate-600':              task.status === 'queued',
      })}>
        {task.label}
      </span>
      {task.status === 'active' && (
        <span className="ml-auto flex-shrink-0 text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">Running</span>
      )}
    </div>
  )
}

// ─── Director Node ──────────────────────────────────────────────────────────

function DirectorNode() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
      style={{
        position: 'absolute',
        left:  CX.director - NODE.dirW / 2,
        top:   Y.director,
        width: NODE.dirW,
        height: NODE.dirH,
      }}
      className="z-20"
    >
      <div className="relative h-full rounded-2xl border border-emerald-500/30 overflow-hidden
        bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl
        shadow-2xl shadow-emerald-500/10">
        {/* Glow top bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500" />
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 h-full flex items-center px-5 gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white text-sm leading-tight">AI Revenue Director</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Command Center · 11 agents · 4 teams</div>
          </div>
          <div className="flex-shrink-0">
            <PulseDot />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Team Node ──────────────────────────────────────────────────────────────

function TeamNode({ team, isHighlighted }: { team: TeamData; isHighlighted: boolean }) {
  const c = C[team.color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 180 }}
      style={{
        position: 'absolute',
        left:  team.cx - NODE.teamW / 2,
        top:   team.cy,
        width: NODE.teamW,
        height: NODE.teamH,
      }}
      className="z-20"
    >
      <div className={cn(
        'h-full rounded-xl border backdrop-blur-xl transition-all duration-300 overflow-hidden',
        'bg-slate-900/80',
        c.border,
        isHighlighted && 'shadow-lg ' + c.glow,
      )}>
        <div className={cn('h-0.5 bg-gradient-to-r', c.from, c.to)} />
        <div className="flex items-center gap-3 px-4 py-3 h-full">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', c.bg)}>
            <team.icon className={cn('w-4 h-4', c.text)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className={cn('text-xs font-bold', c.text)}>{team.name}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">{team.agentIds.length} agents</div>
          </div>
          <PulseDot color={c.from.replace('from-', 'bg-').replace('-500', '-400')} />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Agent Node ─────────────────────────────────────────────────────────────

function AgentNode({
  agent, isSelected, liveCount, onClick, onHover,
}: {
  agent:    AgentData
  isSelected: boolean
  liveCount: number
  onClick:  () => void
  onHover:  (id: string | null) => void
}) {
  const c  = C[agent.teamColor]
  const sc = STATUS_CONFIG[agent.status]
  const Icon = agent.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 160 }}
      whileHover={{ y: -4, scale: 1.03 }}
      onClick={onClick}
      onMouseEnter={() => onHover(agent.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        position: 'absolute',
        left:  agent.cx - NODE.agentW / 2,
        top:   agent.cy,
        width: NODE.agentW,
        height: NODE.agentH,
      }}
      className="z-20 cursor-pointer"
    >
      <div className={cn(
        'h-full rounded-xl border backdrop-blur-xl overflow-hidden transition-all duration-200',
        'bg-slate-900/85',
        isSelected ? cn('border', c.border, 'shadow-xl', c.glow) : 'border-slate-800/70 hover:border-slate-700/70',
      )}>
        {/* Top bar */}
        <div className={cn('h-0.5 bg-gradient-to-r transition-opacity duration-200', c.from, c.to,
          isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-80',
        )} />

        <div className="px-3 py-2.5 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-start gap-2">
            <div className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
              `bg-gradient-to-br ${c.from} ${c.to}`,
            )}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 leading-tight truncate">
                {agent.shortName}
              </div>
              <div className={cn('text-[10px] mt-0.5', sc.text, 'flex items-center gap-1')}>
                <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', sc.dot,
                  agent.status !== 'idle' && 'animate-pulse',
                )} />
                {sc.label}
              </div>
            </div>
          </div>

          {/* Current task */}
          <p className="text-[10px] text-slate-500 leading-tight line-clamp-2 mt-2">
            {agent.currentTask}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
            <div className={cn('text-[10px] font-mono font-bold', c.text)}>
              {agent.accuracy}% acc
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-600">
              <Zap className="w-2.5 h-2.5" />
              {(agent.taskCount + liveCount).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Selected ring */}
        {isSelected && (
          <div className={cn('absolute inset-0 rounded-xl ring-2 pointer-events-none', c.ring)} />
        )}
      </div>
    </motion.div>
  )
}

// ─── Side Panel ─────────────────────────────────────────────────────────────

function SidePanel({
  agent, activeTab, setActiveTab, onClose,
}: {
  agent:       AgentData
  activeTab:   TabId
  setActiveTab:(t: TabId) => void
  onClose:     () => void
}) {
  const c  = C[agent.teamColor]
  const sc = STATUS_CONFIG[agent.status]
  const Icon = agent.icon

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'tasks',   label: 'Tasks',   icon: CheckCircle2 },
    { id: 'outputs', label: 'Outputs', icon: Activity },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
  ]

  return (
    <motion.div
      initial={{ x: 420, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 420, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed right-0 top-0 h-full w-[400px] z-50 flex flex-col"
      style={{
        background: 'rgba(4, 9, 20, 0.97)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Top gradient accent */}
      <div className={cn('h-0.5 bg-gradient-to-r flex-shrink-0', c.from, c.to)} />

      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800/60 flex-shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br flex-shrink-0', c.from, c.to)}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">{agent.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{agent.role}</p>
              <p className={cn('text-xs font-medium mt-1', c.text)}>{agent.team}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition-colors cursor-pointer flex-shrink-0 ml-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status + current task */}
        <div className={cn('rounded-xl p-3 border', c.bg, c.border)}>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', sc.bg, sc.text)}>
              {sc.label}
            </span>
            <span className="text-xs text-slate-600">Current task</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{agent.currentTask}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 pt-4 gap-1 flex-shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer',
              activeTab === tab.id
                ? cn(c.bg, c.text, 'border', c.border)
                : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800/40',
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="space-y-0 divide-y divide-slate-800/50">
                {agent.tasks.map((task, i) => (
                  <TaskRow key={i} task={task} />
                ))}
              </div>

              {/* Queued indicator */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Queued tasks execute automatically when current completes</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'outputs' && (
            <motion.div key="outputs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-3">
              {agent.outputs.map((output, i) => {
                const oc = OUTPUT_CONFIG[output.type]
                const OIcon = oc.icon
                return (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', oc.bg)}>
                      <OIcon className={cn('w-3.5 h-3.5', oc.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 leading-relaxed">{output.text}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn('text-[10px] font-medium capitalize px-1.5 py-0.5 rounded', oc.bg, oc.text)}>
                          {output.type}
                        </span>
                        <span className="text-[10px] text-slate-600">{output.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'metrics' && (
            <motion.div key="metrics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {agent.metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className={cn('rounded-xl p-4 border text-center', c.bg, c.border)}
                  >
                    <div className={cn('text-xl font-bold font-mono', m.color)}>{m.value}</div>
                    <div className="text-[10px] text-slate-600 mt-1">{m.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Perf bars */}
              <div className="mt-4 space-y-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800/60">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">System Health</h4>
                {[
                  { label: 'Accuracy',  value: agent.accuracy },
                  { label: 'Uptime',    value: 99.9 },
                  { label: 'Confidence',value: agent.accuracy - 3 },
                ].map(bar => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500">{bar.label}</span>
                      <span className={cn('font-mono font-bold', c.text)}>{bar.value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.value}%` }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className={cn('h-full rounded-full bg-gradient-to-r', c.from, c.to)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-800/60 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-emerald-500" />
            {agent.taskCount.toLocaleString()} total tasks processed
          </span>
          <span>Part of {agent.team}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── SVG Connections ────────────────────────────────────────────────────────

function Connections({ hoveredAgentId, selectedAgentId }: { hoveredAgentId: string | null; selectedAgentId: string | null }) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="1450" height="640"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Gradient definitions per team color */}
        {(['purple','emerald','blue','amber'] as TeamColor[]).map(color => (
          <linearGradient key={color} id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={C[color].stroke} stopOpacity="0.6" />
            <stop offset="100%" stopColor={C[color].stroke} stopOpacity="0.2" />
          </linearGradient>
        ))}
      </defs>

      {/* Director → Team paths */}
      {DIR_PATHS.map(p => {
        const isHighlighted = hoveredAgentId
          ? TEAMS.find(t => t.id === p.teamId)?.agentIds.includes(hoveredAgentId)
          : selectedAgentId
          ? TEAMS.find(t => t.id === p.teamId)?.agentIds.includes(selectedAgentId)
          : false

        return (
          <g key={p.teamId}>
            {/* Base path */}
            <path
              d={p.d}
              stroke={isHighlighted ? C[p.color].stroke : 'rgba(255,255,255,0.07)'}
              strokeWidth={isHighlighted ? '2' : '1'}
              fill="none"
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />
            {/* Flowing data packet */}
            <circle r="3.5" fill={C[p.color].packetFill} opacity="0.7">
              <animateMotion dur={p.dur} repeatCount="indefinite" path={p.d} />
            </circle>
          </g>
        )
      })}

      {/* Team → Agent paths */}
      {TEAM_AGENT_PATHS.map(p => {
        const isHighlighted =
          hoveredAgentId === p.agentId ||
          selectedAgentId === p.agentId

        return (
          <g key={p.agentId}>
            {/* Base path */}
            <path
              d={p.d}
              stroke={isHighlighted ? C[p.color].stroke : 'rgba(255,255,255,0.06)'}
              strokeWidth={isHighlighted ? '1.5' : '0.8'}
              fill="none"
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />
            {/* Flowing packet */}
            <circle r="2.5" fill={C[p.color].packetFill} opacity="0.6">
              <animateMotion dur={p.dur} repeatCount="indefinite" path={p.d} />
            </circle>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function OrgChartPage() {
  const [selectedAgent, setSelectedAgent]  = useState<AgentData | null>(null)
  const [hoveredAgent,  setHoveredAgent]   = useState<string | null>(null)
  const [activeTab,     setActiveTab]      = useState<TabId>('tasks')
  const [liveCounters,  setLiveCounters]   = useState<Record<string, number>>({})
  const [totalTasksTick, setTotalTasksTick]= useState(0)

  // Simulate live activity: increment random agent's task counter every 2s
  useEffect(() => {
    const t = setInterval(() => {
      const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)]
      setLiveCounters(prev => ({ ...prev, [agent.id]: (prev[agent.id] ?? 0) + 1 }))
      setTotalTasksTick(n => n + 1)
    }, 1800)
    return () => clearInterval(t)
  }, [])

  const handleAgentClick = (agent: AgentData) => {
    setSelectedAgent(prev => prev?.id === agent.id ? null : agent)
    setActiveTab('tasks')
  }

  const highlightedTeamId = selectedAgent?.teamId ?? null

  return (
    <div className="min-h-screen flex flex-col" style={{ padding: '32px 32px 0' }}>

      {/* ── Header ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-6 flex-shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">AI Revenue Department</h1>
          <p className="text-slate-500 text-sm">
            Interactive org chart · 4 teams · 11 agents · Click any agent to explore
          </p>
        </div>

        {/* Live stats row */}
        <div className="flex items-center gap-3">
          {[
            { label: 'Agents Active',   value: '11/11',            color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-500/20' },
            { label: 'Tasks Today',     value: (2172 + totalTasksTick).toLocaleString(), color: 'text-blue-400',    bg: 'bg-blue-400/10 border-blue-500/20' },
            { label: 'Accuracy',        value: '94.7%',            color: 'text-purple-400',  bg: 'bg-purple-400/10 border-purple-500/20' },
          ].map(stat => (
            <div key={stat.label} className={cn('glass border rounded-xl px-4 py-2 text-center', stat.bg)}>
              <div className={cn('text-base font-bold font-mono', stat.color)}>{stat.value}</div>
              <div className="text-[10px] text-slate-600">{stat.label}</div>
            </div>
          ))}
          <div className="flex items-center gap-2 glass border border-emerald-500/20 rounded-xl px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
              <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs text-emerald-400 font-semibold">LIVE</span>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-5 mb-5 flex-shrink-0"
      >
        {TEAMS.map(t => (
          <div key={t.id} className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className={cn('w-2.5 h-2.5 rounded-full', `bg-gradient-to-br ${C[t.color].from} ${C[t.color].to}`)} />
            {t.name}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 ml-auto">
          <div className="w-6 h-px bg-slate-700" />
          Connection line
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block ml-1" />
          Data packet (live)
        </div>
      </motion.div>

      {/* ── Graph Canvas ─────────────────────────── */}
      <div className="flex-1 overflow-auto pb-8">
        <div className="relative" style={{ width: '1450px', height: '560px', minWidth: '100%' }}>

          {/* SVG connections (rendered first, behind nodes) */}
          <Connections
            hoveredAgentId={hoveredAgent}
            selectedAgentId={selectedAgent?.id ?? null}
          />

          {/* Director */}
          <DirectorNode />

          {/* Teams */}
          {TEAMS.map(team => (
            <TeamNode
              key={team.id}
              team={team}
              isHighlighted={highlightedTeamId === team.id}
            />
          ))}

          {/* Agents */}
          {AGENTS.map(agent => (
            <AgentNode
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent?.id === agent.id}
              liveCount={liveCounters[agent.id] ?? 0}
              onClick={() => handleAgentClick(agent)}
              onHover={setHoveredAgent}
            />
          ))}
        </div>
      </div>

      {/* ── Side Panel ───────────────────────────── */}
      {/* Backdrop */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAgent(null)}
            className="fixed inset-0 bg-black/30 z-40 cursor-pointer"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAgent && (
          <SidePanel
            key="panel"
            agent={selectedAgent}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onClose={() => setSelectedAgent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
