"use client";

import { useEffect, useState } from "react";
import {
  loadCustomerSchoolsForTestimonials,
  resolveSchoolLogoFromRole,
} from "../../lib/testimonial-school-logos";

/**
 * Resolves school logo from map customer data when testimonial has no headshot.
 * @param {string | undefined} role
 */
export default function useSchoolLogoForRole(role) {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const hay = role?.trim();
    if (!hay) {
      setLogoUrl(null);
      return undefined;
    }

    loadCustomerSchoolsForTestimonials().then((schools) => {
      if (!cancelled) {
        setLogoUrl(resolveSchoolLogoFromRole(hay, schools));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [role]);

  return logoUrl;
}
