import { assetPath } from "../../lib/asset-path";

export default function TestimonialCard({ item, className = "" }) {
  return (
    <article className={`t-card t-testimonial-card${className ? ` ${className}` : ""}`}>
      <blockquote className="t-quote">&quot;{item.q}&quot;</blockquote>
      <div className="t-foot">
        <div className="t-avatar">
          {item.img ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={assetPath(item.img)} alt="" />
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
