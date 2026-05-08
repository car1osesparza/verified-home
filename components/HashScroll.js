"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MAX_SCROLL_ATTEMPTS = 80;

function getDefaultAnchorOffset() {
  const nav = document.querySelector(".dark-nav");
  if (!nav) {
    return 0;
  }
  const navRect = nav.getBoundingClientRect();
  const navHeight = Math.max(0, Math.round(navRect.height));
  return navHeight;
}

function scrollElementIntoDocumentPosition(el) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const base = el.getBoundingClientRect().top + window.scrollY;
  const raw = el.getAttribute("data-anchor-offset");
  let offset = 0;
  if (raw != null && raw !== "") {
    const n = parseFloat(raw);
    if (!Number.isNaN(n)) {
      offset = n;
    }
  } else {
    offset = getDefaultAnchorOffset();
  }
  let top = Math.round(base - offset);
  top = Math.max(0, top);
  window.scrollTo({ top, left: 0, behavior: reduce ? "auto" : "smooth" });
}

/**
 * Scroll to `window.location.hash` after route changes. Retries until the target
 * node exists so home anchors work when coming from other pages (RSC + client paint).
 */
function scrollToHashFromLocation() {
  if (typeof window === "undefined") {
    return;
  }
  const { hash } = window.location;
  if (!hash || hash.length < 2) {
    return;
  }
  const id = decodeURIComponent(hash.slice(1));
  let attempt = 0;

  const tick = () => {
    const el = document.getElementById(id);
    if (el) {
      scrollElementIntoDocumentPosition(el);
      return;
    }
    attempt += 1;
    if (attempt < MAX_SCROLL_ATTEMPTS) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let canceled = false;
    const outerId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!canceled) {
          scrollToHashFromLocation();
        }
      });
    });
    return () => {
      canceled = true;
      cancelAnimationFrame(outerId);
    };
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      scrollToHashFromLocation();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
