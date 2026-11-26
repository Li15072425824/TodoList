"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { buildPoiKey, type PoiItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type PoiAutocompleteProps = {
  items: PoiItem[];
  selectedPoiKey: string;
  onSelect: (poiKey: string) => void;
  disabled?: boolean;
};

export function PoiAutocomplete({
  items,
  selectedPoiKey,
  onSelect,
  disabled = false
}: PoiAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  const selectedItem = useMemo(
    () => items.find((item) => buildPoiKey(item) === selectedPoiKey) || null,
    [items, selectedPoiKey]
  );

  useEffect(() => {
    setQuery(selectedItem?.poiName || "");
  }, [selectedItem]);

  const options = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const matched = keyword
      ? items.filter((item) =>
          `${item.poiName} ${item.address || ""} ${item.districtName || ""}`
            .toLowerCase()
            .includes(keyword)
        )
      : items;
    return matched.slice(0, 60);
  }, [items, query]);

  useEffect(() => {
    setHighlighted(0);
  }, [query, open]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${highlighted}"]`
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  const choose = (item: PoiItem) => {
    onSelect(buildPoiKey(item));
    setQuery(item.poiName);
    setOpen(false);
  };

  const clear = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    onSelect("");
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <Popover open={open && !disabled} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={query}
                disabled={disabled}
                placeholder="输入 POI 名称或地址关键字"
                className="h-9 bg-input/20 pl-8 pr-8 text-sm"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setOpen(true);
                    setHighlighted((current) =>
                      Math.min(current + 1, Math.max(options.length - 1, 0))
                    );
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setHighlighted((current) => Math.max(current - 1, 0));
                  } else if (event.key === "Enter" && open && options[highlighted]) {
                    event.preventDefault();
                    choose(options[highlighted]);
                  } else if (event.key === "Escape") {
                    setOpen(false);
                  }
                }}
              />
              {selectedPoiKey ? (
                <button
                  type="button"
                  aria-label="清除 POI 选择"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-700/60 hover:text-white"
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={clear}
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="p-0"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div ref={listRef} className="max-h-[300px] overflow-y-auto panel-scroll">
              {options.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-slate-500">
                  无匹配结果
                </div>
              ) : (
                options.map((item, index) => {
                  const active = index === highlighted;
                  return (
                    <button
                      key={buildPoiKey(item)}
                      type="button"
                      data-index={index}
                      onMouseEnter={() => setHighlighted(index)}
                      onClick={() => choose(item)}
                      className={cn(
                        "block w-full border-b border-slate-800/70 px-3 py-2 text-left last:border-0",
                        active && "bg-slate-800/80"
                      )}
                    >
                      <div className="truncate text-xs font-medium text-slate-100">
                        {item.poiName}
                      </div>
                      <div className="truncate text-[10px] text-slate-500">
                        {[item.districtName, item.address].filter(Boolean).join(" · ") ||
                          "暂无区域信息"}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {selectedItem ? (
        <div className="truncate text-[11px] text-slate-500">
          {selectedItem.districtName || selectedItem.address || "暂无区域信息"}
        </div>
      ) : (
        <p className="text-[10px] leading-relaxed text-slate-500">
          候选仅来自当前筛选结果，选择后会定位到对应 POI。
        </p>
      )}
    </div>
  );
}
