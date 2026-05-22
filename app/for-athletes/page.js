"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Athlete resources live on /resources#athletes-transfers (same content as nav “Athletes”). */
export default function ForAthletesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/resources#athletes-transfers");
  }, [router]);

  return (
    <div className="section marketing-page athletes-page-redirect" aria-busy="true" aria-live="polite">
      <p className="container">Loading athlete resources…</p>
    </div>
  );
}
