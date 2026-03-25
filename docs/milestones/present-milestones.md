# AutoDiscovery.legal — Present Milestones

**Last Updated**: March 25, 2026

> What is actively being worked on **right now**. These are in-flight items where meaningful progress exists but completion is still pending.

---

## Active Workstreams

### 0. Milestones Documentation (Requested by Spy — March 25, 2026)

| Milestone | Status | Notes |
|-----------|--------|-------|
| **Milestones documentation** | Complete | Spy requested via Discord (Nightforce Bravo channel, 10:39 AM): *"Hey can you add your Milestones?"* — Past, present, and future milestones docs created and pushed to both remotes. |

### 1. Hackathon Preparation (Midnight Vegas — Target: April 2026)

| Milestone | Status | Notes |
|-----------|--------|-------|
| **Demo flow scripted** | In Progress | 5-minute click path being finalized — "From case creation to compliance proof." Story case: Smith v. Acme Corp (Idaho med-mal). |
| **demoLand frontend polish** | In Progress | All major pages built (dashboard, case view, login, search, compliance, settings, contacts, reference). Wiring and polish ongoing. |
| **"What is Midnight?" 10-second explanation** | Pending | Needed for non-crypto/legal audiences at Demo Day. |
| **Backup demo video** | Pending | 30–90s recorded walkthrough as Plan B for live demo failure. |
| **3 dry runs** | Pending | End-to-end timed rehearsals required before Demo Day. |
| **Demo Day runbook** | Pending | Setup steps + common failure fixes for the actual demo machine. |

### 2. CI/CD Pipeline

| Milestone | Status | Notes |
|-----------|--------|-------|
| **GitHub Actions `test-compile` workflow** | Just Completed | Merged today (Mar 25) — PRs #41–#47. Node 22, Compact compiler binary installation, artifact upload/download. |
| **Compiler install hardening** | Just Completed | `-f` flag and better error handling for curl-based Compact compiler install. |
| **Test suite execution in CI** | Pending | Workflow exists but test execution against compiled contracts needs validation. |

### 3. Smart Contract Refinement

| Milestone | Status | Notes |
|-----------|--------|-------|
| **MerkleTree API correction** | Just Completed | `proveParticipantHasRole` fixed today — correct `checkRoot(merkleTreePathRoot<N,T>(path))` pattern, `Maybe<T>` property access, `disclose()` compliance. |
| **`persistentHash` migration** | Just Completed | FNV-1a hash functions replaced with Midnight's native `persistentHash`. |
| **Contract compilation in CI** | In Progress | Workflow merged; validating that all 6 contracts compile cleanly in the GitHub Actions environment. |
| **Contract workflow docs** | Complete | `COMPLIANCE_PROOF_WORKFLOW.md`, `DISCOVERY_CORE_WORKFLOW.md`, `DOCUMENT_REGISTRY_WORKFLOW.md`, `JURISDICTION_REGISTRY_WORKFLOW.md` all written. |

### 4. realDeal Provider Integration

| Milestone | Status | Notes |
|-----------|--------|-------|
| **Provider interfaces defined** | Complete | 12 shared TypeScript interfaces in `providers/types.ts`. |
| **realDeal provider stubs** | Complete | All 12 providers scaffolded in `providers/realdeal/`. |
| **Chain reader for discovery-core** | Complete | `discovery-core-reader.ts` implemented. |
| **Wiring realDeal to compiled contracts** | In Progress | `INTEGRATION-FINDINGS.md` documents current gaps. `REALDEAL_PUNCH_LIST.md` tracks remaining items. Providers currently throw "not yet connected" errors. |
| **Wallet connect flow** | Partially Working | `MidnightBrowserWallet.connectToWallet(...)` plumbed in but not end-to-end tested against live preprod. |

### 5. Local Development Environment

| Milestone | Status | Notes |
|-----------|--------|-------|
| **`midnight-local-dev` Docker stack** | Just Completed | Reproducible local dev testing with `scripts/wait-for-stack.sh`, standalone/preview YAML configs. |
| **Environment templates** | Complete | `.env_template` files for both CLI and frontend. |
| **Proof server Docker image** | Documented | `midnightntwrk/proof-server:7.0.0` — instructions in README deployment section. |

### 6. Idaho Rule Pack Validation

| Milestone | Status | Notes |
|-----------|--------|-------|
| **IRCP rule encoding** | Draft Complete | Idaho IRCP rules encoded as structured data. 15 core rules mapped with deadlines, sanctions, exemptions. |
| **7-district court structure** | Documented | All 7 Idaho judicial districts mapped with county assignments and seat locations. |
| **4th District (Ada County) local rules** | Documented | Primary target market rules mapped. |
| **Med-mal statutory requirements** | Documented | Idaho Code §§ 6-1001 through 6-1603 and § 5-219(4) mapped. |
| **Spy validation pass** | Pending | Spy needs to verify every rule, deadline, and exemption against her 20+ years of Idaho litigation experience. This is a **hard gate** before launch. |
| **UPL (Unauthorized Practice of Law) analysis** | Documented, Not Finalized | Safe harbor analysis written. Still needs written memo from Idaho-licensed attorney and ISB Ethics Opinion inquiry. |

### 7. Build Club Program

| Milestone | Status | Notes |
|-----------|--------|-------|
| **Week 1 — Customer Analysis Matrix** | Complete | Submitted with evidence tags, WTP, assumptions, 15 references. |
| **Week 3 — Pitch Deck** | Complete | 13-slide HTML deck + PDF + 3-min video script. |
| **Week 5 — Notes** | Complete | `WeekFive.md` in `docs/business/`. |
| **Demo Day presentation** | Pending | Date/time TBD. Need to confirm submission requirements. |
| **Launch Checklist completion** | In Progress | `LAUNCH_CHECKLIST.md` tracks all Demo Day requirements — most items still unchecked. |

---

## Known Blockers & Risks

| Issue | Impact | Mitigation |
|-------|--------|------------|
| **realDeal providers not yet connected** | Cannot demo real blockchain interactions | Use demoLand for Demo Day; show realDeal as brief "proof it's real" segment with recorded backup |
| **Spy validation not yet done** | Idaho rules may contain inaccuracies | Schedule dedicated validation session with Spy before Demo Day |
| **UPL legal memo not obtained** | Cannot launch commercially without UPL clearance | Document safe harbor arguments; obtain attorney memo before any commercial use |
| **Contract deployment to preprod** | Contracts compile but haven't been deployed + addresses recorded | Deploy before Demo Day if realDeal demo is planned |
| **Lace wallet end-to-end test** | Wallet connect plumbed but not tested on demo machine | Test on actual Demo Day hardware during dry run |

---

## Current Repository Stats

| Metric | Value |
|--------|-------|
| **Primary branch** | `main` |
| **Latest commit** | `dfafd9b` (Mar 25, 2026) — MerkleTree API + Maybe syntax fix |
| **Open PRs (upstream)** | Active Copilot agent PRs being merged by Spy |
| **Frontend port (demoLand)** | 5173 (Vite default) |
| **Monorepo manager** | Turborepo + npm workspaces |
| **Node requirement** | v23+ (CI uses v22) |
| **Compact compiler** | v0.29.0 (pragma `>= 0.20`) |

---

*AutoDiscovery.legal — Present Milestones — John, Spy & Penny (March 2026)*
