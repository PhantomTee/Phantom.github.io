'use client'

import { TrustGraph } from '@/components/agents/trust-graph'

export default function GraphPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h1 className="text-lg font-bold text-white">Organization Graph</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Agent delegation tree · color = trust grade · arrows = payment authority
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Legend color="#22d3ee" label="AAA–AA" />
          <Legend color="#34d399" label="A" />
          <Legend color="#fbbf24" label="BBB" />
          <Legend color="#fb923c" label="BB" />
          <Legend color="#f87171" label="B–C" />
        </div>
      </div>
      <div className="flex-1 relative">
        <TrustGraph />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-gray-400">{label}</span>
    </div>
  )
}
