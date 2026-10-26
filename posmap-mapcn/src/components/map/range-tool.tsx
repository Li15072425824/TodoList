"use client";

import { useEffect } from "react";
import type { MapMouseEvent } from "maplibre-gl";

import { toCanonical, toDisplay } from "@/lib/coord-transform";
import { circlePolygon } from "@/lib/geo";
import type { BasemapMode, RangeCircle } from "@/lib/types";
import { useMap } from "@/registry/map";
import { LAYER_IDS } from "@/components/map/layer-ids";

type RangeToolProps = {
  enabled: boolean;
  basemap: BasemapMode;
  radiusKm: number;
  ranges: RangeCircle[];
  onAdd: (center: { lat: number; lng: number }, radiusKm: number) => void;
  onRemove: (id: string) => void;
};

function buildCollection(
  ranges: RangeCircle[],
  basemap: BasemapMode
): { type: "FeatureCollection"; features: unknown[] } {
  return {
    type: "FeatureCollection",
    features: ranges.map((item) => {
      const ring = circlePolygon(
        { lng: item.center.lng, lat: item.center.lat },
        item.radiusKm
      ).map(([lng, lat]) => {
        const display = toDisplay(lng, lat, basemap);
        return [display.lng, display.lat];
      });

      return {
        type: "Feature",
        properties: { id: item.id, radiusKm: item.radiusKm },
        geometry: { type: "Polygon", coordinates: [ring] }
      };
    })
  };
}

export function RangeTool({
  enabled,
  basemap,
  radiusKm,
  ranges,
  onAdd,
  onRemove
}: RangeToolProps) {
  const { map, isLoaded, styleEpoch } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    if (!map.getSource(LAYER_IDS.rangeSource)) {
      map.addSource(LAYER_IDS.rangeSource, {
        type: "geojson",
        data: buildCollection(ranges, basemap) as never
      });
    }

    const beforeId = map.getLayer(LAYER_IDS.networkChargingLayer)
      ? LAYER_IDS.networkChargingLayer
      : undefined;

    if (!map.getLayer(LAYER_IDS.rangeFillLayer)) {
      map.addLayer(
        {
          id: LAYER_IDS.rangeFillLayer,
          type: "fill",
          source: LAYER_IDS.rangeSource,
          paint: {
            "fill-color": "#f97316",
            "fill-opacity": 0.14
          }
        },
        beforeId
      );
    }

    if (!map.getLayer(LAYER_IDS.rangeLineLayer)) {
      map.addLayer(
        {
          id: LAYER_IDS.rangeLineLayer,
          type: "line",
          source: LAYER_IDS.rangeSource,
          paint: {
            "line-color": "#f97316",
            "line-width": 2
          }
        },
        beforeId
      );
    }

    return () => {
      try {
        if (map.getLayer(LAYER_IDS.rangeFillLayer)) {
          map.removeLayer(LAYER_IDS.rangeFillLayer);
        }
        if (map.getLayer(LAYER_IDS.rangeLineLayer)) {
          map.removeLayer(LAYER_IDS.rangeLineLayer);
        }
        if (map.getSource(LAYER_IDS.rangeSource)) {
          map.removeSource(LAYER_IDS.rangeSource);
        }
      } catch {
        // style may already be gone
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isLoaded, styleEpoch]);

  useEffect(() => {
    if (!map || !isLoaded) return;
    const source = map.getSource(LAYER_IDS.rangeSource);
    if (source && "setData" in source) {
      (source as unknown as { setData: (data: unknown) => void }).setData(
        buildCollection(ranges, basemap)
      );
    }
  }, [map, isLoaded, styleEpoch, ranges, basemap]);

  useEffect(() => {
    if (!map || !isLoaded || !enabled) return;

    map.getCanvas().style.cursor = "crosshair";

    const handleClick = (event: MapMouseEvent) => {
      const canonical = toCanonical(event.lngLat.lng, event.lngLat.lat, basemap);
      onAdd({ lat: canonical.lat, lng: canonical.lng }, radiusKm);
    };

    const handleContextMenu = (event: MapMouseEvent) => {
      event.preventDefault();
      const features = map.queryRenderedFeatures(event.point, {
        layers: [LAYER_IDS.rangeFillLayer]
      });
      const hit = features[0];
      const id = hit?.properties?.id;
      if (typeof id === "string" && id) {
        onRemove(id);
      }
    };

    map.on("click", handleClick);
    map.on("contextmenu", handleContextMenu);

    return () => {
      map.off("click", handleClick);
      map.off("contextmenu", handleContextMenu);
      map.getCanvas().style.cursor = "";
    };
  }, [map, isLoaded, enabled, basemap, radiusKm, onAdd, onRemove]);

  return null;
}
