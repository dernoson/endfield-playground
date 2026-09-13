# W0907-T1｜toby｜GridCanvas 只讀渲染（L2 第一刀）

| meta | value |
|------|-------|
| 週次 | 2026-09-07 → 2026-09-13 |
| 等級 | **確定**（L2 薄片；等閘已解除） |
| 擋門檻 | 否（不列 09/27 必要條件） |
| 教學檔 | [GUIDE_gridcanvas_readonly.md](./GUIDE_gridcanvas_readonly.md) |
| 要改的檔 | **只有** `src/editor/layout/GridCanvas.vue`（新檔）＋同層 `GridCanvas.stories.ts` |
| 配對窗口 | 有（本週名額給你）；dernoson 或 aaaaa，Discord 約 |
| 產能參考 | 自報 3–5h |

---

## 0. 白話目標

上週你等宣告、沒去碰畫布，**這是對的**。宣告已經在 PR #40 發了，內容是：

```text
L2 可開最小 GridCanvas 只讀渲染（仍待 store 模型另開）
```

翻成白話：**這週你可以開始畫新畫布了，但只能「畫出來」，不能「點得動」。**

做一個元件，外面餵它一包資料（幾台設備、幾條管線），它就畫出：格線、設備佔的格子、管線的折線。**沒有點擊、沒有拖曳、沒有選取**——那些要等 aaaaa 的 store，排下週。

**不是**叫你搬舊的 `FactoryCanvas`。那個是 Vue Flow 版，本週起不加深。新檔、新資料夾、空白開始。

---

## 1. 一句話驗收

**別人打開 Storybook，切「已連接／斷線」兩組假資料，都能看到格子上有設備方塊和管線。**

---

## 2. 這幾個詞

| 詞 | 白話 | 本週 |
|----|------|------|
| **只讀** | 元件只負責「顯示」，不改資料、也不通知外面 | 不寫 `emit`、不寫 `@click` |
| **props** | 外面餵進來的資料 | 設備陣列、管線陣列、格子大小 |
| **佔格** | 一台 3×3 的機器會蓋住 9 個格子 | 有現成函式算，不用自己算 |
| **Storybook** | 元件的獨立展示台，不用開整個 App | 本週的驗收現場：`pnpm storybook` |
| **fixture** | 寫死的假資料 | `src/data/mockLayout.ts` 已經有兩組 |

---

## 3. 邊界

| 允許 | 不要 |
|------|------|
| 新建 `src/editor/layout/GridCanvas.vue` | import 任何 store（`useEditorStore` 等） |
| 新建 `src/editor/layout/GridCanvas.stories.ts` | import `@vue-flow/*` |
| import `src/types/layout.ts`、`src/utils/layout/*`、`src/data/machines.ts` | 改 `src/app/dev/LayoutL1Preview.vue`（aaaaa 的檔） |
| 從 `LayoutL1Preview.vue` **照抄**畫法（見 GUIDE §3） | 改 `src/router/index.ts`（harry 的檔） |
| Tailwind class | 碰 `useGridViewport.ts`（harry 本週在做平移縮放） |

**harry 這週也在做格點相關的東西，但是另一個檔。** 你們不會撞；**看到自己要改到對方的檔就先停下來問**，不要自己合。

---

## 4. 開工

- [ ] Discord 回一句：「T1 GridCanvas 只讀，本週做」
- [ ] `pnpm install` → `pnpm storybook`，確認能開起來、看得到既有元件
- [ ] 讀 [GUIDE](./GUIDE_gridcanvas_readonly.md)，確認 props 型別
- [ ] 需要配對就直接約，本週名額留給你

---

## 5. 交檔

分支 `dev/toby0907`，開 PR。做到哪就先推——**推到分支就算交付**，合入與否是主編的事。

---

## 6. DoD

- [ ] `src/editor/layout/GridCanvas.vue` 存在，接 props，**無 emit**
- [ ] `GridCanvas.stories.ts` 至少兩個 story：`connected`、`broken`
- [ ] `pnpm storybook` 兩個 story 都畫得出格線＋設備方塊＋管線折線
- [ ] `pnpm type-check`、`pnpm lint-check` 綠
- [ ] 檔案內 `grep` 不到 `store`、`FactoryCanvas`、`vue-flow`
- [ ] diff 只有上述兩個新檔

---

## 7. 卡住找誰

| 狀況 | 找誰 |
|------|------|
| props 型別、佔格函式怎麼用 | aaaaa |
| 路徑、怎麼交、要不要拆 PR | dernoson |
| 覺得「只讀」這個限制做不出東西 | **先回報一句再改做法**，不要自己擴大範圍 |

> **超過一天沒進展就講一聲。** 你自述「工項太雜會被拆成多次而延宕」——本週只有這一塊，不會再加第二塊，卡住直接說即可。

---

## 8. 未交頂替

不計失敗，下週原樣重派。L1 除錯頁 `/dev/layout-l1-preview` 已可展示格點，演示不受影響。
