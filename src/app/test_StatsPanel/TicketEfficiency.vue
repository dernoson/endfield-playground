<script setup lang="ts">
interface Props {
    ticketPerHour?: number;
}

withDefaults(defineProps<Props>(), {
    ticketPerHour: 799325,
});
</script>

<template>
    <div class="ticket-section">
        <div class="ticket-title">調度券兌換效率</div>
        <div class="ticket-value">
            {{ ticketPerHour !== undefined ? `≈ ${ticketPerHour.toLocaleString()}/hr` : '' }}
        </div>
    </div>
</template>

<style scoped>
.ticket-section {
    position: relative;
    margin-top: auto;
    width: 281px;
    padding-top: 10px;
    padding-bottom: 4px;
    flex-shrink: 0;
}

.ticket-title {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    color: #ffffff;
    white-space: nowrap;
}

.ticket-value {
    margin-top: 6px;
    padding-left: 48px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-size: 18px;
    line-height: 21px;
    color: #cfcfcf;
    white-space: nowrap;
}
</style>
