import react from "@vitejs/plugin-react-swc";
import fs from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { createBrotliDecompress } from "node:zlib";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const mimeTypes: Record<string, string> = {
  ".js": "application/javascript",
  ".wasm": "application/wasm",
  ".html": "text/html",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function inside(root: string, candidate: string) {
  const relative = path.relative(root, candidate);
  return (
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

async function isFile(file: string) {
  try {
    return (await fsp.stat(file)).isFile();
  } catch {
    return false;
  }
}

/** GitHub Pages cannot attach Content-Encoding headers to Unity Brotli builds. */
async function copyGameAssets(
  source: string,
  destination: string
): Promise<void> {
  await fsp.mkdir(destination, { recursive: true });
  for (const entry of await fsp.readdir(source, { withFileTypes: true })) {
    const input = path.join(source, entry.name);
    const output = path.join(destination, entry.name);
    if (entry.isDirectory()) await copyGameAssets(input, output);
    else if (entry.isFile()) {
      if (entry.name.endsWith(".br")) {
        // Preserve original URLs while supplying uncompressed files to our player.
        await fsp.copyFile(input, output);
        if (!(await isFile(input.slice(0, -3)))) {
          await pipeline(
            fs.createReadStream(input),
            createBrotliDecompress(),
            fs.createWriteStream(output.slice(0, -3))
          );
        }
      } else await fsp.copyFile(input, output);
    }
  }
}

function gamedataPlugin(): Plugin {
  let root: string;
  let outDir: string;
  let base: string;
  return {
    name: "gamedata",
    configResolved(config) {
      root = path.resolve(config.root, "Gamedata");
      outDir = path.resolve(config.root, config.build.outDir, "Gamedata");
      base = `${config.base}Gamedata/`;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? "").split("?")[0];
        if (!pathname.startsWith(base)) return next();
        if (req.method !== "GET" && req.method !== "HEAD") {
          res.statusCode = 405;
          res.end();
          return;
        }
        let requested: string;
        try {
          requested = path.resolve(
            root,
            decodeURIComponent(pathname.slice(base.length))
          );
        } catch {
          res.statusCode = 400;
          res.end("Invalid path");
          return;
        }
        if (!inside(root, requested)) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }
        try {
          const file = (await isFile(requested))
            ? requested
            : (await isFile(`${requested}.br`))
              ? `${requested}.br`
              : null;
          if (!file) {
            res.statusCode = 404;
            res.end("Game asset not found");
            return;
          }
          if (!inside(await fsp.realpath(root), await fsp.realpath(file))) {
            res.statusCode = 403;
            res.end("Forbidden");
            return;
          }
          const decompressed =
            file.endsWith(".br") && !requested.endsWith(".br");
          res.setHeader(
            "Content-Type",
            mimeTypes[path.extname(requested.replace(/\.br$/, ""))] ??
              "application/octet-stream"
          );
          if (requested.endsWith(".br"))
            res.setHeader("Content-Encoding", "br");
          if (req.method === "HEAD") {
            res.end();
            return;
          }
          if (decompressed)
            await pipeline(
              fs.createReadStream(file),
              createBrotliDecompress(),
              res
            );
          else await pipeline(fs.createReadStream(file), res);
        } catch (error) {
          server.config.logger.error(
            `Game asset request failed: ${String(error)}`
          );
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end("Unable to load game asset");
          } else res.destroy();
        }
      });
    },
    async writeBundle() {
      try {
        await fsp.access(root);
      } catch {
        return;
      }
      // A corrupt compressed build must fail deployment rather than ship broken assets.
      await copyGameAssets(root, outDir);
    },
  };
}

export default defineConfig({
  plugins: [react(), tsconfigPaths(), gamedataPlugin()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
