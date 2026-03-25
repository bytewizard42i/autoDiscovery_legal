<div align="center">

# AutoDiscovery.legal

### Present Milestones

**What's in flight right now — meaningful progress exists, completion is pending.**

`As of March 25, 2026`

</div>

---

### Status Key

| Icon | Meaning |
|:----:|---------|
| `DONE` | Just completed (this cycle) |
| `>>>` | Actively in progress |
| `---` | Not yet started |
| `!!!` | Blocked or at risk |

---

## Milestones Documentation

*Spy requested via Discord (Nightforce Bravo, 10:39 AM Mar 25): "Hey can you add your Milestones?"*

| Milestone | Status |
|-----------|:------:|
| Past, present, and future milestones docs created and pushed | `DONE` |

---

## 1. Hackathon Preparation

**Midnight Vegas — Target: April 2026**

| Milestone | Status | Notes |
|-----------|:------:|-------|
| Demo flow scripted | `>>>` | 5-min click path: case creation → jurisdiction detection → rule loading → steps → deadlines → ZK attestation. Story case: *Smith v. Acme Corp* (Idaho med-mal). |
| demoLand frontend polish | `>>>` | All major pages built (dashboard, case view, login, search, compliance, settings, contacts, reference). Wiring and polish ongoing. |
| "What is Midnight?" one-liner | `---` | 10-second explanation needed for non-crypto / legal audiences. |
| Backup demo video | `---` | 30–90s recorded walkthrough as Plan B for live demo failure. |
| 3 dry runs | `---` | End-to-end timed rehearsals on actual demo hardware. |
| Demo Day runbook | `---` | Setup steps + common failure recovery for the demo machine. |

---

## 2. CI/CD Pipeline

| Milestone | Status | Notes |
|-----------|:------:|-------|
| GitHub Actions `test-compile` workflow | `DONE` | PRs #41–#47 merged (Mar 25). Node 22, Compact compiler binary install, artifact upload/download. |
| Compiler install hardening | `DONE` | `-f` flag + better error handling for curl-based install. |
| Test suite execution in CI | `---` | Workflow exists; test execution against compiled contracts needs validation. |

---

## 3. Smart Contract Refinement

| Milestone | Status | Notes |
|-----------|:------:|-------|
| MerkleTree API correction | `DONE` | `proveParticipantHasRole` — correct `checkRoot(merkleTreePathRoot<N,T>(path))` pattern + `Maybe<T>` property access + `disclose()` compliance. |
| `persistentHash` migration | `DONE` | FNV-1a replaced with Midnight's native `persistentHash`. |
| Contract compilation in CI | `>>>` | Workflow merged; validating all 6 contracts compile in GitHub Actions. |
| Contract workflow docs | `DONE` | `COMPLIANCE_PROOF_WORKFLOW.md`, `DISCOVERY_CORE_WORKFLOW.md`, `DOCUMENT_REGISTRY_WORKFLOW.md`, `JURISDICTION_REGISTRY_WORKFLOW.md`. |

---

## 4. realDeal Provider Integration

| Milestone | Status | Notes |
|-----------|:------:|-------|
| Provider interfaces defined | `DONE` | 12 shared TypeScript interfaces in `providers/types.ts`. |
| realDeal provider stubs | `DONE` | All 12 scaffolded in `providers/realdeal/`. |
| Chain reader for discovery-core | `DONE` | `discovery-core-reader.ts` implemented. |
| Wiring to compiled contracts | `>>>` | `INTEGRATION-FINDINGS.md` documents gaps. `REALDEAL_PUNCH_LIST.md` tracks remaining items. Providers currently throw "not yet connected." |
| Wallet connect flow | `>>>` | `MidnightBrowserWallet.connectToWallet(...)` plumbed in but not tested end-to-end on preprod. |

---

## 5. Local Development Environment

| Milestone | Status | Notes |
|-----------|:------:|-------|
| `midnight-local-dev` Docker stack | `DONE` | Reproducible local dev with `wait-for-stack.sh`, standalone/preview YAMLs. |
| Environment templates | `DONE` | `.env_template` files for CLI and frontend. |
| Proof server Docker image | `DONE` | `midnightntwrk/proof-server:7.0.0` — instructions in README. |

---

## 6. Idaho Rule Pack Validation

| Milestone | Status | Notes |
|-----------|:------:|-------|
| IRCP rule encoding | `DONE` | 15 core rules mapped with deadlines, sanctions, exemptions. |
| 7-district court structure | `DONE` | All 7 Idaho judicial districts — county assignments and seat locations. |
| 4th District (Ada County) local rules | `DONE` | Primary target market (Boise) rules mapped. |
| Med-mal statutory requirements | `DONE` | Idaho Code §§ 6-1001–6-1603 and § 5-219(4). |
| **Spy validation pass** | `!!!` | Spy must verify every rule, deadline, and exemption. **Hard gate before launch.** |
| UPL analysis | `>>>` | Safe harbor analysis written. Still needs attorney memo + ISB Ethics Opinion inquiry. |

---

## 7. Build Club Program

| Milestone | Status | Notes |
|-----------|:------:|-------|
| Week 1 — Customer Analysis Matrix | `DONE` | Evidence tags, WTP, assumptions, 15 references. |
| Week 3 — Pitch Deck | `DONE` | 13-slide HTML deck + PDF + 3-min video script. |
| Week 5 — Notes | `DONE` | `WeekFive.md` in `docs/business/`. |
| Demo Day presentation | `---` | Date/time TBD. Confirm submission requirements. |
| Launch Checklist completion | `>>>` | `LAUNCH_CHECKLIST.md` tracks all requirements — most still unchecked. |

---

## Blockers & Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| realDeal providers not connected | Can't demo real blockchain interactions | demoLand for Demo Day + brief realDeal "proof it's real" segment with recorded backup |
| Spy validation not yet done | Idaho rules may have inaccuracies | Schedule dedicated validation session before Demo Day |
| UPL legal memo not obtained | Can't launch commercially | Document safe harbor arguments; obtain attorney memo before commercial use |
| Contracts not deployed to preprod | Compile but no on-chain addresses | Deploy before Demo Day if realDeal demo is planned |
| Lace wallet not end-to-end tested | Wallet connect plumbed but untested on demo machine | Test on actual Demo Day hardware during dry run |

---

## Repository Snapshot

<div align="center">

| | |
|---|---|
| **Branch** `main` | **Latest** `2876585` (Mar 25) |
| **Frontend port** 5173 (Vite) | **Monorepo** Turborepo + npm workspaces |
| **Node** v23+ (CI: v22) | **Compact** v0.29.0 (pragma `>= 0.20`) |

</div>

---

<div align="center">

*AutoDiscovery.legal — Present Milestones*
*John, Spy & Penny — March 2026*

</div>
