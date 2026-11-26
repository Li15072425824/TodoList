import type {
  AreaItem,
  ChargingStationItem,
  PoiItem,
  StoreItem
} from "@/lib/types";
import { mergePoiResults } from "@/lib/poi-merge";

const DEFAULT_APP_ID = "pickmap_user";
const REQUEST_TIMEOUT_MS = 30_000;

export function isSuccessCode(code: unknown): boolean {
  return code === 0 || code === 200;
}

function getBaseUrl(): string {
  const envBaseUrl = process.env.NEXT_PUBLIC_DATA_API_BASE_URL || "";

  if (!envBaseUrl || envBaseUrl === "__proxy__") {
    // 同源相对路径，由 next.config 的 rewrites 代理到上游
    return "";
  }

  return envBaseUrl.replace(/\/$/, "");
}

function buildHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "digital-dm-appid": process.env.NEXT_PUBLIC_DATA_API_APP_ID || DEFAULT_APP_ID,
    "request-id": crypto.randomUUID(),
    "request-timestamp": String(Date.now())
  };
}

type RemoteResponse<T> = {
  code?: number;
  msg?: string;
  data?: T;
};

export function isNetworkError(message: string): boolean {
  return /Failed to fetch|NetworkError|Load failed|请求超时|timed out/i.test(message);
}

async function postJson<T>(endpointPath: string, payload: object): Promise<T[]> {
  const baseUrl = getBaseUrl();
  const path = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload ?? {}),
      signal: controller.signal
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("请求超时，请检查网络后重试");
    }
    throw new Error(error instanceof Error ? error.message : "网络请求失败");
  } finally {
    clearTimeout(timer);
  }

  const json = (await response.json().catch(() => ({}))) as RemoteResponse<T[]>;

  if (!response.ok && !json?.msg) {
    throw new Error(`请求失败（HTTP ${response.status}）`);
  }

  if (json?.msg && !isSuccessCode(json?.code)) {
    const message = json.msg;
    // 远程返回「暂无数据」视为空结果，而非异常
    if (
      message.includes("暂无数据") ||
      message.toLowerCase().includes("no data") ||
      message.includes("无数据")
    ) {
      return [];
    }
    throw new Error(message);
  }

  if (!isSuccessCode(json?.code)) {
    throw new Error(json?.msg || "接口返回异常");
  }

  return json?.data ?? [];
}

export async function queryAreaTree(): Promise<AreaItem[]> {
  return postJson<AreaItem>("/out/v1/store/map/network/areaCascade", {});
}

export async function queryPoiTrajectory({
  startTime,
  endTime,
  province,
  city,
  district = "",
  carPowers = []
}: {
  startTime: string;
  endTime: string;
  province: string;
  city: string;
  district?: string;
  carPowers?: string[];
}): Promise<PoiItem[]> {
  const selectedCarPowers = Array.isArray(carPowers) ? carPowers.filter(Boolean) : [];
  const values = selectedCarPowers.length > 0 ? selectedCarPowers : [""];

  const results = await Promise.all(
    values.map((value) =>
      postJson<PoiItem>("/out/v1/data/poi/trajectory", {
        startTime,
        endTime,
        province,
        city,
        ...(district ? { district } : {}),
        ...(value ? { carPower: value } : {})
      }).then((items) =>
        items.map((item) => ({
          ...item,
          carPowers: value ? [value] : []
        }))
      )
    )
  );

  return mergePoiResults(results);
}

export async function queryStores(): Promise<StoreItem[]> {
  return postJson<StoreItem>("/out/v1/data/pickmap/store/storeLocate", {
    storeManageStatus: "全部",
    storeTypeList: [
      "全功能用户中心",
      "岚图空间",
      "岚图展厅-独立展厅",
      "岚图展厅-非独立展厅",
      "交付服务中心",
      "集中交付中心",
      "全功能用户中心-独立展厅",
      "岚图空间-独立展厅"
    ]
  });
}

export async function queryChargingStations(): Promise<ChargingStationItem[]> {
  return postJson<ChargingStationItem>("/out/v1/data/charge-station/list", {
    provinceId: "",
    cityId: ""
  });
}
