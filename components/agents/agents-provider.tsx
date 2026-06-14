'use client'

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react'
import { useAccount } from 'wagmi'
import type { Agent, AgentEvent, DraftEvent } from '@/lib/types'
import { SEED_AGENTS, SEED_EVENTS } from '@/lib/seed'

interface State {
  agents: Agent[]
  events: AgentEvent[]
}

type Action =
  | { type: 'ADD_AGENT';    agent: Agent }
  | { type: 'ADD_EVENT';    event: AgentEvent }
  | { type: 'UPDATE_AGENT'; id: string; patch: Partial<Agent> }
  | { type: 'LOAD';         agents: Agent[]; events: AgentEvent[] }
  | { type: 'CLEAR' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_AGENT':
      return { ...state, agents: [...state.agents, action.agent] }
    case 'ADD_EVENT':
      return { ...state, events: [action.event, ...state.events] }
    case 'UPDATE_AGENT':
      return { ...state, agents: state.agents.map(a => a.id === action.id ? { ...a, ...action.patch } : a) }
    case 'LOAD':
      return { agents: action.agents, events: action.events }
    case 'CLEAR':
      return { agents: [], events: [] }
    default:
      return state
  }
}

interface AgentsContextValue {
  agents: Agent[]
  events: AgentEvent[]
  isLoaded: boolean
  eventsFor: (agentId: string) => AgentEvent[]
  dispatch: React.Dispatch<Action>
  addEvent: (draft: DraftEvent) => void
}

const AgentsContext = createContext<AgentsContextValue | null>(null)

function storageKey(address: string) {
  return `anita:${address.toLowerCase()}`
}

export function AgentsProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount()
  const [state, dispatch] = useReducer(reducer, { agents: [], events: [] })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage when wallet connects / changes
  useEffect(() => {
    setIsLoaded(false)
    if (!address) {
      // No wallet — load demo data so all pages work without connecting
      dispatch({ type: 'LOAD', agents: SEED_AGENTS, events: SEED_EVENTS })
      setIsLoaded(true)
      return
    }
    try {
      const raw = localStorage.getItem(storageKey(address))
      if (raw) {
        const { agents, events } = JSON.parse(raw) as State
        dispatch({ type: 'LOAD', agents: agents ?? [], events: events ?? [] })
      } else {
        dispatch({ type: 'CLEAR' })
      }
    } catch {
      dispatch({ type: 'CLEAR' })
    }
    setIsLoaded(true)
  }, [address])

  // Persist to localStorage on every state change
  useEffect(() => {
    if (!address) return
    try {
      localStorage.setItem(storageKey(address), JSON.stringify(state))
    } catch {}
  }, [address, state])

  const eventsFor = (agentId: string) => state.events.filter(e => e.agentId === agentId)

  const addEvent = (draft: DraftEvent) => {
    const event: AgentEvent = {
      ...draft,
      id:  `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at:  new Date().toISOString(),
    }
    dispatch({ type: 'ADD_EVENT', event })
  }

  return (
    <AgentsContext.Provider value={{ ...state, isLoaded, eventsFor, dispatch, addEvent }}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgents() {
  const ctx = useContext(AgentsContext)
  if (!ctx) throw new Error('useAgents must be used inside AgentsProvider')
  return ctx
}
