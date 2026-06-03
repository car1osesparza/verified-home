"use client";

import { useMemo, useState } from "react";
import TestimonialCard from "./TestimonialCard";
import TestimonialsAllModal from "./TestimonialsAllModal";

/** Homepage preview: first three in catalog order (before “Show more”). */
const PREVIEW_COUNT = 3;

export default function TestimonialsExpandLayout({ items, loading, fetchError, sportKey }) {
  const [modalOpen, setModalOpen] = useState(false);

  const previewItems = useMemo(() => items.slice(0, PREVIEW_COUNT), [items]);
  const showMoreButton = !loading && !fetchError && items.length > previewItems.length;

  const skeletonSlots = PREVIEW_COUNT;

  return (
    <div className="t-expand">
      {loading && (
        <div
          className="t-expand-grid t-expand-skeleton t-expand-grid--preview-three"
          aria-busy="true"
        >
          {Array.from({ length: skeletonSlots }, (_, i) => (
            <div className="t-card t-carousel-card t-carousel-card--loading" key={i}>
              <div className="t-quote t-carousel-skeleton-line" />
              <div className="t-quote t-carousel-skeleton-line t-carousel-skeleton-line--short" />
              <div className="t-foot">
                <div className="t-avatar t-carousel-skeleton-avatar" />
                <div>
                  <div className="t-carousel-skeleton-line t-carousel-skeleton-line--name" />
                  <div className="t-carousel-skeleton-line t-carousel-skeleton-line--role" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && fetchError && (
        <div className="t-card t-carousel-card">
          <p className="t-quote" style={{ fontStyle: "normal" }}>
            {fetchError}
          </p>
        </div>
      )}

      {!loading && !fetchError && (
        <>
          <div
            className="t-expand-grid t-expand-grid--preview-three"
            role="list"
            aria-label="Customer testimonials preview"
          >
            {previewItems.map((item) => (
              <TestimonialCard key={item.id ?? item.name} item={item} />
            ))}
          </div>

          {showMoreButton ? (
            <div className="t-expand-actions">
              <button
                type="button"
                className="btn light t-expand-more-btn"
                onClick={() => setModalOpen(true)}
              >
                Show more testimonials
              </button>
            </div>
          ) : null}
        </>
      )}

      <TestimonialsAllModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        items={items}
        loading={loading}
        fetchError={fetchError}
      />
    </div>
  );
}
