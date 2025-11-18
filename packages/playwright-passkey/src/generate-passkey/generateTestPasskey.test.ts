import { expect, test } from "vitest"
import { mkdir, rmdir, unlink } from "node:fs/promises"
import { join } from "node:path"
import { main } from "./index.js"

test("generate a test passkey file", async () => {
  const outputPath = join(process.cwd(), "test-passkey.ts")
  // remove existing file if present
  try {
    await unlink(outputPath)
  } catch {
    // ignore if not present
  }
  await main()

  const { TESTPASSKEY } = await import(outputPath)
  const UUID_V4_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  expect(TESTPASSKEY.username).toBe("testuser")
  expect(TESTPASSKEY.userId).toMatch(UUID_V4_REGEX)
  expect(TESTPASSKEY.publicKey).toBeDefined()
  expect(Array.isArray(TESTPASSKEY.publicKey)).toBe(true)
  expect(TESTPASSKEY.signCount).toBe(1)

  expect(TESTPASSKEY.credentialId).toBeDefined()
  expect(TESTPASSKEY.credentialDbId).toBeDefined()
  // assert credentialDbId is the base64url encoding of credentialId
  const base64ToBase64url = (b64: string) =>
    b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
  expect(TESTPASSKEY.credentialDbId).toBe(
    base64ToBase64url(TESTPASSKEY.credentialId),
  )

  // cleanup
  try {
    await unlink(outputPath)
  } catch {}
})

test("generate a passkey to the output path specified", async () => {
  const tempDir = "tmp-output"
  const dir = join(process.cwd(), tempDir)
  const fileName = "my-passkey.ts"
  const outputPath = join(dir, fileName)

  // ensure clean slate
  try {
    await unlink(outputPath)
  } catch {}
  try {
    await rmdir(dir)
  } catch {}

  await mkdir(dir, { recursive: true })

  await main({ output: join(tempDir, fileName) })

  // assert file exists and has TESTPASSKEY
  const { TESTPASSKEY } = await import(outputPath)

  expect(TESTPASSKEY).toBeDefined()
  expect(TESTPASSKEY.username).toBe("testuser")
  expect(TESTPASSKEY.credentialId).toBeDefined()
  expect(TESTPASSKEY.credentialDbId).toBeDefined()

  // cleanup
  try {
    await unlink(outputPath)
    await rmdir(dir)
  } catch {}
})
