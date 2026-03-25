# Integration Findings & Adjustments: AutoDiscovery realDeal

> **Date:** 2026-03-25
> **Scope:** Code audit of AutoDiscovery realDeal layer against [midnight-doc-manager](https://github.com/Mackenzie-OO7/midnight-doc-manager) (PreProd reference) and [midnight-local-dev](https://github.com/midnightntwrk/midnight-local-dev) (local Docker stack).
> **Related Issue:** [#37 — Reference Implementation for AutoDiscovery Integration](https://github.com/SpyCrypto/AutoDiscovery/issues/37)

---

## 1. Provider Architecture — Current State vs. Reference

AutoDiscovery's current realDeal provider structure (`frontend-realdeal/src/providers/realdeal/`):

| Provider file | Maps to contract | Status |
|---|---|---|
| `real-case.ts` | `discovery-core.compact` | ✅ Reads work (local storage + indexer). Writes are **Phase 2 stubs** |
| `real-document.ts` | `document-registry.compact` | Stub |
| `real-compliance.ts` | `compliance-proof.compact` | Stub |
| `real-access-control.ts` | `access-control.compact` | Stub |
| `real-jurisdiction.ts` | `jurisdiction-registry.compact` | Stub |
| `real-expert-witness.ts` | `expert-witness.compact` | Stub |
| `real-auth.ts` | Lace wallet + DID | ✅ Lace detection works; falls back to dev mode |
| `real-ai.ts` | External AI service | Stub |

**Key finding:** The `real-case.ts` provider currently has the `BlockchainConnection` interface defined but hardcoded to `{ connected: false }`. The actual `deployContract` / `findDeployedContract` / `callTx.*` pipeline is commented out (lines 123–129). This is the **primary integration gap**.

**What midnight-doc-manager does that AutoDiscovery doesn't yet:**

```typescript
// midnight-doc-manager's deployment pipeline (src/deploy.ts):
const compiledContract = CompiledContract.make(CONTRACT_TAG, Contract).pipe(
  CompiledContract.withWitnesses(createWitnesses(secretKeyBytes)),
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);
const deployed = await deployContract(providers, {
  compiledContract,
  privateStateId: PRIVATE_STATE_ID,
  initialPrivateState,
});
// Then: deployed.callTx.registerDocument(...)
```

**Adjustment needed:** AutoDiscovery must replicate this pipeline for each of its 6 contracts, replacing the single `document-manager` contract with the multi-contract suite exported from `autodiscovery-contract/src/index.ts`.

---

## 2. Witness Implementations — ✅ Well-Structured, One Critical Gap

The witness implementations in `autodiscovery-contract/src/witnesses/` are correctly structured and match the `Witnesses<PS>` type signatures:

```typescript
// autodiscovery-contract/src/witnesses/discovery-witnesses.ts (lines 180–184)
export const discoveryCoreWitnesses = {
  computeUniqueCaseIdentifier,
  computeUniqueStepHash,
  getCurrentTimestamp,
};
```

**Comparison with midnight-doc-manager's witness pattern:**

| Aspect | midnight-doc-manager | AutoDiscovery |
|---|---|---|
| Witness return type | `[PS, Uint8Array]` | `[PS, bigint]` ✅ (correct for `Field` type) |
| Private state mutation | Returns `context.privateState` unchanged | Returns updated state with case/step tracking ✅ |
| Hash function | `persistentHash` from `@midnight-ntwrk/compact-runtime` | Custom `deterministicHashToField` (FNV-1a) |

**⚠️ Critical finding:** AutoDiscovery uses a custom FNV-1a hash (`deterministicHashToField`) while midnight-doc-manager uses Midnight's native `persistentHash`. The comment in the code acknowledges this: *"In the future, this can be upgraded to use Midnight's native hash primitive."* Since the circuit trusts the witness output directly (no circuit-side hash re-computation), this works for now but should be migrated to `persistentHash` for production to ensure consistency with on-chain verification.

**The root `witnesses.ts`** (at `autodiscovery-contract/src/witnesses.ts`) is a legacy counter-only stub:

```typescript
// autodiscovery-contract/src/witnesses.ts
export const witnesses = {};
```

This is only used for the `Counter` contract and is separate from the full witness suite in `autodiscovery-contract/src/witnesses/`.

---

## 3. On-Chain Reader — Indexer Connection Works, Ledger Parser Not Linked

The `discovery-core-reader.ts` has the GraphQL indexer wiring completed:

```typescript
// frontend-realdeal/src/providers/realdeal/chain/discovery-core-reader.ts (lines 151–169)
export async function getOnChainCaseStatus(
  onChainCaseIdentifier: string,
): Promise                    {
  // TODO: When contract package is linked as a dependency:
  //   1. Fetch raw state via fetchRawContractState()
  //   2. Parse with: const parsed = ledger(rawState)
  //   3. Check: parsed.caseStatusByCaseIdentifier.member(BigInt('0x' + onChainCaseIdentifier))
  return { exists: false, statusCode: -1, jurisdictionCode: null };
}
```

**What's missing:** The `ledger()` function from the compiled contract package needs to be imported and wired. midnight-doc-manager does this via:

```typescript
const { Contract, ledger, pureCircuits } = await import(contractModulePath);
```

**Adjustment:** Add `@autodiscovery/contract` as a dependency to `frontend-realdeal` and import `DiscoveryCore.ledger` to parse raw indexer state.

---

## 4. Wallet/Provider Configuration Gap

**midnight-doc-manager's `configureProviders`** returns 6 components:

| Component | Package | AutoDiscovery has? |
|---|---|---|
| `privateStateProvider` | `@midnight-ntwrk/midnight-js-level-private-state-provider` | ❌ Not yet |
| `publicDataProvider` | `@midnight-ntwrk/midnight-js-indexer-public-data-provider` | ✅ (via GraphQL in reader) |
| `zkConfigProvider` | `@midnight-ntwrk/midnight-js-node-zk-config-provider` | ❌ Not yet |
| `proofProvider` | `@midnight-ntwrk/midnight-js-http-client-proof-provider` | ❌ Not yet |
| `walletProvider` | Custom `createWalletAndMidnightProvider` | ✅ (Lace detection in `real-auth.ts`) |
| `midnightProvider` | Same as walletProvider | ❌ Not yet |

**Adjustment:** Create an equivalent `configureProviders()` in `frontend-realdeal/src/providers/realdeal/chain/` that assembles all 6 components. For the browser context, the proof server URL and indexer URL come from `VITE_*` env vars (already partially set up).

---

## 5. Local Testing with midnight-local-dev

The [midnight-local-dev](https://github.com/midnightntwrk/midnight-local-dev) Docker stack provides:
- Local Midnight node
- Local indexer + WebSocket endpoint
- Local proof server

**Finding:** This is the correct path for integration testing without spending testnet tDUST. The `.env` should be configured to point to `localhost` endpoints when running locally.

**Recommended `.env.local` additions:**

```env
VITE_INDEXER_URL=http://localhost:8088/api/v1/graphql
VITE_INDEXER_WS=ws://localhost:8088/api/v1/graphql
VITE_PROOF_SERVER_URL=http://localhost:6300
VITE_NODE_URL=http://localhost:9944
```

---

## 6. Key File Inventory

### AutoDiscovery — realDeal Provider Layer

| File | Purpose |
|---|---|
| `frontend-realdeal/src/providers/types.ts` | Master `Providers` interface contract (10 provider interfaces, 507 lines) |
| `frontend-realdeal/src/providers/context.tsx` | React context wiring — always creates `realDeal` providers |
| `frontend-realdeal/src/providers/realdeal/index.ts` | Provider bundle factory (`createRealProviders()`) |
| `frontend-realdeal/src/providers/realdeal/real-case.ts` | Case provider with hybrid off-chain + on-chain architecture |
| `frontend-realdeal/src/providers/realdeal/real-auth.ts` | Lace wallet connection + dev mode fallback |
| `frontend-realdeal/src/providers/realdeal/chain/discovery-core-reader.ts` | GraphQL indexer queries (read-only, no wallet) |
| `frontend-realdeal/src/providers/realdeal/storage/case-storage.ts` | localStorage persistence for case metadata |
| `frontend-realdeal/src/providers/realdeal/storage/adl-storage.ts` | Generic localStorage adapter |

### AutoDiscovery — Contract Layer

| File | Purpose |
|---|---|
| `autodiscovery-contract/src/index.ts` | Barrel exports for 7 compiled contracts + all witnesses |
| `autodiscovery-contract/src/witnesses/index.ts` | Barrel exports for 6 witness implementations |
| `autodiscovery-contract/src/witnesses/discovery-witnesses.ts` | `computeUniqueCaseIdentifier`, `computeUniqueStepHash`, `getCurrentTimestamp` |
| `autodiscovery-contract/src/witnesses/compliance-witnesses.ts` | `computeUniqueAttestationHash`, `getCurrentTimestamp` |
| `autodiscovery-contract/src/witnesses/document-registry-witnesses.ts` | `computeTwinBondHash`, `buildMerkleRootFromDocumentHashes` |
| `autodiscovery-contract/src/witnesses/access-control-witnesses.ts` | `computeSharingEventProofHash`, `getCurrentTimestamp` |
| `autodiscovery-contract/src/witnesses/expert-witness-witnesses.ts` | `computeExpertIdentifierHash` |
| `autodiscovery-contract/src/witnesses/registry-witnesses.ts` | Jurisdiction registry witnesses |

### Reference — midnight-doc-manager (key files studied)

| File | What we learned |
|---|---|
| `src/providers/midnight-providers.ts` | Full 6-component provider assembly pattern |
| `src/deploy.ts` | `CompiledContract.make()` → `deployContract()` pipeline |
| `src/api/contract.ts` | `findDeployedContract()` + `callTx.*` interaction pattern |
| `src/api/witnesses.ts` | `persistentHash` for ownership commitments, `WitnessContext<any, PS>` signatures |

---

## 7. Integration Roadmap (Priority Order)

| # | Task | Blocks |
|---|---|---|
| 1 | Add `@midnight-ntwrk` SDK packages to `frontend-realdeal/package.json` | Everything else |
| 2 | Create `configureProviders()` for browser context | Deployment + callTx |
| 3 | Wire `DiscoveryCore.ledger` import into `discovery-core-reader.ts` | Live reads |
| 4 | Implement `CompiledContract.make()` + `deployContract()` for discovery-core | On-chain writes |
| 5 | Activate `BlockchainConnection` in `real-case.ts` with `callTx.*` | Case creation |
| 6 | Migrate `deterministicHashToField` → `persistentHash` in witnesses | Production readiness |
| 7 | Replicate deploy pipeline for remaining 5 contracts | Full suite |
| 8 | Set up `midnight-local-dev` Docker stack in CI | Automated testing |

---

## References

- **midnight-doc-manager** (PreProd reference dApp): https://github.com/Mackenzie-OO7/midnight-doc-manager
- **midnight-local-dev** (local Docker stack): https://github.com/midnightntwrk/midnight-local-dev
- **AutoDiscovery witnesses**: `autodiscovery-contract/src/witnesses/`
- **AutoDiscovery Compact contracts**: `autodiscovery-contract/src/contracts/`
- **Related issue**: [SpyCrypto/AutoDiscovery#37](https://github.com/SpyCrypto/AutoDiscovery/issues/37)
