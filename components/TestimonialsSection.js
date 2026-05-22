"use client";

import TestimonialsExpandLayout from "./testimonials/TestimonialsExpandLayout";
import useTestimonialsData from "./testimonials/useTestimonialsData";

export default function TestimonialsSection({ selectedSport }) {
  const { items, loading, fetchError, sportKey } = useTestimonialsData(selectedSport);

  return (
    <TestimonialsExpandLayout
      items={items}
      loading={loading}
      fetchError={fetchError}
      sportKey={sportKey}
    />
  );
}
