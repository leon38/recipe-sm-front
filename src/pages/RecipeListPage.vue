<script setup lang="ts">
import { ref } from 'vue'
import { useRecipes } from '../composables/useRecipes'
import { useCategories } from '../composables/useCategories'
import type { Category } from '../domain/recipe/Category'
import type { RecipeIngredient } from '../domain/recipe/RecipeIngredient'
import type { SearchRecipes } from '../domain/common/SearchRecipes'

import RecipeGrid from '../components/recipe/RecipeGrid.vue'
import RecipeGridSkeleton from '../components/recipe/RecipeGridSkeleton.vue'

const { recipes, isLoading, pagination, currentPage, totalPages, hasMultiplePages, goToPage, refetch, search, setSearch } = useRecipes()
const categories = useCategories()
const ingredientInput = ref('')
const showAdvancedFilters = ref(false)

function addIngredient() {
  const ingredientName = ingredientInput.value.trim()
  if (!ingredientName) return

  search.value.ingredients = [
    ...(search.value.ingredients ?? []),
    { name: ingredientName, quantity: null, unit: '' } as RecipeIngredient,
  ]
  ingredientInput.value = ''
}

function removeIngredient(index: number) {
  search.value.ingredients = (search.value.ingredients ?? []).filter((_: RecipeIngredient, idx: number) => idx !== index)
}

function isCategorySelected(category: Category) {
  return (search.value.categories ?? []).some((item: Category) => item.id === category.id)
}

function toggleCategory(category: Category) {
  const selectedCategories: Category[] = search.value.categories ?? []
  const hasCategory = selectedCategories.some((item: Category) => item.id === category.id)

  search.value.categories = hasCategory
    ? selectedCategories.filter((item: Category) => item.id !== category.id)
    : [...selectedCategories, category]
}

function applySearch() {
  void refetch(1)
}

function resetSearch() {
  setSearch({
    search: null,
    ingredients: [],
    categories: [],
    difficulty: '',
    season: '',
    maxPrepTime: 0,
  })
  ingredientInput.value = ''
  void refetch(1)
}

function toggleFilters() {
  showAdvancedFilters.value = !showAdvancedFilters.value
}
</script>

<template>
  <section class="filters-section">
      <div class="search-bar">
          <input type="text" placeholder="Rechercher une recette, un ingrédient...">
      </div>
      <div class="category-tags">
          <button class="tag active">Toutes</button>
          <button class="tag">Desserts</button>
          <button class="tag">Plat principal</button>
          <button class="tag">Entrées</button>
      </div>
  </section>
   
    <transition name="fade">
      <div v-if="showAdvancedFilters" class="mt-6 space-y-6">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-stone-700">Difficulté</label>
            <select v-model="search.difficulty" class="w-full rounded-xl border border-stone-300 px-4 py-3">
              <option value="">Toutes</option>
              <option value="facile">Facile</option>
              <option value="moyenne">Moyenne</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-stone-700">Saison</label>
            <select v-model="search.season" class="w-full rounded-xl border border-stone-300 px-4 py-3">
              <option value="">Toutes</option>
              <option value="printemps">Printemps</option>
              <option value="été">Été</option>
              <option value="automne">Automne</option>
              <option value="hiver">Hiver</option>
              <option value="toutes saisons">Toutes saisons</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-stone-700">Max préparation (min)</label>
            <input
              v-model.number="search.maxPrepTime"
              type="number"
              min="0"
              placeholder="Ex. 30"
              class="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-stone-700">Ingrédients</label>
            <div class="flex gap-2">
              <input
                v-model="ingredientInput"
                type="text"
                placeholder="Ajouter un ingrédient"
                class="flex-1 rounded-xl border border-stone-300 px-4 py-3"
                @keyup.enter.prevent="addIngredient"
              />
              <button type="button" class="rounded-xl bg-green-600 px-4 py-3 text-white" @click="addIngredient">Ajouter</button>
            </div>
          </div>
        </div>

        <div v-if="search.ingredients?.length" class="flex flex-wrap gap-2">
          <span
            v-for="(ingredient, index) in search.ingredients"
            :key="index"
            class="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
          >
            {{ ingredient.name }}
            <button type="button" class="text-stone-500 hover:text-stone-700" @click="removeIngredient(index)">✕</button>
          </span>
        </div>

        <div class="space-y-4">
          <div>
            <div class="mb-2 text-sm font-medium text-stone-700">Catégories</div>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <label
                v-for="category in categories.data.value"
                :key="category.id"
                class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-sm"
                :class="isCategorySelected(category) ? 'border-green-600 bg-green-50 text-green-800' : 'border-stone-200 bg-white text-stone-700'"
              >
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-stone-300 text-green-600"
                  :checked="isCategorySelected(category)"
                  @change.prevent="toggleCategory(category)"
                />
                {{ category.name }}
              </label>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button type="button" class="rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white" @click="applySearch">Rechercher</button>
            <button type="button" class="rounded-xl border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700" @click="resetSearch">Réinitialiser</button>
          </div>

          <div v-if="categories.isError.value" class="text-sm text-red-600">Impossible de charger les catégories.</div>
          <div v-else-if="categories.isLoading.value" class="text-sm text-stone-600">Chargement des catégories...</div>
        </div>
      </div>
    </transition>

    <RecipeGridSkeleton v-if="isLoading" />

    <RecipeGrid
      v-else
      :recipes="recipes"
      :pagination="pagination"
      :current-page="currentPage"
      :total-pages="totalPages"
      :has-multiple-pages="hasMultiplePages"
      @page-change="goToPage"
    />
</template>