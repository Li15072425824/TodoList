"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FolderOpen
} from "lucide-react";

import {
  RIGHT_PANEL_DEFAULT_WIDTH,
  RIGHT_PANEL_MIN_WIDTH
} from "@/lib/constants";
import { exportItemsToXlsx } from "@/lib/export-xlsx";
import type { PoiItem } from "@/lib/types";
import { buildPoiKey } from "@/lib/types";
import { useResizablePanel } from "@/hooks/use-resizable-panel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SortKey = "poiName" | "pointCount" | "vehicleCount" | "avgStayDuration" | "totalDuration";
type SortDirection = "asc" | "desc";

type DataPanelProps = {
  items: PoiItem[];
  loading: boolean;
  selectedCity: string;
  selectedPoiKey: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectPoi: (poiKey: string) => void;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
};

type GroupRow = {
  district: string;
  pointCount: number;
  vehicleCount: number;
  avgStayDuration: number;
  totalDuration: number;
  children: PoiItem[];
};

const numberFormatter = new Intl.NumberFormat("zh-CN");

function formatNumber(value: number): string {
  return numberFormatter.format(Number(value || 0));
}

function formatDuration(value: number): string {
  return `${Number(value || 0).toFixed(1)}h`;
}

const COLUMNS: Array<{
  key: SortKey;
  label: string;
  width: string;
  align: "left" | "right" | "center";
}> = [
  { key: "poiName", label: "区域 / POI", width: "auto", align: "left" },
  { key: "pointCount", label: "停留次数", width: "72px", align: "right" },
  { key: "vehicleCount", label: "车辆数", width: "64px", align: "right" },
  { key: "avgStayDuration", label: "平均", width: "64px", align: "right" },
  { key: "totalDuration", label: "总时长", width: "68px", align: "right" }
];

function sortValue(row: GroupRow | PoiItem, key: SortKey): number | string {
  switch (key) {
    case "poiName":
      return (row as PoiItem).poiName || (row as GroupRow).district || "";
    case "totalDuration":
      return Number(row.avgStayDuration || 0) * Number(row.pointCount || 0);
    default:
      return Number(row[key] || 0);
  }
}

function compareRows(a: GroupRow | PoiItem, b: GroupRow | PoiItem, key: SortKey, direction: SortDirection) {
  const left = sortValue(a, key);
  const right = sortValue(b, key);
  const result =
    typeof left === "string" && typeof right === "string"
      ? left.localeCompare(right, "zh-CN")
      : Number(left) - Number(right);
  return direction === "asc" ? result : -result;
}

export default function DataPanel({
  items,
  loading,
  selectedCity,
  selectedPoiKey,
  collapsed,
  onToggleCollapse,
  onSelectPoi,
  onInteractionStart,
  onInteractionEnd
}: DataPanelProps) {
  const { width, startResize } = useResizablePanel({
    defaultWidth: RIGHT_PANEL_DEFAULT_WIDTH,
    minWidth: RIGHT_PANEL_MIN_WIDTH
  });
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: "pointCount",
    direction: "desc"
  });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const groups = useMemo<GroupRow[]>(() => {
    const byDistrict = new Map<string, PoiItem[]>();
    items.forEach((item) => {
      const district = item.districtName || "未知区县";
      const bucket = byDistrict.get(district);
      if (bucket) bucket.push(item);
      else byDistrict.set(district, [item]);
    });

    return Array.from(byDistrict.entries()).map(([district, children]) => {
      const totals = children.reduce(
        (acc, item) => {
          const pointCount = Number(item.pointCount || 0);
          acc.pointCount += pointCount;
          acc.vehicleCount += Number(item.vehicleCount || 0);
          acc.totalDuration += Number(item.avgStayDuration || 0) * pointCount;
          return acc;
        },
        { pointCount: 0, vehicleCount: 0, totalDuration: 0 }
      );

      return {
        district,
        pointCount: totals.pointCount,
        vehicleCount: totals.vehicleCount,
        totalDuration: totals.totalDuration,
        avgStayDuration:
          totals.pointCount > 0 ? totals.totalDuration / totals.pointCount : 0,
        children
      };
    });
  }, [items]);

  const sortedGroups = useMemo(() => {
    const list = [...groups].sort((a, b) =>
      compareRows(a, b, sort.key === "poiName" ? "poiName" : sort.key, sort.direction)
    );
    if (sort.key === "poiName") return list;
    return list.map((group) => ({
      ...group,
      children: [...group.children].sort((a, b) =>
        compareRows(a, b, sort.key, sort.direction)
      )
    }));
  }, [groups, sort]);

  const summary = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc.pointCount += Number(item.pointCount || 0);
          acc.vehicleCount += Number(item.vehicleCount || 0);
          return acc;
        },
        { pointCount: 0, vehicleCount: 0 }
      ),
    [items]
  );

  const toggleSort = (key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "poiName" ? "asc" : "desc" }
    );
  };

  const toggleGroup = (district: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(district)) next.delete(district);
      else next.add(district);
      return next;
    });
  };

  const allExpanded = groups.length > 0 && expanded.size >= groups.length;

  const toggleExpandAll = () => {
    setExpanded(allExpanded ? new Set() : new Set(groups.map((group) => group.district)));
  };

  const handleExport = () => {
    if (items.length === 0) return;
    void exportItemsToXlsx(items, selectedCity);
  };

  const renderSortIcon = (key: SortKey) => {
    if (sort.key !== key) {
      return <ArrowUpDown className="size-3 text-slate-600" />;
    }
    return sort.direction === "asc" ? (
      <ArrowUp className="size-3 text-orange-400" />
    ) : (
      <ArrowDown className="size-3 text-orange-400" />
    );
  };

  return (
    <aside
      className={cn(
        "panel-surface absolute bottom-3 right-3 top-3 z-40 flex flex-col overflow-hidden rounded-2xl",
        collapsed ? "w-14" : ""
      )}
      style={collapsed ? undefined : { width }}
      aria-label="城市汇总数据面板"
      onWheelCapture={(event) => event.stopPropagation()}
      onMouseEnter={onInteractionStart}
      onMouseLeave={onInteractionEnd}
    >
      {!collapsed ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="拖拽调整面板宽度"
          className="group absolute inset-y-0 left-0 z-10 w-1.5 cursor-col-resize hover:bg-orange-500/60"
          onPointerDown={startResize}
        >
          <div className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-full bg-slate-600/60 transition group-hover:bg-orange-400" />
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-2 border-b border-slate-800/70 px-4 py-4">
        {!collapsed ? (
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold text-white">
              {selectedCity ? `${selectedCity} 汇总数据` : "汇总数据"}
            </h2>
            <p className="mt-0.5 truncate text-[10px] text-slate-500">
              {loading
                ? "正在刷新当前筛选结果..."
                : `共 ${formatNumber(items.length)} 个 POI，${formatNumber(summary.vehicleCount)} 辆车`}
            </p>
          </div>
        ) : null}
        <div className="flex shrink-0 items-center gap-1">
          {!collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="导出 Excel"
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-40"
                  disabled={items.length === 0}
                  onClick={handleExport}
                >
                  <Download className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>导出当前结果 Excel</TooltipContent>
            </Tooltip>
          ) : null}
          <button
            type="button"
            aria-label={collapsed ? "展开面板" : "收起面板"}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            onClick={onToggleCollapse}
          >
            {collapsed ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
          </button>
        </div>
      </div>

      {collapsed ? (
        <div className="flex flex-1 flex-col items-center gap-3 py-4">
          <button
            type="button"
            className="[writing-mode:vertical-rl] text-[11px] tracking-widest text-slate-500"
            onClick={onToggleCollapse}
          >
            汇总数据
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-800/70 px-4 py-2 text-[10px] text-slate-500">
            <span>
              停留次数 <b className="font-semibold text-slate-200">{formatNumber(summary.pointCount)}</b>
            </span>
            <span>
              区县 <b className="font-semibold text-slate-200">{groups.length}</b>
            </span>
            <button
              type="button"
              className="ml-auto flex items-center gap-1 rounded px-1.5 py-0.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              onClick={toggleExpandAll}
            >
              <FolderOpen className="size-3" />
              {allExpanded ? "全部收起" : "全部展开"}
            </button>
          </div>

          <div className="panel-scroll min-h-0 flex-1 overflow-auto">
            {items.length === 0 ? (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="text-xs text-slate-400">
                  {loading ? "正在查询..." : "当前筛选条件下暂无 POI 数据"}
                </p>
                <p className="text-[10px] leading-relaxed text-slate-600">
                  可尝试调整日期范围（例如 2026-01-01 ~ 2026-01-31）或其他筛选条件后重新查询。
                </p>
              </div>
            ) : (
              <table className="w-full table-fixed border-collapse text-[11px]">
                <colgroup>
                  {COLUMNS.map((column) => (
                    <col key={column.key} style={{ width: column.width }} />
                  ))}
                </colgroup>
                <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur">
                  <tr className="text-[10px] text-slate-500">
                    {COLUMNS.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className={cn(
                          "border-b border-slate-800/80 px-2 py-2 font-medium",
                          column.align === "right" && "text-right",
                          column.align === "center" && "text-center",
                          column.key === "poiName" && "pl-3 text-left"
                        )}
                      >
                        <button
                          type="button"
                          className={cn(
                            "inline-flex items-center gap-1 transition hover:text-slate-200",
                            column.align === "right" && "flex-row-reverse"
                          )}
                          onClick={() => toggleSort(column.key)}
                        >
                          {column.label}
                          {renderSortIcon(column.key)}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedGroups.map((group) => {
                    const isOpen = expanded.has(group.district);
                    return (
                      <GroupRows
                        key={group.district}
                        group={group}
                        isOpen={isOpen}
                        selectedPoiKey={selectedPoiKey}
                        onToggle={() => toggleGroup(group.district)}
                        onSelectPoi={onSelectPoi}
                      />
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

function GroupRows({
  group,
  isOpen,
  selectedPoiKey,
  onToggle,
  onSelectPoi
}: {
  group: GroupRow;
  isOpen: boolean;
  selectedPoiKey: string;
  onToggle: () => void;
  onSelectPoi: (poiKey: string) => void;
}) {
  return (
    <>
      <tr
        className="group cursor-pointer border-b border-slate-800/60 bg-slate-900/60 transition hover:bg-slate-800/70"
        onClick={onToggle}
      >
        <td className="px-2 py-2 pl-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <ChevronDown
              className={cn(
                "size-3 shrink-0 text-slate-500 transition-transform",
                !isOpen && "-rotate-90"
              )}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate font-medium text-slate-100">{group.district}</span>
              </TooltipTrigger>
              <TooltipContent>{group.district}</TooltipContent>
            </Tooltip>
            <span className="shrink-0 rounded-full bg-slate-800 px-1.5 text-[9px] text-slate-400">
              {group.children.length}
            </span>
          </div>
        </td>
        <td className="px-2 py-2 text-right font-medium text-slate-200">
          {formatNumber(group.pointCount)}
        </td>
        <td className="px-2 py-2 text-right text-slate-300">
          {formatNumber(group.vehicleCount)}
        </td>
        <td className="px-2 py-2 text-right text-slate-300">
          {formatDuration(group.avgStayDuration)}
        </td>
        <td className="px-2 py-2 text-right text-slate-300">
          {formatDuration(group.totalDuration)}
        </td>
      </tr>
      {isOpen
        ? group.children.map((item) => {
            const key = buildPoiKey(item);
            const selected = key === selectedPoiKey;
            return (
              <tr
                key={key}
                className={cn(
                  "cursor-pointer border-b border-slate-800/40 transition",
                  selected ? "bg-orange-500/15" : "hover:bg-slate-800/40"
                )}
                onClick={() => onSelectPoi(key)}
              >
                <td className="px-2 py-1.5 pl-6">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={cn(
                          "block truncate",
                          selected ? "font-medium text-orange-300" : "text-slate-300"
                        )}
                      >
                        {item.poiName || "-"}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-[280px] space-y-0.5">
                        <div>{item.poiName || "-"}</div>
                        {item.address ? (
                          <div className="text-[10px] opacity-70">{item.address}</div>
                        ) : null}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="px-2 py-1.5 text-right text-slate-400">
                  {formatNumber(item.pointCount)}
                </td>
                <td className="px-2 py-1.5 text-right text-slate-400">
                  {formatNumber(item.vehicleCount)}
                </td>
                <td className="px-2 py-1.5 text-right text-slate-400">
                  {formatDuration(item.avgStayDuration)}
                </td>
                <td className="px-2 py-1.5 text-right text-slate-400">
                  {formatDuration(Number(item.avgStayDuration || 0) * Number(item.pointCount || 0))}
                </td>
              </tr>
            );
          })
        : null}
    </>
  );
}
