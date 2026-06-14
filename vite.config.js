import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
function gamedataPlugin() {
    return {
        name: "gamedata-plugin",
        configureServer: function (server) {
            server.middlewares.use(function (req, res, next) {
                if (req.url && req.url.startsWith("/Gamedata/")) {
                    var cleanUrl = req.url.split("?")[0];
                    var decodedUrl = decodeURIComponent(cleanUrl);
                    var filePath = path.join(__dirname, decodedUrl);
                    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                        var contentType = "application/octet-stream";
                        if (filePath.endsWith(".js") || filePath.endsWith(".js.br")) {
                            contentType = "application/javascript";
                        }
                        else if (filePath.endsWith(".wasm") || filePath.endsWith(".wasm.br")) {
                            contentType = "application/wasm";
                        }
                        else if (filePath.endsWith(".html")) {
                            contentType = "text/html";
                        }
                        else if (filePath.endsWith(".css")) {
                            contentType = "text/css";
                        }
                        else if (filePath.endsWith(".json")) {
                            contentType = "application/json";
                        }
                        else if (filePath.endsWith(".png")) {
                            contentType = "image/png";
                        }
                        else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
                            contentType = "image/jpeg";
                        }
                        res.setHeader("Content-Type", contentType);
                        fs.createReadStream(filePath).pipe(res);
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
                fs.cpSync(src, dest, { recursive: true });
                console.log("Copied Gamedata to dist/Gamedata");
            }
        }
    };
}
export default defineConfig({
    plugins: [react(), tsconfigPaths(), gamedataPlugin()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
