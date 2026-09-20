<script setup lang="ts">
// 1. 定義資料結構
interface WarehouseRow {
    itemId: string;
    name: string;
    hoursToFull: number | null;
}

interface Props {
    capacityCells: number;
    rows: WarehouseRow[];
}

// 2. 宣告 Props 與 Emits
const props = defineProps<Props>();

// 定義符合圖片規範的 emit
const emit = defineEmits<{
    (e: 'update:capacityCells', v: number): void;
}>();

// 3. 當使用者在輸入框修改數值時觸發的函式
function handleCapacityChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newValue = Number(target.value);

    // 發射 update:capacityCells 事件，把新數值送回父元件
    emit('update:capacityCells', newValue);
}
</script>

<template>
    <div class="warehouse-estimate bg-transparent p-0 text-[#DADADA]">
        <h3 class="text-[#DADADA]">倉庫預估 WarehouseEstimate</h3>

        <!-- 容量輸入框：綁定 value，並在輸入時發射 emit -->
        <div class="my-3">
            <label class="text-[#DADADA]/80">倉庫容量格數：</label>
            <input
                type="number"
                :value="capacityCells"
                @input="handleCapacityChange"
                class="ml-2 rounded border border-[#3C3C3C] bg-[#2B2B2B] px-2 py-1 text-[#DADADA]"
            />
        </div>

        <!-- 列表呈現 -->
        <table class="mt-2 w-full text-left text-[#DADADA]">
            <thead>
                    <tr class="border-b border-[#3C3C3C]">
                    <th class="pb-2">品項名稱</th>
                    <th class="pb-2">預估滿載時間</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in rows" :key="item.itemId" class="border-b border-[#3C3C3C]/70">
                    <td class="py-2">{{ item.name }}</td>
                    <td class="py-2">
                        <span v-if="item.hoursToFull !== null">
                            {{ item.hoursToFull }} 小時後滿載
                        </span>
                        <span v-else class="text-[#DADADA]/60">（產出為負，不會滿載）</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
