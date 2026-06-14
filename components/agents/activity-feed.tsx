'use client'

import type { AgentEvent } from '@/lib/types'

interface ActivityFeedProps {
  events: AgentEvent[]
  limit?: number
}

const KIND_META: Record<string, { prefix: string; color: string }> = {
  payment_success: { prefix: '+', color: 'text-green-400/60' },
  payment_failed:  { prefix: '!', color: 'text-red-400/60'   },
  task_completed:  { prefix: '✓', color: 'text-white/40'     },
  limit_blocked:   { prefix: '⊘', color: 'text-amber-400/60' },
  authorized:      { prefix: '→', color: 'text-white/30'     },
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export function ActivityFeed({ events, limit = 20 }: ActivityFeedProps) {
  const visible = events.slice(0, limit)

  if (visible.length === 0) {
    return (
      <p className="font-mono text-[11px] text-white/18 py-8 tracking-[0.1em]">
        // no activity yet
      </p>
    )
  }

  return (
    <div>
      {visible.map(e => {
        const meta = KIND_META[e.kind] ?? { prefix: '>', color: 'text-white/25' }
        return (
          <div key={e.id} className="flex items-start gap-3 py-4 border-b border-white/[0.04]">
            <span className={`font-mono text-[11px] mt-0.5 flex-shrink-0 w-3 ${meta.color}`}>
              {meta.prefix}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] text-white/45 truncate tracking-[0.04em] leading-snug">
                {e.label}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="font-mono text-[10px] text-white/18">{relativeTime(e.at)}</span>
                {e.amountUsdc != null && (
                  <span className="font-mono text-[10px] text-white/28">
                    ${e.amountUsdc.toFixed(2)} USDC
                  </span>
                )}
                {e.trustDelta != null && (
                  <span
                    className={`font-mono text-[10px] ${
                      e.trustDelta >= 0 ? 'text-green-400/55' : 'text-red-400/55'
                    }`}
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
