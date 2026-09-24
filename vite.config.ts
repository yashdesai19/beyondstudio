// TanStack Start Vite configuration
// Pre-bundled plugins: TanStack devtools, tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      port: 8080,
      allowedHosts: true,
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

