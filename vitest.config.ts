import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@zylo/three-engine": path.resolve(__dirname, "./packages/three-engine/src/index.ts"),
      "@zylo/three-engine/*": path.resolve(__dirname, "./packages/three-engine/src/*"),
      "@zylo/ai": path.resolve(__dirname, "./packages/ai/src/index.ts"),
      "@zylo/ai/*": path.resolve(__dirname, "./packages/ai/src/*"),
    },
  },
});
