// Types (subset) and helpers for the MOTIS v5 API.

export type Mode =
  | "WALK" | "BIKE" | "CAR" | "TRANSIT" | "TRAM" | "SUBWAY" | "FERRY" | "AIRPLANE"
  | "BUS" | "COACH" | "RAIL" | "HIGHSPEED_RAIL" | "LONG_DISTANCE" | "NIGHT_RAIL"
  | "REGIONAL_FAST_RAIL" | "REGIONAL_RAIL" | "SUBURBAN" | "METRO" | "FUNICULAR"
  | "AERIAL_LIFT" | "ODM" | "FLEX" | "CABLE_CAR" | "OTHER" | string;

export interface Place {
  name: string;
  stopId?: string;
  lat: number;
  lon: number;
  tz?: string;
  arrival?: string;
  departure?: string;
  scheduledArrival?: string;
  scheduledDeparture?: string;
  track?: string;
  scheduledTrack?: string;
  cancelled?: boolean;
}

export interface Leg {
  mode: Mode;
  from: Place;
  to: Place;
  duration: number;
  startTime: string;
  endTime: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  realTime: boolean;
  distance?: number;
  headsign?: string;
  routeShortName?: string;
  routeLongName?: string;
  displayName?: string;
  tripShortName?: string;
  routeColor?: string;
  routeTextColor?: string;
  agencyName?: string;
  agencyUrl?: string;
  agencyFareUrl?: string;
  cancelled?: boolean;
  intermediateStops?: Place[];
  legGeometry: { points: string; precision: number; length: number };
}

export interface Itinerary {
  duration: number;
  startTime: string;
  endTime: string;
  transfers: number;
  legs: Leg[];
}

export interface PlanResponse {
  itineraries: Itinerary[];
  direct: Itinerary[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export interface GeocodeMatch {
  type: "STOP" | "ADDRESS" | "PLACE";
  name: string;
  id: string;
  lat: number;
  lon: number;
  country?: string;
  areas?: { name: string; adminLevel: number; default?: boolean; unique?: boolean }[];
  modes?: Mode[];
  importance?: number;
}

export interface StopTime {
  place: Place;
  mode: Mode;
  realTime: boolean;
  headsign: string;
  agencyName?: string;
  routeShortName?: string;
  displayName?: string;
  tripShortName?: string;
  routeColor?: string;
  routeTextColor?: string;
  cancelled?: boolean;
  tripTo?: Place;
}

export interface StopTimesResponse {
  stopTimes: StopTime[];
  place: Place;
  previousPageCursor?: string;
  nextPageCursor?: string;
}

/** A place selected by the user (from autocomplete). */
export interface Selected {
  name: string;
  /** Value passed to MOTIS as fromPlace/toPlace/stopId. */
  id: string;
  lat: number;
  lon: number;
  isStop: boolean;
}

export const COUNTRIES = ["SK", "CZ", "HU", "PL", "AT", "UA"] as const;

export type ModeGroup = "rail" | "bus" | "city" | "ferry";
export const MODE_GROUPS: Record<ModeGroup, string[]> = {
  rail: ["RAIL"],
  bus: ["BUS", "COACH"],
  city: ["TRAM", "SUBWAY", "FUNICULAR", "AERIAL_LIFT"],
  ferry: ["FERRY"],
};

export function modeKind(mode: Mode): "walk" | "rail" | "bus" | "coach" | "tram" | "metro" | "ferry" | "other" {
  switch (mode) {
    case "WALK": return "walk";
    case "BUS": return "bus";
    case "COACH": return "coach";
    case "TRAM": case "FUNICULAR": case "AERIAL_LIFT": case "CABLE_CAR": return "tram";
    case "SUBWAY": case "METRO": return "metro";
    case "FERRY": return "ferry";
    case "RAIL": case "HIGHSPEED_RAIL": case "LONG_DISTANCE": case "NIGHT_RAIL":
    case "REGIONAL_FAST_RAIL": case "REGIONAL_RAIL": case "SUBURBAN": return "rail";
    default: return "other";
  }
}

const KIND_COLORS: Record<string, string> = {
  walk: "#8a8f98",
  rail: "#c62828",
  bus: "#1565c0",
  coach: "#2e7d32",
  tram: "#ef6c00",
  metro: "#6a1b9a",
  ferry: "#00838f",
  other: "#455a64",
};

export function legColor(leg: { mode: Mode; routeColor?: string }): string {
  const c = leg.routeColor?.trim();
  if (c && /^[0-9a-fA-F]{6}$/.test(c) && c.toLowerCase() !== "ffffff") return `#${c}`;
  return KIND_COLORS[modeKind(leg.mode)];
}

export function legTextColor(leg: { mode: Mode; routeColor?: string; routeTextColor?: string }): string {
  const c = leg.routeColor?.trim();
  if (c && /^[0-9a-fA-F]{6}$/.test(c) && c.toLowerCase() !== "ffffff") {
    const t = leg.routeTextColor?.trim();
    if (t && /^[0-9a-fA-F]{6}$/.test(t)) return `#${t}`;
    return contrastText(c);
  }
  return "#ffffff";
}

function contrastText(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#000000" : "#ffffff";
}

export function lineLabel(leg: { routeShortName?: string; displayName?: string; tripShortName?: string }): string {
  return (leg.displayName || leg.routeShortName || leg.tripShortName || "").trim();
}

/** Decode an encoded polyline (Google algorithm) with a given precision into [lon, lat] pairs. */
export function decodePolyline(str: string, precision: number): [number, number][] {
  const factor = Math.pow(10, precision);
  const coords: [number, number][] = [];
  let index = 0, lat = 0, lon = 0;
  while (index < str.length) {
    for (const which of [0, 1]) {
      let shift = 0, result = 0, byte: number;
      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20 && index < str.length);
      const delta = result & 1 ? ~(result >> 1) : result >> 1;
      if (which === 0) lat += delta; else lon += delta;
    }
    coords.push([lon / factor, lat / factor]);
  }
  return coords;
}

export function formatTime(iso: string | undefined, locale: string, tz?: string): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date(iso));
  } catch {
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  }
}

export function formatDate(iso: string, locale: string, tz?: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "numeric", timeZone: tz }).format(new Date(iso));
  } catch {
    return new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "numeric" }).format(new Date(iso));
  }
}

export function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} h ${rest} min` : `${h} h`;
}

/** Delay in whole minutes (positive = late), or null when unknown. */
export function delayMinutes(actual?: string, scheduled?: string): number | null {
  if (!actual || !scheduled) return null;
  return Math.round((new Date(actual).getTime() - new Date(scheduled).getTime()) / 60000);
}

/** Clean up geocoder output: drop broken entries, merge duplicates from different feeds,
 *  prefer our countries, and put a station before a same-named town (town centres are
 *  sometimes not connected to any stop in the routing data). */
export function cleanMatches(matches: GeocodeMatch[]): GeocodeMatch[] {
  const norm = (x: string) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const km = (a: GeocodeMatch, b: GeocodeMatch) => {
    const dLat = (a.lat - b.lat) * 111;
    const dLon = (a.lon - b.lon) * 111 * Math.cos((a.lat * Math.PI) / 180);
    return Math.hypot(dLat, dLon);
  };
  const ours = (m: GeocodeMatch) => (m.country && (COUNTRIES as readonly string[]).includes(m.country) ? 0 : 1);
  const valid = matches
    .filter((m) => !(m.lat === -1 && m.lon === -1) && Number.isFinite(m.lat))
    .sort((a, b) => ours(a) - ours(b));

  const out: GeocodeMatch[] = [];
  const isDup = (m: GeocodeMatch) => out.some((o) => o.type === m.type && norm(o.name) === norm(m.name) && km(o, m) < 3);
  for (const m of valid) {
    if (isDup(m)) continue;
    if (m.type === "PLACE") {
      const station = valid.find((x) => x.type === "STOP" && norm(x.name) === norm(m.name) && km(x, m) < 8);
      if (station && !isDup(station)) out.push(station);
    }
    if (!isDup(m)) out.push(m);
  }
  return out.slice(0, 8);
}

export function matchSubtitle(m: GeocodeMatch): string {
  const area = m.areas?.find((a) => a.default) ?? m.areas?.find((a) => a.adminLevel >= 5 && a.adminLevel <= 8);
  return [area?.name, m.country].filter(Boolean).join(", ");
}

export function toSelected(m: GeocodeMatch): Selected {
  const isStop = m.type === "STOP";
  return {
    name: m.name,
    id: isStop ? m.id : `${m.lat},${m.lon}`,
    lat: m.lat,
    lon: m.lon,
    isStop,
  };
}

/** Drop the same vehicle reported by two different data feeds (same minute, operator and destination). */
export function dedupeStopTimes(list: StopTime[]): StopTime[] {
  const norm = (x?: string) => (x ?? "").normalize("NFD").replace(/[^a-zA-Z]/g, "").toLowerCase().slice(0, 6);
  const seen = new Set<string>();
  return list.filter((st) => {
    const key = [st.place.scheduledDeparture ?? st.place.departure, norm(st.agencyName), norm(st.headsign || st.tripTo?.name)].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
