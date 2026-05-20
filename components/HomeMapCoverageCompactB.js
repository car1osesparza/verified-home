"use client";

import InteractiveCustomerMapB from "./map-lab/InteractiveCustomerMapB";

/**
 * Homepage embed: interactive map B with optional split layout (full-width logos + map beside stats).
 * @param {{ homepageLayout?: boolean; statsSlot?: React.ReactNode }} props
 */
export default function HomeMapCoverageCompactB({ homepageLayout = false, statsSlot = null }) {
  return (
    <div className="home-map-compact-b">
      <InteractiveCustomerMapB embed homepageLayout={homepageLayout} statsSlot={statsSlot} />
    </div>
  );
}
