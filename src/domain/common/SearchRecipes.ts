import { Category } from "../recipe/Category"
import { RecipeIngredient } from "../recipe/RecipeIngredient"

export interface SearchRecipes {
    search: string | null,
    ingredients: RecipeIngredient[],
    categories: Category[],
    difficulty: string,
    season: string,
    maxPrepTime: number,
}