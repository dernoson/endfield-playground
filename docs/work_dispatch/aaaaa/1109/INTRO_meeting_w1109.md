# 會議說明｜2026-11-22｜1109–1122 兩週結算

| meta | value |
|------|-------|
| 週次 | 2026-11-09 → 2026-11-22（11/15 沒開會，這次一次講完） |
| 對象 | 週會／主編 |
| 派工總表 | [WEEK_20261109](../../WEEK_20261109.md) v1.1 §0.2 |
| 本人工單 | [W1109-A0](./W1109-A0_poc_scope.md) |
| 大綱 | [ROADMAP_OUTLINE](../../../roadmap/ROADMAP_OUTLINE.md) v1.27 |
| 驗收細項 | [V22-E1](../../../aaaaa/dev/dev_v22/E1_acceptance_and_handoff.md) |
| 請主編看的 PR | [#94](https://github.com/dernoson/endfield-playground/pull/94)（開著，static-check 已過） |
| 撰寫 | aaaaa |
| 最後更新 | 2026-11-22 |

---

## 0. 三十秒結論

這兩週的派工在 [WEEK_20261109](../../WEEK_20261109.md)。主畫面和供電樁已經在 master。POC 的範圍句子寫好了，還在 [#94](https://github.com/dernoson/endfield-playground/pull/94)，等主編合。左欄沒有打得開的稿。右側產耗的 [#84](https://github.com/dernoson/endfield-playground/pull/84) 可以合，還沒合。JSON 有一段程式，沒有 PR，也不擋 11/29。

---

## 1. 會上先對齊的三個詞

| 詞 | 白話 | 這次怎麼用 |
|----|------|------------|
| POC | 11/29 要拿出來驗的範圍 | 句子在 [大綱門檻句](../../../roadmap/ROADMAP_OUTLINE.md) |
| 底層 | 資料怎麼轉、怎麼刪，以及對應的測試。人在畫面上還看不到 | 旋轉見 [B3](../../../roadmap/detail/B3_rotation_90.md)，刪除見 [B5](../../../roadmap/detail/B5_delete_single_device.md) |
| 畫面 | 正式畫布上點得到的按鈕或格子 | 這兩項畫面這次不派 |

旋轉的底層是 `layoutStore.rotateDevice`，測試在 `src/__tests__/store/layoutStore.rotation.test.ts`。刪除的底層是 `layoutStore.removeDevice`，測試在 `src/__tests__/store/layoutStore.test.ts`。這兩段程式已經在 master。寫進 POC 的那幾句在 #94。

---

## 2. 一項一項講

判定跟 [WEEK §0.2](../../WEEK_20261109.md) 相同。每張工單末尾有「驗收（2026-11-22）」。

| 工單 | 當初要做的事 | 現在 | 看這裡 |
|------|----------------|------|--------|
| [A0](./W1109-A0_poc_scope.md) aaaaa | 確認刪除、旋轉的底層，並改 POC 範圍 | **完成，等合入** | [大綱 v1.27](../../../roadmap/ROADMAP_OUTLINE.md)、[C1](../../../aaaaa/dev/dev_v22/C1_poc_bottom_layer.md)、[#94](https://github.com/dernoson/endfield-playground/pull/94) |
| [H1](../../harry/1109/W1109-H1_main_ui_pr.md) harry | 主畫面 UI 收到已核准的範圍為止 | **完成** | [#89](https://github.com/dernoson/endfield-playground/pull/89)、[#90](https://github.com/dernoson/endfield-playground/pull/90) 已合。[#88](https://github.com/dernoson/endfield-playground/pull/88) 已關 |
| [P1](../../paper/1109/W1109-P1_pickup_panel.md) paper | 左欄和取貨口的稿，按鈕要像按鈕，交一個打得開的連結 | **未完成** | 倉庫裡沒有這份連結，也沒有設計 PR |
| [S1](../../shirone/1109/W1109-S1_machine_card.md) shirone | 稿到了才改左邊設備資訊 | **沒開工，不算未交** | master 沒有新的 `MachineCard` PR |
| [G1](../../goodmorning/1109/W1109-G1_power_pole.md) goodmorning | 供電樁拆成自己的元件，開 PR | **完成** | [#92](https://github.com/dernoson/endfield-playground/pull/92) 已合，裡面有 `Electric.vue`。同一張 PR 也交了整份 `DeviceShape.vue` |
| [M1](../../MBD/1109/W1109-M1_power_pole_style.md) MBD | 等元件出現後，改供電樁在畫布上的樣子 | **完成** | [#93](https://github.com/dernoson/endfield-playground/pull/93) 已合，並有 `Electric.stories.ts` |
| [T1](../../toby/1109/W1109-T1_pr84_and_alerts.md) toby | 先讓 #84 可合，再讓右側看得到警示、觸發的設備變紅 | **未完成** | [#84](https://github.com/dernoson/endfield-playground/pull/84) 可合、未合。PR 裡已有警示，同時仍改 `useFlowEngine.ts`、`flowStore.ts`、`LayoutView.vue` |
| [Z1](../../azure9572/1109/W1109-Z1_blueprint_slice.md) azure | JSON 匯入匯出做一小步。加分，不擋 POC | **有程式，沒有 PR** | 分支 `azure9572-w1109-z1-blueprint`，提交 `a1cb228` |
| [D0](../../dernoson/1109/W1109-D0_gate.md) dernoson | 守住合入：JSON 不成必交，刪除和旋轉的新畫面不合進來 | **完成** | 結算時只開著 #84。#88 已關 |

casey、avery 這兩週沒有工單。

---

## 3. 已完成

1. **POC 句子寫好了。** 旋轉、刪除的底層納入。兩項的畫面留在未完成。JSON 匯入匯出留在 POC 外面。出處是 [大綱 v1.27](../../../roadmap/ROADMAP_OUTLINE.md)、[B3](../../../roadmap/detail/B3_rotation_90.md)、[B5](../../../roadmap/detail/B5_delete_single_device.md)。這段在 [#94](https://github.com/dernoson/endfield-playground/pull/94)。
2. **主畫面收到 #89、#90。** #88 關掉了，沒有變成第二套產耗。工單是 [H1](../../harry/1109/W1109-H1_main_ui_pr.md)。
3. **供電樁有自己的元件，也有畫布樣式。** [G1](../../goodmorning/1109/W1109-G1_power_pole.md) 的 #92，接著 [M1](../../MBD/1109/W1109-M1_power_pole_style.md) 的 #93。#92 的說明記了白紙口頭確認。
4. **閘門守住了。** [D0](../../dernoson/1109/W1109-D0_gate.md)：結算當下沒有把 JSON 收成必交，也沒有新的刪除或旋轉畫面合進來。

同一張 #94 還帶了試玩的第三題：這條線能不能接上。它在 `/dev/l1-contract-lab` 的試玩分頁。合進 master 之前，大家在 master 上還看不到這一題。進度記在 [todolist_v22](../../../aaaaa/dev/todolist_v22.md)。

---

## 4. 待辦

這幾項還開著。會上再決定要不要續派，這份說明不預寫下一張工單。

| 待辦 | 白話 | 出處 |
|------|------|------|
| 合入 #94 | POC 句子和試玩第三題進 master 之後，全專案才看得到 | [#94](https://github.com/dernoson/endfield-playground/pull/94) |
| 左欄稿 | 要一個打得開的連結。沒有連結，左欄程式就繼續停 | [P1](../../paper/1109/W1109-P1_pickup_panel.md)、[S1](../../shirone/1109/W1109-S1_machine_card.md) |
| #84 | 可合，未合。裡面有右側提示和設備變紅，也改了三個凍結檔 | [T1](../../toby/1109/W1109-T1_pr84_and_alerts.md)、[#84](https://github.com/dernoson/endfield-playground/pull/84) |
| JSON | 純函式和測試在 azure 的分支。要進主線需要一張 PR。它不擋 11/29 | [Z1](../../azure9572/1109/W1109-Z1_blueprint_slice.md) |
| 刪除、旋轉的畫面 | 底層已在 POC 句子裡。正式畫布還沒有刪除；旋轉的快捷鍵不算畫面完成。這次不派人做按鈕 | [A0](./W1109-A0_poc_scope.md)、[B3](../../../roadmap/detail/B3_rotation_90.md)、[B5](../../../roadmap/detail/B5_delete_single_device.md) |

---

## 5. 建議口頭節奏（約 5 分鐘）

1. **開場：** 11/15 沒開會，所以今天把 11/09 到 11/22 一次講完。總表在週派工大綱。
2. **POC：** 刪除和旋轉的資料層早就在 master。這兩週把「底層算進 11/29、畫面上的按鈕不算」寫進大綱。JSON 繼續留在外面。請主編看 #94。
3. **已在 master 的畫面：** 主畫面是 #89、#90。供電樁先拆成 `Electric.vue`（#92），再改樣式（#93）。
4. **還空著的：** 左欄沒有稿，所以程式沒有開工，這不算漏交。右側的 #84 可以合，還沒合，而且還動到凍結檔。JSON 有程式、沒有 PR，不擋驗收。
5. **收尾：** 請主編裁三件事：#94 要不要合、#84 要不要另案合、左欄這週沒有稿要不要續等。

---

## 6. 請主編在會上裁

1. [#94](https://github.com/dernoson/endfield-playground/pull/94) 的 POC 句子是否照 v1.27 合入。
2. [#84](https://github.com/dernoson/endfield-playground/pull/84) 是否另案處理。它和 #94 分開。
3. 左欄維持現況，直到 [P1](../../paper/1109/W1109-P1_pickup_panel.md) 有打得開的連結。
