import { createConfig, http } from 'wagmi'
import { arbitrum, arbitrumSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const ARBITRUM_USDC = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
export const ARBITRUM_SEPOLIA_USDC = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'

export const STYLUS_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_STYLUS_CONTRACT as `0x${string}` | undefined) ?? undefined

export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia, arbitrum],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? 'demo' }),
  ],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
  ssr: true,
})

export const TRUST_ENGINE_ABI = [
  {
    type: 'function',
    name: 'computeTrust',
    stateMutability: 'view',
    inputs: [
      { name: 'paymentSuccesses', type: 'uint64' },
      { name: 'paymentAttempts', type: 'uint64' },
      { name: 'tasksCompleted', type: 'uint64' },
      { name: 'overLimitCount', type: 'uint64' },
      { name: 'guardrailBlocks', type: 'uint64' },
      { name: 'budgetUtilization', type: 'uint64' },
    ],
    outputs: [{ name: 'score', type: 'uint64' }],
  },
  {
    type: 'function',
    name: 'getScore',
    stateMutability: 'view',
    inputs: [{ name: 'agentId', type: 'bytes32' }],
    outputs: [{ name: 'score', type: 'uint64' }],
  },
  {
    type: 'event',
    name: 'TrustUpdated',
    inputs: [
      { name: 'agentId', type: 'bytes32', indexed: true },
      { name: 'newScore', type: 'uint64', indexed: false },
    ],
  },
] as const
