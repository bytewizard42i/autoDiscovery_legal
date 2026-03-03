<div align="center">

<img src="../media/autodiscovery-logo.png" alt="AutoDiscovery Logo" width="200" />

# AutoDiscovery.legal (ADL) — General Product Roadmap

### *Build once, comply everywhere.*

**Version:** 1.0  
**Date:** March 3, 2026  
**Authors:** Spy ([@SpyCrypto](https://github.com/SpyCrypto)) · John ([@bytewizard42i](https://github.com/bytewizard42i))

</div>

---

> This is a **living document** — a general, high-level product roadmap for autoDiscovery.legal. Each phase builds on the last, and every phase delivers independently valuable functionality. For the detailed technical build plan, see [`BUILD_PLAN.md`](./architecture/BUILD_PLAN.md).

---

## Table of Contents

1. [Phase 1 — MVP / Hackathon (April 2026)](#phase-1--mvp--hackathon-target-april-2026--midnight-vegas)
2. [Phase 2 — Multi-Jurisdiction Expansion & Contract Completion](#phase-2--multi-jurisdiction-expansion--contract-completion)
3. [Phase 3 — realDeal (Production Blockchain Integration)](#phase-3--realdeal-production-blockchain-integration)
4. [Phase 4 — Production Infrastructure & Revenue](#phase-4--production-infrastructure--revenue)
5. [Phase 5 — Ecosystem & Scale](#phase-5--ecosystem--scale)
6. [Architecture Summary](#-architecture-summary)
7. [Key Metrics That Drive This Roadmap](#-key-metrics-that-drive-this-roadmap)
8. [Related Documents](#-related-documents)

---

## Phase 1 — MVP / Hackathon (Target: April 2026 — Midnight Vegas)

> **Goal:** A fully functional demo that proves the core thesis: *"AutoDiscovery mathematically proves you did discovery right."*

| Milestone | Description | Status |
|-----------|-------------|--------|
| **1.1 Foundation** | Project planning, 6-entity data model, 6-contract architecture, discovery protocol design | ✅ Complete |
| **1.2 TypeScript Data Model** | Strongly-typed interfaces for Case, DiscoveryStep, JurisdictionRulePack, Document, Party, ComplianceAttestation | ✅ Complete |
| **1.3 Pragma & Compiler Resolution** | Resolve Compact compiler version conflicts, test against Midnight SDK | ⬜ Next Up |
| **1.4 Smart Contracts (Core 3)** | `discovery-core`, `jurisdiction-registry`, `compliance-proof` — case lifecycle, rule storage, ZK attestations | ⬜ Next Up |
| **1.5 Idaho Rule Pack (IRCP)** | First jurisdiction — fully encoded procedural rules, deadlines, sanctions, case-type overrides | ⬜ Next Up |
| **1.6 Deadline Engine** | Compute absolute deadlines from rule packs respecting business days, holidays, scheduling overrides | ⬜ Next Up |
| **1.7 demoLand Frontend** | Dashboard, Case View, Login, Search, Compliance, Settings — all wired with mock providers + "Smith v. Acme" demo case | ✅ UI Built |
| **1.8 Email Safety Protocol** | 4-tier threat levels (SAFE/CAUTION/DANGER/CRITICAL), recipient auto-detection, attachment scanning | ✅ UI Built |
| **1.9 Case Contact Management** | Team-based contacts, star precedence, connected-contact glow, drag reorder | ✅ UI Built |
| **1.10 MidnightVitals** | Real-time diagnostic console monitoring wallet, proof server, contracts, network | ✅ v0.3.8 Integrated |
| **1.11 Hackathon Polish** | Scripted 5-min demo flow, pitch deck (13 slides), one-pager, README showcase | 🔨 In Progress |

**Key Deliverable:** Working demoLand app + pitch that demonstrates case creation → jurisdiction detection → rule loading → step generation → deadline tracking → ZK attestation — all without revealing case data.

---

## Phase 2 — Multi-Jurisdiction Expansion & Contract Completion

> **Goal:** Go from "Idaho only" to "build once, comply everywhere" with 6 state jurisdictions + federal baseline.

| Milestone | Description |
|-----------|-------------|
| **2.1 Additional Rule Packs** | Utah (URCP), Washington (CR), California (CCP), New York City (CPLR), Ohio (Civ.R.) |
| **2.2 Federal Baseline (FRCP)** | Foundation rules for removal cases and federal jurisdiction comparisons |
| **2.3 Jurisdiction Comparison UI** | Side-by-side view comparing rules across 2+ jurisdictions (interrogatory limits, response days, deposition caps) |
| **2.4 Workflow Forking** | Automatic rule pack switching when cases are removed to federal court |
| **2.5 Remaining Smart Contracts** | `document-registry` (Merkle trees, Twin Protocol), `access-control` (YubiKey, roles), `expert-witness` (W-9/I-9, qualifications) |
| **2.6 Full Email Safety** | Complete tandem approval workflow with N-of-M configurable approvers |
| **2.7 YubiKey Access Control** | All 3 modes — document-level, action-level gating, role elevation |
| **2.8 Expert Witness Module** | Med-mal expert qualification attestation, HIPAA compliance checks, SOC documentation |

---

## Phase 3 — realDeal (Production Blockchain Integration)

> **Goal:** Same beautiful UI, but now connected to real Midnight Network contracts, real Lace wallet, real ZK proofs.

| Milestone | Description |
|-----------|-------------|
| **3.1 Provider Interface Parity** | Shared TypeScript interfaces (ICaseProvider, IDocumentProvider, IComplianceProvider, IAuthProvider, IAIProvider, ISearchProvider) |
| **3.2 Midnight Providers** | Replace mock providers with real contract calls via compiled Compact contracts + Lace wallet |
| **3.3 Contract Deployment** | Deploy all 6 contracts to Midnight testnet → mainnet |
| **3.4 Environment Switching** | `VITE_AD_MODE=demoland\|realdeal` flag, mode indicator banner, `build:demo` / `build:real` scripts |
| **3.5 AI Metadata Pipeline** | Real AI-assisted document parsing, entity resolution, metadata extraction |
| **3.6 End-to-End Testing** | Full workflow: create case → add steps → complete steps → generate attestation → verify on-chain |
| **3.7 Domain Expert Validation** | Spy validates every Idaho rule, deadline, and exemption with real med-mal scenarios |
| **3.8 Deploy to Production** | Vercel deployment, `autodiscovery.legal` domain, environment variables configured |

---

## Phase 4 — Production Infrastructure & Revenue

> **Goal:** From working product to revenue-generating platform.

| Milestone | Description |
|-----------|-------------|
| **4.1 Full FRCP Integration** | Complete federal rules as the nationwide comparison baseline |
| **4.2 E-Discovery Pipeline** | Electronically stored information (ESI) handling with full metadata pipeline |
| **4.3 Court Integration APIs** | Direct submission pathways for ZK compliance attestations to court systems |
| **4.4 Error Insurance Product** | Legal malpractice insurance integration backed by ZK proof records |
| **4.5 Insurance Underwriting API** | Allow insurers to verify compliance attestations for E&O policy pricing |
| **4.6 All 50 State Rule Packs** | Complete U.S. jurisdictional coverage — every state + DC + territories |
| **4.7 Compliance Report Export** | Court-ready PDFs with verification QR codes, attestation hash lookup, no blockchain jargon |

---

## Phase 5 — Ecosystem & Scale

> **Goal:** From product to protocol — ADL becomes the industry standard for legal discovery compliance.

| Milestone | Description |
|-----------|-------------|
| **5.1 Rule Pack Marketplace** | Third-party jurisdiction contributions — law firms publish & maintain their own rule packs |
| **5.2 Court System Partnerships** | Direct API integrations with court filing systems |
| **5.3 International Expansion** | International jurisdiction modules (UK, Canada, EU) |
| **5.4 Open Protocol Standard** | AutoDiscovery Protocol published as an open specification for the legal industry |
| **5.5 GeoZ Oracle Maturity** | Full privacy-preserving geolocation oracle as standalone Midnight infrastructure |
| **5.6 MidnightVitals Standalone** | Extract as npm package for any Midnight dApp developer to install |

---

## 🏗️ Architecture Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│                        USER'S MACHINE (Local)                        │
│  Raw documents · AI metadata · Search indexes · Encryption keys      │
├──────────────────────────────────────────────────────────────────────┤
│                     PRIVATE LEDGER (Encrypted, On-Chain)              │
│  Document metadata · Party records · Deadlines · Case details        │
├──────────────────────────────────────────────────────────────────────┤
│                   PUBLIC LEDGER (Immutable, On-Chain)                 │
│  Compliance proof hashes · Timestamps · Production Merkle roots      │
├──────────────────────────────────────────────────────────────────────┤
│                    SEALED LEDGER (Write-Once)                        │
│  Commitment schemes · Pre-disclosure freezes                         │
└──────────────────────────────────────────────────────────────────────┘
```

### Smart Contract Suite (6 Contracts)

| Contract | Ledger Layer | Purpose |
|----------|-------------|---------|
| **discovery-core** | Private + Public | Case lifecycle, discovery steps, obligation tracking |
| **jurisdiction-registry** | Private | Modular rule pack storage, jurisdiction ID, version management |
| **compliance-proof** | Public | ZK attestation generation, verification, court-admissible record |
| **document-registry** | Private + Public | Production tracking, Merkle trees, Twin Protocol bonds |
| **access-control** | Private | YubiKey-based auth, role-gated permissions, team access |
| **expert-witness** | Private | W-9/I-9 workflows, qualification attestation, SOC documentation |

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19 · Vite 6 · TypeScript 5 · Tailwind CSS 4 | Glass-morphism UI with jurisdiction comparatives |
| **UI Components** | shadcn/ui · Lucide Icons | Accessible, themeable component library |
| **Smart Contracts** | Compact (Midnight) | Privacy-preserving ZK smart contracts |
| **Blockchain** | Midnight Network | Dual-ledger (public + private) with ZK proofs |
| **Wallet** | Lace Browser Extension | User key management and transaction signing |
| **Build** | Turborepo · npm workspaces | Monorepo orchestration |
| **Hosting** | Vercel / Netlify | Frontend deployment |
| **Hardware Auth** | YubiKey | Hardware-gated access control |
| **Companion Oracle** | GeoZ (GeoZ.us / GeoZ.app) | Privacy-preserving geolocation on Midnight |

---

## 📊 Key Metrics That Drive This Roadmap

These are the real-world numbers that validate *why* autoDiscovery.legal must exist:

| Metric | Value | Significance |
|--------|-------|--------------|
| 💰 **Top single-case sanction** | **$8.5M+** | The cost of getting discovery wrong |
| 📊 **Average sanction** | **$704,094** | Every law firm's nightmare |
| 🏛️ **NYC cases dismissed (2024)** | **38,000+** | Massive market validation |
| ⚖️ **Malpractice claims from missed deadlines** | **28%** | Insurance product opportunity |
| 💸 **Annual discovery litigation costs** | **$30B+/yr** | The addressable market |
| 📉 **NYC conviction rate drop (2024)** | **50% → 25%** | Systemic failure proof |

---

## 🌎 Jurisdiction Rollout Order

| Priority | Jurisdiction | Rules | Phase |
|----------|-------------|-------|-------|
| 🥇 | **Idaho** | IRCP (Idaho Rules of Civil Procedure) | Phase 1 (MVP) |
| 🥈 | **Utah** | URCP (Utah Rules of Civil Procedure) | Phase 2 |
| 🥉 | **Washington** | CR (Civil Rules) | Phase 2 |
| 4️⃣ | **California** | CCP (Code of Civil Procedure) | Phase 2 |
| 5️⃣ | **New York City** | CPLR (Civil Practice Law and Rules) | Phase 2 |
| 6️⃣ | **Ohio** | Civ.R. (Civil Rules) | Phase 2 |
| 🇺🇸 | **Federal** | FRCP (Federal Rules of Civil Procedure) | Phase 2–3 |
| 🗺️ | **All 50 States** | Various | Phase 4 |
| 🌐 | **International** | UK, Canada, EU | Phase 5 |

> Modular jurisdiction rule packs — add new states/federal circuits without code changes.

---

## 📚 Related Documents

| Document | Description |
|----------|-------------|
| **[Build Plan](./architecture/BUILD_PLAN.md)** | Detailed technical build plan with phase tracking |
| **[Project Overview](./product/PROJECT_OVERVIEW.md)** | Executive summary, problem statement, solution |
| **[White Paper](./product/WHITE_PAPER.md)** | Full white paper with market analysis and architecture |
| **[Smart Contract Partitioning](./architecture/SMART_CONTRACT_PARTITIONING.md)** | 6-contract architecture, state mapping |
| **[Discovery Automation](./discovery-automation/README.md)** | 9-step protocol, 24 categories, Merkle hashing |
| **[DemoLand vs RealDeal](./architecture/DEMOLAND_VS_REALDEAL.md)** | Mock vs production architecture split |
| **[Email Safety Protocol](./product/EMAIL_SAFETY_PROTOCOL.md)** | Threat levels, recipient flags, tandem approval |
| **[Jurisdiction Deep Dive](./product/JURISDICTION_DEEP_DIVE.md)** | State-by-state rule analysis |
| **[Customer Analysis Matrix](./product/CUSTOMER_ANALYSIS_MATRIX.md)** | Market research and adoption strategy |
| **[Pitch Deck](./pitch/PITCH_DECK.md)** | 11-slide investor pitch |
| **[Investor & VC Roadmap](./pitch/INVESTOR_VC_ROADMAP.md)** | Market, financials, exit strategy |

---

<div align="center">

### Current Priority: Phase 1 — Midnight Vegas Hackathon, April 2026

*Privacy meets compliance. Built on [Midnight Network](https://midnight.network).*  
**Where every document has a chain of custody, every deadline is tracked,<br>and no one accidentally emails the judge.**

---

<sub>Copyright 2026 AutoDiscovery Team. All rights reserved.</sub>

</div>