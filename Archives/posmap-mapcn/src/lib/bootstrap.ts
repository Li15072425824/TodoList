import { queryAreaTree } from "@/lib/data-api";
import { getCurrentMonthRange } from "@/lib/date-utils";
import { flattenAreaTree } from "@/lib/region-utils";
import type { BootstrapData } from "@/lib/types";

/**
 * 一次性加载省市区树，并选择默认筛选条件（湖北省 / 武汉市 / 当前自然月）。
 */
export async function getBootstrap(): Promise<BootstrapData> {
  const tree = await queryAreaTree();
  const { provinces, cities } = flattenAreaTree(tree);

  const preferredProvince =
    provinces.find((item) => item?.areaName === "湖北省") || provinces[0];
  const citiesOfPreferred = preferredProvince
    ? cities.filter((city) => city.parentId === preferredProvince.areaId)
    : cities;
  const preferredCity =
    citiesOfPreferred.find((item) => item?.areaName === "武汉市") || citiesOfPreferred[0];

  return {
    provinces,
    areaTree: tree,
    defaultFilters: {
      provinceId: preferredProvince?.areaId || "",
      province: preferredProvince?.areaName || "",
      cityId: preferredCity?.areaId || "",
      city: preferredCity?.areaName || "",
      districtId: "",
      district: "",
      ...getCurrentMonthRange(),
      carPowers: []
    }
  };
}
