import { defineConfig } from "vite"
import { redwood } from "rwsdk/vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  environments: {
    ssr: {},
  },
  plugins: [redwood(), tailwindcss()],
  build: {
    rollupOptions: {
      external: [
        "src/setupTests.ts",
        "src/test/msw.ts",
        /\.test\.(ts|tsx)$/,
        /\.mock\.(ts|tsx)$/,
        /__tests__/,
        /__mocks__/,
      ],
    },
  },
})
