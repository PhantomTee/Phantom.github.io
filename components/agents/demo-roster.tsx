'use client'

import Link from 'next/link'
import { SEED_AGENTS } from '@/lib/seed'
import { useOnChainScore } from '@/hooks/use-on-chain-score'
import { getAutonomyTier } from '@/lib/governance'

const TIER_COLOR: Record<string, string> = {
  autonomous: 'text-green-400/80',
  trusted:    'text-white/55',
  supervised: 'text-white/28',
}

export function DemoRoster() {
  return (
    <div className="border-t border-white/[0.06]">
      <div className="flex items-center justify-between py-7 border-b border-white/[0.06]">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-[0.26em] text-white/30 uppercase">Agents</span>
          <span className="font-mono text-[11px] text-white/15">{SEED_AGENTS.length}</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 font-mono text-[10px] tracking-[0.16em] text-white/18 uppercase">
          <span className="w-28">Model</span>
          <span className="w-24">Tier</span>
          <span className="w-20">Score</span>
          <span className="w-36">Network</span>
        </div>
      </div>
      {SEED_AGENTS.map(agent => (
        <DemoAgentRow key={agent.id} agentId={agent.id} name={agent.name} model={agent.model} network={agent.authorization.network} />
      ))}
    </div>
  )
}

function DemoAgentRow({ agentId, name, model, network }: { agentId: string; name: string; model: string; network: string }) {
  const onChain  = useOnChainScore(agentId)
  const score    = onChain.status === 'live' ? onChain.score! : 79
  const tier     = getAutonomyTier(score)
  const tierColor = TIER_COLOR[tier.tier] ?? 'text-white/28'
  const initials  = name.slice(0, 2).toUpperCase()

  return (
    <Link href={`/agents/${agentId}`}>
      <div className="group flex items-center gap-6 lg:gap-8 py-6 border-b border-white/[0.05] hover:bg-white/[0.015] transition-colors cursor-pointer">

        <div className="flex items-center gap-2 w-10 flex-shrink-0">
          <span className="h-1 w-1 rounded-full flex-shrink-0 bg-green-400/70" />
          <span className="font-mono text-[11px] tracking-[0.08em] text-white/35">{initials}</span>
        </div>

        <div className="w-32 flex-shrink-0 min-w-0">
          <p className="font-mono text-[13px] text-white/80 tracking-[0.04em] truncate">{name}</p>
          <p className="font-mono text-[10px] text-white/18 tracking-[0.06em] mt-0.5 truncate">
            {model.replace('groq/', '').replace('heurist/', '')}
          </p>
        </div>

        <div className={`hidden sm:block font-mono text-[11px] tracking-[0.14em] uppercase w-24 flex-shrink-0 ${tierColor}`}>
          {tier.label}
        </div>

        <div className="flex items-baseline gap-2 w-20 flex-shrink-0">
          <span className="font-display font-light text-white text-[1.6rem] leading-none">{score}</span>
          {onChain.status === 'live'
            ? <span className="h-1 w-1 rounded-full bg-green-400/60 flex-shrink-0" title="Live · Arbitrum Sepolia" />
            : <span className="h-1 w-1 rounded-full bg-white/20 animate-pulse flex-shrink-0" />
          }
        </div>

        <div className="flex-1 min-w-0 hidden md:block">
          <p className="font-mono text-[10px] text-white/22 truncate">{network}</p>
        </div>

      </div>
    </Link>
  )
}
