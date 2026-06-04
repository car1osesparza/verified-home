import { applyPreferredSport } from "./preferred-sport";
import { recruitsSectionPathFromLocation } from "./recruits-path";
import { HS_FOOTBALL, SPORT_DROPDOWN_OPTIONS, SPORTS } from "./site-data";

/**
 * Handle sport picker change: HS Football → Recruits; other values → college sport selection.
 * @param {string} value
 */
export function handleSportDropdownChange(value) {
  const option = SPORT_DROPDOWN_OPTIONS.find((o) => o.value === value);
  if (option?.recruitsSection) {
    if (typeof window !== "undefined") {
      window.location.assign(recruitsSectionPathFromLocation(option.recruitsSection));
    }
    return;
  }

  if (!value) {
    applyPreferredSport("");
    return;
  }

  if (SPORTS.includes(value)) {
    applyPreferredSport(value);
  }
}
