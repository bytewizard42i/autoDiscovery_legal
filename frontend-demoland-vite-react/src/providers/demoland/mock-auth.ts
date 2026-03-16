import type { IAuthProvider, AuthMethod, Credentials, AuthSession, SignUpData } from '../types';

const STORAGE_KEY = 'autodiscovery_demo_users';

const DEMO_USERS: Record<string, AuthSession> = {
  'demo@autodiscovery.legal': {
    userId: 'user-001',
    displayName: 'Sarah Mitchell',
    email: 'demo@autodiscovery.legal',
    role: 'prosecution',
    publicKey: '0xDEMO_PK_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    authMethod: 'email',
    authenticatedAt: new Date().toISOString(),
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readStoredUsers(): SignUpData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStoredUsers(users: SignUpData[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export class MockAuthProvider implements IAuthProvider {
  private session: AuthSession | null = null;

  async login(method: AuthMethod, credentials?: Credentials): Promise<AuthSession> {
    // Simulate auth delay per method
    const delays: Record<string, number> = {
      email: 800, yubikey: 1500, trezor: 2000, 'pgp-key': 1500,
      'did-wallet': 1800, biometric: 1200, 'chrome-oauth': 1000, 'brave-oauth': 1000,
    };
    await delay(delays[method] || 800);

    // Check stored users first for email login
    if (method === 'email' && credentials?.email) {
      const stored = readStoredUsers();
      const found = stored.find((u) => u.email.toLowerCase() === credentials.email!.toLowerCase());
      if (found) {
        this.session = {
          userId: `demo-${found.email}`,
          displayName: `${found.firstName} ${found.lastName}`,
          email: found.email,
          role: 'prosecution',
          publicKey: `0xDEMO_PK_${found.email.replace(/[@.]/g, '')}`,
          authMethod: method,
          authenticatedAt: new Date().toISOString(),
        };
        return this.session;
      }
    }

    // Fallback: default demo user
    const session: AuthSession = {
      ...DEMO_USERS['demo@autodiscovery.legal'],
      authMethod: method,
      authenticatedAt: new Date().toISOString(),
      email: credentials?.email || 'demo@autodiscovery.legal',
    };

    this.session = session;
    return session;
  }

  async signup(data: SignUpData): Promise<AuthSession> {
    await delay(800);

    const existingUsers = readStoredUsers();
    const alreadyExists = existingUsers.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (alreadyExists) {
      throw new Error(`An account with email "${data.email}" already exists.`);
    }

    existingUsers.push(data);
    writeStoredUsers(existingUsers);

    this.session = {
      userId: `demo-${data.email}`,
      displayName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: 'prosecution',
      publicKey: `0xDEMO_PK_${data.email.replace(/[@.]/g, '')}`,
      authMethod: data.signupMethod,
      authenticatedAt: new Date().toISOString(),
    };

    console.log(`[demoLand] New user signed up: ${data.firstName} ${data.lastName} (${data.email})`);
    return this.session;
  }

  async logout(): Promise<void> {
    await delay(300);
    this.session = null;
  }

  getSession(): AuthSession | null {
    return this.session;
  }

  getPublicKey(): string | null {
    return this.session?.publicKey ?? null;
  }

  isAuthenticated(): boolean {
    return this.session !== null;
  }

  listSignedUpUsers(): SignUpData[] {
    return readStoredUsers();
  }
}
