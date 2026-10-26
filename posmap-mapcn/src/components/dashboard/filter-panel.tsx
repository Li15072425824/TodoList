"use client";

import type { ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Ruler,
  CircleDot,
  Store,
  Zap,
  RotateCcw,
  Search,
  X
} from "lucide-react";

import {
  CHARGING_CATEGORIES,
  CHARGING_LAYER_COLOR,
  STORE_CATEGORIES,
  STORE_LAYER_COLOR
} from "@/lib/constants";
import { validateDateRange } from "@/lib/date-utils";
import type {
  AreaItem,
  ChargingCategory,
  DashboardFilters,
  NumericRange,
  PoiItem,
  StoreCategory,
  ToolMode
} from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PoiAutocomplete } from "@/components/dashboard/poi-autocomplete";
import { cn } from "@/lib/utils";

type FilterPanelProps = {
  filters: DashboardFilters;
  provinces: AreaItem[];
  cities: AreaItem[];
  districts: AreaItem[];
  vehicleTypes: string[];
  loading: boolean;
  resultCount: number;
  poiItems: PoiItem[];
  selectedPoiKey: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onFieldChange: (field: keyof DashboardFilters, value: string) => void;
  onProvinceChange: (provinceId: string) => void;
  onCityChange: (cityId: string) => void;
  onToggleCarPower: (carPowers: string[]) => void;
  onSearch: () => void;
  onReset: () => void;
  onPoiKeywordChange: (poiKey: string) => void;
  durationBounds: NumericRange;
  vehicleCountBounds: NumericRange;
  heatRangeBounds: NumericRange;
  durationRange: NumericRange;
  vehicleCountRange: NumericRange;
  heatRange: NumericRange;
  onDurationRangeChange: (range: number[]) => void;
  onVehicleCountRangeChange: (range: number[]) => void;
  onHeatRangeChange: (range: number[]) => void;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
  toolMode: ToolMode;
  onToggleMeasure: () => void;
  onToggleRange: () => void;
  rangeRadiusKm: number;
  onRangeRadiusChange: (radiusKm: number) => void;
  storeCategories: StoreCategory[];
  onStoreCategoriesChange: (categories: StoreCategory[]) => void;
  chargingCategories: ChargingCategory[];
  onChargingCategoriesChange: (categories: ChargingCategory[]) => void;
  networkLoading: boolean;
};

function Section({
  title,
  hint,
  children
}: {
  title: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 border-b border-slate-800/70 px-4 py-4 last:border-0">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-slate-100">{title}</h2>
        {hint ? <span className="text-[10px] text-slate-500">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  hint
}: {
  label: string;
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-medium text-slate-400">{label}</label>
      {children}
      {hint ? <div className="text-[10px] leading-relaxed text-slate-500">{hint}</div> : null}
    </div>
  );
}

function ChipRow<T extends string>({
  icon,
  label,
  color,
  chips,
  activeValues,
  onToggle
}: {
  icon: ReactNode;
  label: string;
  color: string;
  chips: { value: T; label: string; color: string }[];
  activeValues: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div
      className="space-y-2 rounded-xl border border-slate-800/70 p-3"
      style={{ background: `${color}12` }}
    >
      <div className="flex items-center gap-2 text-[12px] font-medium text-slate-100">
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip) => {
          const active = activeValues.includes(chip.value);
          return (
            <button
              key={chip.value}
              type="button"
              className="range-chip rounded-full px-2.5 py-1 text-[11px]"
              data-active={active}
              style={{ "--chip-color": chip.color } as React.CSSProperties}
              onClick={() => onToggle(chip.value)}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ThresholdSlider({
  label,
  min,
  max,
  step,
  value,
  unit,
  disabled,
  onChange
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: NumericRange;
  unit: string;
  disabled: boolean;
  onChange: (value: number[]) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-end justify-between">
        <span className="text-[11px] font-medium text-slate-400">{label}</span>
        <span className="text-[10px] text-slate-500">
          {step < 1 ? value[0].toFixed(1) : value[0]} ~{" "}
          {step < 1 ? value[1].toFixed(1) : value[1]} {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onValueChange={onChange}
      />
    </div>
  );
}

export default function FilterPanel({
  filters,
  provinces,
  cities,
  districts,
  vehicleTypes,
  loading,
  resultCount,
  poiItems,
  selectedPoiKey,
  collapsed,
  onToggleCollapse,
  onFieldChange,
  onProvinceChange,
  onCityChange,
  onToggleCarPower,
  onSearch,
  onReset,
  onPoiKeywordChange,
  durationBounds,
  vehicleCountBounds,
  heatRangeBounds,
  durationRange,
  vehicleCountRange,
  heatRange,
  onDurationRangeChange,
  onVehicleCountRangeChange,
  onHeatRangeChange,
  onInteractionStart,
  onInteractionEnd,
  toolMode,
  onToggleMeasure,
  onToggleRange,
  rangeRadiusKm,
  onRangeRadiusChange,
  storeCategories,
  onStoreCategoriesChange,
  chargingCategories,
  onChargingCategoriesChange,
  networkLoading
}: FilterPanelProps) {
  const cityOptions = cities.filter((city) => city.parentId === filters.provinceId);
  const districtOptions = districts.filter(
    (district) => district.parentId === filters.cityId
  );
  const dateError = validateDateRange(filters.startTime, filters.endTime);

  return (
    <aside
      className={cn(
        "panel-surface absolute bottom-3 top-3 z-40 flex flex-col overflow-hidden rounded-2xl transition-[width] duration-200",
        collapsed ? "left-3 w-14" : "left-3 w-[380px]"
      )}
      aria-label="筛选与热点控制面板"
      onWheelCapture={(event) => event.stopPropagation()}
      onMouseEnter={onInteractionStart}
      onMouseLeave={onInteractionEnd}
    >
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/70 px-4 py-4">
        {!collapsed ? (
          <div>
            <h1 className="text-[15px] font-semibold text-white">停留数据可视化</h1>
            <p className="mt-0.5 text-[10px] text-slate-500">
              GCJ-02 坐标 · MapLibre GL · mapcn
            </p>
          </div>
        ) : null}
        <button
          type="button"
          aria-label={collapsed ? "展开面板" : "收起面板"}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {collapsed ? (
        <div className="flex flex-1 flex-col items-center gap-3 py-4">
          <button
            type="button"
            className="[writing-mode:vertical-rl] text-[11px] tracking-widest text-slate-500"
            onClick={onToggleCollapse}
          >
            筛选与热点
          </button>
        </div>
      ) : (
        <div className="panel-scroll flex-1 overflow-y-auto">
          <Section title="工具" hint="互斥">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition",
                  toolMode === "measure"
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-700 bg-slate-900/40 text-slate-300 hover:bg-slate-800"
                )}
                onClick={onToggleMeasure}
              >
                <Ruler className="size-3.5" />
                {toolMode === "measure" ? "关闭测距" : "测距"}
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition",
                  toolMode === "range"
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-700 bg-slate-900/40 text-slate-300 hover:bg-slate-800"
                )}
                onClick={onToggleRange}
              >
                <CircleDot className="size-3.5" />
                {toolMode === "range" ? "关闭圈选" : "圈选"}
              </button>
            </div>
            {toolMode === "range" ? (
              <Input
                type="number"
                min={0.1}
                step={0.1}
                value={rangeRadiusKm}
                onChange={(event) => onRangeRadiusChange(Number(event.target.value))}
                aria-label="圈选半径（公里）"
                className="h-9 bg-input/20 text-sm"
                placeholder="半径（km）"
              />
            ) : null}
            {toolMode === "measure" ? (
              <p className="text-[10px] leading-relaxed text-slate-500">
                单击地图添加节点，双击或右键结束本段。
              </p>
            ) : null}
            {toolMode === "range" ? (
              <p className="text-[10px] leading-relaxed text-slate-500">
                左键新增圈选，右键点击已有圈选删除。
              </p>
            ) : null}
          </Section>

          <Section title="网络图层" hint={networkLoading ? "加载中..." : "可叠加显示"}>
            <div className="space-y-2">
              <ChipRow
                icon={<Store className="size-3.5" />}
                label="门店网络"
                color={STORE_LAYER_COLOR}
                chips={STORE_CATEGORIES}
                activeValues={storeCategories}
                onToggle={(value) => {
                  const next = storeCategories.includes(value)
                    ? storeCategories.filter((item) => item !== value)
                    : [...storeCategories, value];
                  onStoreCategoriesChange(next);
                }}
              />
              <ChipRow
                icon={<Zap className="size-3.5" />}
                label="超快充网络"
                color={CHARGING_LAYER_COLOR}
                chips={CHARGING_CATEGORIES}
                activeValues={chargingCategories}
                onToggle={(value) => {
                  const next = chargingCategories.includes(value)
                    ? chargingCategories.filter((item) => item !== value)
                    : [...chargingCategories, value];
                  onChargingCategoriesChange(next);
                }}
              />
            </div>
          </Section>

          <Section title="多维筛选" hint={`${resultCount} 个 POI`}>
            <Field label="停留结束时间" hint={dateError || "最长支持 31 天，按停留结束时间筛选。"}>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={filters.startTime}
                  disabled={loading}
                  className="h-9 bg-input/20 text-xs"
                  onChange={(event) => onFieldChange("startTime", event.target.value)}
                />
                <Input
                  type="date"
                  value={filters.endTime}
                  disabled={loading}
                  className="h-9 bg-input/20 text-xs"
                  onChange={(event) => onFieldChange("endTime", event.target.value)}
                />
              </div>
            </Field>

            <Field label="省 / 市 / 区">
              <div className="grid gap-2">
                <Select
                  value={filters.provinceId}
                  disabled={loading}
                  onChange={(event) => onProvinceChange(event.target.value)}
                >
                  <option value="">选择省份</option>
                  {provinces.map((province) => (
                    <option key={province.areaId} value={province.areaId}>
                      {province.areaName}
                    </option>
                  ))}
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={filters.cityId}
                    disabled={loading || !filters.provinceId}
                    onChange={(event) => onCityChange(event.target.value)}
                  >
                    <option value="">选择城市</option>
                    {cityOptions.map((city) => (
                      <option key={city.areaId} value={city.areaId}>
                        {city.areaName}
                      </option>
                    ))}
                  </Select>
                  <Select
                    value={filters.districtId}
                    disabled={loading || !filters.cityId}
                    onChange={(event) =>
                      onFieldChange("districtId", event.target.value)
                    }
                  >
                    <option value="">全部区县</option>
                    {districtOptions.map((district) => (
                      <option key={district.areaId} value={district.areaId}>
                        {district.areaName}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </Field>

            <Field label="车辆动力类型">
              <div className="flex flex-wrap gap-1.5">
                {vehicleTypes.map((type) => {
                  const active = filters.carPowers.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      className="range-chip rounded-full px-2.5 py-1 text-[11px]"
                      data-active={active}
                      style={{ "--chip-color": "#0ea5e9" } as React.CSSProperties}
                      onClick={() =>
                        onToggleCarPower(
                          active
                            ? filters.carPowers.filter((item) => item !== type)
                            : [...filters.carPowers, type]
                        )
                      }
                    >
                      {type}
                    </button>
                  );
                })}
                {filters.carPowers.length > 0 ? (
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-slate-400 hover:bg-slate-800 hover:text-white"
                    onClick={() => onToggleCarPower([])}
                  >
                    <X className="size-3" />
                    清空
                  </button>
                ) : null}
              </div>
            </Field>

            <Field label="当前结果内检索 POI">
              <PoiAutocomplete
                items={poiItems}
                selectedPoiKey={selectedPoiKey}
                onSelect={onPoiKeywordChange}
                disabled={loading}
              />
            </Field>

            <div className="grid grid-cols-[1fr_auto] gap-2 pt-1">
              <button
                type="button"
                disabled={loading}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-400 disabled:opacity-50"
                onClick={onSearch}
              >
                <Search className="size-3.5" />
                {loading ? "查询中..." : "定位并筛选"}
              </button>
              <button
                type="button"
                disabled={loading}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                onClick={onReset}
              >
                <RotateCcw className="size-3.5" />
                重置
              </button>
            </div>
          </Section>

          <Section title="热点阈值" hint="动态区间过滤">
            <ThresholdSlider
              label="平均停留时长"
              min={durationBounds[0]}
              max={durationBounds[1]}
              step={0.1}
              value={durationRange}
              unit="小时"
              disabled={loading || durationBounds[0] === durationBounds[1]}
              onChange={onDurationRangeChange}
            />
            <ThresholdSlider
              label="车辆数筛选"
              min={vehicleCountBounds[0]}
              max={vehicleCountBounds[1]}
              step={1}
              value={vehicleCountRange}
              unit="辆"
              disabled={loading || vehicleCountBounds[0] === vehicleCountBounds[1]}
              onChange={onVehicleCountRangeChange}
            />
            <ThresholdSlider
              label="热力地图调节"
              min={heatRangeBounds[0]}
              max={heatRangeBounds[1]}
              step={1}
              value={heatRange}
              unit=""
              disabled={loading || heatRangeBounds[0] === heatRangeBounds[1]}
              onChange={onHeatRangeChange}
            />
            <p className="text-[10px] leading-relaxed text-slate-500">
              停留时长 / 车辆数影响地图与汇总；热力区间只影响热力图配色。
            </p>
          </Section>
        </div>
      )}
    </aside>
  );
}
