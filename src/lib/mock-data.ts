// ─── Types ─────────────────────────────────────────────────────────────────

export type AgentStatus = 'active' | 'processing' | 'idle' | 'warning'
export type DealStage   = 'Prospecting' | 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost'
export type Priority    = 'critical' | 'high' | 'medium' | 'low'

export interface Agent {
  id:            string
  name:          string
  fullName:      string
  role:          string
  description:   string
  status:        AgentStatus
  color:         string
  gradientFrom:  string
  gradientTo:    string
  glowClass:     string
  keyMetric:     string
  keyValue:      string
  todayStats:    { label: string; value: string }[]
  capabilities:  string[]
  confidence:    number
  tasksToday:    number
  uptime:        number
}

export interface Deal {
  id:          string
  company:     string
  logo:        string
  value:       number
  stage:       DealStage
  probability: number
  owner:       string
  agent:       string
  agentColor:  string
  daysInStage: number
  priority:    Priority
  lastActivity:string
  contacts:    number
  industry:    string
}

export interface ActivityItem {
  id:        string
  agent:     string
  agentColor:string
  action:    string
  detail:    string
  time:      string
  icon:      string
  type:      'lead' | 'deal' | 'alert' | 'insight' | 'task' | 'communication'
}

export interface RevenuePoint {
  month:    string
  revenue:  number
  forecast: number
  target:   number
  deals:    number
}

export interface PipelineStage {
  name:       string
  count:      number
  value:      number
  conversion: number
  fill:       string
}

export interface WorkflowCard {
  id:          string
  company:     string
  contact:     string
  value:       number
  stage:       string
  agent:       string
  agentColor:  string
  priority:    Priority
  score:       number
  lastAction:  string
  due:         string
  tags:        string[]
}

export interface DataSource {
  id:      string
  name:    string
  icon:    string
  status:  'synced' | 'syncing' | 'error'
  records: string
  updated: string
  color:   string
  angle:   number
}

export interface AuditCategory {
  name:         string
  score:        number
  grade:        string
  trend:        number
  color:        string
  issues:       string[]
  opportunities:string[]
}

// ─── Agents ────────────────────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  {
    id:           'aria',
    name:         'ARIA',
    fullName:     'Adaptive Revenue Intelligence Agent',
    role:         'Lead Qualification Specialist',
    description:  'Scores, qualifies, and prioritizes every inbound lead in real-time using behavioral signals, firmographic data, and intent markers.',
    status:       'active',
    color:        'emerald',
    gradientFrom: 'from-emerald-500',
    gradientTo:   'to-green-400',
    glowClass:    'agent-glow-green',
    keyMetric:    'Leads Qualified Today',
    keyValue:     '94',
    confidence:   97,
    tasksToday:   247,
    uptime:       99.97,
    todayStats: [
      { label: 'Qualified',  value: '94' },
      { label: 'Rejected',   value: '38' },
      { label: 'Avg Score',  value: '87/100' },
      { label: 'High Value', value: '14' },
    ],
    capabilities: ['Lead Scoring', 'Intent Detection', 'ICP Matching', 'Enrichment', 'Routing'],
  },
  {
    id:           'nexus',
    name:         'NEXUS',
    fullName:     'Neural Execution & Pipeline Intelligence System',
    role:         'Pipeline Intelligence Agent',
    description:  'Monitors every deal in real-time, flags risks 30 days early, and recommends precise next actions to accelerate pipeline velocity.',
    status:       'active',
    color:        'blue',
    gradientFrom: 'from-blue-500',
    gradientTo:   'to-cyan-400',
    glowClass:    'agent-glow-blue',
    keyMetric:    'Pipeline Tracked',
    keyValue:     '$2.4M',
    confidence:   94,
    tasksToday:   183,
    uptime:       99.99,
    todayStats: [
      { label: 'Deals Active',  value: '34' },
      { label: 'Risk Alerts',   value: '3' },
      { label: 'Advanced',      value: '7' },
      { label: 'Velocity',      value: '+18%' },
    ],
    capabilities: ['Deal Monitoring', 'Risk Detection', 'Velocity Analysis', 'Stage Coaching', 'CRM Sync'],
  },
  {
    id:           'echo',
    name:         'ECHO',
    fullName:     'Engagement & Communications Hyper-Optimizer',
    role:         'Customer Communications Agent',
    description:  'Crafts, sends, and optimizes every outbound message using tone analysis, engagement timing, and personalization at scale.',
    status:       'active',
    color:        'purple',
    gradientFrom: 'from-purple-500',
    gradientTo:   'to-violet-400',
    glowClass:    'agent-glow-purple',
    keyMetric:    'Response Rate',
    keyValue:     '99.2%',
    confidence:   98,
    tasksToday:   1847,
    uptime:       100.0,
    todayStats: [
      { label: 'Messages Sent',  value: '847' },
      { label: 'Sequences Live', value: '23' },
      { label: 'Open Rate',      value: '68%' },
      { label: 'Replies',        value: '214' },
    ],
    capabilities: ['Email Sequencing', 'Tone Analysis', 'A/B Testing', 'Timing Optimization', 'Personalization'],
  },
  {
    id:           'vance',
    name:         'VANCE',
    fullName:     'Velocity Analytics & Neural Conversion Engine',
    role:         'Revenue Forecasting Agent',
    description:  'Delivers CFO-grade revenue forecasts with 94.7% accuracy, surfacing pipeline risks and upside opportunities in real-time.',
    status:       'processing',
    color:        'amber',
    gradientFrom: 'from-amber-500',
    gradientTo:   'to-orange-400',
    glowClass:    'agent-glow-amber',
    keyMetric:    'Forecast Accuracy',
    keyValue:     '94.7%',
    confidence:   91,
    tasksToday:   47,
    uptime:       99.95,
    todayStats: [
      { label: 'Reports',       value: '4' },
      { label: 'Q4 Forecast',   value: '$3.2M' },
      { label: 'Upside Found',  value: '+$420K' },
      { label: 'Revision',      value: '+12%' },
    ],
    capabilities: ['Revenue Forecasting', 'Scenario Modeling', 'Cohort Analysis', 'Quota Tracking', 'Board Reports'],
  },
  {
    id:           'sigil',
    name:         'SIGIL',
    fullName:     'Strategic Intelligence & Competitive Analysis Layer',
    role:         'Market Intelligence Agent',
    description:  'Monitors 200+ data sources to surface competitor moves, market signals, and buying triggers before your team even wakes up.',
    status:       'active',
    color:        'cyan',
    gradientFrom: 'from-cyan-500',
    gradientTo:   'to-teal-400',
    glowClass:    'agent-glow-cyan',
    keyMetric:    'Sources Monitored',
    keyValue:     '200+',
    confidence:   88,
    tasksToday:   312,
    uptime:       99.91,
    todayStats: [
      { label: 'Insights',       value: '12' },
      { label: 'Comp Alerts',    value: '3' },
      { label: 'Buying Signals', value: '8' },
      { label: 'ICP Matches',    value: '24' },
    ],
    capabilities: ['Competitor Tracking', 'Intent Data', 'Market Signals', 'News Monitoring', 'ICP Discovery'],
  },
  {
    id:           'flux',
    name:         'FLUX',
    fullName:     'Flexible Logic & Unified Execution System',
    role:         'Workflow Orchestration Agent',
    description:  'The connective intelligence layer — coordinates all agents, assigns tasks, resolves conflicts, and escalates to humans precisely when needed.',
    status:       'active',
    color:        'pink',
    gradientFrom: 'from-pink-500',
    gradientTo:   'to-rose-400',
    glowClass:    'agent-glow-pink',
    keyMetric:    'Tasks Orchestrated',
    keyValue:     '31/hr',
    confidence:   99,
    tasksToday:   743,
    uptime:       100.0,
    todayStats: [
      { label: 'Tasks Done',   value: '743' },
      { label: 'Escalations',  value: '2' },
      { label: 'Bottlenecks',  value: '0' },
      { label: 'Efficiency',   value: '97%' },
    ],
    capabilities: ['Task Routing', 'Agent Coordination', 'Escalation Logic', 'SLA Monitoring', 'Audit Trail'],
  },
]

// ─── Revenue Data ───────────────────────────────────────────────────────────

export const REVENUE_DATA: RevenuePoint[] = [
  { month: 'Jul',  revenue: 180000, forecast: 175000, target: 200000, deals: 12 },
  { month: 'Aug',  revenue: 215000, forecast: 210000, target: 210000, deals: 14 },
  { month: 'Sep',  revenue: 198000, forecast: 205000, target: 220000, deals: 13 },
  { month: 'Oct',  revenue: 247000, forecast: 240000, target: 230000, deals: 16 },
  { month: 'Nov',  revenue: 289000, forecast: 285000, target: 240000, deals: 19 },
  { month: 'Dec',  revenue: 264000, forecast: 270000, target: 250000, deals: 17 },
  { month: 'Jan',  revenue: 312000, forecast: 310000, target: 260000, deals: 21 },
  { month: 'Feb',  revenue: 347000, forecast: 350000, target: 270000, deals: 23 },
  { month: 'Mar',  revenue: 389000, forecast: 385000, target: 280000, deals: 26 },
  { month: 'Apr',  revenue: 421000, forecast: 420000, target: 290000, deals: 28 },
  { month: 'May',  revenue: 467000, forecast: 460000, target: 300000, deals: 31 },
  { month: 'Jun',  revenue: 0,      forecast: 512000, target: 320000, deals: 0  },
]

// ─── Pipeline Stages ────────────────────────────────────────────────────────

export const PIPELINE_STAGES: PipelineStage[] = [
  { name: 'Awareness',   count: 1247, value: 8_740_000, conversion: 39.2, fill: '#22c55e' },
  { name: 'Interest',    count: 489,  value: 4_401_000, conversion: 43.6, fill: '#06b6d4' },
  { name: 'Evaluation',  count: 213,  value: 2_343_000, conversion: 40.8, fill: '#8b5cf6' },
  { name: 'Intent',      count: 87,   value: 1_218_000, conversion: 39.1, fill: '#f59e0b' },
  { name: 'Closed Won',  count: 34,   value: 847_000,   conversion: 100,  fill: '#22c55e' },
]

// ─── Deals ──────────────────────────────────────────────────────────────────

export const DEALS: Deal[] = [
  {
    id: 'd1', company: 'TechCorp Global', logo: 'TC', value: 480000,
    stage: 'Proposal', probability: 85, owner: 'Sarah Chen',
    agent: 'NEXUS', agentColor: 'blue', daysInStage: 5,
    priority: 'critical', lastActivity: '2h ago',
    contacts: 4, industry: 'Enterprise SaaS',
  },
  {
    id: 'd2', company: 'InnovateCo', logo: 'IC', value: 320000,
    stage: 'Negotiation', probability: 72, owner: 'Marcus Webb',
    agent: 'NEXUS', agentColor: 'blue', daysInStage: 12,
    priority: 'high', lastActivity: '4h ago',
    contacts: 3, industry: 'FinTech',
  },
  {
    id: 'd3', company: 'Meridian Partners', logo: 'MP', value: 250000,
    stage: 'Discovery', probability: 60, owner: 'Lisa Park',
    agent: 'ARIA', agentColor: 'emerald', daysInStage: 3,
    priority: 'high', lastActivity: '1d ago',
    contacts: 2, industry: 'Private Equity',
  },
  {
    id: 'd4', company: 'CloudNine Systems', logo: 'CN', value: 195000,
    stage: 'Closed Won', probability: 100, owner: 'Tom Brady',
    agent: 'FLUX', agentColor: 'pink', daysInStage: 0,
    priority: 'low', lastActivity: '3h ago',
    contacts: 5, industry: 'Cloud Infrastructure',
  },
  {
    id: 'd5', company: 'DataDrive Inc', logo: 'DD', value: 380000,
    stage: 'Proposal', probability: 78, owner: 'Sarah Chen',
    agent: 'NEXUS', agentColor: 'blue', daysInStage: 8,
    priority: 'high', lastActivity: '6h ago',
    contacts: 3, industry: 'Analytics',
  },
  {
    id: 'd6', company: 'Pinnacle Ventures', logo: 'PV', value: 520000,
    stage: 'Negotiation', probability: 88, owner: 'Marcus Webb',
    agent: 'NEXUS', agentColor: 'blue', daysInStage: 2,
    priority: 'critical', lastActivity: '30m ago',
    contacts: 6, industry: 'Venture Capital',
  },
  {
    id: 'd7', company: 'Vertex Analytics', logo: 'VA', value: 175000,
    stage: 'Prospecting', probability: 40, owner: 'Lisa Park',
    agent: 'ARIA', agentColor: 'emerald', daysInStage: 1,
    priority: 'medium', lastActivity: '2d ago',
    contacts: 1, industry: 'Data Science',
  },
  {
    id: 'd8', company: 'Nexwave Solutions', logo: 'NS', value: 210000,
    stage: 'Discovery', probability: 55, owner: 'Tom Brady',
    agent: 'ARIA', agentColor: 'emerald', daysInStage: 7,
    priority: 'medium', lastActivity: '1d ago',
    contacts: 2, industry: 'Telecommunications',
  },
]

// ─── Activity Feed ──────────────────────────────────────────────────────────

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'a1', agent: 'ARIA', agentColor: 'emerald',
    action: 'Enterprise lead qualified',
    detail: 'TechCorp Inc scored 94/100 — $480K ARR potential. Routed to Sarah Chen.',
    time: '2s', icon: 'star', type: 'lead',
  },
  {
    id: 'a2', agent: 'NEXUS', agentColor: 'blue',
    action: 'Deal risk detected',
    detail: 'Pinnacle Ventures: 14 days without stakeholder contact. Escalating.',
    time: '18s', icon: 'alert', type: 'alert',
  },
  {
    id: 'a3', agent: 'ECHO', agentColor: 'purple',
    action: 'Sequence deployed',
    detail: '23 prospects entered "CFO Decision Maker" outreach sequence.',
    time: '1m', icon: 'mail', type: 'communication',
  },
  {
    id: 'a4', agent: 'VANCE', agentColor: 'amber',
    action: 'Forecast revised upward',
    detail: 'Q4 revenue forecast updated to $3.2M (+12%). New commit probability: 91%.',
    time: '4m', icon: 'chart', type: 'insight',
  },
  {
    id: 'a5', agent: 'SIGIL', agentColor: 'cyan',
    action: 'Competitor alert',
    detail: 'Acme Inc launched 30% pricing reduction. 8 at-risk accounts identified.',
    time: '7m', icon: 'eye', type: 'insight',
  },
  {
    id: 'a6', agent: 'ARIA', agentColor: 'emerald',
    action: 'High-intent visitor detected',
    detail: 'Vertex Analytics CMO visited pricing page 3x. Score: 91/100. Alert sent.',
    time: '12m', icon: 'star', type: 'lead',
  },
  {
    id: 'a7', agent: 'FLUX', agentColor: 'pink',
    action: 'Task cascade triggered',
    detail: 'Assigned 3 follow-up tasks across 3 reps for DataDrive Proposal stage.',
    time: '18m', icon: 'task', type: 'task',
  },
  {
    id: 'a8', agent: 'NEXUS', agentColor: 'blue',
    action: 'Deal advanced',
    detail: 'GlobalEnterprises moved from Discovery → Proposal. Probability: 72%.',
    time: '24m', icon: 'deal', type: 'deal',
  },
  {
    id: 'a9', agent: 'ECHO', agentColor: 'purple',
    action: '99.2% response rate milestone',
    detail: 'Weekly communication benchmark exceeded. Best-performing sequence: "Q3 ROI".',
    time: '31m', icon: 'mail', type: 'communication',
  },
  {
    id: 'a10', agent: 'SIGIL', agentColor: 'cyan',
    action: '12 ICP companies identified',
    detail: 'New funding round detected at 12 target accounts. Passing to ARIA for scoring.',
    time: '44m', icon: 'eye', type: 'insight',
  },
]

// ─── Workflow Cards ─────────────────────────────────────────────────────────

export const WORKFLOW_STAGES = ['New Leads', 'Qualifying', 'Proposal Sent', 'Negotiating', 'Closed']

export const WORKFLOW_CARDS: WorkflowCard[] = [
  {
    id: 'w1', company: 'Quantum Systems', contact: 'Alex Rivera', value: 320000,
    stage: 'New Leads', agent: 'ARIA', agentColor: 'emerald',
    priority: 'high', score: 89, lastAction: 'Scored 89/100', due: 'Today',
    tags: ['Enterprise', 'SaaS'],
  },
  {
    id: 'w2', company: 'Meridian AI', contact: 'Jordan Wu', value: 185000,
    stage: 'New Leads', agent: 'ARIA', agentColor: 'emerald',
    priority: 'medium', score: 74, lastAction: 'Enrichment complete', due: 'Tomorrow',
    tags: ['Mid-Market'],
  },
  {
    id: 'w3', company: 'TechCorp Global', contact: 'Sarah Thompson', value: 480000,
    stage: 'Qualifying', agent: 'ECHO', agentColor: 'purple',
    priority: 'critical', score: 94, lastAction: 'Discovery call booked', due: 'Today',
    tags: ['Enterprise', 'Hot'],
  },
  {
    id: 'w4', company: 'DataDrive Inc', contact: 'Michael Lee', value: 380000,
    stage: 'Qualifying', agent: 'NEXUS', agentColor: 'blue',
    priority: 'high', score: 86, lastAction: 'Pain validated', due: 'Today',
    tags: ['Analytics'],
  },
  {
    id: 'w5', company: 'InnovateCo', contact: 'Emma Davis', value: 320000,
    stage: 'Proposal Sent', agent: 'NEXUS', agentColor: 'blue',
    priority: 'high', score: 81, lastAction: 'Proposal reviewed', due: 'Tomorrow',
    tags: ['FinTech'],
  },
  {
    id: 'w6', company: 'CloudNine', contact: 'Ben Walsh', value: 260000,
    stage: 'Proposal Sent', agent: 'ECHO', agentColor: 'purple',
    priority: 'medium', score: 77, lastAction: 'Follow-up sent', due: 'Fri',
    tags: ['Cloud'],
  },
  {
    id: 'w7', company: 'Pinnacle Ventures', contact: 'Carla Singh', value: 520000,
    stage: 'Negotiating', agent: 'NEXUS', agentColor: 'blue',
    priority: 'critical', score: 92, lastAction: 'Terms reviewed', due: 'Tomorrow',
    tags: ['Enterprise', 'VC'],
  },
  {
    id: 'w8', company: 'CloudNine Systems', contact: 'Tom Brady', value: 195000,
    stage: 'Closed', agent: 'FLUX', agentColor: 'pink',
    priority: 'low', score: 100, lastAction: 'Contract signed', due: 'Done',
    tags: ['Won'],
  },
]

// ─── Brain Data Sources ─────────────────────────────────────────────────────

export const DATA_SOURCES: DataSource[] = [
  { id: 's1', name: 'Salesforce CRM', icon: 'database', status: 'synced',  records: '12,847',  updated: '30s ago',  color: '#3b82f6', angle: 0 },
  { id: 's2', name: 'Gmail / Outlook', icon: 'mail',     status: 'synced',  records: '48,392',  updated: '2m ago',   color: '#22c55e', angle: 60 },
  { id: 's3', name: 'LinkedIn Sales',  icon: 'users',    status: 'syncing', records: '8,203',   updated: 'Live',     color: '#8b5cf6', angle: 120 },
  { id: 's4', name: 'Website Analytics', icon: 'globe', status: 'synced',  records: '1.2M',    updated: 'Live',     color: '#06b6d4', angle: 180 },
  { id: 's5', name: 'Gong / Chorus',   icon: 'mic',     status: 'synced',  records: '3,847',   updated: '15m ago',  color: '#f59e0b', angle: 240 },
  { id: 's6', name: 'ZoomInfo / Apollo', icon: 'search', status: 'synced', records: '284M',    updated: '1h ago',   color: '#ec4899', angle: 300 },
]

// ─── Audit Categories ───────────────────────────────────────────────────────

export const AUDIT_CATEGORIES: AuditCategory[] = [
  {
    name: 'Lead Quality',
    score: 87, grade: 'A-', trend: +8,
    color: '#22c55e',
    issues:       ['No lead scoring automation', '34% unqualified leads passing through'],
    opportunities:['ICP matching can improve quality 40%', 'Intent data not yet utilized'],
  },
  {
    name: 'Response Speed',
    score: 94, grade: 'A', trend: +12,
    color: '#06b6d4',
    issues:       ['Weekend response time > 4 hours'],
    opportunities:['AI automation can achieve sub-60s response 24/7'],
  },
  {
    name: 'Pipeline Health',
    score: 72, grade: 'B', trend: -3,
    color: '#f59e0b',
    issues:       ['3 deals stalled 30+ days', '$840K in late-stage risk', '18% stage regression rate'],
    opportunities:['Automated deal coaching can reduce risk by 60%', 'Weekly AI pipeline review'],
  },
  {
    name: 'Revenue Forecast',
    score: 91, grade: 'A', trend: +5,
    color: '#8b5cf6',
    issues:       ['Manual CRM updates causing data lag'],
    opportunities:['AI forecasting can achieve 94.7% accuracy', 'Scenario planning not utilized'],
  },
  {
    name: 'Customer Retention',
    score: 96, grade: 'A+', trend: +2,
    color: '#22c55e',
    issues:       ['NPS collection inconsistent'],
    opportunities:['Churn prediction model available', 'Expansion revenue not tracked'],
  },
  {
    name: 'Market Intelligence',
    score: 68, grade: 'C+', trend: +14,
    color: '#ef4444',
    issues:       ['No automated competitor monitoring', 'Buying signals not captured', 'ICP not data-driven'],
    opportunities:['200+ signals available via SIGIL', '3.2x more ICP companies findable', 'First-mover advantage on 8 accounts'],
  },
]

export const OVERALL_SCORE = 84

// ─── Department KPIs ────────────────────────────────────────────────────────

export const DEPT_KPIS = {
  totalPipeline:     2_400_000,
  closedRevenue:       847_000,
  leadsQualified:          847,
  avgLeadScore:           87.4,
  dealsClosed:              34,
  winRate:                48.6,
  avgDealSize:          24_900,
  salesCycledays:           32,
  agentsActive:              6,
  tasksCompletedToday:    2172,
  responseTimeSeconds:      47,
  forecastAccuracy:       94.7,
}
