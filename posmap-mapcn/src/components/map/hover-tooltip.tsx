"use client";

import { useEffect, useRef, useState } from "react";
import type { MapMouseEvent } from "maplibre-gl";

import { toCanonical, toDisplay } from "@/lib/coord-transform";
import type {
  BasemapMode,
  ChargingStationItem,
  PoiItem,
  StoreItem
} from "@/lib/types";
import { useMap } from "@/registry/map";

type HoverTooltipProps = {
  items: PoiItem[];
  stores: StoreItem[];
  chargingStations: ChargingStationItem[];
  basemap: BasemapMode;
  enabled: boolean;
};

type HoverState = {
  x: number;
  y: number;
  ring: { x: number; y: number } | null;
  kind: "store" | "charging" | "poi";
  title: string;
  lines: string[];
  color: string;
};

const numberFormatter = new Intl.NumberFormat("zh-CN");

function findNearestPoi(
  lat: number,
  lng: number,
  items: PoiItem[],
  threshold: number,
  lngScale: number
): PoiItem | null {
  let nearest: PoiItem | null = null;
  let nearestDistance = Infinity;

  for (const item of items) {
    const itemLat = Number(item.latitude);
    const itemLng = Number(item.longitude);
    if (!Number.isFinite(itemLat) || !Number.isFinite(itemLng)) continue;
    const latDiff = itemLat - lat;
    const lngDiff = (itemLng - lng) * lngScale;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = item;
    }
  }

  return nearestDistance <= threshold ? nearest : null;
}

function findNearestStore(
  lat: number,
  lng: number,
  stores: StoreItem[],
  threshold: number,
  lngScale: number
): StoreItem | null {
  let nearest: StoreItem | null = null;
  let nearestDistance = Infinity;

  for (const store of stores) {
    const itemLat = Number(store.gcj02Latitude);
    const itemLng = Number(store.gcj02Longitude);
    if (!Number.isFinite(itemLat) || !Number.isFinite(itemLng)) continue;
    const latDiff = itemLat - lat;
    const lngDiff = (itemLng - lng) * lngScale;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = store;
    }
  }

  return nearestDistance <= threshold ? nearest : null;
}

function findNearestCharging(
  lat: number,
  lng: number,
  stations: ChargingStationItem[],
  threshold: number,
  lngScale: number
): ChargingStationItem | null {
  let nearest: ChargingStationItem | null = null;
  let nearestDistance = Infinity;

  for (const station of stations) {
    const itemLat = Number(station.lat);
    const itemLng = Number(station.lng);
    if (!Number.isFinite(itemLat) || !Number.isFinite(itemLng)) continue;
    const latDiff = itemLat - lat;
    const lngDiff = (itemLng - lng) * lngScale;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = station;
    }
  }

  return nearestDistance <= threshold ? nearest : null;
}

export function HoverTooltip({
  items,
  stores,
  chargingStations,
  basemap,
  enabled
}: HoverTooltipProps) {
  const { map, isLoaded } = useMap();
  const [hover, setHover] = useState<HoverState | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastEventRef = useRef<MapMouseEvent | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    if (!map || !isLoaded) return;

    const processEvent = (event: MapMouseEvent) => {
      if (!enabledRef.current) {
        setHover(null);
        return;
      }

      const bounds = map.getBounds();
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const west = bounds.getWest();
      const latSpan = Math.max(north - south, 0.01);
      const lngSpan = Math.max(east - west, 0.01);
      const span = Math.max(latSpan, lngSpan);

      const canonical = toCanonical(event.lngLat.lng, event.lngLat.lat, basemap);
      const lngScale = Math.cos((canonical.lat * Math.PI) / 180);
      const networkThreshold = span * 0.01;
      const poiThreshold = span * 0.018;

      const projectToRing = (lng: number, lat: number) => {
        const display = toDisplay(lng, lat, basemap);
        const point = map.project([display.lng, display.lat]);
        return { x: point.x, y: point.y };
      };

      const store = findNearestStore(
        canonical.lat,
        canonical.lng,
        stores,
        networkThreshold,
        lngScale
      );
      if (store) {
        setHover({
          x: event.point.x,
          y: event.point.y,
          ring: projectToRing(Number(store.gcj02Longitude), Number(store.gcj02Latitude)),
          kind: "store",
          title: store.storeName || store.fullName || "岚图门店",
          lines: [
            [store.city, store.dmsStoreType, store.storeManageStatus]
              .filter(Boolean)
              .join(" / ")
          ].filter(Boolean),
          color: "#f97316"
        });
        return;
      }

      const charging = findNearestCharging(
        canonical.lat,
        canonical.lng,
        chargingStations,
        networkThreshold,
        lngScale
      );
      if (charging) {
        setHover({
          x: event.point.x,
          y: event.point.y,
          ring: projectToRing(Number(charging.lng), Number(charging.lat)),
          kind: "charging",
          title: charging.staNm || "岚图超充站",
          lines: [
            [charging.cityNm, charging.attributeCdDesc, charging.address]
              .filter(Boolean)
              .join(" / ")
          ].filter(Boolean),
          color: "#4488FF"
        });
        return;
      }

      const poi = findNearestPoi(
        canonical.lat,
        canonical.lng,
        items,
        poiThreshold,
        lngScale
      );
      if (poi) {
        setHover({
          x: event.point.x,
          y: event.point.y,
          ring: projectToRing(Number(poi.longitude), Number(poi.latitude)),
          kind: "poi",
          title: poi.poiName,
          lines: [
            `停留次数：${numberFormatter.format(Number(poi.pointCount || 0))}`,
            `车辆数：${numberFormatter.format(Number(poi.vehicleCount || 0))}`,
            `平均停留：${Number(poi.avgStayDuration || 0).toFixed(1)} 小时`,
            poi.districtName ? `区县：${poi.districtName}` : "",
            poi.address ? `地址：${poi.address}` : ""
          ].filter(Boolean),
          color: "#f97316"
        });
        return;
      }

      setHover(null);
    };

    const handleMouseMove = (event: MapMouseEvent) => {
      lastEventRef.current = event;
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const latest = lastEventRef.current;
        if (latest) processEvent(latest);
      });
    };

    const hide = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      setHover(null);
    };

    map.on("mousemove", handleMouseMove);
    map.on("mouseout", hide);
    map.on("dragstart", hide);
    map.on("zoomstart", hide);
    map.on("rotatestart", hide);

    return () => {
      map.off("mousemove", handleMouseMove);
      map.off("mouseout", hide);
      map.off("dragstart", hide);
      map.off("zoomstart", hide);
      map.off("rotatestart", hide);
      hide();
    };
  }, [map, isLoaded, items, stores, chargingStations, basemap]);

  useEffect(() => {
    if (!enabled) setHover(null);
  }, [enabled]);

  if (!hover || !enabled) return null;

  const container = map?.getContainer();
  const width = container?.clientWidth ?? 0;
  const height = container?.clientHeight ?? 0;
  const left = Math.max(8, Math.min(hover.x + 16, width - 286));
  const top = Math.max(8, Math.min(hover.y + 16, height - 190));

  return (
    <>
      {hover.ring ? (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg"
          style={{
            left: hover.ring.x,
            top: hover.ring.y,
            width: 18,
            height: 18,
            background: `${hover.color}66`,
            boxShadow: `0 0 0 3px ${hover.color}55, 0 4px 14px rgba(2,6,23,.45)`
          }}
        />
      ) : null}
      <div
        className="pointer-events-none absolute z-30 w-[270px] rounded-lg border border-slate-700/80 bg-slate-950/95 px-3 py-2.5 text-xs text-slate-100 shadow-2xl backdrop-blur"
        style={{ left, top }}
      >
        <div className="mb-1.5 text-[13px] font-semibold leading-snug text-white">
          {hover.title}
        </div>
        <div className="space-y-0.5 text-slate-300">
          {hover.lines.map((line, index) => (
            <div key={`${hover.title}-${index}`}>{line}</div>
          ))}
        </div>
      </div>
    </>
  );
}
