'use client'

import { SPEND_CATEGORIES } from '@/lib/types'
import type { AgentEvent } from '@/lib/types'

interface SpendDonutProps {
  events: AgentEvent[]
  size?: number
}

const CATEGORY_COLORS: Record<string, string> = {
  'data-apis':      '#22d3ee',
  'compute':        '#818cf8',
  'storage':        '#34d399',
  'agent-services': '#fbbf24',
}

export function SpendDonut({ events, size = 120 }: SpendDonutProps) {
  const payments = events.filter(e => e.kind === 'payment_success' && e.amountUsdc != null)

  const totals: Record<string, number> = {}
  for (const cat of SPEND_CATEGORIES) totals[cat.id] = 0
  for (const e of payments) {
    if (e.category) totals[e.category] = (totals[e.category] ?? 0) + (e.amountUsdc ?? 0)
  }

  const total = Object.values(totals).reduce((s, v) => s + v, 0)

  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <span className="font-mono text-[9px] text-neutral-300 tracking-[0.1em] text-center leading-relaxed">
          no spend<br />yet
        </span>
      </div>
    )
  }

  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 12
  const innerR = r * 0.55

  // Build arc segments
  const entries = SPEND_CATEGORIES.map(cat => ({
    id: cat.id,
    label: cat.label,
    value: totals[cat.id],
    pct: totals[cat.id] / total,
    color: CATEGORY_COLORS[cat.id] ?? '#ffffff',
  })).filter(e => e.value > 0)

  function polarToXY(angle: number, radius: number) {
    return {
      x: cx + Math.cos(angle - Math.PI / 2) * radius,
      y: cy + Math.sin(angle - Math.PI / 2) * radius,
    }
  }

  const segments: { d: string; color: string; label: string; value: number }[] = []
  let currentAngle = 0

  for (const entry of entries) {
    const sweep = entry.pct * 2 * Math.PI
    const startAngle = currentAngle
    const endAngle = currentAngle + sweep

    const outerStart = polarToXY(startAngle, r)
    const outerEnd = polarToXY(endAngle, r)
    const innerStart = polarToXY(startAngle, innerR)
    const innerEnd = polarToXY(endAngle, innerR)
    const largeArc = sweep > Math.PI ? 1 : 0

    const d = [
      `M ${outerStart.x.toFixed(2)} ${outerStart.y.toFixed(2)}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${outerEnd.x.toFixed(2)} ${outerEnd.y.toFixed(2)}`,
      `L ${innerEnd.x.toFixed(2)} ${innerEnd.y.toFixed(2)}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x.toFixed(2)} ${innerStart.y.toFixed(2)}`,
      'Z',
    ].join(' ')

    segments.push({ d, color: entry.color, label: entry.label, value: entry.value })
    currentAngle = endAngle
  }

  return (
    <div>
      <svg width={size} height={size}>
        {segments.map((seg, i) => (
          <path
            key={i}
            d={seg.d}
            fill={seg.color}
            fillOpacity={0.75}
            stroke="#030a12"
            strokeWidth={1.5}
          />
        ))}
        {/* Center label */}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="rgba(0,0,0,0.65)" fontSize={10} fontFamily="monospace" fontWeight="600">
          ${total.toFixed(0)}
        </text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill="rgba(0,0,0,0.30)" fontSize={8} fontFamily="monospace">
          USDC
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-3 space-y-1.5">
        {entries.map(e => (
          <div key={e.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 flex-shrink-0" style={{ backgroundColor: e.color }} />
              <span className="font-mono text-[9px] text-neutral-400 tracking-[0.06em]">{e.label}</span>
            </div>
            <span className="font-mono text-[9px] text-neutral-600">${e.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
