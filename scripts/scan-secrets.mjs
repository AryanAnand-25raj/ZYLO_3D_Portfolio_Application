import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".storage",
  "dist",
  "build",
]);

const IGNORED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".glb",
  ".gltf",
  ".bin",
  ".ico",
  ".svg",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".log",
  ".tsbuildinfo",
]);

const SECRET_PATTERNS = [
  { name: "OpenAI API Key", regex: /sk-(?:proj-)?[A-Za-z0-9_-]{32,}/g },
  { name: "Stripe Live Secret Key", regex: /(?:sk|rk)_live_[0-9a-zA-Z]{20,}/g },
  { name: "Razorpay Live Secret Key", regex: /rzp_live_[0-9a-zA-Z]{12,}/g },
  { name: "GitHub Personal Access Token", regex: /gh[pous]_[0-9a-zA-Z]{36}/g },
  { name: "GitHub Fine-Grained Token", regex: /github_pat_[0-9a-zA-Z_]{40,}/g },
  { name: "Private RSA / EC Key", regex: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g },
  { name: "AWS Access Key ID", regex: /AKIA[0-9A-Z]{16}/g },
  { name: "Client Leaked OpenAI Key", regex: /NEXT_PUBLIC_OPENAI_API_KEY/g },
];

let totalFilesScanned = 0;
const detectedViolations = [];

function scanFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (IGNORED_EXTENSIONS.has(ext)) return;

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    totalFilesScanned++;

    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      // Allow placeholder dummy values in .env.example or test files
      const isDummy =
        line.includes("zylo_super_secret") ||
        line.includes("dummy") ||
        line.includes("placeholder") ||
        line.includes("mock_");

      for (const pattern of SECRET_PATTERNS) {
        if (pattern.regex.test(line)) {
          // If in test file testing the secret scanner regex itself, ignore
          if (filePath.endsWith("scan-secrets.mjs")) continue;
          if (isDummy) continue;

          detectedViolations.push({
            file: path.relative(rootDir, filePath),
            line: index + 1,
            rule: pattern.name,
          });
        }
      }
    });
  } catch {
    // Binary or unreadable file, skip safely
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else {
      scanFile(fullPath);
    }
  }
}

console.log("🔒 Running ZYLO Secret Scanner across repository...");
walkDir(rootDir);

console.log(`Scan completed: ${totalFilesScanned} files analyzed.`);

if (detectedViolations.length > 0) {
  console.error("❌ CRITICAL: Potential secret leakage detected!");
  detectedViolations.forEach((v) => {
    // NEVER PRINT SECRET VALUE (Req 5 & 10)
    console.error(`  • [${v.rule}] in file ${v.file} (Line ${v.line})`);
  });
  process.exit(1);
} else {
  console.log("✅ Secret Scan Passed: Zero production secrets or client-exposed API keys detected.");
  process.exit(0);
}
