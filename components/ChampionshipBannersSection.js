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
const BANNER_HEIGHT = 352;
const MOBILE_STACK_MEDIA = "(max-width: 767px)";
const SWIPE_THRESHOLD_PX = 48;

/** Keep in sync with `.champ-banner-card` breakpoints in championship-banners.css */
function bannerWidthForViewport(viewportWidth) {
  if (viewportWidth <= 640) return 200;
  if (viewportWidth <= 900) return 220;
  return 240;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
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

function ChampionshipBannerCard({
  banner,
  theme = DEFAULT_CHAMPIONSHIP_BANNER_THEME,
  stackRole,
}) {
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

  const stackClass =
    stackRole === "active"
      ? " champ-banner-card--active"
      : stackRole === "prev"
        ? " champ-banner-card--prev"
        : stackRole === "next"
          ? " champ-banner-card--next"
          : stackRole === "hidden"
            ? " champ-banner-card--hidden"
            : "";

  return (
    <article
      className={`champ-banner-card${stackClass}`}
      style={{
        "--champ-card-bg": theme.background,
        "--champ-border": theme.border,
        "--champ-primary-text": theme.primaryText,
        "--champ-accent-text": theme.accentText,
      }}
      aria-label={ariaLabel}
      aria-hidden={stackRole === "hidden" ? true : undefined}
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
        <p className="champ-banner-school">{banner.schoolName}</p>
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

function getStackRole(index, activeIndex, total) {
  if (total <= 1) return "active";
  if (index === activeIndex) return "active";
  if (index === activeIndex - 1) return "prev";
  if (index === activeIndex + 1) return "next";
  return "hidden";
}

function ChampionshipBannerMobileStack({ banners, themes, cardWidth }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [banners]);

  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, banners.length - 1)));
  }, [banners.length]);

  const goBanner = useCallback(
    (delta) => {
      if (!delta || banners.length < 2) return;
      setActiveIndex((i) => Math.max(0, Math.min(banners.length - 1, i + delta)));
    },
    [banners.length],
  );

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      const start = touchStartX.current;
      touchStartX.current = null;
      if (start == null) return;
      const endX = e.changedTouches[0]?.clientX;
      if (endX == null) return;
      const dx = endX - start;
      if (dx < -SWIPE_THRESHOLD_PX) goBanner(1);
      else if (dx > SWIPE_THRESHOLD_PX) goBanner(-1);
    },
    [goBanner],
  );

  const regionId = "homepage-championship-banners-mobile";

  return (
    <div
      className="champ-banner-stack-wrap"
      style={{
        "--champ-banner-width": `${cardWidth}px`,
        "--champ-banner-height": `${BANNER_HEIGHT}px`,
      }}
    >
      <div
        id={regionId}
        className="champ-banner-stack-viewport"
        aria-live="polite"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="champ-banner-stack" role="list">
          {banners.map((banner, index) => (
            <ChampionshipBannerCard
              key={banner.id}
              banner={banner}
              theme={themes[banner.id]}
              stackRole={getStackRole(index, activeIndex, banners.length)}
            />
          ))}
        </div>
      </div>

      {banners.length > 1 ? (
        <div className="champ-banner-pagination" role="tablist" aria-label="Championship banners">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`${banner.schoolName}, banner ${i + 1} of ${banners.length}`}
              className={`champ-banner-page-dot${activeIndex === i ? " is-active" : ""}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ChampionshipBannerDesktopCarousel({ banners, themes }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const viewportRef = useRef(null);
  const { perPage, cardWidth: trackCardWidth } = useBannerCarouselLayout(viewportRef);

  const pageCount = Math.max(1, Math.ceil(banners.length / perPage));

  useEffect(() => {
    setPageIndex(0);
  }, [banners]);

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
    [pageCount],
  );

  const regionId = "homepage-championship-banners";

  return (
    <div
      className="champ-banner-carousel champ-banner-carousel--desktop"
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
              <ChampionshipBannerCard key={banner.id} banner={banner} theme={themes[banner.id]} />
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
  );
}

export default function ChampionshipBannersSection({ banners = MOCK_CHAMPIONSHIP_BANNERS }) {
  const { sport } = useSportSelection();
  const isMobileStack = useMediaQuery(MOBILE_STACK_MEDIA);

  const orderedBanners = useMemo(
    () => sortChampionshipBannersForSport(banners, sport),
    [banners, sport],
  );

  const themes = useChampionshipBannerThemes(orderedBanners);
  const mobileCardWidth = bannerWidthForViewport(360);

  return (
    <section className="champ-banners-sec" aria-labelledby="champ-banners-heading">
      <div className="champ-banners-inner">
        <div className="champ-banners-intro">
          <h2 id="champ-banners-heading" className="champ-banners-head">
            {CHAMPIONSHIP_BANNERS_HEADLINE}
          </h2>
          <p className="champ-banners-lead">{CHAMPIONSHIP_BANNERS_LEAD}</p>
        </div>

        {isMobileStack ? (
          <ChampionshipBannerMobileStack
            banners={orderedBanners}
            themes={themes}
            cardWidth={mobileCardWidth}
          />
        ) : (
          <ChampionshipBannerDesktopCarousel banners={orderedBanners} themes={themes} />
        )}
      </div>
    </section>
  );
}
