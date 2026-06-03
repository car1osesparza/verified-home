import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { testimonialCatalogItemsWithSortOrder } from "../lib/testimonials-catalog-data.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const items = testimonialCatalogItemsWithSortOrder();
const outPath = join(root, "public/data/testimonials-catalog.json");

writeFileSync(
  outPath,
  `${JSON.stringify({ source: "local-catalog", items }, null, 2)}\n`,
  "utf8",
);

console.log(`Wrote ${items.length} testimonials to ${outPath}`);
