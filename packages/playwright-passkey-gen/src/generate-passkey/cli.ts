import { spawn } from "child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

// When running from src/, go up to find dist/
// When installed via npm, we're already in dist/
const isInDist = __dirname.includes("/dist/")
const distRoot = isInDist
  ? join(__dirname, "../..")
  : join(__dirname, "../../dist")

const serverPath = join(distRoot, "src/scripts/server.js")

const server = spawn("node", [serverPath], { stdio: "inherit" })

const killServer = () => {
  try {
    if (server && !server.killed) server.kill()
  } catch {
    /* ignore */
  }
}

;["exit", "SIGINT", "SIGTERM", "uncaughtException"].forEach((ev) => {
  process.on(ev, () => {
    killServer()
    if (ev !== "exit") process.exit(1)
  })
})

// Run the generator - same logic
const generatorPath = isInDist
  ? join(__dirname, "index.js")
  : join(distRoot, "src/generate-passkey/index.js")

// Forward all CLI arguments (skip first 2: node path and script path. Skip third if it's "--")
const args = process.argv.slice(process.argv[2] === "--" ? 3 : 2)

const generator = spawn("node", [generatorPath, ...args], {
  stdio: "inherit",
})

generator.on("close", (code) => {
  killServer()
  process.exit(code ?? 0)
})
generator.on("error", (err) => {
  killServer()
  console.error(err)
  process.exit(1)
})
