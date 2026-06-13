'use client'

import Link from 'next/link'
import { computeTrust, gradeColor } from '@/lib/reputation'
import { getAutonomyTier } from '@/lib/governance'
import { TrustScoreRing } from './trust-score-ring'
import type { Agent, AgentEvent } from '@/lib/types'

interface AgentCardProps {
  agent: Agent
  events: AgentEvent[]
}

const STATUS_DOT: Record<string, string> = {
  active: 'bg-emerald-400',
  paused: 'bg-amber-400',
  expired: 'bg-gray-500',
  revoked: 'bg-red-500',
}

const TIER_BADGE: Record<string, string> = {
  autonomous: 'text-cyan-400 border-cyan-400/40',
  trusted: 'text-emerald-400 border-emerald-400/40',
  supervised: 'text-amber-400 border-amber-400/40',
}

export function AgentCard({ agent, events }: AgentCardProps) {
  const trust = computeTrust(events)
  const tier = getAutonomyTier(trust.score)
  const spent = events
    .filter(e => e.kind === 'payment_success')
    .reduce((s, e) => s + (e.amountUsdc ?? 0), 0)
  const utilization = Math.min(spent / agent.authorization.budgetUsdc, 1)

  return (
    <Link href={`/agents/${agent.id}`}>
      <div className="group rounded-xl border border-gray-800 bg-gray-900/60 p-5 hover:border-gray-600 hover:bg-gray-900 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <AgentAvatar seed={agent.avatarSeed} size={36} />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">{agent.name}</p>
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[agent.status]}`} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{agent.model}</p>
            </div>
          </div>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${TIER_BADGE[tier.tier]}`}
          >
            {tier.label}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <TrustScoreRing score={trust.score} grade={trust.grade} size={80} strokeWidth={8} />
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Budget</span>
                <span>${spent.toFixed(0)} / ${agent.authorization.budgetUsdc}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${utilization * 100}%`,
                    backgroundColor: gradeColor(trust.grade),
                  }}
                />
              </div>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>
                <span className="text-gray-200 font-medium">
                  {events.filter(e => e.kind === 'payment_success').length}
                </span>{' '}
                paid
              </span>
              <span>
                <span className="text-gray-200 font-medium">
                  {events.filter(e => e.kind === 'task_completed').length}
                </span>{' '}
                tasks
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function AgentAvatar({ seed, size }: { seed: string; size: number }) {
  const hue = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  const initials = seed.slice(0, 2).toUpperCase()
  return (
    <div
      className="rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue}, 60%, 30%)`,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  )
}
