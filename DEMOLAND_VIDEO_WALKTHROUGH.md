# DemoLand Video Walkthrough Script

**For**: Screen recording of AutoDiscovery.legal DemoLand demo
**Duration**: ~4-5 minutes
**Setup**: `cd frontend-demoland-vite-react && npm run dev` → opens at `localhost:5173`
**Recording Tool**: OBS Studio, Windows Game Bar (Win+G), or any screen recorder
**Resolution**: 1920x1080 recommended (or 1280x800 minimum)

---

## Pre-Recording Checklist

- [ ] DemoLand running at localhost:5173
- [ ] Browser in dark mode (it defaults to dark)
- [ ] Browser zoom at 100%
- [ ] Close other tabs/notifications
- [ ] Jurisdiction Rules panel will auto-open on dashboard — that's normal

---

## Script

### Scene 1: Login Screen (0:00 - 0:30)

**What you see**: Gold scales logo, "AutoDiscovery" title, yellow DEMO MODE banner at top, three auth method cards.

**What to say**:
> "This is AutoDiscovery Legal — a privacy-preserving legal discovery platform built on the Midnight blockchain. We support three authentication methods."

**Actions**:
1. **Hover** over each auth card briefly:
   - **Email & Password** — "Traditional login with Argon2id-derived keys"
   - **YubiKey** — "FIDO2 hardware key for law firms"
   - **Trezor 5** — "Hardware wallet with native Ed25519 signing — the best curve match for Midnight"
2. Click back to **Email & Password**
3. The demo email and password are pre-filled
4. Click **"Sign In Securely"**

**Transition**: Brief loading animation → Dashboard

---

### Scene 2: Dashboard Overview (0:30 - 1:30)

**What you see**: Four stat cards at top, secondary stats row, "Due This Week" urgency section, Active Cases list.

**What to say**:
> "The dashboard gives a compliance overview across all active cases. We're running under Idaho Rules of Civil Procedure — IRCP."

**Actions**:
1. **Point out the top stats**:
   - "3 active cases, 226 documents across all cases"
   - "23 of 41 discovery steps complete — 56%"
   - "1 overdue item that needs attention"

2. **Point out the secondary stats row**:
   - "6 zero-knowledge proof attestations generated"
   - "4 participants with active access registrations"
   - "2 expert witnesses, both credentials verified"
   - "Idaho IRCP v3 rule pack verified on-chain"

3. **Point out the "Due This Week" section** (if visible — scroll slightly):
   - "The system flags upcoming deadlines. These are steps due within 7 days."
   - Note any "Deemed Admitted" warnings — "Under IRCP 36, unanswered requests for admission are automatically deemed admitted. AutoDiscovery tracks this countdown."

4. **Point out Smith v. Acme case card**:
   - "Smith v. Acme Medical Center — a med-mal case"
   - "Compliance score of 82, flagged as At Risk"
   - "Notice the Haystack Alert — our AI flagged a production set for potential data dump obfuscation with a score of 0.62"

5. **Look at the Jurisdiction Rules panel** on the right side:
   - "The Rules Panel compares Idaho IRCP against federal FRCP, California CCP, New York CPLR, Utah URCP, and Washington CR"
   - "For interrogatories, Idaho allows 40 including subparts — vs federal's 25"
   - Click to expand/collapse a category if possible

6. **Click the Smith v. Acme case** to open it

---

### Scene 3: Case View — Overview Tab (1:30 - 2:30)

**What you see**: Case header with compliance ring, 7 tabs, Case Summary + Sanctions Risk side by side, ZK Attestations, Production Scorecard, Discovery Timeline.

**What to say**:
> "Inside a case, we see the full discovery picture."

**Actions**:
1. **Case header**: "Smith v. Acme Medical Center et al. — CV-2025-04821, filed under Idaho med-mal rules."

2. **Sanctions Risk Meter**: 
   - "This is our sanctions risk calculator. It factors in overdue steps, compliance gaps, and obfuscation flags."
   - "The estimated exposure is calculated from the average discovery sanction of $704,094 per the Willoughby study in the Duke Law Journal."

3. **ZK Attestations section**:
   - "These are our zero-knowledge proof attestations. Each one has a cryptographic proof hash that can be independently verified against the Midnight blockchain."
   - "The key insight: these proofs verify compliance without revealing the underlying sensitive documents."

4. **Production Scorecard**:
   - "We track document productions by party — prosecution vs defense, page counts"
   - **Click the Haystack Alert button** to expand the obfuscation analysis
   - "Our AI detected potential data dump obfuscation — this is when a party buries responsive documents in thousands of irrelevant pages to obstruct discovery."

5. **Discovery Timeline** (scroll down if needed):
   - "The timeline shows every filing, production, deadline, hearing, and attestation in chronological order"

---

### Scene 4: Steps Tab (2:30 - 3:00)

**Actions**: Click the **"Steps"** tab.

**What to say**:
> "The Steps tab tracks every discovery obligation."

**Actions**:
1. Scroll through a few steps showing different statuses (complete, in_progress, pending, overdue)
2. "Each step references the specific rule — IRCP 33(a) for interrogatories, IRCP 34 for document requests, IRCP 36 for requests for admission"
3. Point out an **IRCP 36 step** with the "Deemed Admitted" countdown:
   - "This is critical — under Rule 36, if these requests for admission aren't answered in time, they're automatically deemed admitted. That can be case-ending."

---

### Scene 5: Documents Tab (3:00 - 3:45)

**Actions**: Click the **"Documents"** tab.

**What to say**:
> "The Documents tab shows every document in the case with rich metadata."

**Actions**:
1. Point out document features:
   - **Category badges** (pleading, medical_record, expert_report, etc.)
   - **Protective order tiers** (Confidential, AEO, Sealed) — "Color-coded by sensitivity"
   - **Twin Bond badges** — "Twin Protocol bonds link physical and digital copies"
   - **AI Synopsis** — "Each document gets an AI-generated summary"
   - **Entity extraction** — "Named entities are automatically extracted"
   - **Bates numbers** — "Standard legal numbering"

2. **Click "Verify Hash"** on any document:
   - "This checks the document's fingerprint against the on-chain hash in our document-registry smart contract."
   - "It confirms the document hasn't been altered since it was anchored to the blockchain."
   - Watch the green verification confirmation appear

3. If visible, point out a **Twin Bond** detail:
   - "The twin bond links a physical scan to a digital original with a fidelity score — this prevents document tampering"

---

### Scene 6: Compliance Tab (3:45 - 4:15)

**Actions**: Click the **"Compliance"** tab.

**What to say**:
> "The Compliance tab is where the zero-knowledge magic happens."

**Actions**:
1. Show the ZK attestations list with proof hashes
2. "Each attestation is a zero-knowledge proof that a specific compliance obligation was met — without revealing the underlying documents"
3. "These proofs can be submitted to opposing counsel or the court as cryptographic evidence of compliance"
4. Point out different attestation scopes (step-level, phase-level, case-level)
5. If there's an **"Export Report"** button, click it:
   - "We can generate a printable compliance report with all ZK proof hashes — ready for court filing"

---

### Scene 7: Closing (4:15 - 4:30)

**Actions**: Navigate back to dashboard.

**What to say**:
> "That's AutoDiscovery Legal — privacy-preserving legal discovery automation powered by Midnight's zero-knowledge proofs. Six smart contracts, 27 ZK circuits, all live on the Midnight Preprod network. Every document hash, every compliance attestation, every access permission is cryptographically verified on-chain — while the sensitive data never leaves the law firm's control."

---

## Bonus Scenes (Optional)

### Access Tab
- Show participant permissions by role (Defense, Prosecution, Court, Third Party)
- Protective order enforcement — sealed documents restricted to judge only
- Sharing events audit trail

### Experts Tab
- Expert witness credentials with ZK verification badges
- Qualification proofs

### Settings Page
- Show mode toggle (DemoLand vs RealDeal indicator)

---

## Key Talking Points to Weave In

- **"Privacy-preserving"** — sensitive legal documents never leave the firm's control
- **"Zero-knowledge proofs"** — verify compliance without revealing content
- **"Haystack detection"** — AI catches data dump obfuscation tactics
- **"Sanctions risk"** — real dollar exposure calculated from published research
- **"Six smart contracts"** — discovery-core, document-registry, compliance-proof, jurisdiction-registry, access-control, expert-witness
- **"Midnight blockchain"** — purpose-built for data protection with ZK proofs
- **"Twin Protocol"** — physical/digital document linking with fidelity scoring
- **"Jurisdiction-aware"** — automatically applies the correct state/federal rules
