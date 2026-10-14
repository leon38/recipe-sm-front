import { apiClient } from './client'
import type { Recipe } from '../domain/recipe/Recipe'
import type { Category } from '../domain/recipe/Category'
import type { PaginatedResponse } from '../domain/recipe/PaginatedResponse'
import type { SearchRecipes } from '../domain/common/SearchRecipes'

function normalizeSearchParams(search: Partial<SearchRecipes>) {
  return {
    search: search.search ?? undefined,
    ingredients: search.ingredients?.map(ingredient => ingredient.name).filter(Boolean) ?? undefined,
    categories: search.categories?.map(category => category.id).filter(Boolean) ?? undefined,
    difficulty: search.difficulty || undefined,
    season: search.season || undefined,
    maxPrepTime: search.maxPrepTime && search.maxPrepTime > 0 ? search.maxPrepTime : undefined,
  }
}

export const recipeApi = {

  getAll(page = 1, perPage = 3, search: Partial<SearchRecipes> = {}) {
    return apiClient.get<PaginatedResponse<Recipe>>('recipe/', {
        params: {
            page,
            perPage,
            ...normalizeSearchParams(search),
        },
    });
  },

  get(id: string) {

    return apiClient.get<Recipe>(
      `recipe/${id}`
    )
  },

  getCategories() {
    return apiClient.get<Category[]>('category')
  },

  import(url: string, token?: string) {

    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined

    return apiClient.post(
      'recipe/import',
      { url },
      config,
    )
  },

  create(recipe: Recipe) {

    return apiClient.post<Recipe>(
      'recipe',
      recipe
    )
  },

  update(recipe: Recipe) {

    return apiClient.put<Recipe>(
      'recipe',
      recipe
    )
  },

  delete(id: string) {

    return apiClient.delete(
      `/recipes/${id}`
    )
  },
}