# W0907-H1｜harry｜格點視窗：平移、縮放、座標換算

| meta | value |
|------|-------|
| 週次 | 2026-09-07 → 2026-09-13 |
| 等級 | **確定**（L2 薄片；回歸第一塊） |
| 擋門檻 | 否（不列 09/27 必要條件） |
| 你的檔 | `src/editor/layout/useGridViewport.ts`、`src/app/dev/GridViewportDemo.vue`、`src/router/index.ts` |
| 產能參考 | 自報 3–5h；**無硬 deadline**，推到分支即算交付 |

---

## 1. 目標

新畫布是自建 SVG，格線與佔格由 toby 那邊畫（[T1](../../toby/0907/W0907-T1_gridcanvas_readonly.md)）。**缺的是「看哪裡」這一層**：畫面要能拖著走、滾輪縮放，而且要能把滑鼠位置換算回格子座標。

這塊是純狀態＋純數學，**與 store 無關、與 toby 的元件不同檔**，可以完全獨立收尾。

---

## 2. 邊界

| 允許 | 不要 |
|------|------|
| `src/editor/layout/useGridViewport.ts`（新，composable） | 碰 `src/editor/layout/GridCanvas.vue`（toby 本週的檔） |
| `src/app/dev/GridViewportDemo.vue`（新，你自己的展示頁） | 碰任何 Pinia store（`must_not` 沿用） |
| `src/router/index.ts` 加一條 `/dev/grid-viewport`（**本週 router 歸你**） | 加深 `FactoryCanvas`／Vue Flow |
| `src/__tests__/editor/useGridViewport.test.ts` | 做選取／擺放（未解鎖） |

展示頁自己畫幾條格線意思到就好，**不要引用 toby 的元件**——他還在寫，import 進來只會互相卡。9/14 整合週再接。

---

## 3. 需要有答案的三件事

1. **座標換算來回一致**：`screenToCell(cellToScreen(c)) === c`。這條是這塊唯一會被別人依賴的契約，測試釘死它。
2. **縮放有上下限**，且**以游標為錨點**縮放（不是以左上角）——否則放大時畫面會飄。
3. **平移用哪個鍵**由你定（中鍵拖曳／空白鍵＋左鍵／WASD 皆可），在 PR 寫一行說明即可。你上次做 `KEYBINDING_ACTIONS` 的作法可以沿用，但**本週不改註冊表**，先寫死在 composable 裡。

實作形狀（`ref` 還是 `reactive`、要不要吐 event handler）你決定，照你平常的 `PLAN_*.md` 流程走即可。

---

## 4. 窗口來了還有餘力的話

允許連吃第二塊，**但只限同一個檔的延伸**：鍵盤平移（WASD／方向鍵）＋縮放快捷鍵（`Ctrl` `+`／`-`／`0` 歸位）。

**不要**主動去接 toby 的元件、也不要去補 store——那兩塊本週各有 owner。

---

## 5. DoD

- [ ] `useGridViewport.ts` 在分支上，未 import store
- [ ] `pnpm test src/__tests__/editor/useGridViewport.test.ts` 綠，含 §3-1 來回一致
- [ ] `pnpm dev` → `/dev/grid-viewport` 可拖曳平移、滾輪縮放，縮放有上下限
- [ ] `pnpm type-check`、`pnpm lint-check` 綠
- [ ] diff 不含 `GridCanvas.vue`、不含 `src/store/*`
- [ ] PR body 一行：平移用什麼鍵、縮放範圍多少

---

## 6. 排程與同步

**不綁任何時間。** 週日會出席不是交付前提，缺席不視為未交付。

需要對齊時走非同步：Discord 一段文字或短語音，主編當天會回。**不安排固定 walkthrough 時段**——要的話你開口，隨時約。

---

## 7. 順便記（沿用）

- W0823-H1：`KEYBINDING_ACTIONS` 可改註冊表、不可改 action。**本週不動它**，等 viewport 穩了再談要不要註冊。
- 舊 `FactoryCanvas`／Vue Flow 佈局視角**已定案要拔**，任何往那邊加的東西不會合入。

---

## 8. 未交頂替

不計失敗。本塊不擋 09/27，也不擋 toby——他的元件本週吃 props，不需要 viewport。
