import { SEED_AGENTS } from '@/lib/seed'
import { AgentPageClient } from './agent-page-client'

export function generateStaticParams() {
  return SEED_AGENTS.map(a => ({ id: a.id }))
}

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AgentPageClient id={id} />
}
