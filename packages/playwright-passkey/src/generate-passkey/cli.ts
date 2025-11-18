import { spawn } from "child_process"

const server = spawn("pnpm", ["start"], { shell: true })

process.on("exit", () => server.kill())
process.on("SIGINT", () => {
  server.kill()
  process.exit()
})

const generator = spawn("node", ["./src/generate-passkey/index.ts"], {
  shell: true,
  stdio: "inherit",
})

generator.on("close", (code) => {
  server.kill()
  process.exit(code)
})
