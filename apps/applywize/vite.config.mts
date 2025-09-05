import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { redwood } from "rwsdk/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";

export default defineConfig({
  environments: {
    ssr: {},
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "worker" },
    }),
    redwood(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@generated": path.resolve(__dirname, "./generated/"),
      "@": path.resolve(__dirname, "./src/"),
    },
  },
});
