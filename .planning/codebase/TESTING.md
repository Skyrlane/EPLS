# Testing Patterns

**Analysis Date:** 2026-02-19

## Test Framework

**Runner:**
- Jest 29.7.0
- Config: jest.config.js
- Environment: jest-environment-jsdom (browser-like testing)

**Assertion Library:**
- @testing-library/jest-dom 6.6.3 (custom matchers)
- Jest built-in expect API

**Run Commands:**
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report
```

## Test File Organization

**Location:**
- Co-located with source code in __tests__ subdirectories
- Example: hooks/__tests__/use-firebase-auth.test.ts tests hooks/use-firebase-auth.ts
- Test files in same directory as implementation

**Naming:**
- Pattern: [module-name].test.ts or [module-name].test.tsx
- Examples: use-firebase-auth.test.ts, use-firestore.test.ts, use-realtime-collection.test.ts

**File Structure:**
```
hooks/
├── use-firebase-auth.ts
├── use-firestore.ts
└── __tests__/
    ├── use-firebase-auth.test.ts
    ├── use-firestore.test.ts
    └── use-realtime-collection.test.ts
```

## Test Structure

**Suite Organization:**
- describe() blocks group related tests by feature/method
- French test names: 'devrait créer un nouvel utilisateur' (follows project language)
- beforeEach() clears all mocks between tests
- Use @testing-library/jest-dom imports for custom matchers

**Setup:**
- Global setup in jest.setup.js runs before all tests
- Polyfills TextEncoder/TextDecoder for Node environment
- Global mocks for next/router and next/image

## Mocking

**Framework:** Jest mocking with jest.mock() and jest.fn()

**Mock Firebase Auth:**
```typescript
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  auth: { currentUser: null },
}));
```

**Mock Implementation Pattern:**
```typescript
(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
  callback(mockUser);
  return jest.fn();
});
```

**What to Mock:**
- Firebase functions: createUserWithEmailAndPassword, getDocs, updateDoc
- External APIs: Airtable, storage services
- Next.js modules: next/router, next/image
- Module internals: Use jest.mock() at module root

**What NOT to Mock:**
- Pure utility functions: directly test their output
- Internal components: import and test directly
- TypeScript types: don't mock, just use as interfaces

## Fixtures and Factories

**Test Data:**
```typescript
const mockDocumentSnapshot = {
  id: 'test-doc-id',
  exists: () => true,
  data: () => ({ title: 'Test Document' }),
};

const mockQuerySnapshot = {
  docs: [mockDocumentSnapshot],
  empty: false,
  size: 1,
};
```

**Location:**
- Defined within test files before describe blocks
- Organized by feature/mock type
- Named with mock prefix for clarity

## Coverage

**Requirements:**
- Configured to collect coverage: collectCoverage: true
- Coverage tracked for: components/**, lib/**, src/**
- Excluded: .d.ts, node_modules/**, .next/**

**View Coverage:**
```bash
npm run test:coverage
```

## Test Types

**Unit Tests:**
- Scope: Individual hooks and utility functions
- Approach: Test function inputs and outputs directly
- Example: use-firebase-auth.test.ts tests login, register, logout methods
- Setup: Minimal mocks (Firebase only)

**Integration Tests:**
- Scope: Hook lifecycle (initialization, state changes, cleanup)
- Approach: Use renderHook with act for state updates
- Example: Testing onAuthStateChanged callback flow with user state transitions
- Setup: More complete mocks simulating Firebase behavior

**E2E Tests:**
- Status: Not implemented (no e2e test files found)
- Could use Cypress, Playwright, or similar
- Recommended for critical user flows like login/signup

## Common Patterns

**Async Testing:**
```typescript
it('devrait créer un nouvel utilisateur', async () => {
  (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
  const { result } = renderHook(() => useFirebaseAuth());

  await act(async () => {
    userCredential = await result.current.register('test@example.com', 'password123');
  });

  expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
    expect.anything(),
    'test@example.com',
    'password123'
  );
});
```

**Error Testing:**
```typescript
it('devrait gérer les erreurs', async () => {
  const error = { code: 'auth/email-already-in-use', message: 'Email already in use' };
  (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

  const { result } = renderHook(() => useFirebaseAuth());

  await act(async () => {
    userCredential = await result.current.register('existing@example.com', 'password123');
  });

  expect(result.current.error).toEqual(error);
});
```

## Test Configuration Files

**jest.config.js:**
- Configured with Next.js Jest plugin
- Module path mapping for @/ aliases
- Asset mocks for CSS and images
- jsdom test environment for DOM simulation

**jest.setup.js:**
- Imports @testing-library/jest-dom for extended matchers
- Global TextEncoder/TextDecoder polyfills (Node compatibility)
- Mock implementations for Next.js modules

## Current Test Coverage

**Tests Present:**
- hooks/__tests__/use-firebase-auth.test.ts - Comprehensive auth testing
- hooks/__tests__/use-firestore.test.ts - CRUD operations
- hooks/__tests__/use-realtime-collection.test.ts - Real-time subscriptions
- hooks/__tests__/use-realtime-document.test.ts - Real-time documents
- hooks/__tests__/use-storage.test.ts - File upload/download

**Tests Not Present:**
- Component tests (no .test.tsx files found)
- Page-level tests (routes not tested)
- Integration tests for multiple hooks together
- E2E tests

## Best Practices Observed

1. **Clear test names in French** - Matches project language
2. **Comprehensive error cases** - Tests both success and failure paths
3. **Mock lifecycle** - jest.clearAllMocks() in beforeEach prevents state bleed
4. **Realistic mock data** - Mock structures match actual Firestore/Firebase responses
5. **Async handling** - Proper use of act(), await, and waitFor()
6. **Type safety** - Cast mocks with as jest.Mock for TypeScript safety
7. **Isolation** - Each test is independent

## Gaps and Recommendations

**Coverage Gaps:**
- Component tests: No tests for UI components in components/ directory
- Page tests: Route handlers and page components untested
- Integration scenarios: Multi-hook workflows not tested
- E2E: User journey workflows not covered

**Future Test Additions:**
- Add component tests using React Testing Library (already installed)
- Add integration tests for feature workflows
- Consider E2E framework (Cypress or Playwright)
- Document test data factories for complex objects
- Add snapshot tests for UI stability

---

*Testing analysis: 2026-02-19*