# 文件導覽

這裡放**全員共用**的專案文件。三個問題，三個入口：

| 你想知道 | 打開 |
|----------|------|
| **我這週要交什麼** | [work_dispatch/](./work_dispatch/) → 找自己的代號資料夾（**0831**） |
| 這週全隊在做什麼 | [work_dispatch/WEEK_20260831.md](./work_dispatch/WEEK_20260831.md) |
| 到 11/29 的整體計畫與各工項驗收標準 | [roadmap/ROADMAP_OUTLINE.md](./roadmap/ROADMAP_OUTLINE.md) |

---

## 1. 本週（2026-08-31 → 09-06）我的工單

| 你是 | 直接點這裡 |
|------|------------|
| aaaaa | [W0831-A1 工具列接真實機器資料](./work_dispatch/aaaaa/0831/W0831-A1_toolbar_real_machines.md) |
| dernoson | [W0831-D0 決策／合入／9 月門檻裁示](./work_dispatch/dernoson/0831/W0831-D0_gate_and_sept_scope.md) |
| toby | [W0831-T1 Inspector 攤平](./work_dispatch/toby/0831/W0831-T1_inspector_flatten.md) |
| shirone | [W0831-S1 L3 學習＋E001 交接](./work_dispatch/shirone/0831/W0831-S1_l3_learn_and_e001_handoff.md) |
| goodmorning | [W0831-G1 MachineCard](./work_dispatch/goodmorning/0831/W0831-G1_machine_card.md) |
| paper | [W0831-P1 frame 標號](./work_dispatch/paper/0831/W0831-P1_frame_labels.md) |
| MBD | [W0831-M1 空狀態文案（單步）](./work_dispatch/MBD/0831/W0831-M1_empty_copy_step.md) |
| harry | [W0831-H0 暫停](./work_dispatch/harry/0831/W0831-H0_pause.md) |
| azure9572 | [W0831-Z0 暫停](./work_dispatch/azure9572/0831/W0831-Z0_pause.md) |
| avery | [W0831-V0 暫停＋續留一句](./work_dispatch/avery/0831/W0831-V0_pause_and_retain.md) |

上週（8/23–8/30）工單在各人 `0823/`；總表見 [WEEK_20260823.md](./work_dispatch/WEEK_20260823.md)。

第一次接工單的話，先看 [work_dispatch/README.md](./work_dispatch/README.md)。

---

## 2. 資料夾一覽

| 路徑 | 內容 | 誰在維護 |
|------|------|----------|
| [roadmap/](./roadmap/) | 2026-08-23 → 11-29 的工項總表、里程碑、週曆 | aaaaa（規劃）、dernoson（守門） |
| [roadmap/detail/](./roadmap/detail/) | 每個工項的背景、技術決策、DoD、未交頂替 | 同上 |
| [work_dispatch/](./work_dispatch/) | 每週派工大綱＋每人一份工單與教學檔 | aaaaa |
| `<你的代號>/`（如 [toby/](./toby/)、[paper/](./paper/)） | 個人筆記、設計稿、PLAN；**不是**正式程式碼的家 | 各自 |
| [dernoson/](./dernoson/) | 三層架構（L1／L2／L3）長版說明 | dernoson |
| [aaaaa/](./aaaaa/) | 資料層與流程引擎的技術文件、歷次版本開發紀錄 | aaaaa |

**正式元件一律放 `src/`**，不要放在 `docs/<自己>/`。

---

## 3. 三條硬規則（動手前先確認）

1. **L3 不 import Pinia store。** 只吃 props、只 emit。
2. **L2 只呼叫 L1 高階 action。** 禁止 `nodes.push`、禁止自組 Command、禁止在容器裡算流量。
3. **L1 不寫正式 UI。** debug 頁一律放 `src/app/dev/` 並加 dev-only guard。

細節與由來見 [roadmap/detail/A1](./roadmap/detail/A1_announce_and_baseline.md) §4.1；三層是什麼見 [dernoson/](./dernoson/)。

---

## 4. 交付與驗收

| 規則 | 說明 |
|------|------|
| 30 秒驗收 | 截圖、測試輸出或 repo 連結；「我本機跑起來了」不算證據 |
| 交檔路徑 | 依工單寫死的路徑；**不要**用 GitHub 網頁上傳、不要把日期寫進檔名 |
| PR | 一個主題一個 PR；待審上限 3 件，超過會標「延壓」排下週 |
| 交不出來 | 說一句「本週不做／暫停」就結案，**不計失敗**，也不用道歉 |

完整節奏（週循環、未完成怎麼處理、什麼時候可以改期）見 [roadmap/detail/A4](./roadmap/detail/A4_weekly_cadence_gate.md)。

---

## 5. 卡住找誰

| 問題 | 找 |
|------|-----|
| 環境裝不起來、git／PR 流程 | dernoson |
| 三層架構、Vue 寫法 | dernoson |
| 機器資料、佔格／port、純函式與測試 | aaaaa |
| 工單本身寫錯（路徑不存在、依賴的檔已改名） | aaaaa，或直接開 PR 改 |

貼錯誤訊息時請貼**整段**，不要只說「壞掉了」——這樣才有辦法在一次回覆內解掉。
