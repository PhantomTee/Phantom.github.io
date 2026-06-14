'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useAgents } from '@/components/agents/agents-provider'
import { ActivityFeed } from '@/components/agents/activity-feed'
import { SimulatePanel } from '@/components/agents/simulate-panel'
import { TrustScoreSparkline } from '@/components/agents/trust-score-sparkline'
import { SpendDonut } from '@/components/agents/spend-donut'
import { computeTrust } from '@/lib/reputation'
import { getAutonomyTier } from '@/lib/governance'
import { useOnChainScore } from '@/hooks/use-on-chain-score'

const STATUS_COLOR: Record<string, string> = {
  active:  'bg-green-400/70',
  paused:  'bg-amber-400/70',
  expired: 'bg-neutral-300',
  revoked: 'bg-red-400/70',
}

const TIER_COLOR: Record<string, string> = {
  autonomous: 'text-green-600',
  trusted:    'text-neutral-600 dark:text-neutral-400',
  supervised: 'text-neutral-400',
}

export function AgentPageClient({ id }: { id: string }) {
  const { agents, eventsFor, isLoaded } = useAgents()
  const agent = agents.find(a => a.id === id)
  const onChain = useOnChainScore(id)

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <span className="font-mono text-[11px] tracking-[0.18em] text-neutral-300 dark:text-neutral-600 uppercase animate-pulse">Loading…</span>
      </div>
    )
  }

  if (!agent) return notFound()

  const events = eventsFor(agent.id)
  const trust = computeTrust(events)
  const tier = getAutonomyTier(trust.score)
  const tierColor = TIER_COLOR[tier.tier] ?? 'text-neutral-400'

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
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pt-24 pb-32 px-6 lg:px-14">

      {/* Back */}
      <div className="mb-10">
        <Link
          href="/dashboard"
          className="font-mono text-[11px] tracking-[0.18em] text-neutral-400 uppercase hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-8 mb-16 pb-16 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span style={{ color: '#4169e1' }} className="text-[13px] leading-none select-none">■</span>
            <span className="font-mono text-[12px] tracking-[0.26em] text-neutral-400 uppercase">Agent Profile</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${STATUS_COLOR[agent.status] ?? 'bg-neutral-300'}`} />
              <span className="font-mono text-[11px] tracking-[0.08em] text-neutral-400">{initials}</span>
            </div>
            <h1
              className="font-display font-light text-neutral-900 dark:text-white leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
            >
              {agent.name}
            </h1>
            <span className={`font-mono text-[11px] tracking-[0.14em] uppercase ${tierColor}`}>
              {tier.label}
            </span>
          </div>

          <p className="font-mono text-[11px] text-neutral-400 tracking-[0.1em]">
            {agent.model} · hired {new Date(agent.createdAt).toLocaleDateString()} · {agent.authorization.network}
          </p>
        </div>

        {/* Score */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-baseline gap-3">
            <span
              className="font-display font-light text-neutral-900 dark:text-white leading-none"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)' }}
            >
              {displayScore}
            </span>
            <span className="font-mono text-[13px] text-neutral-400">{trust.grade}</span>
          </div>
          <TrustScoreSparkline events={events} width={260} height={52} />
          <div className="flex items-center gap-2">
            {onChain.status === 'live' && (
              <>
                <span className="h-1 w-1 rounded-full bg-green-400/70" />
                <span className="font-mono text-[10px] tracking-[0.18em] text-green-600 uppercase">Live · Arbitrum Sepolia</span>
              </>
            )}
            {onChain.status === 'loading' && (
              <>
                <span className="h-1 w-1 rounded-full bg-neutral-300 animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.18em] text-neutral-300 uppercase">Fetching on-chain…</span>
              </>
            )}
            {onChain.status === 'error' && (
              <>
                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                <span className="font-mono text-[10px] tracking-[0.18em] text-neutral-300 uppercase">Simulated</span>
              </>
            )}
            {onChain.status === 'no-contract' && (
              <span className="font-mono text-[10px] tracking-[0.18em] text-neutral-300 uppercase">Simulated</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-neutral-100 dark:border-neutral-800 mb-16">
        <StatBox label="Payments"    value={String(paidCount)}  unit="success" />
        <StatBox label="Failures"    value={String(failCount)}  unit="events" />
        <StatBox label="Tasks"       value={String(taskCount)}  unit="completed" />
        <StatBox label="Blocks"      value={String(blockCount)} unit="guardrail" />
      </div>

      {/* Budget */}
      <div className="mb-16 pb-16 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex justify-between font-mono text-[11px] text-neutral-400 tracking-[0.1em] mb-4">
          <span>Budget utilization</span>
          <span>${spent.toFixed(0)} / ${agent.authorization.budgetUsdc} USDC</span>
        </div>
        <div className="h-px w-full bg-neutral-100 dark:bg-neutral-800 relative">
          <div
            className="absolute top-0 left-0 h-px transition-all duration-500"
            style={{ width: `${utilization * 100}%`, background: '#4ade80', opacity: 0.7 }}
          />
        </div>
        {/* Burn rate */}
        {(() => {
          const daysActive = Math.max(1, (Date.now() - new Date(agent.createdAt).getTime()) / 86_400_000)
          const dailyBurn = spent / daysActive
          const remaining = agent.authorization.budgetUsdc - spent
          const daysLeft = dailyBurn > 0 ? remaining / dailyBurn : null
          return (
            <div className="flex flex-wrap gap-6 mt-4 font-mono text-[10px] text-neutral-300 dark:text-neutral-600 tracking-[0.08em]">
              <span>Burn rate: <span className="text-neutral-500 dark:text-neutral-400">${dailyBurn.toFixed(2)}/day</span></span>
              {daysLeft !== null && (
                <span>
                  Est. runway:{' '}
                  <span className={daysLeft < 7 ? 'text-amber-500' : 'text-neutral-500 dark:text-neutral-400'}>
                    {daysLeft < 1 ? '<1 day' : `${Math.floor(daysLeft)}d`}
                  </span>
                </span>
              )}
              {daysLeft === null && <span>Runway: <span className="text-neutral-400">no spend yet</span></span>}
            </div>
          )
        })()}
        <div className="flex flex-wrap gap-6 mt-4 font-mono text-[11px] text-neutral-400 tracking-[0.1em]">
          <span>Per-tx limit: <span className="text-neutral-600 dark:text-neutral-300">${agent.authorization.perTxLimitUsdc}</span></span>
          <span>Expires: <span className="text-neutral-600 dark:text-neutral-300">{new Date(agent.authorization.expiresAt).toLocaleDateString()}</span></span>
          <span>Categories: <span className="text-neutral-600 dark:text-neutral-300">{agent.authorization.categories.join(', ')}</span></span>
          <span>Confidence: <span className="text-neutral-600 dark:text-neutral-300">{trust.confidence}</span></span>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">

        {/* Activity */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[11px] tracking-[0.26em] text-neutral-400 uppercase">Activity Log</span>
            <span className="font-mono text-[11px] text-neutral-300 dark:text-neutral-600">{events.length}</span>
          </div>
          <ActivityFeed events={events} limit={50} />
        </div>

        {/* Right column */}
        <div className="space-y-10">
          {/* Simulate */}
          <div>
            <div className="mb-8">
              <span className="font-mono text-[11px] tracking-[0.26em] text-neutral-400 uppercase">Simulate Event</span>
            </div>
            <SimulatePanel agentId={agent.id} />
          </div>

          {/* Spend breakdown */}
          <div>
            <div className="mb-6">
              <span className="font-mono text-[11px] tracking-[0.26em] text-neutral-400 uppercase">Spend Breakdown</span>
            </div>
            <SpendDonut events={events} size={130} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="px-8 py-8 border-r border-b border-neutral-100 dark:border-neutral-800 last:border-r-0">
      <p className="font-mono text-[10px] tracking-[0.22em] text-neutral-400 uppercase mb-5">{label}</p>
      <p className="font-display font-light text-neutral-900 dark:text-white leading-none" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
        {value}
        {unit && <span className="font-mono text-[11px] text-neutral-400 ml-2">{unit}</span>}
      </p>
    </div>
  )
}
