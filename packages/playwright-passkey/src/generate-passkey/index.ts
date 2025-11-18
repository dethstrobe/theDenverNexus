import { chromium } from "@playwright/test"
import { writeFileSync } from "fs"
import { join } from "path"
import { verifyRegistrationResponse } from "@simplewebauthn/server"
import { Command, type OptionValues } from "commander"
import { fileURLToPath } from "url"

export interface TestPasskey {
  username: string
  userId: string
  credentialId: string
  publicKey: number[]
  privateKey: string
  credentialDbId: string
  signCount: number
}

interface VirtualAuthenticatorCredential {
  credentialId: string
  privateKey: string
  userHandle: string
  signCount: number
}

function isVirtualAuthenticatorCredential(
  cred: unknown,
): cred is VirtualAuthenticatorCredential {
  return (
    cred !== null &&
    typeof cred === "object" &&
    "credentialId" in cred &&
    "privateKey" in cred &&
    "userHandle" in cred &&
    "signCount" in cred
  )
}

async function generateTestPasskey(
  username: string,
  userId: string,
): Promise<TestPasskey> {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto("http://localhost:5173/")

  // Set up virtual authenticator
  const client = await context.newCDPSession(page)
  await client.send("WebAuthn.enable")
  const result = await client.send("WebAuthn.addVirtualAuthenticator", {
    options: {
      protocol: "ctap2",
      transport: "internal",
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  })

  const authenticatorId = result.authenticatorId

  // Generate a credential by simulating registration
  const credentialResponse = await page.evaluate(
    async ({ userId, username }) => {
      try {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: {
              name: "Test App",
              id: "localhost",
            },
            user: {
              id: new TextEncoder().encode(userId),
              name: username,
              displayName: username,
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          },
        })

        // Type guards
        function isPublicKeyCredential(
          credential: Credential | null,
        ): credential is PublicKeyCredential {
          return credential !== null && credential.type === "public-key"
        }
        function isAuthenticatorAttestationResponse(
          response: AuthenticatorResponse,
        ): response is AuthenticatorAttestationResponse {
          return "attestationObject" in response
        }

        if (!isPublicKeyCredential(credential)) {
          throw new Error("Failed to create public key credential")
        }
        if (!isAuthenticatorAttestationResponse(credential.response)) {
          throw new Error("Response is not an attestation response")
        }

        return {
          id: credential.id,
          rawId: Array.from(new Uint8Array(credential.rawId)),
          response: {
            clientDataJSON: Array.from(
              new Uint8Array(credential.response.clientDataJSON),
            ),
            attestationObject: Array.from(
              new Uint8Array(credential.response.attestationObject),
            ),
          },
          clientExtensionResults: {},
          transports: ["internal"],
          type: "public-key",
        }
      } catch (err) {
        throw new Error(`Credential creation failed: ${err}`)
      }
    },
    { userId, username },
  )

  // Extract the credential from the virtual authenticator
  const credentials = await client.send("WebAuthn.getCredentials", {
    authenticatorId,
  })

  if (!credentials.credentials || credentials.credentials.length === 0) {
    throw new Error("No credentials found in virtual authenticator")
  }

  const credential = credentials.credentials[0]
  if (!isVirtualAuthenticatorCredential(credential)) {
    throw new Error("Invalid credential structure from virtual authenticator")
  }

  const verification = await verifyRegistrationResponse({
    response: {
      id: credentialResponse.id,
      rawId: Buffer.from(credentialResponse.rawId).toString("base64url"),
      response: {
        clientDataJSON: Buffer.from(
          credentialResponse.response.clientDataJSON,
        ).toString("base64url"),
        attestationObject: Buffer.from(
          credentialResponse.response.attestationObject,
        ).toString("base64url"),
      },
      type: "public-key" as const,
      clientExtensionResults: {},
    },
    expectedChallenge: Buffer.from(new Uint8Array(32)).toString("base64url"), // the challenge you used
    expectedOrigin: "http://localhost:5173",
    expectedRPID: "localhost",
  })

  if (verification.verified && verification.registrationInfo) {
    const testPasskey: TestPasskey = {
      username,
      userId,
      credentialId: Buffer.from(credential.credentialId, "base64").toString(
        "base64",
      ),
      publicKey: Array.from(verification.registrationInfo.credential.publicKey),
      privateKey: credential.privateKey,
      credentialDbId: credentialResponse.id,
      signCount: credential.signCount,
    }

    await browser.close()

    return testPasskey
  }
  throw new Error("Failed to verify registration response")
}

interface Options extends OptionValues {
  output: string
}

export async function main({
  output = "test-passkey.ts",
}: Partial<Options> = {}) {
  const username = "testuser"
  const userId = crypto.randomUUID()

  console.log("Generating test passkey...")
  console.log(`Username: ${username}`)
  console.log(`User ID: ${userId}`)

  const passkey = await generateTestPasskey(username, userId)

  const outputPath = join(process.cwd(), output)
  const content = `export const TESTPASSKEY = ${JSON.stringify(passkey, null, 2)}
`

  writeFileSync(outputPath, content)
  console.log(`✓ Test passkey generated and saved to ${outputPath}`)
  console.log("\nGenerated passkey:")
  console.log(JSON.stringify(passkey, null, 2))
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const program = new Command()
  program
    .option(
      "-o, --output <path>",
      "output path for generated passkey",
      "test-passkey.ts",
    )
    .parse()

  const opts = program.opts()
  main(opts).catch(console.error)
}
