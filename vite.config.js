import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import zlib from "zlib";
function gamedataPlugin() {
    return {
        name: "gamedata-plugin",
        configureServer: function (server) {
            server.middlewares.use(function (req, res, next) {
                if (req.url && req.url.startsWith("/Gamedata/")) {
                    var cleanUrl = req.url.split("?")[0];
                    var decodedUrl = decodeURIComponent(cleanUrl);
                    var relativePath = decodedUrl.startsWith("/") ? decodedUrl.slice(1) : decodedUrl;
                    var filePath = path.resolve(__dirname, relativePath);
                    // リクエストされたファイルが存在しないが、.br付きのファイルが存在する場合、オンザフライで解凍してサーブする
                    var brFilePath = filePath + ".br";
                    var fileToServe = fs.existsSync(filePath) && fs.statSync(filePath).isFile()
                        ? filePath
                        : (fs.existsSync(brFilePath) && fs.statSync(brFilePath).isFile() ? brFilePath : null);
                    if (fileToServe) {
                        var contentType = "application/octet-stream";
                        var checkPath = fileToServe.endsWith(".br") ? fileToServe.slice(0, -3) : fileToServe;
                        if (checkPath.endsWith(".js")) {
                            contentType = "application/javascript";
                        }
                        else if (checkPath.endsWith(".wasm")) {
                            contentType = "application/wasm";
                        }
                        else if (checkPath.endsWith(".html")) {
                            contentType = "text/html";
                        }
                        else if (checkPath.endsWith(".css")) {
                            contentType = "text/css";
                        }
                        else if (checkPath.endsWith(".json")) {
                            contentType = "application/json";
                        }
                        else if (checkPath.endsWith(".png")) {
                            contentType = "image/png";
                        }
                        else if (checkPath.endsWith(".jpg") || checkPath.endsWith(".jpeg")) {
                            contentType = "image/jpeg";
                        }
                        res.setHeader("Content-Type", contentType);
                        if (fileToServe.endsWith(".br")) {
                            try {
                                var compressed = fs.readFileSync(fileToServe);
                                var decompressed = zlib.brotliDecompressSync(compressed);
                                res.setHeader("Content-Length", decompressed.length);
                                res.end(decompressed);
                                console.log("[gamedata-plugin] Served decompressed Brotli: ".concat(fileToServe));
                            }
                            catch (e) {
                                console.error("[gamedata-plugin] Failed to decompress ".concat(fileToServe, ":"), e);
                                res.statusCode = 500;
                                res.end("Decompression failed: ".concat(e.message));
                            }
                        }
                        else {
                            fs.createReadStream(fileToServe).pipe(res);
                        }
                        return;
                    }
                }
                next();
            });
        },
        closeBundle: function () {
            var src = path.resolve(__dirname, "Gamedata");
            var dest = path.resolve(__dirname, "dist/Gamedata");
            if (fs.existsSync(src)) {
                copyAndDecompress(src, dest);
                console.log("Copied and decompressed Gamedata to dist/Gamedata");
            }
        }
    };
}
function copyAndDecompress(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    var entries = fs.readdirSync(src, { withFileTypes: true });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var srcPath = path.join(src, entry.name);
        var destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyAndDecompress(srcPath, destPath);
        }
        else if (entry.isFile()) {
            if (entry.name.endsWith(".br")) {
                var decompressedPath = destPath.slice(0, -3); // ".br" を削除
                try {
                    var compressed = fs.readFileSync(srcPath);
                    var decompressed = zlib.brotliDecompressSync(compressed);
                    fs.writeFileSync(decompressedPath, decompressed);
                    console.log("Decompressed: ".concat(entry.name, " -> ").concat(path.basename(decompressedPath)));
                }
                catch (e) {
                    console.error("Failed to decompress ".concat(entry.name, ":"), e);
                    fs.copyFileSync(srcPath, destPath);
                }
            }
            else {
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
