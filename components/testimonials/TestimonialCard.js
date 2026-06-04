"use client";

import { assetPath } from "../../lib/asset-path";
import useSchoolLogoForRole from "./useSchoolLogoForRole";

export default function TestimonialCard({ item, className = "" }) {
  const schoolLogo = useSchoolLogoForRole(item.img ? undefined : item.role);
  const avatarSrc = item.img ? assetPath(item.img) : schoolLogo;

  return (
    <article className={`t-card t-testimonial-card${className ? ` ${className}` : ""}`}>
      <blockquote className="t-quote">&quot;{item.q}&quot;</blockquote>
      <div className="t-foot">
        <div className="t-avatar">
          {avatarSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarSrc}
              alt=""
              className={!item.img && schoolLogo ? "t-avatar-logo" : undefined}
            />
          ) : (
            <span className="t-carousel-avatar-fallback" aria-hidden="true">
              {(item.name || "?").slice(0, 1)}
            </span>
          )}
        </div>
        <div>
          <div className="t-name">{item.name}</div>
          <div className="t-role">{item.role}</div>
        </div>
      </div>
    </article>
  );
}
