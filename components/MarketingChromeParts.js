"use client";

import Link from "next/link";
import { SPORTS } from "../lib/site-data";

function NavLogo() {
  return (
    <div className="nav-logo-wrap">
      <img src="/brand/logomarkStacked_small_w.svg" alt="Verified Athletics" className="nav-logo-image" />
    </div>
  );
}

export function MarketingTopNav({ sport, hasSport, onSportChange }) {
  return (
    <nav className="dark-nav">
      <Link href="/" aria-label="Verified Athletics home" className="nav-logo-link">
        <NavLogo />
      </Link>
      <div className="dark-nav-links">
        <Link href="/product">Product</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/for-coaches">For Coaches</Link>
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
          <div className="footer-col-head">Product</div>
          <Link href="/product">Product</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/for-coaches">For Coaches</Link>
          <Link href="/hs-coaches">HS Coaches</Link>
        </div>
        <div>
          <div className="footer-col-head">Resources</div>
          <Link href="/resources">Resources Hub</Link>
          <Link href="/resources#academy">Recruiting Academy</Link>
          <Link href="/for-athletes">For Athletes</Link>
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
        <div className="footer-legal">
          © 2025 Verified Athletics. Approved recruiting/scouting service in accordance with NCAA bylaws.
        </div>
      </div>
    </footer>
  );
}
