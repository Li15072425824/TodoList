import type { DashboardFilters } from "@/lib/types";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getCurrentMonthRange(): Pick<DashboardFilters, "startTime" | "endTime"> {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { startTime: formatDate(start), endTime: formatDate(end) };
}

export function daysBetween(startTime: string, endTime: string): number | null {
  if (!startTime || !endTime) return null;
  const start = new Date(`${startTime}T00:00:00`);
  const end = new Date(`${endTime}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

export function validateDateRange(startTime: string, endTime: string): string | null {
  if (!startTime || !endTime) return "请选择开始和结束日期";
  const span = daysBetween(startTime, endTime);
  if (span === null) return "日期格式不正确";
  if (span < 0) return "结束日期不能早于开始日期";
  if (span > 30) return "最长支持 31 天，请缩小时间范围";
  return null;
}
