"use client";

/**
 * When a sport is selected, the clear control sits in the chevron slot (absolute, same footprint).
 * variant: dark (hero-style fields on dark), nav (compact — same as top nav sport picker).
 */
export default function SportSelectWithClear({
  sports,
  value,
  onValueChange,
  selectClassName = "",
  emptyLabel = "Choose sport",
  clearLabel = "Clear sport",
  compact = false,
  variant = "dark",
}) {
  const hasSport = Boolean(value);

  return (
    <div
      className={[
        "sport-select-wrap",
        compact && "sport-select-wrap--compact",
        hasSport && "sport-select-wrap--has-value",
        `sport-select-wrap--v-${variant}`,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <select
        className={selectClassName}
        value={value || ""}
        aria-label="Sport"
        onChange={(event) => {
          const next = event.target.value;
          if (typeof onValueChange === "function") {
            onValueChange(next);
          }
        }}
      >
        <option value="">{emptyLabel}</option>
        {sports.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
      {hasSport ? (
        <button
          type="button"
          className="sport-select-clear"
          aria-label={clearLabel}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (typeof onValueChange === "function") {
              onValueChange("");
            }
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
