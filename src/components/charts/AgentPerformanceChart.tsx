'use client'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip,
} from 'recharts'

const data = [
  { metric: 'Speed',      ARIA: 97, NEXUS: 88, ECHO: 99 },
  { metric: 'Accuracy',   ARIA: 94, NEXUS: 94, ECHO: 96 },
  { metric: 'Coverage',   ARIA: 89, NEXUS: 91, ECHO: 88 },
  { metric: 'Conversion', ARIA: 87, NEXUS: 84, ECHO: 82 },
  { metric: 'Efficiency', ARIA: 96, NEXUS: 97, ECHO: 98 },
  { metric: 'Learning',   ARIA: 93, NEXUS: 90, ECHO: 95 },
]

const AGENTS_SHOWN = [
  { key: 'ARIA',  color: '#22c55e' },
  { key: 'NEXUS', color: '#3b82f6' },
  { key: 'ECHO',  color: '#8b5cf6' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p className="text-xs text-slate-400 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex justify-between gap-4 text-xs">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="font-mono font-bold text-white">{entry.value}%</span>
        </div>
      ))}
    </div>
  )
}

export default function AgentPerformanceChart() {
  return (
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data} margin={{ top: 0, right: 24, bottom: 0, left: 24 }}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Space Grotesk' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {AGENTS_SHOWN.map(agent => (
            <Radar
              key={agent.key}
              name={agent.key}
              dataKey={agent.key}
              stroke={agent.color}
              fill={agent.color}
              fillOpacity={0.1}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2">
        {AGENTS_SHOWN.map(agent => (
          <div key={agent.key} className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: agent.color }} />
            {agent.key}
          </div>
        ))}
      </div>
    </div>
  )
}
