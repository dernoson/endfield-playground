<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { EquipmentType } from '@/types/editor';
import { useEditorStore } from '@/store/editorStore';

/** 藍圖 store：武裝放置模式與記錄目前選取設備類型 */
const editorStore = useEditorStore();

/** 控制底部設備選取列的開關狀態 */
const bottomBarOpen = ref(true);

/** 記錄目前選取的分類 Tab (預設選擇第一個 '全部') */
const activeCategory = ref('全部');

/** 搜尋關鍵字狀態 */
const searchQuery = ref('');

/**
 * 切換底部面板的展開/收合
 */
function toggleBottomBar() {
    bottomBarOpen.value = !bottomBarOpen.value;
}

/**
 * 監聽鍵盤事件：按下 'Z' 鍵切換底部面板
 */
function handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const isEditable =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
    
    if (isEditable) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key.toLowerCase() === 'z') {
        toggleBottomBar();
    }
}

/**
 * 處理滑鼠滾輪橫向滾動
 */
function handleWheelScroll(event: WheelEvent) {
    const target = event.currentTarget as HTMLElement;
    // 讀取滑鼠垂直滾動量 (deltaY) 並轉換為容器的水平滾動量 (scrollLeft)
    target.scrollLeft += event.deltaY;
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});

/** 分類 Tab */
const categoryTabs = ['全部', '物流', '倉儲', '生產', '合成', '電力', '功能'];

/** 
 * 擴充後的所有設備清單
 */
const equipments: Array<{ id: string; category: string; label: string }> = [
    // 物流
    { id: 'conveyor', category: '物流', label: '傳送帶' },
    { id: 'logistics-bridge', category: '物流', label: '物流橋' },
    { id: 'splitter', category: '物流', label: '分流器' },
    { id: 'merger', category: '物流', label: '匯流器' },
    { id: 'item-inlet', category: '物流', label: '物品准入口' },
    { id: 'pipe', category: '物流', label: '管道' },
    { id: 'pipe-bridge', category: '物流', label: '管道橋' },
    { id: 'pipe-splitter', category: '物流', label: '管道分流器' },
    { id: 'pipe-merger', category: '物流', label: '管道匯流器' },
    { id: 'pipe-inlet', category: '物流', label: '管道准入口' },

    // 倉儲
    { id: 'protocol-box', category: '倉儲', label: '協議儲存箱' },
    { id: 'warehouse-in', category: '倉儲', label: '倉庫存貨口' },
    { id: 'warehouse-out', category: '倉儲', label: '倉庫取貨口' },
    { id: 'liquid-tank', category: '倉儲', label: '儲液罐' },
    { id: 'gas-tank', category: '倉儲', label: '儲氣罐' },
    { id: 'access-line-base', category: '倉儲', label: '倉庫存取線基段' },
    { id: 'access-line-source', category: '倉儲', label: '倉庫存取線源樁' },
    { id: 'hidden-pipe-in', category: '倉儲', label: '暗管入口' },
    { id: 'hidden-pipe-out', category: '倉儲', label: '暗管出口' },
    { id: 'multi-hidden-in', category: '倉儲', label: '多口暗管入口' },
    { id: 'multi-hidden-out', category: '倉儲', label: '多口暗管出口' },

    // 生產
    { id: 'smelter', category: '生產', label: '精煉爐' },
    { id: 'crusher', category: '生產', label: '粉碎機' },
    { id: 'parts-maker', category: '生產', label: '配件機' },
    { id: 'shaper', category: '生產', label: '塑形機' },
    { id: 'seed-harvester', category: '生產', label: '採種機' },
    { id: 'planter', category: '生產', label: '種植機' },
    { id: 'wastewater-processor', category: '生產', label: '廢水處理機' },

    // 合成
    { id: 'equip-parts-maker', category: '合成', label: '裝備原件機' },
    { id: 'filler', category: '合成', label: '灌裝機' },
    { id: 'packager', category: '合成', label: '封裝機' },
    { id: 'grinder', category: '合成', label: '研磨機' },
    { id: 'reaction-pool', category: '合成', label: '反應池' },
    { id: 'expanded-reaction-pool', category: '合成', label: '擴容反應池' },
    { id: 'heaven-furnace', category: '合成', label: '天有洪爐' },
    { id: 'purifier', category: '合成', label: '提純機' },
    { id: 'dismantler', category: '合成', label: '拆解機' },
    { id: 'liquid-gas-converter', category: '合成', label: '液氣轉化機' },
    { id: 'solid-gas-converter', category: '合成', label: '固氣轉化機' },
    { id: 'gas-disperser', category: '合成', label: '氣體散布機' },
    { id: 'gas-reactor', category: '合成', label: '氣體反應爐' },

    // 電力
    { id: 'power-pole', category: '電力', label: '供電樁' },
    { id: 'xirang-power-pole', category: '電力', label: '息壤供電樁' },
    { id: 'repeater', category: '電力', label: '中繼器' },
    { id: 'xirang-repeater', category: '電力', label: '息壤中繼器' },
    { id: 'thermal-pool', category: '電力', label: '熱能池' },

    // 功能
    { id: 'zipline', category: '功能', label: '滑索架' },
    { id: 'long-zipline', category: '功能', label: '長距滑索架' },
    { id: 'sprinkler', category: '功能', label: '灑水機' },
];

/** 
 * 根據分類與關鍵字進行過濾 
 */
const filteredEquipments = computed(() => {
    let result = equipments;
    
    // 1. 根據 Tab 分類進行過濾 (全部則跳過此階段)
    if (activeCategory.value !== '全部') {
        result = result.filter(eq => eq.category === activeCategory.value);
    }
    
    // 2. 根據搜尋字串進行過濾
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
        result = result.filter((eq) => 
            eq.label.toLowerCase().includes(query) || 
            eq.id.toLowerCase().includes(query)
        );
    }
    
    return result;
});

/**
 * 點擊設備按鈕時武裝放置模式
 */
function handleEquipClick(equipmentId: string) {
    editorStore.setSelectedEquipment(equipmentId as EquipmentType);
    editorStore.armPlacement(equipmentId as EquipmentType);
}

/**
 * 開始拖拉設備按鈕時，記錄目前選取設備並將類型寫入 dataTransfer
 */
function handleEquipDragStart(event: DragEvent, equipmentId: string) {
    editorStore.setSelectedEquipment(equipmentId as EquipmentType);

    if (!event.dataTransfer) {
        return;
    }

    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/x-endfield-equipment', equipmentId);
}
</script>

<template>
    <!-- 永遠釘死在畫布最底端 -->
    <div class="absolute bottom-0 left-0 z-50 flex w-full flex-col pointer-events-none">
        
        <!-- 懸浮控制層：32px (左上角視角按鈕與收合三角形) -->
        <div class="relative w-full h-[32px] shrink-0">
            
            <!-- 視角切換分頁：474x32 -->
            <div class="pointer-events-auto absolute bottom-0 left-0 flex h-[32px] w-[474px] items-center rounded-tr-[25px] bg-[#4E4E4E] pl-[80px]">
                <button type="button" class="flex h-[26px] w-[80px] items-center justify-center text-[16px] font-light leading-none text-white disabled:opacity-100" disabled>
                    佈局視角
                </button>
                <span class="text-white/50">|</span>
                <button type="button" class="flex h-[26px] w-[80px] items-center justify-center text-[16px] font-light leading-none text-white disabled:opacity-100" disabled>
                    流程視角
                </button>
                <span class="text-white/50">|</span>
                <button type="button" class="flex h-[26px] w-[80px] items-center justify-center text-[16px] font-light leading-none text-white disabled:opacity-100" disabled>
                    並列視角
                </button>
                <p class="ml-2 text-xs font-light text-[#A4A4A4]">(按TAB切換視角)</p>
            </div>

            <!-- 底部設備選取列開關：黃色三角形 -->
            <button
                type="button"
                class="group pointer-events-auto absolute bottom-0 left-1/2 flex h-[32px] w-[64px] -translate-x-1/2 items-center justify-center"
                :aria-label="bottomBarOpen ? '收合底部設備選取列' : '展開底部設備選取列'"
                :aria-expanded="bottomBarOpen"
                @click="toggleBottomBar"
            >
                <span
                    class="size-0 border-x-[19.5px] border-b-[19.79px] border-x-transparent border-b-[#EEFD1C] opacity-80 transition-transform group-hover:opacity-100"
                    :class="bottomBarOpen ? 'rotate-180' : ''"
                />
            </button>
        </div>

        <!-- 實體面板：CSS Grid 動畫 -->
        <div 
            class="pointer-events-auto w-full grid transition-all duration-300 ease-in-out"
            :class="bottomBarOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
        >
            <div class="overflow-hidden">
                <!-- 鎖定面板高度為 208px -->
                <div class="flex h-[208px] w-full shrink-0 flex-col bg-[#4e4e4e] px-[80px] pt-[23px]">
                    
                    <!-- 上排：搜尋框 + 分類 Tab -->
                    <div class="flex h-[43px] w-[1114px] shrink-0 items-center gap-[18px] mb-[18px]">
                        
                        <!-- 搜尋框 -->
                        <label class="flex h-full w-[218px] cursor-text items-center gap-2 rounded-full border border-[#eefd1c] bg-[#3c3c3c] px-[18px]">
                            <UIcon name="i-lucide-search" class="size-5 shrink-0 text-white/50" />
                            <input 
                                v-model="searchQuery"
                                type="text" 
                                placeholder="搜尋設備..." 
                                aria-label="搜尋設備"
                                class="w-full bg-transparent text-[20px] font-[250] leading-none tracking-[0.03em] text-white/50 placeholder:text-white/50 focus:outline-none" 
                            />
                        </label>

                        <!-- 分類 Tab -->
                        <button
                            v-for="tab in categoryTabs"
                            :key="tab"
                            type="button"
                            @click="activeCategory = tab"
                            class="h-[43px] w-[110px] rounded-[15px] text-[20px] font-light leading-none tracking-[0.03em] text-white transition-colors"
                            :class="activeCategory === tab ? 'bg-[#2b2b2b]' : 'bg-[#3c3c3c]'"
                            :aria-label="`切換至 ${tab} 分類`"
                        >
                            {{ tab }}
                        </button>
                    </div>

                    <!-- 下排：設備卡片列 -->
                    <!-- 綁定 @wheel.prevent 事件來轉換垂直滾動為水平滾動 -->
                    <div 
                        class="flex h-[100px] w-[1760px] shrink-0 items-start gap-[18px] overflow-x-auto [&::-webkit-scrollbar]:hidden"
                        style="scrollbar-width: none;"
                        @wheel.prevent="handleWheelScroll"
                    >
                        
                        <!-- 無搜尋結果提示 -->
                        <div v-if="filteredEquipments.length === 0" class="flex h-[100px] w-full items-center justify-center text-[20px] font-light text-white/50">
                            {{ activeCategory !== '全部' ? `在「${activeCategory}」分類中` : '' }}找不到符合「{{ searchQuery }}」的設備
                        </div>

                        <!-- 物件卡片 -->
                        <button
                            v-for="equipment in filteredEquipments"
                            :key="equipment.id"
                            type="button"
                            draggable="true"
                            @click="handleEquipClick(equipment.id)"
                            @dragstart="handleEquipDragStart($event, equipment.id)"
                            class="relative shrink-0 w-[266px] h-[100px] text-left focus:outline-none"
                        >
                            <!-- 深色背景層 -->
                            <div 
                                class="absolute left-0 top-[14px] w-full h-[78px] rounded-t-[8px]"
                                :class="editorStore.selectedEquipment === equipment.id ? 'bg-[#1c1c1c]' : 'bg-[#2b2b2b]'"
                            ></div>
                            
                            <!-- 黃色底線層 -->
                            <div class="absolute left-0 top-[92px] w-full h-[4px] rounded-b-[8px] bg-[#eefd1c]"></div>

                            <!-- 圖片容器：100x100 完整紅色中空方框標示範圍 -->
                            <div class="absolute left-0 top-0 w-[100px] h-[100px] border-[2px] border-red-500 bg-transparent flex items-center justify-center">
                                <!-- 之後放置真實圖片的地方 -->
                            </div>

                            <!-- 文字層 -->
                            <span class="absolute left-[107px] top-[41px] text-[20px] font-light leading-none tracking-[0.03em] text-white">
                                {{ equipment.label }}
                            </span>
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>