'use client'

import { useAgents } from './agents-provider'
import { AgentCard } from './agent-card'

export function AgentRoster() {
  const { agents, eventsFor } = useAgents()

  return (
    <div>
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} events={eventsFor(agent.id)} />
      ))}
    </div>
  )
}
