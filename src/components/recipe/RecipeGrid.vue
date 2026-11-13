<script setup lang="ts">
import type { Recipe } from '../../domain/recipe/Recipe.js';
import RecipeCard from './RecipeCard.vue'
import PaginationComponent from './Pagination.vue'
import type { Pagination } from '../../domain/recipe/PaginatedResponse'

const props = defineProps<{
  recipes: Recipe[]
  pagination: Pagination | null
  currentPage: number
  totalPages: number
  hasMultiplePages: boolean
}>()
const emit = defineEmits(['page-change'])

</script>
<template>
  <div v-if="recipes.length" class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
    <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
  </div>
  <div v-else class="rounded-3xl border border-dashed border-line bg-white/50 px-6 py-16 text-center"><p class="font-display text-2xl text-ink">Aucune recette trouvée</p><p class="mt-2 text-sm text-muted">Essaie un autre ingrédient ou une autre catégorie.</p></div>
  <div v-if="hasMultiplePages" class="mt-6 flex flex-wrap items-center justify-center gap-2">
    <PaginationComponent :total-pages="totalPages" :current-page="currentPage" @page-change="$emit('page-change', $event)" />  
  </div>
</template>
