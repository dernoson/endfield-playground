# W1109-M1｜MBD｜供電樁的畫面樣式

| meta | value |
|------|-------|
| 週次 | 2026-11-09 → 2026-11-22 |
| 等級 | **確定**（11/08 會議；自報 **3–5h**） |
| 擋門檻 | 否 |
| 上游 | [WEEK_20261109](../../WEEK_20261109.md)、[G1](../../goodmorning/1109/W1109-G1_power_pole.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 畫面上的供電樁｜`src/editor/layout/shapes/Electric.vue`｜`DeviceShape.vue`、`.stories.ts`、`GridCanvas`｜goodmorning（元件）、dernoson（合入） |

---

## 0. 白話目標

你這兩週只做供電樁在畫面上的樣式。

開始條件：goodmorning 已經把 `Electric.vue` push 到遠端。檔案還沒出現，就停，這不算未交。

---

## 1. 一步

1. 等他說檔案在了，或你自己看到遠端有 `Electric.vue`。
2. 只改這個檔的外形。根節點維持能放進現有 SVG 的寫法，不要改成整頁元件。
3. 推上去。PR 用他已開的那張，或另開一張但**只含這個檔**。不要再開一張 `DeviceShape`。

做完再停。不要自己往下加範圍。

---

## 2. 不要做

- 檔案還沒在遠端就先畫
- 改 `DeviceShape.vue`、stories、`GridCanvas`
- 改左側面板或右側產耗

---

## 3. DoD

- [ ] diff 只有 `Electric.vue` 的樣式
- [ ] 遠端看得到這次提交

未交，或元件還沒出現：供電樁維持拆分前的樣子。你不用補另一種設備。
