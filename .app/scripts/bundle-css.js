import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import * as sass from "sass";
import fsSync from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const cssDir = path.join(projectRoot, "css");
const distDir = path.join(projectRoot, "dist");

ensureCustomCssExists();

console.log("[sass] CSS build starting...");

const entries = (await fs.readdir(cssDir)).filter(
  (file) => file.startsWith("app.") && file.endsWith(".scss")
);

await fs.mkdir(distDir, { recursive: true });

for (const file of entries) {
  const src = path.join(cssDir, file);
  const outFile = path.join(distDir, file.replace(/\.scss$/, ".css"));

  const result = await sass.compileAsync(src, {
    style: "expanded",
    sourceMap: true,
    loadPaths: [cssDir, projectRoot],
  });

  await fs.writeFile(outFile, result.css);
  if (result.sourceMap) {
    await fs.writeFile(`${outFile}.map`, JSON.stringify(result.sourceMap));
  }

  console.log(`[sass] wrote ${path.basename(outFile)}`);
}

console.log("[sass] CSS build complete");

function ensureCustomCssExists() {
  const cssPath = path.resolve(projectRoot, "../app.styles.scss");
  const content = "/* Write your custom CSS here */";
  if (!fsSync.existsSync(cssPath)) {
    fsSync.writeFileSync(cssPath, content);
  }
}
