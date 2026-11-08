"use client";

// Favourites and search history, stored only in this browser (localStorage).
// Nothing here is ever sent to a server.

import { useCallback, useEffect, useState } from "react";
import type { ModeGroup, Selected } from "./motis";

export interface SavedJourney {
  from: Selected;
  to: Selected;
  vias: { place: Selected; stay: number }[];
  maxTransfers: number | null;
  directOnly: boolean;
  minTransfer: number;
  groups: ModeGroup[];
}

export interface FavJourney {
  key: string;
  name?: string;
  journey: SavedJourney;
}

export interface FavStop {
  key: string;
  name?: string;
  stop: Selected;
}

interface Store {
  favJourneys: FavJourney[];
  favStops: FavStop[];
  recentJourneys: FavJourney[];
  recentStops: FavStop[];
  saveHistory: boolean;
}

const STORAGE_KEY = "time2go:saved:v1";
const MAX_RECENT = 10;
const EMPTY: Store = { favJourneys: [], favStops: [], recentJourneys: [], recentStops: [], saveHistory: true };

export function journeyKey(j: SavedJourney): string {
  return JSON.stringify([
    j.from.id,
    j.to.id,
    j.vias.map((v) => [v.place.id, v.stay]),
    j.directOnly ? 0 : j.maxTransfers,
    j.minTransfer,
    [...j.groups].sort(),
  ]);
}

export const stopKey = (s: Selected) => s.id;

function read(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const data = JSON.parse(raw);
    return {
      favJourneys: Array.isArray(data.favJourneys) ? data.favJourneys : [],
      favStops: Array.isArray(data.favStops) ? data.favStops : [],
      recentJourneys: Array.isArray(data.recentJourneys) ? data.recentJourneys : [],
      recentStops: Array.isArray(data.recentStops) ? data.recentStops : [],
      saveHistory: data.saveHistory !== false,
    };
  } catch {
    return EMPTY;
  }
}

function write(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* storage full or blocked: favourites just won't persist */
  }
}

function pushRecent<T extends { key: string }>(list: T[], item: T): T[] {
  return [item, ...list.filter((x) => x.key !== item.key)].slice(0, MAX_RECENT);
}

export function useSaved() {
  const [store, setStore] = useState<Store>(EMPTY);

  useEffect(() => {
    setStore(read());
    // Keep several open tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStore(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (s: Store) => Store) => {
    setStore((prev) => {
      const next = fn(prev);
      write(next);
      return next;
    });
  }, []);

  return {
    ...store,

    isFavJourney: (j: SavedJourney) => store.favJourneys.some((f) => f.key === journeyKey(j)),
    toggleFavJourney: (j: SavedJourney) =>
      update((s) => {
        const key = journeyKey(j);
        return s.favJourneys.some((f) => f.key === key)
          ? { ...s, favJourneys: s.favJourneys.filter((f) => f.key !== key) }
          : { ...s, favJourneys: [{ key, journey: j }, ...s.favJourneys] };
      }),
    renameFavJourney: (key: string, name: string) =>
      update((s) => ({
        ...s,
        favJourneys: s.favJourneys.map((f) => (f.key === key ? { ...f, name: name.trim() || undefined } : f)),
      })),
    removeFavJourney: (key: string) => update((s) => ({ ...s, favJourneys: s.favJourneys.filter((f) => f.key !== key) })),

    isFavStop: (stop: Selected) => store.favStops.some((f) => f.key === stopKey(stop)),
    toggleFavStop: (stop: Selected) =>
      update((s) => {
        const key = stopKey(stop);
        return s.favStops.some((f) => f.key === key)
          ? { ...s, favStops: s.favStops.filter((f) => f.key !== key) }
          : { ...s, favStops: [{ key, stop }, ...s.favStops] };
      }),
    renameFavStop: (key: string, name: string) =>
      update((s) => ({
        ...s,
        favStops: s.favStops.map((f) => (f.key === key ? { ...f, name: name.trim() || undefined } : f)),
      })),
    removeFavStop: (key: string) => update((s) => ({ ...s, favStops: s.favStops.filter((f) => f.key !== key) })),

    addRecentJourney: (j: SavedJourney) =>
      update((s) => (s.saveHistory ? { ...s, recentJourneys: pushRecent(s.recentJourneys, { key: journeyKey(j), journey: j }) } : s)),
    addRecentStop: (stop: Selected) =>
      update((s) => (s.saveHistory ? { ...s, recentStops: pushRecent(s.recentStops, { key: stopKey(stop), stop }) } : s)),
    removeRecentJourney: (key: string) =>
      update((s) => ({ ...s, recentJourneys: s.recentJourneys.filter((x) => x.key !== key) })),
    removeRecentStop: (key: string) => update((s) => ({ ...s, recentStops: s.recentStops.filter((x) => x.key !== key) })),
    clearHistory: () => update((s) => ({ ...s, recentJourneys: [], recentStops: [] })),
    setSaveHistory: (on: boolean) =>
      update((s) => (on ? { ...s, saveHistory: true } : { ...s, saveHistory: false, recentJourneys: [], recentStops: [] })),
  };
}

export type Saved = ReturnType<typeof useSaved>;
