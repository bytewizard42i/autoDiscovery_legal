// ============================================================================
// EXPERT-WITNESS WITNESS IMPLEMENTATIONS
// ============================================================================
//
// Off-chain computation for the expert witness registry contract.
// Computes identifier hashes from expert credential data.
//
// IMPORTANT: Function names and signatures MUST match the generated types
// in managed/expert-witness/contract/index.d.ts exactly:
//
//   Witnesses<PS> = {
//     computeExpertIdentifierHash(ctx, expertCredentialData: bigint): [PS, Uint8Array]
//   }
// ============================================================================

import { type WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "../managed/expert-witness/contract/index.js";

// --- Private State Type ---

export type ExpertWitnessPrivateState = {
  // Local cache of expert identifier hashes registered by this user (hex strings)
  registeredExpertHashes: string[];
};

// --- Private State Factory ---

export const createExpertWitnessPrivateState = (): ExpertWitnessPrivateState => ({
  registeredExpertHashes: [],
});

// --- Witness Implementations ---

/**
 * computeExpertIdentifierHash
 *
 * Computes a unique identifier hash from an expert's credential data.
 * The credential data (bigint) encodes the expert's qualifications.
 * The resulting hash is stored on-chain so courts can verify an expert
 * is registered without revealing their actual credentials.
 *
 * @param context - WitnessContext with ledger and private state
 * @param expertCredentialData_0 - Encoded credential data (Field / bigint)
 * @returns [updatedPrivateState, expertIdentifierHash as Bytes<32>]
 */
export const computeExpertIdentifierHash = (
  context: WitnessContext<Ledger, ExpertWitnessPrivateState>,
  expertCredentialData_0: bigint,
): [ExpertWitnessPrivateState, Uint8Array] => {
  // Convert credential data to bytes and hash it
  const hexString = expertCredentialData_0.toString(16).padStart(64, '0');
  const credentialBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    credentialBytes[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
  }

  // FNV-1a-inspired hash to produce 32 output bytes
  const result = new Uint8Array(32);
  let hashHigh = 0xcbf29ce484222325n;
  let hashLow = 0x100000001b3n;
  const prime = 0x01000000000000000000013bn;
  const mask64 = (1n << 64n) - 1n;

  for (let i = 0; i < credentialBytes.length; i++) {
    hashHigh ^= BigInt(credentialBytes[i]);
    hashHigh = (hashHigh * prime) & mask64;
    hashLow ^= BigInt(credentialBytes[i]) ^ BigInt(i);
    hashLow = (hashLow * prime) & mask64;
  }

  for (let i = 0; i < 8; i++) {
    result[i] = Number((hashHigh >> BigInt(i * 8)) & 0xffn);
    result[i + 8] = Number((hashLow >> BigInt(i * 8)) & 0xffn);
    result[i + 16] = Number(((hashHigh ^ hashLow) >> BigInt(i * 8)) & 0xffn);
    result[i + 24] = Number(((hashHigh + hashLow) >> BigInt(i * 8)) & 0xffn);
  }

  // Track in private state
  const hashHex = Array.from(result)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const updatedState: ExpertWitnessPrivateState = {
    ...context.privateState,
    registeredExpertHashes: [
      ...context.privateState.registeredExpertHashes,
      hashHex,
    ],
  };

  return [updatedState, result];
};

// --- Witness Map (for contract binding) ---
// Names MUST match generated Witnesses<PS> type exactly.

export const expertWitnessWitnesses = {
  computeExpertIdentifierHash,
};
