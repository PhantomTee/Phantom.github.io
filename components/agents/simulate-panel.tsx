'use client'

import { useState } from 'react'
import { useAgents } from './agents-provider'
import type { AgentEventKind, SpendCategory } from '@/lib/types'

interface SimulateAction {
  kind: AgentEventKind
  label: string
  description: string
  color: string
  amount?: number
  category?: SpendCategory
  trustDelta: number
}

const ACTIONS: SimulateAction[] = [
  {
    kind: 'payment_success',
    label: 'Payment settled',
    description: 'USDC transfer confirmed on Arbitrum',
    color: 'text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/10',
    amount: 12,
    category: 'compute',
    trustDelta: 0.8,
  },
  {
    kind: 'task_completed',
    label: 'Task completed',
    description: 'Agent finished assigned work unit',
    color: 'text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10',
    trustDelta: 1.2,
  },
  {
    kind: 'payment_failed',
    label: 'Payment failed',
    description: 'Transaction reverted on-chain',
    color: 'text-red-400 border-red-400/30 hover:bg-red-400/10',
    amount: 10,
    category: 'data-apis',
    trustDelta: -2.5,
  },
  {
    kind: 'limit_blocked',
    label: 'Guardrail blocked',
    description: 'Attempted to exceed per-tx limit',
    color: 'text-orange-400 border-orange-400/30 hover:bg-orange-400/10',
    amount: 50,
    category: 'agent-services',
    trustDelta: -3.5,
  },
]

export function SimulatePanel({ agentId }: { agentId: string }) {
  const { addEvent } = useAgents()
  const [lastAction, setLastAction] = useState<string | null>(null)

  function simulate(action: SimulateAction) {
    addEvent({
      agentId,
      kind: action.kind,
      label: `[Simulated] ${action.description}`,
      amountUsdc: action.amount,
      category: action.category,
      trustDelta: action.trustDelta,
      txHash: action.kind === 'payment_success'
        ? `0xsim${Date.now().toString(16)}`
        : undefined,
    })
    setLastAction(action.label)
    setTimeout(() => setLastAction(null), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Simulate events</p>
        {lastAction && (
          <span className="text-xs text-green-400 animate-pulse">
            ✓ {lastAction} recorded
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map(a => (
          <button
            key={a.kind}
            onClick={() => simulate(a)}
            className={`text-left px-3 py-3 rounded-xl border text-xs font-medium transition-all ${a.color}`}
          >
            <p>{a.label}</p>
            <p className="opacity-60 mt-0.5 font-normal">
              {a.trustDelta >= 0 ? '+' : ''}{a.trustDelta} trust
            </p>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-gray-700 mt-2">
        Events update trust score in real time. No wallet required.
      </p>
    </div>
  )
}
