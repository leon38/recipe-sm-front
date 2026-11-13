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

export const SAISONS = {
  PRINTEMPS: 'Printemps',
  ETE: 'Été',
  AUTOMNE: 'Automne',
  HIVER: 'Hiver',
  TOUTES: 'toutes saisons',
} as const

// Ce type vaudra exactement : 'Printemps' | 'Été' | 'Automne' | 'Hiver'
export type Saison = typeof SAISONS[keyof typeof SAISONS]