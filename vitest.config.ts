import { defineConfig } from "vitest/config"
import tailwindcss from "@tailwindcss/vite"
import { redwood } from "rwsdk/vite"

export default defineConfig({
  environments: {
    ssr: {},
  },
  plugins: [redwood(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
  },
})
