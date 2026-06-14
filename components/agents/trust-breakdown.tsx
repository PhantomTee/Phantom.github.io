'use client'

import type { TrustFactors } from '@/lib/reputation'

interface TrustBreakdownProps {
  factors: TrustFactors
}

const FACTOR_LABELS: { key: keyof TrustFactors; label: string; weight: string }[] = [
  { key: 'reliability', label: 'Reliability', weight: '40%' },
  { key: 'discipline', label: 'Discipline', weight: '25%' },
  { key: 'completion', label: 'Completion', weight: '20%' },
  { key: 'consistency', label: 'Consistency', weight: '15%' },
]

function barColor(value: number): string {
  if (value >= 0.84) return '#22d3ee'
  if (value >= 0.66) return '#34d399'
  if (value >= 0.50) return '#fbbf24'
  return '#f87171'
}

export function TrustBreakdown({ factors }: TrustBreakdownProps) {
  return (
    <div className="space-y-3">
      {FACTOR_LABELS.map(({ key, label, weight }) => {
        const value = factors[key]
        const pct = Math.round(value * 100)
        const color = barColor(value)
        return (
          <div key={key}>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{label}</span>
              <span className="text-gray-500">{weight} weight · <span style={{ color }}>{pct}%</span></span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
