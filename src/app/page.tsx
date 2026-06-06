'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Zap, Brain, TrendingUp, Shield, Clock, Users,
  Star, BarChart3, Workflow, CheckCircle2, Play,
} from 'lucide-react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

const AGENTS = [
  { name: 'ARIA',  role: 'Lead Qualification',    from: 'from-emerald-500', to: 'to-green-400',  metric: '94 leads/day',  color: 'text-emerald-400' },
  { name: 'NEXUS', role: 'Pipeline Intelligence',  from: 'from-blue-500',    to: 'to-cyan-400',   metric: '$2.4M tracked', color: 'text-blue-400' },
  { name: 'ECHO',  role: 'Communications AI',      from: 'from-purple-500',  to: 'to-violet-400', metric: '99.2% response',color: 'text-purple-400' },
  { name: 'VANCE', role: 'Revenue Forecasting',    from: 'from-amber-500',   to: 'to-orange-400', metric: '94.7% accuracy',color: 'text-amber-400' },
  { name: 'SIGIL', role: 'Market Intelligence',    from: 'from-cyan-500',    to: 'to-teal-400',   metric: '200+ sources',  color: 'text-cyan-400' },
  { name: 'FLUX',  role: 'Workflow Orchestration', from: 'from-pink-500',    to: 'to-rose-400',   metric: '31 tasks/hr',   color: 'text-pink-400' },
]

const LIVE_TICKS = [
  { agent: 'ARIA',  color: 'text-emerald-400 bg-emerald-400/10', msg: 'TechCorp Inc scored 94/100 — $480K ARR qualified' },
  { agent: 'NEXUS', color: 'text-blue-400 bg-blue-400/10',       msg: 'Pipeline forecast updated: +$240K this quarter' },
  { agent: 'ECHO',  color: 'text-purple-400 bg-purple-400/10',   msg: 'Follow-up sequence deployed to 23 prospects' },
  { agent: 'VANCE', color: 'text-amber-400 bg-amber-400/10',     msg: 'Q4 revenue forecast revised upward by 12%' },
  { agent: 'SIGIL', color: 'text-cyan-400 bg-cyan-400/10',       msg: 'Competitor price cut detected — 8 accounts at risk' },
  { agent: 'FLUX',  color: 'text-pink-400 bg-pink-400/10',       msg: 'Deal cycle automated: 4 days → 18 hours' },
]

const FEATURES = [
  { icon: Brain,     title: 'Company Brain',         desc: 'A living knowledge base that learns from every customer interaction, deal, and market signal in real-time.', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/15' },
  { icon: TrendingUp, title: 'Revenue Intelligence', desc: 'AI-powered forecasting with 94.7% accuracy. Know your numbers before the month ends.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15' },
  { icon: Shield,    title: 'Deal Protection',        desc: 'Identify at-risk deals 30 days before they go dark. Never lose a deal to inattention again.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/15' },
  { icon: Clock,     title: '24/7 Lead Qualification', desc: 'ARIA never sleeps. Every inbound lead is scored, enriched, and prioritized within 60 seconds.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/15' },
  { icon: Users,     title: 'Agent Collaboration',    desc: 'Six agents that share context, coordinate actions, and escalate to humans only when truly needed.', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/15' },
  { icon: Star,      title: 'Instant Business Audit', desc: 'Full revenue operation audit in 60 seconds. Gaps, opportunities, and quick wins identified automatically.', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/15' },
]

export default function LandingPage() {
  const [tickIdx, setTickIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTickIdx(i => (i + 1) % LIVE_TICKS.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-ai-bg text-white overflow-x-hidden">

      {/* ── Animated background ─────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="bg-blob w-[600px] h-[600px] bg-emerald-500/6 top-[-100px] left-[10%] animate-blob" />
        <div className="bg-blob w-[500px] h-[500px] bg-blue-500/6 top-[40%] right-[5%] animate-blob-delay" />
        <div className="bg-blob w-[400px] h-[400px] bg-purple-500/6 bottom-[10%] left-[30%] animate-blob-slow" />
        <div className="grid-bg absolute inset-0 opacity-100" />
      </div>

      {/* ── Navbar ─────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">AI Revenue Department</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          {['Features', 'Agents', 'Pricing', 'Case Studies'].map(item => (
            <a key={item} href="#" className="hover:text-white transition-colors cursor-pointer">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:block text-sm text-slate-400 hover:text-white transition-colors cursor-pointer px-4 py-2">
            Log In
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Enter Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-20 text-center">

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-sm text-emerald-400 font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
            <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          Live Demo — 6 AI Agents Currently Active
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6"
        >
          <span className="text-white">Your AI</span>
          <br />
          <span className="gradient-text-green">Revenue Department</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Six specialized AI agents qualify leads, manage your pipeline, forecast revenue,
          and close deals — working around the clock without adding headcount.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-2xl transition-all duration-200 text-lg shadow-xl shadow-emerald-500/20 cursor-pointer"
          >
            Enter Demo Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="flex items-center gap-2 glass border border-slate-700/60 hover:border-slate-600 text-slate-300 font-medium px-8 py-4 rounded-2xl transition-all duration-200 text-lg cursor-pointer">
            <Play className="w-4 h-4" /> Watch 2-min Walkthrough
          </button>
        </motion.div>

        {/* Live metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16"
        >
          {[
            { label: 'Active Pipeline',       prefix: '$', value: 2.4,   suffix: 'M',  dec: 1 },
            { label: 'Leads Qualified Today', prefix: '',  value: 847,   suffix: '',   dec: 0 },
            { label: 'Avg Lead Score',        prefix: '',  value: 87.4,  suffix: '/100',dec: 1 },
            { label: 'Forecast Accuracy',     prefix: '',  value: 94.7,  suffix: '%',  dec: 1 },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="glass border border-slate-700/50 rounded-2xl p-5 text-left hover:border-emerald-500/20 transition-colors duration-300"
            >
              <div className="text-2xl font-bold text-white mb-1 font-mono">
                <AnimatedCounter target={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.dec} duration={2000} />
              </div>
              <div className="text-xs text-slate-500">{m.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Live activity ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass border border-slate-700/40 rounded-2xl p-4 max-w-3xl mx-auto overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-3 text-xs text-slate-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            LIVE AGENT ACTIVITY FEED
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tickIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3"
            >
              <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg ${LIVE_TICKS[tickIdx].color}`}>
                {LIVE_TICKS[tickIdx].agent}
              </span>
              <span className="text-sm text-slate-300">{LIVE_TICKS[tickIdx].msg}</span>
              <span className="text-xs text-slate-600 ml-auto flex-shrink-0">just now</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Agent Showcase ──────────────────────── */}
      <section id="agents" className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-3"
          >
            Your AI Revenue Team
          </motion.h2>
          <p className="text-slate-400">Six specialized agents. One unified department.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600/70 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              {/* Top accent */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${agent.from} ${agent.to} opacity-50 group-hover:opacity-100 transition-opacity`} />

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.from} ${agent.to} flex items-center justify-center font-bold font-mono text-slate-950 text-sm shadow-lg`}>
                  {agent.name[0]}
                </div>
                <div>
                  <div className={`font-bold font-mono text-sm ${agent.color}`}>{agent.name}</div>
                  <div className="text-xs text-slate-500">{agent.role}</div>
                </div>
                <div className="ml-auto">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                </div>
              </div>

              <div className={`text-lg font-bold font-mono ${agent.color}`}>{agent.metric}</div>

              <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${65 + i * 5}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${agent.from} ${agent.to}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/overview"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors cursor-pointer"
          >
            View full agent profiles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Features ────────────────────────────── */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-3"
          >
            Built for Revenue Leaders
          </motion.h2>
          <p className="text-slate-400">Everything your revenue team needs, powered by AI</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`border rounded-2xl p-6 ${f.bg} hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4 border`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Social Proof ────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: '"We closed 40% more deals in Q3 without hiring a single SDR."', name: 'Sarah Chen', title: 'VP Sales, TechCorp Global', avatar: 'SC' },
            { quote: '"VANCE predicted our $3.2M quarter within 2% accuracy. Remarkable."', name: 'Michael Torres', title: 'CFO, DataDrive Inc', avatar: 'MT' },
            { quote: '"Our pipeline velocity tripled. NEXUS caught 3 deals we would have lost."', name: 'Lisa Park', title: 'CRO, Pinnacle Ventures', avatar: 'LP' },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-slate-950">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border border-emerald-500/20 rounded-3xl p-12 text-center shadow-2xl shadow-emerald-500/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to transform your<br />
              <span className="gradient-text-green">revenue operation?</span>
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Join 2,400+ companies using AI Revenue Department
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold px-10 py-4 rounded-2xl transition-all duration-200 text-lg shadow-lg shadow-emerald-500/25 cursor-pointer"
              >
                Enter Demo <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 glass border border-slate-700 hover:border-slate-600 text-slate-300 font-medium px-10 py-4 rounded-2xl transition-all duration-200 text-lg cursor-pointer">
                Book a Call
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
              {['No credit card required', 'Setup in 24 hours', 'Cancel anytime'].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-slate-500">© 2025 AI Revenue Department. Enterprise Platform.</span>
          </div>
          <div className="flex gap-6 text-xs text-slate-600">
            {['Privacy', 'Terms', 'Security', 'Status'].map(i => (
              <a key={i} href="#" className="hover:text-slate-400 transition-colors cursor-pointer">{i}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
