import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");

async function main() {
  console.log("[copy] JS build starting...");
  await fs.mkdir(distDir, { recursive: true });

  await copyDir(path.join(projectRoot, "js"), path.join(distDir, "js"));
  await copyDir(path.join(projectRoot, "lib"), path.join(distDir, "lib"));
  await copyVendor();

  console.log("[copy] JS modules copied to dist/js and dist/lib");
}

async function copyDir(from, to) {
  await fs.cp(from, to, { recursive: true });
}

async function copyVendor() {
  const vendorDir = path.join(distDir, "js", "vendor");
  await fs.mkdir(vendorDir, { recursive: true });

  const alpineSrc = path.join(
    projectRoot,
    "node_modules",
    "alpinejs",
    "dist",
    "module.esm.js"
  );
  const alpineDest = path.join(vendorDir, "alpine.module.esm.js");
  await fs.copyFile(alpineSrc, alpineDest);
}

main();
