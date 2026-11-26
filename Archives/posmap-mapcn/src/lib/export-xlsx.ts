import type { PoiItem } from "@/lib/types";

function localDate(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export async function exportItemsToXlsx(items: PoiItem[], city: string): Promise<void> {
  const XLSX = await import("xlsx");
  const utils = (XLSX as unknown as { utils?: typeof XLSX.utils }).utils ?? XLSX.default.utils;

  const rows = items.map((item) => ({
    POI名称: item.poiName,
    区县: item.districtName || "-",
    停留次数: item.pointCount,
    车辆数: item.vehicleCount,
    平均时长_h: item.avgStayDuration,
    总时长_h: Number((Number(item.avgStayDuration || 0) * Number(item.pointCount || 0)).toFixed(2)),
    经度: item.longitude,
    纬度: item.latitude,
    地址: item.address || "-"
  }));

  const worksheet = utils.json_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "汇总数据");
  XLSX.writeFile(workbook, `${city || "汇总数据"}_${localDate()}.xlsx`);
}
