import {
  mkdtempSync,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync,
} from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import Test2DocReporter from ".."
export * from "./fixtures.js"

export const tempDir = mkdtempSync(join(tmpdir(), "test2doc-"))

export const setup = (outputDir = tempDir) => {
  return new Test2DocReporter({ outputDir })
}

export function testCleanup(dir = tempDir) {
  readdirSync(dir).forEach((file) => {
    const filePath = join(dir, file)
    if (statSync(filePath).isFile()) {
      unlinkSync(filePath)
    } else if (statSync(filePath).isDirectory()) {
      // If it's a directory, we can remove it recursively if needed
      testCleanup(filePath)
      if (readdirSync(filePath).length === 0) {
        rmdirSync(filePath)
      }
    }
  })
}
