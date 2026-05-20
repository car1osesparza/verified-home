function divisionClass(division) {
  if (division === "D1") return "d1";
  if (division === "D2") return "d2";
  if (division === "D3") return "d3";
  return "other";
}

export default function LogoTile({ school, active, dimmed, onSelect, className = "icm-logo-tile", hideTitle = false }) {
  const initials = school.schoolName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <button
      type="button"
      className={`${className} ${className}--${divisionClass(school.topDivision)}${active ? " is-active" : ""}${
        dimmed ? " is-dimmed" : ""
      }`}
      title={hideTitle ? undefined : `${school.schoolName} · ${school.topDivision || "Unclassified"}`}
      onClick={() => onSelect(school)}
    >
      {school.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={school.logo} alt="" loading="lazy" />
      ) : (
        <span className="icm-logo-fallback">{initials}</span>
      )}
    </button>
  );
}
