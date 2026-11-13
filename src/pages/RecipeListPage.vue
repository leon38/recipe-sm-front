<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRecipes } from '../composables/useRecipes'
import { useCategories } from '../composables/useCategories'

import RecipeGrid from '../components/recipe/RecipeGrid.vue'
import RecipeGridSkeleton from '../components/recipe/RecipeGridSkeleton.vue'

const { recipes, isLoading, pagination, currentPage, totalPages, hasMultiplePages, goToPage, refetch } = useRecipes()
const { data: availableCategories } = useCategories()

import RecipeSearch from '../components/recipe/RecipeSearch.vue'
import CategoryFilters from '../components/ui/CategoryFilters.vue'

const query = ref<string>('')
const category = ref<string>('Toutes')
const categories = computed(() => ['Toutes', ...availableCategories.value.map(item => item.name)])
let lastRequestedSearch: string | null = null
const filteredRecipes = computed(() => recipes.value.filter(recipe => {
  const matchesCategory = category.value === 'Toutes' || recipe.categories[0]?.name === category.value
  return matchesCategory
}))

watch(query, (value, _previousValue, onCleanup) => {
  const normalizedQuery = value.trim()
  if (normalizedQuery.length < 3 && lastRequestedSearch === null) return

  const timeout = setTimeout(() => {
    const search = normalizedQuery.length >= 3 ? normalizedQuery : null
    if (search === lastRequestedSearch) return

    lastRequestedSearch = search
    const selectedCategory = availableCategories.value.find(item => item.name === category.value)
    void refetch(1, { search, categories: selectedCategory ? [selectedCategory] : [] })
  }, 300)

  onCleanup(() => clearTimeout(timeout))
})

const filterRecipes = (categoryValue: string) => {
  category.value = categoryValue
  const selectedCategory = availableCategories.value.find(item => item.name === categoryValue)
  const search = query.value.trim().length >= 3 ? query.value.trim() : null
  lastRequestedSearch = search
  void refetch(1, { search, categories: selectedCategory ? [selectedCategory] : [] })
}

</script>

<template>
  <main>
    <section id="recettes" class="border-y border-line py-14 sm:py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div class="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
          <div><p class="eyebrow">Le carnet de recettes</p><h2 class="section-title mt-3">De bonnes choses <span class="italic text-olive">à partager.</span></h2><p class="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">Des idées simples et gourmandes, à piocher selon l’envie du jour.</p></div>
          <p class="text-xs font-semibold text-muted">{{ pagination?.total }} recette{{ pagination?.total ?? 0 > 1 ? 's' : '' }}</p>
        </div>
        <div class="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <RecipeSearch v-model="query"/>
          <CategoryFilters :model-value="category" :categories="categories" @update:model-value="filterRecipes" />
        </div>
        <RecipeGridSkeleton v-if="isLoading" />
        <RecipeGrid
          v-else
          :recipes="filteredRecipes"
          :pagination="pagination"
          :current-page="currentPage"
          :total-pages="totalPages"
          :has-multiple-pages="hasMultiplePages"
          @page-change="goToPage"
        />
        </div>
    </section>
  </main>
</template>