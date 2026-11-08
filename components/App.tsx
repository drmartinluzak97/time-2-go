"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import PlaceInput from "./PlaceInput";
import ItineraryCard from "./ItineraryCard";
import Departures from "./Departures";
import { DICTS, LANGS, LANG_NAMES, LOCALES, type Lang } from "@/lib/i18n";
import { MODE_GROUPS, type ModeGroup, type PlanResponse, type Selected } from "@/lib/motis";

const RouteMap = dynamic(() => import("./RouteMap"), { ssr: false, loading: () => <div className="map" /> });

type Tab = "journey" | "departures";
const ALL_GROUPS: ModeGroup[] = ["rail", "bus", "city", "ferry"];

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
    const qs = q.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [restored, tab, from, to, stop, when, arriveBy, groups]);

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
    [from, to, when, arriveBy, groups, lang, t.pickBoth],
  );

  // Run the search automatically when a shared link is opened.
  useEffect(() => {
    if (restored?.search) {
      setRestored({ search: false });
      search();
    }
  }, [restored, search]);

  const itineraries = useMemo(() => plan?.itineraries ?? [], [plan]);
  const current = itineraries[selected] ?? null;

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
        <label className="lang">
          <span className="sr-only">{t.language}</span>
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
            {LANGS.map((l) => (
              <option key={l} value={l}>{LANG_NAMES[l]}</option>
            ))}
          </select>
        </label>
      </header>

      <main className="layout">
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
            <p>{t.disclaimer}</p>
            <p>{t.attribution}</p>
          </footer>
        </section>

        <section className="map-wrap" aria-hidden>
          <RouteMap
            itinerary={tab === "journey" ? current : null}
            from={tab === "journey" ? from : stop}
            to={tab === "journey" ? to : null}
          />
        </section>
      </main>
    </div>
  );
}
