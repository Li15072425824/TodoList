"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MapMouseEvent } from "maplibre-gl";

import { toCanonical, toDisplay } from "@/lib/coord-transform";
import { formatDistance, haversineKm } from "@/lib/geo";
import type { BasemapMode } from "@/lib/types";
import { MapMarker, MarkerContent, useMap } from "@/registry/map";
import { LAYER_IDS } from "@/components/map/layer-ids";

type Point = { lng: number; lat: number };

type MeasureToolProps = {
  enabled: boolean;
  basemap: BasemapMode;
  clearSignal: number;
};

function segmentLength(points: Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += haversineKm(points[i - 1], points[i]);
  }
  return total;
}

function cumulativePoints(points: Point[]): Array<{ point: Point; total: number }> {
  const result: Array<{ point: Point; total: number }> = [];
  let total = 0;
  points.forEach((point, index) => {
    if (index > 0) {
      total += haversineKm(points[index - 1], point);
      result.push({ point, total });
    }
  });
  return result;
}

export function MeasureTool({ enabled, basemap, clearSignal }: MeasureToolProps) {
  const { map, isLoaded, styleEpoch } = useMap();
  const [segments, setSegments] = useState<Point[][]>([]);
  const [active, setActive] = useState<Point[]>([]);
  const activeRef = useRef<Point[]>([]);
  const segmentsRef = useRef<Point[][]>([]);

  activeRef.current = active;
  segmentsRef.current = segments;

  const finalize = useCallback(() => {
    const points = activeRef.current;
    if (points.length >= 2) {
      segmentsRef.current = [...segmentsRef.current, points];
      setSegments(segmentsRef.current);
    }
    activeRef.current = [];
    setActive([]);
  }, []);

  // 关闭 / 清空
  useEffect(() => {
    activeRef.current = [];
    segmentsRef.current = [];
    setActive([]);
    setSegments([]);
  }, [enabled, clearSignal]);

  // 事件：只在启用时绑定
  useEffect(() => {
    if (!map || !isLoaded || !enabled) return;

    map.getCanvas().style.cursor = "crosshair";
    map.doubleClickZoom?.disable();

    const handleClick = (event: MapMouseEvent) => {
      const detail = (event.originalEvent as MouseEvent | undefined)?.detail ?? 1;
      if (detail > 1) return;
      const canonical = toCanonical(event.lngLat.lng, event.lngLat.lat, basemap);
      activeRef.current = [
        ...activeRef.current,
        { lng: canonical.lng, lat: canonical.lat }
      ];
      setActive(activeRef.current);
    };

    const handleDoubleClick = (event: MapMouseEvent) => {
      event.preventDefault();
      finalize();
    };

    const handleContextMenu = (event: MapMouseEvent) => {
      event.preventDefault();
      finalize();
    };

    map.on("click", handleClick);
    map.on("dblclick", handleDoubleClick);
    map.on("contextmenu", handleContextMenu);

    return () => {
      map.off("click", handleClick);
      map.off("dblclick", handleDoubleClick);
      map.off("contextmenu", handleContextMenu);
      map.doubleClickZoom?.enable();
      map.getCanvas().style.cursor = "";
    };
  }, [map, isLoaded, enabled, basemap, finalize]);

  // 创建图层
  useEffect(() => {
    if (!map || !isLoaded) return;

    if (!map.getSource(LAYER_IDS.measureLineSource)) {
      map.addSource(LAYER_IDS.measureLineSource, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] } as never
      });
    }
    if (!map.getSource(LAYER_IDS.measurePointSource)) {
      map.addSource(LAYER_IDS.measurePointSource, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] } as never
      });
    }

    const beforeId = map.getLayer(LAYER_IDS.networkChargingLayer)
      ? LAYER_IDS.networkChargingLayer
      : undefined;

    if (!map.getLayer(LAYER_IDS.measureLineLayer)) {
      map.addLayer(
        {
          id: LAYER_IDS.measureLineLayer,
          type: "line",
          source: LAYER_IDS.measureLineSource,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#f97316",
            "line-width": 2,
            "line-dasharray": [1.6, 1.2]
          }
        },
        beforeId
      );
    }

    if (!map.getLayer(LAYER_IDS.measurePointLayer)) {
      map.addLayer(
        {
          id: LAYER_IDS.measurePointLayer,
          type: "circle",
          source: LAYER_IDS.measurePointSource,
          paint: {
            "circle-radius": 4,
            "circle-color": "#fff7ed",
            "circle-stroke-color": "#f97316",
            "circle-stroke-width": 2
          }
        },
        beforeId
      );
    }

    return () => {
      try {
        if (map.getLayer(LAYER_IDS.measureLineLayer)) {
          map.removeLayer(LAYER_IDS.measureLineLayer);
        }
        if (map.getLayer(LAYER_IDS.measurePointLayer)) {
          map.removeLayer(LAYER_IDS.measurePointLayer);
        }
        if (map.getSource(LAYER_IDS.measureLineSource)) {
          map.removeSource(LAYER_IDS.measureLineSource);
        }
        if (map.getSource(LAYER_IDS.measurePointSource)) {
          map.removeSource(LAYER_IDS.measurePointSource);
        }
      } catch {
        // style may already be gone
      }
    };
  }, [map, isLoaded, styleEpoch]);

  // 更新数据
  useEffect(() => {
    if (!map || !isLoaded) return;

    const allSegments = active.length >= 2 ? [...segments, active] : segments;
    const lineFeatures = allSegments.map((points, index) => ({
      type: "Feature",
      properties: { id: index },
      geometry: {
        type: "LineString",
        coordinates: points.map((point) => {
          const display = toDisplay(point.lng, point.lat, basemap);
          return [display.lng, display.lat];
        })
      }
    }));

    const allPoints = [...segments.flat(), ...active];
    const pointFeatures = allPoints.map((point, index) => {
      const display = toDisplay(point.lng, point.lat, basemap);
      return {
        type: "Feature",
        properties: { id: index },
        geometry: { type: "Point", coordinates: [display.lng, display.lat] }
      };
    });

    const lineSource = map.getSource(LAYER_IDS.measureLineSource);
    if (lineSource && "setData" in lineSource) {
      (lineSource as unknown as { setData: (data: unknown) => void }).setData({
        type: "FeatureCollection",
        features: lineFeatures
      });
    }
    const pointSource = map.getSource(LAYER_IDS.measurePointSource);
    if (pointSource && "setData" in pointSource) {
      (pointSource as unknown as { setData: (data: unknown) => void }).setData({
        type: "FeatureCollection",
        features: pointFeatures
      });
    }
  }, [map, isLoaded, styleEpoch, segments, active, basemap]);

  if (!enabled) return null;

  const allSegments = active.length >= 2 ? [...segments, active] : segments;
  const totalKm = allSegments.reduce((sum, points) => sum + segmentLength(points), 0);

  const labels = [
    ...segments.flatMap((points, segmentIndex) =>
      cumulativePoints(points).map(({ point, total }, index) => ({
        key: `s-${segmentIndex}-${index}-${point.lng}-${point.lat}`,
        point,
        total
      }))
    ),
    ...cumulativePoints(active).map(({ point, total }, index) => ({
      key: `a-${index}-${point.lng}-${point.lat}`,
      point,
      total
    }))
  ];

  return (
    <>
      {labels.map(({ key, point, total }) => {
        const display = toDisplay(point.lng, point.lat, basemap);
        return (
          <MapMarker key={key} longitude={display.lng} latitude={display.lat}>
            <MarkerContent className="pointer-events-none">
              <div className="measure-label">{formatDistance(total)}</div>
            </MarkerContent>
          </MapMarker>
        );
      })}

      <div className="pointer-events-none absolute bottom-28 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-orange-500/40 bg-slate-950/90 px-3 py-2 text-center text-xs text-orange-200 shadow-xl backdrop-blur">
        <div className="text-[13px] font-semibold text-orange-300">
          总距离 {formatDistance(totalKm)}
        </div>
        <div className="mt-0.5 text-slate-400">
          单击添加节点 · 双击或右键结束本段
        </div>
      </div>
    </>
  );
}
