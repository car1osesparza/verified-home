export const DIVISION_RANK = { D1: 1, D2: 2, D3: 3, "-": 4, null: 5 };

export const DIVISION_OPTIONS = [
  { value: "all", label: "All divisions" },
  { value: "D1", label: "Division I" },
  { value: "D2", label: "Division II" },
  { value: "D3", label: "Division III" },
  { value: "other", label: "Other / unclassified" },
];

export const FIPS_TO_STATE = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  "10": "DE",
  "11": "DC",
  "12": "FL",
  "13": "GA",
  "15": "HI",
  "16": "ID",
  "17": "IL",
  "18": "IN",
  "19": "IA",
  "20": "KS",
  "21": "KY",
  "22": "LA",
  "23": "ME",
  "24": "MD",
  "25": "MA",
  "26": "MI",
  "27": "MN",
  "28": "MS",
  "29": "MO",
  "30": "MT",
  "31": "NE",
  "32": "NV",
  "33": "NH",
  "34": "NJ",
  "35": "NM",
  "36": "NY",
  "37": "NC",
  "38": "ND",
  "39": "OH",
  "40": "OK",
  "41": "OR",
  "42": "PA",
  "44": "RI",
  "45": "SC",
  "46": "SD",
  "47": "TN",
  "48": "TX",
  "49": "UT",
  "50": "VT",
  "51": "VA",
  "53": "WA",
  "54": "WV",
  "55": "WI",
  "56": "WY",
};

export const STATE_TO_FIPS = Object.fromEntries(
  Object.entries(FIPS_TO_STATE).map(([fips, abbr]) => [abbr, fips])
);

export const REGIONS = [
  {
    id: "northeast",
    label: "Northeast",
    states: ["ME", "NH", "VT", "MA", "RI", "CT", "NY", "NJ", "PA"],
  },
  {
    id: "southeast",
    label: "Southeast",
    states: ["DE", "MD", "DC", "VA", "WV", "NC", "SC", "GA", "FL", "KY", "TN", "AL", "MS", "LA", "AR"],
  },
  {
    id: "midwest",
    label: "Midwest",
    states: ["OH", "MI", "IN", "IL", "WI", "MN", "IA", "MO", "ND", "SD", "NE", "KS"],
  },
  {
    id: "southwest",
    label: "Southwest",
    states: ["TX", "OK", "NM", "AZ"],
  },
  {
    id: "west",
    label: "West",
    states: ["CO", "WY", "MT", "ID", "WA", "OR", "NV", "UT", "CA", "AK", "HI"],
  },
];

export const STATE_TO_REGION = REGIONS.reduce((acc, region) => {
  region.states.forEach((state) => {
    acc[state] = region.id;
  });
  return acc;
}, {});

export const US_STATES_GEO_URL =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
