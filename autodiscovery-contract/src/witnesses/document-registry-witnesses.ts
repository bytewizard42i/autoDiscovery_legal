// ============================================================================
// DOCUMENT-REGISTRY WITNESS IMPLEMENTATIONS
// ============================================================================
//
// Off-chain computation for the document registry contract.
// Handles document hash binding, twin bond verification, and Merkle roots.
//
// IMPORTANT: Function names and signatures MUST match the generated types
// in managed/document-registry/contract/index.d.ts exactly:
//
//   Witnesses<PS> = {
//     computeTwinBondHash(ctx, imageTwinHash: Uint8Array,
//       digitalTwinHash: Uint8Array): [PS, Uint8Array]
//     buildMerkleRootFromDocumentHashes(ctx,
//       documentHashCollection: bigint): [PS, Uint8Array]
//     getCurrentTimestamp(ctx): [PS, bigint]
//   }
// ============================================================================

import { type WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "../managed/document-registry/contract/index.js";

// --- Private State Type ---

export type DocumentRegistryPrivateState = {
  // Local cache of document hashes registered by this user
  registeredDocumentHashes: string[];
  // Twin bond mappings (image hash → digital hash)
  twinBondMappings: Record<string, string>;
};

// --- Private State Factory ---

export const createDocumentRegistryPrivateState = (): DocumentRegistryPrivateState => ({
  registeredDocumentHashes: [],
  twinBondMappings: {},
});

// --- Hash Utilities ---

/** Convert a Uint8Array to a hex string */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Deterministic hash: two Uint8Arrays → one 32-byte Uint8Array.
 * Used for twin bond hash and Merkle root computation.
 */
function deterministicHashBytes(...inputs: Uint8Array[]): Uint8Array {
  const totalLength = inputs.reduce((sum, a) => sum + a.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const input of inputs) {
    combined.set(input, offset);
    offset += input.length;
  }

  const result = new Uint8Array(32);
  let hashHigh = 0xcbf29ce484222325n;
  let hashLow = 0x100000001b3n;
  const prime = 0x01000000000000000000013bn;
  const mask64 = (1n << 64n) - 1n;

  for (let i = 0; i < combined.length; i++) {
    hashHigh ^= BigInt(combined[i]);
    hashHigh = (hashHigh * prime) & mask64;
    hashLow ^= BigInt(combined[i]) ^ BigInt(i);
    hashLow = (hashLow * prime) & mask64;
  }

  for (let i = 0; i < 8; i++) {
    result[i] = Number((hashHigh >> BigInt(i * 8)) & 0xffn);
    result[i + 8] = Number((hashLow >> BigInt(i * 8)) & 0xffn);
    result[i + 16] = Number(((hashHigh ^ hashLow) >> BigInt(i * 8)) & 0xffn);
    result[i + 24] = Number(((hashHigh + hashLow) >> BigInt(i * 8)) & 0xffn);
  }

  return result;
}

/**
 * Convert a bigint to a 32-byte Uint8Array (big-endian).
 */
function bigintToBytes32(value: bigint): Uint8Array {
  const hexString = value.toString(16).padStart(64, '0');
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// --- Witness Implementations ---

/**
 * computeTwinBondHash
 *
 * Computes a binding hash that links an image-twin (physical scan) to its
 * digital-twin (electronic document). The bond proves they represent the
 * same document without revealing either hash individually.
 *
 * @param context - WitnessContext with ledger and private state
 * @param imageTwinHash_0 - Hash of the scanned physical document (Bytes<32>)
 * @param digitalTwinHash_0 - Hash of the electronic document (Bytes<32>)
 * @returns [updatedPrivateState, twinBondHash as Bytes<32>]
 */
export const computeTwinBondHash = (
  context: WitnessContext<Ledger, DocumentRegistryPrivateState>,
  imageTwinHash_0: Uint8Array,
  digitalTwinHash_0: Uint8Array,
): [DocumentRegistryPrivateState, Uint8Array] => {
  const bondHash = deterministicHashBytes(imageTwinHash_0, digitalTwinHash_0);

  // Track the twin bond mapping in private state
  const updatedState: DocumentRegistryPrivateState = {
    ...context.privateState,
    twinBondMappings: {
      ...context.privateState.twinBondMappings,
      [bytesToHex(imageTwinHash_0)]: bytesToHex(digitalTwinHash_0),
    },
  };

  return [updatedState, bondHash];
};

/**
 * buildMerkleRootFromDocumentHashes
 *
 * Computes a Merkle root from a collection of document hashes.
 * The collection identifier (bigint) references an off-chain list of
 * document hashes. This witness retrieves or derives the root from them.
 *
 * For MVP, we produce a deterministic hash from the collection ID.
 * In production, this would look up the actual document hashes from
 * the off-chain storage and compute a proper Merkle tree root.
 *
 * @param context - WitnessContext with ledger and private state
 * @param documentHashCollection_0 - Identifier for the collection (Field / bigint)
 * @returns [unchangedPrivateState, merkleRoot as Bytes<32>]
 */
export const buildMerkleRootFromDocumentHashes = (
  context: WitnessContext<Ledger, DocumentRegistryPrivateState>,
  documentHashCollection_0: bigint,
): [DocumentRegistryPrivateState, Uint8Array] => {
  // Convert collection ID to bytes, then hash it to produce a root
  // In production: look up actual document hashes and compute real Merkle tree
  const collectionBytes = bigintToBytes32(documentHashCollection_0);
  const merkleRoot = deterministicHashBytes(collectionBytes);

  return [context.privateState, merkleRoot];
};

/**
 * getCurrentTimestamp
 *
 * Returns the current Unix timestamp (seconds since epoch).
 * Used for custody transfer recording and document registration timestamps.
 *
 * @returns [unchangedPrivateState, currentTimestamp]
 */
export const getCurrentTimestamp = (
  context: WitnessContext<Ledger, DocumentRegistryPrivateState>,
): [DocumentRegistryPrivateState, bigint] => {
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  return [context.privateState, timestamp];
};

// --- Witness Map (for contract binding) ---
// Names MUST match generated Witnesses<PS> type exactly.

export const documentRegistryWitnesses = {
  computeTwinBondHash,
  buildMerkleRootFromDocumentHashes,
  getCurrentTimestamp,
};
