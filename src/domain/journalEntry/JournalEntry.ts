export interface JournalEntry {
    id: number
    title: string
    plannedAt: string
    mealType: MealType,
    photoPath?: string,
    notes?: string
}

  export type NewJournalEntry = Omit<JournalEntry, 'id'>

export interface SearchJournalEntry {
    start?: string
    end?: string
}

export const MEAL_TYPE = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
  OTHER: 'other',
} as const

export type MealType = typeof MEAL_TYPE[keyof typeof MEAL_TYPE]