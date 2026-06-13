export const SPEND_CATEGORIES = [
  { id: 'data-apis', label: 'Data & APIs', hint: 'External data feeds, oracle calls, RPC access' },
  { id: 'compute', label: 'Compute', hint: 'LLM inference, embedding generation, model calls' },
  { id: 'storage', label: 'Storage', hint: 'IPFS pinning, Arweave uploads, database writes' },
  { id: 'agent-services', label: 'Agent Services', hint: 'Payments to other agents in the network' },
] as const

export type SpendCategory = (typeof SPEND_CATEGORIES)[number]['id']

export type AgentStatus = 'active' | 'paused' | 'expired' | 'revoked'

export type AgentEventKind =
  | 'authorized'
  | 'payment_success'
  | 'payment_failed'
  | 'task_completed'
  | 'limit_blocked'

export interface Authorization {
  budgetUsdc: number
  perTxLimitUsdc: number
  expiresAt: string
  categories: SpendCategory[]
  network: 'arbitrum-one' | 'arbitrum-sepolia'
}

export interface Agent {
  id: string
  name: string
  model: string
  avatarSeed: string
  createdAt: string
  status: AgentStatus
  authorization: Authorization
  onChainScore?: number
}

export interface AgentEvent {
  id: string
  agentId: string
  kind: AgentEventKind
  label: string
  at: string
  amountUsdc?: number
  category?: SpendCategory
  txHash?: string
  counterpartyId?: string
  trustDelta?: number
}

export interface SpendSummary {
  spentUsdc: number
  budgetUsdc: number
  remainingUsdc: number
  utilization: number
}

export type DraftEvent = Omit<AgentEvent, 'id' | 'at'>
