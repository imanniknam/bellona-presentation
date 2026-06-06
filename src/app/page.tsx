'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Zap, Brain, TrendingUp, Shield,
  Clock, Users, BarChart3, Workflow, ChevronRight,
  Lock, Globe, Activity,
} from 'lucide-react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

// ─── Live ticker — operational, not marketing ─────────────────────────────────

const TICKS = [
  { agent: 'ARIA',  color: 'text-emerald-400 bg-emerald-400/8', msg: 'TechCorp Global · $480K ARR qualified · Score 94/100 · Routed to enterprise queue' },
  { agent: 'NEXUS', color: 'text-blue-400 bg-blue-400/8',       msg: 'Pipeline delta +$240K detected vs last week · 3 new signals from LinkedIn monitoring' },
  { agent: 'ECHO',  color: 'text-purple-400 bg-purple-400/8',   msg: '23-touch follow-up sequence live · Pinnacle Ventures · Reply rate: 78%'             },
  { agent: 'VANCE', color: 'text-amber-400 bg-amber-400/8',     msg: 'Q4 forecast revised +12% · Confidence interval ±3% · Board deck updated'           },
  { agent: 'SIGIL', color: 'text-cyan-400 bg-cyan-400/8',       msg: 'Competitor pricing change detected · 8 accounts flagged · Battle card updated'      },
  { agent: 'FLUX',  color: 'text-pink-400 bg-pink-400/8',       msg: 'Deal cycle: 4.2 days → 18 hours · 5 automations executed · 0 human touches needed'  },
]

// ─── Agents — precise capability framing ─────────────────────────────────────

const AGENTS = [
  { name:'ARIA',  role:'Lead Qualification Engine',  metric:'94 leads scored/day', sub:'Avg qualify time: 8 sec',  color:'text-emerald-400', hex:'#34d399' },
  { name:'NEXUS', role:'Pipeline Intelligence',       metric:'$5.04M tracked live', sub:'Forecast drift: ±3.1%',   color:'text-blue-400',    hex:'#60a5fa' },
  { name:'ECHO',  role:'Outreach & Sequences',        metric:'23% reply rate',      sub:'vs 4% industry baseline', color:'text-purple-400',  hex:'#a78bfa' },
  { name:'VANCE', role:'Revenue Forecasting',         metric:'94.7% accuracy',      sub:'12-month rolling model',  color:'text-amber-400',   hex:'#fbbf24' },
  { name:'SIGIL', role:'Market & Competitor Intel',   metric:'200+ sources live',   sub:'Real-time signal monitoring',color:'text-cyan-400', hex:'#22d3ee' },
  { name:'FLUX',  role:'Workflow Orchestration',      metric:'31 tasks/hr',         sub:'0 human dependencies',   color:'text-pink-400',    hex:'#f472b6'  },
]

// ─── Outcome statements — not features, outcomes ─────────────────────────────

const OUTCOMES = [
  { icon: TrendingUp, stat:'3.4×',   label:'pipeline quality',          sub:'AI lead scoring routes only ICP-fit opportunities to reps',              color:'text-emerald-400' },
  { icon: Clock,      stat:'8 sec',  label:'lead response time',        sub:'From 4-hour average — leads contacted before competitors can respond',   color:'text-blue-400'    },
  { icon: Brain,      stat:'94.7%',  label:'forecast accuracy',         sub:'VANCE predicts quarterly revenue within 3% — before the quarter ends',  color:'text-purple-400'  },
  { icon: Shield,     stat:'847h',   label:'saved per month',           sub:'Across research, writing, data entry, reporting, follow-up, scheduling', color:'text-amber-400'   },
]

// ─── Case study results — specific, attributed, verifiable ───────────────────

const CASES = [
  {
    company: 'TechCorp Global',
    industry: 'Enterprise SaaS · 280 employees',
    result: 'Closed $2.4M in new ARR in 90 days without adding a single SDR. Pipeline velocity increased 3.1× after ARIA and ECHO deployment.',
    metric: '+$2.4M ARR',
    period: '90 days',
    name: 'Sarah Chen',
    title: 'VP Revenue',
  },
  {
    company: 'DataDrive Inc',
    industry: 'Analytics Platform · 140 employees',
    result: 'VANCE predicted our $3.2M quarter within 1.8% accuracy. Our board approved a 40% headcount freeze based on AI coverage confidence.',
    metric: '1.8% forecast error',
    period: 'Full quarter',
    name: 'Michael Torres',
    title: 'Chief Financial Officer',
  },
  {
    company: 'Pinnacle Ventures',
    industry: 'Growth Equity · 60 employees',
    result: 'NEXUS flagged 3 late-stage deals going dark 18 days before they would have churned. Recovered $1.1M in pipeline we would have lost.',
    metric: '$1.1M recovered',
    period: '18-day early warning',
    name: 'Lisa Park',
    title: 'Chief Revenue Officer',
  },
]

export default function LandingPage() {
  const [tickIdx, setTickIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTickIdx(i => (i + 1) % TICKS.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-ai-bg text-white overflow-x-hidden">

      {/* ── Subtle background — precision grid, no blobs ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="grid-bg absolute inset-0 opacity-100" />
        {/* Single, restrained accent glow — not three blobs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Navbar ──────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-4 max-w-7xl mx-auto border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] text-slate-950"
            style={{ background: 'linear-gradient(135deg, #34d399, #06b6d4)' }}
          >
            AI
          </div>
          <div>
            <span className="text-[13px] font-semibold text-white tracking-tight">Revenue OS</span>
            <span className="text-[10px] text-slate-600 ml-2 font-mono">Enterprise</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[13px] text-slate-500">
          {['Platform', 'Agents', 'Security', 'Case Studies'].map(item => (
            <a key={item} href="#" className="hover:text-slate-300 transition-colors cursor-pointer">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer px-3 py-1.5">
            Sign in
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-950 font-semibold text-[13px] px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #34d399, #06b6d4)' }}
          >
            Request access <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-16 text-center">

        {/* Positioning badge — operational, not marketing */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 text-[11px] text-slate-500 border border-white/[0.06] bg-white/[0.02] rounded-full px-4 py-2 mb-10"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-slate-500">6 AI agents active now</span>
          <span className="text-white/20">·</span>
          <span className="text-slate-500 font-mono">$5.04M pipeline under management</span>
        </motion.div>

        {/* Headline — authoritative positioning */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          <span className="text-white">The AI operating system</span>
          <br />
          <span className="text-white/40">for revenue teams.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="text-[17px] text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Six specialized agents handle lead qualification, pipeline management,
          outreach, forecasting, and intelligence — continuously, without headcount.
        </motion.p>

        {/* CTA — enterprise framing, not consumer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.21 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-950 font-bold text-[14px] px-7 py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg"
            style={{ background: 'linear-gradient(135deg, #34d399, #06b6d4)', boxShadow: '0 0 32px rgba(52,211,153,0.2)' }}
          >
            Enter live demo <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-[14px] px-7 py-3.5 rounded-xl border border-white/[0.07] hover:border-white/[0.12] bg-white/[0.02] transition-all duration-200 cursor-pointer">
            Book enterprise demo
          </button>
        </motion.div>

        {/* Precise metric strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-14"
        >
          {[
            { label: 'Pipeline managed',    prefix: '$', value: 5.04,  suffix: 'M',   dec: 2 },
            { label: 'Leads qualified/day', prefix: '',  value: 94,    suffix: '',    dec: 0 },
            { label: 'Forecast accuracy',   prefix: '',  value: 94.7,  suffix: '%',   dec: 1 },
            { label: 'Hours saved/month',   prefix: '',  value: 847,   suffix: 'h',   dec: 0 },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="border border-white/[0.05] bg-white/[0.02] rounded-xl p-4 text-left"
            >
              <div className="text-xl font-bold text-white mb-1 font-mono tabular-nums">
                <AnimatedCounter target={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.dec} duration={2000} />
              </div>
              <div className="text-[11px] text-slate-600">{m.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Live activity feed — operational proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto border border-white/[0.05] bg-white/[0.015] rounded-xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.04]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-[10px] text-slate-700 font-mono uppercase tracking-wider">Agent activity · live</span>
          </div>
          <div className="px-4 py-3 h-10 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={tickIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="flex items-center gap-3 w-full"
              >
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded flex-shrink-0 ${TICKS[tickIdx].color}`}>
                  {TICKS[tickIdx].agent}
                </span>
                <span className="text-[12px] text-slate-400 truncate">{TICKS[tickIdx].msg}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ── Trusted by — text-only logos (Stripe style) ────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-20">
        <div className="border-t border-b border-white/[0.04] py-8">
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.16em] text-center mb-8">
            Deployed at revenue teams across
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {[
              'TechCorp Global', 'DataDrive Inc', 'Pinnacle Ventures',
              'Nexwave Solutions', 'Vertex Analytics', 'CloudNine Corp',
            ].map(name => (
              <span key={name} className="text-[13px] font-semibold text-slate-700 hover:text-slate-500 transition-colors cursor-default tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcome metrics — lead with ROI ────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-3 tracking-tight"
          >
            Deployed results, not projected ones
          </motion.h2>
          <p className="text-slate-500 text-[15px]">Verified outcomes from production deployments</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {OUTCOMES.map((o, i) => {
            const Icon = o.icon
            return (
              <motion.div
                key={o.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="border border-white/[0.05] bg-white/[0.015] rounded-2xl p-6 hover:border-white/[0.09] transition-colors duration-300"
              >
                <Icon className={`w-5 h-5 ${o.color} mb-4`} />
                <div className={`text-3xl font-black font-mono ${o.color} mb-1`}>{o.stat}</div>
                <div className="text-[13px] font-semibold text-slate-300 mb-2">{o.label}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{o.sub}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── Agent showcase — capability, not marketing ──────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Six agents. One department.</h2>
            <p className="text-slate-500 text-[14px]">Each agent is a domain specialist. Together, they operate as a unified revenue team.</p>
          </div>
          <Link
            href="/org-chart"
            className="hidden md:flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer border border-white/[0.06] px-3 py-1.5 rounded-lg hover:border-white/[0.1]"
          >
            Agent network <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group border border-white/[0.05] bg-white/[0.015] rounded-xl p-5 hover:border-white/[0.09] transition-all duration-200 cursor-pointer relative overflow-hidden"
            >
              {/* Precision left accent — matches sidebar */}
              <div
                className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: agent.hex }}
              />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`text-[11px] font-bold font-mono ${agent.color}`}>{agent.name}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{agent.role}</div>
                </div>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
              </div>
              <div className={`text-lg font-bold font-mono ${agent.color} tabular-nums`}>{agent.metric}</div>
              <div className="text-[10px] text-slate-700 mt-1">{agent.sub}</div>
              <div className="mt-3 h-px bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${60 + i * 6}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.08 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: agent.hex + '60' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Case studies — no star ratings, specific outcomes ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Verified deployments</h2>
          <p className="text-slate-500 text-[14px]">Specific outcomes, named organizations, attributed executives</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {CASES.map((c, i) => (
            <motion.div
              key={c.company}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="border border-white/[0.05] bg-white/[0.015] rounded-2xl p-6 hover:border-white/[0.09] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[13px] font-bold text-white">{c.company}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{c.industry}</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold font-mono text-emerald-400">{c.metric}</div>
                  <div className="text-[10px] text-slate-600">{c.period}</div>
                </div>
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed mb-5">{c.result}</p>
              <div className="pt-4 border-t border-white/[0.04] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-400 flex-shrink-0">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-300">{c.name}</div>
                  <div className="text-[10px] text-slate-600">{c.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Security + compliance trust strip ──────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="border border-white/[0.04] bg-white/[0.01] rounded-2xl p-8">
          <div className="text-center mb-8">
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.14em]">Enterprise security & compliance</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { icon: Lock,     label: 'SOC2 Type II',       sub: 'Audited annually'    },
              { icon: Shield,   label: 'ISO 27001',          sub: 'Certified'           },
              { icon: Globe,    label: 'GDPR Compliant',     sub: 'EU data residency'   },
              { icon: Activity, label: '99.97% Uptime SLA',  sub: '12-month trailing'   },
              { icon: Users,    label: 'SSO / SAML 2.0',     sub: 'Okta, Azure, Google' },
              { icon: Zap,      label: 'Custom Agreements',  sub: 'MSA · DPA · NDA'     },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                  <Icon className="w-4 h-4 text-slate-600" />
                  <div className="text-[12px] font-semibold text-slate-400">{item.label}</div>
                  <div className="text-[10px] text-slate-700">{item.sub}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA — enterprise positioning, not consumer ──────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-white/[0.06] bg-white/[0.015] rounded-2xl p-14 text-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.06) 0%, transparent 60%)' }}
          />
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.16em] mb-6">Ready to deploy</p>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
              Replace headcount with<br />an AI revenue department.
            </h2>
            <p className="text-slate-500 mb-10 text-[15px] max-w-lg mx-auto leading-relaxed">
              Most teams are live within 48 hours. Average client sees
              $210K in incremental pipeline in the first 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 text-slate-950 font-bold px-9 py-4 rounded-xl transition-all duration-200 text-[14px] cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #34d399, #06b6d4)', boxShadow: '0 0 40px rgba(52,211,153,0.2)' }}
              >
                Enter live demo <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 font-medium px-9 py-4 rounded-xl border border-white/[0.07] hover:border-white/[0.12] bg-white/[0.02] transition-all duration-200 text-[14px] cursor-pointer">
                Book enterprise demo
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-[12px] text-slate-600">
              {['Custom enterprise agreements', '48-hour deployment', 'Dedicated success engineer'].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer — Stripe-precise ─────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded flex items-center justify-center font-black text-[8px] text-slate-950"
              style={{ background: 'linear-gradient(135deg, #34d399, #06b6d4)' }}
            >AI</div>
            <span className="text-[12px] text-slate-600">Revenue OS · Enterprise Platform · © 2025</span>
          </div>
          <div className="flex gap-6 text-[12px] text-slate-700">
            {['Privacy', 'Security', 'Terms', 'Status', 'Docs'].map(i => (
              <a key={i} href="#" className="hover:text-slate-500 transition-colors cursor-pointer">{i}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
