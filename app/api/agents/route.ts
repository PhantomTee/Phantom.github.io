import { NextRequest, NextResponse } from 'next/server'
import { sql, DB_ENABLED } from '@/lib/db'
import type { Agent, AgentEvent } from '@/lib/types'

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')?.toLowerCase()
  if (!address || !DB_ENABLED || !sql) {
    return NextResponse.json({ db: false, agents: [], events: [] })
  }
  try {
    const [agentRows, eventRows] = await Promise.all([
      sql`SELECT data FROM agents WHERE address = ${address} ORDER BY created_at ASC`,
      sql`SELECT data FROM agent_events WHERE address = ${address} ORDER BY (data->>'at') DESC LIMIT 500`,
    ])
    return NextResponse.json({
      db: true,
      agents: agentRows.map(r => r.data as Agent),
      events: eventRows.map(r => r.data as AgentEvent),
    })
  } catch (err) {
    console.error('[agents GET]', err)
    return NextResponse.json({ db: false, agents: [], events: [] })
  }
}

export async function POST(req: NextRequest) {
  if (!DB_ENABLED || !sql) return NextResponse.json({ db: false })
  try {
    const { address, agent } = await req.json() as { address: string; agent: Agent }
    await sql`
      INSERT INTO agents (id, address, data, created_at)
      VALUES (${agent.id}, ${address.toLowerCase()}, ${JSON.stringify(agent)}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
    `
    return NextResponse.json({ db: true, ok: true })
  } catch (err) {
    console.error('[agents POST]', err)
    return NextResponse.json({ db: false }, { status: 500 })
  }
}
