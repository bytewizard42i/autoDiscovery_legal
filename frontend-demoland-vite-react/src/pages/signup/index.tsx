// AutoDiscovery Sign-Up Page — demoLand workflow.
// Glass-effect dark theme matching the AD visual style.
// All 7 auth methods with simulated device/wallet/OAuth flows.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale, Mail, KeyRound, HardDrive, Fingerprint, Globe, Shield,
  Lock, Loader2, ArrowLeft, Check, Smartphone,
} from 'lucide-react';
import { useAuth, useMode } from '@/providers/context';
import { useVitalsLogger } from '@/vitals';
import type { AuthMethod, SignUpData } from '@/providers/types';

// ─── Constants ───────────────────────────────────────────────

const JURISDICTIONS = [
  'Federal — All Districts',
  'California', 'New York', 'Texas', 'Florida', 'Illinois',
  'Pennsylvania', 'Ohio', 'Georgia', 'Massachusetts', 'Washington',
  'Virginia', 'Michigan', 'New Jersey', 'North Carolina', 'Arizona',
  'International — UK', 'International — EU', 'International — Canada',
  'Other',
];

const LEGAL_ROLES = [
  'Lead Attorney', 'Associate Attorney', 'Partner', 'Of Counsel',
  'Paralegal', 'Legal Secretary', 'Law Clerk', 'In-House Counsel',
  'Compliance Officer', 'Litigation Support', 'Expert Witness',
  'Mediator / Arbitrator', 'Other',
];

// Sign-up method definitions
const SIGNUP_METHODS: { id: AuthMethod; label: string; icon: typeof Mail; desc: string; badge?: string }[] = [
  { id: 'email',        label: 'Email & Password',  icon: Mail,        desc: 'Traditional login with Argon2id-derived private key' },
  { id: 'pgp-key',      label: 'PGP / NitroKey',    icon: KeyRound,    desc: 'OpenPGP smart card — hardware-bound private key',       badge: 'Most Secure' },
  { id: 'yubikey',       label: 'YubiKey',           icon: KeyRound,    desc: 'FIDO2/WebAuthn hardware security key — ECDSA P-256',    badge: 'FIDO2' },
  { id: 'did-wallet',    label: 'DID Wallet',        icon: Shield,      desc: 'Decentralized Identifier — self-sovereign identity',    badge: 'Self-Sovereign' },
  { id: 'trezor',        label: 'Trezor 5',          icon: HardDrive,   desc: 'Hardware wallet — native Ed25519 signing for Midnight', badge: 'Ed25519' },
  { id: 'biometric',     label: 'Biometric',         icon: Fingerprint, desc: 'Fingerprint or facial recognition via WebAuthn',        badge: 'FIDO2' },
  { id: 'chrome-oauth',  label: 'Google / Chrome',   icon: Globe,       desc: 'Use your Google account via Chrome sign-in' },
  { id: 'brave-oauth',   label: 'Brave Browser',     icon: Smartphone,  desc: 'Use your Brave browser identity + BAT wallet' },
];

// ─── Step type ───────────────────────────────────────────────

type Step = 'choose-method' | 'credentials' | 'profile' | 'simulating';

// ─── Component ───────────────────────────────────────────────

export function SignupPage() {
  const { signup } = useAuth();
  const mode = useMode();
  const navigate = useNavigate();
  const vitals = useVitalsLogger();

  const [step, setStep] = useState<Step>('choose-method');
  const [selectedMethod, setSelectedMethod] = useState<AuthMethod | null>(null);

  const [formData, setFormData] = useState<SignUpData>({
    firstName: '', lastName: '', email: '',
    role: '', firm: '', jurisdiction: '', password: '',
    signupMethod: 'email',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState('');

  // ─── Helpers ─────────────────────────────────────────────

  function updateField(field: keyof SignUpData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  }

  function selectMethod(method: AuthMethod) {
    setSelectedMethod(method);
    setFormData((prev) => ({ ...prev, signupMethod: method }));
    setError('');
    vitals.action(`Selected signup method: ${method}`);

    if (method === 'email') {
      setStep('credentials');
      return;
    }
    runSimulatedConnection(method);
  }

  async function runSimulatedConnection(method: AuthMethod) {
    setStep('simulating');

    const sequences: Record<string, string[]> = {
      'pgp-key': [
        'Scanning for connected hardware keys...',
        'NitroKey Pro 2 detected on USB port',
        'Requesting PGP public key from device...',
        'Key fingerprint: 7A4F 2E8C 1B3D 9E6F A08B  C52D 3F71 E4A9 D6B8 0C15',
        'Verifying key authenticity...',
        'PGP identity confirmed!',
      ],
      'yubikey': [
        'Waiting for YubiKey insertion...',
        'YubiKey 5 NFC detected — firmware 5.7.1',
        'Initiating FIDO2/WebAuthn challenge...',
        'Touch your YubiKey now...',
        'ECDSA P-256 attestation verified!',
      ],
      'did-wallet': [
        'Connecting to DID wallet...',
        'Waiting for wallet approval...',
        'DID resolved: did:prism:abc123...xyz789',
        'Verifying DID document on Cardano...',
        'Checking verifiable credentials...',
        'DID identity verified!',
      ],
      'trezor': [
        'Scanning USB ports for Trezor device...',
        'Trezor 5 detected — firmware v2.8.1',
        'Requesting Ed25519 public key derivation...',
        'Please confirm on your Trezor touchscreen...',
        'Public key: ed25519:9F3A...B7C2',
        'Trezor identity confirmed!',
      ],
      'biometric': [
        'Initializing WebAuthn FIDO2 protocol...',
        'Requesting biometric authentication...',
        'Place your finger on the sensor or look at the camera...',
        'Biometric template captured',
        'FIDO2 attestation verified!',
      ],
      'chrome-oauth': [
        'Redirecting to Google sign-in...',
        'Waiting for authorization...',
        'OAuth token received',
        'Fetching profile from Google...',
        'Google identity confirmed!',
      ],
      'brave-oauth': [
        'Connecting to Brave identity service...',
        'Waiting for Brave wallet approval...',
        'BAT wallet linked',
        'Fetching Brave profile...',
        'Brave identity confirmed!',
      ],
    };

    const steps = sequences[method] || ['Connecting...', 'Done!'];
    for (const msg of steps) {
      setSimulationStatus(msg);
      await new Promise((r) => setTimeout(r, 900));
    }

    // Pre-fill metadata
    if (method === 'pgp-key') {
      setFormData((prev) => ({ ...prev, pgpFingerprint: '7A4F 2E8C 1B3D 9E6F A08B C52D 3F71 E4A9 D6B8 0C15' }));
    } else if (method === 'did-wallet') {
      setFormData((prev) => ({ ...prev, didUri: 'did:prism:abc123def456...xyz789' }));
    } else if (method === 'trezor') {
      setFormData((prev) => ({ ...prev, trezorPublicKey: 'ed25519:9F3A7B2E4D1C8F5A...B7C2' }));
    } else if (method === 'biometric') {
      setFormData((prev) => ({ ...prev, biometricType: 'fingerprint' }));
    } else if (method === 'chrome-oauth') {
      setFormData((prev) => ({ ...prev, oauthProvider: 'chrome', email: prev.email || 'demo.user@gmail.com' }));
    } else if (method === 'brave-oauth') {
      setFormData((prev) => ({ ...prev, oauthProvider: 'brave', email: prev.email || 'demo.user@brave.com' }));
    }

    await new Promise((r) => setTimeout(r, 500));
    setStep('profile');
  }

  // ─── Validation ──────────────────────────────────────────

  function validateCredentials(): boolean {
    if (!formData.firstName.trim()) { setError('First name is required.'); return false; }
    if (!formData.lastName.trim()) { setError('Last name is required.'); return false; }
    if (!formData.email.trim() || !formData.email.includes('@')) { setError('A valid email address is required.'); return false; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return false; }
    if (formData.password !== confirmPassword) { setError('Passwords do not match.'); return false; }
    return true;
  }

  function validateProfile(): boolean {
    if (!formData.firstName.trim()) { setError('First name is required.'); return false; }
    if (!formData.lastName.trim()) { setError('Last name is required.'); return false; }
    if (!formData.role) { setError('Please select your role.'); return false; }
    if (!formData.firm.trim()) { setError('Firm or organization is required.'); return false; }
    if (!formData.jurisdiction) { setError('Please select your primary jurisdiction.'); return false; }
    return true;
  }

  function handleCredentialsNext() {
    if (validateCredentials()) { setStep('profile'); setError(''); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateProfile()) return;

    // Auto-fill email/password for non-email methods
    if (selectedMethod !== 'email') {
      if (!formData.email) {
        formData.email = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@autodiscovery.demo`;
      }
      if (!formData.password) formData.password = 'demo-key-auth';
    }

    setIsSubmitting(true);
    setError('');

    try {
      await signup(formData);
      vitals.success(`New account created: ${formData.firstName} ${formData.lastName}`);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Sign-up failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── Progress ────────────────────────────────────────────

  const currentStep = step === 'choose-method' ? 1
    : step === 'credentials' || step === 'simulating' ? 2
    : 3;

  // ─── Render ──────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 ad-gradient-navy" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-ad-gold/10 rounded-full blur-3xl" />

      {/* Demo Banner */}
      {mode === 'demoland' && (
        <div className="relative z-20 ad-gradient-gold text-amber-950 text-center text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2 tracking-wide uppercase">
          <Shield className="w-3.5 h-3.5" />
          Demo Mode — All authentication is simulated
          <Shield className="w-3.5 h-3.5" />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg space-y-6 ad-animate-fade-up">

          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ad-gold/10 mb-4 ad-glow-gold relative">
              <Scale className="w-8 h-8 text-ad-gold" />
              <div className="absolute -inset-px rounded-2xl border border-ad-gold/20" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Join Auto<span className="text-ad-gold">Discovery</span>
            </h1>
            <p className="text-blue-200/60 mt-1.5 text-sm">
              Create your legal discovery account
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                {i > 0 && (
                  <div className={`w-10 h-0.5 rounded ${currentStep > s - 1 ? 'bg-ad-gold' : 'bg-white/10'}`} />
                )}
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  currentStep >= s ? 'bg-ad-gold/20 text-ad-gold border border-ad-gold/40' : 'bg-white/5 text-white/30 border border-white/10'
                }`}>
                  {currentStep > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
              </div>
            ))}
          </div>

          {/* Card — Glass Effect */}
          <div className="ad-glass rounded-2xl p-7 ad-border-glow">

            {/* ── STEP: Choose method ── */}
            {step === 'choose-method' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-blue-200/70 uppercase tracking-wider mb-1">Step 1</h2>
                  <p className="text-white font-medium">Choose your authentication method</p>
                </div>
                <div className="space-y-2">
                  {SIGNUP_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => selectMethod(m.id)}
                      className="w-full group flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-ad-gold/30 hover:bg-ad-gold/5 transition-all text-left"
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 group-hover:bg-ad-gold/10 transition-colors">
                        <m.icon className="w-4.5 h-4.5 text-blue-200/50 group-hover:text-ad-gold transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{m.label}</span>
                          {m.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-ad-gold/10 text-ad-gold/80 rounded">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-blue-200/40 mt-0.5 truncate">{m.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP: Simulating ── */}
            {step === 'simulating' && (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ad-gold/10 ad-glow-gold mb-5">
                  {selectedMethod === 'pgp-key' && <KeyRound className="w-7 h-7 text-ad-gold" />}
                  {selectedMethod === 'yubikey' && <KeyRound className="w-7 h-7 text-ad-gold" />}
                  {selectedMethod === 'did-wallet' && <Shield className="w-7 h-7 text-ad-gold" />}
                  {selectedMethod === 'trezor' && <HardDrive className="w-7 h-7 text-ad-gold" />}
                  {selectedMethod === 'biometric' && <Fingerprint className="w-7 h-7 text-ad-gold" />}
                  {selectedMethod === 'chrome-oauth' && <Globe className="w-7 h-7 text-ad-gold" />}
                  {selectedMethod === 'brave-oauth' && <Smartphone className="w-7 h-7 text-ad-gold" />}
                </div>
                <Loader2 className="w-6 h-6 text-ad-gold animate-spin mx-auto mb-4" />
                <p className="text-sm font-medium text-white mb-1">{simulationStatus}</p>
                <p className="text-[10px] text-blue-200/30 uppercase tracking-wider">Simulated demo flow</p>
              </div>
            )}

            {/* ── STEP: Email credentials ── */}
            {step === 'credentials' && selectedMethod === 'email' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-blue-200/70 uppercase tracking-wider mb-1">Step 2</h2>
                  <p className="text-white font-medium">Create your credentials</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-blue-200/70 block mb-1.5">First Name</label>
                    <input type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                      placeholder="Sarah" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-200/70 block mb-1.5">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                      placeholder="Mitchell" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-blue-200/70 block mb-1.5">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                    placeholder="sarah@firm.com" />
                </div>

                <div>
                  <label className="text-xs font-medium text-blue-200/70 block mb-1.5">Password</label>
                  <input type="password" value={formData.password} onChange={(e) => updateField('password', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                    placeholder="At least 6 characters" />
                </div>

                <div>
                  <label className="text-xs font-medium text-blue-200/70 block mb-1.5">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                    placeholder="Re-enter password" />
                </div>

                {error && (
                  <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">{error}</div>
                )}

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => { setStep('choose-method'); setError(''); }}
                    className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/70 rounded-xl font-medium text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button type="button" onClick={handleCredentialsNext}
                    className="flex-[2] py-2.5 ad-gradient-gold text-amber-950 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP: Professional profile (all methods) ── */}
            {step === 'profile' && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-semibold text-blue-200/70 uppercase tracking-wider mb-1">Step 3</h2>
                    <p className="text-white font-medium">Professional details</p>
                  </div>

                  {/* Method confirmation badge */}
                  {selectedMethod && selectedMethod !== 'email' && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">
                        {selectedMethod === 'pgp-key' && 'PGP hardware key verified'}
                        {selectedMethod === 'yubikey' && 'YubiKey FIDO2 verified'}
                        {selectedMethod === 'did-wallet' && 'DID wallet connected'}
                        {selectedMethod === 'trezor' && 'Trezor wallet connected — Ed25519'}
                        {selectedMethod === 'biometric' && 'Biometric identity verified — FIDO2'}
                        {selectedMethod === 'chrome-oauth' && 'Google account linked'}
                        {selectedMethod === 'brave-oauth' && 'Brave identity linked'}
                      </span>
                    </div>
                  )}

                  {/* Crypto metadata display */}
                  {formData.pgpFingerprint && (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[10px] text-blue-200/40 uppercase tracking-wider mb-1">PGP Key Fingerprint</p>
                      <p className="text-xs font-mono text-white/70">{formData.pgpFingerprint}</p>
                    </div>
                  )}
                  {formData.didUri && (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[10px] text-blue-200/40 uppercase tracking-wider mb-1">Decentralized Identifier</p>
                      <p className="text-xs font-mono text-white/70 break-all">{formData.didUri}</p>
                    </div>
                  )}
                  {formData.trezorPublicKey && (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[10px] text-blue-200/40 uppercase tracking-wider mb-1">Trezor Ed25519 Public Key</p>
                      <p className="text-xs font-mono text-white/70 break-all">{formData.trezorPublicKey}</p>
                    </div>
                  )}
                  {formData.biometricType && (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[10px] text-blue-200/40 uppercase tracking-wider mb-1">Biometric Method</p>
                      <p className="text-xs font-mono text-white/70 capitalize">{formData.biometricType} — FIDO2 WebAuthn</p>
                    </div>
                  )}

                  {/* Name for non-email methods */}
                  {selectedMethod !== 'email' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-blue-200/70 block mb-1.5">First Name</label>
                        <input type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                          placeholder="Sarah" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-blue-200/70 block mb-1.5">Last Name</label>
                        <input type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                          placeholder="Mitchell" />
                      </div>
                    </div>
                  )}

                  {/* Email for non-OAuth, non-email methods */}
                  {selectedMethod !== 'email' && !formData.oauthProvider && (
                    <div>
                      <label className="text-xs font-medium text-blue-200/70 block mb-1.5">Email <span className="text-blue-200/30">(for notifications)</span></label>
                      <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                        placeholder="sarah@firm.com" />
                    </div>
                  )}
                  {formData.oauthProvider && (
                    <div>
                      <label className="text-xs font-medium text-blue-200/70 block mb-1.5">Email <span className="text-blue-200/30">(from {formData.oauthProvider === 'chrome' ? 'Google' : 'Brave'})</span></label>
                      <input type="email" value={formData.email} readOnly
                        className="w-full px-3 py-2.5 rounded-xl bg-white/3 border border-white/5 text-sm text-white/50" />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-blue-200/70 block mb-1.5">Legal Role</label>
                    <select value={formData.role} onChange={(e) => updateField('role', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all [&>option]:bg-slate-900 [&>option]:text-white">
                      <option value="">Select your role</option>
                      {LEGAL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-blue-200/70 block mb-1.5">Firm / Organization</label>
                    <input type="text" value={formData.firm} onChange={(e) => updateField('firm', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                      placeholder="e.g. Mitchell & Associates LLP" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-blue-200/70 block mb-1.5">Primary Jurisdiction</label>
                    <select value={formData.jurisdiction} onChange={(e) => updateField('jurisdiction', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all [&>option]:bg-slate-900 [&>option]:text-white">
                      <option value="">Select jurisdiction</option>
                      {JURISDICTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>

                  {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">{error}</div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button type="button"
                      onClick={() => { setStep('choose-method'); setError(''); setSelectedMethod(null); }}
                      className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/70 rounded-xl font-medium text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                      <ArrowLeft className="w-3.5 h-3.5" /> Start Over
                    </button>
                    <button type="submit" disabled={isSubmitting}
                      className="flex-[2] py-2.5 ad-gradient-gold text-amber-950 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                      ) : (
                        <><Lock className="w-4 h-4" /> Create Account</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Login link */}
            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-xs text-blue-200/40">
                Already have an account?{' '}
                <a href="/login" className="text-ad-gold font-medium hover:text-ad-gold/80 transition-colors">Sign in</a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-wider text-blue-300/30 font-medium">
              <span>Midnight Blockchain</span>
              <span className="w-1 h-1 rounded-full bg-blue-400/20" />
              <span>Tamper-Proof Records</span>
              <span className="w-1 h-1 rounded-full bg-blue-400/20" />
              <span>Privacy-First</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
