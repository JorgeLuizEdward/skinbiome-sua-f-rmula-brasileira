import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  cloudflare: false, // Isso precisa estar aqui para desligar o build da Cloudflare
  plugins: [netlify()],
  tanstackStart: {
    server: { entry: "server" },
  },
});
