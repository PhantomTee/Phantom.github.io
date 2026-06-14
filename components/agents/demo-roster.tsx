'use client'

import Link from 'next/link'
import { SEED_AGENTS, SEED_EVENTS } from '@/lib/seed'
import { useOnChainScore } from '@/hooks/use-on-chain-score'
import { getAutonomyTier } from '@/lib/governance'
import { scoreToGrade, gradeColor, computeTrust } from '@/lib/reputation'

const TIER_COLOR: Record<string, string> = {
  autonomous: 'text-green-600',
  trusted:    'text-neutral-600 dark:text-neutral-400',
  supervised: 'text-neutral-400',
}

const STATUS_COLOR: Record<string, string> = {
  active:  'bg-green-400/70',
  paused:  'bg-amber-400/70',
  expired: 'bg-neutral-300',
  revoked: 'bg-red-400/70',
}

// Shared grid: [dot+initials] [name] [tier] [score] [network]
const GRID = 'grid grid-cols-[2rem_1fr_7rem_7rem_9rem] lg:gap-8 gap-4 items-center'

export function DemoRoster() {
  return (
    <div className="border-t border-neutral-100 dark:border-neutral-800">

      {/* Header */}
      <div className={`${GRID} py-6 border-b border-neutral-100 dark:border-neutral-800 font-mono text-[10px] tracking-[0.18em] text-neutral-300 dark:text-neutral-600 uppercase`}>
        <div className="flex items-center gap-1">
          <span className="text-neutral-400 text-[11px] tracking-[0.26em] normal-case">Agents</span>
          <span className="text-neutral-300 dark:text-neutral-600 text-[11px]">{SEED_AGENTS.length}</span>
        </div>
        <span>Name</span>
        <span className="hidden sm:block">Tier</span>
        <span>Score</span>
        <span className="hidden md:block">Network</span>
      </div>

      {SEED_AGENTS.map(agent => (
        <DemoAgentRow key={agent.id} agentId={agent.id} />
      ))}
    </div>
  )
}

function DemoAgentRow({ agentId }: { agentId: string }) {
  const agent     = SEED_AGENTS.find(a => a.id === agentId)!
  const events    = SEED_EVENTS.filter(e => e.agentId === agentId)
  const trust     = computeTrust(events)
  const onChain   = useOnChainScore(agentId)
  const score     = onChain.status === 'live' ? onChain.score! : trust.score
  const tier      = getAutonomyTier(score)
  const tierColor = TIER_COLOR[tier.tier] ?? 'text-neutral-400'
  const grade     = scoreToGrade(score)
  const color     = gradeColor(grade)
  const initials  = agent.name.slice(0, 2).toUpperCase()

  return (
    <Link href={`/agents/${agentId}`}>
      <div className={`${GRID} py-6 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer`}>

        {/* Dot + initials */}
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${STATUS_COLOR[agent.status] ?? 'bg-neutral-300'}`} />
          <span className="font-mono text-[11px] tracking-[0.06em] text-neutral-400">{initials}</span>
        </div>

        {/* Name + model */}
        <div className="min-w-0">
          <p className="font-mono text-[13px] text-neutral-800 dark:text-neutral-200 tracking-[0.04em] truncate">{agent.name}</p>
          <p className="font-mono text-[10px] text-neutral-300 dark:text-neutral-600 tracking-[0.04em] mt-0.5 truncate">
            {agent.model.replace('groq/', '').replace('heurist/', '')}
          </p>
        </div>

        {/* Tier */}
        <div className={`hidden sm:block font-mono text-[11px] tracking-[0.14em] uppercase ${tierColor}`}>
          {tier.label}
        </div>

        {/* Score + grade */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-light text-neutral-900 dark:text-white text-[1.5rem] leading-none">{score}</span>
          <span
            className="font-mono text-[9px] tracking-[0.06em] px-1.5 py-0.5 border leading-none"
            style={{ color, borderColor: color + '44' }}
          >
            {grade}
          </span>
          {onChain.status === 'live'
            ? <span className="h-1 w-1 rounded-full bg-green-400/60 shrink-0" />
            : <span className="h-1 w-1 rounded-full bg-neutral-300 animate-pulse shrink-0" />
          }
        </div>

        {/* Network */}
        <div className="hidden md:block">
          <p className="font-mono text-[10px] text-neutral-400 truncate">{agent.authorization.network}</p>
        </div>

      </div>
    </Link>
  )
}
