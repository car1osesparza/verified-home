"use client";

import { useCallback, useEffect, useRef } from "react";
import { Modal } from "antd";
import TestimonialCard from "./TestimonialCard";

/** Normalize wheel delta for line/page modes (Windows mouse wheels). */
function wheelDeltaPixels(e) {
  let delta = e.deltaY;
  if (e.deltaMode === 1) {
    delta *= 16;
  } else if (e.deltaMode === 2) {
    delta *= e.currentTarget.clientHeight;
  }
  return delta;
}

export default function TestimonialsAllModal({ open, onClose, items, loading, fetchError }) {
  const scrollRef = useRef(null);

  const onScrollAreaWheel = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      return;
    }

    const delta = wheelDeltaPixels(e);
    const nextTop = Math.min(maxScroll, Math.max(0, el.scrollTop + delta));

    if (nextTop !== el.scrollTop) {
      el.scrollTop = nextTop;
    }

    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    let el = scrollRef.current;
    let attached = false;

    const attach = () => {
      el = scrollRef.current;
      if (!el || attached) {
        return;
      }
      attached = true;
      el.addEventListener("wheel", onScrollAreaWheel, { passive: false });
      el.focus({ preventScroll: true });
    };

    attach();
    const frame = requestAnimationFrame(attach);

    return () => {
      cancelAnimationFrame(frame);
      if (el) {
        el.removeEventListener("wheel", onScrollAreaWheel);
      }
    };
  }, [open, loading, fetchError, items.length, onScrollAreaWheel]);

  const scrollBody = (content) => (
    <div ref={scrollRef} className="t-all-modal-scroll" tabIndex={-1}>
      {content}
    </div>
  );

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
      {loading
        ? scrollBody(
            <div className="t-all-modal-grid" aria-busy="true">
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
            </div>,
          )
        : null}

      {!loading && fetchError ? (
        <div className="t-card t-carousel-card">
          <p className="t-quote" style={{ fontStyle: "normal" }}>
            {fetchError}
          </p>
        </div>
      ) : null}

      {!loading && !fetchError
        ? scrollBody(
            <div className="t-all-modal-grid" role="list" aria-label="All customer testimonials">
              {items.map((item) => (
                <TestimonialCard key={item.id ?? item.name} item={item} />
              ))}
            </div>,
          )
        : null}
    </Modal>
  );
}
