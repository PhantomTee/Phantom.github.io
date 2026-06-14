'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════════
   ASCII MOUNTAIN  — deterministic halftone mountain silhouette
   ═══════════════════════════════════════════════════════════════════ */
function buildMountain(rows = 32, cols = 100): string[] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const x  = c / cols
      const y  = r / rows
      const px = 0.44
      const hw = 0.032 + y * 0.54
      const dx = Math.abs(x - px)
      if (dx > hw) return ' '
      const edge   = 1 - dx / hw
      const shadow = x < px ? 0.09 : -0.04
      const tex    = Math.sin(c * 0.74 + r * 1.23) * 0.07
                   + Math.cos(c * 0.31 - r * 0.88) * 0.04
      const d = edge * (1 - y * 0.28) + shadow + tex
      if (d > 0.72) return '#'
      if (d > 0.50) return ':'
      if (d > 0.28) return '.'
      return ' '
    }).join(' ')
  )
}

function buildHalftone(rows = 26, cols = 48): string[] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const v = Math.sin(c * 0.38 - r * 0.56) * 0.5
              + Math.sin(c * 0.72 + r * 0.29) * 0.3
              + 0.52
      if (v > 0.74) return '#'
      if (v > 0.54) return ':'
      if (v > 0.34) return '.'
      return ' '
    }).join(' ')
  )
}

const MOUNTAIN = buildMountain()
const HALFTONE = buildHalftone()

/* ═══════════════════════════════════════════════════════════════════
   ATOMS
   ═══════════════════════════════════════════════════════════════════ */

function MetaBox({ children }: { children: string }) {
  return (
    <span className="border border-white/[0.12] font-mono text-[10px] px-2.5 py-[5px] text-white/35 tracking-[0.14em] uppercase whitespace-nowrap select-none">
      {children}
    </span>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-12">
      <span style={{ color: '#4169e1' }} className="text-[13px] leading-none">■</span>
      <span className="font-mono text-[12px] tracking-[0.26em] text-white/40 uppercase">{text}</span>
    </div>
  )
}

function FadeUp({
  children, delay = 0, className = '',
}: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const Rule = () => <div className="w-full h-px bg-white/[0.06]" />

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="bg-[#030a12] min-h-screen text-white">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col overflow-hidden" style={{ minHeight: 'max(150svh, 960px)' }}>

        {[
          'top-[72px] left-5',
          'top-[72px] right-5',
          'bottom-5 left-5',
          'bottom-5 right-5',
        ].map(pos => (
          <span key={pos} className={`absolute ${pos} font-mono text-white/20 text-base select-none pointer-events-none z-20`}>+</span>
        ))}

        {/* ASCII mountain */}
        <div className="absolute top-20 left-0 right-0 z-[1] pointer-events-none select-none overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#030a12] to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-[440px] bg-gradient-to-t from-[#030a12] to-transparent z-10" />
          <pre
            className="font-mono text-white/[0.17] w-full overflow-hidden"
            style={{ fontSize: 'clamp(8px, 1vw, 13px)', lineHeight: 1.45, letterSpacing: '0.01em' }}
          >
            {MOUNTAIN.join('\n')}
          </pre>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col justify-end flex-1 pb-52 px-6 lg:px-14 pt-40">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-light text-white leading-[0.88] tracking-tight text-center w-full"
            style={{ fontSize: 'clamp(5rem, 16vw, 17rem)' }}
          >
            Anita
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 font-mono text-[17px] text-white/50 tracking-wide max-w-xl leading-loose"
          >
            AI agents deserve the same trust as software.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 mb-0 flex flex-col gap-6"
          >
            <Link
              href="/dashboard"
              className="self-start font-mono text-[13px] tracking-[0.22em] uppercase border border-white/25 hover:border-white/60 px-10 py-5 text-white/70 hover:text-white transition-all duration-200"
            >
              Open Dashboard →
            </Link>
            <Link
              href="/graph"
              className="self-start font-mono text-[13px] tracking-[0.22em] uppercase text-white/30 hover:text-white/60 transition-colors py-3"
            >
              View Org Graph
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          THE PROBLEM
      ══════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3 px-6 lg:px-14 py-16">
          <FadeUp><SectionLabel text="The Problem" /></FadeUp>

          <FadeUp delay={0.1}>
            <p
              className="font-display font-light text-white leading-[1.1]"
              style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.4rem)' }}
            >
              AI agents are operating with real capital and authority — but zero verifiable accountability.
            </p>
          </FadeUp>

          <FadeUp delay={0.2} className="mt-20 font-mono text-[13px] leading-[2.5] text-white/35">
            <p className="text-white/60 mb-8 text-[14px]">&gt; TRUST IS NOW THE CRITICAL BOTTLENECK...</p>
            <p className="mb-3">| UNVERIFIED PAYMENTS — AGENTS SPEND WITHOUT ON-CHAIN LIMITS</p>
            <p className="mb-3">| BUDGET OVERRUNS — NO ENFORCEMENT BEYOND DASHBOARD RULES</p>
            <p className="mb-3">| OPAQUE SCORING — TRUST METRICS LIVE IN DATABASES, NOT CHAINS</p>
            <p>| DELEGATION RISK — SUB-AGENTS INHERIT UNCHECKED AUTHORITY</p>
          </FadeUp>
        </div>

        <div className="lg:col-span-2 hidden lg:flex items-center justify-center py-36 px-10 overflow-hidden">
          <pre
            className="font-mono text-white/[0.08] select-none leading-[1.55]"
            style={{ fontSize: '11px', letterSpacing: '0.04em' }}
          >
            {HALFTONE.join('\n')}
          </pre>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          THE GOAL
      ══════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-2 hidden lg:flex items-center justify-center py-44 px-10 overflow-hidden">
          <pre
            className="font-mono text-white/[0.06] select-none leading-[1.55]"
            style={{ fontSize: '11px', letterSpacing: '0.04em' }}
          >
            {HALFTONE.join('\n')}
          </pre>
        </div>

        <div className="lg:col-span-3 px-6 lg:px-14 py-44">
          <FadeUp><SectionLabel text="The Goal" /></FadeUp>

          <FadeUp delay={0.1}>
            <p
              className="font-display font-light text-white leading-[1.1]"
              style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.4rem)' }}
            >
              Build a trust layer that makes AI agent accountability verifiable, auditable, and composable on-chain.
            </p>
          </FadeUp>

          <FadeUp delay={0.22} className="mt-16 flex items-center gap-5 flex-wrap">
            <Link
              href="/dashboard"
              className="font-mono text-[13px] tracking-[0.22em] uppercase border border-white/25 hover:border-white/60 px-10 py-5 text-white/70 hover:text-white transition-all duration-200"
            >
              Explore Demo →
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS ROW
      ══════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        {[
          { value: '4',    label: 'Trust Factors',  sub: 'Reliability · Discipline · Completion · Consistency' },
          { value: '3',    label: 'Autonomy Tiers', sub: 'Supervised → Trusted → Autonomous' },
          { value: '~10×', label: 'Gas Savings',    sub: 'vs. equivalent Solidity logic' },
        ].map((s, i) => (
          <FadeUp
            key={s.label}
            delay={i * 0.1}
            className="px-8 lg:px-14 py-24"
          >
            <p
              className="font-display font-light text-white leading-none"
              style={{ fontSize: 'clamp(3.5rem, 6vw, 7rem)' }}
            >
              {s.value}
            </p>
            <p className="font-mono text-[12px] text-white/45 mt-5 tracking-[0.2em] uppercase">{s.label}</p>
            <p className="font-mono text-[11px] text-white/20 mt-3 leading-relaxed">{s.sub}</p>
          </FadeUp>
        ))}
      </section>

      {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-14 py-44">
        <FadeUp><SectionLabel text="How It Works" /></FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {[
            { n: '01', title: 'On-Chain Trust Scores', desc: 'Reputation computed in a Rust Stylus contract. Deterministic, auditable, composable — no hidden state, no off-chain oracle.' },
            { n: '02', title: 'Governance Rails',       desc: 'Per-transaction limits, spend categories, and expiry dates enforced on-chain. Violations reduce trust immediately.' },
            { n: '03', title: 'Autonomy Tiers',         desc: 'Agents graduate from Supervised → Trusted → Autonomous as their score climbs. Capital scales with reliability.' },
            { n: '04', title: 'Agent Delegation',       desc: 'High-trust agents can hire and fund sub-agents. Delegation graphs are always auditable on-chain.' },
          ].map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 lg:p-10 cursor-default"
            >
              <span className="font-mono text-[12px] text-white/15 tracking-[0.22em] block mb-8">{f.n}</span>
              <h3 className="font-display font-medium text-white text-[20px] leading-snug mb-5">{f.title}</h3>
              <p className="font-mono text-[13px] text-white/35 leading-[2.0]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUST ENGINE
      ══════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-2">

        {/* Left — terminal */}
        <div className="px-6 lg:px-14 py-40">
          <FadeUp><SectionLabel text="The Trust Engine" /></FadeUp>
          <FadeUp delay={0.1}>
            <div className="border border-white/[0.08] font-mono text-[13px]">
              {/* title bar */}
              <div className="border-b border-white/[0.07] px-6 py-4 flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500/35" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/35" />
                <span className="w-3 h-3 rounded-full bg-green-400/35" />
                <span className="ml-4 text-white/18 text-[11px] tracking-[0.15em]">TRUST_ENGINE.RS · ARBITRUM STYLUS</span>
              </div>
              {/* code body */}
              <div className="p-8 leading-[2.0] space-y-0">
                <p className="text-white/18">{'// reliability 40% · discipline 25% · completion 20% · consistency 15%'}</p>
                <p className="mt-2"><span className="text-purple-400/75">#[public]</span></p>
                <p>
                  <span className="text-purple-400/75">pub fn </span>
                  <span className="text-green-400/80">compute_trust</span>
                  <span className="text-white/35">(</span>
                </p>
                {['payment_successes: u64', 'payment_attempts: u64', 'tasks_completed: u64', 'guardrail_blocks: u64'].map(p => (
                  <p key={p} className="pl-8 text-orange-300/60">{p}<span className="text-white/25">,</span></p>
                ))}
                <p>
                  <span className="text-white/35">{')'} </span>
                  <span className="text-purple-400/75">-&gt;</span>
                  <span className="text-cyan-300/70"> u64 </span>
                  <span className="text-white/18">{'{'}</span>
                </p>
                <p className="pl-8">
                  <span className="text-purple-400/75">let </span>
                  <span className="text-white/70">score</span>
                  <span className="text-white/28"> = </span>
                  <span className="text-green-400/80">blend</span>
                  <span className="text-white/35">(r</span><span className="text-green-400/60">*40</span>
                  <span className="text-white/35"> + d</span><span className="text-green-400/60">*25</span>
                  <span className="text-white/35"> + c</span><span className="text-green-400/60">*20</span>
                  <span className="text-white/35"> + k</span><span className="text-green-400/60">*15</span>
                  <span className="text-white/35">)</span>
                </p>
                <p className="pl-8">
                  <span className="text-purple-400/75">evm::</span>
                  <span className="text-yellow-300/65">log</span>
                  <span className="text-white/35">(TrustUpdated {'{ '}score{' }'})</span>
                </p>
                <p><span className="text-white/18">{'}'}</span></p>

                {/* weight bars */}
                <div className="mt-10 pt-8 border-t border-white/[0.06] space-y-6">
                  {[
                    { k: 'RELIABILITY', pct: 40, c: '#4ade80' },
                    { k: 'DISCIPLINE',  pct: 25, c: '#60a5fa' },
                    { k: 'COMPLETION',  pct: 20, c: '#f59e0b' },
                    { k: 'CONSISTENCY', pct: 15, c: '#c084fc' },
                  ].map(f => (
                    <div key={f.k} className="flex items-center gap-5">
                      <span className="text-[12px] text-white/30 w-28 shrink-0 tracking-wider">{f.k}</span>
                      <div className="flex-1 h-px bg-white/[0.05] relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${f.pct * 2.4}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                          style={{ backgroundColor: f.c + '88', height: '1px', position: 'absolute', top: 0 }}
                        />
                      </div>
                      <span className="text-[12px] w-8 text-right font-medium" style={{ color: f.c + '99' }}>{f.pct}%</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-white/25 text-[14px]">{'>'} <span className="cursor text-green-400/60">_</span></p>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Right — copy */}
        <div className="px-6 lg:px-14 py-40">
          <FadeUp delay={0.05}>
            <p
              className="font-display font-light text-white leading-[1.1]"
              style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.8rem)' }}
            >
              Reputation scored in Rust, settled on Arbitrum Stylus
            </p>
          </FadeUp>
          <FadeUp delay={0.15} className="mt-16 font-mono text-[13px] text-white/35 space-y-7 leading-[1.9]">
            {[
              'DETERMINISTIC — SAME EVENTS ALWAYS PRODUCE THE SAME SCORE',
              'AUDITABLE — EVERY EVENT IS AN ON-CHAIN TRUSTUPDATED LOG',
              'COMPOSABLE — ANY PROTOCOL CAN CALL GETSCORE(AGENTID)',
              '~10× CHEAPER GAS THAN EQUIVALENT SOLIDITY COMPUTATION',
            ].map(item => (
              <p key={item} className="flex items-start gap-5">
                <span className="text-white/20 shrink-0 mt-px text-[16px]">|</span>
                {item}
              </p>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CAPABILITIES
      ══════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-14 py-40">
        <FadeUp><SectionLabel text="Capabilities" /></FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {[
            { label: 'Hire agents with scoped USDC budgets',     live: true },
            { label: 'Trust score computed in Rust on Arbitrum', live: true },
            { label: 'Guardrails block unauthorized payments',    live: true },
            { label: 'Autonomy tier gates delegation rights',     live: true },
            { label: 'Sub-agent hiring by high-trust workers',    live: false },
            { label: 'Live Stylus contract on Arbitrum Sepolia',  live: false },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="flex items-center justify-between px-0 py-7 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-6">
                <span className={`w-[3px] h-7 shrink-0 ${c.live ? 'bg-green-400/55' : 'bg-white/8'}`} />
                <span className={`font-mono text-[13px] tracking-[0.1em] uppercase ${c.live ? 'text-white/65' : 'text-white/20'}`}>
                  {c.label}
                </span>
              </div>
              <span className={`font-mono text-[12px] tracking-[0.22em] shrink-0 ml-8 ${c.live ? 'text-green-400/50' : 'text-white/15'}`}>
                {c.live ? 'LIVE' : 'SOON'}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-14 py-40">
        <FadeUp><SectionLabel text="The Workforce" /></FadeUp>

        <FadeUp delay={0.1}>
          <p
            className="font-display font-light text-white leading-[1.0]"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 8rem)' }}
          >
            Five agents.<br />
            All tiers.<br />
            <span className="text-white/20">No wallet required.</span>
          </p>
        </FadeUp>

        <FadeUp delay={0.22} className="mt-16 flex items-center gap-7 flex-wrap">
          <Link
            href="/dashboard"
            className="font-mono text-[13px] tracking-[0.2em] uppercase bg-white text-black px-8 py-4 hover:bg-white/85 transition-colors"
          >
            Open Dashboard →
          </Link>
          <Link
            href="/graph"
            className="font-mono text-[13px] tracking-[0.2em] uppercase border border-white/15 px-8 py-4 text-white/35 hover:text-white/65 hover:border-white/30 transition-all"
          >
            View Org Graph
          </Link>
        </FadeUp>

        <FadeUp delay={0.32} className="mt-12 flex items-center gap-8 font-mono text-[11px] text-white/20 flex-wrap">
          <span className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400/50 pulse-dot" />
            Trust contract · Arbitrum Sepolia
          </span>
          <span className="text-white/10">·</span>
          <span>5 agents · grades AAA → B</span>
          <span className="text-white/10">·</span>
          <span>No wallet required for demo</span>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className="px-6 lg:px-14 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="4" width="8" height="8" rx="1.5" fill="white" opacity="0.85" />
            <rect x="16" y="4" width="8" height="8" rx="1.5" fill="white" opacity="0.22" />
            <rect x="4" y="16" width="8" height="8" rx="1.5" fill="white" opacity="0.22" />
            <rect x="16" y="16" width="8" height="8" rx="1.5" fill="#4ade80" opacity="0.75" />
          </svg>
          <span className="font-mono text-[11px] text-white/25 tracking-[0.2em] uppercase">
            Anita · AI Worker OS · Arbitrum
          </span>
        </div>
        <div className="flex items-center gap-8 font-mono text-[11px] text-white/20 tracking-[0.15em] uppercase">
          <Link href="/dashboard" className="hover:text-white/45 transition-colors">Dashboard</Link>
          <Link href="/graph"     className="hover:text-white/45 transition-colors">Org Graph</Link>
          <span>Arbitrum Stylus</span>
          <span className="text-white/10">© 2025</span>
        </div>
      </footer>

    </div>
  )
}
