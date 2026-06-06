'use client'
import { motion } from 'framer-motion'
import { PIPELINE_STAGES } from '@/lib/mock-data'

interface PipelineChartProps {
  compact?: boolean
}

export default function PipelineChart({ compact = false }: PipelineChartProps) {
  const max = PIPELINE_STAGES[0].count

  return (
    <div className="space-y-3">
      {PIPELINE_STAGES.map((stage, i) => {
        const widthPct = (stage.count / max) * 100
        return (
          <div key={stage.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.fill }} />
                <span className="text-slate-300 font-medium">{stage.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-500">{stage.count.toLocaleString()} leads</span>
                <span className="font-mono font-bold text-slate-300">
                  ${(stage.value / 1_000_000).toFixed(1)}M
                </span>
                {i < PIPELINE_STAGES.length - 1 && (
                  <span className="text-slate-600 w-12 text-right">{stage.conversion}% →</span>
                )}
              </div>
            </div>

            <div className="h-8 bg-slate-900/60 rounded-lg overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 1.2, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
                className="h-full rounded-lg relative"
                style={{ background: `linear-gradient(90deg, ${stage.fill}cc, ${stage.fill}66)` }}
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
              </motion.div>

              {/* Value label inside bar */}
              <div className="absolute inset-0 flex items-center px-3">
                <span className="text-xs font-mono font-bold text-white/80">
                  {stage.count.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )
      })}

      {/* Summary */}
      <div className="pt-3 mt-3 border-t border-slate-800/60 grid grid-cols-3 gap-3">
        {[
          { label: 'Total Leads', value: '2,070' },
          { label: 'Total Value', value: '$16.7M' },
          { label: 'Avg Conversion', value: '40.7%' },
        ].map(kpi => (
          <div key={kpi.label} className="text-center">
            <div className="font-mono font-bold text-white text-sm">{kpi.value}</div>
            <div className="text-xs text-slate-600">{kpi.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
