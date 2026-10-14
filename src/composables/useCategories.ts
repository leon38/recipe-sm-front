import { onMounted, ref } from 'vue'
import { recipeApi } from '../api/recipe.api'
import type { Category } from '../domain/recipe/Category'

export function useCategories() {
  const data = ref<Category[]>([])
  const isLoading = ref(true)
  const isError = ref(false)
  const error = ref<unknown>(null)

  const fetchCategories = async () => {
    isLoading.value = true
    isError.value = false
    error.value = null

    try {
      const response = await recipeApi.getCategories()
      data.value = response.data
    } catch (err) {
      isError.value = true
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchCategories)

  return { data, isLoading, isError, error, refetch: fetchCategories }
}
