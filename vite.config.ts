import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import zlib from "zlib";

function gamedataPlugin(): Plugin {
  return {
    name: "gamedata-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith("/Gamedata/")) {
          const cleanUrl = req.url.split("?")[0];
          const decodedUrl = decodeURIComponent(cleanUrl);
          const relativePath = decodedUrl.startsWith("/") ? decodedUrl.slice(1) : decodedUrl;
          const filePath = path.resolve(__dirname, relativePath);

          // リクエストされたファイルが存在しないが、.br付きのファイルが存在する場合、オンザフライで解凍してサーブする
          const brFilePath = filePath + ".br";
          const fileToServe = fs.existsSync(filePath) && fs.statSync(filePath).isFile()
            ? filePath
            : (fs.existsSync(brFilePath) && fs.statSync(brFilePath).isFile() ? brFilePath : null);

          if (fileToServe) {
            let contentType = "application/octet-stream";
            const checkPath = fileToServe.endsWith(".br") ? fileToServe.slice(0, -3) : fileToServe;
            if (checkPath.endsWith(".js")) {
              contentType = "application/javascript";
            } else if (checkPath.endsWith(".wasm")) {
              contentType = "application/wasm";
            } else if (checkPath.endsWith(".html")) {
              contentType = "text/html";
            } else if (checkPath.endsWith(".css")) {
              contentType = "text/css";
            } else if (checkPath.endsWith(".json")) {
              contentType = "application/json";
            } else if (checkPath.endsWith(".png")) {
              contentType = "image/png";
            } else if (checkPath.endsWith(".jpg") || checkPath.endsWith(".jpeg")) {
              contentType = "image/jpeg";
            }
            res.setHeader("Content-Type", contentType);

            if (fileToServe.endsWith(".br")) {
              try {
                const compressed = fs.readFileSync(fileToServe);
                const decompressed = zlib.brotliDecompressSync(compressed);
                res.setHeader("Content-Length", decompressed.length);
                res.end(decompressed);
                console.log(`[gamedata-plugin] Served decompressed Brotli: ${fileToServe}`);
              } catch (e: any) {
                console.error(`[gamedata-plugin] Failed to decompress ${fileToServe}:`, e);
                res.statusCode = 500;
                res.end(`Decompression failed: ${e.message}`);
              }
            } else {
              fs.createReadStream(fileToServe).pipe(res);
            }
            return;
          }
        }
        next();
      });
    },
    closeBundle() {
      const src = path.resolve(__dirname, "Gamedata");
      const dest = path.resolve(__dirname, "dist/Gamedata");
      if (fs.existsSync(src)) {
        copyAndDecompress(src, dest);
        console.log("Copied and decompressed Gamedata to dist/Gamedata");
      }
    }
  };
}

function copyAndDecompress(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyAndDecompress(srcPath, destPath);
    } else if (entry.isFile()) {
      if (entry.name.endsWith(".br")) {
        const decompressedPath = destPath.slice(0, -3); // ".br" を削除
        try {
          const compressed = fs.readFileSync(srcPath);
          const decompressed = zlib.brotliDecompressSync(compressed);
          fs.writeFileSync(decompressedPath, decompressed);
          console.log(`Decompressed: ${entry.name} -> ${path.basename(decompressedPath)}`);
        } catch (e) {
          console.error(`Failed to decompress ${entry.name}:`, e);
          fs.copyFileSync(srcPath, destPath);
        }
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), tsconfigPaths(), gamedataPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
