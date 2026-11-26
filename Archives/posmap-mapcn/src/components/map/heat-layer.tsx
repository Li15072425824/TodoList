"use client";

import { useEffect } from "react";

import { HEAT_GRADIENT_STOPS } from "@/lib/constants";
import { toDisplay } from "@/lib/coord-transform";
import type { BasemapMode, PoiItem } from "@/lib/types";
import { useMap } from "@/registry/map";
import { LAYER_IDS } from "@/components/map/layer-ids";

type HeatLayerProps = {
  items: PoiItem[];
  basemap: BasemapMode;
  heatMin: number;
  heatMax: number;
};

type FeatureCollectionLike = {
  type: "FeatureCollection";
  features: unknown[];
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function buildCollection(
  items: PoiItem[],
  basemap: BasemapMode,
  heatMin: number,
  heatMax: number
): FeatureCollectionLike {
  const denominator = heatMax - heatMin;
  const valid = items.filter(
    (item) =>
      Number.isFinite(Number(item.longitude)) && Number.isFinite(Number(item.latitude))
  );

  return {
    type: "FeatureCollection",
    features: valid.map((item, index) => {
      const value = Number(item.vehicleCount || item.pointCount || 1);
      const weight =
        denominator <= 0 ? 1 : clamp01((value - heatMin) / Math.max(denominator, 1));
      const display = toDisplay(Number(item.longitude), Number(item.latitude), basemap);

      return {
        type: "Feature",
        id: index,
        properties: { value, weight },
        geometry: {
          type: "Point",
          coordinates: [display.lng, display.lat]
        }
      };
    })
  };
}

export function HeatLayer({ items, basemap, heatMin, heatMax }: HeatLayerProps) {
  const { map, isLoaded, styleEpoch } = useMap();
  const collection = buildCollection(items, basemap, heatMin, heatMax);

  useEffect(() => {
    if (!map || !isLoaded) return;

    if (!map.getSource(LAYER_IDS.heatSource)) {
      map.addSource(LAYER_IDS.heatSource, {
        type: "geojson",
        data: collection as never
      });
    }

    if (!map.getLayer(LAYER_IDS.heatLayer)) {
      map.addLayer({
        id: LAYER_IDS.heatLayer,
        type: "heatmap",
        source: LAYER_IDS.heatSource,
        paint: {
          "heatmap-weight": ["get", "weight"],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            5,
            8,
            10,
            12,
            14,
            16,
            18
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            25,
            8,
            45,
            12,
            55,
            16,
            65
          ],
          "heatmap-opacity": 0.9,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            ...HEAT_GRADIENT_STOPS.flat()
          ] as never
        }
      });
    }

    return () => {
      try {
        if (map.getLayer(LAYER_IDS.heatLayer)) map.removeLayer(LAYER_IDS.heatLayer);
        if (map.getSource(LAYER_IDS.heatSource)) map.removeSource(LAYER_IDS.heatSource);
      } catch {
        // style may already be gone
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isLoaded, styleEpoch]);

  useEffect(() => {
    if (!map || !isLoaded) return;
    const source = map.getSource(LAYER_IDS.heatSource);
    if (source && "setData" in source) {
      (source as unknown as { setData: (data: unknown) => void }).setData(
        buildCollection(items, basemap, heatMin, heatMax)
      );
    }
  }, [map, isLoaded, styleEpoch, items, basemap, heatMin, heatMax]);

  return null;
}
