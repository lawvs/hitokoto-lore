import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.resolve(__dirname, "./build/");
process.env.BUILD_ROOT = buildDir;
process.env.ROOT = __dirname;

fs.ensureDirSync(buildDir);

console.log("Build underlords...");
import("./underlords.ts");
console.log("Merge meta information...");
import("./merge-meta.ts");
console.log("Build Success.");
