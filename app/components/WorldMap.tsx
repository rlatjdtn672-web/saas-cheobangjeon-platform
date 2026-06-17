"use client";

import { useEffect, useRef } from "react";

type Point = { label: string; lat: number; lon: number; hits: number };

// 오픈소스 Leaflet + OpenStreetMap(다크 타일: CARTO) 지도. CDN 로드(번들 가벼움).
function loadLeaflet(): Promise<any> {
  const w = window as any;
  if (w.L) return Promise.resolve(w.L);
  return new Promise((resolve) => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    let s = document.getElementById("leaflet-js") as HTMLScriptElement | null;
    if (s) {
      s.addEventListener("load", () => resolve((window as any).L));
      if ((window as any).L) resolve((window as any).L);
      return;
    }
    s = document.createElement("script");
    s.id = "leaflet-js";
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = () => resolve((window as any).L);
    document.body.appendChild(s);
  });
}

export default function WorldMap({ points }: { points: Point[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !ref.current || mapRef.current) return;
      const map = L.map(ref.current, { worldCopyJump: true, attributionControl: true }).setView(
        [20, 0],
        2
      );
      mapRef.current = map;
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap, © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      const valid = points.filter((p) => typeof p.lat === "number" && typeof p.lon === "number");
      const max = Math.max(1, ...valid.map((p) => p.hits));
      const latlngs: any[] = [];
      valid.forEach((p) => {
        const r = 6 + (p.hits / max) * 18;
        const m = L.circleMarker([p.lat, p.lon], {
          radius: r,
          color: "#5b8cff",
          fillColor: "#5b8cff",
          fillOpacity: 0.5,
          weight: 1.5,
        }).addTo(map);
        m.bindPopup(`<b>${p.label}</b><br/>${p.hits} 클릭`);
        latlngs.push([p.lat, p.lon]);
      });
      if (latlngs.length === 1) map.setView(latlngs[0], 6);
      else if (latlngs.length > 1) map.fitBounds(latlngs, { padding: [40, 40], maxZoom: 8 });
    });
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points]);

  return (
    <div>
      <div
        ref={ref}
        style={{ height: 360, width: "100%", borderRadius: 14, overflow: "hidden", background: "#0d1117" }}
      />
      {points.length === 0 && (
        <p className="mt-2 text-sm text-muted">
          아직 위치 데이터가 없습니다. (배포 환경에서 접속 시 지역이 잡힙니다)
        </p>
      )}
    </div>
  );
}
