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
  createAgent: (agent: Agent) => void
}

const AgentsContext = createContext<AgentsContextValue | null>(null)

function lsKey(address: string) {
  return `anita:${address.toLowerCase()}`
}

function lsLoad(address: string): State {
  try {
    const raw = localStorage.getItem(lsKey(address))
    if (raw) {
      const { agents, events } = JSON.parse(raw) as State
      return { agents: agents ?? [], events: events ?? [] }
    }
  } catch {}
  return { agents: [], events: [] }
}

function lsSave(address: string, agents: Agent[], events: AgentEvent[]) {
  try {
    localStorage.setItem(lsKey(address), JSON.stringify({ agents, events }))
  } catch {}
}

export function AgentsProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount()
  const [state, dispatch] = useReducer(reducer, { agents: [], events: [] })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from Neon on wallet connect; fall back to localStorage if DB not configured
  useEffect(() => {
    setIsLoaded(false)
    if (!address) {
      dispatch({ type: 'LOAD', agents: SEED_AGENTS, events: SEED_EVENTS })
      setIsLoaded(true)
      return
    }
    fetch(`/api/agents?address=${address}`)
      .then(r => r.json())
      .then(({ db, agents, events }: { db: boolean; agents: Agent[]; events: AgentEvent[] }) => {
        if (db) {
          dispatch({ type: 'LOAD', agents: agents ?? [], events: events ?? [] })
        } else {
          const stored = lsLoad(address)
          dispatch({ type: 'LOAD', agents: stored.agents, events: stored.events })
        }
      })
      .catch(() => {
        const stored = lsLoad(address)
        dispatch({ type: 'LOAD', agents: stored.agents, events: stored.events })
      })
      .finally(() => setIsLoaded(true))
  }, [address])

  const eventsFor = (agentId: string) => state.events.filter(e => e.agentId === agentId)

  const createAgent = (agent: Agent) => {
    dispatch({ type: 'ADD_AGENT', agent })
    if (!address) return
    fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, agent }),
    })
      .then(r => r.json())
      .then(({ db }: { db: boolean }) => {
        if (!db) lsSave(address, [...state.agents, agent], state.events)
      })
      .catch(() => lsSave(address, [...state.agents, agent], state.events))
  }

  const addEvent = (draft: DraftEvent) => {
    const event: AgentEvent = {
      ...draft,
      id:  `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at:  new Date().toISOString(),
    }
    dispatch({ type: 'ADD_EVENT', event })
    if (!address) return
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, event }),
    })
      .then(r => r.json())
      .then(({ db }: { db: boolean }) => {
        if (!db) lsSave(address, state.agents, [event, ...state.events])
      })
      .catch(() => lsSave(address, state.agents, [event, ...state.events]))
  }

  return (
    <AgentsContext.Provider value={{ ...state, isLoaded, eventsFor, dispatch, addEvent, createAgent }}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgents() {
  const ctx = useContext(AgentsContext)
  if (!ctx) throw new Error('useAgents must be used inside AgentsProvider')
  return ctx
}
