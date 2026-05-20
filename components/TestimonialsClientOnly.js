"use client";

import dynamic from "next/dynamic";

/**
 * Testimonials load client-only (no SSR for this subtree).
 *
 * Rationale: this block uses viewport grouping + matchMedia listeners. We previously saw
 * fragile SSR/hydration and dev-server instability around similar patterns; keeping it off
 * the server avoids a whole class of “Internal Server Error” reports that are unrelated to
 * ordinary CSS edits elsewhere on the page.
 */
const TestimonialsSection = dynamic(() => import("./TestimonialsSection"), {
  ssr: false,
  loading: () => (
    <div
      className="t-testimonials-dynamic-placeholder"
      style={{ minHeight: 200, marginTop: 24 }}
      aria-busy="true"
      aria-label="Loading testimonials"
    />
  ),
});

export default function TestimonialsClientOnly({ layout = "carousel", ...props }) {
  return <TestimonialsSection layout={layout} {...props} />;
}
