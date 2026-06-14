'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

/* ─── FadeUp ──────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Rule() {
  return <div className="border-t border-neutral-100 dark:border-neutral-800 my-0" />
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span style={{ color: '#4169e1' }} className="text-[13px] leading-none select-none">■</span>
      <span className="font-mono text-[12px] tracking-[0.26em] text-neutral-400 uppercase">{text}</span>
    </div>
  )
}

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4'

/* ─── Video ───────────────────────────────────────────────────────── */
function HeroVideo({ className, mobile = false }: { className?: string; mobile?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevXRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (mobile) {
      // Mobile: autoplay + loop
      video.play().catch(() => {})
      return
    }

    // Desktop: pause at frame 0, scrub with mouse only
    video.pause()
    video.currentTime = 0

    function onSeeked() {
      if (!video) return
      video.currentTime = targetTimeRef.current
    }

    function onMouseMove(e: MouseEvent) {
      if (!video) return
      const prev = prevXRef.current
      if (prev === null) { prevXRef.current = e.clientX; return }
      const delta = e.clientX - prev
      prevXRef.current = e.clientX
      const duration = video.duration || 0
      targetTimeRef.current = Math.max(
        0,
        Math.min(duration, targetTimeRef.current + (delta / window.innerWidth) * 0.8 * duration)
      )
      video.currentTime = targetTimeRef.current
    }

    video.addEventListener('seeked', onSeeked)
    window.addEventListener('mousemove', onMouseMove)
    return () => {
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [mobile])

  return (
    <div className={className}>
      <video
        ref={videoRef}
        autoPlay={mobile}
        loop={mobile}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-center"
      >
        <source src={VIDEO_SRC} />
      </video>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="overflow-hidden">

        {/* ── Mobile layout ─────────────────────────────── */}
        <div className="lg:hidden">
          <div className="w-full h-[52vw] min-h-[220px] max-h-[340px] overflow-hidden">
            <HeroVideo className="w-full h-full" mobile />
          </div>
          <div className="px-6 pt-10 pb-16">
            <SectionLabel text="AI Worker OS · Arbitrum Stylus" />
            <h1
              className="font-display font-light text-neutral-900 leading-[0.94] tracking-tight mb-6 select-none"
              style={{ fontSize: 'clamp(4rem, 18vw, 7rem)' }}
            >
              Anita
            </h1>
            <p className="text-[15px] text-neutral-500 leading-relaxed mb-10 max-w-sm">
              Hire AI agents as workforce members. Assign USDC budgets, enforce spend limits, and let on-chain reputation gate their autonomy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="font-mono text-[11px] tracking-[0.22em] uppercase text-neutral-900 border border-neutral-900 px-7 py-4 hover:bg-neutral-900 hover:text-white transition-all duration-200">
                Open Dashboard
              </Link>
              <Link href="/graph" className="font-mono text-[11px] tracking-[0.22em] uppercase text-neutral-400 border border-neutral-200 px-7 py-4 hover:border-neutral-400 transition-all duration-200">
                Org Graph →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Desktop layout ────────────────────────────── */}
        <div className="relative hidden lg:flex min-h-screen items-center">
          <HeroVideo className="absolute inset-y-0 right-0 w-[60%] overflow-hidden pointer-events-none" />
          <div className="relative z-10 w-[40%] px-14 pt-28 pb-20 max-w-2xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <SectionLabel text="AI Worker OS · Arbitrum Stylus" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-light text-neutral-900 leading-[0.94] tracking-tight mb-8 select-none"
              style={{ fontSize: 'clamp(5.5rem, 13vw, 11rem)' }}
            >
              Anita
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-[15px] text-neutral-500 leading-relaxed max-w-md mb-12"
            >
              Hire AI agents as workforce members. Assign USDC budgets, enforce spend limits, and let on-chain reputation gate their autonomy, powered by a Rust contract on Arbitrum Stylus.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/dashboard" className="font-mono text-[11px] tracking-[0.22em] uppercase text-neutral-900 border border-neutral-900 px-8 py-4 hover:bg-neutral-900 hover:text-white transition-all duration-200">
                Open Dashboard
              </Link>
              <Link href="/graph" className="font-mono text-[11px] tracking-[0.22em] uppercase text-neutral-400 border border-neutral-200 px-8 py-4 hover:border-neutral-400 transition-all duration-200">
                Org Graph →
              </Link>
            </motion.div>
          </div>
        </div>

      </section>

      <Rule />

      {/* ══ THE PROBLEM ══════════════════════════════════════════════ */}
      <section className="px-6 lg:px-14 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24">
          <FadeUp>
            <SectionLabel text="The Problem" />
            <h2
              className="font-display font-light text-neutral-900 leading-tight tracking-tight"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
            >
              Autonomous agents<br />have no accountability
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <ul className="space-y-6 pt-2 lg:pt-14">
              {[
                'Agents can overspend with no on-chain guardrails',
                'No portable trust record: every integration starts blind',
                'Quality unverifiable before granting budget access',
                'Agent-to-agent payments have zero fraud accountability',
                'Founders have no visibility into autonomous spend patterns',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="font-mono text-[10px] text-neutral-300 mt-1 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] text-neutral-600 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      <Rule />

      {/* ══ THE GOAL ════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-14 py-24 lg:py-32 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <SectionLabel text="The Goal" />
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2
              className="font-display font-light text-neutral-900 leading-tight tracking-tight max-w-4xl"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
            >
              On-chain reputation that any protocol can read. Trust as a public good.
            </h2>
          </FadeUp>
          <FadeUp delay={0.2} className="mt-10">
            <p className="text-[15px] text-neutral-500 leading-relaxed max-w-2xl">
              The Anita trust engine is a Rust contract on Arbitrum Stylus. It stores per-agent payment counters on-chain and computes a weighted 0–100 score on every read. Any protocol can call <span className="text-neutral-800">getScore(agentId)</span> to gate access, price credit, or verify counterparties.
            </p>
          </FadeUp>
        </div>
      </section>

      <Rule />

      {/* ══ STATS ════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-14 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 border border-neutral-100">
          {[
            { value: '4', label: 'Trust Factors', sub: 'Reliability · Discipline · Completion · Consistency' },
            { value: '3', label: 'Autonomy Tiers', sub: 'Supervised · Trusted · Autonomous' },
            { value: '~10×', label: 'Gas Savings', sub: 'Rust WASM vs equivalent Solidity' },
          ].map((s, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="px-8 py-10 border-b sm:border-b-0 sm:border-r border-neutral-100 last:border-r-0">
                <p className="font-display font-light text-neutral-900 leading-none mb-3"
                   style={{ fontSize: 'clamp(2.8rem, 5vw, 4rem)' }}>
                  {s.value}
                </p>
                <p className="font-mono text-[11px] tracking-[0.18em] text-neutral-500 uppercase mb-2">{s.label}</p>
                <p className="font-mono text-[10px] text-neutral-300 tracking-[0.06em]">{s.sub}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <Rule />

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section className="px-6 lg:px-14 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <SectionLabel text="How It Works" />
            <h2
              className="font-display font-light text-neutral-900 leading-tight tracking-tight mb-16"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
            >
              Four steps to a trusted workforce
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-100 dark:bg-neutral-800">
            {[
              {
                n: '01',
                title: 'Hire',
                body: 'Create an agent with a name, model, and USDC budget. Set a per-transaction cap and an expiry.',
              },
              {
                n: '02',
                title: 'Authorize',
                body: 'Scope spend to specific categories: compute, data APIs, storage, or agent-to-agent services.',
              },
              {
                n: '03',
                title: 'Operate',
                body: 'The agent executes tasks. Every payment, completion, and guardrail block is recorded on Arbitrum.',
              },
              {
                n: '04',
                title: 'Trust',
                body: 'The Stylus contract computes a live 0–100 score. Higher scores unlock larger budgets and delegation rights.',
              },
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="bg-white dark:bg-neutral-950 px-8 py-10 h-full">
                  <p className="font-mono text-[11px] tracking-[0.26em] text-neutral-300 mb-6">{step.n}</p>
                  <p className="font-display font-light text-neutral-900 text-2xl mb-4">{step.title}</p>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Rule />

      {/* ══ THE TRUST ENGINE ════════════════════════════════════════ */}
      <section className="px-6 lg:px-14 py-24 lg:py-32 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <SectionLabel text="The Trust Engine" />
            <h2
              className="font-display font-light text-neutral-900 leading-tight tracking-tight mb-14"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
            >
              Four weighted factors.<br />Computed deterministically in Rust.
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formula */}
            <FadeUp delay={0.1}>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-8 font-mono text-[12px] leading-7 text-neutral-500 dark:text-neutral-400">
                <p className="text-neutral-300 mb-4 text-[10px] tracking-[0.2em] uppercase">trust_score.rs</p>
                <p><span className="text-[#4169e1]">fn</span> <span className="text-neutral-800">compute_score</span>(counters: &amp;Counters) {'{'}  </p>
                <p className="ml-4"><span className="text-[#4169e1]">let</span> reliability  = successes / attempts;</p>
                <p className="ml-4"><span className="text-[#4169e1]">let</span> discipline   = 1.0 - penalties;</p>
                <p className="ml-4"><span className="text-[#4169e1]">let</span> completion   = tasks / max(payments, tasks);</p>
                <p className="ml-4"><span className="text-[#4169e1]">let</span> consistency  = baseline + bonus - penalty;</p>
                <p className="ml-4 mt-2">
                  reliability  <span className="text-neutral-300">* 0.40</span>
                </p>
                <p className="ml-4">
                  + discipline   <span className="text-neutral-300">* 0.25</span>
                </p>
                <p className="ml-4">
                  + completion   <span className="text-neutral-300">* 0.20</span>
                </p>
                <p className="ml-4">
                  + consistency  <span className="text-neutral-300">* 0.15</span>
                </p>
                <p>{'}'}</p>
              </div>
            </FadeUp>

            {/* Weight bars */}
            <FadeUp delay={0.15}>
              <div className="space-y-6">
                {[
                  { label: 'Reliability',  weight: 40, color: '#22d3ee', desc: 'payment_successes / payment_attempts' },
                  { label: 'Discipline',   weight: 25, color: '#818cf8', desc: '1.0 − over_limit_blocks − guardrail_violations' },
                  { label: 'Completion',   weight: 20, color: '#34d399', desc: 'tasks_completed / max(payments, tasks)' },
                  { label: 'Consistency',  weight: 15, color: '#fbbf24', desc: 'baseline + success_bonus − failure_penalty' },
                ].map((f, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-mono text-[11px] text-neutral-400 mb-2">
                      <span>{f.label}</span>
                      <span style={{ color: f.color }}>{f.weight}%</span>
                    </div>
                    <div className="h-1 bg-neutral-100 mb-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.weight * 2.5}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                        className="h-full"
                        style={{ backgroundColor: f.color }}
                      />
                    </div>
                    <p className="font-mono text-[10px] text-neutral-300 tracking-[0.04em]">{f.desc}</p>
                  </div>
                ))}

                {/* Grade scale */}
                <div className="pt-4 border-t border-neutral-100">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-neutral-300 uppercase mb-3">Grade Scale</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { g: 'AAA', t: '92+',   c: '#22d3ee' },
                      { g: 'AA',  t: '84–91', c: '#34d399' },
                      { g: 'A',   t: '75–83', c: '#86efac' },
                      { g: 'BBB', t: '66–74', c: '#fbbf24' },
                      { g: 'BB',  t: '55–65', c: '#fb923c' },
                      { g: 'B',   t: '42–54', c: '#f87171' },
                      { g: 'C',   t: '<42',   c: '#dc2626' },
                    ].map(({ g, t, c }) => (
                      <div key={g} className="font-mono text-[10px] px-2 py-1 border" style={{ borderColor: c + '44', color: c }}>
                        {g} <span className="opacity-50">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <Rule />

      {/* ══ CAPABILITIES ════════════════════════════════════════════ */}
      <section className="px-6 lg:px-14 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <SectionLabel text="Capabilities" />
            <h2
              className="font-display font-light text-neutral-900 leading-tight tracking-tight mb-14"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
            >
              Everything you need to manage<br />an AI workforce
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-neutral-100 dark:bg-neutral-800">
            {[
              { label: 'Hire AI agents as workforce members',      status: 'LIVE' },
              { label: 'On-chain trust scoring via Stylus Rust',   status: 'LIVE' },
              { label: 'USDC budget management + per-tx limits',   status: 'LIVE' },
              { label: 'Spend category authorizations',            status: 'LIVE' },
              { label: 'Agent-to-agent payment tracking',          status: 'LIVE' },
              { label: 'Cross-protocol score via getScore()',       status: 'LIVE' },
              { label: 'D3 force-directed trust org graph',        status: 'LIVE' },
              { label: 'Agent comparison across trust factors',    status: 'LIVE' },
              { label: 'Simulate events before committing',        status: 'LIVE' },
              { label: 'Autonomy tier upgrade notifications',      status: 'LIVE' },
              { label: 'Budget burn rate + runway projection',     status: 'LIVE' },
              { label: 'Multi-agent delegation networks',          status: 'SOON' },
            ].map((c, i) => (
              <FadeUp key={i} delay={(i % 4) * 0.04}>
                <div className="bg-white dark:bg-neutral-950 flex items-center justify-between px-6 py-5 gap-4">
                  <span className="text-[15px] text-neutral-600">{c.label}</span>
                  <span
                    className={`font-mono text-[9px] tracking-[0.18em] flex-shrink-0 px-2 py-0.5 border ${
                      c.status === 'LIVE'
                        ? 'text-green-600 border-green-200 bg-green-50'
                        : 'text-neutral-400 border-neutral-200'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Rule />

      {/* ══ THE WORKFORCE CTA ════════════════════════════════════════ */}
      <section className="px-6 lg:px-14 py-24 lg:py-36 bg-neutral-50">
        <div className="max-w-7xl mx-auto text-center">
          <FadeUp>
            <SectionLabel text="The Workforce" />
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2
              className="font-display font-light text-neutral-900 leading-tight tracking-tight mb-8 mx-auto"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', maxWidth: '16ch' }}
            >
              Your AI workforce awaits
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-[15px] text-neutral-400 mb-12 max-w-lg mx-auto leading-relaxed">
              Connect a wallet on Arbitrum Sepolia to hire agents, assign budgets, and watch trust scores build in real time.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard"
                className="font-mono text-[11px] tracking-[0.22em] uppercase text-neutral-900 border border-neutral-900 px-10 py-5 hover:bg-neutral-900 hover:text-white transition-all duration-200"
              >
                Hire Your First Agent
              </Link>
              <Link
                href="/compare"
                className="font-mono text-[11px] tracking-[0.22em] uppercase text-neutral-400 border border-neutral-200 px-10 py-5 hover:border-neutral-400 transition-all duration-200"
              >
                Compare Agents
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Rule />

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="px-6 lg:px-14 py-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-neutral-900 uppercase mb-1">Anita ✱</p>
            <p className="font-mono text-[10px] text-neutral-300 tracking-[0.1em]">
              Arbitrum Open House Hackathon 2026 · Arbitrum Sepolia
            </p>
          </div>
          <nav className="flex flex-wrap gap-6">
            {[
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/graph',     label: 'Org Graph'  },
              { href: '/compare',   label: 'Compare'    },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-[11px] tracking-[0.14em] text-neutral-400 uppercase hover:text-neutral-700 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>

    </div>
  )
}
