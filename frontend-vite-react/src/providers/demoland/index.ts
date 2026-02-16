import type { Providers } from '../types';
import { MockAuthProvider } from './mock-auth';
import { MockCaseProvider } from './mock-case';
import { MockDocumentProvider } from './mock-document';
import { MockComplianceProvider } from './mock-compliance';
import { MockAIProvider } from './mock-ai';
import { createMockContactProvider } from './mock-contacts';

export function createDemoProviders(): Providers {
  return {
    auth: new MockAuthProvider(),
    cases: new MockCaseProvider(),
    documents: new MockDocumentProvider(),
    compliance: new MockComplianceProvider(),
    ai: new MockAIProvider(),
    contacts: createMockContactProvider(),
  };
}
