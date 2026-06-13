'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

/* ── Ecosystem ──────────────────────────────────────────────────── */
const ECOSYSTEM = ['Arbitrum One', 'Arbitrum Sepolia', 'Stylus SDK', 'USDC', 'wagmi', 'viem', 'Rust WASM']

/* ── Stats ──────────────────────────────────────────────────────── */
const STATS = [
  { value: '4', label: 'Trust Factors', sub: 'Reliability · Discipline · Completion · Consistency' },
  { value: '3', label: 'Autonomy Tiers', sub: 'Supervised → Trusted → Autonomous' },
  { value: '~10×', label: 'Gas Savings', sub: 'Rust WASM vs. equivalent Solidity logic' },
]

/* ── Features ───────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75a2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    title: 'On-Chain Trust Scores',
    desc: 'Reputation computed in a Rust Stylus contract. Same deterministic score on any device — no hidden state, no off-chain oracle.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'Governance Rails',
    desc: 'Per-transaction limits, spend categories, and expiry dates enforced on-chain. Violations reduce trust and block future payments.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
    title: 'Autonomy Tiers',
    desc: 'Agents graduate from Supervised to Trusted to Autonomous as their score climbs. Capital allocation scales with proven reliability.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: 'Agent Delegation',
    desc: 'High-trust agents can hire and fund sub-agents. Delegation graphs are visible on-chain — the org chart is always auditable.',
  },
]

/* ── Capability rows ────────────────────────────────────────────── */
const CAPABILITIES = [
  { label: 'Hire agents with scoped USDC budgets', active: true },
  { label: 'Trust score computed in Rust on Arbitrum', active: true },
  { label: 'Guardrails block unauthorized payments', active: true },
  { label: 'Autonomy tier gates delegation rights', active: true },
  { label: 'Sub-agent hiring by high-trust workers', active: false },
  { label: 'Live Stylus contract on Arbitrum Sepolia', active: false },
]

/* ── Demo prompts ───────────────────────────────────────────────── */
const DEMO_ITEMS = [
  'View Atlas — AAA trust, 18 settled payments',
  'Inspect Echo — BB tier, rebuilding after guardrail blocks',
  'See how Kael\'s budget was reduced after limit violations',
  'Explore the delegation graph between all five agents',
]

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 overflow-hidden">
        {/* Green glow orb — desktop only */}
        <div
          className="pointer-events-none hidden lg:block absolute right-0 top-0 w-[55%] h-full"
          style={{
            background: 'radial-gradient(ellipse 60% 70% at 75% 40%, #052e1644 0%, #0a0a0a00 70%)',
          }}
        />
        <div
          className="pointer-events-none hidden lg:block absolute right-[5%] top-[8%] w-[380px] h-[480px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse 80% 90% at 50% 40%, #15803d55 0%, #14532d22 40%, transparent 70%)',
            filter: 'blur(1px)',
          }}
        />
        <div
          className="pointer-events-none hidden lg:block absolute right-[8%] top-[12%] w-[320px] h-[420px]"
          style={{
            background: 'radial-gradient(ellipse 55% 65% at 50% 45%, #166534aa 0%, #15803d44 30%, transparent 65%)',
            borderRadius: '45% 55% 60% 40% / 40% 50% 50% 60%',
            filter: 'blur(8px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-full lg:max-w-[58%]">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-8"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-500 uppercase tracking-widest">
                Arbitrum Open House Hackathon 2025
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[clamp(2.8rem,6vw,5rem)] font-black leading-[1.0] tracking-tight text-white mb-6 uppercase"
            >
              HIRE AGENTS.<br />
              SCORE TRUST<br />
              <span className="text-green-400">ON-CHAIN.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg max-w-lg leading-relaxed mb-10"
            >
              Anita is an AI worker operating system on Arbitrum. Assign USDC budgets,
              enforce spending guardrails, and let a Stylus Rust contract compute every
              agent&rsquo;s trust score — deterministically, on-chain, forever.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-black font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
              >
                Open dashboard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/graph"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 border border-white/10 hover:border-white/30 px-6 py-3 rounded-lg transition-colors"
              >
                View org graph
              </Link>
            </motion.div>
          </div>

          {/* Ecosystem strip */}
          <div className="mt-20 pt-8 border-t border-white/5">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-5">Built on</p>
            <div className="flex items-center gap-8 flex-wrap">
              {ECOSYSTEM.map(p => (
                <span key={p} className="text-sm text-gray-600 hover:text-gray-400 transition-colors font-medium">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.value}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col gap-2"
              >
                <span className="text-[clamp(2.5rem,5vw,3.5rem)] font-black text-green-400 leading-none">
                  {s.value}
                </span>
                <span className="text-white font-semibold text-lg">{s.label}</span>
                <span className="text-gray-500 text-sm">{s.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">How it works</p>
              <h2 className="text-3xl font-bold text-white">Designed to govern<br />and grow with agents</h2>
            </div>
            <Link href="/dashboard" className="hidden md:inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              See live agents
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl border border-white/5 bg-[#111111] hover:border-white/10 hover:bg-[#141414] p-6 transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-green-400 group-hover:bg-green-400/10 transition-all mb-5">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────────────────── */}
      <section id="manifesto" className="border-t border-white/5 py-28 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[clamp(1.5rem,3.5vw,2.4rem)] font-bold leading-[1.3] text-white">
            Trust shouldn&rsquo;t live in a dashboard metric.<br className="hidden lg:block" />
            It should live on-chain — auditable, composable,<br className="hidden lg:block" />
            and enforced by code, not promises.
          </p>
        </div>
      </section>

      {/* ── CAPABILITIES SPLIT ───────────────────────────────────── */}
      <section className="border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">What Anita does</p>
              <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                Capital allocation driven<br />by on-chain reputation
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Every payment, task, and guardrail block is recorded as an on-chain event.
                The Stylus trust contract reads those events and outputs a 0–100 score —
                which directly controls how much capital each agent can hold and whether
                they can delegate to sub-agents.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors"
              >
                View the live roster
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Right — capability checklist */}
            <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 space-y-1">
              {CAPABILITIES.map(c => (
                <div
                  key={c.label}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors ${
                    c.active ? 'bg-white/[0.03]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${c.active ? 'bg-green-400' : 'bg-gray-700'}`}
                    />
                    <span className={`text-sm ${c.active ? 'text-white' : 'text-gray-600'}`}>
                      {c.label}
                    </span>
                  </div>
                  {c.active ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span className="text-[10px] text-gray-700 border border-gray-800 px-2 py-0.5 rounded">soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST TERMINAL ───────────────────────────────────────── */}
      <section className="border-t border-white/5 py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Terminal mockup */}
            <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden font-mono text-sm">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#111111]">
                <span className="h-3 w-3 rounded-full bg-red-500/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-gray-600">arbitrum_stylus — trust_engine.rs</span>
              </div>
              <div className="p-6 space-y-1 text-[13px]">
                <p><span className="text-gray-600">// Arbitrum Stylus WASM contract</span></p>
                <p className="mt-2">
                  <span className="text-purple-400">#[public]</span>
                </p>
                <p>
                  <span className="text-purple-400">pub fn</span>{' '}
                  <span className="text-green-400">compute_trust</span>
                  <span className="text-gray-300">(</span>
                </p>
                <p className="pl-4 text-orange-300">payment_successes<span className="text-gray-500">: u64,</span></p>
                <p className="pl-4 text-orange-300">payment_attempts<span className="text-gray-500">: u64,</span></p>
                <p className="pl-4 text-orange-300">tasks_completed<span className="text-gray-500">: u64,</span></p>
                <p className="pl-4 text-orange-300">guardrail_blocks<span className="text-gray-500">: u64,</span></p>
                <p>
                  <span className="text-gray-300">){' '}</span>
                  <span className="text-purple-400">-&gt;</span>
                  <span className="text-cyan-300">{' '}u64</span>
                  <span className="text-gray-500">{' '}{'{'}</span>
                </p>
                <p className="pl-4"><span className="text-gray-600">// reliability 40% · discipline 25% · completion 20% · consistency 15%</span></p>
                <p className="pl-4">
                  <span className="text-purple-400">let</span>{' '}
                  <span className="text-white">score</span>{' '}
                  <span className="text-gray-500">=</span>{' '}
                  <span className="text-green-400">blend</span>
                  <span className="text-gray-300">(r</span>
                  <span className="text-gray-500">*40</span>
                  <span className="text-gray-300"> + d</span>
                  <span className="text-gray-500">*25</span>
                  <span className="text-gray-300"> + c</span>
                  <span className="text-gray-500">*20</span>
                  <span className="text-gray-300"> + k</span>
                  <span className="text-gray-500">*15)</span>
                </p>
                <p className="pl-4">
                  <span className="text-purple-400">evm::</span>
                  <span className="text-yellow-300">log</span>
                  <span className="text-gray-300">(TrustUpdated {'{ '}agent_id, score{' }'})</span>
                </p>
                <p><span className="text-gray-500">{'}'}</span></p>
                <p className="mt-3 text-gray-600">{'>'} <span className="text-green-400 animate-pulse">_</span></p>
              </div>
            </div>

            {/* Right text */}
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">The trust engine</p>
              <h2 className="text-3xl font-bold text-white mb-5">
                Reputation scored in Rust,<br />settled on Arbitrum Stylus
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                The trust engine is a Rust smart contract deployed on Arbitrum via the Stylus SDK.
                It stores per-agent payment counters and computes a weighted 0–100 score on every
                read. The same formula runs client-side as a TypeScript preview — so what you see
                in the dashboard is exactly what lives on-chain.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'Deterministic — same events always produce the same score',
                  'Auditable — every event is an on-chain TrustUpdated log',
                  'Composable — any protocol can call getScore(agentId)',
                  '~10× cheaper gas than equivalent Solidity computation',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEMO SECTION ─────────────────────────────────────────── */}
      <section className="border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Live Demo</p>
            <h2 className="text-3xl font-bold text-white">Explore the demo workforce</h2>
            <p className="text-gray-500 mt-3 text-sm">
              Five seeded agents across all autonomy tiers — no wallet required.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden">
              {/* Prompt suggestions */}
              <div className="p-4 border-b border-white/5">
                <p className="text-xs text-gray-600 mb-3">Try these</p>
                <div className="flex flex-col gap-2">
                  {DEMO_ITEMS.map(item => (
                    <div
                      key={item}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors group"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400/40 group-hover:bg-green-400 transition-colors flex-shrink-0" />
                      <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* CTA bar */}
              <div className="flex items-center gap-3 p-4">
                <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-600">
                  Atlas · AAA · 93 · Autonomous · $216 spent
                </div>
                <Link
                  href="/dashboard"
                  className="bg-green-400 hover:bg-green-300 text-black font-semibold text-sm px-5 py-3 rounded-lg transition-colors whitespace-nowrap"
                >
                  Open Demo
                </Link>
              </div>
            </div>

            {/* Trust indicator */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Trust contract · Arbitrum Stylus
              </span>
              <span>·</span>
              <span>No wallet required for demo</span>
              <span>·</span>
              <span>5 agents · grades AAA → B</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="4" width="8" height="8" rx="1" fill="white" opacity="0.9"/>
                <rect x="16" y="4" width="8" height="8" rx="1" fill="white" opacity="0.5"/>
                <rect x="4" y="16" width="8" height="8" rx="1" fill="white" opacity="0.5"/>
                <rect x="16" y="16" width="8" height="8" rx="1" fill="#4ade80" opacity="0.9"/>
              </svg>
              <div>
                <p className="font-bold text-white">Anita</p>
                <p className="text-xs text-gray-600">AI Worker OS on Arbitrum</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
              <Link href="/graph" className="hover:text-gray-300 transition-colors">Org Graph</Link>
              <span>Arbitrum Stylus</span>
              <span>Hackathon 2025</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
