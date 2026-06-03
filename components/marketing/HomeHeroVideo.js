"use client";

import { assetPath } from "../../lib/asset-path";

const HOME_HERO_VIDEO_DESKTOP = assetPath("/video/VerifiedHero.web.mp4");
const HOME_HERO_VIDEO_MOBILE = assetPath("/video/VerifiedHero.mobile.mp4");

/** Full-bleed background loop behind homepage `.b-hero` (desktop + mobile sources). */
export default function HomeHeroVideo() {
  return (
    <div className="b-hero-video-wrap" aria-hidden>
      <video
        className="b-hero-video b-hero-video--desktop"
        src={HOME_HERO_VIDEO_DESKTOP}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <video
        className="b-hero-video b-hero-video--mobile"
        src={HOME_HERO_VIDEO_MOBILE}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  );
}
