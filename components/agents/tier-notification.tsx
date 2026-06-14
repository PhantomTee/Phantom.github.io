'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { computeTrust } from '@/lib/reputation'
import { getAutonomyTier } from '@/lib/governance'
import { useAgents } from './agents-provider'
import type { AutonomyTier } from '@/lib/governance'

interface TierEvent {
  id: string
  agentName: string
  from: AutonomyTier
  to: AutonomyTier
  score: number
}

const TIER_ORDER: Record<AutonomyTier, number> = {
  supervised: 0,
  trusted: 1,
  autonomous: 2,
}

const TIER_COLOR: Record<AutonomyTier, string> = {
  supervised: '#f87171',
  trusted: 'rgba(255,255,255,0.55)',
  autonomous: '#34d399',
}

export function TierNotification() {
  const { agents, eventsFor } = useAgents()
  const prevTiers = useRef<Record<string, AutonomyTier>>({})
  const [notifications, setNotifications] = useState<TierEvent[]>([])

  useEffect(() => {
    const next: Record<string, AutonomyTier> = {}
    const newEvents: TierEvent[] = []

    for (const agent of agents) {
      const events = eventsFor(agent.id)
      const trust = computeTrust(events)
      const tier = getAutonomyTier(trust.score)
      next[agent.id] = tier.tier

      const prev = prevTiers.current[agent.id]
      if (prev && prev !== tier.tier) {
        newEvents.push({
          id: `${agent.id}-${Date.now()}`,
          agentName: agent.name,
          from: prev,
          to: tier.tier,
          score: trust.score,
        })
      }
    }

    prevTiers.current = next

    if (newEvents.length > 0) {
      setNotifications(prev => [...prev, ...newEvents])
      const timeout = setTimeout(() => {
        setNotifications(prev => prev.filter(n => !newEvents.some(e => e.id === n.id)))
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [agents, eventsFor])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map(n => {
          const upgraded = TIER_ORDER[n.to] > TIER_ORDER[n.from]
          const color = TIER_COLOR[n.to]
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="border border-neutral-200 bg-white/95 shadow-lg backdrop-blur px-5 py-4 max-w-xs"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color }}>
                  {upgraded ? '↑' : '↓'} Tier {upgraded ? 'Upgrade' : 'Downgrade'}
                </span>
              </div>
              <p className="font-mono text-[11px] text-neutral-500 leading-snug">
                <span className="text-neutral-900">{n.agentName}</span> moved from{' '}
                <span style={{ color: TIER_COLOR[n.from] }}>{n.from}</span> →{' '}
                <span style={{ color }}>{n.to}</span>
              </p>
              <p className="font-mono text-[10px] text-neutral-400 mt-1.5">
                Score: {n.score}
              </p>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
