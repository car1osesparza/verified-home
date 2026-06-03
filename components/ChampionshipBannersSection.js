"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {
  CHAMPIONSHIP_BANNERS_HEADLINE,
  CHAMPIONSHIP_BANNERS_LEAD,
  formatChampionshipDivision,
  formatChampionshipScope,
  formatChampionshipSport,
  MOCK_CHAMPIONSHIP_BANNERS,
  sortChampionshipBannersForSport,
} from "../lib/championship-banners";
import { useSportSelection } from "./SportSelectionProvider";
import {
  buildChampionshipBannerTheme,
  championshipBannerThemeKey,
  DEFAULT_CHAMPIONSHIP_BANNER_THEME,
  resolveChampionshipBannerThemes,
} from "../lib/championship-banner-theme";
import "./championship-banners.css";

const BANNER_GAP = 16;
/** 80% of original 440px banner height */
const BANNER_HEIGHT = 352;

/** Keep in sync with `.champ-banner-card` breakpoints in championship-banners.css */
function bannerWidthForViewport(viewportWidth) {
  if (viewportWidth <= 640) return 200;
  if (viewportWidth <= 900) return 220;
  return 240;
}

function schoolInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function ChampionshipBannerCard({ banner, theme = DEFAULT_CHAMPIONSHIP_BANNER_THEME }) {
  const sportLabel = formatChampionshipSport(banner.sport);
  const divisionLabel = formatChampionshipDivision(banner.division ?? banner.qualifier);
  const scopeLabel = formatChampionshipScope(banner.championshipScope ?? "National");

  const ariaLabel = [
    banner.schoolName,
    sportLabel,
    divisionLabel,
    scopeLabel,
    "champion",
    banner.year,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className="champ-banner-card"
      style={{
        "--champ-card-bg": theme.background,
        "--champ-border": theme.border,
        "--champ-primary-text": theme.primaryText,
        "--champ-accent-text": theme.accentText,
      }}
      aria-label={ariaLabel}
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
        {sportLabel ? <p className="champ-banner-sport">{sportLabel}</p> : null}
        {divisionLabel ? <p className="champ-banner-division">{divisionLabel}</p> : null}
        {scopeLabel ? <p className="champ-banner-scope">{scopeLabel}</p> : null}
        <h3 className="champ-banner-title">Champion</h3>
      </div>

      <p className="champ-banner-year">{banner.year}</p>
    </article>
  );
}

function useChampionshipBannerThemes(banners) {
  const [themes, setThemes] = useState(() => {
    const initial = {};
    const themeByProgram = new Map();

    banners.forEach((banner, index) => {
      const programKey = championshipBannerThemeKey(banner);
      if (programKey && themeByProgram.has(programKey)) {
        initial[banner.id] = themeByProgram.get(programKey);
        return;
      }

      let previousBackgrounds = [];
      for (let j = index - 1; j >= 0; j -= 1) {
        if (championshipBannerThemeKey(banners[j]) !== programKey) {
          previousBackgrounds = [initial[banners[j].id]?.background].filter(Boolean);
          break;
        }
      }

      const theme = buildChampionshipBannerTheme([], {
        fallback: banner.accentColor,
        previousBackgrounds,
      });
      initial[banner.id] = theme;
      if (programKey) {
        themeByProgram.set(programKey, theme);
      }
    });

    return initial;
  });

  useEffect(() => {
    let cancelled = false;

    resolveChampionshipBannerThemes(banners).then((next) => {
      if (!cancelled) setThemes(next);
    });

    return () => {
      cancelled = true;
    };
  }, [banners]);

  return themes;
}

function useBannerCarouselLayout(viewportRef) {
  const [perPage, setPerPage] = useState(4);
  const [cardWidth, setCardWidth] = useState(240);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;

    const update = () => {
      const w = el.clientWidth;
      const cardW = bannerWidthForViewport(w);
      const next = Math.max(1, Math.floor((w + BANNER_GAP) / (cardW + BANNER_GAP)));
      setCardWidth(cardW);
      setPerPage(next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewportRef]);

  return { perPage, cardWidth };
}

export default function ChampionshipBannersSection({ banners = MOCK_CHAMPIONSHIP_BANNERS }) {
  const { sport } = useSportSelection();
  const [pageIndex, setPageIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const viewportRef = useRef(null);
  const { perPage, cardWidth: trackCardWidth } = useBannerCarouselLayout(viewportRef);

  const orderedBanners = useMemo(
    () => sortChampionshipBannersForSport(banners, sport),
    [banners, sport],
  );

  const themes = useChampionshipBannerThemes(orderedBanners);

  const pageCount = Math.max(1, Math.ceil(orderedBanners.length / perPage));

  useEffect(() => {
    setPageIndex(0);
  }, [sport, orderedBanners.length]);

  useEffect(() => {
    setPageIndex((p) => Math.min(p, pageCount - 1));
  }, [pageCount, perPage]);

  const pageBanners = useMemo(() => {
    const start = pageIndex * perPage;
    return orderedBanners.slice(start, start + perPage);
  }, [orderedBanners, pageIndex, perPage]);

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
            {CHAMPIONSHIP_BANNERS_HEADLINE}
          </h2>
          <p className="champ-banners-lead">{CHAMPIONSHIP_BANNERS_LEAD}</p>
        </div>

        <div
          className="champ-banner-carousel"
          style={{
            "--champ-banner-width": `${trackCardWidth}px`,
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
                className={`champ-banner-track champ-banner-track--slide-${slideDir > 0 ? "next" : "prev"}${
                  pageBanners.length < perPage ? " champ-banner-track--partial" : ""
                }`}
                role="list"
                aria-live="polite"
              >
                {pageBanners.map((banner) => (
                  <ChampionshipBannerCard
                    key={banner.id}
                    banner={banner}
                    theme={themes[banner.id]}
                  />
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
