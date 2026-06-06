'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap, Users, GitBranch, Brain, Workflow,
  BarChart3, FileSearch, Radio, Activity,
  ChevronRight, ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/overview',  icon: Users,       label: 'AI Overview',   desc: 'Department Status',   color: 'emerald' },
  { href: '/org-chart', icon: GitBranch,   label: 'Org Chart',     desc: 'Agent Hierarchy',     color: 'blue' },
  { href: '/brain',     icon: Brain,        label: 'Company Brain', desc: 'Knowledge Graph',     color: 'purple' },
  { href: '/workflow',  icon: Workflow,     label: 'Live Workflow',  desc: 'Active Tasks',        color: 'cyan' },
  { href: '/dashboard', icon: BarChart3,    label: 'Dashboard',     desc: 'Executive View',      color: 'amber' },
  { href: '/audit',     icon: FileSearch,   label: 'Audit',         desc: 'Business Health',     color: 'pink' },
]

const COLOR_ACTIVE: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  purple:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  cyan:    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  pink:    'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-50 border-r border-slate-800/60"
      style={{ background: 'rgba(4, 9, 20, 0.97)', backdropFilter: 'blur(20px)' }}
    >
      {/* ── Logo ────────────────────────────────── */}
      <div className="px-5 py-5 border-b border-slate-800/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight leading-none">AI Revenue</div>
            <div className="text-xs text-slate-500 mt-0.5">Department™</div>
          </div>
          <ArrowUpRight className="w-3 h-3 text-slate-700 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* ── Live Status ──────────────────────────── */}
      <div className="px-5 py-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
            <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs text-emerald-400 font-semibold">6 Agents Active</span>
          <Radio className="w-3 h-3 text-emerald-600 ml-auto" />
        </div>
      </div>

      {/* ── Navigation ──────────────────────────── */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-slate-700 font-semibold uppercase tracking-widest px-3 mb-3">Navigation</p>

        {NAV_ITEMS.map((item, i) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 group cursor-pointer',
                  isActive
                    ? cn('border', COLOR_ACTIVE[item.color])
                    : 'border-transparent text-slate-500 hover:bg-slate-800/40 hover:text-slate-300',
                )}
              >
                <item.icon className={cn('w-4 h-4 flex-shrink-0 transition-colors', isActive ? '' : 'group-hover:text-slate-300')} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-none">{item.label}</div>
                  <div className={cn('text-[10px] mt-0.5 transition-colors', isActive ? 'opacity-70' : 'text-slate-700')}>
                    {item.desc}
                  </div>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-60" />}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* ── System Status ────────────────────────── */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-400">System Status</span>
          </div>
          {[
            { name: 'Lead Engine',   status: 'Online',  color: 'text-emerald-400' },
            { name: 'Pipeline AI',   status: 'Online',  color: 'text-emerald-400' },
            { name: 'Analytics',     status: 'Online',  color: 'text-emerald-400' },
            { name: 'Data Sync',     status: 'Live',    color: 'text-cyan-400' },
          ].map(s => (
            <div key={s.name} className="flex items-center justify-between py-1">
              <span className="text-xs text-slate-600">{s.name}</span>
              <span className={cn('text-xs font-medium font-mono', s.color)}>{s.status}</span>
            </div>
          ))}
        </div>

        {/* Version */}
        <div className="text-center mt-3">
          <span className="text-[10px] text-slate-700">v2.4.1 · Enterprise</span>
        </div>
      </div>
    </aside>
  )
}
