import { onMounted, ref } from 'vue'
import { recipeApi } from '../api/recipe.api'
import type { Recipe } from '../domain/recipe/Recipe'

export function useRecipe(id: string) {
  const data = ref<Recipe | null>(null)
  const isLoading = ref(true)
  const isError = ref(false)
  const error = ref<unknown>(null)

  const fetchRecipe = async () => {
    isLoading.value = true
    isError.value = false
    error.value = null

    try {
      const response = await recipeApi.get(id)
      data.value = response.data
    } catch (err) {
      isError.value = true
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchRecipe)

  return { data, isLoading, isError, error, refetch: fetchRecipe }
}