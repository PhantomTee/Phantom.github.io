'use client'

import { getAutonomyTier, getBudgetRecommendation } from '@/lib/governance'

interface GovernanceCardProps {
  score: number
  utilization: number
  currentBudget: number
}

const TIER_COLORS = {
  autonomous: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  trusted: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  supervised: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
}

const DIRECTION_COLORS = {
  increase: 'text-emerald-400',
  hold: 'text-amber-400',
  reduce: 'text-red-400',
}

const DIRECTION_ICONS = { increase: '↑', hold: '→', reduce: '↓' }

export function GovernanceCard({ score, utilization, currentBudget }: GovernanceCardProps) {
  const tier = getAutonomyTier(score)
  const rec = getBudgetRecommendation(score, utilization, currentBudget)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Autonomy Tier</p>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${TIER_COLORS[tier.tier]}`}>
          {tier.label}
          {tier.canDelegate && (
            <span className="text-[10px] opacity-70">· can delegate</span>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-400">{tier.rationale}</p>
      </div>

      <div className="border-t border-gray-800 pt-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Budget Recommendation</p>
        <div className="flex items-baseline gap-2">
          <span className={`text-lg font-bold ${DIRECTION_COLORS[rec.direction]}`}>
            {DIRECTION_ICONS[rec.direction]} ${rec.newBudgetUsdc.toFixed(0)} USDC
          </span>
          <span className="text-xs text-gray-500">
            ({rec.direction === 'hold' ? 'unchanged' : `from $${currentBudget}`})
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-400">{rec.rationale}</p>
      </div>
    </div>
  )
}
