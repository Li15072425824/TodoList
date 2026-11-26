import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  defaultWidth: number;
  minWidth: number;
};

/**
 * 右侧面板向左拖拽扩宽：面板锚定右侧，宽度 = 起始宽度 + (起始 X - 当前 X)。
 */
export function useResizablePanel({ defaultWidth, minWidth }: Options) {
  const [width, setWidth] = useState(defaultWidth);
  const widthRef = useRef(width);
  widthRef.current = width;

  const clamp = useCallback(
    (nextWidth: number) => {
      const maxWidth = Math.max(minWidth, window.innerWidth - 48);
      return Math.min(Math.max(nextWidth, minWidth), maxWidth);
    },
    [minWidth]
  );

  useEffect(() => {
    const handleResize = () => setWidth((current) => clamp(current));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clamp]);

  const startResize = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = widthRef.current;

      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resizing";

      const handleMove = (moveEvent: PointerEvent) => {
        if (moveEvent.cancelable) moveEvent.preventDefault();
        setWidth(clamp(startWidth + (startX - moveEvent.clientX)));
      };

      const stop = () => {
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
    },
    [clamp]
  );

  return { width, startResize };
}
