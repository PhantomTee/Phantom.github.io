import Link from 'next/link'

/* ── Partner logos (text-based svg marks) ─────────────────────── */
const PARTNERS = ['Privy', 'Ethereum', 'Base', 'USDC', '#ARBtrum', 'Filecoin', 'Framer']

/* ── Stats ──────────────────────────────────────────────────────── */
const STATS = [
  { value: '97%', label: 'Task Completion Rate', sub: 'Across all active agents' },
  { value: '88%', label: 'Budget Compliance', sub: 'Guardrails enforced on-chain' },
  { value: '3x', label: 'Faster Deployment', sub: 'vs. manually managed workflows' },
]

/* ── Features ───────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75a2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    title: 'Context Memory',
    desc: 'Agents retain full conversation context and prior decision history across every session.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: 'Toolchain Mastery',
    desc: 'Native integration with on-chain tools, APIs, and external services — no wrapper glue needed.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
    title: 'Synthetic Control',
    desc: 'Governance rails enforce spending limits, category scopes, and trust-gated autonomy tiers.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
    title: 'Dynamic APIs',
    desc: 'Agents discover and call new API endpoints at runtime. No hardcoded integrations.',
  },
]

/* ── Capability rows ────────────────────────────────────────────── */
const CAPABILITIES = [
  { label: 'Multi-step reasoning', active: true },
  { label: 'Long-horizon planning', active: true },
  { label: 'Autonomous payments', active: true },
  { label: 'Self-correcting loops', active: true },
  { label: 'Cross-agent delegation', active: false },
  { label: 'On-chain trust scoring', active: false },
]

/* ── Demo prompts ───────────────────────────────────────────────── */
const DEMO_ITEMS = [
  'Research competitor pricing and file a report',
  'Negotiate API rate limits with the vendor agent',
  'Summarize last 30 days of on-chain activity',
  'Spin up a sub-agent for data collection',
]

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 overflow-hidden">
        {/* Green glow orb */}
        <div
          className="pointer-events-none absolute right-0 top-0 w-[55%] h-full"
          style={{
            background: 'radial-gradient(ellipse 60% 70% at 75% 40%, #052e1644 0%, #0a0a0a00 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute right-[5%] top-[8%] w-[380px] h-[480px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse 80% 90% at 50% 40%, #15803d55 0%, #14532d22 40%, transparent 70%)',
            filter: 'blur(1px)',
          }}
        />
        {/* Abstract face-like shape inside glow */}
        <div
          className="pointer-events-none absolute right-[8%] top-[12%] w-[320px] h-[420px]"
          style={{
            background: 'radial-gradient(ellipse 55% 65% at 50% 45%, #166534aa 0%, #15803d44 30%, transparent 65%)',
            borderRadius: '45% 55% 60% 40% / 40% 50% 50% 60%',
            filter: 'blur(8px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-[58%]">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-500 uppercase tracking-widest">
                Arbitrum Open House Hackathon 2025
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-black leading-[1.0] tracking-tight text-white mb-6 uppercase">
              BUILD AGENTS<br />
              THAT THINK LIKE<br />
              <span className="text-green-400">HUMANS</span>
            </h1>

            {/* Sub */}
            <p className="text-gray-400 text-lg max-w-lg leading-relaxed mb-10">
              The technology framework behind human-like AI cognition. Hire agents,
              assign USDC budgets, and enforce on-chain trust — powered by Arbitrum Stylus.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-black font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
              >
                Get started
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
            </div>
          </div>

          {/* Partner logos strip */}
          <div className="mt-20 pt-8 border-t border-white/5">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-5">Powered by</p>
            <div className="flex items-center gap-8 flex-wrap">
              {PARTNERS.map(p => (
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
            {STATS.map(s => (
              <div key={s.value} className="flex flex-col gap-2">
                <span className="text-[clamp(2.5rem,5vw,3.5rem)] font-black text-green-400 leading-none">
                  {s.value}
                </span>
                <span className="text-white font-semibold text-lg">{s.label}</span>
                <span className="text-gray-500 text-sm">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Capabilities</p>
              <h2 className="text-3xl font-bold text-white">Designed to grow<br />and adapt</h2>
            </div>
            <Link href="/dashboard" className="hidden md:inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              See all agents
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/5 bg-[#111111] hover:border-white/10 hover:bg-[#141414] p-6 transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-green-400 group-hover:bg-green-400/10 transition-all mb-5">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────────────────── */}
      <section id="manifesto" className="border-t border-white/5 py-28 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[clamp(1.5rem,3.5vw,2.4rem)] font-bold leading-[1.3] text-white">
            We&rsquo;re not building flashy demos. We&rsquo;re<br className="hidden lg:block" />
            engineering agents that think like humans,<br className="hidden lg:block" />
            and work better with them.
          </p>
        </div>
      </section>

      {/* ── CAPABILITIES SPLIT ───────────────────────────────────── */}
      <section className="border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">What they can do</p>
              <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                Boosting your team&rsquo;s capabilities<br />beyond human limits
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Anita agents don&rsquo;t just execute tasks — they plan, adapt, spend
                on-chain, and escalate with context. Every action is auditable on Arbitrum.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors"
              >
                Deploy your first agent
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Right — capability checklist */}
            <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 space-y-1">
              {CAPABILITIES.map((c, i) => (
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
                <p className="pl-4"><span className="text-gray-600">// reliability · discipline · completion · consistency</span></p>
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
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">Core Innovation</p>
              <h2 className="text-3xl font-bold text-white mb-5">
                Trust computed in Rust<br />on Arbitrum Stylus
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                The reputation engine is a Rust smart contract compiled to WASM via the Stylus SDK.
                Compute-heavy trust math runs at ~10× lower gas than equivalent Solidity.
                Any protocol can call <code className="text-green-400 text-sm">getScore(agentId)</code> to
                gate access or price credit.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'Deterministic — same events, same score',
                  'Auditable — full on-chain event log',
                  'Composable — callable by any dApp',
                  '~10x cheaper gas via Stylus WASM',
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
            <h2 className="text-3xl font-bold text-white">Test the mind of our AI agent</h2>
            <p className="text-gray-500 mt-3 text-sm">
              Try asking Anita to complete a task — no wallet required in demo mode.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden">
              {/* Prompt suggestions */}
              <div className="p-4 border-b border-white/5">
                <p className="text-xs text-gray-600 mb-3">Suggested tasks</p>
                <div className="flex flex-col gap-2">
                  {DEMO_ITEMS.map(item => (
                    <div
                      key={item}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors group"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400/40 group-hover:bg-green-400 transition-colors" />
                      <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Input bar */}
              <div className="flex items-center gap-3 p-4">
                <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-600">
                  Ask Anita to do something...
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
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Trust verified · Arbitrum Stylus
              </span>
              <span>·</span>
              <span>No wallet required for demo</span>
              <span>·</span>
              <span>5 agents seeded</span>
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
                <p className="text-xs text-gray-600">AI That Understands, Acts, Learns</p>
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
