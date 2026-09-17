<script setup lang="ts">
interface Props {
    ticketPerHour?: number;
}

withDefaults(defineProps<Props>(), {
    ticketPerHour: 799325,
});
</script>

<template>
    <section class="space-y-1.5">
        <h3 class="text-base font-medium tracking-wide text-zinc-100">調度券兌換效率</h3>

        <div class="py-1 text-center font-mono text-sm tracking-wide text-zinc-300">
            ≈ {{ ticketPerHour.toLocaleString() }}/hr
        </div>
    </section>
</template>
