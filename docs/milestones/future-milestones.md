<div align="center">

# AutoDiscovery.legal

### Future Milestones

**Where we're going. No hard dates — we move forward when the work is proven, not when the calendar says so.**

*Every new state is earned by the one before it.*

</div>

---

## Guiding Principles

| # | Principle |
|:-:|-----------|
| 1 | **Prove before you proceed.** No new state opens until the current batch is validated, integrated, tested, and stable. |
| 2 | **1–2 states at a time.** Depth over breadth. Each compliance packet is deeply researched, attorney-reviewed, and battle-tested before the next one starts. |
| 3 | **Build the guide as you go.** Every hurdle, workaround, gotcha, and lesson learned gets captured in the **Master Compliance Best Practices Guide** — a living document that makes each subsequent state easier than the last. |
| 4 | **Data additions, not code changes.** The architecture is modular. New states are rule pack data files plugged into an unchanged engine. |

---

## The Master Compliance Best Practices Guide

> *This is not a milestone — it is an artifact that grows alongside every milestone.*

Starting with Idaho and updated with every state thereafter, the guide captures institutional knowledge that makes compliance packet production faster and more reliable over time.

<details>
<summary><strong>What goes in the guide</strong> (click to expand)</summary>

| Section | Purpose |
|---------|---------|
| Rule Pack Encoding Patterns | What worked, what didn't. Naming conventions, schema patterns, edge cases in rule structure. |
| Court Structure Mapping | How to research and encode judicial districts, county overlays, local rules. Template for new states. |
| Deadline Engine Gotchas | Business day calculation quirks, holiday calendar integration, scheduling order override pitfalls. |
| UPL Analysis Template | Repeatable framework for unauthorized practice of law risk per state. Statutes to check, safe harbor arguments, attorney memo template. |
| Attorney Validation Workflow | How to find, engage, and work with a local attorney. What to send, what to ask, how to document sign-off. |
| Case Type Specialization Notes | Lessons from med-mal, personal injury, contract, employment sub-packets. State statutory quirks. |
| Testing Playbook | Sample cases per state. Known-good expected outputs. Regression test patterns. |
| State-to-State Differences | Growing matrix: interrogatory limits, response windows, deposition caps, privilege log requirements, sanctions regimes. |
| Integration Checklist | Encode → Load → Test → Deploy → Verify → Monitor. |
| Failure Log | Every mistake, every misunderstood rule, every validation rejection — so we never repeat it. |

</details>

**How the guide matures:**

| Stage | What happens |
|-------|-------------|
| Idaho | The guide is born. Everything is new. Heavy documentation of first-time decisions. |
| States 2–3 | First real test. Patterns emerge. Template sections solidify. |
| States 4–6 | Guide becomes the primary onboarding tool. New states follow it; deviations get folded back in. |
| States 7+ | Guide is mature. New packets are produced primarily by following it. |

---

## Phase 1 — Hackathon & Demo Day

| Milestone | Details |
|-----------|---------|
| Demo Day presentation | Midnight Vegas hackathon. 5-min scripted demo: case creation → jurisdiction detection → rule loading → step generation → deadline tracking → ZK attestation. |
| demoLand demo polished | *Smith v. Acme Corp* click-path scripted, backup video recorded, 3 dry runs completed. |
| realDeal "proof it's real" | Brief live wallet connect + contract status check. Recorded backup ready. |
| Contracts deployed to preprod | All 6 contracts deployed, addresses recorded, minimal end-to-end calls verified. |
| Build Club completion | All participation requirements fulfilled. Presentation delivered. |

---

## Phase 2 — Idaho: The Anchor State

> *Idaho is where we prove everything. The anchor. The template. Nothing else opens until Idaho is rock-solid.*

### Compliance & Legal Gates

| Milestone | Details |
|-----------|---------|
| Spy validation pass | Every IRCP rule, deadline, exemption, and med-mal requirement verified against 20+ years of Idaho litigation experience. **Hard gate.** |
| UPL legal memo | Written memo from Idaho-licensed attorney confirming safe harbor. |
| ISB Ethics Opinion inquiry | Informal inquiry to Idaho State Bar confirming no objection. |
| Terms of Service | ToS affirming AutoDiscovery is a tool, not legal counsel. In-app disclaimer. |
| Idaho IRCP Rule Pack v1.0 | Spy-validated, production-ready, covering all IRCP rules. |

### Idaho Master Compliance Packet

| Milestone | Details |
|-----------|---------|
| Master Compliance Packet | All IRCP rules, 7 judicial districts, local rules, med-mal statutes, deadline computation, sanctions. **Template for all future state packets.** |
| 4th District (Ada County / Boise) | Primary market — highest case volume. County-specific overlays. |
| 3rd District (Canyon County) | Secondary market — 2nd largest county. |
| 6th District (Bannock / Pocatello) | Tertiary market — ISU area. |
| Idaho holiday calendar | State-specific business day computation data. |
| Med-mal sub-packet | Pre-lit screening, expert affidavit of merit, SOC, IME, HIPAA auth, medical records deadlines. |

### Technical Completion

| Milestone | Details |
|-----------|---------|
| Deadline computation engine | `services/deadline-engine.ts` — relative → absolute dates with business day math. |
| Rule loader service | `services/rule-loader.ts` — loads JSON, validates schema, merges county/judge overrides. |
| realDeal providers wired | All 12 connected to compiled Compact contracts + Lace wallet. |
| End-to-end workflow test | Case create → steps → complete → attestation → verify proof — on Midnight preprod. |
| Production deployment | Target: `demo.autodiscovery.legal` (demoLand), `app.autodiscovery.legal` (realDeal). |

### Idaho Market Entry

| Milestone | Details |
|-----------|---------|
| Idaho State Bar outreach | Engage ISB Technology Committee. Present at bar events. |
| Pilot firm partnerships | 4th District (Boise) — med-mal, personal injury, complex civil. |
| Best Practices Guide v1.0 | First version written from everything learned building Idaho. |

### Advance Gate

> **Do not proceed until ALL are true:**

- [ ] Idaho packet is Spy-validated and attorney-reviewed
- [ ] Deadline engine correct for Idaho test cases
- [ ] At least one pilot firm actively using the system
- [ ] No critical bugs in Idaho workflows
- [ ] Best Practices Guide v1.0 written

---

## Phase 3 — First Expansion: 1–2 Adjacent States

> *Prove the template works beyond Idaho. Update the guide.*

### Candidate States

| State | Why |
|-------|-----|
| **Utah** (URCP) | Adjacent. Mirrors FRCP closely. Good template validation — similar enough to confirm, different enough to test. |
| **Washington** (CR) | Pacific NW corridor. Distinct discovery procedures. Tests against a more divergent rule set. |
| **Montana** (MRCP) | Adjacent. Similar to FRCP. Small bar = fast validation. |
| **Wyoming** (WRCP) | Adjacent. ~2,200 bar members. Straightforward rules. |
| **Oregon** (ORCP) | Pacific NW corridor. |
| **Nevada** (NRCP) | Adjacent. Growing market (Las Vegas). |

### Per-State Workflow

*This workflow applies to every state from here forward:*

```
 1  Research      Gather rules, court structure, holidays, case law
 2  Encode        Convert to structured JSON following Idaho template
 3  Validate      Local attorney reviews every rule, deadline, exemption
 4  Test          Run sample cases through deadline engine
 5  Integrate     Load into jurisdiction registry → demoLand → realDeal
 6  Prove         Pilot or internal test cycle — confirm accuracy
 7  Update guide  Document gotchas, differences, attorney notes, engine changes
 8  Ship          Publish compliance packet — open state to users
```

### Advance Gate

- [ ] Compliance packet attorney-validated
- [ ] Deadline engine correct (no regressions)
- [ ] Best Practices Guide updated
- [ ] No critical bugs introduced

---

## Phase 4 — Wider Regional Expansion

> *Continue the spiral. 1–2 states per batch. Same workflow. Same gate. Guide grows.*

### Federal Baseline

| Milestone | Details |
|-----------|---------|
| FRCP Master Packet | Federal Rules of Civil Procedure — nationwide baseline for removal cases. |
| Jurisdiction switch workflow | Automatic rule pack switching when cases move state ↔ federal. |
| Jurisdiction comparison UI | Side-by-side view: interrogatory limits, response days, deposition caps across 2+ jurisdictions. |

### Expansion Priority

| Tier | States | Rationale |
|------|--------|-----------|
| **Near-adjacent** | CO, AZ, NM | Second ring. Extends western coverage. |
| **Major markets** | CA (CCP), NY (CPLR), TX, FL, IL | High volume, high value. Complex rules — but guide is mature by now. |
| **Mid-Atlantic & Southeast** | OH, PA, MI, GA, VA, NC, NJ, MA | Fill the eastern half. Template-based production. |
| **Remaining** | ~25 states + DC + territories | Batch production following the mature guide. |

### The Cadence

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │   Pick 1–2 states                        │
  │       ↓                                  │
  │   Research & encode                      │
  │       ↓                                  │
  │   Attorney validation                    │
  │       ↓                                  │
  │   Test against deadline engine           │
  │       ↓                                  │
  │   Integrate (demoLand → realDeal)        │
  │       ↓                                  │
  │   Pilot / prove accuracy                 │
  │       ↓                                  │
  │   Update Best Practices Guide            │
  │       ↓                                  │
  │   Ship → open state to users             │
  │       ↓                                  │
  │   Retrospective                          │
  │       ↓                                  │
  │   ← Loop                                │
  │                                          │
  └──────────────────────────────────────────┘
```

---

## Phase 5 — Product Maturity & Revenue

> *Built in parallel with expansion — ships when ready, not gated by state count.*

### Core Features

| Feature | Details |
|---------|---------|
| E-Discovery pipeline | ESI handling with full metadata extraction. |
| YubiKey access control | Document-level, action-level, role elevation. Hardware key auth. |
| Full email safety | Tandem approval (N-of-M approvers). Complete attachment scanning. |
| Expert witness module | Qualification attestation, W-9/I-9, HIPAA, SOC documentation. |
| AI metadata pipeline | Document parsing, entity resolution, extraction for 24 universal categories. |
| Compliance report export | Court-ready PDFs with verification QR codes. No blockchain jargon. |

### Revenue Streams

| Stream | Details |
|--------|---------|
| Subscription launch | Tiered: Solo, Small Firm, Mid-Size, Enterprise. |
| Error insurance product | Malpractice insurance integration backed by ZK compliance records. |
| Insurance underwriting API | Insurers verify attestations for E&O pricing — provable risk reduction. |
| Court integration APIs | Direct ZK attestation submission to court filing systems. |

---

## Phase 6 — Ecosystem & Scale

### Protocol & Marketplace

| Milestone | Details |
|-----------|---------|
| Rule Pack Marketplace | Third-party jurisdiction contributions. Revenue share model. |
| AutoDiscovery Protocol | Published open specification for legal discovery compliance. |
| Court system partnerships | Direct API integrations with filing systems. |

### International Expansion

| Jurisdiction | Notes |
|-------------|-------|
| **Canada** | Provincial civil procedure. Similar common law tradition. First international test. |
| **United Kingdom** | CPR. Disclosure obligations differ from US discovery. |
| **European Union** | Member state procedure + GDPR overlay. |
| **Australia / New Zealand** | Common law. Established discovery procedures. |

### MidnightVitals Standalone

| Tier | Details |
|------|---------|
| Open Source | `@midnight-vitals/core` — free diagnostic module for any Midnight DApp. |
| Pro (SaaS) | Multi-contract monitoring, alerts, analytics. |
| Enterprise | 24/7 monitoring, SLA, Datadog/Grafana/PagerDuty integration. |

### DIDz Ecosystem Integration

| Product | Integration |
|---------|-------------|
| **SelectConnect** | Privacy-first contact sharing between opposing counsel — progressive reveal. |
| **GeoZ** | Privacy-preserving geolocation oracle for automatic jurisdiction detection. |
| **KYCz** | Attorney bar membership attestation without revealing personal data. |
| **DIDz** | Decentralized identity for all case participants. |

---

## The Spiral

```
                        NATIONWIDE
                   ┌─────────────────────────┐
                   │  Remaining ~25 states    │
                   │  + DC + territories      │
                   │                          │
               RING 4                         │
           ┌──────────────────────┐           │
           │  NY · TX · FL · IL   │           │
           │  + other majors      │           │
           │                      │           │
         RING 3                   │           │
     ┌─────────────────────┐      │           │
     │  CA · CO · AZ · NM  │      │           │
     │  + FRCP baseline     │      │           │
     │                     │      │           │
   RING 2                   │      │           │
 ┌──────────────────────┐   │      │           │
 │  1–2 adjacent states │   │      │           │
 │  at a time           │   │      │           │
 │                      │   │      │           │
 │  RING 1: ANCHOR      │   │      │           │
 │  ┌────────────────┐  │   │      │           │
 │  │                │  │   │      │           │
 │  │     IDAHO      │  │   │      │           │
 │  │                │  │   │      │           │
 │  └────────────────┘  │   │      │           │
 └──────────────────────┘   │      │           │
     └─────────────────────┘      │           │
           └──────────────────────┘           │
                   └─────────────────────────┘
                             │
                        INTERNATIONAL
                   (Canada · UK · EU · AU/NZ)

 Each ring = 1–2 states at a time, proven before advancing.
 The guide grows with every ring.
```

---

## Compliance Packet Revenue Model

> *Each packet is significant research, legal validation, and ongoing maintenance — a core revenue driver and competitive moat.*

| Component | Description |
|-----------|-------------|
| State civil procedure rules | Structured, machine-readable rule packs |
| Local court rules | County/district-level overlays |
| Holiday calendars | State-specific business day computation |
| Case type specializations | Med-mal, PI, contract, employment — unique rules per type |
| Deadline computation profiles | Tested scenarios with known-good outputs |
| Sanctions research | State-specific case law and risk factors |
| UPL analysis per state | Safe harbor legal memo per jurisdiction |
| Attorney validation attestation | Signed off by a licensed attorney in each state |

*Premium states (CA, NY, TX) command higher pricing. Smaller states can be bundled.*

---

## Key Decisions Ahead

| Decision | Trigger | Options |
|----------|---------|---------|
| Demo Day strategy | Before hackathon | demoLand only vs. demoLand + realDeal |
| Domain acquisition | Go-live readiness | `autodiscovery.legal` — confirm and register |
| First hire | Revenue supports it | Paralegal/researcher to accelerate packet production |
| Funding strategy | Post-hackathon | Bootstrap vs. Midnight Foundation grant vs. seed round |
| Open-source vs. proprietary | Before first customer | Core protocol open, packets proprietary? Or fully proprietary? |
| Pricing model | Before 2nd state | Per-jurisdiction access vs. flat subscription? |

---

<div align="center">

*AutoDiscovery.legal — Future Milestones*
*John, Spy & Penny — March 2026*

</div>
