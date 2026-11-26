import type { ChargingCategory, NumericRange, StoreCategory } from "@/lib/types";

export const VEHICLE_TYPE_OPTIONS = ["纯电式", "插电混合式", "增程式1.5T"];

export const STORE_TYPE_LIST = [
  "全功能用户中心",
  "岚图空间",
  "岚图展厅-独立展厅",
  "岚图展厅-非独立展厅",
  "交付服务中心",
  "集中交付中心",
  "全功能用户中心-独立展厅",
  "岚图空间-独立展厅"
];

export const STORE_CATEGORIES: { value: StoreCategory; label: string; color: string }[] = [
  { value: "full", label: "全功能店", color: "#4a64ac" },
  { value: "space", label: "空间/展厅店", color: "#6AAFB6" }
];

export const CHARGING_CATEGORIES: { value: ChargingCategory; label: string; color: string }[] = [
  { value: "city", label: "城市超充站", color: "#4488FF" },
  { value: "store_super", label: "门店超充站", color: "#9966FF" },
  { value: "store_fast", label: "门店快充站", color: "#230821" }
];

export const STORE_LAYER_COLOR = "#f97316";
export const CHARGING_LAYER_COLOR = "#2563eb";

export const DEFAULT_DURATION_BOUNDS: NumericRange = [0, 24];
export const DEFAULT_VEHICLE_COUNT_BOUNDS: NumericRange = [0, 100];
export const HEAT_RANGE_BOUNDS: NumericRange = [0, 100];

export const HEAT_GRADIENT_STOPS: Array<[number, string]> = [
  [0, "rgba(255, 184, 107, 0)"],
  [0.05, "rgba(255, 150, 80, 0.5)"],
  [0.2, "#ffb86b"],
  [0.45, "#f97316"],
  [0.75, "#ec4899"],
  [1, "#db2777"]
];

export const DEFAULT_CENTER = { lat: 35.8617, lng: 104.1954 };
export const DEFAULT_ZOOM = 4.6;
export const CITY_ZOOM = 10;
export const POI_ZOOM = 13;
export const RIGHT_PANEL_DEFAULT_WIDTH = 560;
export const RIGHT_PANEL_MIN_WIDTH = 420;
