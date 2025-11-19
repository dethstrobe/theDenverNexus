import type { CDPSession, Page } from "@playwright/test"
import type { TestPasskey } from "./generate-passkey/index.js"

interface PasskeyAuthenticator {
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

export async function enablePasskey(
  page: Page,
  options: VirtualAuthenticatorOptions = {
    protocol: "ctap2",
    transport: "internal",
    hasResidentKey: true,
    hasUserVerification: true,
    isUserVerified: true,
    automaticPresenceSimulation: true,
  },
): Promise<PasskeyAuthenticator> {
  const client: CDPSession = await page.context().newCDPSession(page)
  await client.send("WebAuthn.enable")

  const result = await client.send("WebAuthn.addVirtualAuthenticator", {
    options,
  })
  const authenticatorId = result.authenticatorId

  return { client, authenticatorId }
}

export async function addPasskeyCredential(
  { client, authenticatorId }: PasskeyAuthenticator,
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

export async function simulateSuccessfulPasskeyInput(
  { client, authenticatorId }: PasskeyAuthenticator,
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
