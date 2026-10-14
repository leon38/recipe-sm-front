import { ref } from 'vue'
import { recipeApi } from '../api/recipe.api'
import type { Recipe } from '../domain/recipe/Recipe'

export function useImportRecipe() {
  const isPending = ref(false)
  const isError = ref(false)
  const error = ref<unknown>(null)
  const data = ref<Recipe | null>(null)

  const mutate = async (url: string, token?: string) => {
    isPending.value = true
    isError.value = false
    error.value = null

    try {
      const response = await recipeApi.import(url, token)
      data.value = response.data as Recipe
    } catch (err) {
      isError.value = true
      error.value = err
    } finally {
      isPending.value = false
    }
  }

  return { mutate, isPending, isError, error, data }
}