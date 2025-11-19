import type { CDPSession, Page } from "@playwright/test"

export interface TestPasskey {
  username: string
  userId: string
  credentialId: string
  publicKey: number[]
  privateKey: string
  credentialDbId: string
  signCount: number
}

interface AuthenticatorSession {
  client: CDPSession
  authenticatorId: string
}

interface VirtualAuthenticatorOptions {
  protocol: "ctap2" | "u2f"
  transport: "usb" | "nfc" | "ble" | "cable" | "internal"
  hasResidentKey?: boolean
  hasUserVerification?: boolean
  isUserVerified?: boolean
  automaticPresenceSimulation?: boolean
}

/**
 * Enable a virtual WebAuthn authenticator for a Playwright page.
 *
 * @param {Page} page - Playwright Page instance to attach the virtual authenticator to.
 * @param {VirtualAuthenticatorOptions} [options] - Options for the virtual authenticator (protocol, transport, etc.).
 * @returns {Promise<AuthenticatorSession>} Resolves with the CDP session and the created authenticator ID.
 */
export async function enableVirtualAuthenticator(
  page: Page,
  options: VirtualAuthenticatorOptions = {
    protocol: "ctap2",
    transport: "internal",
    hasResidentKey: true,
    hasUserVerification: true,
    isUserVerified: true,
    automaticPresenceSimulation: true,
  },
): Promise<AuthenticatorSession> {
  const client: CDPSession = await page.context().newCDPSession(page)
  await client.send("WebAuthn.enable")

  const result = await client.send("WebAuthn.addVirtualAuthenticator", {
    options,
  })
  const authenticatorId = result.authenticatorId

  return { client, authenticatorId }
}

/**
 * Add a Passkey credential to the virtual authenticator.
 *
 * @param {AuthenticatorSession} authenticatorSession CDP session and Authenticator Id to add the Passkey Credentials to the Virtual Authenticator.
 * @param {TestPasskey} testPasskey The Passkey credential to add.
 */
export async function addPasskeyCredential(
  { client, authenticatorId }: AuthenticatorSession,
  testPasskey: TestPasskey,
): Promise<void> {
  await client.send("WebAuthn.addCredential", {
    authenticatorId,
    credential: {
      credentialId: Buffer.from(testPasskey.credentialId, "base64url").toString(
        "base64",
      ),
      isResidentCredential: true,
      rpId: "localhost",
      privateKey: testPasskey.privateKey,
      userHandle: Buffer.from(testPasskey.username, "utf8").toString("base64"),
      signCount: testPasskey.signCount,
    },
  })
}

/**
 * Simulate a successful passkey input event.
 *
 * @param {AuthenticatorSession} authenticatorSession CDP session and Authenticator Id to add the Passkey Credentials to the Virtual Authenticator.
 * @param {() => Promise<void>} operationTrigger Function to trigger the operation that requires passkey input.
 */
export async function simulateSuccessfulPasskeyInput(
  { client, authenticatorId }: AuthenticatorSession,
  operationTrigger: () => Promise<void>,
) {
  // initialize event listeners to wait for a successful passkey input event
  const operationCompleted = new Promise<void>((resolve) => {
    client.on("WebAuthn.credentialAdded", () => resolve())
    client.on("WebAuthn.credentialAsserted", () => resolve())
  })

  // set isUserVerified option to true
  // (so that subsequent passkey operations will be successful)
  await client.send("WebAuthn.setUserVerified", {
    authenticatorId: authenticatorId,
    isUserVerified: true,
  })

  // set automaticPresenceSimulation option to true
  // (so that the virtual authenticator will respond to the next passkey prompt)
  await client.send("WebAuthn.setAutomaticPresenceSimulation", {
    authenticatorId: authenticatorId,
    enabled: true,
  })

  // perform a user action that triggers passkey prompt
  await operationTrigger()

  // wait to receive the event that the passkey was successfully registered or verified
  await operationCompleted

  // set automaticPresenceSimulation option back to false
  await client.send("WebAuthn.setAutomaticPresenceSimulation", {
    authenticatorId,
    enabled: false,
  })
}
