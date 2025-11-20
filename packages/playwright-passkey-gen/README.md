# @test2doc/playwright-passkey-gen

A CLI tool and library for generating test passkey credentials for WebAuthn testing with Playwright.

## Usage CLI

Generate a test passkey file from the command line:

```bash
# Generate a TypeScript file (default)
npx playwright-passkey

# Generate with custom output path
npx playwright-passkey --output path/to/my-passkey.ts

# Generate JSON file
npx playwright-passkey --type json

# Generate JavaScript file
npx playwright-passkey --type js
```

**CLI Options:**
- `-o, --output <path>` - Output path for generated passkey (default: `test-passkey.ts`)
- `-t, --type <type>` - Output file type: `json`, `ts`, `js`, `typescript`, `javascript` (default: `ts`)

## Installation

```bash
npm install -D @test2doc/playwright-passkey-gen
# or
pnpm add -D @test2doc/playwright-passkey-gen
# or
yarn add -D @test2doc/playwright-passkey-gen
```

### Programmatic API

```typescript
import { generateTestPasskey, main } from '@test2doc/playwright-passkey-gen';

// Generate a passkey programmatically
const passkey = await generateTestPasskey('testuser', 'user-123');

// Or use the main function with options
await main({
  output: 'my-passkey.ts',
  type: 'ts'
});
```

## Generated Output

The tool generates a test passkey credential with the following structure:

**TypeScript/JavaScript:**
```typescript
export const TESTPASSKEY = {
  username: "testuser",
  userId: "550e8400-e29b-41d4-a716-446655440000",
  credentialId: "base64-encoded-credential-id",
  publicKey: [/* array of numbers */],
  privateKey: "base64-encoded-private-key",
  credentialDbId: "base64url-encoded-credential-id",
  signCount: 1
}
```

**JSON:**
```json
{
  "username": "testuser",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "credentialId": "base64-encoded-credential-id",
  "publicKey": [/* array of numbers */],
  "privateKey": "base64-encoded-private-key",
  "credentialDbId": "base64url-encoded-credential-id",
  "signCount": 1
}
```

## Using Generated Passkeys

Use the generated passkeys with [@test2doc/playwright-passkey](https://www.npmjs.com/package/@test2doc/playwright-passkey) for testing:

```typescript
import { test } from '@playwright/test';
import { enableVirtualAuthenticator, addPasskeyCredential } from '@test2doc/playwright-passkey';
import { TESTPASSKEY } from './test-passkey';

test('authenticate with passkey', async ({ page }) => {
  const authenticator = await enableVirtualAuthenticator(page);
  await addPasskeyCredential(authenticator, TESTPASSKEY);
  
  // Your test code here
});
```

## How It Works

This tool:
1. Launches a Chromium browser with Playwright
2. Creates a virtual WebAuthn authenticator using Chrome DevTools Protocol
3. Simulates a passkey registration flow
4. Extracts and verifies the generated credential
5. Outputs the credential in your chosen format

The generated credentials are fully functional test passkeys that can be used with virtual authenticators in Playwright tests.

## API Reference

### `generateTestPasskey(username, userId)`

Generate a test passkey credential programmatically.

**Parameters:**
- `username` (string) - Username for the credential
- `userId` (string) - User ID (should be a UUID v4)

**Returns:** `Promise<TestPasskey>` - The generated passkey credential

### `main(options?)`

Generate and save a test passkey file.

**Parameters:**
- `options` (object, optional)
  - `output` (string) - Output file path (default: `"test-passkey.ts"`)
  - `type` (string) - Output type: `"json"`, `"ts"`, `"js"`, `"typescript"`, or `"javascript"` (default: `"ts"`)

**Returns:** `Promise<void>`

## Requirements

- Node.js 18+
- Chromium browser (automatically installed via Playwright)

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test

# Run unit tests only
pnpm unit

# Run CI tests (unit + e2e)
pnpm ci:test
```

## License

Apache-2.0

## Author

Null Sweat, LLC

## Related Packages

- [@test2doc/playwright-passkey](https://www.npmjs.com/package/@test2doc/playwright-passkey) - Playwright utilities for testing with passkeys