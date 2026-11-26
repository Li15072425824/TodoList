import type { PoiItem } from "@/lib/types";

/**
 * 多动力类型并发请求后的合并：
 * - 以 poiName + 经纬度去重
 * - 停留次数 / 车辆数累加
 * - 平均停留时长按 pointCount 加权
 * - 保留各条结果命中的动力类型
 */
export function mergePoiResults(results: PoiItem[][]): PoiItem[] {
  const merged = new Map<
    string,
    {
      poiName: string;
      pointCount: number;
      vehicleCount: number;
      weightedDuration: number;
      longitude: number;
      latitude: number;
      districtName: string;
      address: string;
      poiType: string;
      carPowers: Set<string>;
    }
  >();

  results.flat().forEach((item) => {
    const key = `${item.poiName}|${item.longitude}|${item.latitude}`;
    const existing = merged.get(key) || {
      poiName: item.poiName,
      pointCount: 0,
      vehicleCount: 0,
      weightedDuration: 0,
      longitude: Number(item.longitude),
      latitude: Number(item.latitude),
      districtName: item.districtName || "",
      address: item.address || "",
      poiType: item.poiType || "",
      carPowers: new Set<string>()
    };

    existing.pointCount += Number(item.pointCount || 0);
    existing.vehicleCount += Number(item.vehicleCount || 0);
    existing.weightedDuration += Number(item.avgStayDuration || 0) * Number(item.pointCount || 0);
    if (Array.isArray(item.carPowers)) {
      item.carPowers.forEach((power) => existing.carPowers.add(power));
    }
    merged.set(key, existing);
  });

  return [...merged.values()]
    .map((item) => ({
      poiName: item.poiName,
      pointCount: item.pointCount,
      vehicleCount: item.vehicleCount,
      avgStayDuration: Number((item.weightedDuration / Math.max(item.pointCount, 1)).toFixed(2)),
      longitude: Number(item.longitude),
      latitude: Number(item.latitude),
      districtName: item.districtName,
      address: item.address,
      poiType: item.poiType,
      carPowers: [...item.carPowers]
    }))
    .sort(
      (left, right) =>
        right.pointCount - left.pointCount ||
        right.vehicleCount - left.vehicleCount ||
        left.poiName.localeCompare(right.poiName, "zh-CN")
    );
}
