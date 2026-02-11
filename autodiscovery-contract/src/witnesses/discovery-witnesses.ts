// ============================================================================
// DISCOVERY-CORE WITNESS IMPLEMENTATIONS
// These functions run off-chain and provide data to the Compact circuits
// at transaction time. They bridge the TypeScript world with the ZK world.
// ============================================================================

import { type WitnessContext } from "@midnight-ntwrk/compact-runtime";

// --- Types ---

export type DiscoveryCorePrivateState = {
  // Local tracking of cases owned by this user
  ownedCaseIds: string[];
  // Local cache of step hashes for quick lookup
  stepHashes: Map<string, string>;
};

// --- Private State Factory ---

export const createDiscoveryCorePrivateState = (): DiscoveryCorePrivateState => ({
  ownedCaseIds: [],
  stepHashes: new Map(),
});

// --- Witness Implementations ---

/**
 * Returns the caller's wallet address.
 * Used for ownership verification in createCase, addStep, completeStep.
 */
export const getCaller = (context: WitnessContext): string => {
  // TODO: Extract caller address from the transaction context
  // This will use context.self or similar Midnight SDK method
  throw new Error("getCaller witness not yet implemented — needs Midnight SDK integration");
};

/**
 * Computes a deterministic case ID from the case number and jurisdiction code.
 * Uses a hash commitment scheme so the case number isn't revealed on-chain.
 */
export const computeCaseId = (
  _context: WitnessContext,
  caseNumber: Uint8Array,
  jurisdiction: Uint8Array
): bigint => {
  // TODO: Implement hash(caseNumber || jurisdiction) using Midnight's hash primitive
  // The result must be deterministic — same inputs always produce same caseId
  throw new Error("computeCaseId witness not yet implemented — needs hash primitive");
};

/**
 * Computes a unique step hash from the case ID and rule reference.
 * Allows step tracking without revealing which rule the step corresponds to.
 */
export const computeStepHash = (
  _context: WitnessContext,
  caseId: bigint,
  ruleRef: Uint8Array
): bigint => {
  // TODO: Implement hash(caseId || ruleRef)
  throw new Error("computeStepHash witness not yet implemented — needs hash primitive");
};

/**
 * Returns the current Unix timestamp.
 * Used for deadline comparison and attestation timestamping.
 */
export const getCurrentTimestamp = (_context: WitnessContext): bigint => {
  return BigInt(Math.floor(Date.now() / 1000));
};

// --- Witness Map (for contract binding) ---

export const discoveryCoreWitnesses = {
  getCaller,
  computeCaseId,
  computeStepHash,
  getCurrentTimestamp,
};
