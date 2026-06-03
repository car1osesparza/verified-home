"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Athlete resources live on /recruits#hs-athletes (same content as nav “Athletes”). */
export default function ForAthletesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/recruits#hs-athletes");
  }, [router]);

  return (
    <div className="section marketing-page athletes-page-redirect" aria-busy="true" aria-live="polite">
      <p className="container">Loading athlete resources…</p>
    </div>
  );
}
