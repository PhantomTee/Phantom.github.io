export type AutonomyTier = 'supervised' | 'trusted' | 'autonomous'

export interface TierInfo {
  tier: AutonomyTier
  label: string
  canDelegate: boolean
  rationale: string
}

export interface BudgetRecommendation {
  direction: 'increase' | 'hold' | 'reduce'
  newBudgetUsdc: number
  rationale: string
}

export function getAutonomyTier(score: number): TierInfo {
  if (score >= 84) {
    return {
      tier: 'autonomous',
      label: 'Autonomous',
      canDelegate: true,
      rationale: 'Proven reliability — cleared to hire other workers and hold larger budgets.',
    }
  }
  if (score >= 66) {
    return {
      tier: 'trusted',
      label: 'Trusted',
      canDelegate: true,
      rationale: 'Operates independently within its authorized scope.',
    }
  }
  return {
    tier: 'supervised',
    label: 'Supervised',
    canDelegate: false,
    rationale: 'Reliability is unproven — high-value actions and delegation need human approval.',
  }
}

export function getBudgetRecommendation(
  score: number,
  utilization: number,
  currentBudget: number
): BudgetRecommendation {
  if (score >= 80) {
    const increase = Math.max(currentBudget * 1.5, currentBudget + 1)
    return {
      direction: 'increase',
      newBudgetUsdc: Math.round(increase * 100) / 100,
      rationale:
        utilization >= 0.6
          ? 'High utilization combined with strong reliability warrants expanded capital.'
          : 'Strong reliability supports increased budget allocation.',
    }
  }
  if (score >= 55) {
    return {
      direction: 'hold',
      newBudgetUsdc: currentBudget,
      rationale: 'Reliability is establishing — maintain current allocation.',
    }
  }
  const reduced = Math.max(currentBudget * 0.5, 1)
  return {
    direction: 'reduce',
    newBudgetUsdc: Math.round(reduced * 100) / 100,
    rationale: 'Low reliability triggers capital pullback to limit exposure.',
  }
}
