'use client'

import { useAgents } from '@/components/agents/agents-provider'
import { AgentRoster } from '@/components/agents/agent-roster'
import { ActivityFeed } from '@/components/agents/activity-feed'
import { computeTrust } from '@/lib/reputation'

export default function DashboardPage() {
  const { agents, events, eventsFor } = useAgents()

  const totalBudget = agents.reduce((s, a) => s + a.authorization.budgetUsdc, 0)
  const totalSpent = events
    .filter(e => e.kind === 'payment_success')
    .reduce((s, e) => s + (e.amountUsdc ?? 0), 0)
  const avgScore =
    agents.length === 0
      ? 0
      : Math.round(
          agents.reduce((s, a) => s + computeTrust(eventsFor(a.id)).score, 0) / agents.length
        )
  const activeCount = agents.filter(a => a.status === 'active').length

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Workforce Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {activeCount} active Anita agents on Arbitrum
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Trust verified · Arbitrum Stylus
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active agents" value={String(activeCount)} />
        <StatCard label="Avg trust score" value={String(avgScore)} />
        <StatCard label="Total budget" value={`$${totalBudget}`} unit="USDC" />
        <StatCard label="Total spent" value={`$${totalSpent.toFixed(0)}`} unit="USDC" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Agents
          </h2>
          <AgentRoster />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Global Activity
          </h2>
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
            <ActivityFeed events={events} limit={30} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-white">
        {value}
        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
      </p>
    </div>
  )
}
