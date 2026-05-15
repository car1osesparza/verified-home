/**
 * `next start` does not serve `output: 'export'` sites; use `npm run preview:static` instead.
 */
const fs = require("fs");
const path = require("path");

const exportMarker = path.join(process.cwd(), ".next", "export-marker.json");

if (fs.existsSync(exportMarker)) {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "/verified-home").replace(/\/+$/, "");
  console.error(
    "\n[next] This project was built for static export (GitHub Pages).\n" +
      "       Do not use `next start` — CSS and assets will fail.\n" +
      `       Run: npm run preview:static\n` +
      `       Then open: http://localhost:3080${base}/\n`,
  );
  process.exit(1);
}
