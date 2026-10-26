"use client";

import { useEffect } from "react";
import { MapPin } from "lucide-react";

import { POI_ZOOM } from "@/lib/constants";
import { toDisplay } from "@/lib/coord-transform";
import type { BasemapMode, PoiItem } from "@/lib/types";
import {
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  useMap
} from "@/registry/map";

type SelectedPoiProps = {
  poi: PoiItem | null;
  basemap: BasemapMode;
};

export function SelectedPoi({ poi, basemap }: SelectedPoiProps) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !poi) return;
    const display = toDisplay(Number(poi.longitude), Number(poi.latitude), basemap);
    if (!Number.isFinite(display.lat) || !Number.isFinite(display.lng)) return;

    map.flyTo({
      center: [display.lng, display.lat],
      zoom: Math.max(map.getZoom(), POI_ZOOM),
      duration: 900,
      essential: true
    });
  }, [map, isLoaded, poi, basemap]);

  if (!poi) return null;

  const display = toDisplay(Number(poi.longitude), Number(poi.latitude), basemap);
  if (!Number.isFinite(display.lat) || !Number.isFinite(display.lng)) return null;

  return (
    <MapMarker
      longitude={display.lng}
      latitude={display.lat}
      anchor="bottom"
    >
      <MarkerContent className="pointer-events-auto">
        <MapPin
          className="selected-pin size-9 fill-orange-500 text-white"
          strokeWidth={1.6}
        />
      </MarkerContent>
      <MarkerLabel position="top">
        <span className="max-w-[180px] truncate rounded bg-slate-950/85 px-1.5 py-0.5 text-[10px] text-white">
          {poi.poiName}
        </span>
      </MarkerLabel>
      <MarkerPopup offset={18}>
        <div className="min-w-[220px] space-y-1 text-slate-100">
          <p className="text-[13px] font-semibold text-white">{poi.poiName}</p>
          <p>停留次数：{poi.pointCount}</p>
          <p>车辆数：{poi.vehicleCount}</p>
          <p>平均停留：{Number(poi.avgStayDuration || 0).toFixed(1)} 小时</p>
          {poi.districtName ? <p>区县：{poi.districtName}</p> : null}
          {poi.address ? <p className="text-slate-400">地址：{poi.address}</p> : null}
        </div>
      </MarkerPopup>
    </MapMarker>
  );
}
