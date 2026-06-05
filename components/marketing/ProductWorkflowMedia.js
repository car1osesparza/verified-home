"use client";

import { resolveWorkflowMediaSrc } from "../../lib/product-workflow-showcases";

function WorkflowMediaFrame({ children, className = "" }) {
  return (
    <div className={`product-workflow-media-frame${className ? ` ${className}` : ""}`}>
      <div className="product-workflow-media-visual">{children}</div>
      <div className="product-workflow-media-spacer" aria-hidden="true" />
    </div>
  );
}

/**
 * Renders a workflow card visual: still, video, or placeholder until assets ship.
 */
export default function ProductWorkflowMedia({ showcase }) {
  const { title, media } = showcase;
  const src = resolveWorkflowMediaSrc(media);
  const alt = `${title} — recruiting workflow`;
  const objectPosition = media.objectPosition ?? "top center";

  if (src && media.kind === "video") {
    return (
      <WorkflowMediaFrame>
        <video
          className="product-workflow-image product-workflow-video"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          aria-label={alt}
          style={{ objectPosition }}
        />
      </WorkflowMediaFrame>
    );
  }

  if (src) {
    return (
      <WorkflowMediaFrame>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="product-workflow-image"
          style={{ objectPosition }}
          decoding="async"
        />
      </WorkflowMediaFrame>
    );
  }

  const kindLabel = media.kind === "video" ? "Video" : "Screenshot";

  return (
    <div
      className={`product-workflow-media-frame product-workflow-media-frame--placeholder product-workflow-media-frame--${media.kind}`}
    >
      <div className="product-workflow-media-placeholder">
        <span className="product-workflow-media-placeholder-kind">{kindLabel}</span>
        <span className="product-workflow-media-placeholder-status">Coming soon</span>
        <p className="product-workflow-media-placeholder-note">{media.placeholderNote}</p>
      </div>
    </div>
  );
}
