"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import PlaceInput from "./PlaceInput";
import ItineraryCard from "./ItineraryCard";
import Departures from "./Departures";
import Flag from "./Flag";
import { DICTS, LANGS, LANG_NAMES, LOCALES, type Lang } from "@/lib/i18n";
import { MODE_GROUPS, type ModeGroup, type PlanResponse, type Selected } from "@/lib/motis";

const RouteMap = dynamic(() => import("./RouteMap"), { ssr: false, loading: () => <div className="map" /> });

type Tab = "journey" | "departures";
const ALL_GROUPS: ModeGroup[] = ["rail", "bus", "city", "ferry"];
const FLAG_ORDER: Lang[] = ["sk", "cs", "de", "hu", "en", "pl"];
const TRANSFER_OPTIONS = [1, 2, 3, 4, 5];
const STAY_OPTIONS = [0, 3, 5, 10, 15, 30, 60, 90, 120];
const MAX_VIAS = 2;

interface Via {
  place: Selected | null;
  stay: number; // minutes
}

function encodePlace(p: Selected | null): string | null {
  return p ? [p.isStop ? "s" : "p", p.id, p.lat.toFixed(6), p.lon.toFixed(6), p.name].join("~") : null;
}

function decodePlace(s: string | null): Selected | null {
  if (!s) return null;
  const [kind, id, lat, lon, ...name] = s.split("~");
  if (!id || !lat || !lon) return null;
  return { isStop: kind === "s", id, lat: Number(lat), lon: Number(lon), name: name.join("~") };
}

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem("lang");
    if (saved && (LANGS as readonly string[]).includes(saved)) return saved as Lang;
  } catch { /* storage unavailable */ }
  const nav = (typeof navigator !== "undefined" ? navigator.language : "sk").slice(0, 2).toLowerCase();
  return (LANGS as readonly string[]).includes(nav) ? (nav as Lang) : "sk";
}

export default function App() {
  const [lang, setLang] = useState<Lang>("sk");
  const t = DICTS[lang];
  const locale = LOCALES[lang];

  const [tab, setTab] = useState<Tab>("journey");
  const [from, setFrom] = useState<Selected | null>(null);
  const [to, setTo] = useState<Selected | null>(null);
  const [stop, setStop] = useState<Selected | null>(null);
  const [when, setWhen] = useState(""); // datetime-local value; empty = now
  const [arriveBy, setArriveBy] = useState(false);
  const [groups, setGroups] = useState<ModeGroup[]>(ALL_GROUPS);
  const [maxTransfers, setMaxTransfers] = useState<number | null>(null);
  const [directOnly, setDirectOnly] = useState(false);
  const [minTransfer, setMinTransfer] = useState(0);
  const [vias, setVias] = useState<Via[]>([]);
  const [showMap, setShowMap] = useState(true);

  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(0);
  const [restored, setRestored] = useState<{ search: boolean } | null>(null);

  // Restore language and state from the URL on first load.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const l = q.get("lang");
    setLang(l && (LANGS as readonly string[]).includes(l) ? (l as Lang) : detectLang());
    if (q.get("tab") === "departures") setTab("departures");
    const f = decodePlace(q.get("from"));
    const d = decodePlace(q.get("to"));
    setFrom(f);
    setTo(d);
    setStop(decodePlace(q.get("stop")));
    if (q.get("time")) setWhen(q.get("time")!);
    if (q.get("arrive") === "1") setArriveBy(true);
    const m = q.get("modes");
    if (m) setGroups(m.split(",").filter((g): g is ModeGroup => (ALL_GROUPS as string[]).includes(g)));
    const mtt = Number(q.get("minTransfer"));
    if (STAY_OPTIONS.includes(mtt)) setMinTransfer(mtt);
    const mt = Number(q.get("maxTransfers"));
    if (TRANSFER_OPTIONS.includes(mt)) setMaxTransfers(mt);
    if (q.get("direct") === "1") setDirectOnly(true);
    const restoredVias: Via[] = [];
    for (let i = 1; i <= MAX_VIAS; i++) {
      const place = decodePlace(q.get(`via${i}`));
      if (place) restoredVias.push({ place, stay: Number(q.get(`stay${i}`)) || 0 });
    }
    setVias(restoredVias);
    try {
      if (localStorage.getItem("showMap") === "0") setShowMap(false);
    } catch { /* storage unavailable */ }
    setRestored({ search: Boolean(f && d) });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch { /* ignore */ }
  }, [lang]);

  // Keep the URL shareable.
  useEffect(() => {
    if (!restored) return;
    const q = new URLSearchParams();
    if (tab !== "journey") q.set("tab", tab);
    const f = encodePlace(from), d = encodePlace(to), s = encodePlace(stop);
    if (f) q.set("from", f);
    if (d) q.set("to", d);
    if (s) q.set("stop", s);
    if (when) q.set("time", when);
    if (arriveBy) q.set("arrive", "1");
    if (groups.length !== ALL_GROUPS.length) q.set("modes", groups.join(","));
    if (maxTransfers !== null) q.set("maxTransfers", String(maxTransfers));
    if (directOnly) q.set("direct", "1");
    if (minTransfer) q.set("minTransfer", String(minTransfer));
    vias.forEach((v, i) => {
      const enc = encodePlace(v.place);
      if (!enc) return;
      q.set(`via${i + 1}`, enc);
      if (v.stay) q.set(`stay${i + 1}`, String(v.stay));
    });
    const qs = q.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [restored, tab, from, to, stop, when, arriveBy, groups, maxTransfers, directOnly, minTransfer, vias]);

  useEffect(() => {
    try { localStorage.setItem("showMap", showMap ? "1" : "0"); } catch { /* ignore */ }
  }, [showMap]);

  const search = useCallback(
    async (cursor?: string) => {
      if (!from || !to) {
        setMessage(t.pickBoth);
        return;
      }
      setMessage("");
      setStatus("loading");
      try {
        const params = new URLSearchParams({
          fromPlace: from.id,
          toPlace: to.id,
          numItineraries: "6",
          language: lang,
        });
        if (when) params.set("time", new Date(when).toISOString());
        if (arriveBy) params.set("arriveBy", "true");
        if (groups.length && groups.length !== ALL_GROUPS.length) {
          params.set("transitModes", groups.flatMap((g) => MODE_GROUPS[g]).join(","));
        }
        if (directOnly) params.set("maxTransfers", "0");
        else if (maxTransfers !== null) params.set("maxTransfers", String(maxTransfers));
        if (minTransfer && !directOnly) params.set("minTransferTime", String(minTransfer));
        const viaStops = vias.filter((v) => v.place?.isStop);
        if (viaStops.length) {
          params.set("via", viaStops.map((v) => v.place!.id).join(","));
          params.set("viaMinimumStay", viaStops.map((v) => v.stay).join(","));
        }
        if (cursor) params.set("pageCursor", cursor);
        const res = await fetch(`/api/plan?${params}`);
        if (!res.ok) throw new Error(String(res.status));
        const data: PlanResponse = await res.json();
        setPlan(data);
        setSelected(0);
        setStatus("idle");
      } catch {
        setStatus("error");
      }
    },
    [from, to, when, arriveBy, groups, maxTransfers, directOnly, minTransfer, vias, lang, t.pickBoth],
  );

  // Run the search automatically when a shared link is opened.
  useEffect(() => {
    if (restored?.search) {
      setRestored({ search: false });
      search();
    }
  }, [restored, search]);

  const itineraries = useMemo(
    () => [...(plan?.itineraries ?? [])].sort((x, y) => x.startTime.localeCompare(y.startTime) || x.endTime.localeCompare(y.endTime)),
    [plan],
  );
  const current = itineraries[selected] ?? null;

  function updateVia(i: number, patch: Partial<Via>) {
    setVias((vs) => vs.map((v, j) => (j === i ? { ...v, ...patch } : v)));
  }

  function toggleGroup(g: ModeGroup) {
    setGroups((gs) => (gs.includes(g) ? gs.filter((x) => x !== g) : [...gs, g]));
  }

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="logo" aria-hidden>⏱</span>
          <span>time<span className="accent">2</span>go</span>
        </a>
        <div className="top-actions">
          <div className="flags" role="group" aria-label={t.language}>
            {FLAG_ORDER.map((l) => (
              <button
                key={l}
                type="button"
                className={`flag-btn ${l === lang ? "on" : ""}`}
                title={LANG_NAMES[l]}
                aria-label={LANG_NAMES[l]}
                aria-pressed={l === lang}
                onClick={() => setLang(l)}
              >
                <Flag lang={l} />
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`map-toggle ${showMap ? "on" : ""}`}
            aria-pressed={showMap}
            title={showMap ? t.hideMap : t.showMap}
            onClick={() => setShowMap((v) => !v)}
          >
            <span aria-hidden>🗺</span>
            <span className="map-toggle-label">{t.map}</span>
          </button>
        </div>
      </header>

      <main className={`layout ${showMap ? "" : "no-map"}`}>
        <section className="panel">
          <p className="tagline">{t.tagline}</p>

          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={tab === "journey"} className={tab === "journey" ? "on" : ""} onClick={() => setTab("journey")}>
              {t.tabJourney}
            </button>
            <button role="tab" aria-selected={tab === "departures"} className={tab === "departures" ? "on" : ""} onClick={() => setTab("departures")}>
              {t.tabDepartures}
            </button>
          </div>

          {tab === "journey" ? (
            <>
              <form
                className="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  search();
                }}
              >
                <div className="od">
                  <PlaceInput label={t.from} placeholder={t.placeholderPlace} value={from} onChange={setFrom} lang={lang} />
                  <button
                    type="button"
                    className="swap"
                    title={t.swap}
                    aria-label={t.swap}
                    onClick={() => {
                      setFrom(to);
                      setTo(from);
                    }}
                  >
                    ⇅
                  </button>
                  <PlaceInput label={t.to} placeholder={t.placeholderPlace} value={to} onChange={setTo} lang={lang} />
                </div>

                {vias.map((v, i) => (
                  <div className="via" key={i}>
                    <PlaceInput
                      label={vias.length > 1 ? `${t.via} ${i + 1}` : t.via}
                      placeholder={t.placeholderStop}
                      value={v.place}
                      onChange={(p) => updateVia(i, { place: p })}
                      lang={lang}
                      stopsOnly
                    />
                    <label className="field stay">
                      <span>{t.transferTime}</span>
                      <select value={v.stay} onChange={(e) => updateVia(i, { stay: Number(e.target.value) })}>
                        {STAY_OPTIONS.map((m) => (
                          <option key={m} value={m}>{m} min</option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      className="via-remove"
                      title={t.removeVia}
                      aria-label={t.removeVia}
                      onClick={() => setVias((vs) => vs.filter((_, j) => j !== i))}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {vias.length < MAX_VIAS && (
                  <button type="button" className="link add-via" onClick={() => setVias((vs) => [...vs, { place: null, stay: 0 }])}>
                    {t.addVia}
                  </button>
                )}

                <div className="row">
                  <div className="seg" role="group">
                    <button type="button" className={!arriveBy ? "on" : ""} onClick={() => setArriveBy(false)}>{t.departAt}</button>
                    <button type="button" className={arriveBy ? "on" : ""} onClick={() => setArriveBy(true)}>{t.arriveBy}</button>
                  </div>
                  <input
                    type="datetime-local"
                    className="when"
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    aria-label={arriveBy ? t.arriveBy : t.departAt}
                  />
                  {when && (
                    <button type="button" className="link" onClick={() => setWhen("")}>{t.now}</button>
                  )}
                </div>

                <fieldset className="modes">
                  <legend>{t.modes}</legend>
                  {ALL_GROUPS.map((g) => (
                    <label key={g} className={`mode-chip ${groups.includes(g) ? "on" : ""}`}>
                      <input type="checkbox" checked={groups.includes(g)} onChange={() => toggleGroup(g)} />
                      {t[g]}
                    </label>
                  ))}
                </fieldset>

                <div className="options">
                  <label className="field transfers">
                    <span>{t.maxTransfers}</span>
                    <select
                      value={directOnly ? "" : maxTransfers ?? ""}
                      disabled={directOnly}
                      onChange={(e) => setMaxTransfers(e.target.value === "" ? null : Number(e.target.value))}
                    >
                      <option value="">{directOnly ? "0" : t.any}</option>
                      {TRANSFER_OPTIONS.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field transfers">
                    <span>{t.minTransferTime}</span>
                    <select value={minTransfer} disabled={directOnly} onChange={(e) => setMinTransfer(Number(e.target.value))}>
                      {STAY_OPTIONS.map((m) => (
                        <option key={m} value={m}>{m} min</option>
                      ))}
                    </select>
                  </label>
                  <label className={`switch ${directOnly ? "on" : ""}`}>
                    <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} />
                    <span className="switch-track" aria-hidden><span className="switch-dot" /></span>
                    {t.directOnly}
                  </label>
                </div>

                <button className="primary" type="submit" disabled={status === "loading"}>
                  {status === "loading" ? t.searching : t.search}
                </button>
              </form>

              {message && <p className="notice">{message}</p>}
              {status === "error" && <p className="notice error">{t.error}</p>}

              {plan && (
                <div className="results">
                  {plan.previousPageCursor && (
                    <button className="ghost" type="button" onClick={() => search(plan.previousPageCursor)}>↑ {t.earlier}</button>
                  )}
                  {itineraries.length === 0 ? (
                    <p className="notice">{t.noResults}</p>
                  ) : (
                    itineraries.map((it, i) => (
                      <ItineraryCard
                        key={`${it.startTime}-${i}`}
                        it={it}
                        t={t}
                        locale={locale}
                        selected={i === selected}
                        onSelect={() => setSelected(i === selected ? -1 : i)}
                      />
                    ))
                  )}
                  {plan.nextPageCursor && (
                    <button className="ghost" type="button" onClick={() => search(plan.nextPageCursor)}>↓ {t.later}</button>
                  )}
                </div>
              )}
            </>
          ) : (
            <Departures t={t} lang={lang} locale={locale} stop={stop} onStop={setStop} />
          )}

          <footer className="foot">
            <button type="button" className="map-toggle foot-map" aria-pressed={showMap} onClick={() => setShowMap((v) => !v)}>
              <span aria-hidden>🗺</span> {showMap ? t.hideMap : t.showMap}
            </button>
            <p>{t.disclaimer}</p>
            <p>{t.attribution}</p>
            <p className="credit">{t.credit}</p>
            <p className="contact">
              <a href="https://martinluzak.sk" target="_blank" rel="noopener">martinluzak.sk</a>
              <span aria-hidden> · </span>
              <a href="mailto:hello@martinluzak.sk">hello@martinluzak.sk</a>
            </p>
          </footer>
        </section>

        {showMap && (
          <section className="map-wrap" aria-hidden>
            <RouteMap
              itinerary={tab === "journey" ? current : null}
              from={tab === "journey" ? from : stop}
              to={tab === "journey" ? to : null}
            />
          </section>
        )}
      </main>
    </div>
  );
}
