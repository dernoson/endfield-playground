# V10-F1 證據一：測試通過輸出

執行：`pnpm test`（2026-08-26）

```
Test Files  30 passed (30)
Tests  677 passed (677)
```

其中與門檻直接相關：
- `src/__tests__/data/machineGeometry.test.ts`
- `src/__tests__/data/dataConsistency.test.ts`
- `src/__tests__/utils/portUtils.test.ts`

品質閘同日亦全綠：`pnpm type-check`／`lint-check`／`format-check`／`test`。
