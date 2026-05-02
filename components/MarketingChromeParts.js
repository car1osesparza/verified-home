"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SPORTS } from "../lib/site-data";
import { assetPath } from "../lib/asset-path";

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

  return (
    <nav className="dark-nav">
      <Link href="/" aria-label="Verified Athletics home" className="nav-logo-link">
        <NavLogo />
      </Link>
      <div className="dark-nav-links">
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
          Product
        </Link>
        <Link
          href={homePricingHref}
          onClick={(e) => {
            if (!onHome) {
              return;
            }
            e.preventDefault();
            window.location.hash = "pricing";
          }}
        >
          Pricing
        </Link>
        <Link href="/resources">Resources</Link>
        <Link href="/about">About Us</Link>
      </div>
      <div className="dark-nav-cta">
        <div className="dark-nav-sport">
          <select
            className={`nav-sel${hasSport ? " live" : ""}`}
            value={sport || ""}
            onChange={(event) => onSportChange(event.target.value)}
          >
            <option value="">My sport</option>
            {SPORTS.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button className={`nav-btn-demo${hasSport ? " sport-selected" : ""}`} data-requires-sport="true">
          Book a Demo
        </button>
        <Link href="/login" className="nav-login">
          Log In
        </Link>
      </div>
    </nav>
  );
}

export function MarketingFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-col-head">Resources</div>
          <Link href="/resources">Overview</Link>
          <Link href="/resources#hs-football-coaches">HS football coaches</Link>
          <Link href="/resources#recruiting-academy">Recruiting Academy</Link>
          <Link href="/resources#athletes-transfers">Athletes &amp; transfers</Link>
          <Link href="/resources#juco-more">JUCO context</Link>
          <Link href="/for-athletes">For Athletes</Link>
        </div>
        <div>
          <div className="footer-col-head">Company</div>
          <Link href={{ pathname: "/", hash: "product" }}>Product</Link>
          <Link href={{ pathname: "/", hash: "pricing" }}>Pricing</Link>
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
        <div className="footer-legal">
          © 2025 Verified Athletics. Approved recruiting/scouting service in accordance with NCAA bylaws.
        </div>
      </div>
    </footer>
  );
}
