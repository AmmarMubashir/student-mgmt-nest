const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'generated');
const dest = path.resolve(__dirname, '..', 'dist', 'generated');

if (!fs.existsSync(src)) {
  console.error(`Source Prisma client not found at ${src}. Run "npm run prisma:generate" first.`);
  process.exit(1);
}

fs.mkdirSync(dest, { recursive: true });

fs.cp(src, dest, { recursive: true }, (err) => {
  if (err) {
    console.error('Failed to copy Prisma client to dist:', err);
    process.exit(1);
  }
  console.log(`Copied Prisma client from ${src} to ${dest}`);
});

