import { computed, onMounted, ref } from 'vue'
import { recipeApi } from '../api/recipe.api'
import type { Error } from '../domain/common/Error'
import type { PaginatedResponse } from '../domain/recipe/PaginatedResponse'
import type { Recipe } from '../domain/recipe/Recipe'
import type { SearchRecipes } from '../domain/common/SearchRecipes'

export function useRecipes() {
  const data = ref<PaginatedResponse<Recipe> | null>(null)
  const currentPage = ref(1)
  const perPage = ref(6)
  const STORAGE_KEY = 'recipes.lastPage'
  const search = ref<Partial<SearchRecipes>>({
    search: null,
    ingredients: [],
    categories: [],
    difficulty: '',
    season: '',
    maxPrepTime: 0,
  })
  const isLoading = ref(true)
  const isError = ref(false)
  const error = ref<Error | null>(null)

  const recipes = computed<Recipe[]>(() => data.value?.items ?? [])
  const pagination = computed(() => data.value?.pagination ?? null)
  const totalPages = computed(() => {
    const total = data.value?.pagination.total ?? 0
    return total > 0 ? Math.ceil(total / (data.value?.pagination.perPage ?? perPage.value)) : 0
  })
  const hasMultiplePages = computed(() => totalPages.value > 1)

  const fetchRecipes = async (page = currentPage.value, filters: Partial<SearchRecipes> = {}) => {
    isLoading.value = true
    isError.value = false
    error.value = null

    const requestSearch = {
      ...search.value,
      ...filters,
    }

    try {
      const response = await recipeApi.getAll(page, perPage.value, requestSearch)
      data.value = response.data
      currentPage.value = page
      try { localStorage.setItem(STORAGE_KEY, String(page)) } catch (e) { /* ignore */ }
      search.value = requestSearch
    } catch (err: unknown) {
      isError.value = true
      error.value = err as Error
    } finally {
      isLoading.value = false
    }
  }

  const goToPage = async (page: number) => {
    console.log(page)
    if (page < 1 || page > totalPages.value) return
    await fetchRecipes(page)
  }

  const setSearch = (filters: Partial<SearchRecipes>) => {
    search.value = {
      ...search.value,
      ...filters,
    }
  }

  const nextPage = async () => {
    if (currentPage.value < totalPages.value) {
      await goToPage(currentPage.value + 1)
    }
  }

  const prevPage = async () => {
    if (currentPage.value > 1) {
      await goToPage(currentPage.value - 1)
    }
  }

  onMounted(() => {
    let initial = 1
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const n = parseInt(saved, 10)
        if (!Number.isNaN(n) && n > 0) initial = n
      }
    } catch (e) {
      // ignore localStorage errors
    }
    void fetchRecipes(initial)
  })

  return {
    data,
    recipes,
    pagination,
    currentPage,
    totalPages,
    hasMultiplePages,
    isLoading,
    isError,
    error,
    search,
    refetch: fetchRecipes,
    goToPage,
    nextPage,
    prevPage,
    setSearch,
  }
}