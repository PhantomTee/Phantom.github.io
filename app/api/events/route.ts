import { NextRequest, NextResponse } from 'next/server'
import { sql, DB_ENABLED } from '@/lib/db'
import type { AgentEvent } from '@/lib/types'

export async function POST(req: NextRequest) {
  if (!DB_ENABLED || !sql) return NextResponse.json({ db: false })
  try {
    const { address, event } = await req.json() as { address: string; event: AgentEvent }
    await sql`
      INSERT INTO agent_events (id, agent_id, address, data, created_at)
      VALUES (${event.id}, ${event.agentId}, ${address.toLowerCase()}, ${JSON.stringify(event)}::jsonb, NOW())
      ON CONFLICT (id) DO NOTHING
    `
    return NextResponse.json({ db: true, ok: true })
  } catch (err) {
    console.error('[events POST]', err)
    return NextResponse.json({ db: false }, { status: 500 })
  }
}
