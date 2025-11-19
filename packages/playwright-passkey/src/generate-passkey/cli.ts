import { spawn } from "child_process"

const server = spawn("pnpm", ["start"], { stdio: "inherit" })

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

// Run the built generator (make sure pnpm build has run first)
const generator = spawn("node", ["./dist/src/generate-passkey/index.js"], {
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
