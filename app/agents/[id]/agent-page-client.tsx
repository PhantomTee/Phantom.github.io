'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useAgents } from '@/components/agents/agents-provider'
import { TrustScoreRing } from '@/components/agents/trust-score-ring'
import { TrustBreakdown } from '@/components/agents/trust-breakdown'
import { GovernanceCard } from '@/components/agents/governance-card'
import { AuthorizationCard } from '@/components/agents/authorization-card'
import { ActivityFeed } from '@/components/agents/activity-feed'
import { SimulatePanel } from '@/components/agents/simulate-panel'
import { computeTrust } from '@/lib/reputation'
import { useOnChainScore } from '@/hooks/use-on-chain-score'

export function AgentPageClient({ id }: { id: string }) {
  const { agents, eventsFor } = useAgents()
  const agent = agents.find(a => a.id === id)
  const onChain = useOnChainScore(id)

  if (!agent) return notFound()

  const events = eventsFor(agent.id)
  const trust = computeTrust(events)
  const spent = events
    .filter(e => e.kind === 'payment_success')
    .reduce((s, e) => s + (e.amountUsdc ?? 0), 0)
  const utilization = Math.min(spent / agent.authorization.budgetUsdc, 1)
  const hue = agent.avatarSeed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pt-20">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 mb-6 transition-colors"
      >
        ← Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0"
          style={{ background: `hsl(${hue}, 60%, 25%)` }}
        >
          {agent.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-black text-white">{agent.name}</h1>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                agent.status === 'active'
                  ? 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10'
                  : 'text-gray-400 border-gray-700'
              }`}
            >
              {agent.status}
            </span>
            {/* On-chain score badge */}
            {onChain.status === 'live' && (
              <span className="text-xs text-cyan-400 border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                On-chain: {onChain.score}
              </span>
            )}
            {onChain.status === 'loading' && (
              <span className="text-xs text-gray-600 border border-gray-700 px-2 py-0.5 rounded-full animate-pulse">
                Fetching on-chain…
              </span>
            )}
            {onChain.status === 'no-contract' && (
              <span className="text-xs text-gray-700 border border-gray-800 px-2 py-0.5 rounded-full">
                Deploy Stylus contract to verify on-chain
              </span>
            )}
          </div>
          <p className="text-gray-500 mt-1">{agent.model}</p>
          <p className="text-xs text-gray-700 mt-0.5">
            Hired {new Date(agent.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trust score */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 flex flex-col items-center gap-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider self-start">Trust Score</p>
          <TrustScoreRing score={trust.score} grade={trust.grade} size={140} strokeWidth={12} />
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>Confidence: {trust.confidence}</span>
              <span className="text-cyan-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Stylus logic
              </span>
            </div>
            <TrustBreakdown factors={trust.factors} />
          </div>
        </div>

        {/* Governance */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Governance</p>
          <GovernanceCard
            score={trust.score}
            utilization={utilization}
            currentBudget={agent.authorization.budgetUsdc}
          />
        </div>

        {/* Authorization */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Authorization</p>
          <AuthorizationCard auth={agent.authorization} spentUsdc={spent} />
        </div>

        {/* Simulate */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <SimulatePanel agentId={agent.id} />
        </div>

        {/* Activity */}
        <div className="lg:col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">
            Activity · {events.length} events
          </p>
          <ActivityFeed events={events} limit={50} />
        </div>
      </div>
    </div>
  )
}
