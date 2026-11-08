"use client";

import {
  delayMinutes, formatDuration, formatTime, legColor, legTextColor, lineLabel, modeKind,
  type Itinerary, type Leg,
} from "@/lib/motis";
import { transfersLabel, type T } from "@/lib/i18n";

const KIND_ICON: Record<string, string> = {
  walk: "🚶", rail: "🚆", bus: "🚌", coach: "🚌", tram: "🚋", metro: "🚇", ferry: "⛴️", other: "🚐",
};

interface Props {
  it: Itinerary;
  t: T;
  locale: string;
  selected: boolean;
  onSelect: () => void;
}

function Delay({ actual, scheduled, t }: { actual?: string; scheduled?: string; t: T }) {
  const d = delayMinutes(actual, scheduled);
  if (d === null || d === 0) return null;
  return <span className={d > 0 ? "late" : "early"} title={t.delay}>{d > 0 ? `+${d}` : d}</span>;
}

function LineBadge({ leg }: { leg: Leg }) {
  const label = lineLabel(leg);
  return (
    <span className="badge" style={{ background: legColor(leg), color: legTextColor(leg) }}>
      <span aria-hidden>{KIND_ICON[modeKind(leg.mode)]}</span>
      {label && <span>{label}</span>}
    </span>
  );
}

export default function ItineraryCard({ it, t, locale, selected, onSelect }: Props) {
  const first = it.legs[0];
  const last = it.legs[it.legs.length - 1];
  const transit = it.legs.filter((l) => l.mode !== "WALK");
  const firstTransit = transit[0];
  const anyCancelled = it.legs.some((l) => l.cancelled);

  return (
    <article className={`card ${selected ? "selected" : ""} ${anyCancelled ? "is-cancelled" : ""}`}>
      <button type="button" className="card-head" onClick={onSelect} aria-expanded={selected}>
        <div className="times">
          <span className="time-big">{formatTime(it.startTime, locale, first.from.tz)}</span>
          <span className="arrow" aria-hidden>→</span>
          <span className="time-big">{formatTime(it.endTime, locale, last.to.tz)}</span>
        </div>
        <div className="meta">
          <span>{formatDuration(it.duration)}</span>
          <span className="dot" aria-hidden>·</span>
          <span>{transfersLabel(t, it.transfers)}</span>
          {anyCancelled && <span className="tag-cancel">{t.cancelled}</span>}
        </div>
        <div className="chips">
          {it.legs.map((leg, i) =>
            leg.mode === "WALK" ? (
              leg.duration >= 180 ? (
                <span key={i} className="walk-chip" title={t.walk}>🚶 {Math.round(leg.duration / 60)}′</span>
              ) : null
            ) : (
              <LineBadge key={i} leg={leg} />
            ),
          )}
        </div>
        {firstTransit && (
          <div className="sub">
            {firstTransit.from.name}
            {firstTransit.from.track ? ` · ${t.platform} ${firstTransit.from.track}` : ""}
          </div>
        )}
      </button>

      {selected && (
        <ol className="legs">
          {it.legs.map((leg, i) => (
            <li key={i} className={`leg ${leg.mode === "WALK" ? "walk" : ""}`} style={{ ["--c" as string]: legColor(leg) }}>
              {leg.mode === "WALK" ? (
                <div className="leg-walk">
                  🚶 {t.walk} {formatDuration(leg.duration)}
                  {leg.distance ? ` · ${Math.round(leg.distance)} m` : ""}
                </div>
              ) : (
                <>
                  <div className="leg-row">
                    <span className="leg-time">
                      {formatTime(leg.startTime, locale, leg.from.tz)}
                      <Delay actual={leg.startTime} scheduled={leg.scheduledStartTime} t={t} />
                    </span>
                    <span className="leg-stop">
                      {leg.from.name}
                      {leg.from.track && <span className="track">{t.platform} {leg.from.track}</span>}
                    </span>
                  </div>
                  <div className="leg-line">
                    <LineBadge leg={leg} />
                    {leg.headsign && <span className="headsign">{t.direction} {leg.headsign}</span>}
                    <span className="leg-info">
                      {formatDuration(leg.duration)}
                      {leg.intermediateStops?.length ? ` · ${leg.intermediateStops.length + 1} ${t.stops}` : ""}
                      {leg.agencyName ? ` · ${leg.agencyName}` : ""}
                      {leg.realTime && <span className="rt" title={t.realtime}> ●</span>}
                    </span>
                    {leg.agencyFareUrl && (
                      <a className="ticket" href={leg.agencyFareUrl} target="_blank" rel="noopener noreferrer">
                        {t.tickets} ↗
                      </a>
                    )}
                  </div>
                  <div className="leg-row">
                    <span className="leg-time">
                      {formatTime(leg.endTime, locale, leg.to.tz)}
                      <Delay actual={leg.endTime} scheduled={leg.scheduledEndTime} t={t} />
                    </span>
                    <span className="leg-stop">
                      {leg.to.name}
                      {leg.to.track && <span className="track">{t.platform} {leg.to.track}</span>}
                    </span>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
