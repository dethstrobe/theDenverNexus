import { spawn } from "child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

// When installed via npm, the server will be in a different location
const serverPath = join(__dirname, "../scripts/server.js")

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

// Run the generator from the same directory
const generatorPath = join(__dirname, "index.js")
const generator = spawn("node", [generatorPath], {
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
