"use client";

import { useSearchParams } from "next/navigation";
import InteractiveCustomerMapB from "../../components/map-lab/InteractiveCustomerMapB";

export default function MapLabBPageClient() {
  const searchParams = useSearchParams();
  const initialState = searchParams.get("state")?.toUpperCase() ?? null;
  return <InteractiveCustomerMapB initialState={initialState} />;
}
