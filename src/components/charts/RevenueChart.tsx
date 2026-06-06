'use client'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'
import { REVENUE_DATA } from '@/lib/mock-data'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label} 2024</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-6 text-sm">
          <span className="text-slate-400 capitalize">{entry.name}</span>
          <span className="font-mono font-bold" style={{ color: entry.color }}>
            ${(entry.value / 1000).toFixed(0)}K
          </span>
        </div>
      ))}
    </div>
  )
}

interface RevenueChartProps {
  height?: number
}

export default function RevenueChart({ height = 280 }: RevenueChartProps) {
  // Only show actual revenue for months with data
  const data = REVENUE_DATA.map(d => ({
    ...d,
    revenue:  d.revenue  || undefined,
    forecast: d.forecast || undefined,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradTarget" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

        <XAxis
          dataKey="month"
          tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Space Grotesk' }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Space Grotesk' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
          width={48}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />

        <Area
          type="monotone"
          dataKey="target"
          name="target"
          stroke="#8b5cf6"
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="url(#gradTarget)"
          dot={false}
          activeDot={false}
        />
        <Area
          type="monotone"
          dataKey="forecast"
          name="forecast"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#gradForecast)"
          dot={false}
          activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="revenue"
          stroke="#22c55e"
          strokeWidth={2.5}
          fill="url(#gradRevenue)"
          dot={false}
          activeDot={{ r: 5, fill: '#22c55e', stroke: '#020617', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
