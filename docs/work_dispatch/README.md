# 每週派工（work_dispatch）

| meta | value |
|------|-------|
| version | v3.1（2026-08-30；工單按個人檔分流） |
| 用途 | 把 roadmap 的週切片，落成**每人一份、可照著做**的工單 |
| 本週區間 | **2026-08-31（日）→ 2026-09-06（日）**（M2 擺放月第一週） |
| 上週區間 | 2026-08-23 → 08-30（M1 已成立） |
| 性質 | 工作指派與引導文件；**不是**績效評核 |
| 上游 | [roadmap/ROADMAP_OUTLINE.md](../roadmap/ROADMAP_OUTLINE.md)、[roadmap/detail/](../roadmap/detail/) |

---

## 0. 先看這裡：我要讀哪一份？

| 你想知道 | 打開 |
|----------|------|
| **我這週要交什麼** | 下面表格找自己的代號（**0831**） |
| 這週全隊在做什麼 | [WEEK_20260831.md](./WEEK_20260831.md) |
| 上週工單（已結束） | [WEEK_20260823.md](./WEEK_20260823.md) 或各人 `0823/` |
| 到 11/29 的整體計畫 | [roadmap/ROADMAP_OUTLINE.md](../roadmap/ROADMAP_OUTLINE.md) |

### 本週（8/31–9/6）每人的工單

| code | 你的工單 | 一句話 |
|------|----------|--------|
| [aaaaa](./aaaaa/0831/) | [W0831-A1](./aaaaa/0831/W0831-A1_toolbar_real_machines.md) | 工具列接真實機器資料（B1） |
| [dernoson](./dernoson/0831/) | [W0831-D0](./dernoson/0831/W0831-D0_gate_and_sept_scope.md) | 決策／合入／9 月門檻裁示 |
| [toby](./toby/0831/) | [W0831-T1](./toby/0831/W0831-T1_inspector_flatten.md) | Inspector 攤平（附 GUIDE） |
| [shirone](./shirone/0831/) | [W0831-S1](./shirone/0831/W0831-S1_l3_learn_and_e001_handoff.md) | L3 學習＋E001 交接（無 GUIDE） |
| [goodmorning](./goodmorning/0831/) | [W0831-G1](./goodmorning/0831/W0831-G1_machine_card.md) | MachineCard（DL 9/4＋樣板） |
| [paper](./paper/0831/) | [W0831-P1](./paper/0831/W0831-P1_frame_labels.md) | frame 標號＋變更摘要 |
| [MBD](./MBD/0831/) | [W0831-M1](./MBD/0831/W0831-M1_empty_copy_step.md) | 單步文案（附 GUIDE） |
| [harry](./harry/0831/) | [W0831-H0](./harry/0831/W0831-H0_pause.md) | **暫停** |
| [azure9572](./azure9572/0831/) | [W0831-Z0](./azure9572/0831/W0831-Z0_pause.md) | **暫停**（W001 已合入） |
| [avery](./avery/0831/) | [W0831-V0](./avery/0831/W0831-V0_pause_and_retain.md) | **暫停**＋續留一句 |

---

## 1. 目錄結構

```text
docs/work_dispatch/
├── README.md                 ← 本檔
├── WEEK_20260823.md          ← 上週大綱
├── WEEK_20260831.md          ← 本週大綱
└── <代號>/
    ├── 0823/                 ← 上週工單＋GUIDE
    │   ├── W0823-*.md
    │   └── GUIDE_*.md
    └── 0831/                 ← 本週工單
        ├── W0831-*.md
        └── GUIDE_*.md          ← 僅需引導者（toby／goodmorning／MBD）
```

| 規則 | 說明 |
|------|------|
| 一人一資料夾 | 資料夾名＝Discord／git 代號 |
| 週次子資料夾 | `MMDD`＝該週起始日（週日）；工單與當週 GUIDE 放同一週資料夾 |
| 檔名 | `WMMDD-<縮寫><序號>_短名.md` |
| 暫停 | 仍開短檔，寫明原因與復工條件 |

---

## 2. 工單怎麼讀

| 欄 | 意思 |
|----|------|
| **畫面** | 做完螢幕上長什麼樣（30 秒可驗） |
| **交哪個檔** | 路徑寫死就照做 |
| **不要碰** | 同週檔案鎖 |
| **卡住找誰** | 直接問，不要硬撐 |

---

## 3. 本週原則（摘要）

- 一人一週一種性質  
- 門檻必要項只派低－中風險且該域 ALLOW（本週實質＝**aaaaa**）  
- 加分未交不計失敗；暫停不計完成率  
- dernoson **不兼**功能實作  
- **「推到分支」即算交付**，合入與否由主編負責（規則 13）  
- **工單密度按人分流**（規則 16）：shirone 給少；toby／MBD／goodmorning 給白話＋GUIDE；aaaaa／harry 只給目標  
- 不得把 AI 長文反貼給成員（規則 18）  
- 待審 PR 建議 ≤ 3  

---

## 4. 本週狀態

| 檔 | 狀態 |
|----|------|
| [WEEK_20260831.md](./WEEK_20260831.md) | **v1.1**（按個人檔改寫工單） |
| 10 份 `0831` 工單 | 已寫（含 3 暫停）；toby／G1／M1 各附 GUIDE |
| 上週 `0823/` | 已封存 |

> 發現工單路徑或依賴寫錯：Discord 說或開 PR 改。
