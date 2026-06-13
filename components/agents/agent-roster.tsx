'use client'

import { useAgents } from './agents-provider'
import { AgentCard } from './agent-card'

export function AgentRoster() {
  const { agents, eventsFor } = useAgents()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} events={eventsFor(agent.id)} />
      ))}
    </div>
  )
}
