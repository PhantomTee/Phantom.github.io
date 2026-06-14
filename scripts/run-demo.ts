#!/usr/bin/env tsx
/**
 * Anita Demo Runner
 * Runs real AI agents via Groq, records every action on Arbitrum Sepolia.
 * Usage: npx tsx scripts/run-demo.ts
 */

import { createWalletClient, createPublicClient, http, keccak256, toBytes } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrumSepolia } from 'viem/chains'
import Groq from 'groq-sdk'
import * as fs from 'fs'

// ─── Load .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const env: Record<string, string> = {}
  try {
    fs.readFileSync('.env.local', 'utf-8')
      .split('\n')
      .filter(l => l.includes('=') && !l.startsWith('#') && l.trim())
      .forEach(l => {
        const [k, ...v] = l.split('=')
        env[k.trim()] = v.join('=').trim()
      })
  } catch { console.error('Could not read .env.local'); process.exit(1) }
  return env
}
const env = loadEnv()

// ─── Config ─────────────────────────────────────────────────────────────────
const CONTRACT = '0x9cbcadd71ed6791dead4a78450df92e187bc4540' as `0x${string}`
const RPC      = 'https://sepolia-rollup.arbitrum.io/rpc'

const ABI = [
  { type: 'function', name: 'setBudget',            stateMutability: 'nonpayable', inputs: [{ name: 'agentId', type: 'bytes32' }, { name: 'budgetFp', type: 'uint64' }], outputs: [] },
  { type: 'function', name: 'recordPaymentSuccess', stateMutability: 'nonpayable', inputs: [{ name: 'agentId', type: 'bytes32' }, { name: 'amountFp', type: 'uint64' }], outputs: [] },
  { type: 'function', name: 'recordPaymentFailure', stateMutability: 'nonpayable', inputs: [{ name: 'agentId', type: 'bytes32' }], outputs: [] },
  { type: 'function', name: 'recordTaskCompleted',  stateMutability: 'nonpayable', inputs: [{ name: 'agentId', type: 'bytes32' }], outputs: [] },
  { type: 'function', name: 'recordLimitBlocked',   stateMutability: 'nonpayable', inputs: [{ name: 'agentId', type: 'bytes32' }], outputs: [] },
] as const

const publicClient = createPublicClient({ chain: arbitrumSepolia, transport: http(RPC) })
const groq = new Groq({ apiKey: env.GROQ_API_KEY })

function bytes32(id: string): `0x${string}` { return keccak256(toBytes(id)) }

function walletClient(pk: `0x${string}`) {
  return createWalletClient({ account: privateKeyToAccount(pk), chain: arbitrumSepolia, transport: http(RPC) })
}

// ─── Agent definitions ───────────────────────────────────────────────────────
const W1 = env.AGENT_WALLET_1 as `0x${string}`
const W2 = env.AGENT_WALLET_2 as `0x${string}`
const W3 = env.AGENT_WALLET_3 as `0x${string}`

const AGENTS = [
  {
    id: 'agent-cipher', name: 'Cipher', walletKey: W1,
    model: 'llama-3.3-70b-versatile', budget: 500,
    task: 'You are an AI research analyst. Write a 3-sentence summary of the biggest challenges in AI agent governance in 2025. Be concise.',
    // Clean record → targets AAA (~93)
    script: [
      ...Array(10).fill({ fn: 'recordPaymentSuccess', amount: 12 }),
      ...Array(5).fill( { fn: 'recordTaskCompleted' }),
    ],
  },
  {
    id: 'agent-nova', name: 'Nova', walletKey: W1,
    model: 'llama-3.1-8b-instant', budget: 200,
    task: 'You are a data processing agent. Analyze this array [42, 17, 88, 55, 31, 73] and return: mean, median, highest, lowest. One line per stat.',
    // Mostly clean, one failure → targets A (~78)
    script: [
      ...Array(8).fill( { fn: 'recordPaymentSuccess', amount: 8 }),
      { fn: 'recordPaymentFailure' },
      ...Array(3).fill( { fn: 'recordTaskCompleted' }),
    ],
  },
  {
    id: 'agent-lyra', name: 'Lyra', walletKey: W2,
    model: 'llama-3.3-70b-versatile', budget: 100,
    task: 'You are a customer support agent. Write a 2-sentence response to: "How does Anita verify that an AI agent can be trusted with money?"',
    // Some failures → targets BBB (~68)
    script: [
      ...Array(5).fill( { fn: 'recordPaymentSuccess', amount: 6 }),
      { fn: 'recordPaymentFailure' },
      { fn: 'recordTaskCompleted' },
    ],
  },
  {
    id: 'agent-orion', name: 'Orion', walletKey: W2,
    model: 'llama-3.1-8b-instant', budget: 75,
    task: 'You are a code review agent. In 2 sentences, explain what this Rust function does: fn compute(successes: u64, attempts: u64) -> u64 { if attempts == 0 { 720 } else { (successes * 1000) / attempts } }',
    // Failure + guardrail block → targets BB (~60)
    script: [
      ...Array(3).fill( { fn: 'recordPaymentSuccess', amount: 5 }),
      { fn: 'recordPaymentFailure' },
      { fn: 'recordLimitBlocked' },
      { fn: 'recordTaskCompleted' },
    ],
  },
  {
    id: 'agent-sage', name: 'Sage', walletKey: W3,
    model: 'llama-3.1-8b-instant', budget: 50,
    task: 'You are a content curation agent. List 3 real companies building AI agent infrastructure in 2025. One per line, name only.',
    // Multiple blocks → targets B (~47)
    script: [
      { fn: 'recordPaymentSuccess', amount: 3 },
      { fn: 'recordPaymentFailure' },
      { fn: 'recordLimitBlocked' },
      { fn: 'recordLimitBlocked' },
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function log(agent: string, msg: string) {
  console.log(`\x1b[36m[${agent}]\x1b[0m ${msg}`)
}

async function send(
  agentName: string,
  wk: `0x${string}`,
  fn: string,
  args: unknown[]
) {
  const client = walletClient(wk)
  log(agentName, `→ ${fn}`)
  const hash = await client.writeContract({
    address: CONTRACT, abi: ABI as any,
    functionName: fn as any, args: args as any,
  })
  await publicClient.waitForTransactionReceipt({ hash })
  log(agentName, `✓ ${fn} confirmed (${hash.slice(0, 10)}…)`)
}

async function callGroq(model: string, prompt: string): Promise<string> {
  const res = await groq.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
  })
  return res.choices[0]?.message?.content?.trim() ?? '(no response)'
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n\x1b[1m🤖 Anita Demo Runner\x1b[0m')
  console.log('Contract:', CONTRACT)
  console.log('Network:  Arbitrum Sepolia\n')

  for (const agent of AGENTS) {
    const id32 = bytes32(agent.id)
    console.log(`\n─── ${agent.name} (${agent.id}) ───`)

    // 1. Set budget on-chain
    await send(agent.name, agent.walletKey, 'setBudget', [id32, BigInt(agent.budget * 100)])

    // 2. Run real AI task
    log(agent.name, `Running task via Groq (${agent.model})…`)
    const result = await callGroq(agent.model, agent.task)
    console.log(`\x1b[33m  AI Output:\x1b[0m ${result}\n`)

    // 3. Execute the agent's on-chain event script
    for (const step of agent.script) {
      if (step.fn === 'recordPaymentSuccess') {
        await send(agent.name, agent.walletKey, 'recordPaymentSuccess', [id32, BigInt((step.amount ?? 10) * 100)])
      } else {
        await send(agent.name, agent.walletKey, step.fn, [id32])
      }
      // Small delay between txs from same wallet
      await new Promise(r => setTimeout(r, 500))
    }

    log(agent.name, '✅ Done\n')
  }

  console.log('\n\x1b[32m✅ All agents populated on-chain!\x1b[0m')
  console.log('View on explorer: https://sepolia.arbiscan.io/address/' + CONTRACT)
  console.log('Open the dashboard to see live scores.\n')
}

main().catch(e => { console.error(e); process.exit(1) })
