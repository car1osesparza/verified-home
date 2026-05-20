import Link from "next/link";
import InteractiveCustomerMap from "../../components/map-lab/InteractiveCustomerMap";

export const metadata = {
  title: "Map Lab · Verified Athletics",
  description: "Interactive coverage map prototype for design review.",
};

export default function MapLabPage() {
  return (
    <>
      <div className="map-lab-variant-bar">
        <span>Version A — full lab</span>
        <Link href="/map-lab-b">Try version B (compact)</Link>
      </div>
      <InteractiveCustomerMap />
    </>
  );
}
