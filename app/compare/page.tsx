'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAgents } from '@/components/agents/agents-provider'
import { computeTrust, gradeColor, scoreToGrade } from '@/lib/reputation'
import { getAutonomyTier } from '@/lib/governance'
import type { Agent, AgentEvent } from '@/lib/types'

const FACTOR_LABELS = [
  { key: 'reliability' as const, label: 'Reliability', weight: '40%' },
  { key: 'discipline'  as const, label: 'Discipline',  weight: '25%' },
  { key: 'completion'  as const, label: 'Completion',  weight: '20%' },
  { key: 'consistency' as const, label: 'Consistency', weight: '15%' },
]

const AGENT_ACCENT = ['#818cf8', '#34d399', '#fbbf24', '#f87171']

function AgentColumn({ agent, events, accent }: { agent: Agent; events: AgentEvent[]; accent: string }) {
  const trust = computeTrust(events)
  const tier  = getAutonomyTier(trust.score)
  const grade = scoreToGrade(trust.score)
  const color = gradeColor(grade)

  const spent = events
    .filter(e => e.kind === 'payment_success')
    .reduce((s, e) => s + (e.amountUsdc ?? 0), 0)
  const utilization = agent.authorization.budgetUsdc > 0
    ? Math.min(spent / agent.authorization.budgetUsdc, 1)
    : 0

  return (
    <div className="flex-1 min-w-0">
      {/* Agent header */}
      <div className="mb-8 pb-8 border-b border-neutral-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 flex-shrink-0" style={{ backgroundColor: accent }} />
          <span className="font-mono text-[10px] tracking-[0.12em] text-neutral-400 uppercase truncate">
            {agent.model.replace('groq/', '').replace('heurist/', '')}
          </span>
        </div>
        <p className="font-mono text-[15px] text-neutral-800 tracking-[0.04em] truncate">{agent.name}</p>
        <p className="font-mono text-[10px] text-neutral-400 tracking-[0.1em] mt-1 uppercase">{tier.label}</p>
      </div>

      {/* Score */}
      <div className="mb-8">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display font-light leading-none" style={{ fontSize: '3rem', color }}>{trust.score}</span>
          <span className="font-mono text-[12px]" style={{ color }}>{grade}</span>
        </div>
        <p className="font-mono text-[10px] text-neutral-400 tracking-[0.1em]">{trust.confidence} confidence</p>
      </div>

      {/* Factor bars */}
      <div className="space-y-5 mb-8">
        {FACTOR_LABELS.map(({ key, label, weight }) => {
          const val = trust.factors[key]
          const pct = Math.round(val * 100)
          return (
            <div key={key}>
              <div className="flex justify-between font-mono text-[10px] text-neutral-400 mb-1.5">
                <span>{label}</span>
                <span>{weight} · <span style={{ color: accent }}>{pct}%</span></span>
              </div>
              <div className="h-1 bg-neutral-100 relative">
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: accent, opacity: 0.7 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Budget */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex justify-between font-mono text-[10px] text-neutral-400 mb-2">
          <span>Budget</span>
          <span>${spent.toFixed(0)} / ${agent.authorization.budgetUsdc}</span>
        </div>
        <div className="h-px w-full bg-neutral-100 relative">
          <div
            className="absolute top-0 left-0 h-px"
            style={{ width: `${utilization * 100}%`, backgroundColor: accent, opacity: 0.55 }}
          />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          {[
            ['Payments', events.filter(e => e.kind === 'payment_success').length],
            ['Tasks',    events.filter(e => e.kind === 'task_completed').length],
            ['Failures', events.filter(e => e.kind === 'payment_failed').length],
            ['Blocks',   events.filter(e => e.kind === 'limit_blocked').length],
          ].map(([label, val]) => (
            <div key={String(label)} className="border border-neutral-100 px-3 py-3">
              <p className="font-mono text-[9px] tracking-[0.16em] text-neutral-400 uppercase mb-1">{label}</p>
              <p className="font-mono text-[15px] text-neutral-700">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  const { agents, eventsFor } = useAgents()
  const [selected, setSelected] = useState<string[]>([])

  function toggle(id: string) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    )
  }

  const comparing = selected.map(id => agents.find(a => a.id === id)).filter(Boolean) as Agent[]

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-24 pb-32 px-6 lg:px-14">

      {/* Back */}
      <div className="mb-10">
        <Link
          href="/dashboard"
          className="font-mono text-[11px] tracking-[0.18em] text-neutral-400 uppercase hover:text-neutral-700 transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span style={{ color: '#4169e1' }} className="text-[13px] leading-none select-none">■</span>
          <span className="font-mono text-[12px] tracking-[0.26em] text-neutral-400 uppercase">Compare</span>
        </div>
        <h1
          className="font-display font-light text-neutral-900 leading-tight tracking-tight"
          style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
        >
          Agent Comparison
        </h1>
        <p className="font-mono text-[11px] text-neutral-400 tracking-[0.1em] mt-4">
          Select up to 3 agents to compare trust factors side by side.
        </p>
      </div>

      {agents.length === 0 && (
        <p className="font-mono text-[11px] text-neutral-300 tracking-[0.1em]">
          // No agents yet — hire from the dashboard first.
        </p>
      )}

      {/* Agent selector */}
      {agents.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-12">
          {agents.map((agent, i) => {
            const isSelected = selected.includes(agent.id)
            const idx = selected.indexOf(agent.id)
            const accent = AGENT_ACCENT[idx] ?? AGENT_ACCENT[0]
            return (
              <button
                key={agent.id}
                onClick={() => toggle(agent.id)}
                className="font-mono text-[11px] tracking-[0.1em] px-4 py-2.5 border transition-all"
                style={{
                  borderColor: isSelected ? accent + '88' : 'rgb(229 231 235)',
                  color: isSelected ? accent : 'rgb(107 114 128)',
                  backgroundColor: isSelected ? accent + '0d' : 'transparent',
                }}
              >
                {agent.name}
                {isSelected && <span className="ml-2 opacity-60">✓</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* Comparison columns */}
      {comparing.length === 0 && agents.length > 0 && (
        <p className="font-mono text-[11px] text-neutral-300 tracking-[0.1em]">
          // Select agents above to compare
        </p>
      )}

      {comparing.length > 0 && (
        <div className="flex gap-8 lg:gap-12 overflow-x-auto pb-4">
          {comparing.map((agent, i) => (
            <AgentColumn
              key={agent.id}
              agent={agent}
              events={eventsFor(agent.id)}
              accent={AGENT_ACCENT[i]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
