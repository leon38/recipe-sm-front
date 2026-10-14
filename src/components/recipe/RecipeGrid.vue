<script setup lang="ts">
import RecipeCard from './RecipeCard.vue'
import type { Pagination } from '../../domain/recipe/PaginatedResponse'
import type { Recipe } from '../../domain/recipe/Recipe'

const props = defineProps<{
  recipes: Recipe[]
  pagination: Pagination | null
  currentPage: number
  totalPages: number
  hasMultiplePages: boolean
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()
</script>

<template>
  <div v-if="recipes.length" class="space-y-8">
    <div
      class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
    >
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>

    <div v-if="hasMultiplePages" class="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        class="tag"
        :disabled="currentPage <= 1"
        @click="emit('page-change', currentPage - 1)"
      >
        Précédent
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="tag"
        :class="page === currentPage ? 'active' : ''"
        @click="emit('page-change', page)"
      >
        {{ page }}
      </button>

      <button
        type="button"
        class="tag"
        :disabled="currentPage >= totalPages"
        @click="emit('page-change', currentPage + 1)"
      >
        Suivant
      </button>
    </div>
  </div>

  <div
    v-else
    class="flex flex-col items-center justify-center py-24 text-center"
  >
    <div class="mb-8 text-7xl">🍽️</div>

    <h2 class="text-2xl font-semibold text-stone-800">Aucune recette</h2>

    <RouterLink to="/recipes/import" class="mt-3 text-stone-500">
      Importez votre première recette Instagram.
    </RouterLink>
  </div>
</template>