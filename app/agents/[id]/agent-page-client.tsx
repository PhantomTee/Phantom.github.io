'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useAgents } from '@/components/agents/agents-provider'
import { ActivityFeed } from '@/components/agents/activity-feed'
import { SimulatePanel } from '@/components/agents/simulate-panel'
import { computeTrust } from '@/lib/reputation'
import { getAutonomyTier } from '@/lib/governance'
import { useOnChainScore } from '@/hooks/use-on-chain-score'

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

export function AgentPageClient({ id }: { id: string }) {
  const { agents, eventsFor } = useAgents()
  const agent = agents.find(a => a.id === id)
  const onChain = useOnChainScore(id)

  if (!agent) return notFound()

  const events = eventsFor(agent.id)
  const trust = computeTrust(events)
  const tier = getAutonomyTier(trust.score)
  const tierColor = TIER_COLOR[tier.tier] ?? 'text-white/28'

  const spent = events
    .filter(e => e.kind === 'payment_success')
    .reduce((s, e) => s + (e.amountUsdc ?? 0), 0)
  const utilization = agent.authorization.budgetUsdc > 0
    ? Math.min(spent / agent.authorization.budgetUsdc, 1)
    : 0

  const displayScore = onChain.status === 'live' ? onChain.score : trust.score
  const initials = agent.avatarSeed.slice(0, 2).toUpperCase()

  const paidCount  = events.filter(e => e.kind === 'payment_success').length
  const failCount  = events.filter(e => e.kind === 'payment_failed').length
  const taskCount  = events.filter(e => e.kind === 'task_completed').length
  const blockCount = events.filter(e => e.kind === 'limit_blocked').length

  return (
    <div className="min-h-screen bg-[#030a12] text-white pt-24 pb-32 px-6 lg:px-14">

      {/* Back */}
      <div className="mb-10">
        <Link
          href="/dashboard"
          className="font-mono text-[11px] tracking-[0.18em] text-white/25 uppercase hover:text-white/60 transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-8 mb-16 pb-16 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span style={{ color: '#4169e1' }} className="text-[13px] leading-none select-none">■</span>
            <span className="font-mono text-[12px] tracking-[0.26em] text-white/35 uppercase">Agent Profile</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${STATUS_COLOR[agent.status] ?? 'bg-white/20'}`} />
              <span className="font-mono text-[11px] tracking-[0.08em] text-white/35">{initials}</span>
            </div>
            <h1
              className="font-display font-light text-white leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
            >
              {agent.name}
            </h1>
            <span className={`font-mono text-[11px] tracking-[0.14em] uppercase ${tierColor}`}>
              {tier.label}
            </span>
          </div>

          <p className="font-mono text-[11px] text-white/25 tracking-[0.1em]">
            {agent.model} · hired {new Date(agent.createdAt).toLocaleDateString()} · {agent.authorization.network}
          </p>
        </div>

        {/* Score */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-baseline gap-3">
            <span
              className="font-display font-light text-white leading-none"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)' }}
            >
              {displayScore}
            </span>
            <span className="font-mono text-[13px] text-white/30">{trust.grade}</span>
          </div>
          <div className="flex items-center gap-2">
            {onChain.status === 'live' && (
              <>
                <span className="h-1 w-1 rounded-full bg-green-400/70" />
                <span className="font-mono text-[10px] tracking-[0.18em] text-green-400/60 uppercase">Live · Arbitrum Sepolia</span>
              </>
            )}
            {onChain.status === 'loading' && (
              <>
                <span className="h-1 w-1 rounded-full bg-white/20 animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.18em] text-white/20 uppercase">Fetching on-chain…</span>
              </>
            )}
            {onChain.status === 'error' && (
              <>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="font-mono text-[10px] tracking-[0.18em] text-white/20 uppercase">Simulated</span>
              </>
            )}
            {onChain.status === 'no-contract' && (
              <span className="font-mono text-[10px] tracking-[0.18em] text-white/18 uppercase">Simulated</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/[0.07] mb-16">
        <StatBox label="Payments"    value={String(paidCount)}             unit="success" />
        <StatBox label="Failures"    value={String(failCount)}             unit="events" />
        <StatBox label="Tasks"       value={String(taskCount)}             unit="completed" />
        <StatBox label="Blocks"      value={String(blockCount)}            unit="guardrail" />
      </div>

      {/* Budget */}
      <div className="mb-16 pb-16 border-b border-white/[0.06]">
        <div className="flex justify-between font-mono text-[11px] text-white/30 tracking-[0.1em] mb-4">
          <span>Budget utilization</span>
          <span>${spent.toFixed(0)} / ${agent.authorization.budgetUsdc} USDC</span>
        </div>
        <div className="h-px w-full bg-white/[0.07] relative">
          <div
            className="absolute top-0 left-0 h-px transition-all duration-500"
            style={{ width: `${utilization * 100}%`, background: '#4ade80', opacity: 0.55 }}
          />
        </div>
        <div className="flex flex-wrap gap-6 mt-6 font-mono text-[11px] text-white/25 tracking-[0.1em]">
          <span>Per-tx limit: <span className="text-white/45">${agent.authorization.perTxLimitUsdc}</span></span>
          <span>Expires: <span className="text-white/45">{new Date(agent.authorization.expiresAt).toLocaleDateString()}</span></span>
          <span>Categories: <span className="text-white/45">{agent.authorization.categories.join(', ')}</span></span>
          <span>Confidence: <span className="text-white/45">{trust.confidence}</span></span>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">

        {/* Activity */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[11px] tracking-[0.26em] text-white/30 uppercase">Activity Log</span>
            <span className="font-mono text-[11px] text-white/15">{events.length}</span>
          </div>
          <ActivityFeed events={events} limit={50} />
        </div>

        {/* Simulate */}
        <div>
          <div className="mb-8">
            <span className="font-mono text-[11px] tracking-[0.26em] text-white/30 uppercase">Simulate Event</span>
          </div>
          <SimulatePanel agentId={agent.id} />
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="px-8 py-8 border-r border-b border-white/[0.07] last:border-r-0">
      <p className="font-mono text-[10px] tracking-[0.22em] text-white/22 uppercase mb-5">{label}</p>
      <p className="font-display font-light text-white leading-none" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
        {value}
        {unit && <span className="font-mono text-[11px] text-white/25 ml-2">{unit}</span>}
      </p>
    </div>
  )
}
