'use client'

import type { Authorization } from '@/lib/types'
import { SPEND_CATEGORIES } from '@/lib/types'

interface AuthorizationCardProps {
  auth: Authorization
  spentUsdc: number
}

export function AuthorizationCard({ auth, spentUsdc }: AuthorizationCardProps) {
  const utilization = Math.min(spentUsdc / auth.budgetUsdc, 1)
  const remaining = Math.max(auth.budgetUsdc - spentUsdc, 0)
  const expiry = new Date(auth.expiresAt)
  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86400000)

  const utilizationColor =
    utilization > 0.9 ? 'bg-red-500' : utilization > 0.6 ? 'bg-amber-400' : 'bg-cyan-400'

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-400">Budget used</span>
          <span className="text-white font-medium">
            ${spentUsdc.toFixed(2)} / ${auth.budgetUsdc}
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${utilizationColor}`}
            style={{ width: `${utilization * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{Math.round(utilization * 100)}% utilized</span>
          <span className="text-xs text-gray-500">${remaining.toFixed(2)} remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Per-tx limit</p>
          <p className="text-white font-medium">${auth.perTxLimitUsdc}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Expires</p>
          <p className={`font-medium ${daysLeft < 30 ? 'text-amber-400' : 'text-white'}`}>
            {daysLeft}d
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Network</p>
          <p className="text-white font-medium capitalize">
            {auth.network === 'arbitrum-one' ? 'Arbitrum One' : 'Arbitrum Sepolia'}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1.5">Authorized categories</p>
        <div className="flex flex-wrap gap-1.5">
          {auth.categories.map(catId => {
            const cat = SPEND_CATEGORIES.find(c => c.id === catId)
            return (
              <span
                key={catId}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
              >
                {cat?.label ?? catId}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
