import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config"

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          MAILGUN_API_KEY: "test-key",
          MAILING_LIST_ADDRESS: "newsletter@example.com",
        },
      },
    },
  },
})
