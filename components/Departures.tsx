"use client";

import { useState } from "react";
import PlaceInput from "./PlaceInput";
import { StopLists } from "./SavedLists";
import type { Saved } from "@/lib/saved";
import {
  dedupeStopTimes, delayMinutes, formatDate, formatTime, legColor, legTextColor, lineLabel,
  type Selected, type StopTimesResponse,
} from "@/lib/motis";
import type { T } from "@/lib/i18n";

interface Props {
  t: T;
  lang: string;
  locale: string;
  stop: Selected | null;
  onStop: (s: Selected | null) => void;
  saved: Saved;
}

export default function Departures({ t, lang, locale, stop: selectedStop, onStop, saved }: Props) {
  const [data, setData] = useState<StopTimesResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function load(cursor?: string, override?: Selected) {
    const stop = override ?? selectedStop;
    if (!stop || !stop.isStop) {
      setMessage(t.pickStop);
      return;
    }
    setMessage("");
    setStatus("loading");
    try {
      const params = new URLSearchParams({ stopId: stop.id, n: "30", language: lang });
      if (cursor) params.set("pageCursor", cursor);
      const res = await fetch(`/api/stoptimes?${params}`);
      if (!res.ok) throw new Error();
      const json: StopTimesResponse = await res.json();
      setData({ ...json, stopTimes: dedupeStopTimes(json.stopTimes ?? []) });
      if (!cursor) saved.addRecentStop(stop);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="departures">
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <PlaceInput label={t.stop} placeholder={t.placeholderStop} value={selectedStop} onChange={onStop} lang={lang} stopsOnly />
        <button className="primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? t.searching : t.showDepartures}
        </button>
      </form>

      {message && <p className="notice">{message}</p>}
      {status === "error" && <p className="notice error">{t.error}</p>}

      {data && selectedStop?.isStop && (
        <div className="results-head">
          <span className="results-title">{selectedStop.name}</span>
          <button
            type="button"
            className={`fav-btn ${saved.isFavStop(selectedStop) ? "on" : ""}`}
            aria-pressed={saved.isFavStop(selectedStop)}
            onClick={() => saved.toggleFavStop(selectedStop)}
          >
            {saved.isFavStop(selectedStop) ? `★ ${t.inFavorites}` : `☆ ${t.addFavorite}`}
          </button>
        </div>
      )}

      {data && (
        <>
          {data.previousPageCursor && (
            <button className="ghost" type="button" onClick={() => load(data.previousPageCursor)}>↑ {t.earlier}</button>
          )}
          {data.stopTimes.length === 0 ? (
            <p className="notice">{t.noDepartures}</p>
          ) : (
            <table className="board">
              <tbody>
                {data.stopTimes.map((st, i) => {
                  const d = delayMinutes(st.place.departure, st.place.scheduledDeparture);
                  const prev = data.stopTimes[i - 1];
                  const day = formatDate(st.place.scheduledDeparture ?? st.place.departure ?? "", locale, st.place.tz);
                  const prevDay = prev ? formatDate(prev.place.scheduledDeparture ?? prev.place.departure ?? "", locale, prev.place.tz) : null;
                  return (
                    <tr key={i} className={st.cancelled ? "is-cancelled" : ""}>
                      <td className="b-time">
                        {day !== prevDay && i > 0 && <span className="b-day">{day}</span>}
                        {formatTime(st.place.scheduledDeparture ?? st.place.departure, locale, st.place.tz)}
                        {st.realTime && d !== null && (
                          <span className={d > 0 ? "late" : "ontime"}>{d > 0 ? `+${d}` : t.onTime}</span>
                        )}
                      </td>
                      <td>
                        <span className="badge" style={{ background: legColor(st), color: legTextColor(st) }}>
                          {lineLabel(st) || st.mode}
                        </span>
                      </td>
                      <td className="b-dest">
                        {st.headsign || st.tripTo?.name}
                        <span className="b-agency">{st.agencyName}</span>
                      </td>
                      <td className="b-track">
                        {st.cancelled ? <span className="tag-cancel">{t.cancelled}</span> : st.place.track}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {data.nextPageCursor && (
            <button className="ghost" type="button" onClick={() => load(data.nextPageCursor)}>↓ {t.later}</button>
          )}
        </>
      )}
      <StopLists
        saved={saved}
        t={t}
        onOpen={(st) => {
          onStop(st);
          load(undefined, st);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
