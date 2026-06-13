import type { AgentEvent } from './types'

export interface TrustFactors {
  reliability: number
  discipline: number
  completion: number
  consistency: number
}

export interface TrustScore {
  score: number
  grade: string
  factors: TrustFactors
  confidence: 'high' | 'medium' | 'low'
}

const WEIGHTS = {
  reliability: 0.40,
  discipline: 0.25,
  completion: 0.20,
  consistency: 0.15,
}

const BASELINE = 0.72

export function computeTrust(events: AgentEvent[]): TrustScore {
  const paymentAttempts = events.filter(
    e => e.kind === 'payment_success' || e.kind === 'payment_failed'
  ).length
  const paymentSuccesses = events.filter(e => e.kind === 'payment_success').length
  const tasksCompleted = events.filter(e => e.kind === 'task_completed').length
  const overLimitCount = events.filter(e => e.kind === 'limit_blocked').length
  const guardrailBlocks = overLimitCount

  const totalSpent = events
    .filter(e => e.kind === 'payment_success')
    .reduce((sum, e) => sum + (e.amountUsdc ?? 0), 0)

  const reliability = paymentAttempts === 0 ? BASELINE : paymentSuccesses / paymentAttempts

  let discipline = 1.0
  const utilization = totalSpent > 0 ? Math.min(totalSpent / Math.max(totalSpent, 1), 1) : 0
  if (utilization > 0.9) discipline -= 0.25
  discipline -= overLimitCount * 0.2
  discipline -= guardrailBlocks * 0.06
  discipline = Math.max(0, Math.min(1, discipline))

  const completion =
    paymentAttempts === 0 && tasksCompleted === 0
      ? BASELINE
      : tasksCompleted / Math.max(paymentSuccesses, tasksCompleted, 1)

  const successBonus = Math.min(paymentSuccesses * 0.025, 0.28)
  const failurePenalty = (paymentAttempts - paymentSuccesses) * 0.08
  const consistency = Math.max(0, Math.min(1, BASELINE + successBonus - failurePenalty))

  const raw =
    reliability * WEIGHTS.reliability +
    discipline * WEIGHTS.discipline +
    completion * WEIGHTS.completion +
    consistency * WEIGHTS.consistency

  const score = Math.round(raw * 100)

  return {
    score,
    grade: scoreToGrade(score),
    factors: { reliability, discipline, completion, consistency },
    confidence:
      paymentSuccesses >= 12 ? 'high' : paymentSuccesses >= 4 ? 'medium' : 'low',
  }
}

export function scoreToGrade(score: number): string {
  if (score >= 92) return 'AAA'
  if (score >= 84) return 'AA'
  if (score >= 75) return 'A'
  if (score >= 66) return 'BBB'
  if (score >= 55) return 'BB'
  if (score >= 42) return 'B'
  return 'C'
}

export function gradeColor(grade: string): string {
  switch (grade) {
    case 'AAA': return '#22d3ee'
    case 'AA': return '#34d399'
    case 'A': return '#86efac'
    case 'BBB': return '#fbbf24'
    case 'BB': return '#fb923c'
    case 'B': return '#f87171'
    default: return '#dc2626'
  }
}
