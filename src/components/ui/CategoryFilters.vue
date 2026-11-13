<script setup lang="ts">
defineProps<{ modelValue: string; categories: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
<template>
  <div class="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrer les recettes par catégorie">
    <button v-for="category in categories" :key="category" type="button" class="shrink-0 rounded-full border px-4 py-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2" :class="modelValue === category ? 'border-olive bg-olive text-white' : 'border-line bg-surface text-ink hover:border-olive hover:text-olive'" :aria-pressed="modelValue === category" @click="emit('update:modelValue', category)">{{ category }}</button>
  </div>
</template>
