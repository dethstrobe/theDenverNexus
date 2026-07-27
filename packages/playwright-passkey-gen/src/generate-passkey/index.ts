import { generateKeyPairSync, randomBytes } from "node:crypto"
import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { Command, type OptionValues } from "commander"

export interface TestPasskey {
  username: string
  userId: string
  rpId: string
  id: string
  userHandle: string
  privateKey: string
  publicKey: string
}

function toBase64Url(buffer: Buffer): string {
  return buffer.toString("base64url")
}

/**
 * Generate a test passkey credential.
 *
 * A passkey is just an ECDSA P-256 keypair plus some WebAuthn bookkeeping
 * (credential id, user handle). None of that requires a real authenticator
 * ceremony, so this generates it directly with node:crypto rather than
 * driving a browser through Playwright's virtual WebAuthn authenticator.
 *
 * @param username - Username to associate with the credential.
 * @param userId - User ID to associate with the credential; also encoded
 * as the WebAuthn user handle.
 * @param rpId - Relying party id the credential is scoped to.
 * @returns The generated passkey, with all binary fields base64url-encoded
 * to match what Playwright's `context.credentials.create()` expects.
 */
export function generateTestPasskey(
  username: string,
  userId: string,
  rpId = "localhost",
): TestPasskey {
  const { publicKey, privateKey } = generateKeyPairSync("ec", {
    namedCurve: "P-256",
  })

  return {
    username,
    userId,
    rpId,
    id: toBase64Url(randomBytes(16)),
    userHandle: toBase64Url(Buffer.from(userId, "utf8")),
    privateKey: toBase64Url(
      privateKey.export({ format: "der", type: "pkcs8" }),
    ),
    publicKey: toBase64Url(publicKey.export({ format: "der", type: "spki" })),
  }
}

interface Options extends OptionValues {
  output: string
  type: "json" | "ts" | "js" | "javascript" | "typescript"
  username: string
  userId: string
}

export async function main({
  output = "test-passkey.ts",
  type = "ts",
  username = "testuser",
  userId = crypto.randomUUID(),
}: Partial<Options> = {}) {
  console.log("Generating test passkey...")
  console.log(`Username: ${username}`)
  console.log(`User ID: ${userId}`)

  const passkey = generateTestPasskey(username, userId)

  // Map type to file extension
  const extensionMap: Record<string, string> = {
    json: ".json",
    js: ".js",
    javascript: ".js",
    ts: ".ts",
    typescript: ".ts",
  }
  const ext = extensionMap[type] || ".ts"
  output = output.replace(/\.\w+$/, "") + ext

  const outputPath = join(process.cwd(), output)
  const stringifyPasskey = JSON.stringify(passkey, null, 2)
  const content =
    type === "json"
      ? stringifyPasskey
      : `export const TESTPASSKEY = ${stringifyPasskey}`

  writeFileSync(outputPath, content)
  console.log(`✓ Test passkey generated and saved to ${outputPath}`)
  console.log("\nGenerated passkey:")
  console.log(stringifyPasskey)
}

export async function runCli(argv = process.argv) {
  const program = new Command()
  program
    .option(
      "-o, --output <path>",
      "output path for generated passkey",
      "test-passkey.ts",
    )
    .option(
      "-t, --type <type>",
      "output file type (json, ts, js, typescript, javascript)",
      "ts",
    )
    .option(
      "-u, --username <username>",
      "username for the credential",
      "testuser",
    )
    .option(
      "-i, --user-id <userId>",
      "user id for the credential (defaults to a random UUID)",
    )
    .parse(argv)

  const opts = program.opts()
  await main(opts)
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  runCli().catch(console.error)
}
