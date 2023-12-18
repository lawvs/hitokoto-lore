import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "build",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Lore",
      fileName: (format) => `main.${format === "cjs" ? "js" : format}.js`,
    },
  },
});
