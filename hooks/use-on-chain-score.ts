'use client'

import { useReadContract } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { keccak256, toBytes } from 'viem'
import { STYLUS_CONTRACT_ADDRESS, TRUST_ENGINE_ABI } from '@/lib/arbitrum'

export function agentIdToBytes32(agentId: string): `0x${string}` {
  return keccak256(toBytes(agentId))
}

export function useOnChainScore(agentId: string) {
  const { data, isLoading, isError } = useReadContract({
    address: STYLUS_CONTRACT_ADDRESS,
    abi: TRUST_ENGINE_ABI,
    functionName: 'getScore',
    args: [agentIdToBytes32(agentId)],
    chainId: arbitrumSepolia.id,
    query: { enabled: !!STYLUS_CONTRACT_ADDRESS, refetchInterval: 10_000 },
  })

  if (!STYLUS_CONTRACT_ADDRESS) return { score: null, status: 'no-contract' as const }
  if (isLoading)                 return { score: null, status: 'loading'     as const }
  if (isError || data == null)   return { score: null, status: 'error'       as const }

  // Contract returns 0–1000 fixed-point; divide by 10 → 0–100
  return { score: Math.round(Number(data) / 10), status: 'live' as const }
}
