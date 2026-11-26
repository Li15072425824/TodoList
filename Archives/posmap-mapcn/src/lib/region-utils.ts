import type { AreaItem } from "@/lib/types";

const DIRECT_MUNICIPALITIES = ["北京", "上海", "天津", "重庆"];

export function normalizeProvinceName(province: string): string {
  if (DIRECT_MUNICIPALITIES.includes(province)) {
    return `${province}市`;
  }
  return province;
}

/**
 * 将后端 areaCascade 无参返回的嵌套树拍平成 { provinces, cities, districts }。
 */
export function flattenAreaTree(tree: AreaItem[] | null | undefined): {
  provinces: AreaItem[];
  cities: AreaItem[];
  districts: AreaItem[];
} {
  const provinces: AreaItem[] = [];
  const cities: AreaItem[] = [];
  const districts: AreaItem[] = [];

  for (const province of tree || []) {
    provinces.push(province);

    for (const city of province.children || []) {
      const cityWithParent: AreaItem = {
        ...city,
        parentId: city.parentId || province.areaId,
        areaLevel: city.areaLevel ?? 2
      };
      cities.push(cityWithParent);

      for (const district of city.children || []) {
        districts.push({
          ...district,
          parentId: district.parentId || city.areaId,
          areaLevel: district.areaLevel ?? 3
        });
      }
    }
  }

  return { provinces, cities, districts };
}

export function findAreaById(list: AreaItem[], areaId: string): AreaItem | null {
  return list.find((item) => item.areaId === areaId) || null;
}
