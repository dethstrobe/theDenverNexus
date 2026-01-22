import { spawn } from "child_process"

const server = spawn("pnpm", ["start"], { stdio: "inherit" })

const killServer = () => {
  try {
    if (server && !server.killed) server.kill()
  } catch {
    console.log("*** Failed to kill server ***")
    process.exit(1)
  }
}

;["exit", "SIGINT", "SIGTERM", "uncaughtException"].forEach((ev) => {
  process.on(ev, () => {
    killServer()
    // for signals/uncaught exceptions exit with non-zero
    if (ev !== "exit") process.exit(1)
  })
})

// run the local vitest via pnpm exec so it works in CI/Windows too
const tests = spawn("pnpm", ["exec", "vitest", "run"], { stdio: "inherit" })

tests.on("close", (code) => {
  killServer()
  process.exit(code ?? 0)
})
tests.on("error", (err) => {
  killServer()
  console.error(err)
  process.exit(1)
})
