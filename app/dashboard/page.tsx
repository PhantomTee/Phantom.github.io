'use client'

import { useState } from 'react'
import { useAgents } from '@/components/agents/agents-provider'
import { AgentRoster } from '@/components/agents/agent-roster'
import { ActivityFeed } from '@/components/agents/activity-feed'
import { CreateAgentDialog } from '@/components/agents/create-agent-dialog'
import { computeTrust } from '@/lib/reputation'

export default function DashboardPage() {
  const { agents, events, eventsFor } = useAgents()
  const [showCreate, setShowCreate] = useState(false)

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
    <div className="min-h-screen bg-[#030a12] text-white pt-32 pb-32 px-6 lg:px-14">

      {/* Header */}
      <div className="flex items-start justify-between mb-20">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span style={{ color: '#4169e1' }} className="text-[13px] leading-none select-none">■</span>
            <span className="font-mono text-[12px] tracking-[0.26em] text-white/35 uppercase">Workforce</span>
          </div>
          <h1
            className="font-display font-light text-white leading-[1.0] tracking-tight"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
          >
            {activeCount} active agent{activeCount !== 1 ? 's' : ''}
          </h1>
          <div className="flex items-center gap-3 mt-5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400/70 pulse-dot flex-shrink-0" />
            <span className="font-mono text-[11px] tracking-[0.18em] text-white/25 uppercase">
              Trust verified · Arbitrum Stylus
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/55 border border-white/20 px-8 py-4 hover:border-white/45 hover:text-white transition-all duration-200"
        >
          + Hire Agent
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/[0.07] mb-20">
        <StatBox label="Active agents"  value={String(activeCount)} />
        <StatBox label="Avg trust score" value={String(avgScore)} />
        <StatBox label="Total budget"   value={`$${totalBudget}`} unit="USDC" />
        <StatBox label="Total spent"    value={`$${totalSpent.toFixed(0)}`} unit="USDC" />
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] border-t border-white/[0.06]">

        {/* Agents list */}
        <div className="lg:border-r border-white/[0.06] lg:pr-10">
          <div className="flex items-center justify-between py-7 border-b border-white/[0.06]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] tracking-[0.26em] text-white/30 uppercase">Agents</span>
              <span className="font-mono text-[11px] text-white/15">{agents.length}</span>
            </div>
            {/* Column headers */}
            <div className="hidden lg:flex items-center gap-8 font-mono text-[10px] tracking-[0.16em] text-white/18 uppercase">
              <span className="w-28">Model</span>
              <span className="w-24">Tier</span>
              <span className="w-10 text-right">Score</span>
              <span className="w-36">Budget</span>
              <span>Activity</span>
            </div>
          </div>
          <AgentRoster />
        </div>

        {/* Activity feed */}
        <div className="mt-8 lg:mt-0 lg:pl-10">
          <div className="py-7 border-b border-white/[0.06]">
            <span className="font-mono text-[11px] tracking-[0.26em] text-white/30 uppercase">Activity Log</span>
          </div>
          <ActivityFeed events={events} limit={30} />
        </div>
      </div>

      <CreateAgentDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}

function StatBox({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="px-8 py-8 border-r border-b border-white/[0.07] last:border-r-0">
      <p className="font-mono text-[10px] tracking-[0.22em] text-white/22 uppercase mb-5">{label}</p>
      <p className="font-display font-light text-white leading-none" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
        {value}
        {unit && <span className="font-mono text-[12px] text-white/25 ml-2">{unit}</span>}
      </p>
    </div>
  )
}
