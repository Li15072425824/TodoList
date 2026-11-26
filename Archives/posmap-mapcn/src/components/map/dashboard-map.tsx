"use client";

import { useCallback, useEffect, useState } from "react";
import { Layers } from "lucide-react";

import { getBasemapAttribution, getBasemapLabel, getBasemapStyle } from "@/lib/basemaps";
import { CITY_ZOOM, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/constants";
import { toDisplay } from "@/lib/coord-transform";
import type {
  BasemapMode,
  ChargingStationItem,
  PoiItem,
  RangeCircle,
  StoreItem,
  ToolMode
} from "@/lib/types";
import { Map, MapControls, useMap } from "@/registry/map";
import { HeatLayer } from "@/components/map/heat-layer";
import { HoverTooltip } from "@/components/map/hover-tooltip";
import { MeasureTool } from "@/components/map/measure-tool";
import { NetworkLayer } from "@/components/map/network-layer";
import { RangeTool } from "@/components/map/range-tool";
import { SelectedPoi } from "@/components/map/selected-poi";

type DashboardMapProps = {
  basemap: BasemapMode;
  onBasemapChange: (mode: BasemapMode) => void;
  items: PoiItem[];
  stores: StoreItem[];
  chargingStations: ChargingStationItem[];
  heatMin: number;
  heatMax: number;
  cityCenter: { lat: number; lng: number; zoom?: number } | null;
  selectedPoi: PoiItem | null;
  toolMode: ToolMode;
  measureClearSignal: number;
  rangeRadiusKm: number;
  ranges: RangeCircle[];
  onAddRange: (center: { lat: number; lng: number }, radiusKm: number) => void;
  onRemoveRange: (id: string) => void;
  panelHoverCount: number;
};

function CameraRig({
  cityCenter,
  basemap
}: {
  cityCenter: DashboardMapProps["cityCenter"];
  basemap: BasemapMode;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !cityCenter) return;
    const display = toDisplay(cityCenter.lng, cityCenter.lat, basemap);
    if (!Number.isFinite(display.lat) || !Number.isFinite(display.lng)) return;

    map.flyTo({
      center: [display.lng, display.lat],
      zoom: cityCenter.zoom ?? CITY_ZOOM,
      duration: 900,
      essential: true
    });
  }, [map, isLoaded, cityCenter, basemap]);

  return null;
}

function ScrollZoomGuard({ disabled }: { disabled: boolean }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;
    if (disabled) {
      map.scrollZoom?.disable();
    } else {
      map.scrollZoom?.enable();
    }
  }, [map, isLoaded, disabled]);

  return null;
}

function TileErrorWatcher({
  enabled,
  onError
}: {
  enabled: boolean;
  onError: () => void;
}) {
  const { map } = useMap();

  useEffect(() => {
    if (!map || !enabled) return;
    let fired = false;

    const handleError = (event: { error?: Error }) => {
      if (fired) return;
      const message = String(event?.error?.message || "");
      if (/tile|404|403|failed|network/i.test(message)) {
        fired = true;
        onError();
      }
    };

    map.on("error", handleError);
    return () => {
      map.off("error", handleError);
    };
  }, [map, enabled, onError]);

  return null;
}

export default function DashboardMap({
  basemap,
  onBasemapChange,
  items,
  stores,
  chargingStations,
  heatMin,
  heatMax,
  cityCenter,
  selectedPoi,
  toolMode,
  measureClearSignal,
  rangeRadiusKm,
  ranges,
  onAddRange,
  onRemoveRange,
  panelHoverCount
}: DashboardMapProps) {
  const [tileError, setTileError] = useState(false);
  const reportTileError = useCallback(() => setTileError(true), []);

  useEffect(() => {
    setTileError(false);
  }, [basemap]);

  const center = toDisplay(DEFAULT_CENTER.lng, DEFAULT_CENTER.lat, basemap);

  return (
    <div className="dashboard-map">
      <Map
        center={[center.lng, center.lat]}
        zoom={DEFAULT_ZOOM}
        minZoom={3}
        maxZoom={18}
        attributionControl={false}
        mapStyle={getBasemapStyle(basemap)}
        mapStyleKey={basemap}
      >
        <MapControls
          position="bottom-left"
          className="!bottom-12 !left-1/2 !-translate-x-1/2"
          showZoom
          showFullscreen
        />
        <CameraRig cityCenter={cityCenter} basemap={basemap} />
        <ScrollZoomGuard disabled={panelHoverCount > 0} />
        <TileErrorWatcher enabled={basemap === "amap"} onError={reportTileError} />

        <HeatLayer items={items} basemap={basemap} heatMin={heatMin} heatMax={heatMax} />
        <NetworkLayer
          stores={stores}
          chargingStations={chargingStations}
          basemap={basemap}
        />
        <RangeTool
          enabled={toolMode === "range"}
          basemap={basemap}
          radiusKm={rangeRadiusKm}
          ranges={ranges}
          onAdd={onAddRange}
          onRemove={onRemoveRange}
        />
        <MeasureTool
          enabled={toolMode === "measure"}
          basemap={basemap}
          clearSignal={measureClearSignal}
        />
        <HoverTooltip
          items={items}
          stores={stores}
          chargingStations={chargingStations}
          basemap={basemap}
          enabled={toolMode === "none"}
        />
        <SelectedPoi poi={selectedPoi} basemap={basemap} />
      </Map>

      <div className="absolute left-1/2 top-3 z-40 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-950/85 p-1 shadow-xl backdrop-blur">
          <button
            type="button"
            onClick={() => onBasemapChange("amap")}
            data-active={basemap === "amap"}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-slate-300 transition data-[active=true]:bg-orange-500 data-[active=true]:text-white"
          >
            <Layers className="size-3.5" />
            高德
          </button>
          <button
            type="button"
            onClick={() => onBasemapChange("carto")}
            data-active={basemap === "carto"}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-slate-300 transition data-[active=true]:bg-orange-500 data-[active=true]:text-white"
          >
            <Layers className="size-3.5" />
            CARTO
          </button>
          <span className="px-2 text-[10px] text-slate-500">
            当前：{getBasemapLabel(basemap)}
          </span>
        </div>
      </div>

      {tileError && basemap === "amap" ? (
        <div className="absolute left-1/2 top-16 z-40 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-950/90 px-3 py-2 text-xs text-amber-200 shadow-xl backdrop-blur">
          高德底图瓦片加载失败。
          <button
            type="button"
            className="rounded-md bg-amber-500 px-2 py-1 text-[11px] font-medium text-slate-950"
            onClick={() => onBasemapChange("carto")}
          >
            切换到 CARTO
          </button>
        </div>
      ) : null}

      <div className="map-attribution pointer-events-none absolute bottom-1 left-1/2 z-10 -translate-x-1/2 rounded bg-slate-950/45 px-2 py-0.5 text-slate-400">
        {getBasemapAttribution(basemap)} · MapLibre GL
      </div>
    </div>
  );
}
