'use client'

import Link from 'next/link'
import { getAutonomyTier } from '@/lib/governance'
import { scoreToGrade, gradeColor } from '@/lib/reputation'
import { useOnChainScore } from '@/hooks/use-on-chain-score'
import type { Agent, AgentEvent } from '@/lib/types'

interface AgentCardProps {
  agent:  Agent
  events: AgentEvent[]
}

const STATUS_COLOR: Record<string, string> = {
  active:  'bg-green-400/70',
  paused:  'bg-amber-400/70',
  expired: 'bg-neutral-300',
  revoked: 'bg-red-400/70',
}

const TIER_COLOR: Record<string, string> = {
  autonomous: 'text-green-600',
  trusted:    'text-neutral-600',
  supervised: 'text-neutral-400',
}

export function AgentCard({ agent, events }: AgentCardProps) {
  const onChain  = useOnChainScore(agent.id)
  const tier     = getAutonomyTier(onChain.score ?? 79)
  const tierColor = TIER_COLOR[tier.tier] ?? 'text-neutral-400'

  const spent = events
    .filter(e => e.kind === 'payment_success')
    .reduce((s, e) => s + (e.amountUsdc ?? 0), 0)
  const utilization = agent.authorization.budgetUsdc > 0
    ? Math.min(spent / agent.authorization.budgetUsdc, 1)
    : 0

  const paidCount = events.filter(e => e.kind === 'payment_success').length
  const taskCount = events.filter(e => e.kind === 'task_completed').length
  const initials  = agent.avatarSeed.slice(0, 2).toUpperCase()

  const displayScore = onChain.status === 'live' ? onChain.score! : 79

  return (
    <Link href={`/agents/${agent.id}`}>
      <div className="group flex items-center gap-6 lg:gap-8 py-6 border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors cursor-pointer">

        {/* Status dot + initials */}
        <div className="flex items-center gap-2 w-10 flex-shrink-0">
          <span className={`h-1 w-1 rounded-full flex-shrink-0 ${STATUS_COLOR[agent.status] ?? 'bg-neutral-300'}`} />
          <span className="font-mono text-[11px] tracking-[0.08em] text-neutral-400">{initials}</span>
        </div>

        {/* Name + model */}
        <div className="w-32 flex-shrink-0 min-w-0">
          <p className="font-mono text-[13px] text-neutral-800 tracking-[0.04em] truncate">{agent.name}</p>
          <p className="font-mono text-[10px] text-neutral-300 tracking-[0.06em] mt-0.5 truncate">
            {agent.model.replace('groq/', '').replace('heurist/', '')}
          </p>
        </div>

        {/* Tier */}
        <div className={`hidden sm:block font-mono text-[11px] tracking-[0.14em] uppercase w-24 flex-shrink-0 ${tierColor}`}>
          {tier.label}
        </div>

        {/* Trust score + grade badge */}
        <div className="flex items-baseline gap-2 w-24 flex-shrink-0">
          <span className="font-display font-light text-neutral-900 text-[1.6rem] leading-none">{displayScore}</span>
          <span
            className="font-mono text-[10px] tracking-[0.08em] px-1.5 py-0.5 border leading-none"
            style={{ color: gradeColor(scoreToGrade(displayScore)), borderColor: gradeColor(scoreToGrade(displayScore)) + '44' }}
          >
            {scoreToGrade(displayScore)}
          </span>
          {onChain.status === 'live'
            ? <span className="h-1 w-1 rounded-full bg-green-400/60 flex-shrink-0" title="Live from Arbitrum" />
            : onChain.status === 'loading'
            ? <span className="h-1 w-1 rounded-full bg-neutral-300 animate-pulse flex-shrink-0" />
            : null
          }
        </div>

        {/* Budget bar */}
        <div className="flex-1 min-w-0 hidden md:block">
          <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-2">
            <span>Budget</span>
            <span>${spent.toFixed(0)} / ${agent.authorization.budgetUsdc}</span>
          </div>
          <div className="h-px w-full bg-neutral-100 relative">
            <div
              className="absolute top-0 left-0 h-px transition-all"
              style={{ width: `${utilization * 100}%`, background: '#4ade80', opacity: 0.6 }}
            />
          </div>
        </div>

        {/* Activity */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-[10px] text-neutral-300 flex-shrink-0">
          <span><span className="text-neutral-600">{paidCount}</span> paid</span>
          <span><span className="text-neutral-600">{taskCount}</span> tasks</span>
        </div>

      </div>
    </Link>
  )
}
