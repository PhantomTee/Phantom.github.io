'use client'

import { useReadContract } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { STYLUS_CONTRACT_ADDRESS, TRUST_ENGINE_ABI } from '@/lib/arbitrum'
import { toHex, padHex } from 'viem'

export function useOnChainScore(agentId: string) {
  const agentIdBytes32 = padHex(toHex(agentId), { size: 32 })

  const { data, isLoading, isError } = useReadContract({
    address: STYLUS_CONTRACT_ADDRESS,
    abi: TRUST_ENGINE_ABI,
    functionName: 'getScore',
    args: [agentIdBytes32 as `0x${string}`],
    chainId: arbitrumSepolia.id,
    query: { enabled: !!STYLUS_CONTRACT_ADDRESS },
  })

  if (!STYLUS_CONTRACT_ADDRESS) {
    return { score: null, status: 'no-contract' as const }
  }
  if (isLoading) return { score: null, status: 'loading' as const }
  if (isError || data === undefined) return { score: null, status: 'error' as const }

  // Contract returns score * 1000 (fixed-point), divide to get 0–100
  const score = Number(data) / 1000
  return { score: Math.round(score), status: 'live' as const }
}
