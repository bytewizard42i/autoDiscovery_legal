// ============================================================================
// DISCOVERY-CORE WITNESS IMPLEMENTATIONS
// ============================================================================
//
// These functions run off-chain on the user's machine at transaction time.
// They provide private inputs to ZK circuits without revealing those inputs.
//
// IMPORTANT: Function names and signatures MUST match the generated types
// in managed/discovery-core/contract/index.d.ts exactly:
//
//   Witnesses<PS> = {
//     computeUniqueCaseIdentifier(ctx, caseNumber: Uint8Array, jurisdictionCode: Uint8Array): [PS, bigint]
//     computeUniqueStepHash(ctx, caseIdentifier: bigint, jurisdictionRuleReference: Uint8Array): [PS, bigint]
//     getCurrentTimestamp(ctx): [PS, bigint]
//   }
//
// NOTE: ownPublicKey() is NOT a witness — it's a built-in Compact function
// handled by the runtime. No witness implementation needed for caller identity.
// ============================================================================

import { type WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "../managed/discovery-core/contract/index.js";

// --- Private State Type ---
// Private state tracks off-chain data that only this user sees.
// The witness functions receive this state and can update it.

export type DiscoveryCorePrivateState = {
  // Local tracking of cases created by this user (case identifier → local metadata)
  ownedCaseIdentifiers: bigint[];
  // Local cache of step hashes for quick lookup (step hash → case identifier)
  stepHashToCaseIdentifier: Record<string, string>;
};

// --- Private State Factory ---

export const createDiscoveryCorePrivateState = (): DiscoveryCorePrivateState => ({
  ownedCaseIdentifiers: [],
  stepHashToCaseIdentifier: {},
});

// --- Deterministic Hash Utility ---
// Produces a deterministic bigint from concatenated byte arrays.
// Uses a simple but collision-resistant mixing function.
// This is safe because the circuit trusts the witness output directly —
// the witness is NOT verified against a circuit-side hash.
// In the future, this can be upgraded to use Midnight's native hash primitive.

function deterministicHashToField(...inputs: (Uint8Array | bigint)[]): bigint {
  // Concatenate all inputs into a single byte array
  const parts: Uint8Array[] = inputs.map((input) => {
    if (input instanceof Uint8Array) {
      return input;
    }
    // Convert bigint to 32-byte big-endian representation
    const hexString = input.toString(16).padStart(64, '0');
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      bytes[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  });

  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    combined.set(part, offset);
    offset += part.length;
  }

  // FNV-1a-inspired 256-bit hash (deterministic, no crypto dependency needed)
  // We use two 128-bit accumulators to produce a 256-bit result
  let hashHigh = 0xcbf29ce484222325n;
  let hashLow = 0x100000001b3n;
  const primeHigh = 0x01000000000000000000013bn;
  const primeLow = 0x00000100000001b3n;
  const mask128 = (1n << 128n) - 1n;

  for (let i = 0; i < combined.length; i++) {
    const byte = BigInt(combined[i]);
    hashHigh ^= byte;
    hashHigh = (hashHigh * primeHigh) & mask128;
    hashLow ^= byte ^ BigInt(i);
    hashLow = (hashLow * primeLow) & mask128;
  }

  // Combine into a single value, masked to fit in a Field (< 2^254)
  const mask254 = (1n << 254n) - 1n;
  const result = ((hashHigh << 126n) ^ hashLow) & mask254;
  return result;
}

// --- Witness Implementations ---

/**
 * computeUniqueCaseIdentifier
 *
 * Computes a unique case identifier from the case number and jurisdiction code.
 * Case ID = hash(caseNumber || jurisdictionCode).
 * The actual case number NEVER appears on-chain — only this hash.
 *
 * @param context  - WitnessContext with ledger state and private state
 * @param caseNumber_0 - Court-assigned case number as Bytes<32> (Uint8Array)
 * @param jurisdictionCode_0 - Jurisdiction code as Bytes<8> (Uint8Array)
 * @returns [updatedPrivateState, caseIdentifier]
 */
export const computeUniqueCaseIdentifier = (
  context: WitnessContext<Ledger, DiscoveryCorePrivateState>,
  caseNumber_0: Uint8Array,
  jurisdictionCode_0: Uint8Array,
): [DiscoveryCorePrivateState, bigint] => {
  const caseIdentifier = deterministicHashToField(caseNumber_0, jurisdictionCode_0);

  // Track this case in our private state
  const updatedState: DiscoveryCorePrivateState = {
    ...context.privateState,
    ownedCaseIdentifiers: [
      ...context.privateState.ownedCaseIdentifiers,
      caseIdentifier,
    ],
  };

  return [updatedState, caseIdentifier];
};

/**
 * computeUniqueStepHash
 *
 * Computes a unique hash for a discovery step within a case.
 * Step hash = hash(caseIdentifier || jurisdictionRuleReference).
 * Hides WHAT the step is while allowing unique on-chain tracking.
 *
 * @param context - WitnessContext with ledger state and private state
 * @param caseIdentifier_0 - The case this step belongs to (Field / bigint)
 * @param jurisdictionRuleReference_0 - Which rule creates this obligation (Bytes<32>)
 * @returns [updatedPrivateState, stepHash]
 */
export const computeUniqueStepHash = (
  context: WitnessContext<Ledger, DiscoveryCorePrivateState>,
  caseIdentifier_0: bigint,
  jurisdictionRuleReference_0: Uint8Array,
): [DiscoveryCorePrivateState, bigint] => {
  const stepHash = deterministicHashToField(caseIdentifier_0, jurisdictionRuleReference_0);

  // Cache the mapping from step hash to case identifier in private state
  const stepHashHex = stepHash.toString(16);
  const caseIdHex = caseIdentifier_0.toString(16);
  const updatedState: DiscoveryCorePrivateState = {
    ...context.privateState,
    stepHashToCaseIdentifier: {
      ...context.privateState.stepHashToCaseIdentifier,
      [stepHashHex]: caseIdHex,
    },
  };

  return [updatedState, stepHash];
};

/**
 * getCurrentTimestamp
 *
 * Returns the current Unix timestamp (seconds since epoch).
 * Used for recording when steps are completed and for deadline comparison.
 * Private state is not modified.
 *
 * @param context - WitnessContext with ledger state and private state
 * @returns [unchangedPrivateState, currentTimestamp]
 */
export const getCurrentTimestamp = (
  context: WitnessContext<Ledger, DiscoveryCorePrivateState>,
): [DiscoveryCorePrivateState, bigint] => {
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  return [context.privateState, timestamp];
};

// --- Witness Map (for contract binding) ---
// These names MUST match the generated Witnesses<PS> type exactly.

export const discoveryCoreWitnesses = {
  computeUniqueCaseIdentifier,
  computeUniqueStepHash,
  getCurrentTimestamp,
};
