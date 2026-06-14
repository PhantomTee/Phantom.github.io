'use client'

import { useEffect, useRef } from 'react'
import { computeTrust, gradeColor } from '@/lib/reputation'
import { useAgents } from './agents-provider'
import { SEED_DELEGATIONS } from '@/lib/seed'
import type { Agent } from '@/lib/types'

interface Node {
  id: string
  name: string
  score: number
  grade: string
  x: number
  y: number
  vx: number
  vy: number
}

interface Edge {
  from: string
  to: string
}

export function TrustGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { agents, eventsFor } = useAgents()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const maybeCtx = canvas.getContext('2d')
    if (!maybeCtx) return
    const ctx: CanvasRenderingContext2D = maybeCtx

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const nodeMap = new Map<string, Node>()
    agents.forEach((agent: Agent, i: number) => {
      const trust = computeTrust(eventsFor(agent.id))
      const angle = (i / agents.length) * 2 * Math.PI
      nodeMap.set(agent.id, {
        id: agent.id,
        name: agent.name,
        score: trust.score,
        grade: trust.grade,
        x: W / 2 + Math.cos(angle) * (W * 0.3),
        y: H / 2 + Math.sin(angle) * (H * 0.3),
        vx: 0,
        vy: 0,
      })
    })

    const nodes = Array.from(nodeMap.values())
    const edges: Edge[] = SEED_DELEGATIONS

    let frame = 0
    const REPULSION = 3000
    const ATTRACTION = 0.01
    const DAMPING = 0.85
    const IDEAL_LENGTH = 150

    function simulate() {
      nodes.forEach(n => {
        n.vx *= DAMPING
        n.vy *= DAMPING
        // Center gravity
        n.vx += (W / 2 - n.x) * 0.003
        n.vy += (H / 2 - n.y) * 0.003
      })

      // Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = REPULSION / (dist * dist)
          nodes[i].vx -= (dx / dist) * force
          nodes[i].vy -= (dy / dist) * force
          nodes[j].vx += (dx / dist) * force
          nodes[j].vy += (dy / dist) * force
        }
      }

      // Attraction along edges
      edges.forEach(e => {
        const a = nodeMap.get(e.from)
        const b = nodeMap.get(e.to)
        if (!a || !b) return
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = (dist - IDEAL_LENGTH) * ATTRACTION
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        a.vx += fx; a.vy += fy
        b.vx -= fx; b.vy -= fy
      })

      nodes.forEach(n => {
        n.x = Math.max(50, Math.min(W - 50, n.x + n.vx))
        n.y = Math.max(50, Math.min(H - 50, n.y + n.vy))
      })
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // Edges
      edges.forEach(e => {
        const a = nodeMap.get(e.from)
        const b = nodeMap.get(e.to)
        if (!a || !b) return
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = 'rgba(65,105,225,0.28)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Arrow
        const angle = Math.atan2(b.y - a.y, b.x - a.x)
        const tip = { x: b.x - Math.cos(angle) * 22, y: b.y - Math.sin(angle) * 22 }
        ctx.beginPath()
        ctx.moveTo(tip.x, tip.y)
        ctx.lineTo(tip.x - Math.cos(angle - 0.4) * 8, tip.y - Math.sin(angle - 0.4) * 8)
        ctx.lineTo(tip.x - Math.cos(angle + 0.4) * 8, tip.y - Math.sin(angle + 0.4) * 8)
        ctx.closePath()
        ctx.fillStyle = 'rgba(65,105,225,0.55)'
        ctx.fill()
      })

      // Nodes
      nodes.forEach(n => {
        const color = gradeColor(n.grade)
        const r = 20

        // Glow
        const grd = ctx.createRadialGradient(n.x, n.y, r * 0.5, n.x, n.y, r * 2)
        grd.addColorStop(0, color + '44')
        grd.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 2, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Circle
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = '#030a12'
        ctx.fill()
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Score
        ctx.fillStyle = 'rgba(255,255,255,0.80)'
        ctx.font = '11px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(n.score), n.x, n.y)

        // Name
        ctx.fillStyle = 'rgba(255,255,255,0.30)'
        ctx.font = '10px monospace'
        ctx.fillText(n.name, n.x, n.y + r + 14)
      })
    }

    let animId: number
    function loop() {
      if (frame < 120) simulate()
      draw()
      frame++
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [agents, eventsFor])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  )
}
