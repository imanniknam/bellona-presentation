'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users, GitBranch, Brain, Workflow, BarChart3, FileSearch,
  Activity, Command, Shield, Database,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Navigation — grouped by function, not alphabetically ─────────────────────

const NAV_GROUPS = [
  {
    label: 'Command Center',
    items: [
      { href: '/overview',  icon: Users,      label: 'AI Overview',    sub: 'Department status'    },
      { href: '/org-chart', icon: GitBranch,  label: 'Agent Network',  sub: 'Live hierarchy'       },
      { href: '/brain',     icon: Brain,      label: 'Company Brain',  sub: 'Knowledge interface'  },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/workflow',  icon: Workflow,   label: 'Live Workflow',  sub: 'Pipeline in motion'   },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/dashboard', icon: BarChart3,  label: 'Executive View', sub: 'Revenue intelligence' },
      { href: '/audit',     icon: FileSearch, label: 'Business Audit', sub: 'AI readiness scan'    },
    ],
  },
]

const HEALTH = [
  { label: 'Lead Engine',  latency: '< 80ms',  dot: 'bg-emerald-500' },
  { label: 'Pipeline AI',  latency: '< 120ms', dot: 'bg-emerald-500' },
  { label: 'Data Sync',    latency: '< 2s',    dot: 'bg-cyan-400 animate-pulse' },
  { label: 'Analytics',    latency: '< 45ms',  dot: 'bg-emerald-500' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-50 border-r border-white/[0.04]"
      style={{ background: 'rgba(3, 7, 18, 0.99)', backdropFilter: 'blur(24px)' }}
    >
      {/* ── Wordmark + command palette ─────────────── */}
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.04] space-y-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-[10px] text-slate-950 tracking-tight"
            style={{ background: 'linear-gradient(135deg, #34d399, #06b6d4)' }}
          >
            AI
          </div>
          <div className="leading-none">
            <div className="text-[13px] font-semibold text-white tracking-tight">Revenue OS</div>
            <div className="text-[10px] text-slate-600 mt-0.5 font-mono">Enterprise · v2.4.1</div>
          </div>
        </Link>

        {/* ⌘K — signals a serious product */}
        <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors cursor-pointer group">
          <Command className="w-3 h-3 text-slate-700 group-hover:text-slate-500 transition-colors" />
          <span className="text-[11px] text-slate-700 group-hover:text-slate-500 transition-colors flex-1 text-left">Quick search</span>
          <kbd className="text-[9px] text-slate-700 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">⌘K</kbd>
        </button>
      </div>

      {/* ── Live agent status strip ────────────────── */}
      <div className="px-4 py-2.5 border-b border-white/[0.04] flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-70" />
          <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        <span className="text-[11px] text-emerald-400 font-medium">6 agents online</span>
        <span className="ml-auto text-[10px] text-slate-700 font-mono">99.94% SLA</span>
      </div>

      {/* ── Navigation ────────────────────────────── */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label}>
            <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.14em] px-2 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item, i) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (gi * 3 + i) * 0.04, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all duration-150 group relative cursor-pointer',
                        isActive
                          ? 'bg-emerald-500/8 text-emerald-400'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]',
                      )}
                    >
                      {/* Linear-signature: animated left accent bar */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active-bar"
                          className="absolute left-0 top-[5px] bottom-[5px] w-[2px] rounded-full bg-emerald-400"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <Icon
                        className={cn(
                          'w-[14px] h-[14px] flex-shrink-0 ml-1 transition-colors',
                          isActive ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-400',
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className={cn('text-[12px] font-medium leading-none', isActive ? 'text-emerald-400' : '')}>
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-700 mt-[3px] leading-none">{item.sub}</div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── System health ─────────────────────────── */}
      <div className="px-3 border-t border-white/[0.04] pt-3 pb-3 space-y-2">
        <div className="flex items-center gap-1.5 px-1 mb-1">
          <Activity className="w-[11px] h-[11px] text-slate-700" />
          <span className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.12em]">System Health</span>
        </div>

        <div className="rounded-lg border border-white/[0.04] overflow-hidden">
          {HEALTH.map((row, i) => (
            <div
              key={row.label}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5',
                i < HEALTH.length - 1 && 'border-b border-white/[0.03]',
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', row.dot)} />
              <span className="text-[10px] text-slate-600 flex-1 leading-none">{row.label}</span>
              <span className="text-[10px] font-mono text-slate-700">{row.latency}</span>
            </div>
          ))}
        </div>

        {/* Data freshness */}
        <div className="flex items-center gap-1.5 px-1">
          <Database className="w-[10px] h-[10px] text-slate-800" />
          <span className="text-[9px] text-slate-800 font-mono">68,573 records · synced 18s ago</span>
        </div>

        {/* Org context */}
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <div className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black bg-slate-700 text-slate-300 flex-shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-slate-400 leading-none truncate">Acme Corp</div>
            <div className="text-[9px] text-slate-700 mt-[3px]">CEO · Enterprise</div>
          </div>
          <Shield className="w-[11px] h-[11px] text-emerald-700 flex-shrink-0" />
        </div>

        <div className="flex items-center justify-between px-1">
          <span className="text-[9px] text-slate-800 font-mono">SOC2 · ISO 27001</span>
          <span className="text-[9px] text-slate-800 font-mono">v2.4.1</span>
        </div>
      </div>
    </aside>
  )
}
