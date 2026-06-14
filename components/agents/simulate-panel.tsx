'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useAgents } from './agents-provider'
import { computeTrust, scoreToGrade, gradeColor } from '@/lib/reputation'
import { STYLUS_CONTRACT_ADDRESS, TRUST_ENGINE_ABI } from '@/lib/arbitrum'
import { agentIdToBytes32 } from '@/hooks/use-on-chain-score'
import type { AgentEvent, AgentEventKind, SpendCategory } from '@/lib/types'

interface Action {
  kind:       AgentEventKind
  label:      string
  description: string
  color:      string
  amount?:    number
  category?:  SpendCategory
  trustDelta: number
  fn:         'recordPaymentSuccess' | 'recordPaymentFailure' | 'recordTaskCompleted' | 'recordLimitBlocked'
}

const ACTIONS: Action[] = [
  {
    kind: 'payment_success', fn: 'recordPaymentSuccess',
    label: 'Payment success', description: 'USDC transfer confirmed on Arbitrum',
    color: 'border-green-200 text-green-700 hover:border-green-300 hover:bg-green-50',
    amount: 12, category: 'compute', trustDelta: 0.8,
  },
  {
    kind: 'task_completed', fn: 'recordTaskCompleted',
    label: 'Task completed', description: 'Agent finished assigned work unit',
    color: 'border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50',
    trustDelta: 1.2,
  },
  {
    kind: 'payment_failed', fn: 'recordPaymentFailure',
    label: 'Payment failed', description: 'Transaction reverted on-chain',
    color: 'border-red-100 text-red-500 hover:border-red-200 hover:bg-red-50',
    amount: 10, category: 'data-apis', trustDelta: -2.5,
  },
  {
    kind: 'limit_blocked', fn: 'recordLimitBlocked',
    label: 'Guardrail blocked', description: 'Exceeded per-tx limit',
    color: 'border-amber-100 text-amber-600 hover:border-amber-200 hover:bg-amber-50',
    amount: 50, category: 'agent-services', trustDelta: -3.5,
  },
]

export function SimulatePanel({ agentId }: { agentId: string }) {
  const { addEvent, eventsFor } = useAgents()
  const [activeAction, setActiveAction] = useState<Action | null>(null)

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  const currentEvents = eventsFor(agentId)
  const currentScore = computeTrust(currentEvents).score

  function previewScore(action: Action): { score: number; grade: string } {
    const draft: AgentEvent = {
      id: '__preview__',
      agentId,
      kind: action.kind,
      label: action.description,
      at: new Date().toISOString(),
      amountUsdc: action.amount,
      category: action.category,
      trustDelta: action.trustDelta,
    }
    const result = computeTrust([...currentEvents, draft])
    return { score: result.score, grade: result.grade }
  }

  // When confirmed, record in local state too
  if (isConfirmed && activeAction) {
    addEvent({
      agentId,
      kind:      activeAction.kind,
      label:     activeAction.description,
      amountUsdc: activeAction.amount,
      category:  activeAction.category,
      trustDelta: activeAction.trustDelta,
      txHash,
    })
    setActiveAction(null)
    reset()
  }

  function fire(action: Action) {
    if (!STYLUS_CONTRACT_ADDRESS) {
      addEvent({
        agentId,
        kind:      action.kind,
        label:     `${action.description} (local)`,
        amountUsdc: action.amount,
        category:  action.category,
        trustDelta: action.trustDelta,
      })
      return
    }

    setActiveAction(action)

    if (action.fn === 'recordPaymentSuccess') {
      writeContract({
        address: STYLUS_CONTRACT_ADDRESS,
        abi: TRUST_ENGINE_ABI,
        functionName: 'recordPaymentSuccess',
        args: [agentIdToBytes32(agentId), BigInt(Math.round((action.amount ?? 0) * 100))],
      })
    } else if (action.fn === 'recordPaymentFailure') {
      writeContract({ address: STYLUS_CONTRACT_ADDRESS, abi: TRUST_ENGINE_ABI, functionName: 'recordPaymentFailure', args: [agentIdToBytes32(agentId)] })
    } else if (action.fn === 'recordTaskCompleted') {
      writeContract({ address: STYLUS_CONTRACT_ADDRESS, abi: TRUST_ENGINE_ABI, functionName: 'recordTaskCompleted', args: [agentIdToBytes32(agentId)] })
    } else if (action.fn === 'recordLimitBlocked') {
      writeContract({ address: STYLUS_CONTRACT_ADDRESS, abi: TRUST_ENGINE_ABI, functionName: 'recordLimitBlocked', args: [agentIdToBytes32(agentId)] })
    }
  }

  const busy = isPending || isConfirming

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-[11px] tracking-[0.26em] text-neutral-400 uppercase">
          {STYLUS_CONTRACT_ADDRESS ? 'Record on-chain event' : 'Record event (local)'}
        </span>
        {isConfirmed && (
          <span className="font-mono text-[10px] tracking-[0.12em] text-green-600">
            ✓ confirmed
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map(a => {
          const preview = previewScore(a)
          const delta = preview.score - currentScore
          return (
            <button
              key={a.kind}
              onClick={() => fire(a)}
              disabled={busy}
              className={`text-left px-4 py-4 border font-mono text-[11px] transition-all disabled:opacity-30 ${a.color}`}
            >
              <p className="tracking-[0.06em]">{a.label}</p>
              <p className="opacity-50 mt-1 text-[10px]">
                {a.trustDelta >= 0 ? '+' : ''}{a.trustDelta} trust
              </p>
              <p className="mt-2 text-[10px] opacity-60" style={{ color: gradeColor(preview.grade) }}>
                {currentScore} → {preview.score} ({scoreToGrade(preview.score)})
                {delta !== 0 && <span className="ml-1">{delta > 0 ? '▲' : '▼'}</span>}
              </p>
            </button>
          )
        })}
      </div>

      {/* Status */}
      <div className="mt-4 min-h-[28px]">
        {isPending && (
          <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400 animate-pulse">
            Waiting for wallet signature…
          </p>
        )}
        {isConfirming && txHash && (
          <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400 animate-pulse">
            Confirming · {txHash.slice(0, 10)}…
          </p>
        )}
        {writeError && (
          <p className="font-mono text-[10px] text-red-400">
            {writeError.message.slice(0, 80)}
          </p>
        )}
        {!STYLUS_CONTRACT_ADDRESS && (
          <p className="font-mono text-[10px] tracking-[0.1em] text-neutral-300">
            Set NEXT_PUBLIC_STYLUS_CONTRACT to write on-chain
          </p>
        )}
      </div>
    </div>
  )
}
