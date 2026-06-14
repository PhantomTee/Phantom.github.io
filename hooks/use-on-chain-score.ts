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

  // Contract returns 0–1000 fixed-point; divide by 10 to get 0–100
  return { score: Math.round(Number(data) / 10), status: 'live' as const }
}
