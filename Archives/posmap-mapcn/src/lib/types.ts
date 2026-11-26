export type NumericRange = [number, number];

export type BasemapMode = "amap" | "carto";

export type ToolMode = "none" | "measure" | "range";

export interface AreaItem {
  areaId: string;
  areaName: string;
  areaLevel?: number;
  parentId?: string;
  parentName?: string;
  lat?: string;
  lng?: string;
  children?: AreaItem[] | null;
}

export interface PoiItem {
  poiName: string;
  pointCount: number;
  vehicleCount: number;
  avgStayDuration: number;
  longitude: number;
  latitude: number;
  districtName?: string;
  address?: string;
  poiType?: string;
  carPowers?: string[];
}

export interface DashboardFilters {
  provinceId: string;
  province: string;
  cityId: string;
  city: string;
  districtId: string;
  district: string;
  startTime: string;
  endTime: string;
  carPowers: string[];
}

export interface BootstrapData {
  provinces: AreaItem[];
  areaTree: AreaItem[];
  defaultFilters: DashboardFilters;
}

export interface StoreItem {
  storeId: string;
  storeCode: string;
  storeName: string;
  fullName: string;
  storeManageStatusCode: string;
  storeManageStatus: string;
  provinceId: string;
  province: string;
  cityId: string;
  city: string;
  gcj02Longitude: string;
  gcj02Latitude: string;
  rentalArea: string;
  markerStyles: string;
  dmsStoreType: string;
}

export interface ChargingStationItem {
  staId: string;
  staNm: string;
  provinceId: string;
  provinceNm: string;
  cityId: string;
  cityNm: string;
  areaId: string;
  address: string;
  lng: number;
  lat: number;
  attributeCd: number;
  attributeCdDesc: string;
  staScore: number;
}

export type StoreCategory = "full" | "space";
export type ChargingCategory = "store_super" | "store_fast" | "city";

export interface RangeCircle {
  id: string;
  center: { lat: number; lng: number };
  radiusKm: number;
}

export function buildPoiKey(item: PoiItem): string {
  return `${item.poiName}|${item.longitude}|${item.latitude}`;
}
