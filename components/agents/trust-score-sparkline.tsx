'use client'

import { computeTrust, gradeColor, scoreToGrade } from '@/lib/reputation'
import type { AgentEvent } from '@/lib/types'

interface TrustScoreSparklineProps {
  events: AgentEvent[]
  width?: number
  height?: number
}

export function TrustScoreSparkline({ events, width = 280, height = 56 }: TrustScoreSparklineProps) {
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <span className="font-mono text-[10px] text-neutral-300 tracking-[0.1em]">// no history</span>
      </div>
    )
  }

  // Compute rolling score after each event (chronological order)
  const sorted = [...events].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
  const points = sorted.map((_, i) => computeTrust(sorted.slice(0, i + 1)).score)

  const minScore = Math.max(0, Math.min(...points) - 5)
  const maxScore = Math.min(100, Math.max(...points) + 5)
  const range = maxScore - minScore || 1

  const pad = { t: 6, b: 18, l: 4, r: 4 }
  const w = width - pad.l - pad.r
  const h = height - pad.t - pad.b

  const toX = (i: number) => pad.l + (i / Math.max(points.length - 1, 1)) * w
  const toY = (s: number) => pad.t + h - ((s - minScore) / range) * h

  const d = points
    .map((s, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(s).toFixed(1)}`)
    .join(' ')

  const lastScore = points[points.length - 1]
  const lastGrade = scoreToGrade(lastScore)
  const color = gradeColor(lastGrade)

  // Area fill path
  const areaD = `${d} L${toX(points.length - 1).toFixed(1)},${(pad.t + h).toFixed(1)} L${pad.l},${(pad.t + h).toFixed(1)} Z`

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={`spark-fill-${lastGrade}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines at 66 and 84 (tier thresholds) */}
        {[66, 84].map(thresh => {
          const y = toY(thresh)
          if (y < pad.t || y > pad.t + h) return null
          return (
            <line
              key={thresh}
              x1={pad.l} y1={y} x2={pad.l + w} y2={y}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="3 3"
            />
          )
        })}
        {/* Area */}
        <path d={areaD} fill={`url(#spark-fill-${lastGrade})`} />
        {/* Line */}
        <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        {/* Last point dot */}
        <circle cx={toX(points.length - 1)} cy={toY(lastScore)} r={3} fill={color} />
        {/* Score labels */}
        <text x={pad.l + w} y={height - 4} textAnchor="end" fill={color} fontSize={9} fontFamily="monospace">
          {lastScore}
        </text>
        <text x={pad.l} y={height - 4} textAnchor="start" fill="rgba(0,0,0,0.25)" fontSize={9} fontFamily="monospace">
          {points[0]}
        </text>
      </svg>
      <div className="absolute top-0 left-1 font-mono text-[9px] tracking-[0.14em] text-neutral-300 uppercase">
        score history
      </div>
    </div>
  )
}
