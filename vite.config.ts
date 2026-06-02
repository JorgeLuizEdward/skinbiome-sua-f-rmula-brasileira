import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  base: "./", // Garante que o app procure os assets na pasta certa, independente de onde for hospedado
  cloudflare: false,
  plugins: [netlify()],
  tanstackStart: {
    server: { entry: "server" },
  },
});
