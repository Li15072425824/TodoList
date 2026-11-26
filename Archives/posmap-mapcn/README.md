# posmap-mapcn

用 [mapcn](https://github.com/stwgabriel/mapcn)（MapLibre GL + Tailwind v4 + shadcn 风格组件）重建的停留热点地图仪表盘，功能对齐 `/Users/lixing/WorkRep/posmap`。

## 功能

- 省 / 市 / 区三级联动筛选，默认定位湖北省 · 武汉市 · 当前自然月
- 日期范围（≤31 天）、车辆动力类型多选，多动力类型并发查询后按 POI 合并加权
- 热力图 + 停留阈值双滑块（平均停留、车辆数）与热力区间调节
- 门店网络 / 超快充网络图层，按分类 chip 开合，随城市范围过滤
- 当前结果内 POI 自动补全，选中后地图飞点并弹出信息
- 鼠标悬浮高亮：门店 → 充电站 → POI 优先级
- 测距（多段、累计距离）与圆形圈选（左键新增、右键删除）
- 右侧按区县分组汇总表：排序、展开/收起、子行飞点、拖拽调宽、Excel 导出
- 底图可切换：高德 GCJ-02 栅格（默认，与接口坐标一致）/ CARTO WGS84（渲染时自动做 GCJ-02 → WGS84 转换）
- 高德瓦片加载失败时提示并一键切换 CARTO；空结果、请求失败均有明确状态

## 开发

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build
npm run start
```

环境变量见 `.env.local` / `.env.test` / `.env.production`：

- `NEXT_PUBLIC_DATA_API_BASE_URL=__proxy__`：客户端走同源 `/out/...`，由 `next.config.ts` rewrite 代理到 `DATA_API_BASE_URL`，规避 CORS。
- `DATA_API_BASE_URL`：后端地址（test / production）。
- `NEXT_PUBLIC_AMAP_TILE_URL`：可选，覆盖高德栅格瓦片模板（默认 `webrd01` host）。

> 接口坐标是 GCJ-02。高德底图直接使用原坐标；CARTO 底图下渲染几何做 GCJ-02 → WGS84 转换，鼠标拾取坐标反向转回 GCJ-02，因此两种底图下点位均对齐。

## 目录

```
src/
  app/                     Next.js App Router（深色主题固定）
  registry/map.tsx         mapcn Map 组件（扩展了受控 mapStyle / styleEpoch）
  components/
    dashboard/             仪表盘编排、筛选面板、汇总面板、POI 自动补全
    map/                   热力、网络、悬浮、测距、圈选、选中 POI 图层
    ui/                    shadcn 风格基础组件
  lib/                     接口、坐标转换、区域/日期/阈值工具、Excel 导出
  hooks/                   防抖、面板拖拽调宽
```

底图切换会触发 `setStyle`，自定义 source/layer 通过 `styleEpoch` 在 `style.load` 后统一重建，避免切图丢层。

验证数据：2026-01 武汉有停留数据；当前月（2026-10）为空，页面会提示可尝试 2026-01-01 ~ 2026-01-31。
