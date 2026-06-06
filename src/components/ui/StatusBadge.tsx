'use client'
import { cn } from '@/lib/utils'
import type { AgentStatus } from '@/lib/mock-data'

const CONFIG: Record<AgentStatus, { dot: string; text: string; bg: string; label: string }> = {
  active:     { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Active' },
  processing: { dot: 'bg-blue-400',    text: 'text-blue-400',    bg: 'bg-blue-400/10',    label: 'Processing' },
  idle:       { dot: 'bg-slate-400',   text: 'text-slate-400',   bg: 'bg-slate-400/10',   label: 'Idle' },
  warning:    { dot: 'bg-amber-400',   text: 'text-amber-400',   bg: 'bg-amber-400/10',   label: 'Warning' },
}

interface StatusBadgeProps {
  status:    AgentStatus
  label?:    string
  size?:     'sm' | 'md'
  pulse?:    boolean
  className?: string
}

export default function StatusBadge({ status, label, size = 'sm', pulse = true, className }: StatusBadgeProps) {
  const c = CONFIG[status]
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
      c.bg, c.text, className,
    )}>
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        {pulse && <span className={cn('animate-ping absolute inset-0 rounded-full opacity-75', c.dot)} />}
        <span className={cn('relative rounded-full h-1.5 w-1.5', c.dot)} />
      </span>
      {label ?? c.label}
    </span>
  )
}
