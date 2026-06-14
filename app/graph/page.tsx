'use client'

import { TrustGraph } from '@/components/agents/trust-graph'

export default function GraphPage() {
  return (
    <div className="min-h-screen bg-[#030a12] text-white flex flex-col pt-24">

      {/* Header */}
      <div className="px-6 lg:px-14 py-12 border-b border-white/[0.06]">
        <div className="flex items-start justify-between flex-wrap gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span style={{ color: '#4169e1' }} className="text-[13px] leading-none select-none">■</span>
              <span className="font-mono text-[12px] tracking-[0.26em] text-white/35 uppercase">Org Graph</span>
            </div>
            <h1
              className="font-display font-light text-white leading-[1.0] tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              Trust Network
            </h1>
            <p className="font-mono text-[11px] text-white/25 tracking-[0.1em] mt-5 leading-relaxed">
              Agent delegation tree · color = trust grade · arrows = payment authority
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 self-end pb-1">
            <LegendItem color="#22d3ee" label="AAA–AA" />
            <LegendItem color="#34d399" label="A" />
            <LegendItem color="#fbbf24" label="BBB" />
            <LegendItem color="#fb923c" label="BB" />
            <LegendItem color="#f87171" label="B–C" />
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative" style={{ minHeight: '65vh' }}>
        <TrustGraph />
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="font-mono text-[11px] tracking-[0.12em] text-white/30">{label}</span>
    </div>
  )
}
