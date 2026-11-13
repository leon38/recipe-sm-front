<script setup lang="ts">
import type { Recipe } from '../../domain/recipe/Recipe'
import { ref } from 'vue'
import { Clock3, Heart, CookingPot } from '@lucide/vue'
import RecipeBadge from './RecipeBadge.vue'

defineProps({ recipe: { type: Object, required: true } })


const saved = ref(false)
const emit = defineEmits(['select'])
const duration = (minutes: number) => minutes === 0 ? '—' : minutes >= 60 ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60}` : ''}` : `${minutes} min`
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
</script>
<template>
  <RouterLink :to="`/recettes/${recipe.id}`" class="recipe-card">
    <article class="recipe-card group overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div class="relative aspect-4/3 overflow-hidden bg-sand/40">
        <img :src="`${apiBaseUrl}${recipe.imageUrl}`" :alt="recipe.title" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div class="absolute left-3 top-3"><RecipeBadge :label="recipe.categories[0]?.name" /></div>
        <button type="button" class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-olive shadow-sm backdrop-blur transition hover:scale-105 hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive" :aria-label="saved ? 'Retirer des favoris' : 'Ajouter aux favoris'" :aria-pressed="saved" @click="saved = !saved"><Heart :size="17" :fill="saved ? 'currentColor' : 'none'" :class="saved ? 'text-terracotta' : ''"/></button>
      </div>
      <div class="p-5 sm:p-6">
        <p class="mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-terracotta">{{ recipe.season }}</p>
        <button type="button" class="text-left" @click="emit('select', recipe)"><h3 class="font-display text-xl font-semibold leading-snug tracking-[-.025em] text-ink transition group-hover:text-olive">{{ recipe.title }}</h3></button>
        <p class="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-muted">{{ recipe.description }}</p>
        <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-[10px] font-bold uppercase tracking-[.07em] text-olive">
          <span class="inline-flex items-center gap-1.5"><Clock3 :size="14"/> Prépa. {{ duration(recipe.prepTime) }}</span>
          <span v-if="recipe.cookTime" class="inline-flex items-center gap-1.5"><CookingPot :size="14"/> Cuisson {{ duration(recipe.cookTime) }}</span>
        </div>
      </div>
    </article>
  </RouterLink>
</template>
