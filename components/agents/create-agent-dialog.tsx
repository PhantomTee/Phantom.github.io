'use client'

import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { useAgents } from './agents-provider'
import { STYLUS_CONTRACT_ADDRESS, TRUST_ENGINE_ABI } from '@/lib/arbitrum'
import { agentIdToBytes32 } from '@/hooks/use-on-chain-score'
import { SPEND_CATEGORIES, type SpendCategory } from '@/lib/types'
import type { Agent } from '@/lib/types'

const MODELS = [
  { id: 'groq/llama-3.3-70b-versatile',  label: 'Llama 3.3 70B (Groq)'   },
  { id: 'groq/llama-3.1-8b-instant',     label: 'Llama 3.1 8B (Groq)'    },
  { id: 'heurist/mistral-7b-instruct',   label: 'Mistral 7B (Heurist)'   },
  { id: 'heurist/mixtral-8x7b-instruct', label: 'Mixtral 8x7B (Heurist)' },
]

interface CreateAgentDialogProps {
  open: boolean
  onClose: () => void
}

export function CreateAgentDialog({ open, onClose }: CreateAgentDialogProps) {
  const { createAgent, addEvent } = useAgents()

  const [name,       setName]       = useState('')
  const [model,      setModel]      = useState(MODELS[0].id)
  const [budget,     setBudget]     = useState('100')
  const [perTx,      setPerTx]      = useState('15')
  const [network,    setNetwork]    = useState<'arbitrum-one' | 'arbitrum-sepolia'>('arbitrum-sepolia')
  const [categories, setCategories] = useState<SpendCategory[]>(['compute'])
  const [error,      setError]      = useState('')
  const [pendingAgent, setPendingAgent] = useState<Agent | null>(null)

  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()
  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (!isConfirmed || !pendingAgent) return
    createAgent({ ...pendingAgent, onChainScore: 79 })
    addEvent({
      agentId: pendingAgent.id,
      kind:    'authorized',
      label:   `${pendingAgent.name} authorized — budget set on Arbitrum`,
      txHash,
      trustDelta: 0,
    })
    setPendingAgent(null)
    reset()
    handleClose()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed])

  function toggleCategory(cat: SpendCategory) {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  function handleClose() {
    setName(''); setModel(MODELS[0].id); setBudget('100'); setPerTx('15')
    setCategories(['compute']); setError(''); setPendingAgent(null); reset()
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim())           { setError('Name is required'); return }
    if (categories.length === 0){ setError('Select at least one spend category'); return }
    const budgetNum = parseFloat(budget)
    const perTxNum  = parseFloat(perTx)
    if (isNaN(budgetNum) || budgetNum <= 0)   { setError('Budget must be a positive number'); return }
    if (isNaN(perTxNum)  || perTxNum  <= 0)   { setError('Per-tx limit must be a positive number'); return }
    if (perTxNum > budgetNum)                  { setError('Per-tx limit cannot exceed total budget'); return }

    const id    = `agent-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
    const agent: Agent = {
      id,
      name: name.trim(),
      model,
      avatarSeed: id.slice(-6),
      createdAt: new Date().toISOString(),
      status: 'active',
      authorization: {
        budgetUsdc:    budgetNum,
        perTxLimitUsdc: perTxNum,
        expiresAt:     new Date(Date.now() + 365 * 86400000).toISOString(),
        categories,
        network,
      },
    }

    if (STYLUS_CONTRACT_ADDRESS) {
      if (chainId !== arbitrumSepolia.id) {
        try {
          await switchChainAsync({ chainId: arbitrumSepolia.id })
        } catch {
          setError('Please switch your wallet to Arbitrum Sepolia and try again.')
          return
        }
      }
      setPendingAgent(agent)
      writeContract({
        address:      STYLUS_CONTRACT_ADDRESS,
        abi:          TRUST_ENGINE_ABI,
        functionName: 'setBudget',
        args:         [agentIdToBytes32(id), BigInt(Math.round(budgetNum * 100))],
      })
    } else {
      createAgent(agent)
      addEvent({
        agentId: id,
        kind:    'authorized',
        label:   `${agent.name} authorized with $${budgetNum} USDC budget`,
        trustDelta: 0,
      })
      handleClose()
    }
  }

  if (!open) return null

  const busy = isPending || isConfirming

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? handleClose : undefined} />
      <div className="relative w-full max-w-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span style={{ color: '#4169e1' }} className="text-[13px] leading-none select-none">■</span>
              <span className="font-mono text-[11px] tracking-[0.26em] text-neutral-400 uppercase">New Agent</span>
            </div>
            <p className="font-mono text-[11px] text-neutral-300 tracking-[0.08em]">Budget set on Arbitrum Sepolia</p>
          </div>
          {!busy && (
            <button onClick={handleClose} className="font-mono text-[18px] text-neutral-300 hover:text-neutral-600 transition-colors leading-none">×</button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">

          {/* Name */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">Agent name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Nexus"
              disabled={busy}
              className="w-full bg-transparent border border-neutral-200 dark:border-neutral-700 px-4 py-3 font-mono text-[13px] text-neutral-900 dark:text-neutral-100 placeholder-neutral-300 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors disabled:opacity-40"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">Model</label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              disabled={busy}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 px-4 py-3 font-mono text-[13px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors disabled:opacity-40"
            >
              {MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>

          {/* Budget + per-tx */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">Budget (USDC)</label>
              <input
                type="number" min="1" value={budget}
                onChange={e => setBudget(e.target.value)}
                disabled={busy}
                className="w-full bg-transparent border border-neutral-200 dark:border-neutral-700 px-4 py-3 font-mono text-[13px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors disabled:opacity-40"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">Per-tx limit</label>
              <input
                type="number" min="1" value={perTx}
                onChange={e => setPerTx(e.target.value)}
                disabled={busy}
                className="w-full bg-transparent border border-neutral-200 dark:border-neutral-700 px-4 py-3 font-mono text-[13px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors disabled:opacity-40"
              />
            </div>
          </div>

          {/* Network */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">Network</label>
            <div className="flex gap-3">
              {(['arbitrum-sepolia', 'arbitrum-one'] as const).map(n => (
                <button
                  key={n} type="button"
                  onClick={() => setNetwork(n)}
                  disabled={busy}
                  className={`flex-1 py-3 font-mono text-[11px] tracking-[0.1em] border transition-all disabled:opacity-40 ${
                    network === n
                      ? 'border-neutral-500 text-neutral-900 dark:text-white'
                      : 'border-neutral-100 dark:border-neutral-700 text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-500'
                  }`}
                >
                  {n === 'arbitrum-one' ? 'Arbitrum One' : 'Arbitrum Sepolia'}
                </button>
              ))}
            </div>
          </div>

          {/* Spend categories */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">Spend categories</label>
            <div className="grid grid-cols-2 gap-2">
              {SPEND_CATEGORIES.map(cat => (
                <button
                  key={cat.id} type="button"
                  onClick={() => toggleCategory(cat.id)}
                  disabled={busy}
                  className={`text-left px-4 py-3 border font-mono text-[11px] transition-all disabled:opacity-40 ${
                    categories.includes(cat.id)
                      ? 'border-neutral-500 text-neutral-900 dark:text-white'
                      : 'border-neutral-100 dark:border-neutral-700 text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-500'
                  }`}
                >
                  <p className="tracking-[0.06em]">{cat.label}</p>
                  <p className="text-[10px] opacity-50 mt-0.5 font-normal">{cat.hint}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Errors */}
          {error && (
            <p className="font-mono text-[11px] text-red-500">{error}</p>
          )}
          {writeError && (
            <p className="font-mono text-[11px] text-red-500">
              Wallet error: {writeError.message.slice(0, 80)}
            </p>
          )}

          {/* Status */}
          {isPending && (
            <p className="font-mono text-[11px] text-neutral-400 animate-pulse tracking-[0.1em]">
              Waiting for wallet signature…
            </p>
          )}
          {isConfirming && (
            <p className="font-mono text-[11px] text-neutral-400 animate-pulse tracking-[0.1em]">
              Transaction confirming on Arbitrum…
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={handleClose} disabled={busy}
              className="flex-1 py-4 font-mono text-[11px] tracking-[0.18em] uppercase text-neutral-400 border border-neutral-100 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500 transition-all disabled:opacity-30"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={busy}
              className="flex-1 py-4 font-mono text-[11px] tracking-[0.18em] uppercase text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-600 hover:border-neutral-600 dark:hover:border-neutral-400 transition-all disabled:opacity-30"
            >
              {busy ? 'Hiring…' : 'Hire Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
