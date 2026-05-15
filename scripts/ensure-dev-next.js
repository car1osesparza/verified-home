/**
 * Block `next dev` when `.next` still contains a static HTML export build.
 * Mixing export artifacts with dev yields HTML that references missing CSS chunks.
 */
const fs = require("fs");
const path = require("path");

const exportMarker = path.join(process.cwd(), ".next", "export-marker.json");

if (fs.existsSync(exportMarker)) {
  console.error(
    "\n[next] .next contains a static export build. CSS will not load in dev.\n" +
      "       Run: npm run dev:clean\n",
  );
  process.exit(1);
}
