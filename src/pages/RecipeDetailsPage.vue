<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { recipeApi } from '../api/recipe.api'
import { useCategories } from '../composables/useCategories'
import { useRecipe } from '../composables/useRecipe'
import type { Category } from '../domain/recipe/Category'
import type { Recipe } from '../domain/recipe/Recipe'

const props = defineProps<{
  id: string
}>()

const { data, isLoading, isError, error } = useRecipe(props.id)
const categories = useCategories()

const recipe = computed(() => data.value)
const editableRecipe = ref<Recipe | null>(null)
const isEditing = ref(false)
const isSaving = ref(false)
const saveMessage = ref('')
const newTag = ref('')
const imageInput = ref<HTMLInputElement | null>(null)
const isDraggingImage = ref(false)
const uploadedImageName = ref('')

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

watch(() => data.value, (value) => {
  editableRecipe.value = cloneRecipe(value)
}, { immediate: true })

function startEditing() {
  editableRecipe.value = cloneRecipe(recipe.value)
  isEditing.value = true
  saveMessage.value = ''
}

function cancelEditing() {
  editableRecipe.value = cloneRecipe(recipe.value)
  isEditing.value = false
  saveMessage.value = ''
}

function addTag() {
  if (!editableRecipe.value) return

  const trimmed = newTag.value.trim()
  if (!trimmed) return

  editableRecipe.value.tags.push({ name: trimmed })
  newTag.value = ''
}

function removeTag(index: number) {
  editableRecipe.value?.tags.splice(index, 1)
}

function openImagePicker() {
  imageInput.value?.click()
}

function processImageFile(file: File | null | undefined) {
  if (!file || !file.type.startsWith('image/')) return

  uploadedImageName.value = file.name

  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string' && editableRecipe.value) {
      editableRecipe.value.imageUrl = reader.result
    }
  }
  reader.readAsDataURL(file)
}

function handleImageSelection(event: Event) {
  const input = event.target as HTMLInputElement
  processImageFile(input.files?.[0])
  input.value = ''
}

function handleImageDrop(event: DragEvent) {
  isDraggingImage.value = false
  processImageFile(event.dataTransfer?.files?.[0])
}

function toggleCategory(category: Category) {
  if (!editableRecipe.value) return

  const hasCategory = editableRecipe.value.categories.some(item => item.id === category.id)

  if (hasCategory) {
    editableRecipe.value.categories = editableRecipe.value.categories.filter(item => item.id !== category.id)
  } else {
    editableRecipe.value.categories.push(category)
  }
}

async function updateRecipe() {
  if (!editableRecipe.value) return

  isSaving.value = true
  saveMessage.value = ''

  try {
    const payload: Recipe = {
      ...editableRecipe.value,
      id: editableRecipe.value.id || props.id,
      ingredients: editableRecipe.value.ingredients.map(ingredient => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
      steps: editableRecipe.value.steps.map(step => ({
        instruction: step.instruction,
      })),
    }

    await recipeApi.update(payload)
    data.value = payload
    saveMessage.value = 'Recette enregistrée avec succès.'
    isEditing.value = false
  } catch (error) {
    saveMessage.value = 'Une erreur est survenue lors de l’enregistrement.'
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

function formatIngredientName(ingredient: { name: string; quantity: number | null; unit: string | null }) {
  const name = ingredient.name?.trim() ?? ''
  const quantity = ingredient.quantity != null ? `${ingredient.quantity}` : ''
  const unit = ingredient.unit?.trim() ?? ''
  const hasUnit = Boolean(unit)
  const article = hasUnit ? (/^[aeiouàâäéèêëîïôöùûüÿh]/i.test(name) ? "d'" : 'de ') : ''

  const parts = [quantity, unit].filter(Boolean)

  if (!parts.length) {
    return name
  }

  if (!hasUnit) {
    return `${parts.join(' ')} ${name}`
  }

  return `${parts.join(' ')} ${article}${name}`
}

function stepThumbnail(stepIndex: number) {
  return recipe.value?.imageUrl ?? ''
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-8">
    <div v-if="isLoading" class="rounded-lg border border-stone-200 bg-white p-8 text-stone-600">Chargement de la recette...</div>

    <div v-else-if="isError" class="rounded-lg border border-red-200 bg-red-50 p-8 text-red-700">Impossible de charger cette recette.
      <span v-if="error" class="ml-2">{{ error instanceof Error ? error.message : String(error) }}</span>
    </div>

    <div v-else-if="recipe" class="recipe-layout">
      <main class="main-content">

        <div class="recipe-actions-bar">
          <RouterLink to="/"  class="btn-back">
              ← Retour à la liste
          </RouterLink>
          <button v-if="!isEditing" class="btn-edit" @click="startEditing">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Modifier
          </button>
          <template v-else>
            <button type="button" class="btn-edit" @click="cancelEditing">Annuler</button>
            <button type="button" class="btn-edit" :disabled="isSaving" @click="updateRecipe">
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </template>
          <div v-if="saveMessage" class="btn-edit">
            {{ saveMessage }}
          </div>  
        </div>

        <div v-if="isEditing && editableRecipe" class="h-72 p-4">
            <div
              class="flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors"
            :class="isDraggingImage ? 'border-green-500 bg-green-50' : 'border-stone-300 hover:border-green-400'"
            @click="openImagePicker"
            @dragover.prevent="isDraggingImage = true"
            @dragleave.prevent="isDraggingImage = false"
            @drop.prevent="handleImageDrop"
          >
            <input ref="imageInput" type="file" accept="image/*" class="sr-only" @change="handleImageSelection" />

            <div class="flex flex-col items-center justify-center gap-2 text-sm">
              <span class="text-2xl">📷</span>
              <span class="font-medium text-stone-700">Glissez une image ici ou cliquez pour sélectionner</span>
              <span class="text-stone-500">PNG, JPG ou WebP</span>
              <span v-if="uploadedImageName" class="text-green-700">{{ uploadedImageName }}</span>
            </div>
          </div>
        </div>
            

        <img v-else-if="recipe.imageUrl" :src="recipe.imageUrl" :alt="recipe.title" class="recipe-hero-img">
        <div v-else class="h-72 flex items-center justify-center text-6xl text-stone-300">🍽️</div>
        
        <!-- Catégorie en sur-titre -->
        <div v-if="isEditing && editableRecipe">
          <div v-if="categories.isLoading.value" class="text-sm text-stone-600">Chargement...</div>
          <div v-else-if="categories.isError.value" class="text-sm text-red-600">Impossible de charger.</div>
          <div v-else class="flex flex-wrap gap-2">
            <label v-for="category in categories.data.value" :key="category.id" class="flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-sm text-stone-700">
              <input type="checkbox" :checked="editableRecipe.categories.some(item => item.id === category.id)" @change="() => toggleCategory(category)" class="h-4 w-4 rounded border-stone-300 text-green-600" />
              {{ category.name }}
            </label>
          </div>
        </div>   
        <span v-else class="recipe-category" v-for="(category, i) in recipe.categories" :key="i" >{{ category.name }}</span>
        
        <input v-if="isEditing && editableRecipe" v-model="editableRecipe.title" class="w-full rounded-xl border border-stone-300 px-4 py-3 text-2xl font-semibold" />
        <h2 v-else class="recipe-title">{{ recipe.title }}</h2>
        
        <div class="recipe-meta">
          <div class="meta-item">
              <span class="meta-label">Prep</span>
              <span v-if="isEditing && editableRecipe"><input v-model.number="editableRecipe.prepTime" type="number" min="0" class="w-24 rounded-lg border border-stone-300 px-3 py-2 text-right" /></span>
              <span v-else class="meta-value">{{ recipe.prepTime ?? '—' }} min</span>
          </div>
          <div class="meta-item">
              <span class="meta-label">Cuisson</span>
              <span v-if="isEditing && editableRecipe"><input v-model.number="editableRecipe.cookTime" type="number" min="0" class="w-24 rounded-lg border border-stone-300 px-3 py-2 text-right" /></span>
              <span v-else class="meta-value">{{ recipe.cookTime ?? '—' }} min</span>
          </div>
          <div class="meta-item">
              <span class="meta-label">Portions</span>
              <span v-if="isEditing && editableRecipe"><input v-model.number="editableRecipe.servings" type="number" min="1" class="w-24 rounded-lg border border-stone-300 px-3 py-2 text-right" /></span>
              <span v-else class="meta-value">{{ recipe.servings ?? '—' }}</span>
          </div>
          <div class="meta-item">
              <span class="meta-label">Difficulté</span>
              <span v-if="isEditing && editableRecipe"><select v-model="editableRecipe.difficulty" class="rounded-lg border border-stone-300 px-3 py-2"><option value="">Sélectionner une difficulté</option><option value="Facile">Facile</option><option value="Moyen">Moyen</option><option value="Difficile">Difficile</option></select></span>
              <span v-else class="meta-value">{{ recipe.difficulty ?? '—' }}</span>
          </div>
          <div class="meta-item">
              <span class="meta-label">Saison</span>
              <span v-if="isEditing && editableRecipe"><select v-model="editableRecipe.season" class="rounded-lg border border-stone-300 px-3 py-2"><option value="">Sélectionner une saison</option><option value="printemps">Printemps</option><option value="ete">Été</option><option value="automne">Automne</option><option value="hiver">Hiver</option><option value="toutes saisons">Toutes saisons</option></select></span>
              <span v-else class="capitalize meta-value">{{ recipe.season ?? 'toutes saisons' }}</span>
          </div>
        </div>

        <div class="recipe-grid">
            <section class="ingredients">
                <h3>Ingrédients</h3>
                <ul>
                  <li v-for="(ingredient, index) in recipe.ingredients" :key="index" class="flex items-start gap-3">
                  <input type="checkbox"> {{ formatIngredientName(ingredient) }}</li>
                </ul>
            </section>

            <section class="instructions">
                <h3>Étapes</h3>
                <ol>
                  <li v-for="(step, idx) in recipe.steps" :key="idx">{{ step.instruction }}</li>
                </ol>
            </section>
        </div>
        <div class="recipe-tags">
          <span v-for="(tag, i) in recipe.tags" :key="i" class="tag-item">{{ tag.name }}</span>
        </div>
      </main>

        <!--<aside class="sidebar">
            <div class="notes-card">
                <h3>Annotations</h3>
                <p class="handwritten">
                    Testé : <br>
                    + un trait de sirop d'érable avant de servir ? <br><br>
                    Approuvé par Émile !
                </p>
            </div>

            <div class="notes-card">
                <h3>Notes de Maman</h3>
                <p class="handwritten">
                    Utiliser toujours des pommes un peu sûres pour équilibrer le sucre. La recette originale vient de la page 12 du vieux carnet.
                </p>
            </div>
        </aside>-->
    </div>
  </div>
</template>
