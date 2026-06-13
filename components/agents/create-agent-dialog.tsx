'use client'

import { useState } from 'react'
import { useAgents } from './agents-provider'
import { SPEND_CATEGORIES, type SpendCategory } from '@/lib/types'
import type { Agent } from '@/lib/types'

const MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8' },
]

interface CreateAgentDialogProps {
  open: boolean
  onClose: () => void
}

export function CreateAgentDialog({ open, onClose }: CreateAgentDialogProps) {
  const { dispatch } = useAgents()
  const [name, setName] = useState('')
  const [model, setModel] = useState(MODELS[0].id)
  const [budget, setBudget] = useState('100')
  const [perTx, setPerTx] = useState('15')
  const [network, setNetwork] = useState<'arbitrum-one' | 'arbitrum-sepolia'>('arbitrum-sepolia')
  const [categories, setCategories] = useState<SpendCategory[]>(['compute'])
  const [error, setError] = useState('')

  if (!open) return null

  function toggleCategory(cat: SpendCategory) {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required'); return }
    if (categories.length === 0) { setError('Select at least one spend category'); return }
    const budgetNum = parseFloat(budget)
    const perTxNum = parseFloat(perTx)
    if (isNaN(budgetNum) || budgetNum <= 0) { setError('Budget must be a positive number'); return }
    if (isNaN(perTxNum) || perTxNum <= 0) { setError('Per-tx limit must be a positive number'); return }
    if (perTxNum > budgetNum) { setError('Per-tx limit cannot exceed total budget'); return }

    const id = `agent-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
    const agent: Agent = {
      id,
      name: name.trim(),
      model,
      avatarSeed: `${id.slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      authorization: {
        budgetUsdc: budgetNum,
        perTxLimitUsdc: perTxNum,
        expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
        categories,
        network,
      },
    }

    dispatch({ type: 'ADD_AGENT', agent })
    dispatch({
      type: 'ADD_EVENT',
      event: {
        id: `${id}-authorized`,
        agentId: id,
        kind: 'authorized',
        label: `${agent.name} authorized with $${budgetNum} USDC budget`,
        at: new Date().toISOString(),
        trustDelta: 0,
      },
    })

    setName(''); setModel(MODELS[0].id); setBudget('100'); setPerTx('15')
    setCategories(['compute']); setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="font-bold text-white">Hire New Agent</h2>
            <p className="text-xs text-gray-500 mt-0.5">Assign budget and permissions on Arbitrum</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Agent name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Nexus"
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-400/50 transition-colors"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Model</label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-400/50 transition-colors"
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Budget + per-tx */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Budget (USDC)</label>
              <input
                type="number"
                min="1"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-400/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Per-tx limit (USDC)</label>
              <input
                type="number"
                min="1"
                value={perTx}
                onChange={e => setPerTx(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-400/50 transition-colors"
              />
            </div>
          </div>

          {/* Network */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Network</label>
            <div className="flex gap-2">
              {(['arbitrum-sepolia', 'arbitrum-one'] as const).map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNetwork(n)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                    network === n
                      ? 'border-green-400/50 bg-green-400/10 text-green-400'
                      : 'border-white/10 text-gray-500 hover:border-white/20'
                  }`}
                >
                  {n === 'arbitrum-one' ? 'Arbitrum One' : 'Arbitrum Sepolia'}
                </button>
              ))}
            </div>
          </div>

          {/* Spend categories */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Spend categories</label>
            <div className="grid grid-cols-2 gap-2">
              {SPEND_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                    categories.includes(cat.id)
                      ? 'border-green-400/40 bg-green-400/10 text-green-400'
                      : 'border-white/5 text-gray-500 hover:border-white/15'
                  }`}
                >
                  <p className="font-medium">{cat.label}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">{cat.hint}</p>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-gray-400 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-semibold bg-green-400 hover:bg-green-300 text-black rounded-lg transition-colors"
            >
              Hire Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
