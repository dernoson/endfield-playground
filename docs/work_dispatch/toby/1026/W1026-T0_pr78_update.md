# W1026-T0｜toby｜更新 #78 至可合入（合入前不派新塊）

| meta | value |
|------|-------|
| 週次 | 2026-10-26 → 2026-11-01 |
| 等級 | **確定・本週主戲** |
| 擋門檻 | **是（C1 合入）** |
| 上游 | [WEEK_20261026](../../WEEK_20261026.md) v1.0、[C1](../../../roadmap/detail/C1_port_hit_and_draft.md)、上週 [W1018-T1](../1018/W1018-T1_c1_draft_connect.md) |
| PR | [#78](https://github.com/dernoson/endfield-playground/pull/78) OPEN |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 正式頁埠連線｜`LayoutView.vue`／`GridCanvas.vue`（#78 範圍內）｜`layoutStore`／`canConnect`／`hitTestPortAt` **本體**、`MainLayout`、他人 `shapes/*`｜aaaaa（契約）、dernoson（合入） |
| 時數 | 問卷「下周」＝與上週差不多（**3–5h**） |

---

## 0. 白話目標

上週你已開 [#78](https://github.com/dernoson/endfield-playground/pull/78)（埠連線、斷線警示、旋轉等）。**10/25 會議：先把 PR 更新完，再派新需求。**

本週只做：**rebase master、回審查、把 C1 拉線主路徑推到可合。** 不要平行再開第二條大功能 PR。

契約／命中請查 `/dev/l1-contract-lab` 與 [LAB 指南](../../aaaaa/1018/LAB_l1_contract_guide.md)。

---

## 1. 必做

1. **對齊 master：** rebase／merge；解 conflict。
2. **回審查：** 逐條回應；該改就改、該拆就拆。
3. **守住 C1 邊界：**
   - draft＝**local ref**（不進 store／歷史）
   - 放開才 `canConnect` → `addPipeline`（或既有高階）
   - 按埠＝拉線；按設備體＝拖曳；空白＝平移
4. **旋轉／Delete：** 若審查要求本週不放行——依 D0 指示拆出另 PR 或暫退；**預設仍退**（roadmap）。
5. CI 綠；與 dernoson 對齊合入條件。

---

## 2. 不要做

- 合入前再開「C3 大改／多選／Ctrl+Z 入口」等新功能塊
- 改 `hitTestPortAt`／`canConnect`／`layoutStore` 簽名（只呼叫）
- `GridCanvas` import Pinia
- 代改 MBD／harry 的 shapes 目錄

---

## 3. DoD

- [ ] #78 已 rebase 近 master；CI 綠
- [ ] 審查意見已回（或明寫待裁點給 D0）
- [ ] `pnpm dev`：port→port 拉線仍可演示
- [ ] draft 不進 store
- [ ] 合入 **或** 主編／D0 明寫卡點
