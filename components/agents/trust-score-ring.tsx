'use client'

import { gradeColor } from '@/lib/reputation'

interface TrustScoreRingProps {
  score: number
  grade: string
  size?: number
  strokeWidth?: number
}

export function TrustScoreRing({ score, grade, size = 120, strokeWidth = 10 }: TrustScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const arc = (score / 100) * circumference
  const color = gradeColor(grade)
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference - arc}`}
          strokeDashoffset={0}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-white leading-none">{score}</span>
        <span className="text-xs font-semibold mt-0.5" style={{ color }}>
          {grade}
        </span>
      </div>
    </div>
  )
}
