# AutoDiscovery (AD) — Deep Dive Brief for External Review

> **Purpose**: This document provides full context on the AutoDiscovery project so that other AI assistants, collaborators, or reviewers can offer alternative architectural ideas, UX refinements, and smart contract design feedback. Nothing here is final — challenge everything.

---

## What Is AutoDiscovery?

AutoDiscovery is a **privacy-preserving legal discovery automation platform** built on the **Midnight blockchain**. It targets the pre-trial discovery process in civil litigation — the phase where opposing parties exchange evidence before trial.

**One-liner**: *"GeoOracle Auto Compliance: build once, comply everywhere."*

**The core innovation**: A GeoOracle (geographic oracle) detects the jurisdiction of a case and automatically loads the correct procedural rules — eliminating the #1 source of discovery non-compliance.

---

## The Problem

Legal discovery is governed by **different rules in every jurisdiction**:

- Federal courts → FRCP (Federal Rules of Civil Procedure)
- Idaho → IRCP
- Utah → URCP (tiered discovery system — unique)
- Washington → CR
- New York → CPLR (Commercial Division has its own overlay)
- California → CCP (broadest disclosure requirements)

**Consequences of getting it wrong**:
- Evidence suppression
- Case dismissal
- Sanctions against attorneys ($$$)
- Malpractice liability
- Forced retrials

**Current workflow is entirely manual**: attorneys and paralegals look up rules, track deadlines in spreadsheets, and hope they haven't missed a jurisdiction-specific requirement. No existing tool combines jurisdiction-aware automation with immutable compliance proofs.

---

## The Team

| Member | Role | Background |
|--------|------|------------|
| **Spy** (@SpyCrypto) | Domain Expert | Retired complex litigation paralegal, published government statistics researcher (Idaho). Knows the discovery process inside-out across ID/UT/WA. |
| **John** (@bytewizard42i) | Developer | Midnight blockchain ambassador and builder. TypeScript/React stack. |

---

## Target & Timeline

- **Hackathon**: Midnight Vegas Hackathon — April 2026
- **MVP goal**: Working demo showing GeoOracle auto-compliance for at least one jurisdiction (Idaho)
- **Phase 1 jurisdictions**: Idaho, Utah, Washington, New York, California

---

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | React 19 + Vite + TypeScript + TailwindCSS 4 | shadcn/ui components, Lucide icons |
| Smart Contracts | Compact (Midnight's ZK language) | Compiles to zkir for zero-knowledge proofs |
| Wallet | Lace Browser Extension | Midnight-compatible wallet |
| Backend/Chain | Midnight Network (testnet) | Privacy-preserving blockchain with selective disclosure |
| Monorepo | npm workspaces + Turbo | Three packages: contract, CLI, frontend |
| Template Base | MeshJS/Edda Midnight Starter | Currently still at starter template stage (counter contract) |

### Key Midnight Concepts for Reviewers

If you're not familiar with Midnight:

- **Compact** is the smart contract language. It looks like TypeScript but compiles to zero-knowledge circuits.
- **Ledger state** = public on-chain state (visible to everyone)
- **Local state** = private state (only visible to the party who owns it)
- **Witnesses** = private inputs provided at transaction time (never revealed on-chain)
- **Selective disclosure** = prove something about private data without revealing it (e.g., "this document was produced before the deadline" without showing the document)
- **ZK proofs** = mathematical proof that a computation was done correctly, without revealing inputs

---

## Current Codebase State

**Honest assessment**: The repo is still the MeshJS/Edda starter template. The smart contract is a simple counter (`counter.compact`). The frontend has a home page, counter page, and wallet widget page. No AD-specific code exists yet.

### Current Contract (starter template)

```compact
pragma language_version >= 0.19;
import CompactStandardLibrary;

export ledger round: Counter;

export circuit increment(): [] {
  round.increment(1);
}
```

This will be completely replaced with AD-specific contracts.

### Current Frontend Pages

- `/` — Home (links to counter and wallet)
- `/counter` — Deploy and increment a counter contract
- `/wallet-ui` — Wallet connection widget

All of this will be replaced with AD-specific UI.

---

## Proposed Smart Contract Architecture

### Design Principles

1. **Single-purpose contracts** — Each contract does one thing
2. **Jurisdiction-agnostic core** — The workflow engine doesn't know about specific rules
3. **Data-driven rules** — Adding a new jurisdiction = adding data, not rewriting logic
4. **Privacy by default** — Case details are private; only compliance attestations are public
5. **Modular composition** — Contracts reference each other but can be upgraded independently

### Contract Modules

```
discovery-core.compact
├── Case lifecycle: create → open → add_step → complete_step → attest → close
├── Public ledger: case ID, status, jurisdiction ID, compliance score
├── Private state: case details, party information, document inventory
└── Does NOT know about any specific jurisdiction's rules

jurisdiction-registry.compact
├── Maps jurisdiction codes to rule metadata
├── Stores: disclosure deadlines, interrogatory limits, privilege requirements
├── Pluggable: adding California = adding an entry, not changing code
├── Version-tracked: which version of rules was applied (for audit)
└── Could be updatable by authorized admin (rule change governance)

compliance-proof.compact
├── Generates ZK attestations: "step X completed by party Y before deadline Z"
├── Selective disclosure: courts verify compliance without seeing case data
├── Immutable: once attested, cannot be altered (factual court record)
├── Exportable: proof can be submitted as evidence
└── This is the "killer feature" — the reason Midnight matters here

expert-witness.compact (Phase 2)
├── W-9/I-9 collection tracking
├── Standard of Care (SOC) documentation
├── Credential verification (privacy-preserving)
├── HIPAA compliance layer for medical malpractice
└── Separate because med-mal is primary use case with distinct needs
```

### Open Questions for Reviewers

1. **Should jurisdiction rules live on-chain or off-chain?** On-chain means immutable audit trail but slower updates. Off-chain (with hash anchoring) means faster rule updates but weaker guarantees. Hybrid?
2. **How granular should compliance proofs be?** Per-step attestation vs. per-phase vs. whole-case? More granular = more proofs = more cost but better auditability.
3. **GeoOracle design**: No privacy-preserving geographic oracle exists today. Options:
   - User self-declares jurisdiction (simplest, but trust issue)
   - Court filing number lookup (authoritative but requires integration)
   - IP-based with attestation (privacy concerns)
   - Manual entry with on-chain attestation (user declares, system records immutably)
4. **Multi-jurisdiction cases**: A case filed in Idaho federal court with a Utah defendant — which rules apply where? The contract needs a conflict resolution model.
5. **Upgradability**: When Idaho changes IRCP Rule 26, how does the registry update? Governance model needed.

---

## Proposed UI Architecture

### Design Philosophy

**"It should feel like practice management software, not a blockchain app."**

Legal professionals are risk-averse, time-pressured, and unfamiliar with crypto UX. The blockchain must be invisible infrastructure.

### Target User Personas

| Persona | Description | Key Need |
|---------|-------------|----------|
| **The Paralegal** (primary) | 35-55, manages discovery day-to-day, moderate tech skills | "Tell me exactly what to do next and when" |
| **The Litigator** | 30-60, reviews paralegal work, signs off on filings | "Show me compliance status at a glance" |
| **The Firm Admin** | Office manager, handles billing/reporting | "How much time/money did we save?" |
| **The Judge** (indirect) | Receives compliance proofs as evidence | "Is this proof verifiable and tamper-proof?" |

### Proposed Pages

| Page | Purpose | Key Components |
|------|---------|----------------|
| **Dashboard** | Active cases overview | Case cards, deadline countdown timers, compliance traffic lights (🟢🟡🔴) |
| **New Case Wizard** | Step-by-step case creation | Jurisdiction selector → case type → parties → auto-loads applicable rules |
| **Case View** | Single case management | Discovery checklist (step-by-step), document tracker, deadline timeline |
| **Compliance Report** | Court-ready export | ZK proof summary, attestation log, exportable PDF |
| **Jurisdiction Browser** | Compare rules across states | Side-by-side comparison, color-coded differences |
| **Expert Witness Manager** | W-9/I-9 and SOC tracking | Credential checklist, document upload status |
| **Settings** | Wallet, firm info, preferences | One-time wallet connection, firm profile |

### UI Design Rules

1. **Wallet connection happens once at first login** — then disappears. No "Connect Wallet" button on every page.
2. **Jurisdiction banner always visible** — top of every screen: "📍 Idaho — IRCP Rules Active"
3. **Traffic light compliance** — instant visual: green = good, yellow = approaching deadline, red = overdue
4. **Every input has an outlier flag + explanation field** — collapsible by default, expands when flagged, persisted to immutable audit log
5. **Wizard pattern for complex flows** — step-by-step, never a wall of form fields
6. **No blockchain terminology in the UI** — no "transactions," "gas," "deploy," "ledger." Use "save," "record," "verify," "certify."

### Open Questions for Reviewers

1. **Should the UI be a standalone web app or a plugin for existing practice management software** (Clio, MyCase, PracticePanther)? Plugin = faster adoption but limited UX control. Standalone = full control but requires behavior change.
2. **Mobile-first or desktop-first?** Paralegals work at desks but attorneys check status on phones.
3. **How to handle the "proof export" UX?** Courts don't have blockchain verification tools. The proof needs to be presented as a traditional document (PDF?) with a verification URL or QR code.
4. **Onboarding flow**: How do you explain "your compliance records are immutable and privacy-preserving" without using those words?
5. **Role-based access**: Should the paralegal and attorney see different views of the same case?

---

## Metrics Framework

### Case-Level Metrics (per case)

| Metric | What It Measures | Why It Matters |
|--------|-----------------|----------------|
| Disclosure completion % | Required disclosures filed / total required | Core compliance indicator |
| Deadline adherence | Days remaining or overdue per obligation | Sanctions risk indicator |
| Document production volume | Pages/files produced vs. requested | Discovery progress |
| Privilege log completeness | Items logged vs. items reviewed | Common sanctions trigger |
| Expert witness readiness | W-9/I-9 + SOC docs collected vs. required | Med-mal specific |
| Step completion rate | Discovery steps completed vs. total | Overall case progress |

### Platform Metrics (aggregate)

| Metric | What It Measures | Why It Matters |
|--------|-----------------|----------------|
| Compliance score | Weighted aggregate across all active cases | Firm health indicator |
| Jurisdiction coverage | Rule packs loaded / total jurisdictions | Platform capability |
| ZK proofs generated | Immutable attestations created | Blockchain utilization |
| Time-to-compliance | Avg time from case open to full compliance | Efficiency benchmark |
| Rule version currency | How up-to-date jurisdiction rules are | Data freshness |

### Court-Facing Metrics (for evidence submission)

| Metric | What It Measures | Why It Matters |
|--------|-----------------|----------------|
| Chain of custody integrity | Verifiable document handling history | Evidence admissibility |
| Attestation count | Number of compliance proofs for this case | Depth of compliance record |
| Rule version applied | Which version of jurisdiction rules was used | Audit defensibility |
| Timestamp verification | Cryptographic proof of when actions occurred | Deadline compliance proof |

### Open Questions for Reviewers

1. **What metrics would a judge actually want to see?** We need to think from the court's perspective, not just the attorney's.
2. **Should there be a "compliance risk score"** that predicts likelihood of sanctions based on current case state?
3. **Benchmarking**: What does "good" look like? How do we set thresholds for green/yellow/red?
4. **Client-facing metrics**: Should clients (the people being represented) have a portal to see their case's compliance status?

---

## Jurisdiction Deep Dive: Key Differences That Drive the Architecture

This section shows WHY jurisdiction-aware automation matters — the rules genuinely diverge in ways that trip up even experienced attorneys.

### Discovery Disclosure Requirements

| Jurisdiction | Initial Disclosures | Interrogatory Limit | Expert Disclosure Deadline |
|-------------|---------------------|---------------------|---------------------------|
| Federal (FRCP) | Mandatory (Rule 26(a)) | 25 without leave | 90 days before trial |
| Idaho (IRCP) | Mandatory (Rule 26(a)) | No fixed limit | Per scheduling order |
| Utah (URCP) | Tiered by damages | Tier-dependent (varies) | Per tier |
| Washington (CR) | Not mandatory | No fixed limit | Per case schedule |
| New York (CPLR) | Not mandatory (except Commercial Div) | Varies by court | Varies |
| California (CCP) | Mandatory + verified | 35 (special interrogatories) | Varies |

### Utah's Unique Tiered System

Utah is an outlier — discovery is tiered by the amount in controversy:

| Tier | Amount | Fact Witnesses | Expert Witnesses | Depositions |
|------|--------|---------------|-----------------|-------------|
| 1 | ≤ $50K | Unlimited | None without stipulation | 3 |
| 2 | $50K–$300K | Unlimited | 1 retained per side | 5 |
| 3 | > $300K | Unlimited | Unlimited | 10 |

This tiered system means the contract needs to handle **parametric rules**, not just binary yes/no compliance checks.

### Interstate Complications

| Scenario | Conflict | Why It's Hard |
|----------|----------|---------------|
| Federal diversity case (NY plaintiff, CA defendant) | Which state's privilege law applies? | FRE 501 says state law governs — but which state? |
| Idaho case, Utah witness | Subpoena across state lines | UIDDA (Uniform Interstate Depositions Act) applies |
| Multi-district litigation | Multiple federal courts, different local rules | MDL panel may set custom discovery schedule |

---

## Why Midnight? (For Reviewers Unfamiliar)

**Why not just build this as a normal web app with a database?**

1. **Immutability** — Compliance records can't be altered after the fact. A normal database can be edited. Midnight's ledger can't.
2. **Selective disclosure** — Prove "we produced all required documents before the deadline" without revealing the documents themselves. No traditional database can do this.
3. **Court admissibility** — ZK proofs are mathematical facts. Once courts accept them as evidence (the precedent play), they're stronger than any attestation letter.
4. **Trust minimization** — Neither party needs to trust the other's record-keeping. The chain is the neutral arbiter.
5. **Privacy** — Case data stays private. Only compliance attestations are visible. This is critical for HIPAA (medical records), attorney-client privilege, and work product protection.

**Why not another blockchain?**

- Ethereum/Solana: Everything is public. Legal data can't be public.
- Hyperledger: Permissioned but no ZK proofs.
- Midnight: Private by default, selective disclosure, ZK proofs built into the language. Purpose-built for this use case.

---

## What We'd Love Feedback On

Please challenge, refine, or offer alternatives on any of these:

1. **Contract modularity** — Is the 4-contract separation (core / registry / proof / expert) the right granularity? Too many? Too few? Different boundaries?
2. **GeoOracle implementation** — How should jurisdiction detection actually work in a privacy-preserving way?
3. **Rule storage** — On-chain vs. off-chain vs. hybrid for jurisdiction rules?
4. **UI paradigm** — Standalone web app vs. plugin vs. something else entirely?
5. **Compliance proof format** — What should a court-submittable ZK proof actually look like as a deliverable?
6. **Adoption strategy** — How do you get risk-averse legal professionals to trust a blockchain-based tool?
7. **Competitive landscape** — Are there existing tools we should study or differentiate from?
8. **Revenue model** — SaaS subscription per firm? Per-case pricing? Freemium with premium jurisdictions?
9. **Data model** — What's the right schema for representing a "discovery step" generically across all jurisdictions?
10. **Edge cases** — What legal scenarios would break this architecture?

---

## Resources & References

- **Midnight Developer Docs**: https://docs.midnight.network
- **Compact Language Reference**: Available in project repo
- **Build Club Context**: This project is part of the Midnight Build Club (cohort program), Week 1 focus is customer identification and market analysis
- **Domain Expert**: Spy has decades of complex litigation paralegal experience across Idaho, Utah, and Washington — the rules knowledge is first-hand, not theoretical

---

*Generated February 2026 — AutoDiscovery team (John + Spy)*
*Feedback welcome. Challenge everything.*
