const EARTH_RADIUS_KM = 6371;

/** Haversine 距离，单位 km */
export function haversineKm(
  a: { lng: number; lat: number },
  b: { lng: number; lat: number }
): number {
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** 以 center 为圆心、radiusKm 为半径的球面多边形，返回 [lng, lat] 环 */
export function circlePolygon(
  center: { lng: number; lat: number },
  radiusKm: number,
  segments = 72
): [number, number][] {
  const distanceRatio = radiusKm / EARTH_RADIUS_KM;
  const lat1 = (center.lat * Math.PI) / 180;
  const lng1 = (center.lng * Math.PI) / 180;
  const ring: [number, number][] = [];

  for (let i = 0; i < segments; i += 1) {
    const bearing = (2 * Math.PI * i) / segments;
    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distanceRatio) +
        Math.cos(lat1) * Math.sin(distanceRatio) * Math.cos(bearing)
    );
    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distanceRatio) * Math.cos(lat1),
        Math.cos(distanceRatio) - Math.sin(lat1) * Math.sin(lat2)
      );
    ring.push([(lng2 * 180) / Math.PI, (lat2 * 180) / Math.PI]);
  }

  if (ring.length) ring.push(ring[0]);
  return ring;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(2)} km`;
}
