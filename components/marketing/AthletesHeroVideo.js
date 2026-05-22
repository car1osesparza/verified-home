"use client";

import { assetPath } from "../../lib/asset-path";

const ATHLETES_HERO_VIDEO = assetPath("/video/athletesPortal.mp4");

/**
 * @param {{ variant?: "inline" | "background"; className?: string }} props
 * `background` — full-bleed cover video (parent must be position: relative).
 */
export default function AthletesHeroVideo({ variant = "inline", className = "" }) {
  const videoClass =
    variant === "background" ? "resources-athletes-hero-video" : "athletes-hero-video";

  const video = (
    <video
      className={videoClass}
      src={ATHLETES_HERO_VIDEO}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden={variant === "background"}
      aria-label={variant === "background" ? undefined : "Overview of Verified Athletics for student-athletes"}
    />
  );

  if (variant === "background") {
    return video;
  }

  const mediaClass = ["athletes-hero-media", className].filter(Boolean).join(" ");
  return <div className={mediaClass}>{video}</div>;
}
