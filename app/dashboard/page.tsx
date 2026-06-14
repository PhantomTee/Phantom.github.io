'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useAgents } from '@/components/agents/agents-provider'
import { AgentRoster } from '@/components/agents/agent-roster'
import { ActivityFeed } from '@/components/agents/activity-feed'
import { CreateAgentDialog } from '@/components/agents/create-agent-dialog'
import { WalletButton } from '@/components/wallet-button'
import { DemoRoster } from '@/components/agents/demo-roster'
import { TierNotification } from '@/components/agents/tier-notification'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { agents, events } = useAgents()
  const [showCreate, setShowCreate] = useState(false)

  const totalBudget = agents.reduce((s, a) => s + a.authorization.budgetUsdc, 0)
  const totalSpent  = events
    .filter(e => e.kind === 'payment_success')
    .reduce((s, e) => s + (e.amountUsdc ?? 0), 0)
  const activeCount = agents.filter(a => a.status === 'active').length

  // ── Not connected — show live demo network ───────────────────────
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pt-32 pb-32 px-6 lg:px-14">
        <div className="flex items-start justify-between mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span style={{ color: '#4169e1' }} className="text-[13px] leading-none select-none">■</span>
              <span className="font-mono text-[12px] tracking-[0.26em] text-neutral-400 uppercase">Live Network</span>
            </div>
            <h1 className="font-display font-light text-neutral-900 dark:text-white leading-[1.0] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
              Demo workforce
            </h1>
            <div className="flex items-center gap-3 mt-5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400/70 flex-shrink-0" />
              <span className="font-mono text-[11px] tracking-[0.18em] text-neutral-400 uppercase">
                Scores live from Arbitrum Sepolia · Connect to manage your own
              </span>
            </div>
          </div>
          <WalletButton />
        </div>
        <DemoRoster />
      </div>
    )
  }

  // ── Connected, no agents ─────────────────────────────────────────
  if (agents.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col items-center justify-center px-6 pt-24">
        <div className="flex items-center gap-3 mb-8">
          <span style={{ color: '#4169e1' }} className="text-[13px] leading-none select-none">■</span>
          <span className="font-mono text-[12px] tracking-[0.26em] text-neutral-400 uppercase">Workforce</span>
        </div>
        <h1
          className="font-display font-light text-neutral-900 dark:text-white text-center leading-tight tracking-tight mb-6"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
        >
          No agents yet
        </h1>
        <p className="font-mono text-[13px] text-neutral-400 tracking-[0.08em] text-center max-w-sm mb-10 leading-relaxed">
          Hire your first agent. Budget is set on Arbitrum Sepolia — scores update live from the Trust Engine contract.
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 px-10 py-5 hover:border-neutral-600 dark:hover:border-neutral-400 transition-all duration-200"
        >
          + Hire First Agent
        </button>
        <p className="font-mono text-[10px] text-neutral-300 tracking-[0.12em] mt-6">
          {address?.slice(0, 6)}…{address?.slice(-4)}
        </p>
        <CreateAgentDialog open={showCreate} onClose={() => setShowCreate(false)} />
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pt-32 pb-32 px-6 lg:px-14">

      {/* Header */}
      <div className="flex items-start justify-between mb-20">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span style={{ color: '#4169e1' }} className="text-[13px] leading-none select-none">■</span>
            <span className="font-mono text-[12px] tracking-[0.26em] text-neutral-400 uppercase">Workforce</span>
          </div>
          <h1
            className="font-display font-light text-neutral-900 dark:text-white leading-[1.0] tracking-tight"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
          >
            {activeCount} active agent{activeCount !== 1 ? 's' : ''}
          </h1>
          <div className="flex items-center gap-3 mt-5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400/70 flex-shrink-0" />
            <span className="font-mono text-[11px] tracking-[0.18em] text-neutral-400 uppercase">
              Trust verified · Arbitrum Sepolia
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 px-8 py-4 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all duration-200"
        >
          + Hire Agent
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-neutral-100 dark:border-neutral-800 mb-20">
        <StatBox label="Active agents" value={String(activeCount)} />
        <StatBox label="Total agents"  value={String(agents.length)} />
        <StatBox label="Total budget"  value={`$${totalBudget}`} unit="USDC" />
        <StatBox label="Total spent"   value={`$${totalSpent.toFixed(0)}`} unit="USDC" />
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] border-t border-neutral-100 dark:border-neutral-800">

        {/* Agents */}
        <div className="lg:border-r border-neutral-100 dark:border-neutral-800 lg:pr-10">
          <div className="flex items-center justify-between py-7 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] tracking-[0.26em] text-neutral-400 uppercase">Agents</span>
              <span className="font-mono text-[11px] text-neutral-300 dark:text-neutral-600">{agents.length}</span>
            </div>
            <div className="hidden lg:flex items-center gap-8 font-mono text-[10px] tracking-[0.16em] text-neutral-300 dark:text-neutral-600 uppercase">
              <span className="w-28">Model</span>
              <span className="w-24">Tier</span>
              <span className="w-20">Score</span>
              <span className="w-36">Budget</span>
              <span>Activity</span>
            </div>
          </div>
          <AgentRoster />
        </div>

        {/* Activity */}
        <div className="mt-8 lg:mt-0 lg:pl-10">
          <div className="py-7 border-b border-neutral-100 dark:border-neutral-800">
            <span className="font-mono text-[11px] tracking-[0.26em] text-neutral-400 uppercase">Activity Log</span>
          </div>
          {events.length === 0
            ? <p className="font-mono text-[11px] text-neutral-300 dark:text-neutral-600 py-8 tracking-[0.1em]">// no activity yet</p>
            : <ActivityFeed events={events} limit={30} />
          }
        </div>
      </div>

      <CreateAgentDialog open={showCreate} onClose={() => setShowCreate(false)} />
      <TierNotification />
    </div>
  )
}

function StatBox({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="px-8 py-8 border-r border-b border-neutral-100 dark:border-neutral-800 last:border-r-0">
      <p className="font-mono text-[10px] tracking-[0.22em] text-neutral-400 uppercase mb-5">{label}</p>
      <p className="font-display font-light text-neutral-900 dark:text-white leading-none" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
        {value}
        {unit && <span className="font-mono text-[12px] text-neutral-400 ml-2">{unit}</span>}
      </p>
    </div>
  )
}
