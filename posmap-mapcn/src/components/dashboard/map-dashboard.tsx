"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";

import { getBootstrap } from "@/lib/bootstrap";
import {
  CHARGING_CATEGORIES,
  DEFAULT_DURATION_BOUNDS,
  DEFAULT_VEHICLE_COUNT_BOUNDS,
  HEAT_RANGE_BOUNDS,
  VEHICLE_TYPE_OPTIONS
} from "@/lib/constants";
import {
  queryChargingStations,
  queryPoiTrajectory,
  queryStores
} from "@/lib/data-api";
import { validateDateRange } from "@/lib/date-utils";
import {
  buildMetricBounds,
  filterHotspots,
  normalizeNumericRange
} from "@/lib/filter-utils";
import { findAreaById, flattenAreaTree, normalizeProvinceName } from "@/lib/region-utils";
import type {
  AreaItem,
  BasemapMode,
  ChargingCategory,
  ChargingStationItem,
  DashboardFilters,
  NumericRange,
  PoiItem,
  StoreCategory,
  StoreItem,
  ToolMode
} from "@/lib/types";
import { buildPoiKey } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import DataPanel from "@/components/dashboard/data-panel";
import FilterPanel from "@/components/dashboard/filter-panel";
import DashboardMap from "@/components/map/dashboard-map";

const EMPTY_FILTERS: DashboardFilters = {
  provinceId: "",
  province: "",
  cityId: "",
  city: "",
  districtId: "",
  district: "",
  startTime: "",
  endTime: "",
  carPowers: []
};

const ALL_STORE_CATEGORIES: StoreCategory[] = ["full", "space"];
const ALL_CHARGING_CATEGORIES: ChargingCategory[] = [
  "store_super",
  "store_fast",
  "city"
];

export default function MapDashboard() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [networkLoading, setNetworkLoading] = useState(false);
  const [error, setError] = useState("");

  const [areaTree, setAreaTree] = useState<AreaItem[]>([]);
  const { provinces, cities, districts } = useMemo(
    () => flattenAreaTree(areaTree),
    [areaTree]
  );
  const citiesRef = useRef<AreaItem[]>([]);
  citiesRef.current = cities;

  const [vehicleTypes, setVehicleTypes] = useState<string[]>([
    ...VEHICLE_TYPE_OPTIONS
  ]);
  const [filters, setFilters] = useState<DashboardFilters>(EMPTY_FILTERS);

  const [items, setItems] = useState<PoiItem[]>([]);
  const [selectedPoiKey, setSelectedPoiKey] = useState("");
  const [cityCenter, setCityCenter] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
  } | null>(null);

  const [stores, setStores] = useState<StoreItem[]>([]);
  const [chargingStations, setChargingStations] = useState<ChargingStationItem[]>(
    []
  );
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([
    ...ALL_STORE_CATEGORIES
  ]);
  const [chargingCategories, setChargingCategories] = useState<ChargingCategory[]>([
    ...ALL_CHARGING_CATEGORIES
  ]);
  const [cityScope, setCityScope] = useState("");

  const [basemap, setBasemap] = useState<BasemapMode>("amap");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [panelHoverCount, setPanelHoverCount] = useState(0);

  const [durationBounds, setDurationBounds] = useState<NumericRange>(
    DEFAULT_DURATION_BOUNDS
  );
  const [vehicleCountBounds, setVehicleCountBounds] = useState<NumericRange>(
    DEFAULT_VEHICLE_COUNT_BOUNDS
  );
  const [durationRange, setDurationRange] = useState<NumericRange>(
    DEFAULT_DURATION_BOUNDS
  );
  const [vehicleCountRange, setVehicleCountRange] = useState<NumericRange>(
    DEFAULT_VEHICLE_COUNT_BOUNDS
  );
  const [heatRange, setHeatRange] = useState<NumericRange>(HEAT_RANGE_BOUNDS);
  const heatRangeDebounced = useDebouncedValue(heatRange, 300);

  const [toolMode, setToolMode] = useState<ToolMode>("none");
  const [measureClearSignal, setMeasureClearSignal] = useState(0);
  const [rangeRadiusKm, setRangeRadiusKm] = useState(3);
  const [ranges, setRanges] = useState<
    Array<{ id: string; center: { lat: number; lng: number }; radiusKm: number }>
  >([]);

  const requestSeqRef = useRef(0);

  const runSearch = useCallback(async (nextFilters: DashboardFilters) => {
    if (!nextFilters.province || !nextFilters.city) {
      setItems([]);
      setSelectedPoiKey("");
      setDurationBounds(DEFAULT_DURATION_BOUNDS);
      setVehicleCountBounds(DEFAULT_VEHICLE_COUNT_BOUNDS);
      setDurationRange(DEFAULT_DURATION_BOUNDS);
      setVehicleCountRange(DEFAULT_VEHICLE_COUNT_BOUNDS);
      setHeatRange(HEAT_RANGE_BOUNDS);
      setCityCenter(null);
      setError("请先选择省份和城市");
      return;
    }

    const dateError = validateDateRange(nextFilters.startTime, nextFilters.endTime);
    if (dateError) {
      setError(dateError);
      return;
    }

    const seq = requestSeqRef.current + 1;
    requestSeqRef.current = seq;
    setLoading(true);
    setError("");

    try {
      const nextItems = await queryPoiTrajectory({
        province: nextFilters.province,
        city: nextFilters.city,
        district: nextFilters.district,
        startTime: nextFilters.startTime,
        endTime: nextFilters.endTime,
        carPowers: nextFilters.carPowers
      });

      if (seq !== requestSeqRef.current) return;

      const nextBounds = buildMetricBounds(nextItems);
      setItems(nextItems);
      setSelectedPoiKey("");
      setDurationBounds(nextBounds.durationBounds);
      setVehicleCountBounds(nextBounds.vehicleCountBounds);
      setDurationRange(nextBounds.durationBounds);
      setVehicleCountRange(nextBounds.vehicleCountBounds);
      setHeatRange(HEAT_RANGE_BOUNDS);
      setCityScope(nextFilters.cityId || "");

      const currentCity = citiesRef.current.find(
        (city) => city.areaId === nextFilters.cityId
      );
      const cityLat = currentCity ? Number(currentCity.lat) : NaN;
      const cityLng = currentCity ? Number(currentCity.lng) : NaN;
      if (Number.isFinite(cityLat) && Number.isFinite(cityLng)) {
        setCityCenter({ lat: cityLat, lng: cityLng, zoom: 10 });
      }
    } catch (requestError: unknown) {
      if (seq !== requestSeqRef.current) return;
      console.error(requestError);
      setItems([]);
      setSelectedPoiKey("");
      setCityCenter(null);
      setError(requestError instanceof Error ? requestError.message : "查询失败");
    } finally {
      if (seq === requestSeqRef.current) setLoading(false);
    }
  }, []);

  const runNetworkSearch = useCallback(async () => {
    setNetworkLoading(true);
    try {
      const [storeResult, stationResult] = await Promise.allSettled([
        queryStores(),
        queryChargingStations()
      ]);

      const storeItems = storeResult.status === "fulfilled" ? storeResult.value : [];
      const stationItems =
        stationResult.status === "fulfilled" ? stationResult.value : [];
      setStores(storeItems);
      setChargingStations(stationItems);

      if (storeResult.status === "rejected") {
        console.warn("门店网络查询失败", storeResult.reason);
      }
      if (stationResult.status === "rejected") {
        console.warn("充电站查询失败", stationResult.reason);
      }
    } finally {
      setNetworkLoading(false);
    }
  }, []);

  const loadBootstrap = useCallback(async () => {
    setBootstrapping(true);
    setError("");
    try {
      const data = await getBootstrap();
      setAreaTree(data.areaTree);
      setVehicleTypes([...VEHICLE_TYPE_OPTIONS]);
      setFilters(data.defaultFilters);
      setCityScope(data.defaultFilters.cityId || "");
      setToolMode("none");
      setRanges([]);
      setSelectedPoiKey("");
      await runSearch(data.defaultFilters);
      void runNetworkSearch();
    } catch (bootstrapError: unknown) {
      console.error(bootstrapError);
      setError(
        bootstrapError instanceof Error ? bootstrapError.message : "初始化失败"
      );
    } finally {
      setBootstrapping(false);
    }
  }, [runSearch, runNetworkSearch]);

  useEffect(() => {
    void loadBootstrap();
  }, [loadBootstrap]);

  const hotspotItems = useMemo(
    () =>
      filterHotspots(items, durationRange, vehicleCountRange, filters.district),
    [items, durationRange, vehicleCountRange, filters.district]
  );

  const selectedPoi = useMemo(
    () => hotspotItems.find((item) => buildPoiKey(item) === selectedPoiKey) || null,
    [hotspotItems, selectedPoiKey]
  );

  const filteredStores = useMemo(() => {
    if (storeCategories.length === 0) return [];
    return stores.filter((store) => {
      if (cityScope && store.cityId !== cityScope) return false;
      const displayName = store.storeName || store.fullName || "";
      const isFull = displayName.includes("全功能");
      const matchFull = storeCategories.includes("full") && isFull;
      const matchSpace = storeCategories.includes("space") && !isFull;
      return matchFull || matchSpace;
    });
  }, [stores, storeCategories, cityScope]);

  const filteredChargingStations = useMemo(() => {
    if (chargingCategories.length === 0) return [];
    return chargingStations.filter((station) => {
      if (cityScope && station.cityId !== cityScope) return false;
      const desc = station.attributeCdDesc;
      const matchStoreSuper =
        chargingCategories.includes("store_super") && desc === "门店超充站";
      const matchStoreFast =
        chargingCategories.includes("store_fast") && desc === "门店快充站";
      const matchCity =
        chargingCategories.includes("city") &&
        desc !== "门店超充站" &&
        desc !== "门店快充站";
      return matchStoreSuper || matchStoreFast || matchCity;
    });
  }, [chargingStations, chargingCategories, cityScope]);

  const handleFieldChange = (field: keyof DashboardFilters, value: string) => {
    if (field === "districtId") {
      const district = findAreaById(districts, value);
      setFilters((current) => ({
        ...current,
        districtId: value,
        district: district?.areaName || ""
      }));
      return;
    }

    if (field !== "startTime" && field !== "endTime") return;
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const handleProvinceChange = (provinceId: string) => {
    const province = findAreaById(provinces, provinceId);
    setFilters((current) => ({
      ...current,
      provinceId,
      province: normalizeProvinceName(province?.areaName || ""),
      cityId: "",
      city: "",
      districtId: "",
      district: ""
    }));
  };

  const handleCityChange = (cityId: string) => {
    const city = findAreaById(cities, cityId);
    setFilters((current) => ({
      ...current,
      cityId,
      city: city?.areaName || "",
      districtId: "",
      district: ""
    }));
  };

  const handleToggleCarPower = (carPowers: string[]) => {
    setFilters((current) => ({ ...current, carPowers }));
  };

  const handleDurationRangeChange = (range: number[]) => {
    setDurationRange(normalizeNumericRange(range, durationBounds));
  };

  const handleVehicleCountRangeChange = (range: number[]) => {
    setVehicleCountRange(normalizeNumericRange(range, vehicleCountBounds));
  };

  const handleHeatRangeChange = (range: number[]) => {
    setHeatRange(normalizeNumericRange(range, HEAT_RANGE_BOUNDS));
  };

  const handleToggleMeasure = () => {
    if (toolMode === "measure") {
      setToolMode("none");
      setMeasureClearSignal((signal) => signal + 1);
      return;
    }
    setRanges([]);
    setMeasureClearSignal((signal) => signal + 1);
    setToolMode("measure");
  };

  const handleToggleRange = () => {
    if (toolMode === "range") {
      setToolMode("none");
      setRanges([]);
      return;
    }
    if (toolMode === "measure") {
      setMeasureClearSignal((signal) => signal + 1);
    }
    setRangeRadiusKm(3);
    setRanges([]);
    setToolMode("range");
  };

  const handleRangeRadiusChange = (radiusKm: number) => {
    if (!Number.isFinite(radiusKm)) return;
    setRangeRadiusKm(Math.min(100, Math.max(0.1, radiusKm)));
  };

  const handleAddRange = (
    center: { lat: number; lng: number },
    radiusKm: number
  ) => {
    setRanges((current) => [
      ...current,
      { id: crypto.randomUUID(), center, radiusKm }
    ]);
  };

  const handleRemoveRange = (id: string) => {
    setRanges((current) => current.filter((item) => item.id !== id));
  };

  const handleSearch = () => {
    void runSearch(filters);
  };

  const handleReset = () => {
    setStoreCategories([...ALL_STORE_CATEGORIES]);
    setChargingCategories([...ALL_CHARGING_CATEGORIES]);
    setToolMode("none");
    setRanges([]);
    setMeasureClearSignal((signal) => signal + 1);
    void loadBootstrap();
  };

  const handlePanelInteractionStart = useCallback(() => {
    setPanelHoverCount((count) => count + 1);
  }, []);

  const handlePanelInteractionEnd = useCallback(() => {
    setPanelHoverCount((count) => Math.max(0, count - 1));
  }, []);

  const busy = loading || bootstrapping;
  const retry = filters.province && filters.city ? handleSearch : handleReset;
  const emptyResult = !busy && items.length === 0 && Boolean(filters.city);

  return (
    <main className="dashboard-shell">
      <DashboardMap
        basemap={basemap}
        onBasemapChange={setBasemap}
        items={hotspotItems}
        stores={filteredStores}
        chargingStations={filteredChargingStations}
        heatMin={heatRangeDebounced[0]}
        heatMax={heatRangeDebounced[1]}
        cityCenter={cityCenter}
        selectedPoi={selectedPoi}
        toolMode={toolMode}
        measureClearSignal={measureClearSignal}
        rangeRadiusKm={rangeRadiusKm}
        ranges={ranges}
        onAddRange={handleAddRange}
        onRemoveRange={handleRemoveRange}
        panelHoverCount={panelHoverCount}
      />

      <FilterPanel
        filters={filters}
        provinces={provinces}
        cities={cities}
        districts={districts}
        vehicleTypes={vehicleTypes}
        loading={busy}
        resultCount={hotspotItems.length}
        poiItems={hotspotItems}
        selectedPoiKey={selectedPoiKey}
        collapsed={leftCollapsed}
        onToggleCollapse={() => setLeftCollapsed((value) => !value)}
        onFieldChange={handleFieldChange}
        onProvinceChange={handleProvinceChange}
        onCityChange={handleCityChange}
        onToggleCarPower={handleToggleCarPower}
        onSearch={handleSearch}
        onReset={handleReset}
        onPoiKeywordChange={setSelectedPoiKey}
        durationBounds={durationBounds}
        vehicleCountBounds={vehicleCountBounds}
        heatRangeBounds={HEAT_RANGE_BOUNDS}
        durationRange={durationRange}
        vehicleCountRange={vehicleCountRange}
        heatRange={heatRange}
        onDurationRangeChange={handleDurationRangeChange}
        onVehicleCountRangeChange={handleVehicleCountRangeChange}
        onHeatRangeChange={handleHeatRangeChange}
        onInteractionStart={handlePanelInteractionStart}
        onInteractionEnd={handlePanelInteractionEnd}
        toolMode={toolMode}
        onToggleMeasure={handleToggleMeasure}
        onToggleRange={handleToggleRange}
        rangeRadiusKm={rangeRadiusKm}
        onRangeRadiusChange={handleRangeRadiusChange}
        storeCategories={storeCategories}
        onStoreCategoriesChange={setStoreCategories}
        chargingCategories={chargingCategories}
        onChargingCategoriesChange={setChargingCategories}
        networkLoading={networkLoading}
      />

      <DataPanel
        items={hotspotItems}
        loading={busy}
        selectedCity={filters.city}
        selectedPoiKey={selectedPoiKey}
        collapsed={rightCollapsed}
        onToggleCollapse={() => setRightCollapsed((value) => !value)}
        onSelectPoi={setSelectedPoiKey}
        onInteractionStart={handlePanelInteractionStart}
        onInteractionEnd={handlePanelInteractionEnd}
      />

      {error ? (
        <div className="absolute left-1/2 top-16 z-50 flex max-w-[min(560px,calc(100vw-32px))] -translate-x-1/2 items-start gap-2 rounded-xl border border-red-500/40 bg-red-950/95 px-3 py-2.5 text-xs text-red-100 shadow-2xl backdrop-blur">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
          <span className="flex-1 leading-relaxed">{error}</span>
          <button
            type="button"
            className="shrink-0 rounded-md bg-red-500/90 px-2 py-1 text-[11px] font-medium text-white transition hover:bg-red-400"
            onClick={retry}
          >
            重试
          </button>
          <button
            type="button"
            aria-label="关闭提示"
            className="shrink-0 rounded-md p-1 text-red-300 transition hover:bg-red-900/60 hover:text-white"
            onClick={() => setError("")}
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : null}

      {bootstrapping && !error ? (
        <div className="absolute left-1/2 top-16 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/90 px-3 py-1.5 text-[11px] text-slate-300 shadow-xl backdrop-blur">
          <Loader2 className="size-3.5 animate-spin text-orange-400" />
          正在加载省市区与网络数据...
        </div>
      ) : null}

      {emptyResult && !error ? (
        <div className="pointer-events-none absolute left-1/2 top-28 z-30 -translate-x-1/2 rounded-lg border border-slate-700/70 bg-slate-950/85 px-3 py-2 text-center text-[11px] text-slate-400 shadow-xl backdrop-blur">
          当前日期范围无停留数据，可尝试 2026-01-01 ~ 2026-01-31 后重新查询
        </div>
      ) : null}
    </main>
  );
}
