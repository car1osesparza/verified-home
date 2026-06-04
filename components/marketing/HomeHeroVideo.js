"use client";

import { useEffect, useRef } from "react";
import { assetPath } from "../../lib/asset-path";

const HOME_HERO_VIDEO_DESKTOP = assetPath("/video/VerifiedHero.web.mp4");
const HOME_HERO_VIDEO_MOBILE = assetPath("/video/VerifiedHero.mobile.mp4");

/** Full-bleed background loop behind homepage `.b-hero` (desktop + mobile sources). */
export default function HomeHeroVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    return () => video.removeEventListener("loadeddata", tryPlay);
  }, []);

  return (
    <div className="b-hero-video-wrap" aria-hidden>
      <video
        ref={videoRef}
        className="b-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={HOME_HERO_VIDEO_MOBILE} type="video/mp4" media="(max-width: 767px)" />
        <source src={HOME_HERO_VIDEO_DESKTOP} type="video/mp4" />
      </video>
    </div>
  );
}
