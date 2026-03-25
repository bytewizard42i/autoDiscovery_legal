# Hello Jay! 👋

Welcome to the **AutoDiscovery.legal (ADL)** repo. John asked me to write you a briefing so you can hit the ground running with your review for Build Club.

**I'm Penny** 🎀 — one of John's AI coding assistants. I run on his ASUS ProArt laptop via Windsurf (Cascade). I've been deeply involved in the architecture, documentation, and cross-pollination analysis across John's entire DIDz ecosystem (26 repos). If you leave me notes or instructions in this repo, John and I will pick them up in our next session. More on that below.

---

## Where ADL Stands Right Now

### What's Done ✅

- **6 smart contracts compiled and deployed to Midnight Preprod** — this is the biggest milestone. All contracts have on-chain addresses and are live on testnet.
- **Complete TypeScript data model** — strongly-typed interfaces for all 6 entities (Case, DiscoveryStep, JurisdictionRulePack, Document, Party, ComplianceAttestation)
- **6-contract architecture designed and documented** — discovery-core, jurisdiction-registry, compliance-proof, document-registry, access-control, expert-witness
- **demoLand frontend fully built** — Dashboard, Case View, Login, Search, Compliance, Settings, Email Safety Protocol, Case Contact Management — all running with mock providers
- **9-step discovery protocol** — 24 universal document categories, Merkle hashing, Twin Protocol for digitized documents
- **Email Safety Protocol** — 4-tier threat levels (SAFE/CAUTION/DANGER/CRITICAL), recipient auto-detection, attachment metadata scanning
- **Comprehensive documentation** — 46 markdown docs covering architecture, pitch, product, discovery automation, jurisdictions, team

### Live Contract Addresses (Preprod)

| Contract | Address |
|----------|---------|
| discovery-core | `c0f0f5c07dff3d2400c1d5c160bf7cfe5fc08bd1aab0eb9862432073f745c79c` |
| jurisdiction-registry | `6e112fe39623e65ba88337ee97f4a35c5454dc836569c73e4c12d743b3bcf9a6` |
| access-control | `5bfe23ec8e05c646c0bd186d7ef3839d0292ade19990315ebca0f4165da0f96c` |
| document-registry | `3fbc2adf2023bd562ff794bc1bd4c53d3ce205f6d2b1320e87d5e115cfccd4be` |
| compliance-proof | `80d58dfc75d8b78138d680420f58613d043d4b6873c336aa8a5dc348eed589b3` |
| expert-witness | `0239e609caf6cc70c841438f03b39f0111cc5f2badda60fb5c72a46e8ef2e7ca` |

---

## What Still Needs Work 🔨

### Priority 1: Contract Fixes (4 Known Issues)

These were discovered during deployment. None prevented deployment, but they'll cause problems when the circuits are actually called:

1. **`jurisdiction-registry` — Missing Constructor** (HIGH)
   - `registryAdministratorPublicKey` is never set because there's no constructor
   - Admin-gated circuits (`registerNewJurisdiction`, `updateJurisdictionRulePack`) will always fail
   - Fix: Add `constructor() { registryAdministratorPublicKey = ownPublicKey(); }`

2. **`document-registry` — `verifyTwinBondIntegrity` doesn't touch ledger** (MEDIUM)
   - Circuit takes `expectedTwinBondHash` as a parameter instead of reading it from ledger
   - Compiler skipped ZK key generation (no ledger interaction), so placeholder keys were used
   - Fix: Read the stored bond hash from the ledger map instead of trusting caller input

3. **`access-control` — `verifyParticipantAccess` missing `disclose()`** (MEDIUM)
   - Return value is derived from ledger lookups but isn't wrapped in `disclose()`
   - Quick one-line fix: `return disclose((documentProtectiveTier != ...) || (requesterRole == ...));`

4. **`access-control` — `proveParticipantHasRole` is a skeleton** (MEDIUM)
   - Currently just `return true;` — needs Merkle proof verification of role membership
   - Significant implementation work including Merkle tree design decisions

**After fixes: recompile with `compact compile +0.29.0` and redeploy.**

### Priority 2: Offline Logic Tests

Set up simulator-based testing for each contract's circuits before wiring to frontend. The Midnight SDK provides local simulation tools — no blockchain needed.

### Priority 3: Wire RealDeal Frontend to Deployed Contracts

The `frontend-realdeal/` needs contract controllers, React hooks, and `.env` with all 6 contract addresses. The `frontend-demoland-vite-react/` stays untouched (mock data for demos).

### Priority 4: Idaho Rule Pack

The first jurisdiction data file (`idaho-ircp.json`) needs to be encoded from Spy's legal expertise. Schema is designed, just needs content.

---

## Key Architecture Decisions to Be Aware Of

- **Pragma**: `>= 0.16 && <= 0.18` (per John's global Midnight rules — avoid compiler 0.26.0 bugs)
  - *Note: Contracts were compiled with 0.29.0 for deployment. This may need reconciliation.*
- **demoLand vs realDeal split**: Two separate frontends. DemoLand uses mock providers, realDeal connects to actual Midnight contracts. Environment flag: `VITE_AD_MODE=demoland|realdeal`
- **Off-chain heavy**: Rule packs stored as JSON locally, hash-anchored on-chain for auditability. Keeps on-chain state minimal.
- **6-entity data model**: Case, DiscoveryStep, JurisdictionRulePack, Document, Party, ComplianceAttestation

---

## Repo Layout Quick Reference

```
AutoDiscovery/
├── frontend-demoland-vite-react/    # Demo frontend (mock data, UI complete)
├── frontend-realdeal/               # Production frontend (needs contract wiring)
├── autodiscovery-contract/          # Smart contracts + TypeScript types
│   ├── src/contracts/*.compact      # The 6 Compact contract source files
│   ├── src/managed/*/               # Compiled output (JS, keys, zkir)
│   └── src/types/                   # Strongly-typed data model
├── autodiscovery-cli/               # CLI tools for deployment
├── docs/                            # 46 documentation files
│   ├── architecture/                # BUILD_PLAN.md, contract partitioning, etc.
│   ├── discovery-automation/        # 9-step protocol deep dives
│   ├── pitch/                       # Pitch deck, investor roadmap, Build Club
│   ├── product/                     # Features, customer analysis, white paper
│   ├── reference/                   # Jurisdiction research
│   └── team/                        # Team info, interaction logs
├── media/                           # Brand assets
└── turbo.json                       # Monorepo config
```

---

## Key Docs to Read First

| Doc | Why |
|-----|-----|
| **[README.md](./README.md)** | Full project overview, problem statement, architecture |
| **[ADL_NEXT_STEPS.md](./docs/ADL_NEXT_STEPS.md)** | Detailed breakdown of the 4 contract issues + what comes next (written for beginner-friendly clarity) |
| **[BUILD_PLAN.md](./docs/architecture/BUILD_PLAN.md)** | Living technical build plan with phase tracking |
| **[GENERAL_ROADMAP.md](./docs/GENERAL_ROADMAP.md)** | High-level product roadmap through Phase 5 |
| **[SMART_CONTRACT_PARTITIONING.md](./docs/architecture/SMART_CONTRACT_PARTITIONING.md)** | Why 6 contracts, what goes where, private vs public vs sealed state |

---

## The Team

- **John** ([@bytewizard42i](https://github.com/bytewizard42i)) — Developer, architect, Midnight ambassador. Building the full DIDz ecosystem (26 repos). Learning developer who's leveled up fast.
- **Spy** ([@SpyCrypto](https://github.com/SpyCrypto)) — Domain expert. 20 years complex litigation paralegal experience. Published stats reports for Idaho government. The reason the legal domain knowledge in this repo is real and accurate.
- **Penny** 🎀 (that's me) — AI coding assistant on John's ASUS ProArt. I handle code, docs, cross-repo analysis, and architecture. I work in Windsurf/Cascade.
- **Cassie** 💜 — Another of John's AI assistants, on his desktop (Chuck). She's also worked on ADL.

---

## How to Leave Feedback

The best way to leave instructions or feedback for John and me:

1. **Create a file** — something like `JAY_FEEDBACK.md` or `JAY_REVIEW_NOTES.md` in the repo root or `docs/team/`. I'll pick it up next session.
2. **Inline comments** — If you see something in a specific file, leave a `// JAY: ...` comment. I'll find them.
3. **GitHub Issues** — Create issues on the repo with labels if you prefer a formal approach.
4. **Edit this file** — Feel free to add a section at the bottom of this file with your notes.

We genuinely want your honest assessment — what's solid, what's shaky, what's missing, what would you prioritize differently. Build Club feedback is gold for us.

---

## The Bigger Picture

ADL is one of 26 repos in John's **DIDzMonolith** ecosystem — all building on Midnight Network for privacy-preserving applications. ADL's unique angle: it's not just another legal tool, it **mathematically proves** discovery compliance using zero-knowledge proofs. Courts can verify compliance without seeing the underlying case data.

The hackathon target is **Midnight Vegas, April 2026**. The core thesis: *"AutoDiscovery doesn't just help you manage discovery — it mathematically proves you did it right."*

The $8.5M single-case sanction for discovery failures is real. The 38,000+ NYC cases dismissed in 2024 for compliance failures is real. This product has a massive, validated market.

---

Thanks for taking the time to review, Jay. We're excited to have a Midnight dev's eyes on this.

— Penny 🎀 *(on behalf of John and the ADL team)*

---

### Jay's Notes (Add your feedback below this line)

<!-- Jay, feel free to write below here. Penny and John will review. -->

