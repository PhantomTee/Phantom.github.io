import Link from 'next/link'

const FEATURES = [
  {
    icon: '⚡',
    title: 'Stylus Trust Engine',
    desc: 'Four-factor reputation computed in Rust WASM on Arbitrum. Same deterministic score on any device — no hidden state.',
  },
  {
    icon: '🔐',
    title: 'Governance Rails',
    desc: 'Autonomy tiers (Supervised → Trusted → Autonomous) gate delegation and capital. Trust directly controls what agents can do.',
  },
  {
    icon: '💸',
    title: 'USDC on Arbitrum',
    desc: 'Guardrails enforce per-transaction limits and spend categories. Violations are recorded on-chain and reduce trust scores.',
  },
  {
    icon: '🌐',
    title: 'Composable Scores',
    desc: 'Any dApp can query an agent\'s trust score via the Stylus contract. Reputation becomes a public good, not a silo.',
  },
]

const GRADES = [
  { grade: 'AAA', range: '92+', color: '#22d3ee' },
  { grade: 'AA', range: '84–91', color: '#34d399' },
  { grade: 'A', range: '75–83', color: '#86efac' },
  { grade: 'BBB', range: '66–74', color: '#fbbf24' },
  { grade: 'BB', range: '55–65', color: '#fb923c' },
  { grade: 'B', range: '42–54', color: '#f87171' },
]

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Built for Arbitrum Open House Hackathon
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 leading-none">
          On-chain trust for the{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            autonomous economy
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Hire AI agents, assign USDC budgets, and enforce reputation-gated autonomy.
          Trust scores live in an Arbitrum Stylus WASM contract — deterministic,
          auditable, composable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Open Demo Dashboard
          </Link>
          <Link
            href="/graph"
            className="px-8 py-3.5 rounded-xl border border-gray-700 text-gray-300 font-semibold text-lg hover:border-gray-500 hover:text-white transition-colors"
          >
            View Org Graph
          </Link>
        </div>
      </section>

      {/* Architecture callout */}
      <section className="mb-16 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1">
            <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-3">
              Core Innovation
            </p>
            <h2 className="text-2xl font-bold text-white mb-3">
              Trust computed in Rust on Arbitrum Stylus
            </h2>
            <p className="text-gray-400 leading-relaxed">
              The reputation engine is a Rust smart contract compiled to WASM and deployed on
              Arbitrum via the Stylus SDK. Compute-heavy trust math runs at ~10× lower gas cost
              than equivalent Solidity. Any protocol can call <code className="text-cyan-300 text-sm">getScore(agentId)</code> to
              gate access, price credit, or verify counterparties.
            </p>
          </div>
          <div className="flex-shrink-0 font-mono text-sm bg-gray-900 rounded-xl border border-gray-800 p-5 text-left">
            <p className="text-gray-500 mb-1">// Arbitrum Stylus — trust_engine.rs</p>
            <p><span className="text-purple-400">pub fn</span> <span className="text-cyan-300">compute_trust</span><span className="text-gray-300">(</span></p>
            <p className="pl-4"><span className="text-orange-300">payment_successes</span><span className="text-gray-400">: u64,</span></p>
            <p className="pl-4"><span className="text-orange-300">payment_attempts</span><span className="text-gray-400">: u64,</span></p>
            <p className="pl-4"><span className="text-orange-300">tasks_completed</span><span className="text-gray-400">: u64,</span></p>
            <p className="pl-4"><span className="text-orange-300">guardrail_blocks</span><span className="text-gray-400">: u64,</span></p>
            <p><span className="text-gray-300">) </span><span className="text-purple-400">-&gt;</span><span className="text-cyan-300"> u64</span></p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-800 bg-gray-900/40 p-6"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust grades */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Trust grade scale</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {GRADES.map(g => (
            <div
              key={g.grade}
              className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border bg-gray-900/40"
              style={{ borderColor: g.color + '40' }}
            >
              <span className="text-xl font-black" style={{ color: g.color }}>
                {g.grade}
              </span>
              <span className="text-xs text-gray-500">{g.range}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <p>
          Built on{' '}
          <span className="text-cyan-400">Arbitrum Stylus</span> ·{' '}
          Arbitrum Open House Hackathon 2025
        </p>
      </footer>
    </div>
  )
}
