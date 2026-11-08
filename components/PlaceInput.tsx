"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cleanMatches, matchSubtitle, modeKind, toSelected, type GeocodeMatch, type Selected } from "@/lib/motis";

interface Props {
  label: string;
  placeholder: string;
  value: Selected | null;
  onChange: (v: Selected | null) => void;
  lang: string;
  stopsOnly?: boolean;
}

const KIND_ICON: Record<string, string> = {
  rail: "🚆", bus: "🚌", coach: "🚌", tram: "🚋", metro: "🚇", ferry: "⛴️", walk: "📍", other: "🚏",
};

function iconFor(m: GeocodeMatch): string {
  if (m.type === "ADDRESS") return "🏠";
  if (m.type === "PLACE") return "📍";
  const first = m.modes?.[0];
  return first ? KIND_ICON[modeKind(first)] : "🚏";
}

export default function PlaceInput({ label, placeholder, value, onChange, lang, stopsOnly }: Props) {
  const id = useId();
  const [text, setText] = useState(value?.name ?? "");
  const [matches, setMatches] = useState<GeocodeMatch[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const typed = useRef(false);

  // Keep text in sync when value is changed from outside (swap, URL restore, favourites).
  // A null value while the user is typing must not wipe what they typed.
  useEffect(() => {
    if (value) setText(value.name);
    else if (!typed.current) setText("");
  }, [value?.id, value?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!typed.current) return;
    const q = text.trim();
    if (q.length < 2) {
      setMatches([]);
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ text: q, language: lang });
        if (stopsOnly) params.set("type", "STOP");
        const res = await fetch(`/api/geocode?${params}`, { signal: ctrl.signal });
        const data: GeocodeMatch[] = res.ok ? await res.json() : [];
        setMatches(cleanMatches(Array.isArray(data) ? data : []));
        setActive(0);
        setOpen(true);
      } catch {
        /* aborted or network error */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [text, lang, stopsOnly]);

  function pick(m: GeocodeMatch) {
    typed.current = false;
    const sel = toSelected(m);
    onChange(sel);
    setText(sel.name);
    setOpen(false);
  }

  return (
    <div className="field place">
      <label htmlFor={id}>{label}</label>
      <div className="place-box">
        <input
          id={id}
          type="text"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={`${id}-list`}
          placeholder={placeholder}
          value={text}
          onChange={(e) => {
            typed.current = true;
            setText(e.target.value);
            setMatches([]); // never show suggestions for the previous text
            if (value) onChange(null);
          }}
          onFocus={(e) => {
            e.target.select();
            if (matches.length) setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (!open || !matches.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, matches.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              pick(matches[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        {loading && <span className="spinner" aria-hidden />}
      </div>
      {open && matches.length > 0 && (
        <ul className="suggestions" id={`${id}-list`} role="listbox">
          {matches.map((m, i) => (
            <li
              key={`${m.id}-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "active" : ""}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(m);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="sug-icon" aria-hidden>{iconFor(m)}</span>
              <span className="sug-text">
                <span className="sug-name">{m.name}</span>
                <span className="sug-sub">{matchSubtitle(m)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
