// ============================================================================
// REALDEAL COMPLIANCE PROVIDER → compliance-proof.compact
// ============================================================================
//
// Hybrid provider for compliance attestations — the money feature of ADL.
// ZK proofs that discovery obligations were met, without revealing case details.
//
// Contract circuits (Phase 2 — need wallet):
//   - attestStepLevelCompliance(caseId, stepHash, deadline) → attestationHash
//   - attestPhaseLevelCompliance(caseId, phaseId, total, completed) → attestationHash
//   - attestCaseLevelCompliance(caseId) → attestationHash
//   - verifyAttestationExists(attestationHash) → boolean
// ============================================================================

import type {
  IComplianceProvider,
  ComplianceStatus,
  Attestation,
  ComplianceReport,
  TimelineEntry,
} from '../types';

import {
  getAttestationsByCase,
  addAttestationLocally,
  computeComplianceStatusLocally,
} from './storage/adl-storage';

import { getStepsForCase } from './storage/case-storage';

export class RealComplianceProvider implements IComplianceProvider {

  async getComplianceStatus(caseId: string): Promise<ComplianceStatus> {
    const steps = getStepsForCase(caseId);
    const complete = steps.filter((s) => s.status === 'complete').length;
    const overdue = steps.filter((s) => s.status === 'overdue').length;
    return computeComplianceStatusLocally(caseId, complete, steps.length, overdue);
  }

  async getAttestations(caseId: string): Promise<Attestation[]> {
    return getAttestationsByCase(caseId);
  }

  async generateProof(caseId: string, stepId: string): Promise<Attestation> {
    // Phase 1: Create a local attestation record
    // Phase 2: Call compliance-proof.attestStepLevelCompliance circuit
    // const tx = await deployed.callTx.attestStepLevelCompliance(caseIdBigInt, stepHashBigInt, deadlineBigInt);
    // The circuit returns an attestation hash (Bytes<32>) anchored on-chain

    const now = new Date().toISOString();
    const proofHash = `local-${Date.now().toString(16)}`;

    const attestation = addAttestationLocally({
      caseId,
      stepId,
      type: 'step_completion',
      scope: 'step',
      description: `Step-level compliance attestation for step ${stepId}`,
      proofHash,
      timestamp: now,
      verified: false, // Will be true after on-chain anchoring
    });

    console.info(
      `[RealComplianceProvider] Attestation created locally (${proofHash}). Connect wallet to anchor compliance record on-chain.`,
    );
    return attestation;
  }

  async getComplianceReport(caseId: string): Promise<ComplianceReport> {
    const status = await this.getComplianceStatus(caseId);
    const attestations = await this.getAttestations(caseId);
    const steps = getStepsForCase(caseId);

    // Build timeline from steps and attestations
    const timeline: TimelineEntry[] = steps.map((step) => ({
      date: step.deadline,
      event: step.title,
      type: 'deadline' as const,
      status: step.status === 'complete' ? 'completed' as const : step.status === 'overdue' ? 'missed' as const : 'pending' as const,
    }));

    return {
      caseId,
      generatedAt: new Date().toISOString(),
      status,
      attestations,
      timeline,
    };
  }
}
