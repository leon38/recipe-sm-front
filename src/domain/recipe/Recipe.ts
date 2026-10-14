import { RecipeIngredient } from './RecipeIngredient';
import { RecipeStep } from './RecipeStep';
import { Tag } from './Tag';
import { Category } from './Category';

export interface Recipe {
  id: string
  title: string
  description: string | null
  prepTime: number | null
  cookTime: number | null
  totalTime: number | null
  difficulty: string | null
  servings: number | null
  season: string | null
  imageUrl: string
  sourceUrl: string
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  tags: Tag[]
  categories: Category[]
}