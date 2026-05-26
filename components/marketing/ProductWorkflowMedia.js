"use client";

import ProductWorkflowGif, { workflowDemoPhaseMs } from "./ProductWorkflowGif";
import { resolveWorkflowMediaSrc } from "../../lib/product-workflow-showcases";

/**
 * Renders a workflow card visual: GIF, still, or a labeled placeholder until assets ship.
 *
 * @param {{ showcase: import("../../lib/product-workflow-showcases").ProductWorkflowShowcase; index: number; total: number }} props
 */
export default function ProductWorkflowMedia({ showcase, index, total }) {
  const { title, media } = showcase;
  const src = resolveWorkflowMediaSrc(media);
  const alt = `${title} — recruiting workflow`;
  const objectPosition = media.objectPosition ?? "50% 50%";

  if (src && media.kind === "gif") {
    return (
      <ProductWorkflowGif
        alt={alt}
        src={src}
        playbackIndex={index}
        phaseMs={workflowDemoPhaseMs(index, total)}
        objectPosition={objectPosition}
      />
    );
  }

  if (src) {
    return (
      <div className="product-workflow-media-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="product-workflow-image"
          style={{ objectPosition }}
          decoding="async"
        />
      </div>
    );
  }

  const kindLabel = media.kind === "gif" ? "GIF" : "Screenshot";

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
