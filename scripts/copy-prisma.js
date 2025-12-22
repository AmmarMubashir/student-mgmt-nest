const fs = require("fs");
const path = require("path");

// Updated source: point to node_modules/@prisma/client
const src = path.resolve(__dirname, "..", "node_modules", "@prisma", "client");
const dest = path.resolve(
  __dirname,
  "..",
  "dist",
  "node_modules",
  "@prisma",
  "client"
);

if (!fs.existsSync(src)) {
  console.warn(
    `Prisma client not found at ${src}. Make sure you ran "npm install" first.`
  );
  process.exit(0); // don't fail build
}

// Create destination folder if it doesn't exist
fs.mkdirSync(dest, { recursive: true });

// Copy the Prisma client
fs.cp(src, dest, { recursive: true }, (err) => {
  if (err) {
    console.error("Failed to copy Prisma client to dist:", err);
    process.exit(1);
  }
  console.log(`Copied Prisma client from ${src} to ${dest}`);
});
