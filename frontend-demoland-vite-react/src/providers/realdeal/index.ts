import type { Providers } from '../types';
import { RealCaseProvider } from './real-case';
import { MockAuthProvider } from '../demoland/mock-auth';
import { MockDocumentProvider } from '../demoland/mock-document';
import { MockComplianceProvider } from '../demoland/mock-compliance';
import { MockAIProvider } from '../demoland/mock-ai';
import { createMockContactProvider } from '../demoland/mock-contacts';
import { createMockEmailSafetyProvider } from '../demoland/mock-email-safety';
import { MockAccessControlProvider } from '../demoland/mock-access-control';
import { MockJurisdictionProvider } from '../demoland/mock-jurisdiction';
import { MockExpertWitnessProvider } from '../demoland/mock-expert-witness';

export function createRealProviders(): Providers {
  return {
    auth: new MockAuthProvider(),          // Phase 2: LaceAuthProvider
    cases: new RealCaseProvider(),         // REAL — wired to discovery-core
    documents: new MockDocumentProvider(), // Phase 2: wired to document-registry
    compliance: new MockComplianceProvider(),
    ai: new MockAIProvider(),
    contacts: createMockContactProvider(),
    emailSafety: createMockEmailSafetyProvider(),
    accessControl: new MockAccessControlProvider(),
    jurisdiction: new MockJurisdictionProvider(),
    expertWitness: new MockExpertWitnessProvider(),
  };
}
