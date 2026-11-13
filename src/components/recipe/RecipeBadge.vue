<script setup lang="ts">
defineProps({ label: { type: String, required: true }, tone: { type: String, default: 'light' } })
</script>
<template>
  <span class="inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em]" :class="tone === 'olive' ? 'bg-olive text-white' : tone === 'terracotta' ? 'bg-terracotta text-white' : 'bg-paper/95 text-olive backdrop-blur-sm'">{{ label }}</span>
</template>
