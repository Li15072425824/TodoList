"use client";

import { useEffect } from "react";

import { ensureMapImages, MAP_IMAGE_IDS } from "@/lib/map-icons";
import { toDisplay } from "@/lib/coord-transform";
import type { BasemapMode, ChargingStationItem, StoreItem } from "@/lib/types";
import { useMap } from "@/registry/map";
import { LAYER_IDS } from "@/components/map/layer-ids";

type NetworkLayerProps = {
  stores: StoreItem[];
  chargingStations: ChargingStationItem[];
  basemap: BasemapMode;
};

type FeatureCollectionLike = {
  type: "FeatureCollection";
  features: unknown[];
};

function buildStoreCollection(
  stores: StoreItem[],
  basemap: BasemapMode
): FeatureCollectionLike {
  return {
    type: "FeatureCollection",
    features: stores
      .filter((store) => {
        const lat = Number(store.gcj02Latitude);
        const lng = Number(store.gcj02Longitude);
        return (
          Number.isFinite(lat) &&
          lat >= -90 &&
          lat <= 90 &&
          Number.isFinite(lng) &&
          lng >= -180 &&
          lng <= 180
        );
      })
      .map((store) => {
        const display = toDisplay(
          Number(store.gcj02Longitude),
          Number(store.gcj02Latitude),
          basemap
        );
        const displayName = store.storeName || store.fullName || "";
        const cat = displayName.includes("全功能") ? "full" : "space";

        return {
          type: "Feature",
          properties: {
            id: store.storeId,
            cat,
            name: store.storeName || store.fullName || "岚图门店",
            address: [store.city, store.dmsStoreType, store.storeManageStatus]
              .filter(Boolean)
              .join(" / ")
          },
          geometry: {
            type: "Point",
            coordinates: [display.lng, display.lat]
          }
        };
      })
  };
}

function buildChargingCollection(
  stations: ChargingStationItem[],
  basemap: BasemapMode
): FeatureCollectionLike {
  return {
    type: "FeatureCollection",
    features: stations
      .filter((station) => {
        const lat = Number(station.lat);
        const lng = Number(station.lng);
        return (
          Number.isFinite(lat) &&
          lat >= -90 &&
          lat <= 90 &&
          Number.isFinite(lng) &&
          lng >= -180 &&
          lng <= 180
        );
      })
      .map((station) => {
        const display = toDisplay(Number(station.lng), Number(station.lat), basemap);
        const cat =
          station.attributeCdDesc === "门店超充站"
            ? "store_super"
            : station.attributeCdDesc === "门店快充站"
              ? "store_fast"
              : "city";

        return {
          type: "Feature",
          properties: {
            id: station.staId,
            cat,
            name: station.staNm || "岚图超充站",
            address: [station.cityNm, station.attributeCdDesc, station.address]
              .filter(Boolean)
              .join(" / ")
          },
          geometry: {
            type: "Point",
            coordinates: [display.lng, display.lat]
          }
        };
      })
  };
}

export function NetworkLayer({
  stores,
  chargingStations,
  basemap
}: NetworkLayerProps) {
  const { map, isLoaded, styleEpoch } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    ensureMapImages(map);

    // 充电站先加，门店后加，保证门店 pin 在最上层
    if (!map.getSource(LAYER_IDS.networkChargingSource)) {
      map.addSource(LAYER_IDS.networkChargingSource, {
        type: "geojson",
        data: buildChargingCollection(chargingStations, basemap) as never
      });
    }

    if (!map.getLayer(LAYER_IDS.networkChargingLayer)) {
      map.addLayer({
        id: LAYER_IDS.networkChargingLayer,
        type: "symbol",
        source: LAYER_IDS.networkChargingSource,
        layout: {
          "icon-image": [
            "match",
            ["get", "cat"],
            "store_super",
            MAP_IMAGE_IDS.chargeSuper,
            "store_fast",
            MAP_IMAGE_IDS.chargeFast,
            MAP_IMAGE_IDS.chargeCity
          ],
          "icon-size": ["interpolate", ["linear"], ["zoom"], 4, 0.5, 10, 0.75, 16, 0.95],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-anchor": "center"
        }
      });
    }

    if (!map.getSource(LAYER_IDS.networkStoreSource)) {
      map.addSource(LAYER_IDS.networkStoreSource, {
        type: "geojson",
        data: buildStoreCollection(stores, basemap) as never
      });
    }

    if (!map.getLayer(LAYER_IDS.networkStoreLayer)) {
      map.addLayer({
        id: LAYER_IDS.networkStoreLayer,
        type: "symbol",
        source: LAYER_IDS.networkStoreSource,
        layout: {
          "icon-image": [
            "match",
            ["get", "cat"],
            "full",
            MAP_IMAGE_IDS.storeFull,
            MAP_IMAGE_IDS.storeSpace
          ],
          "icon-size": ["interpolate", ["linear"], ["zoom"], 4, 0.65, 10, 0.85, 16, 1],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-anchor": "bottom"
        }
      });
    }

    return () => {
      try {
        if (map.getLayer(LAYER_IDS.networkStoreLayer)) {
          map.removeLayer(LAYER_IDS.networkStoreLayer);
        }
        if (map.getLayer(LAYER_IDS.networkChargingLayer)) {
          map.removeLayer(LAYER_IDS.networkChargingLayer);
        }
        if (map.getSource(LAYER_IDS.networkStoreSource)) {
          map.removeSource(LAYER_IDS.networkStoreSource);
        }
        if (map.getSource(LAYER_IDS.networkChargingSource)) {
          map.removeSource(LAYER_IDS.networkChargingSource);
        }
      } catch {
        // style may already be gone
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isLoaded, styleEpoch]);

  useEffect(() => {
    if (!map || !isLoaded) return;
    const storeSource = map.getSource(LAYER_IDS.networkStoreSource);
    const chargingSource = map.getSource(LAYER_IDS.networkChargingSource);

    if (storeSource && "setData" in storeSource) {
      (storeSource as unknown as { setData: (data: unknown) => void }).setData(
        buildStoreCollection(stores, basemap)
      );
    }
    if (chargingSource && "setData" in chargingSource) {
      (chargingSource as unknown as { setData: (data: unknown) => void }).setData(
        buildChargingCollection(chargingStations, basemap)
      );
    }
  }, [map, isLoaded, styleEpoch, stores, chargingStations, basemap]);

  return null;
}
