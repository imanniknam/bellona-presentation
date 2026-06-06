'use client'
import { motion } from 'framer-motion'
import {
  DollarSign, Users, TrendingUp, Target, Zap,
  ArrowUpRight, Clock, Star, BarChart3,
} from 'lucide-react'
import MetricCard from '@/components/ui/MetricCard'
import ActivityFeed from '@/components/ui/ActivityFeed'
import RevenueChart from '@/components/charts/RevenueChart'
import PipelineChart from '@/components/charts/PipelineChart'
import { DEALS, DEPT_KPIS } from '@/lib/mock-data'
import { getNow } from '@/lib/utils'

const STAGE_COLOR: Record<string, string> = {
  'Prospecting':  'bg-slate-500/20 text-slate-400',
  'Discovery':    'bg-blue-500/20 text-blue-400',
  'Proposal':     'bg-purple-500/20 text-purple-400',
  'Negotiation':  'bg-amber-500/20 text-amber-400',
  'Closed Won':   'bg-emerald-500/20 text-emerald-400',
  'Closed Lost':  'bg-red-500/20 text-red-400',
}

const PRIORITY_COLOR: Record<string, string> = {
  critical: 'text-red-400',
  high:     'text-amber-400',
  medium:   'text-blue-400',
  low:      'text-slate-500',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8 space-y-6">
      {/* ── Header ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Executive Dashboard</h1>
          <p className="text-slate-500 text-sm">Real-time revenue intelligence · Updated {getNow()}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs text-emerald-400 font-semibold">LIVE</span>
          </div>
          <div className="glass border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-400">
            Q3 · Jun 2025
          </div>
        </div>
      </motion.div>

      {/* ── KPI Cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Active Pipeline"
          value={DEPT_KPIS.totalPipeline}
          prefix="$"
          icon={DollarSign}
          trend={18}
          trendLabel="vs last month"
          delay={0}
          live
          subValue="34 active deals"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
        />
        <MetricCard
          title="Revenue Closed"
          value={DEPT_KPIS.closedRevenue}
          prefix="$"
          icon={TrendingUp}
          trend={22}
          trendLabel="vs last quarter"
          delay={0.08}
          iconColor="text-blue-400"
          iconBg="bg-blue-400/10"
        />
        <MetricCard
          title="Leads Qualified"
          value={DEPT_KPIS.leadsQualified}
          icon={Users}
          trend={34}
          trendLabel="vs last week"
          delay={0.16}
          live
          subValue="Today's total"
          iconColor="text-purple-400"
          iconBg="bg-purple-400/10"
        />
        <MetricCard
          title="Forecast Accuracy"
          value={DEPT_KPIS.forecastAccuracy}
          suffix="%"
          decimals={1}
          icon={Target}
          trend={5}
          trendLabel="vs Q2"
          delay={0.24}
          iconColor="text-amber-400"
          iconBg="bg-amber-400/10"
        />
      </div>

      {/* ── Charts Row ────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="xl:col-span-3 glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">Revenue Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">12-month actuals vs forecast vs target</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-emerald-400 inline-block" /> Actual</span>
              <span className="flex items-center gap-1.5 text-slate-500"><span className="w-3 h-0.5 rounded bg-blue-400 inline-block" /> Forecast</span>
              <span className="flex items-center gap-1.5 text-slate-600"><span className="w-3 h-0.5 rounded border-t-2 border-dashed border-purple-400 inline-block" /> Target</span>
            </div>
          </div>
          <RevenueChart height={260} />
        </motion.div>

        {/* Pipeline Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="xl:col-span-2 glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">Pipeline Funnel</h3>
              <p className="text-xs text-slate-500 mt-0.5">Current quarter by stage</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-600" />
          </div>
          <PipelineChart />
        </motion.div>
      </div>

      {/* ── Bottom Row ────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Deals Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="xl:col-span-3 glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Active Deals</h3>
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full font-medium">
              {DEALS.length} total
            </span>
          </div>

          <div className="space-y-2">
            {DEALS.slice(0, 6).map((deal) => (
              <div
                key={deal.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700/60 transition-colors cursor-pointer group"
              >
                {/* Logo */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0 group-hover:from-emerald-500/20 group-hover:to-cyan-500/20 transition-all">
                  {deal.logo}
                </div>

                {/* Company + contact */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200 truncate">{deal.company}</span>
                    <span className={`text-[10px] font-medium ${PRIORITY_COLOR[deal.priority]}`}>
                      {deal.priority === 'critical' ? '● CRITICAL' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${STAGE_COLOR[deal.stage] ?? 'bg-slate-500/20 text-slate-400'}`}>
                      {deal.stage}
                    </span>
                    <span className="text-[10px] text-slate-600">{deal.lastActivity}</span>
                  </div>
                </div>

                {/* Value + probability */}
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold font-mono text-white">
                    ${(deal.value / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-slate-500">{deal.probability}% prob</div>
                </div>

                {/* Prob bar */}
                <div className="w-12 hidden md:block">
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      style={{ width: `${deal.probability}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          className="xl:col-span-2 glass border border-slate-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Agent Activity</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Live
            </div>
          </div>
          <ActivityFeed maxItems={7} compact />
        </motion.div>
      </div>

      {/* ── Quick Stats Row ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Zap,         label: 'Tasks Today',     value: '2,172',  color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { icon: Clock,       label: 'Avg Response',    value: '47s',    color: 'text-blue-400',    bg: 'bg-blue-400/10' },
          { icon: Star,        label: 'Win Rate',        value: '48.6%',  color: 'text-amber-400',   bg: 'bg-amber-400/10' },
          { icon: ArrowUpRight,label: 'Avg Deal Size',   value: '$24.9K', color: 'text-purple-400',  bg: 'bg-purple-400/10' },
        ].map((stat) => (
          <div key={stat.label} className="glass border border-slate-800/60 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <div className={`font-bold font-mono text-lg ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
