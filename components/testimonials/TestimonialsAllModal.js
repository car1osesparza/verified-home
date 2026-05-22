"use client";

import { Modal } from "antd";
import TestimonialCard from "./TestimonialCard";

export default function TestimonialsAllModal({ open, onClose, items, loading, fetchError }) {
  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1120}
      centered
      className="t-all-modal"
      destroyOnHidden
      mask={{ closable: true }}
      keyboard
      aria-label="All customer testimonials"
    >
      {loading ? (
        <div className="t-all-modal-scroll" aria-busy="true">
          <div className="t-all-modal-grid">
            {Array.from({ length: 9 }, (_, i) => (
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
        </div>
      ) : null}

      {!loading && fetchError ? (
        <div className="t-card t-carousel-card">
          <p className="t-quote" style={{ fontStyle: "normal" }}>
            {fetchError}
          </p>
        </div>
      ) : null}

      {!loading && !fetchError ? (
        <div className="t-all-modal-scroll">
          <div className="t-all-modal-grid" role="list" aria-label="All customer testimonials">
            {items.map((item) => (
              <TestimonialCard key={item.id ?? item.name} item={item} />
            ))}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
