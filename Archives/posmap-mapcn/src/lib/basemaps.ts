import type { StyleSpecification } from "maplibre-gl";
import type { BasemapMode } from "@/lib/types";

const AMAP_TILE_URL =
  process.env.NEXT_PUBLIC_AMAP_TILE_URL ||
  "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";

export const CARTO_DARK_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
export const CARTO_LIGHT_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

/** 高德栅格瓦片同样使用 XYZ（y 自北向南），无需 tms 翻转。 */
export const AMAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    amap: {
      type: "raster",
      tiles: [AMAP_TILE_URL],
      tileSize: 256,
      minzoom: 3,
      maxzoom: 18,
      attribution: "© 高德地图"
    }
  },
  layers: [
    {
      id: "amap-base",
      type: "raster",
      source: "amap"
    }
  ]
};

export function getBasemapStyle(mode: BasemapMode): StyleSpecification | string {
  return mode === "amap" ? AMAP_STYLE : CARTO_DARK_STYLE;
}

export function getBasemapAttribution(mode: BasemapMode): string {
  return mode === "amap" ? "© 高德地图" : "© CARTO · © OpenStreetMap contributors";
}

export function getBasemapLabel(mode: BasemapMode): string {
  return mode === "amap" ? "高德（GCJ-02）" : "CARTO（WGS84）";
}
