import { Suspense } from "react";
import MapLabBPageClient from "./MapLabBPageClient";

export const metadata = {
  title: "Map Lab B · Verified Athletics",
  description: "Compact steep-angle coverage map for homepage review.",
};

export default function MapLabBPage() {
  return (
    <Suspense fallback={null}>
      <MapLabBPageClient />
    </Suspense>
  );
}
