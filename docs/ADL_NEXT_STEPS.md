# AutoDiscovery.legal — Next Steps

**Last Updated**: February 26, 2026  
**Written for**: John (beginner-friendly, plain English)

---

## Where We Are Right Now

**All 6 ADL smart contracts are compiled and deployed to Midnight Preprod.** This is a huge milestone. Here's what that means in plain English:

- The Compact compiler (version 0.29.0) turned our `.compact` source code into runnable JavaScript + zero-knowledge proof circuits
- We sent those compiled contracts to the Midnight Preprod blockchain (the real test network that works just like production)
- Each contract got a unique address on the blockchain — like a permanent mailing address

Here are the live contract addresses (on Preprod):

| Contract | Address |
|----------|---------|
| discovery-core | `c0f0f5c07dff3d2400c1d5c160bf7cfe5fc08bd1aab0eb9862432073f745c79c` |
| jurisdiction-registry | `6e112fe39623e65ba88337ee97f4a35c5454dc836569c73e4c12d743b3bcf9a6` |
| access-control | `5bfe23ec8e05c646c0bd186d7ef3839d0292ade19990315ebca0f4165da0f96c` |
| document-registry | `3fbc2adf2023bd562ff794bc1bd4c53d3ce205f6d2b1320e87d5e115cfccd4be` |
| compliance-proof | `80d58dfc75d8b78138d680420f58613d043d4b6873c336aa8a5dc348eed589b3` |
| expert-witness | `0239e609caf6cc70c841438f03b39f0111cc5f2badda60fb5c72a46e8ef2e7ca` |

**Wallet seed and full details**: See `preProd-Wallets/wallets/preprod-wallet-lace-seed-1a.md`

---

## What Comes Next (In Order)

There are three big tracks of work ahead. You can think of them like lanes on a highway — some can run in parallel, but they have a natural order.

### Track A: Fix the Contract Issues (4 things to fix, then recompile + redeploy)

During deployment, we discovered that a few circuits have problems. None of them prevented deployment, but they'll cause issues when we actually try to USE the contracts. Think of it like building a house — the walls are up, but a few light switches aren't wired yet.

Here's what needs fixing:

#### A1. `jurisdiction-registry` — Missing Constructor

**What's wrong**: The contract has a variable called `registryAdministratorPublicKey` that's supposed to hold the admin's identity. The comment says "Set during contract deployment (constructor)" — but there is no constructor. That means the admin key is never set, which means nobody can call `registerNewJurisdiction` or `updateJurisdictionRulePack` because those circuits check `assert(callerPublicKey == registryAdministratorPublicKey)` and it will always fail.

**What "constructor" means**: In Compact, a constructor is a special circuit that runs exactly once when the contract is first deployed. It's where you set up initial values. Think of it like the foundation pour — it only happens once.

**The fix**: Add a constructor circuit that sets the admin key to whoever deploys the contract:

```compact
constructor() {
  registryAdministratorPublicKey = ownPublicKey();
}
```

This means: "When this contract is deployed, record the deployer's identity as the admin." After that, only the deployer's wallet can register or update jurisdictions.

**Impact**: High — without this, the jurisdiction-registry contract is non-functional. Must be fixed before any real use.

---

#### A2. `document-registry` — `verifyTwinBondIntegrity` Doesn't Touch the Ledger

**What's wrong**: This circuit takes three parameters (an expected hash and two current hashes), recomputes a bond hash, and returns whether they match. That's it — it never reads from or writes to the blockchain's storage (the "ledger").

**Why that's a problem**: The Compact compiler only generates zero-knowledge proof keys for circuits that interact with the ledger. Since this circuit doesn't, the compiler skipped it. We had to create placeholder (fake) key files just to get the contract to deploy. If someone actually calls this circuit, those fake keys will fail.

**What it should do instead**: Instead of taking the `expectedTwinBondHash` as a parameter (which means the caller provides it — they could lie!), the circuit should LOOK UP the stored bond hash from the ledger. That way:
1. The compiler generates real ZK keys (because there's a ledger read)
2. The integrity check is actually trustworthy (the expected value comes from the chain, not from the caller)

**The fix idea**: Change the circuit to read the stored bond hash from the `twinBondHashByDocumentHash` map (or similar ledger storage), then compare it against the recomputed hash. This is a design change, not just a bug fix — we need to think about which ledger variable stores the bond hash.

**Impact**: Medium — the contract deployed with placeholder keys, but this circuit can't be called safely until fixed.

---

#### A3. `access-control` — `verifyParticipantAccess` Missing `disclose()`

**What's wrong**: The circuit's return statement is:

```compact
return (documentProtectiveTier != (3 as Uint<8>)) || (requesterRole == (3 as Uint<8>));
```

The values `documentProtectiveTier` and `requesterRole` come from ledger lookups that used `disclose()` on their keys. But the **result of the comparison** (the true/false answer) also needs `disclose()` because it's derived from those lookups and is being returned from the circuit.

**What `disclose()` means**: In Midnight's privacy system, values start as "private" (hidden inside the zero-knowledge proof). The `disclose()` function says "make this value public — include it in the proof output so the caller can see it." Without it, the circuit might compile but the return value won't be properly included in the proof.

**The fix**: Wrap the return in `disclose()`:

```compact
return disclose((documentProtectiveTier != (3 as Uint<8>)) || (requesterRole == (3 as Uint<8>)));
```

**Impact**: Medium — the circuit exists and does the right logic, it just needs one function call added.

---

#### A4. `access-control` — `proveParticipantHasRole` Is a Skeleton

**What's wrong**: This circuit currently just `return true;` — it's a placeholder. The comments describe what it SHOULD do (Merkle proof verification of role membership), but none of that is implemented yet.

**What it should do**: 
1. Get the caller's public key using `ownPublicKey()`
2. Hash that key to get a `Bytes<32>` identifier
3. Use a witness function to look up the caller's Merkle path in the role tree
4. Verify the Merkle inclusion proof (proving the caller IS in the tree)
5. Check that the role stored at that leaf matches the claimed role

**Impact**: Medium — this is a core access control function. Without it, anyone can claim any role. But it requires significant implementation work including Merkle tree design decisions.

---

#### After Fixing: Recompile and Redeploy

Once the fixes are made, we'll need to:
1. Run `compact compile +0.29.0` on each changed contract
2. Copy the new compiled outputs to the deployment project
3. Run the deployment script again

The deployment pipeline is already built and proven — we just run it again. The old contract addresses will still exist on Preprod (blockchain is immutable), but we'll use the new addresses going forward.

---

### Track B: Offline Logic Tests (Simulator Pattern)

Before wiring the contracts to the frontend, we should test that they actually WORK correctly. This means calling each circuit and checking the results.

**What "simulator pattern" means**: Instead of testing against the live Preprod blockchain (which is slow, costs tDUST, and requires the proof server), we test using a local simulator. The Midnight SDK includes tools that let you run contract circuits in memory on your own machine — no blockchain needed. It's like a flight simulator vs. actually flying the plane.

#### What to Test

For each contract, we need to verify:

1. **discovery-core**: Can we register a new case? Does the step counter increment? Does `computeUniqueCaseIdentifier` produce consistent hashes?
2. **jurisdiction-registry**: After the constructor fix, can the admin register a jurisdiction? Can a non-admin be rejected? Does the version number increment on update?
3. **access-control**: Can we assign roles? Does protective order enforcement work (sealed docs = judge only)? After the `disclose()` fix, does `verifyParticipantAccess` return the right boolean?
4. **document-registry**: Can we register a document? Does twin bonding work? After the ledger-read fix, does `verifyTwinBondIntegrity` correctly catch tampering?
5. **compliance-proof**: Can we record an attestation? Does the hash chain work?
6. **expert-witness**: Can we register an expert? Does qualification verification work?

#### How to Set Up Tests

We'll create a test file (something like `test-adl-contracts.ts`) that:
- Imports each compiled contract
- Creates a local simulator/test environment
- Calls each circuit with known inputs
- Checks the outputs match what we expect

This is standard software testing — just applied to smart contracts. We'll use the patterns from Midnight's example projects (like the counter example) as a template.

---

### Track C: Wire the RealDeal Frontend to Deployed Contracts

This is the big one — connecting the user interface to the live blockchain contracts.

**Where things stand now**: The RealDeal frontend (`frontend-realdeal/`) already has:
- A Midnight wallet widget (connects to user's Lace wallet)
- Provider wrappers for private state, public data, and ZK config
- A counter SDK example (from the Midnight starter template)

**What needs to happen**: Replace the counter SDK with ADL-specific providers that talk to our 6 deployed contracts. In plain English, this means:

1. **Create an `.env` file** with all 6 contract addresses so the frontend knows where to find them on the blockchain
2. **Build a "contract controller"** for each contract — a TypeScript file that knows how to call that contract's circuits (like `registerNewCase()`, `registerDocument()`, etc.)
3. **Create React hooks** — these are helper functions that make it easy for UI components to call contract functions and display results
4. **Wire up the UI components** — connect buttons, forms, and displays to the contract hooks

Think of it like plumbing:
- The `.env` file is the address book (where are the pipes going?)
- The contract controllers are the pipe connections (how do we talk to each contract?)
- The React hooks are the faucet handles (turn this to get water)
- The UI components are the sinks and showers (what the user actually sees and touches)

**Important**: The DemoLand frontend (`frontend-demoland-vite-react/`) stays untouched. It uses fake/mock data and will always work for demos. The RealDeal is where we wire up real blockchain connections. If RealDeal breaks, we switch to DemoLand for presentations.

---

## Priority Order

| Priority | Task | Why |
|----------|------|-----|
| 1 | Fix jurisdiction-registry constructor (A1) | Contract is non-functional without it |
| 2 | Fix verifyParticipantAccess disclose (A3) | Quick one-line fix |
| 3 | Fix verifyTwinBondIntegrity ledger read (A2) | Removes placeholder hack |
| 4 | Recompile + redeploy fixed contracts | Need correct versions on-chain |
| 5 | Set up offline tests (Track B) | Verify everything works before wiring UI |
| 6 | Create `.env` with contract addresses | Frontend needs to know where contracts live |
| 7 | Build contract controllers + React hooks (Track C) | Core frontend-blockchain connection |
| 8 | Implement proveParticipantHasRole (A4) | Significant work, can wait |
| 9 | Full RealDeal UI wiring | The finish line |

---

## Files You'll Be Working With

| File/Folder | What It Is |
|-------------|-----------|
| `autodiscovery-contract/src/contracts/*.compact` | The smart contract source code (Compact language) |
| `autodiscovery-contract/src/managed/*/` | Compiled contract outputs (JS, keys, zkir) |
| `frontend-realdeal/src/` | The real frontend that will connect to blockchain |
| `frontend-realdeal/src/contracts/` | Where ADL contract controllers will live |
| `frontend-realdeal/src/modules/midnight/` | Midnight wallet + SDK integration |
| `frontend-demoland-vite-react/` | The demo frontend (mock data, DO NOT modify for blockchain) |
| `adl-deployment-test/` (in utils_Midnight) | The deployment script and results |

---

## Glossary (Quick Reference)

| Term | Plain English |
|------|--------------|
| **Circuit** | A function in a smart contract that runs as a zero-knowledge proof |
| **Witness** | A helper function that runs on YOUR computer (not on-chain) to prepare private data for a circuit |
| **Ledger** | The contract's storage on the blockchain (like a database) |
| **`export ledger`** | Public storage — anyone can read it |
| **`ledger`** (without export) | Private storage — only the contract owner can read it |
| **`disclose()`** | "Make this value visible in the proof output" — required when private values need to be seen by the caller |
| **Constructor** | A special circuit that runs once when the contract is first deployed |
| **Preprod** | Midnight's pre-production test network (uses fake money, but works like the real thing) |
| **tDUST** | The gas token on Preprod — you spend tiny amounts of this to deploy and call contracts |
| **Proof server** | A Docker container running on your machine that generates zero-knowledge proofs |
| **Simulator** | A local testing tool that lets you run contract circuits without needing the real blockchain |
| **Provider** | A piece of code that connects a frontend component to a data source (like a contract on the blockchain) |
| **React hook** | A reusable helper function in React that manages state and side effects for a UI component |
