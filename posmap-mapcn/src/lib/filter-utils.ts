import type { NumericRange, PoiItem } from "@/lib/types";

export function normalizeNumericRange(range: number[], bounds: NumericRange): NumericRange {
  const minBound = Number(bounds?.[0] ?? 0);
  const maxBound = Number(bounds?.[1] ?? minBound);
  const fallback: NumericRange = [minBound, maxBound];

  if (!Array.isArray(range) || range.length !== 2) {
    return fallback;
  }

  const rawMin = Number(range[0]);
  const rawMax = Number(range[1]);
  const safeMin = Number.isFinite(rawMin) ? rawMin : minBound;
  const safeMax = Number.isFinite(rawMax) ? rawMax : maxBound;
  const orderedMin = Math.min(safeMin, safeMax);
  const orderedMax = Math.max(safeMin, safeMax);

  return [
    Math.min(Math.max(orderedMin, minBound), maxBound),
    Math.min(Math.max(orderedMax, minBound), maxBound)
  ];
}

export function buildMetricBounds(items: PoiItem[]): {
  durationBounds: NumericRange;
  vehicleCountBounds: NumericRange;
} {
  if (!Array.isArray(items) || items.length === 0) {
    return { durationBounds: [0, 0], vehicleCountBounds: [0, 0] };
  }

  const durations = items
    .map((item) => Number(item.avgStayDuration))
    .filter((value) => Number.isFinite(value));
  const counts = items
    .map((item) => Number(item.vehicleCount))
    .filter((value) => Number.isFinite(value));

  return {
    durationBounds: [
      durations.length ? Math.min(...durations) : 0,
      durations.length ? Math.max(...durations) : 0
    ],
    vehicleCountBounds: [
      counts.length ? Math.min(...counts) : 0,
      counts.length ? Math.max(...counts) : 0
    ]
  };
}

export function filterHotspots(
  items: PoiItem[],
  durationRange: NumericRange,
  vehicleCountRange: NumericRange,
  district: string
): PoiItem[] {
  return items.filter((item) => {
    const duration = Number(item.avgStayDuration || 0);
    const count = Number(item.vehicleCount || 0);
    if (duration < durationRange[0] || duration > durationRange[1]) return false;
    if (count < vehicleCountRange[0] || count > vehicleCountRange[1]) return false;
    if (district && item.districtName !== district) return false;
    return true;
  });
}
