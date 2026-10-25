/**
 * V14–V17 L1 契約目錄（給串接／呼叫端的定義表）
 *
 * 演示頁 `L1ContractLab.vue` 消費此資料；改契約時請同步更新本檔與公開 LAB 指南。
 */

/**
 * 契約實驗室分頁版本鍵
 *
 * @example
 * const v: ContractVersion = 'V16'
 */
export type ContractVersion = 'V14' | 'V15' | 'V16' | 'V17';

/**
 * 單一 API／契約列（表格一列）
 */
export interface ContractApiRow {
    /** 匯出符號或呼叫路徑（顯示用） */
    symbol: string;
    /** 模組路徑（顯示用） */
    module: string;
    /** 一句話：做什麼 */
    purpose: string;
    /** 誰該呼叫 */
    callers: string;
    /** 常見誤用 */
    dont: string;
}

/**
 * 可選的更深演示連結
 */
export interface ContractDeeperDemo {
    /** 連結文字 */
    label: string;
    /** 相對站台路徑或獨立 HTML */
    href: string;
}

/**
 * 單一版本契約塊（總覽列＋分頁內容）
 */
export interface ContractVersionBlock {
    /** 版本鍵 */
    version: ContractVersion;
    /** 分頁標題 */
    title: string;
    /** 相關 PR 字串 */
    prs: string;
    /** 總覽「一句話」 */
    oneLiner: string;
    /** API 列 */
    apis: ContractApiRow[];
    /** 可選深鏈 */
    deeperDemo?: ContractDeeperDemo;
}

/**
 * 總覽：版本 → 契約塊（頁面唯一資料源）
 */
export const CONTRACT_BLOCKS: ContractVersionBlock[] = [
    {
        version: 'V14',
        title: '落子前預檢＋連線規則',
        prs: '#54／#55',
        oneLiner: 'L2 預覽與 store 真落子走同一套 canPlace／canConnect；勿自算佔格或另寫錨點。',
        deeperDemo: {
            label: 'V14 專頁（綠／紅案例卡）',
            href: '/dev/placement-connect-check.html',
        },
        apis: [
            {
                symbol: 'canPlaceDevice',
                module: '@/utils/layout/placementCheck',
                purpose: 'draft 能否放置；回傳 PlacementResult（含 DRAFT_ID conflicts）',
                callers: '落子預覽、toolbar 意圖；預檢與寫入規則同源，寫入重疊不擋（見 addDevice）',
                dont: '自己 import detectOverlaps 另算預覽',
            },
            {
                symbol: 'canMoveDevice',
                module: '@/utils/layout/placementCheck',
                purpose: '既有設備移到新格是否合法；原位必 ok（預檢可回 overlap）',
                callers: '拖曳預覽／放開前',
                dont: '移動時用 canPlaceDevice 假裝新機',
            },
            {
                symbol: 'canConnect',
                module: '@/utils/layout/connectRules',
                purpose: '管線 waypoints 能否連；與 resolveConnections 同錨點',
                callers: '連線 draft；addPipeline 防線',
                dont: '另寫「端點碰哪一埠」；單端命中仍要查方向／媒質',
            },
            {
                symbol: 'describeConnectFailure',
                module: '@/utils/layout/connectRules',
                purpose: '把 ConnectResult 轉成人話；ConnectResult 本身無 message',
                callers: 'UI 文案',
                dont: '在 L1 規則函式裡組 UI 字串',
            },
        ],
    },
    {
        version: 'V15',
        title: '出界列表＋埠熱區命中',
        prs: '#60／#65',
        oneLiner: '出界只供 Error 視覺（仍可落子）；埠命中用連續格座標熱區，勿與 findPortAt 混淆。',
        apis: [
            {
                symbol: 'devicesOutsideBase',
                module: '@/utils/layout/devicesOutsideBase',
                purpose: '回傳佔格超出基地的 device id[]；region=null → []',
                callers: '畫布紅框／警示；不改 canPlaceDevice',
                dont: '把出界當 PlacementResult 拒絕理由（除非產品改裁決）',
            },
            {
                symbol: 'hitTestPortAt',
                module: '@/utils/layout/portHitTest',
                purpose: '點擊／拖線熱區命中 → PortRef＋side＋media；預設半徑 0.5 格',
                callers: 'C1／L2 開始拖線、放開接線',
                dont: '拿 findPortAt（格點精確）當滑鼠熱區',
            },
        ],
    },
    {
        version: 'V16',
        title: '源素材寫入＋設備旋轉（layoutStore）',
        prs: '#72／V18 rotateDevice',
        oneLiner:
            'primaryOutput 只寫 layoutStore；旋轉用 rotateDevice；引擎讀經 toTopology。重疊不擋寫入。',
        deeperDemo: {
            label: 'layoutStore 演示（獨立 HTML）',
            href: '/dev/layout-store-preview.html',
        },
        apis: [
            {
                symbol: 'setDevicePrimaryOutput',
                module: '@/store/layoutStore',
                purpose: 'uid＋itemId|null＋可選 rate；進歷史；省略 rate＝30',
                callers: '左面板／源設備表單（正式 UI 後續）',
                dont: '雙寫 editorStore.primaryOutput',
            },
            {
                symbol: 'rotateDevice',
                module: '@/store/layoutStore',
                purpose: '單一設備設 rotation（0–3）；進 MachineRotation 歷史；原點／管線座標不動',
                callers: 'L2 快捷鍵旋轉（#78）；勿在 L2 自寫第二套',
                dont: '旋轉時改 position 或改寫管線 waypoints；勿因 overlap 擋寫入',
            },
            {
                symbol: 'addDevice／moveDevice',
                module: '@/store/layoutStore',
                purpose: '寫入類；僅 invalid 失敗；overlap 仍寫入（E001→layoutIssues）',
                callers: 'L2 落子／拖曳確認',
                dont: '把 PlacementResult.overlap 當寫入擋板（預檢 can* 仍可回 overlap）',
            },
            {
                symbol: 'toTopology（已映射欄位）',
                module: '@/utils/layout/toTopology',
                purpose:
                    'devices→FactoryNode；帶出 primaryOutput／sourceRatePerMin；machineType＝英文 id',
                callers: '引擎餵入（見 V17）',
                dont: '以為引擎會直接 watch layoutStore（接法＝經 adapter）',
            },
        ],
    },
    {
        version: 'V17',
        title: '機型 id 查表＋引擎切片＋歷史隔離',
        prs: '#74／#76（#73／#58）',
        oneLiner:
            '查定義 resolveMachineDef（id 優先）；配方仍用 name；toTopology 可測 30/min；正式頁不自動 fixture；跨正式／dev 清 history。',
        deeperDemo: {
            label: 'FlowEngine 測試頁',
            href: '/dev/flow-engine',
        },
        apis: [
            {
                symbol: 'resolveMachineDef',
                module: '@/data/machines',
                purpose: 'getMachineById ?? getMachine；過渡雙查',
                callers: '驗證 getDef、引擎、任何新碼查機型',
                dont: 'getRecipesForMachine(英文 id)；偵測器直接 getMachine',
            },
            {
                symbol: 'getRecipesForMachine(def.name, mode)',
                module: '@/data/products',
                purpose: '配方鍵＝中文名',
                callers: '驗證／引擎在 resolve 之後',
                dont: '把 machineType id 當配方鍵',
            },
            {
                symbol: 'toTopology → buildGraph／propagateFlows',
                module: '@/utils/layout/toTopology＋@/composables/useFlowEngine',
                purpose: '英文 id 快照可建圖算產耗（測試產線 30/min）',
                callers: '引擎掛載／單元測',
                dont: '正式頁自動 loadSnapshot(connected)（已廢）',
            },
            {
                symbol: 'historyContext／clear on navigate',
                module: '@/utils/history/*＋router',
                purpose: '／＝formal、／dev＝dev；跨界 history.clear()',
                callers: '已掛 router；呼叫端通常不用再清',
                dont: '以為獨立 HTML preview 與 SPA 共用 Pinia（其實分開）',
            },
        ],
    },
];
