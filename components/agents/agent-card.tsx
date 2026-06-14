'use client'

import Link from 'next/link'
import { computeTrust } from '@/lib/reputation'
import { getAutonomyTier } from '@/lib/governance'
import type { Agent, AgentEvent } from '@/lib/types'

interface AgentCardProps {
  agent: Agent
  events: AgentEvent[]
}

const STATUS_COLOR: Record<string, string> = {
  active:  'bg-green-400/70',
  paused:  'bg-amber-400/70',
  expired: 'bg-white/20',
  revoked: 'bg-red-400/70',
}

const TIER_COLOR: Record<string, string> = {
  autonomous: 'text-green-400/80',
  trusted:    'text-white/55',
  supervised: 'text-white/28',
}

export function AgentCard({ agent, events }: AgentCardProps) {
  const trust = computeTrust(events)
  const tier  = getAutonomyTier(trust.score)
  const spent = events
    .filter(e => e.kind === 'payment_success')
    .reduce((s, e) => s + (e.amountUsdc ?? 0), 0)
  const utilization = agent.authorization.budgetUsdc > 0
    ? Math.min(spent / agent.authorization.budgetUsdc, 1)
    : 0
  const paidCount = events.filter(e => e.kind === 'payment_success').length
  const taskCount = events.filter(e => e.kind === 'task_completed').length
  const initials  = agent.avatarSeed.slice(0, 2).toUpperCase()
  const tierColor = TIER_COLOR[tier.tier] ?? 'text-white/28'

  return (
    <Link href={`/agents/${agent.id}`}>
      <div className="group flex items-center gap-6 lg:gap-8 py-6 border-b border-white/[0.05] hover:bg-white/[0.015] transition-colors cursor-pointer">

        {/* Status dot + initials */}
        <div className="flex items-center gap-2 w-10 flex-shrink-0">
          <span className={`h-1 w-1 rounded-full flex-shrink-0 ${STATUS_COLOR[agent.status] ?? 'bg-white/20'}`} />
          <span className="font-mono text-[11px] tracking-[0.08em] text-white/35">{initials}</span>
        </div>

        {/* Name + model */}
        <div className="w-32 flex-shrink-0 min-w-0">
          <p className="font-mono text-[13px] text-white/80 tracking-[0.04em] truncate">{agent.name}</p>
          <p className="font-mono text-[10px] text-white/18 tracking-[0.06em] mt-0.5 truncate">
            {agent.model.replace('groq/', '').replace('heurist/', '')}
          </p>
        </div>

        {/* Tier */}
        <div className={`hidden sm:block font-mono text-[11px] tracking-[0.14em] uppercase w-24 flex-shrink-0 ${tierColor}`}>
          {tier.label}
        </div>

        {/* Trust score */}
        <div className="flex items-baseline gap-2 w-16 flex-shrink-0">
          <span className="font-display font-light text-white text-[1.6rem] leading-none">{trust.score}</span>
          <span className="font-mono text-[10px] text-white/22">{trust.grade}</span>
        </div>

        {/* Budget bar */}
        <div className="flex-1 min-w-0 hidden md:block">
          <div className="flex justify-between font-mono text-[10px] text-white/22 mb-2">
            <span>Budget</span>
            <span>${spent.toFixed(0)} / ${agent.authorization.budgetUsdc}</span>
          </div>
          <div className="h-px w-full bg-white/[0.07] relative">
            <div
              className="absolute top-0 left-0 h-px transition-all"
              style={{ width: `${utilization * 100}%`, background: '#4ade80', opacity: 0.55 }}
            />
          </div>
        </div>

        {/* Activity */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-[10px] text-white/22 flex-shrink-0">
          <span><span className="text-white/45">{paidCount}</span> paid</span>
          <span><span className="text-white/45">{taskCount}</span> tasks</span>
        </div>

      </div>
    </Link>
  )
}
