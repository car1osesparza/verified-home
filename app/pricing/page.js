"use client";

import { useEffect } from "react";
import { homeSectionHashPath } from "../../lib/home-routes";

export default function PricingPage() {
  useEffect(() => {
    window.location.replace(homeSectionHashPath("pricing"));
  }, []);
  return (
    <div className="section marketing-page" style={{ padding: "48px 24px", textAlign: "center" }}>
      <p style={{ color: "var(--gray-600)", margin: 0 }}>Loading pricing…</p>
    </div>
  );
}
