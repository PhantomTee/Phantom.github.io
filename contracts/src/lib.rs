//! Arbiter Trust Engine — Arbitrum Stylus smart contract
//!
//! Deterministic on-chain trust scoring for autonomous AI agents.
//! Mirrors the TypeScript reputation.ts logic so scores are identical
//! whether computed client-side (preview) or on-chain (authoritative).
//!
//! Four weighted factors:
//!   Reliability  40%  — payment settlement rate
//!   Discipline   25%  — budget compliance
//!   Completion   20%  — work output vs payments
//!   Consistency  15%  — track-record strength
//!
//! Deploy to Arbitrum Sepolia for testing; Arbitrum One for production.

#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use alloc::vec::Vec;
use stylus_sdk::{
    alloy_primitives::{FixedBytes, U256},
    alloy_sol_types::sol,
    evm, msg,
    prelude::*,
    storage::{StorageMap, StorageU64},
};

sol! {
    event TrustUpdated(bytes32 indexed agent_id, uint64 new_score);
    event AgentRecorded(bytes32 indexed agent_id, address indexed recorder);
    error Unauthorized();
    error InvalidInput();
}

/// Fixed-point precision: scores are stored as score * 1000 to retain 3 decimal places.
const PRECISION: u64 = 1_000;
const BASELINE_FP: u64 = 720; // 0.720 * PRECISION

/// Per-agent counters stored on-chain.
#[storage]
pub struct AgentCounters {
    payment_successes: StorageU64,
    payment_attempts: StorageU64,
    tasks_completed: StorageU64,
    over_limit_count: StorageU64,
    guardrail_blocks: StorageU64,
    total_spent_fp: StorageU64,  // spent * PRECISION
    budget_fp: StorageU64,       // budget * PRECISION
}

#[storage]
#[entrypoint]
pub struct TrustEngine {
    owner: stylus_sdk::storage::StorageAddress,
    counters: StorageMap<FixedBytes<32>, AgentCounters>,
}

#[public]
impl TrustEngine {
    pub fn initialize(&mut self) -> Result<(), Vec<u8>> {
        self.owner.set(msg::sender());
        Ok(())
    }

    /// Pure view: compute trust score from raw counters (no state read).
    /// Returns score * PRECISION (e.g. 93000 means score 93.000).
    pub fn compute_trust(
        &self,
        payment_successes: u64,
        payment_attempts: u64,
        tasks_completed: u64,
        over_limit_count: u64,
        guardrail_blocks: u64,
        budget_utilization: u64, // 0–100 representing 0%–100%
    ) -> Result<u64, Vec<u8>> {
        Ok(internal_compute(
            payment_successes,
            payment_attempts,
            tasks_completed,
            over_limit_count,
            guardrail_blocks,
            budget_utilization,
        ))
    }

    /// Record events for an agent and emit TrustUpdated.
    pub fn record_payment_success(&mut self, agent_id: FixedBytes<32>, amount_fp: u64) -> Result<(), Vec<u8>> {
        let mut c = self.counters.setter(agent_id);
        let prev = c.payment_successes.get();
        c.payment_successes.set(prev + 1);
        let prev_att = c.payment_attempts.get();
        c.payment_attempts.set(prev_att + 1);
        let prev_spent = c.total_spent_fp.get();
        c.total_spent_fp.set(prev_spent + amount_fp);
        self.emit_trust_updated(agent_id)?;
        Ok(())
    }

    pub fn record_payment_failure(&mut self, agent_id: FixedBytes<32>) -> Result<(), Vec<u8>> {
        let mut c = self.counters.setter(agent_id);
        let prev = c.payment_attempts.get();
        c.payment_attempts.set(prev + 1);
        self.emit_trust_updated(agent_id)?;
        Ok(())
    }

    pub fn record_task_completed(&mut self, agent_id: FixedBytes<32>) -> Result<(), Vec<u8>> {
        let mut c = self.counters.setter(agent_id);
        let prev = c.tasks_completed.get();
        c.tasks_completed.set(prev + 1);
        self.emit_trust_updated(agent_id)?;
        Ok(())
    }

    pub fn record_limit_blocked(&mut self, agent_id: FixedBytes<32>) -> Result<(), Vec<u8>> {
        let mut c = self.counters.setter(agent_id);
        let prev_ol = c.over_limit_count.get();
        c.over_limit_count.set(prev_ol + 1);
        let prev_gb = c.guardrail_blocks.get();
        c.guardrail_blocks.set(prev_gb + 1);
        self.emit_trust_updated(agent_id)?;
        Ok(())
    }

    pub fn set_budget(&mut self, agent_id: FixedBytes<32>, budget_fp: u64) -> Result<(), Vec<u8>> {
        let mut c = self.counters.setter(agent_id);
        c.budget_fp.set(budget_fp);
        Ok(())
    }

    /// Read current on-chain trust score for an agent.
    pub fn get_score(&self, agent_id: FixedBytes<32>) -> Result<u64, Vec<u8>> {
        let c = self.counters.getter(agent_id);
        let budget = c.budget_fp.get();
        let spent = c.total_spent_fp.get();
        let utilization = if budget == 0 {
            0u64
        } else {
            (spent.min(budget) * 100) / budget
        };
        Ok(internal_compute(
            c.payment_successes.get(),
            c.payment_attempts.get(),
            c.tasks_completed.get(),
            c.over_limit_count.get(),
            c.guardrail_blocks.get(),
            utilization,
        ))
    }
}

impl TrustEngine {
    fn emit_trust_updated(&self, agent_id: FixedBytes<32>) -> Result<(), Vec<u8>> {
        let c = self.counters.getter(agent_id);
        let budget = c.budget_fp.get();
        let spent = c.total_spent_fp.get();
        let utilization = if budget == 0 { 0 } else { (spent.min(budget) * 100) / budget };
        let score = internal_compute(
            c.payment_successes.get(),
            c.payment_attempts.get(),
            c.tasks_completed.get(),
            c.over_limit_count.get(),
            c.guardrail_blocks.get(),
            utilization,
        );
        // score / PRECISION gives integer part for the event
        evm::log(TrustUpdated { agent_id, new_score: score / PRECISION });
        Ok(())
    }
}

/// Core trust computation — pure function, no state access.
///
/// All factors normalized 0–1000 (fixed-point * PRECISION).
/// Weights: reliability 40%, discipline 25%, completion 20%, consistency 15%.
fn internal_compute(
    payment_successes: u64,
    payment_attempts: u64,
    tasks_completed: u64,
    over_limit_count: u64,
    guardrail_blocks: u64,
    budget_utilization: u64, // 0–100
) -> u64 {
    // Reliability factor (0–1000)
    let reliability_fp: u64 = if payment_attempts == 0 {
        BASELINE_FP
    } else {
        (payment_successes * PRECISION) / payment_attempts
    };

    // Discipline factor — start at 1.0, subtract penalties
    let mut discipline_fp: i64 = PRECISION as i64;
    if budget_utilization > 90 {
        discipline_fp -= (PRECISION as i64) / 4; // -0.25
    }
    discipline_fp -= (over_limit_count as i64) * ((PRECISION as i64) / 5); // -0.2 per block
    discipline_fp -= (guardrail_blocks as i64) * ((PRECISION as i64) * 6 / 100); // -0.06 per block
    let discipline_fp: u64 = (discipline_fp.max(0) as u64).min(PRECISION);

    // Completion factor (0–1000)
    let denom = payment_successes.max(tasks_completed).max(1);
    let completion_fp: u64 = if payment_attempts == 0 && tasks_completed == 0 {
        BASELINE_FP
    } else {
        (tasks_completed * PRECISION) / denom
    };

    // Consistency factor — baseline + bonuses - penalties
    let bonus = (payment_successes * 25).min(280); // 0.025 per success, cap 0.28
    let failures = payment_attempts.saturating_sub(payment_successes);
    let penalty = failures * 80; // 0.08 per failure
    let consistency_fp: u64 = (BASELINE_FP + bonus).saturating_sub(penalty).min(PRECISION);

    // Weighted blend: 40/25/20/15
    let raw_fp = (reliability_fp * 40
        + discipline_fp * 25
        + completion_fp * 20
        + consistency_fp * 15)
        / 100;

    // Round to nearest integer score (0–100), keep extra PRECISION factor
    // Return raw_fp so callers can divide by PRECISION to get 0–100 score
    raw_fp
}
