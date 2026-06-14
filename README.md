# Anita — AI Worker OS on Arbitrum

> **Arbitrum Open House Hackathon 2025**

Anita is a protocol for managing autonomous AI agents as workforce members. Founders hire agents, assign USDC budgets, and enforce trust-gated autonomy — powered by an Arbitrum Stylus Rust smart contract that computes reputation scores on-chain.

## The core innovation

The trust engine is a **Rust contract deployed on Arbitrum via the Stylus SDK**. It stores per-agent payment counters on-chain and computes a weighted 0–100 score on every read. Any protocol can call `getScore(agentId)` to gate access, price credit, or verify counterparties — trust as a public good.

```
┌─────────────────────────────────────────────────┐
│  Next.js 15 Frontend (TypeScript, Tailwind v4)  │
│  Dashboard · Org Graph · Agent Profiles         │
└──────────────────────┬──────────────────────────┘
                       │ wagmi/viem
              ┌────────▼────────┐
              │  Arbitrum One   │  (Sepolia for testing)
              │  ┌───────────┐  │
              │  │  Stylus   │  │  ← Trust Engine (Rust WASM)
              │  │  Contract │  │
              │  └───────────┘  │
              │  USDC payments  │
              └─────────────────┘
```

## Trust score formula

Four weighted factors, computed deterministically in Rust:

| Factor | Weight | Formula |
|---|---|---|
| Reliability | 40% | `payment_successes / payment_attempts` |
| Discipline | 25% | `1.0 - penalties` (over-limit blocks, guardrail violations) |
| Completion | 20% | `tasks_completed / max(payments, tasks)` |
| Consistency | 15% | `baseline + success_bonus - failure_penalty` |

**Grade scale:** AAA (92+) · AA (84–91) · A (75–83) · BBB (66–74) · BB (55–65) · B (42–54) · C (<42)

**Autonomy tiers:** Supervised (<66) · Trusted (66–83) · Autonomous (84+)

## Running locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Connect a wallet on Arbitrum Sepolia to hire agents and record events on-chain.

## Environment variables

```env
NEXT_PUBLIC_STYLUS_CONTRACT=0x...   # Deployed trust engine (Arbitrum Sepolia)
NEXT_PUBLIC_WC_PROJECT_ID=...       # WalletConnect project ID (optional)
```

## Deploying the Stylus contract

```bash
cd contracts
cargo stylus check                        # verify it compiles to valid WASM
cargo stylus deploy \
  --private-key <your-key> \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc
```

Then set `NEXT_PUBLIC_STYLUS_CONTRACT` to the deployed address. The frontend will automatically show live on-chain scores alongside the client-side preview.

## Project structure

```
app/                  Next.js pages
  page.tsx            Landing
  dashboard/          Agent roster + activity feed
  graph/              D3 force-directed org graph
  agents/[id]/        Agent profile (trust ring, governance, simulate)

lib/
  types.ts            Domain types (Agent, Authorization, AgentEvent)
  reputation.ts       TypeScript trust engine (mirrors Rust contract)
  governance.ts       Autonomy tiers + budget recommendations
  seed.ts             Static params for pre-rendered agent routes
  arbitrum.ts         wagmi config, Stylus ABI, USDC addresses

contracts/
  src/lib.rs          Arbitrum Stylus Rust trust engine
  Cargo.toml

components/
  agents/             UI: trust ring, breakdown, governance, activity feed,
                          create-agent dialog, simulate panel, org graph
  wallet-button.tsx   wagmi connect/disconnect
  web3-providers.tsx  WagmiProvider + QueryClientProvider

hooks/
  use-on-chain-score.ts   useReadContract → Stylus getScore()
```

