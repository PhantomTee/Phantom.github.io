'use client'

import type { AgentEvent } from '@/lib/types'

interface ActivityFeedProps {
  events: AgentEvent[]
  limit?: number
}

const KIND_STYLES: Record<string, { dot: string; label: string }> = {
  payment_success: { dot: 'bg-emerald-400', label: 'Payment settled' },
  payment_failed: { dot: 'bg-red-400', label: 'Payment failed' },
  task_completed: { dot: 'bg-cyan-400', label: 'Task complete' },
  limit_blocked: { dot: 'bg-orange-400', label: 'Guardrail blocked' },
  authorized: { dot: 'bg-purple-400', label: 'Authorized' },
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function ActivityFeed({ events, limit = 20 }: ActivityFeedProps) {
  const visible = events.slice(0, limit)

  if (visible.length === 0) {
    return <p className="text-sm text-gray-500 py-4">No activity yet.</p>
  }

  return (
    <div className="space-y-2">
      {visible.map(e => {
        const style = KIND_STYLES[e.kind] ?? { dot: 'bg-gray-400', label: e.kind }
        return (
          <div key={e.id} className="flex items-start gap-3 py-1.5">
            <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${style.dot}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-200 truncate">{e.label}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">{relativeTime(e.at)}</span>
                {e.amountUsdc != null && (
                  <span className="text-xs text-gray-400">${e.amountUsdc.toFixed(2)} USDC</span>
                )}
                {e.trustDelta != null && (
                  <span
                    className={`text-xs font-medium ${e.trustDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {e.trustDelta >= 0 ? '+' : ''}{e.trustDelta.toFixed(1)} trust
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
