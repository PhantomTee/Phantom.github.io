#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use alloc::vec::Vec;
use stylus_sdk::{
    alloy_primitives::{FixedBytes, U64},
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

const PRECISION: u64 = 1_000;
const BASELINE_FP: u64 = 720;

#[storage]
pub struct AgentCounters {
    payment_successes: StorageU64,
    payment_attempts: StorageU64,
    tasks_completed: StorageU64,
    over_limit_count: StorageU64,
    guardrail_blocks: StorageU64,
    total_spent_fp: StorageU64,
    budget_fp: StorageU64,
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

    pub fn compute_trust(
        &self,
        payment_successes: u64,
        payment_attempts: u64,
        tasks_completed: u64,
        over_limit_count: u64,
        guardrail_blocks: u64,
        budget_utilization: u64,
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

    pub fn record_payment_success(&mut self, agent_id: FixedBytes<32>, amount_fp: u64) -> Result<(), Vec<u8>> {
        let mut c = self.counters.setter(agent_id);
        let prev = c.payment_successes.get().as_limbs()[0];
        c.payment_successes.set(U64::from(prev + 1));
        let prev_att = c.payment_attempts.get().as_limbs()[0];
        c.payment_attempts.set(U64::from(prev_att + 1));
        let prev_spent = c.total_spent_fp.get().as_limbs()[0];
        c.total_spent_fp.set(U64::from(prev_spent + amount_fp));
        self.emit_trust_updated(agent_id)?;
        Ok(())
    }

    pub fn record_payment_failure(&mut self, agent_id: FixedBytes<32>) -> Result<(), Vec<u8>> {
        let mut c = self.counters.setter(agent_id);
        let prev = c.payment_attempts.get().as_limbs()[0];
        c.payment_attempts.set(U64::from(prev + 1));
        self.emit_trust_updated(agent_id)?;
        Ok(())
    }

    pub fn record_task_completed(&mut self, agent_id: FixedBytes<32>) -> Result<(), Vec<u8>> {
        let mut c = self.counters.setter(agent_id);
        let prev = c.tasks_completed.get().as_limbs()[0];
        c.tasks_completed.set(U64::from(prev + 1));
        self.emit_trust_updated(agent_id)?;
        Ok(())
    }

    pub fn record_limit_blocked(&mut self, agent_id: FixedBytes<32>) -> Result<(), Vec<u8>> {
        let mut c = self.counters.setter(agent_id);
        let prev_ol = c.over_limit_count.get().as_limbs()[0];
        c.over_limit_count.set(U64::from(prev_ol + 1));
        let prev_gb = c.guardrail_blocks.get().as_limbs()[0];
        c.guardrail_blocks.set(U64::from(prev_gb + 1));
        self.emit_trust_updated(agent_id)?;
        Ok(())
    }

    pub fn set_budget(&mut self, agent_id: FixedBytes<32>, budget_fp: u64) -> Result<(), Vec<u8>> {
        let mut c = self.counters.setter(agent_id);
        c.budget_fp.set(U64::from(budget_fp));
        Ok(())
    }

    pub fn get_score(&self, agent_id: FixedBytes<32>) -> Result<u64, Vec<u8>> {
        let c = self.counters.getter(agent_id);
        let budget = c.budget_fp.get().as_limbs()[0];
        let spent = c.total_spent_fp.get().as_limbs()[0];
        let utilization = if budget == 0 {
            0u64
        } else {
            (spent.min(budget) * 100) / budget
        };
        Ok(internal_compute(
            c.payment_successes.get().as_limbs()[0],
            c.payment_attempts.get().as_limbs()[0],
            c.tasks_completed.get().as_limbs()[0],
            c.over_limit_count.get().as_limbs()[0],
            c.guardrail_blocks.get().as_limbs()[0],
            utilization,
        ))
    }
}

impl TrustEngine {
    fn emit_trust_updated(&self, agent_id: FixedBytes<32>) -> Result<(), Vec<u8>> {
        let c = self.counters.getter(agent_id);
        let budget = c.budget_fp.get().as_limbs()[0];
        let spent = c.total_spent_fp.get().as_limbs()[0];
        let utilization = if budget == 0 { 0 } else { (spent.min(budget) * 100) / budget };
        let score = internal_compute(
            c.payment_successes.get().as_limbs()[0],
            c.payment_attempts.get().as_limbs()[0],
            c.tasks_completed.get().as_limbs()[0],
            c.over_limit_count.get().as_limbs()[0],
            c.guardrail_blocks.get().as_limbs()[0],
            utilization,
        );
        evm::log(TrustUpdated { agent_id, new_score: score / PRECISION });
        Ok(())
    }
}

fn internal_compute(
    payment_successes: u64,
    payment_attempts: u64,
    tasks_completed: u64,
    over_limit_count: u64,
    guardrail_blocks: u64,
    budget_utilization: u64,
) -> u64 {
    let reliability_fp: u64 = if payment_attempts == 0 {
        BASELINE_FP
    } else {
        (payment_successes * PRECISION) / payment_attempts
    };

    let mut discipline_fp: i64 = PRECISION as i64;
    if budget_utilization > 90 {
        discipline_fp -= (PRECISION as i64) / 4;
    }
    discipline_fp -= (over_limit_count as i64) * ((PRECISION as i64) / 5);
    discipline_fp -= (guardrail_blocks as i64) * ((PRECISION as i64) * 6 / 100);
    let discipline_fp: u64 = (discipline_fp.max(0) as u64).min(PRECISION);

    let denom = payment_successes.max(tasks_completed).max(1);
    let completion_fp: u64 = if payment_attempts == 0 && tasks_completed == 0 {
        BASELINE_FP
    } else {
        (tasks_completed * PRECISION) / denom
    };

    let bonus = (payment_successes * 25).min(280);
    let failures = payment_attempts.saturating_sub(payment_successes);
    let penalty = failures * 80;
    let consistency_fp: u64 = (BASELINE_FP + bonus).saturating_sub(penalty).min(PRECISION);

    (reliability_fp * 40 + discipline_fp * 25 + completion_fp * 20 + consistency_fp * 15) / 100
}
