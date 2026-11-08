"use client";

import { useState } from "react";
import type { T } from "@/lib/i18n";
import type { FavJourney, FavStop, Saved, SavedJourney } from "@/lib/saved";
import type { Selected } from "@/lib/motis";

interface Item {
  key: string;
  title: string;
  subtitle?: string;
  name?: string;
}

function Row({
  item, t, onOpen, onRemove, onRename,
}: {
  item: Item;
  t: T;
  onOpen: () => void;
  onRemove: () => void;
  onRename?: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.name ?? "");

  if (editing && onRename) {
    return (
      <li className="saved-row editing">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onRename(value);
            setEditing(false);
          }}
        >
          <input
            autoFocus
            value={value}
            maxLength={40}
            placeholder={item.title}
            aria-label={t.rename}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
          />
          <button type="submit" className="icon-btn" aria-label={t.save} title={t.save}>✓</button>
        </form>
      </li>
    );
  }

  return (
    <li className="saved-row">
      <button type="button" className="saved-open" onClick={onOpen}>
        <span className="saved-title">{item.name || item.title}</span>
        {(item.name || item.subtitle) && (
          <span className="saved-sub">{[item.name ? item.title : null, item.subtitle].filter(Boolean).join(" · ")}</span>
        )}
      </button>
      {onRename && (
        <button
          type="button"
          className="icon-btn"
          aria-label={t.rename}
          title={t.rename}
          onClick={() => {
            setValue(item.name ?? "");
            setEditing(true);
          }}
        >
          ✎
        </button>
      )}
      <button type="button" className="icon-btn" aria-label={t.remove} title={t.remove} onClick={onRemove}>✕</button>
    </li>
  );
}

function journeyItem(f: FavJourney, t: T): Item {
  const j = f.journey;
  const via = j.vias.length ? ` (${t.via.toLowerCase()} ${j.vias.map((v) => v.place.name).join(", ")})` : "";
  const opts: string[] = [];
  if (j.directOnly) opts.push(t.directOnly);
  else if (j.maxTransfers !== null) opts.push(`${t.maxTransfers}: ${j.maxTransfers}`);
  if (j.minTransfer && !j.directOnly) opts.push(`${t.minTransferTime}: ${j.minTransfer} min`);
  return { key: f.key, name: f.name, title: `${j.from.name} → ${j.to.name}${via}`, subtitle: opts.join(" · ") || undefined };
}

export function JourneyLists({ saved, t, onOpen }: { saved: Saved; t: T; onOpen: (j: SavedJourney) => void }) {
  const hasAny = saved.favJourneys.length > 0 || saved.recentJourneys.length > 0;
  return (
    <div className="saved">
      {saved.favJourneys.length > 0 && (
        <section>
          <h2>★ {t.favorites}</h2>
          <ul>
            {saved.favJourneys.map((f) => (
              <Row
                key={f.key}
                item={journeyItem(f, t)}
                t={t}
                onOpen={() => onOpen(f.journey)}
                onRemove={() => saved.removeFavJourney(f.key)}
                onRename={(name) => saved.renameFavJourney(f.key, name)}
              />
            ))}
          </ul>
        </section>
      )}
      {saved.recentJourneys.length > 0 && (
        <section>
          <h2>🕘 {t.recent}</h2>
          <ul>
            {saved.recentJourneys.map((f) => (
              <Row
                key={f.key}
                item={journeyItem(f, t)}
                t={t}
                onOpen={() => onOpen(f.journey)}
                onRemove={() => saved.removeRecentJourney(f.key)}
              />
            ))}
          </ul>
        </section>
      )}
      <HistoryControls saved={saved} t={t} show={hasAny || !saved.saveHistory} />
    </div>
  );
}

export function StopLists({ saved, t, onOpen }: { saved: Saved; t: T; onOpen: (s: Selected) => void }) {
  const stopItem = (f: FavStop): Item => ({ key: f.key, name: f.name, title: f.stop.name });
  const hasAny = saved.favStops.length > 0 || saved.recentStops.length > 0;
  return (
    <div className="saved">
      {saved.favStops.length > 0 && (
        <section>
          <h2>★ {t.favoriteStops}</h2>
          <ul>
            {saved.favStops.map((f) => (
              <Row
                key={f.key}
                item={stopItem(f)}
                t={t}
                onOpen={() => onOpen(f.stop)}
                onRemove={() => saved.removeFavStop(f.key)}
                onRename={(name) => saved.renameFavStop(f.key, name)}
              />
            ))}
          </ul>
        </section>
      )}
      {saved.recentStops.length > 0 && (
        <section>
          <h2>🕘 {t.recentStops}</h2>
          <ul>
            {saved.recentStops.map((f) => (
              <Row
                key={f.key}
                item={stopItem(f)}
                t={t}
                onOpen={() => onOpen(f.stop)}
                onRemove={() => saved.removeRecentStop(f.key)}
              />
            ))}
          </ul>
        </section>
      )}
      <HistoryControls saved={saved} t={t} show={hasAny || !saved.saveHistory} />
    </div>
  );
}

function HistoryControls({ saved, t, show }: { saved: Saved; t: T; show: boolean }) {
  if (!show) return null;
  const hasHistory = saved.recentJourneys.length > 0 || saved.recentStops.length > 0;
  return (
    <div className="history-controls">
      <label className={`switch small ${saved.saveHistory ? "on" : ""}`}>
        <input type="checkbox" checked={saved.saveHistory} onChange={(e) => saved.setSaveHistory(e.target.checked)} />
        <span className="switch-track" aria-hidden><span className="switch-dot" /></span>
        {t.saveHistory}
      </label>
      {hasHistory && (
        <button type="button" className="link" onClick={saved.clearHistory}>{t.clearHistory}</button>
      )}
    </div>
  );
}
