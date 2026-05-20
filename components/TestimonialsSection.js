"use client";

import TestimonialsCarouselLayout from "./testimonials/TestimonialsCarouselLayout";
import TestimonialsExpandLayout from "./testimonials/TestimonialsExpandLayout";
import useTestimonialsData from "./testimonials/useTestimonialsData";

/** @typedef {"carousel" | "expand"} TestimonialsLayoutMode */

export default function TestimonialsSection({
  selectedSport,
  layout = "carousel",
}) {
  const { items, loading, fetchError, sportKey } = useTestimonialsData(selectedSport);

  if (layout === "expand") {
    return (
      <TestimonialsExpandLayout
        items={items}
        loading={loading}
        fetchError={fetchError}
        sportKey={sportKey}
      />
    );
  }

  return (
    <TestimonialsCarouselLayout
      items={items}
      loading={loading}
      fetchError={fetchError}
      sportKey={sportKey}
    />
  );
}
