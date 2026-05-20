"use client";

import { useEffect, useState } from "react";
import { assetPath } from "../../lib/asset-path";

/** Shared workflow demo GIF under public/workflow/ */
export const WORKFLOW_DEMO_SRC = assetPath("/workflow/workflow-recruit-demo.gif");

/**
 * Assumed loop length (ms). Instances are staggered evenly across this window
 * so they stay out of phase until the loop realigns.
 */
export const WORKFLOW_DEMO_LOOP_MS = 7200;

/** Per-card crop anchors so tiles do not look identical. */
export const WORKFLOW_DEMO_CROPS = [
  "50% 48%",
  "46% 44%",
  "54% 52%",
  "48% 50%",
  "52% 46%",
  "44% 48%",
  "56% 50%",
  "50% 42%",
  "47% 53%",
  "53% 45%",
];

export function workflowDemoPhaseMs(index, total) {
  if (total <= 1) return 0;
  return Math.round((index * WORKFLOW_DEMO_LOOP_MS) / total);
}

function workflowSrc(playbackIndex) {
  return `${WORKFLOW_DEMO_SRC}?p=${playbackIndex}`;
}

export default function ProductWorkflowGif({
  alt,
  phaseMs = 0,
  playbackIndex = 0,
  objectPosition = "50% 50%",
}) {
  const [active, setActive] = useState(phaseMs === 0);
  const src = workflowSrc(playbackIndex);

  useEffect(() => {
    if (phaseMs === 0) {
      setActive(true);
      return undefined;
    }
    setActive(false);
    const id = window.setTimeout(() => setActive(true), phaseMs);
    return () => window.clearTimeout(id);
  }, [phaseMs]);

  return (
    <div className="product-workflow-media-frame">
      {active ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={`workflow-gif-${playbackIndex}`}
          src={src}
          alt={alt}
          className="product-workflow-image"
          style={{ objectPosition }}
          decoding="async"
        />
      ) : (
        <div className="product-workflow-image product-workflow-image--pending" aria-hidden="true" />
      )}
    </div>
  );
}
