'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { Agent, AgentEvent, DraftEvent } from '@/lib/types'
import { SEED_AGENTS, SEED_EVENTS } from '@/lib/seed'

interface State {
  agents: Agent[]
  events: AgentEvent[]
}

type Action =
  | { type: 'ADD_AGENT'; agent: Agent }
  | { type: 'ADD_EVENT'; event: AgentEvent }
  | { type: 'UPDATE_AGENT'; id: string; patch: Partial<Agent> }
  | { type: 'RESET' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_AGENT':
      return { ...state, agents: [...state.agents, action.agent] }
    case 'ADD_EVENT':
      return { ...state, events: [action.event, ...state.events] }
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map(a =>
          a.id === action.id ? { ...a, ...action.patch } : a
        ),
      }
    case 'RESET':
      return { agents: SEED_AGENTS, events: SEED_EVENTS }
    default:
      return state
  }
}

interface AgentsContextValue {
  agents: Agent[]
  events: AgentEvent[]
  eventsFor: (agentId: string) => AgentEvent[]
  dispatch: React.Dispatch<Action>
  addEvent: (draft: DraftEvent) => void
}

const AgentsContext = createContext<AgentsContextValue | null>(null)

export function AgentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    agents: SEED_AGENTS,
    events: SEED_EVENTS,
  })

  const eventsFor = (agentId: string) =>
    state.events.filter(e => e.agentId === agentId)

  const addEvent = (draft: DraftEvent) => {
    const event: AgentEvent = {
      ...draft,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_EVENT', event })
  }

  return (
    <AgentsContext.Provider value={{ ...state, eventsFor, dispatch, addEvent }}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgents() {
  const ctx = useContext(AgentsContext)
  if (!ctx) throw new Error('useAgents must be used inside AgentsProvider')
  return ctx
}
