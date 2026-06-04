"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SPORT_DROPDOWN_OPTIONS } from "../lib/site-data";
import { APP_LOGIN_URL, RECRUITING_ACADEMY_URL } from "../lib/external-links";
import { recruitsSectionPath } from "../lib/recruits-path";
import { openCalendlyForSport } from "../lib/sport-calendly";
import { openSportRequiredModal } from "../lib/sport-preference";
import { assetPath } from "../lib/asset-path";
import SportSelectWithClear from "./SportSelectWithClear";

const homeProductHref = { pathname: "/", hash: "product" };
const homePricingHref = { pathname: "/", hash: "pricing" };

function NavLogo() {
  return (
    <div className="nav-logo-wrap">
      <img src={assetPath("/brand/logomarkStacked_small_w.svg")} alt="Verified Athletics" className="nav-logo-image" />
    </div>
  );
}

export function MarketingTopNav({ sport, hasSport, onSportChange }) {
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname === "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={`dark-nav ${mobileMenuOpen ? "menu-open" : ""}`}>
      <div className="dark-nav-top-row">
        <Link href="/" aria-label="Verified Athletics home" className="nav-logo-link">
          <NavLogo />
        </Link>
        <button
          type="button"
          className="nav-mobile-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`dark-nav-links ${mobileMenuOpen ? "is-open" : ""}`}>
        <Link
          href={homeProductHref}
          onClick={(e) => {
            closeMobileMenu();
            if (!onHome) {
              return;
            }
            e.preventDefault();
            window.location.hash = "product";
          }}
        >
          Product
        </Link>
        <Link
          href={homePricingHref}
          onClick={(e) => {
            closeMobileMenu();
            if (!onHome) {
              return;
            }
            e.preventDefault();
            window.location.hash = "pricing";
          }}
        >
          Pricing
        </Link>
        <Link href={recruitsSectionPath("hs-football-coaches")} onClick={closeMobileMenu}>
          HS Coaches
        </Link>
        <Link href={recruitsSectionPath("hs-athletes")} onClick={closeMobileMenu}>
          Athletes
        </Link>
        <Link href="/about" onClick={closeMobileMenu}>
          About Us
        </Link>
      </div>
      <div className={`dark-nav-cta ${mobileMenuOpen ? "is-open" : ""}`}>
        <div className="dark-nav-sport">
          <SportSelectWithClear
            options={SPORT_DROPDOWN_OPTIONS}
            value={sport || ""}
            onValueChange={onSportChange}
            selectClassName={`nav-sel${hasSport ? " live" : ""}`}
            emptyLabel="Choose sport"
            compact
            variant="nav"
          />
        </div>
        <button
          type="button"
          className={`nav-btn-demo${hasSport ? " sport-selected" : ""}`}
          data-requires-sport="true"
          onClick={() => {
            closeMobileMenu();
            if (!hasSport) {
              openSportRequiredModal();
              return;
            }
            openCalendlyForSport(sport);
          }}
        >
          Book a Demo
        </button>
        <a href={APP_LOGIN_URL} className="nav-login" onClick={closeMobileMenu}>
          Log In
        </a>
      </div>
    </nav>
  );
}

export function MarketingFooter() {
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname === "";

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-col-head">For You</div>
          <Link
            href={homeProductHref}
            onClick={(e) => {
              if (!onHome) {
                return;
              }
              e.preventDefault();
              window.location.hash = "product";
            }}
          >
            College Coaches
          </Link>
          <Link href={recruitsSectionPath("hs-football-coaches")}>HS Coaches</Link>
          <Link href={recruitsSectionPath("hs-athletes")}>Athletes</Link>
          <a href={RECRUITING_ACADEMY_URL} target="_blank" rel="noreferrer">
            Recruiting Academy
          </a>
        </div>
        <div>
          <div className="footer-col-head">Company</div>
          <Link href="/about">About Us</Link>
          <Link href="/about#careers">Careers</Link>
          <Link href="/about#contact">Contact</Link>
        </div>
        <div>
          <div className="footer-col-head">Legal</div>
          <a className="footer-lnk">Privacy Policy</a>
          <a className="footer-lnk">Terms of Service</a>
        </div>
      </div>
      <div className="footer-bottom">
        <NavLogo />
        <div className="footer-legal">© 2025 Verified Athletics.</div>
      </div>
      <div className="footer-ncaa">
        <p className="footer-ncaa-primary">
          This recruiting/scouting service has been approved in accordance with NCAA bylaws,
          policies, and procedures. NCAA Division I football and/or basketball coaches are permitted
          to subscribe to this recruiting/scouting service.
        </p>
        <p className="footer-ncaa-note">
          (note: the NCAA only approves services for football and basketball but we have many
          customers in nearly every NCAA sport)
        </p>
      </div>
    </footer>
  );
}
