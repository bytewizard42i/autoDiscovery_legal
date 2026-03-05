# Launch Checklist — Build Club Program Completion (Demo Day)

**Repo:** SpyCrypto/AutoDiscovery  
**Objective:** Successful completion of the Build Club program by fulfilling participation requirements and delivering a Demo Day presentation.

> Definition of “Launch” for this checklist: **Program Completion**. Completion means the participant fulfills participation requirements and presents at Demo Day.

---

## 0) Baseline Admin / Compliance (Required)
- [ ] Confirm Demo Day date/time, presentation length, and submission requirements (slides, demo video, repo link, live URL).
- [ ] Confirm what may be represented publicly (e.g., only claim “completed/graduated” **after** Demo Day per program rules).
- [ ] Ensure the repo description, README, and public messaging align with the Build Club participation terms.

---

## 1) Definition of Done (Demo Day)
### 1.1 Demo Narrative (must be crisp)
- [ ] Finalize the 1–2 sentence product thesis ("build once, comply everywhere" + ZK proof value).
- [ ] Choose the exact story case used in the demo (e.g., Smith v. Acme) and keep it consistent.
- [ ] Prepare a "What is Midnight?" 10-second explanation for non-crypto/legal audiences.

### 1.2 Demo Flow (scripted)
- [ ] Login / entry flow decided:
  - [ ] **demoLand** (no wallet) OR
  - [ ] **realDeal** (wallet + contracts)
- [ ] Step-by-step click path written (no improvisation).
- [ ] Backup path ready if a step fails ("Plan B" route).

---

## 2) Technical Readiness — Frontend(s)
### 2.1 demoLand (safe demo)
- [ ] `frontend-demoland-vite-react` builds cleanly.
- [ ] Demo data is realistic and supports the full click-path.
- [ ] All vital UI states work offline (loading, error, success).

### 2.2 realDeal (blockchain demo)
- [ ] `frontend-realdeal` builds and runs locally.
- [ ] Wallet connect flow works (MidnightBrowserWallet).
- [ ] `.env` has required realDeal settings (network, proof server, indexer, contract addresses).
- [ ] Providers in `src/providers/realdeal/` are connected (not throwing "not connected").

---

## 3) Smart Contract Readiness (Midnight)
- [ ] All 6 contracts are compiled (managed outputs present in `autodiscovery-contract/src/managed/`).
- [ ] Proof server is runnable for demo (`midnightntwrk/proof-server:7.0.0`).
- [ ] Contracts are deployed to **Preprod** and addresses are recorded.
- [ ] Minimal end-to-end contract calls verified for the demo scenario:
  - [ ] discovery-core: create case, add step, mark step complete, compliance status
  - [ ] document-registry: register document / verify twin bond (if demoed)
  - [ ] compliance-proof: generate/verify attestation (if demoed)
  - [ ] jurisdiction-registry: rule pack hash verification (if demoed)

---

## 4) DevOps / Deployment Readiness
- [ ] Decide hosting targets:
  - [ ] demo site URL (e.g., `demo.autodiscovery.legal`)
  - [ ] app URL (e.g., `app.autodiscovery.legal`) if realDeal demo is used
- [ ] Deploy demoLand to Vercel/Netlify and verify on a clean browser.
- [ ] If using realDeal: verify wallet extension works on the demo machine/profile.
- [ ] Create a “Demo Day runbook” (setup steps + common failure fixes).

---

## 5) Documentation & Repo Polish
- [ ] README: clear Quick Start + what to demo + what mode (demoLand vs realDeal).
- [ ] Add/confirm:
  - [ ] LICENSE
  - [ ] SECURITY.md (basic)
  - [ ] CONTRIBUTING.md (basic)
- [ ] Ensure key docs are easy to find (GTM, roadmap, rollout strategy).

---

## 6) Demo Day Assets
- [ ] Slide deck:
  - [ ] Problem → Solution → Why now → Why Midnight/ZK → Demo → Roadmap
- [ ] Short 30–90s backup demo video recorded.
- [ ] One-pager link ready (can be `Why ADL?.md` rendered).

---

## 7) Dry Runs (Non-negotiable)
- [ ] 3 full dry-runs end-to-end (timed).
- [ ] 1 dry-run on the **actual Demo Day machine**.
- [ ] 1 dry-run with a “hostile network” assumption (spotty wifi).

---

## 8) Final Demo Day Checklist (T-60 minutes)
- [ ] Proof server status verified (if used).
- [ ] Wallet installed, logged in, has tDUST (if used).
- [ ] Browser tabs prepared and notifications disabled.
- [ ] Live site loads and the click-path works.
- [ ] Backup video opened and ready.

---

## Notes on Current Technical Readiness (from repo review)
- `frontend-realdeal/src/contracts/index.ts` explicitly marks **access-control** and **expert-witness** integration as not yet wired in places, and realDeal providers currently throw "not yet connected" errors until connected.
- Wallet connection plumbing exists (`MidnightBrowserWallet.connectToWallet(...)`).
- The repo contains strong architecture docs for demoLand vs realDeal and an explicit RealDeal punch list.

---

## Suggested Demo-Day Strategy (lowest risk)
- Prefer **demoLand** for the live click-path (no wallet / no chain dependency).
- Optionally show **realDeal** as a short “proof it’s real” segment (wallet connect + contract status), with a recorded backup.