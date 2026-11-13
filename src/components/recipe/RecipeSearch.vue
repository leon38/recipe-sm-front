<script setup lang="ts">
import { Search, SlidersHorizontal } from 'lucide-vue-next'
const query = defineModel<string>({ default: '' })
</script>
<template>
  <label class="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-line bg-surface px-4 py-3.5 transition focus-within:border-olive focus-within:ring-2 focus-within:ring-olive/10 sm:px-5">
    <Search :size="18" class="shrink-0 text-olive" aria-hidden="true" />
    <span class="sr-only">Rechercher une recette ou un ingrédient</span>
    <input v-model="query" type="search" placeholder="Une recette, un ingrédient…" class="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/80" />
    <SlidersHorizontal :size="16" class="hidden text-muted sm:block" aria-hidden="true" />
  </label>
</template>
