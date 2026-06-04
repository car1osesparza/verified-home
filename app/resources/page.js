"use client";

import { useEffect } from "react";
import { recruitsPathFromLocation } from "../../lib/recruits-path";

/** Legacy /resources → /recruits (preserves hash). */
export default function ResourcesRedirectPage() {
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const target = recruitsPathFromLocation().replace(/\/$/, "") + hash;
    window.location.replace(target);
  }, []);

  return null;
}
