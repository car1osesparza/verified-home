"use client";

import { useEffect, useMemo, useState } from "react";
import { assetPath } from "../../lib/asset-path";
import {
  assignSchoolStates,
  buildStateLookup,
  loadUsStatesGeo,
} from "../../lib/map-lab/geo";
import {
  divisionMatchesFilter,
  indexSchoolsByState,
  summarizeCoverage,
} from "../../lib/map-lab/customer-data";

export default function useCustomerMapData({ simplifiedStates = false } = {}) {
  const [schools, setSchools] = useState([]);
  const [statesGeo, setStatesGeo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        const [schoolRes, geo] = await Promise.all([
          fetch(assetPath("/data/customer_list_w_logo.json")),
          loadUsStatesGeo({ simplified: simplifiedStates }),
        ]);
        if (!schoolRes.ok) throw new Error("Failed to load customer data");
        const schoolData = await schoolRes.json();
        if (!Array.isArray(schoolData)) throw new Error("Customer data is not a valid list");
        if (!geo?.length) throw new Error("Failed to load US states geography");
        if (cancelled) return;
        setSchools(schoolData);
        setStatesGeo(geo);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Unable to load map data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, [simplifiedStates]);

  return { schools, statesGeo, loading, error };
}

export function useCustomerMapDerived(schools, statesGeo, divisionFilter) {
  const stateBySchoolId = useMemo(() => {
    if (!schools.length || !statesGeo.length) return new Map();
    return assignSchoolStates(schools, statesGeo);
  }, [schools, statesGeo]);

  const stateLookup = useMemo(() => buildStateLookup(statesGeo), [statesGeo]);

  const visibleSchools = useMemo(
    () => schools.filter((s) => divisionMatchesFilter(s.topDivision, divisionFilter)),
    [schools, divisionFilter]
  );

  const schoolsByState = useMemo(
    () => indexSchoolsByState(visibleSchools, stateBySchoolId),
    [visibleSchools, stateBySchoolId]
  );

  const coverage = useMemo(
    () => summarizeCoverage(schools, stateBySchoolId, divisionFilter),
    [schools, stateBySchoolId, divisionFilter]
  );

  return { stateBySchoolId, stateLookup, visibleSchools, schoolsByState, coverage };
}
