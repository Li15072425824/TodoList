import type { Map as MapLibreMap } from "maplibre-gl";

const PIXEL_RATIO = 2;

export const MAP_IMAGE_IDS = {
  storeFull: "store-full",
  storeSpace: "store-space",
  chargeSuper: "charge-store-super",
  chargeFast: "charge-store-fast",
  chargeCity: "charge-city"
} as const;

function createCanvas(width: number, height: number): CanvasRenderingContext2D {
  const canvas = document.createElement("canvas");
  canvas.width = width * PIXEL_RATIO;
  canvas.height = height * PIXEL_RATIO;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.scale(PIXEL_RATIO, PIXEL_RATIO);
  return ctx;
}

function toImageData(ctx: CanvasRenderingContext2D, width: number, height: number): ImageData {
  return ctx.getImageData(0, 0, width * PIXEL_RATIO, height * PIXEL_RATIO);
}

/** 门店 pin：圆形 + 底部尖角 */
function createPinImage(color: string): ImageData {
  const width = 32;
  const height = 44;
  const ctx = createCanvas(width, height);
  const cx = width / 2;
  const cy = 16;
  const radius = 12;

  ctx.lineJoin = "round";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;

  // 底部尖角
  ctx.beginPath();
  ctx.moveTo(cx - 7, cy + 9);
  ctx.lineTo(cx, height - 2);
  ctx.lineTo(cx + 7, cy + 9);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();

  // 圆形主体
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();

  // 内白点
  ctx.beginPath();
  ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  return toImageData(ctx, width, height);
}

/** 充电站：圆形 + 白色闪电 */
function createBoltImage(color: string): ImageData {
  const size = 30;
  const ctx = createCanvas(size, size);
  const cx = size / 2;

  ctx.beginPath();
  ctx.arc(cx, cx, 13, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 闪电路径（来自 24x24 viewBox）
  const scale = 0.62;
  const offset = cx - 12 * scale;
  const bolt = new Path2D();
  bolt.moveTo(13 * scale + offset, 2 * scale + offset);
  bolt.lineTo(3 * scale + offset, 14 * scale + offset);
  bolt.lineTo(10 * scale + offset, 14 * scale + offset);
  bolt.lineTo(8 * scale + offset, 22 * scale + offset);
  bolt.lineTo(18 * scale + offset, 10 * scale + offset);
  bolt.lineTo(11 * scale + offset, 10 * scale + offset);
  bolt.lineTo(13 * scale + offset, 2 * scale + offset);
  bolt.closePath();

  ctx.fillStyle = "#ffffff";
  ctx.fill(bolt);

  return toImageData(ctx, size, size);
}

const IMAGE_BUILDERS: Array<{ id: string; build: () => ImageData }> = [
  { id: MAP_IMAGE_IDS.storeFull, build: () => createPinImage("#4a64ac") },
  { id: MAP_IMAGE_IDS.storeSpace, build: () => createPinImage("#6AAFB6") },
  { id: MAP_IMAGE_IDS.chargeSuper, build: () => createBoltImage("#9966FF") },
  { id: MAP_IMAGE_IDS.chargeFast, build: () => createBoltImage("#230821") },
  { id: MAP_IMAGE_IDS.chargeCity, build: () => createBoltImage("#4488FF") }
];

/**
 * 在样式切换后图片会丢失，因此每次 styleEpoch 变化都要检查并重新添加。
 */
export function ensureMapImages(map: MapLibreMap): void {
  for (const { id, build } of IMAGE_BUILDERS) {
    if (!map.hasImage(id)) {
      map.addImage(id, build(), { pixelRatio: PIXEL_RATIO });
    }
  }
}
