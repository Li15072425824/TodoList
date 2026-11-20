# Brief

**Question:** Rebuild the Ant Design X ThoughtChain Chinese component documentation page (plus 4 related routes) as a local React + Vite site, matching layout, nine interactive demos, API tables, Semantic DOM and Design Token tables.

**Purpose:** Recreate the component documentation page with @ant-design/x ThoughtChain so a non-coding person has a pixel-faithful local copy.

**Targets:**
- capture/capture.json
- capture/screenshot-1440.png
- capture/screenshot-768.png
- capture/screenshot-390.png
- capture/routes/
- capture/states/
- https://x.ant.design/components/thought-chain-cn (reference only, no fetch)

**Constraints:**
- Clean room: never open/fetch the original site or its source; work only from capture evidence
- Use Vite + React + TypeScript with @ant-design/x ThoughtChain
- Change files only inside app/
- No dev servers; build must succeed and work as static files
- Must build all 5 routes with shared navigation

**Done when:** All 5 routes build, navigation works, nine demos interactive, API/Semantic DOM/Token tables present, rebuild_check reports pass at 1440/768/390 widths.
