# @test2doc/playwright-passkey

Playwright utilities for testing passkeys (WebAuthn) in your end-to-end tests.

## Installation

```bash
npm install -D @test2doc/playwright-passkey
# or
pnpm add -D @test2doc/playwright-passkey
# or
yarn add -D @test2doc/playwright-passkey
```

## Prerequisites

This package requires `@playwright/test` as a peer dependency:

```bash
npm install -D @playwright/test
```

## Usage

### Basic Setup

```typescript
import { test, expect } from '@playwright/test';
import { 
  enableVirtualAuthenticator, 
  addPasskeyCredential,
  simulateSuccessfulPasskeyInput 
} from '@test2doc/playwright-passkey';

test('user can sign in with passkey', async ({ page }) => {
  // Enable virtual authenticator
  const authenticator = await enableVirtualAuthenticator(page);

  // Add a test passkey credential
  const testPasskey = {
    username: 'testuser',
    userId: 'user-123',
    credentialId: 'cred-abc',
    publicKey: [/* ... */],
    privateKey: 'base64-encoded-private-key',
    credentialDbId: 'db-id-123',
    signCount: 0
  };

  await addPasskeyCredential(authenticator, testPasskey);

  // Navigate to your login page
  await page.goto('https://example.com/login');

  // Simulate successful passkey authentication
  await simulateSuccessfulPasskeyInput(authenticator, async () => {
    await page.getByRole('button', { name: 'Sign in with Passkey' });
  });

  // Assert user is logged in
  await expect(page.getByRole('header', { name: 'Logged in page' })).toBeVisible();
});
```

## API Reference

### `enableVirtualAuthenticator(page, options?)`

Enable a virtual WebAuthn authenticator for a Playwright page.

**Parameters:**
- `page` (Page) - Playwright Page instance to attach the virtual authenticator to
- `options` (VirtualAuthenticatorOptions, optional) - Configuration options

**Returns:** `Promise<AuthenticatorSession>` - Session object with CDP client and authenticator ID

**Options:**
```typescript
{
  protocol?: "ctap2" | "u2f",              // Default: "ctap2"
  transport?: "usb" | "nfc" | "ble" | "cable" | "internal",  // Default: "internal"
  hasResidentKey?: boolean,                 // Default: true
  hasUserVerification?: boolean,            // Default: true
  isUserVerified?: boolean,                 // Default: true
  automaticPresenceSimulation?: boolean     // Default: true
}
```

### `addPasskeyCredential(authenticatorSession, testPasskey)`

Add a passkey credential to the virtual authenticator. If you need a testPasskey, try the `npx @test2doc/playwright-passkey-gen`.

**Parameters:**
- `authenticatorSession` (AuthenticatorSession) - Session from `enableVirtualAuthenticator()`
- `testPasskey` (TestPasskey) - Credential data to add

**Returns:** `Promise<void>`

**TestPasskey Interface:**
```typescript
{
  username: string;
  userId: string;
  credentialId: string;
  publicKey: number[];
  privateKey: string;
  credentialDbId: string;
  signCount: number;
}
```

### `simulateSuccessfulPasskeyInput(authenticatorSession, operationTrigger)`

Simulate a successful passkey input event (registration or authentication).

**Parameters:**
- `authenticatorSession` (AuthenticatorSession) - Session from `enableVirtualAuthenticator()`
- `operationTrigger` (() => Promise<void>) - Function that triggers the passkey operation (e.g., clicking a button)

**Returns:** `Promise<void>`

## Generating Test Passkeys

For generating test passkey credentials, see [@test2doc/playwright-passkey-gen](https://www.npmjs.com/package/@test2doc/playwright-passkey-gen).

## How It Works

This package uses Chromium DevTools Protocol (CDP) to:
1. Create a virtual WebAuthn authenticator in the browser
2. Add passkey credentials to the virtual authenticator
3. Simulate user presence and verification during WebAuthn operations

This allows you to test passkey flows without requiring physical authenticators or manual user interaction.

## License

Apache-2.0
