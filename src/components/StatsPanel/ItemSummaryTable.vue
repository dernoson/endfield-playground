<script setup lang="ts">
interface ItemSummaryRow {
    itemId: string;
    name: string;
    iconUrl: string;
    produced: number;
    consumed: number;
    net: number;
    efficiency: number;
}

interface Props {
    rows: ItemSummaryRow[];
}

defineProps<Props>();

function getNetClass(value: number) {
    return value >= 0 ? 'text-[#A3FD1C]' : 'text-[#FF6E6E]';
}

function getNetText(value: number) {
    return value >= 0 ? `收益 +${value}` : `收益 ${value}`;
}
</script>

<template>
    <div class="bg-transparent p-0 text-[#DADADA]">
        <h3 class="mb-[9px] text-[20px] font-normal text-[#FFFFFF]">產能估算</h3>

        <div class="stats-scroll-area">
            <div v-if="rows && rows.length > 0" class="w-full">
                <div v-for="row in rows" :key="row.itemId" class="product-row">
                    <div class="product-name-wrap">
                        <span class="caret">ˇ</span>
                        <span class="product-name">{{ row.name }}</span>
                    </div>

                    <div class="net-value" :class="getNetClass(row.net)">{{ getNetText(row.net) }}</div>

                    <div class="produce-line">
                        <span class="label">生產</span>
                        <span class="value">{{ row.produced }}/min</span>
                    </div>

                    <div class="consume-line">
                        <span class="label">消耗</span>
                        <span class="value">{{ row.consumed }}/min</span>
                    </div>
                </div>
            </div>

            <div v-else class="flex w-full flex-col items-center justify-center py-8 text-zinc-500">
                <p class="text-sm">目前沒有產耗資料</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.stats-scroll-area {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    gap: 9px;
    position: absolute;
    width: 256px;
    height: 241px;
    left: 21px;
    top: 263px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.product-row {
    position: relative;
    width: 100%;
    min-height: 71px;
    margin-bottom: 10px;
}

.product-name-wrap {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    width: 150px;
    height: 21px;
    color: #cfcfcf;
}

.caret {
    display: inline-block;
    font-size: 18px;
    line-height: 21px;
    color: #cfcfcf;
    transform: translateY(-1px);
}

.product-name {
    display: inline-block;
    font-family: 'HarmonyOS Sans TC';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    color: #cfcfcf;
    white-space: nowrap;
}

.net-value {
    position: absolute;
    width: 100px;
    height: 19px;
    right: 0;
    top: 1px;
    font-family: 'HarmonyOS Sans TC';
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 19px;
    text-align: right;
}

.net-value.text-\[\#A3FD1C\] {
    color: #a3fd1c;
}

.net-value.text-\[\#FF6E6E\] {
    color: #ff6e6e;
}

.produce-line,
.consume-line {
    position: absolute;
    left: 18px;
    width: 125px;
    height: 19px;
    font-family: 'HarmonyOS Sans TC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    color: #cfcfcf;
}

.produce-line {
    top: 26px;
}

.consume-line {
    top: 45px;
}

.label {
    color: #cfcfcf;
}

.value {
    color: #ffffff;
    margin-left: 8px;
}

.stats-scroll-area::-webkit-scrollbar {
    position: absolute;
    width: 9px;
    height: 241px;
    left: 290px;
    top: 263px;
    background: transparent;
}

.stats-scroll-area::-webkit-scrollbar-track {
    background: transparent;
}

.stats-scroll-area::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.46);
    border-radius: 4.5px;
}

.stats-scroll-area::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.6);
}
</style>
