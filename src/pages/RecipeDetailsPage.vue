<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRecipe } from '../composables/useRecipe'
import type { Recipe } from '../domain/recipe/Recipe'
import RecipeHead from '../components/recipe/RecipeHead.vue'
import RecipeIngredients from '../components/recipe/RecipeIngredients.vue'
import RecipeInstructions from '../components/recipe/RecipeInstructions.vue'
import RecipeEditable from '../components/recipe/RecipeEditable.vue'

const props = defineProps<{
  id: string
}>()

const { data, isLoading, isError, error } = useRecipe(props.id)

const recipe = computed(() => data.value)
const editableRecipe = ref<Recipe | null>(null)
const isEditing = ref(false)
const saveMessage = ref('')

function cloneRecipe(recipe: Recipe | null): Recipe | null {
  if (!recipe) return null

  return {
    ...recipe,
    tags: [...(recipe.tags ?? [])],
    categories: [...(recipe.categories ?? [])],
    ingredients: [...(recipe.ingredients ?? [])],
    steps: [...(recipe.steps ?? [])],
  }
}

function startEditing() {
  editableRecipe.value = cloneRecipe(recipe.value)
  isEditing.value = true
  saveMessage.value = ''
}

function handleRecipeUpdated(updatedRecipe: Recipe) {
  data.value = updatedRecipe
  editableRecipe.value = null
  isEditing.value = false
}

function cancelEditing() {
  editableRecipe.value = cloneRecipe(recipe.value)
  isEditing.value = false
  saveMessage.value = ''
}


</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-8">
    <div v-if="isLoading" class="rounded-lg border border-stone-200 bg-white p-8 text-stone-600">Chargement de la recette...</div>

    <div v-else-if="isError" class="rounded-lg border border-red-200 bg-red-50 p-8 text-red-700">Impossible de charger cette recette.
      <span v-if="error" class="ml-2">{{ error instanceof Error ? error.message : String(error) }}</span>
    </div>
    <div v-if="editableRecipe !== null">
      <RecipeEditable :recipe="editableRecipe" @updated="handleRecipeUpdated" />
    </div>

    <div v-else-if="recipe" class="recipe-layout">
      <RecipeHead :recipe="recipe" @editing="startEditing" />
      <div class="flex flex-wrap md:grid md:grid-cols-3 gap-12 items-start">
        <div class="w-full">
          <RecipeIngredients :recipe="recipe" />
        </div>
        <div class="col-span-2">
          <RecipeInstructions :recipe="recipe" />
        </div>
      </div>
    </div>
  </div>
</template>
