"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { MOCK_CHAMPIONSHIP_BANNERS } from "../lib/championship-banners";
import { extractLogoAccent, mixAccentIntoBackground } from "../lib/logo-accent";
import "./championship-banners.css";

const NOTRE_DAME_BANNER_ID = "notre-dame-fb-1988";
/** Notre Dame gold — border + year only */
const NOTRE_DAME_GOLD = "#e8c547";

const BANNER_WIDTH = 240;
const BANNER_GAP = 16;
/** 80% of original 440px banner height */
const BANNER_HEIGHT = 352;

function schoolInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function ChampionshipBannerCard({ banner }) {
  const fallback = banner.accentColor || "#e8c547";
  const [brandAccent, setBrandAccent] = useState(fallback);

  useEffect(() => {
    setBrandAccent(fallback);
    if (!banner.logoUrl) return undefined;

    let cancelled = false;
    extractLogoAccent(banner.logoUrl, fallback).then((color) => {
      if (!cancelled) setBrandAccent(color);
    });

    return () => {
      cancelled = true;
    };
  }, [banner.logoUrl, fallback]);

  const isNotreDame = banner.id === NOTRE_DAME_BANNER_ID;
  const frameAccent = isNotreDame ? NOTRE_DAME_GOLD : brandAccent;
  const cardBg = mixAccentIntoBackground(brandAccent, 0.16);

  return (
    <article
      className="champ-banner-card"
      style={{
        "--champ-accent": frameAccent,
        "--champ-card-bg": cardBg,
      }}
      aria-label={`${banner.schoolName} ${banner.qualifier} champion ${banner.year}`}
    >
      <header className="champ-banner-logo-hero">
        {banner.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={banner.logoUrl} alt="" className="champ-banner-logo" loading="lazy" />
        ) : (
          <span className="champ-banner-logo-fallback" aria-hidden="true">
            {schoolInitials(banner.schoolName)}
          </span>
        )}
      </header>

      <div className="champ-banner-mid">
        <p className="champ-banner-qualifier">{banner.qualifier}</p>
        <h3 className="champ-banner-title">Champion</h3>
      </div>

      <p className="champ-banner-year">{banner.year}</p>
    </article>
  );
}

function useBannersPerPage(viewportRef) {
  const [perPage, setPerPage] = useState(4);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;

    const update = () => {
      const w = el.clientWidth;
      const next = Math.max(1, Math.floor((w + BANNER_GAP) / (BANNER_WIDTH + BANNER_GAP)));
      setPerPage(next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewportRef]);

  return perPage;
}

export default function ChampionshipBannersSection({ banners = MOCK_CHAMPIONSHIP_BANNERS }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const viewportRef = useRef(null);
  const perPage = useBannersPerPage(viewportRef);

  const pageCount = Math.max(1, Math.ceil(banners.length / perPage));

  useEffect(() => {
    setPageIndex((p) => Math.min(p, pageCount - 1));
  }, [pageCount, perPage]);

  const pageBanners = useMemo(() => {
    const start = pageIndex * perPage;
    return banners.slice(start, start + perPage);
  }, [banners, pageIndex, perPage]);

  const goPage = useCallback(
    (delta) => {
      if (!delta) return;
      setSlideDir(delta > 0 ? 1 : -1);
      setPageIndex((p) => Math.max(0, Math.min(pageCount - 1, p + delta)));
    },
    [pageCount]
  );

  const regionId = "homepage-championship-banners";

  return (
    <section className="champ-banners-sec" aria-labelledby="champ-banners-heading">
      <div className="champ-banners-inner">
        <div className="champ-banners-intro">
          <h2 id="champ-banners-heading" className="champ-banners-head">
            Verified recruiting assistance for championship teams
          </h2>
          <p className="champ-banners-lead">
            Programs that won it all with support from Verified Athletics—transfer intelligence, roster
            visibility, and recruiting workflow tools behind their run.
          </p>
        </div>

        <div
          className="champ-banner-carousel"
          style={{
            "--champ-banner-width": `${BANNER_WIDTH}px`,
            "--champ-banner-height": `${BANNER_HEIGHT}px`,
            "--champ-banner-gap": `${BANNER_GAP}px`,
          }}
        >
          <div className="champ-banner-band">
            <Button
              type="default"
              shape="circle"
              className="champ-banner-nav"
              icon={<LeftOutlined />}
              aria-label="Previous championship banners"
              aria-controls={regionId}
              disabled={pageIndex === 0}
              onClick={() => goPage(-1)}
            />
            <div ref={viewportRef} className="champ-banner-viewport">
              <div
                id={regionId}
                key={pageIndex}
                className={`champ-banner-track champ-banner-track--slide-${slideDir > 0 ? "next" : "prev"}`}
                role="list"
                aria-live="polite"
              >
                {pageBanners.map((banner) => (
                  <ChampionshipBannerCard key={banner.id} banner={banner} />
                ))}
              </div>
            </div>
            <Button
              type="default"
              shape="circle"
              className="champ-banner-nav"
              icon={<RightOutlined />}
              aria-label="Next championship banners"
              aria-controls={regionId}
              disabled={pageIndex >= pageCount - 1}
              onClick={() => goPage(1)}
            />
          </div>

          {pageCount > 1 ? (
            <div className="champ-banner-pagination" role="tablist" aria-label="Championship banner pages">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={pageIndex === i}
                  aria-label={`Page ${i + 1} of ${pageCount}`}
                  className={`champ-banner-page-dot${pageIndex === i ? " is-active" : ""}`}
                  onClick={() => {
                    setSlideDir(i > pageIndex ? 1 : -1);
                    setPageIndex(i);
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
