import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";

const runtimeScripts = [
  "app/utils/parser.js",
  "app/utils/storage.js",
  "app/api/service.js",
  "app/components/sceneBuilder.js",
  "app/components/playPanel.js",
  "app/components/generativityControls.js",
  "app/components/ui.js",
];

function copyRuntimeFiles() {
  let root;
  let outDir;

  return {
    name: "copy-oxjs-runtime",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
    },
    closeBundle() {
      cpSync(resolve(root, "min"), resolve(outDir, "min"), {
        recursive: true,
      });
      cpSync(
        resolve(root, "dist/nearley-bundle.js"),
        resolve(outDir, "dist/nearley-bundle.js"),
      );
      runtimeScripts.forEach((script) => {
        const destination = resolve(outDir, script);
        mkdirSync(dirname(destination), { recursive: true });
        cpSync(resolve(root, script), destination);
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [copyRuntimeFiles()],
  build: {
    outDir: "build",
  },
});