import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

// Build the renderer separately; keep generated server code out of the Pages artifact.
const output = path.resolve("node_modules/.cache/site-prerender");
await build({
  configFile: false,
  logLevel: "error",
  esbuild: { jsx: "automatic" },
  build: {
    ssr: "scripts/render-home.tsx",
    outDir: output,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "home.mjs" } },
  },
});
const { renderHome } = await import(
  pathToFileURL(path.join(output, "home.mjs"))
);
const indexPath = path.resolve("dist/index.html");
const html = await readFile(indexPath, "utf8");
const rootPattern =
  /<div id="root">[\s\S]*?<div id="site-bootstrap" role="status">読み込み中…<\/div>[\s\S]*?<\/div>/;
if (!rootPattern.test(html))
  throw new Error("Home HTML placeholder is missing");
const rendered = renderHome();
if (!rendered.includes('id="hero"'))
  throw new Error("Home renderer returned no hero");
await writeFile(
  indexPath,
  html.replace(
    rootPattern,
    `<div id="root" data-prerender="home">${rendered}</div>`
  )
);
console.log("Home HTML generated from the current React components.");
