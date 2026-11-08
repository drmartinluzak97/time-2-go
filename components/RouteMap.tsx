"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { decodePolyline, legColor, type Itinerary, type Selected } from "@/lib/motis";

interface Props {
  itinerary: Itinerary | null;
  from: Selected | null;
  to: Selected | null;
}

const STYLE = "https://tiles.openfreemap.org/styles/liberty";
const CENTRAL_EUROPE: [number, number] = [17.6, 48.9];

export default function RouteMap({ itinerary, from, to }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const ready = useRef(false);
  const pending = useRef<() => void>(() => {});

  useEffect(() => {
    if (!container.current) return;
    const m = new maplibregl.Map({
      container: container.current,
      style: STYLE,
      center: CENTRAL_EUROPE,
      zoom: 5.3,
      attributionControl: { compact: true },
    });
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    m.on("load", () => {
      m.addSource("route", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      m.addLayer({
        id: "route-casing",
        type: "line",
        source: "route",
        filter: ["!=", ["get", "walk"], true],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ffffff", "line-width": 8 },
      });
      m.addLayer({
        id: "route-transit",
        type: "line",
        source: "route",
        filter: ["!=", ["get", "walk"], true],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": ["get", "color"], "line-width": 5 },
      });
      m.addLayer({
        id: "route-walk",
        type: "line",
        source: "route",
        filter: ["==", ["get", "walk"], true],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#6b7280", "line-width": 3, "line-dasharray": [0.5, 2] },
      });
      ready.current = true;
      pending.current();
    });
    map.current = m;
    return () => {
      m.remove();
      map.current = null;
      ready.current = false;
    };
  }, []);

  useEffect(() => {
    const draw = () => {
      const m = map.current;
      if (!m) return;
      markers.current.forEach((mk) => mk.remove());
      markers.current = [];

      const features: GeoJSON.Feature[] = [];
      const bounds = new maplibregl.LngLatBounds();

      if (itinerary) {
        for (const leg of itinerary.legs) {
          const coords = decodePolyline(leg.legGeometry.points, leg.legGeometry.precision);
          if (coords.length < 2) continue;
          coords.forEach((c) => bounds.extend(c));
          features.push({
            type: "Feature",
            properties: { color: legColor(leg), walk: leg.mode === "WALK" },
            geometry: { type: "LineString", coordinates: coords },
          });
        }
      }
      (m.getSource("route") as maplibregl.GeoJSONSource | undefined)?.setData({ type: "FeatureCollection", features });

      const ends: [Selected | null, string][] = [[from, "#16a34a"], [to, "#dc2626"]];
      for (const [p, color] of ends) {
        if (!p) continue;
        markers.current.push(new maplibregl.Marker({ color }).setLngLat([p.lon, p.lat]).addTo(m));
        bounds.extend([p.lon, p.lat]);
      }

      if (!bounds.isEmpty()) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        if (ne.lng === sw.lng && ne.lat === sw.lat) m.flyTo({ center: ne, zoom: 13 });
        else m.fitBounds(bounds, { padding: 48, maxZoom: 15, duration: 600 });
      }
    };
    if (ready.current) draw();
    else pending.current = draw;
  }, [itinerary, from, to]);

  return <div ref={container} className="map" />;
}
