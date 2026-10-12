import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";

const runtimeScripts = ["app/api/service.js"];

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
      // GitHub Pages serves 404.html for unknown paths, so deep links like /write load the app
      cpSync(resolve(outDir, "index.html"), resolve(outDir, "404.html"));
      cpSync(resolve(root, "min"), resolve(outDir, "min"), {
        recursive: true,
      });
      runtimeScripts.forEach((script) => {
        const destination = resolve(outDir, script);
        mkdirSync(dirname(destination), { recursive: true });
        cpSync(resolve(root, script), destination);
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/padma-videogrep/" : "/",
  plugins: [copyRuntimeFiles()],
  build: {
    outDir: "build",
  },
}));
