# AutoDiscovery × SelectConnect — Privacy-Preserving Legal Contact

*How SelectConnect's progressive reveal and abuse bonds transform legal discovery from adversarial fishing expeditions into economically accountable, privacy-preserving information exchange.*

---

## Why Legal Discovery Needs SelectConnect

Legal discovery is one of the most expensive and privacy-violating processes in modern law:
- **Fishing expeditions**: Opposing counsel requests everything hoping to find something
- **Witness intimidation**: Contact info exposed during discovery enables harassment
- **Expert witness poaching**: Rival firms identify and contact your experts
- **No accountability**: Mass subpoena requests cost nothing to send
- **Privileged info leaks**: Overbroad discovery exposes protected communications

SelectConnect + DIDz flips this: every request for information has an **economic cost**, every contact is **accountable**, and every disclosure is **progressive and revocable**.

---

## Integration Points

### Attorney → Witness Contact

| Level | Bond | What's Disclosed | Verification |
|-------|------|-----------------|-------------|
| 1 (Inquiry) | 5 ADA | Case category, jurisdiction, witness role type | "Licensed attorney ✓" (DIDz bar admission) |
| 2 (Relevance) | 15 ADA | Case summary, specific questions, deposition offer | "Authorized for case #XYZ ✓" |
| 3 (Contact) | 25 ADA | Direct contact for scheduling | Mutual consent required |
| 4 (Full) | Court order | Complete discovery materials | Judge-verified court order ZK proof |

**Key**: High bonds filter for legitimate legal need. A firm sending 500 fishing-expedition witness contacts pays $1,250+ in bonds and loses them all if reported.

### Expert Witness Discovery

```
Law firm seeking expert → Posts bond → Sees:
  Level 1: Area of expertise + "Qualified expert ✓" (DIDz-verified credentials)
  Level 2: CV summary + availability + rate range
  Level 3: Full CV + direct contact + engagement terms
  
Expert → Can set different policies for:
  - Plaintiff firms vs. defense firms
  - Federal vs. state cases
  - Geographic jurisdiction restrictions
  - Conflict checks via ZK proof ("Not engaged by opposing party ✓")
```

### Document Discovery (AutoDiscovery Core Flow)

SelectConnect's progressive reveal maps directly to tiered document production:
- **Level 1**: Document category + privilege log excerpt
- **Level 2**: Redacted document summaries
- **Level 3**: Full documents (with privilege protections maintained via ZK)
- **Emergency override**: Court-ordered immediate disclosure (similar to SentinelDID emergency pattern)

### Mediation / Settlement Contact

Opposing parties in litigation can use SelectConnect for settlement discussions:
- Pseudonymous initial contact (neither side reveals negotiating position)
- Bond-backed good faith signals
- Progressive reveal of settlement terms
- Revocable at any time — no commitment until mutual full disclosure

---

## Related Documents

- AutoDiscovery Architecture: `AutoDiscovery/docs/` (if exists)
- SelectConnect Contract: `selectConnect/contracts/SelectConnectProtocol.compact`
- DIDz Identity Integration: `DIDz-io/docs/SELECTCONNECT_IDENTITY_INTEGRATION.md`

---

*Last updated: March 22, 2026 — Penny 🎀*
