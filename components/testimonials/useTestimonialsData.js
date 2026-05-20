"use client";

import { useEffect, useState } from "react";
import { fetchTestimonialsForSport } from "../../lib/testimonials-fetch";

export default function useTestimonialsData(selectedSport) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const sportKey = selectedSport?.trim() || "";

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setFetchError(null);

    fetchTestimonialsForSport(sportKey)
      .then((next) => {
        if (!cancelled) {
          setItems(next);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(err.message || "Could not load testimonials");
          setItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sportKey]);

  return { items, loading, fetchError, sportKey };
}
