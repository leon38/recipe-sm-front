<script setup lang="ts">
import { computed, ref } from 'vue';
import { recipeApi } from '../../api/recipe.api'
import { useRecipe } from '../../composables/useRecipe'
import { useCategories } from '../../composables/useCategories'
import type { Recipe } from '../../domain/recipe/Recipe';
import type { RecipeIngredient } from '../../domain/recipe/RecipeIngredient';
import type { RecipeStep } from '../../domain/recipe/RecipeStep';
import type { Tag } from '../../domain/recipe/Tag';
import { Category } from '../../domain/recipe/Category';
import AppButton from '../ui/AppButton.vue';
const props = defineProps<{
  recipe: Recipe
}>()
const emit = defineEmits<{
  updated: [recipe: Recipe]
}>()

const editableRecipe = props.recipe


const { data, isLoading, isError, error } = useRecipe(props.recipe.id)
const imageInput = ref<HTMLInputElement | null>(null)
const isDraggingImage = ref(false)
const isSaving = ref(false)
const uploadedImageName = ref('')
const newTag = ref('')
const saveMessage = ref('')
const categories = useCategories()

function openImagePicker() {
  imageInput.value?.click()
}

function processImageFile(file: File | null | undefined) {
  if (!file || !file.type.startsWith('image/')) return

  uploadedImageName.value = file.name

  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string' && editableRecipe) {
      editableRecipe.imageUrl = reader.result
    }
  }
  reader.readAsDataURL(file)
}

async function imageUrlToDataUrl(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith('data:')) return imageUrl

  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error('Impossible de charger l’image actuelle.')
  }

  const imageBlob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Impossible de convertir l’image actuelle.'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(imageBlob)
  })
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

  const hasCategory = editableRecipe.categories.some(item => item.id === category.id)

  if (hasCategory) {
    editableRecipe.categories = editableRecipe.categories.filter(item => item.id !== category.id)
  } else {
    editableRecipe.categories.push(category)
  }
}

async function updateRecipe() {

  isSaving.value = true
  saveMessage.value = ''

  try {
    const payload: Recipe = {
      ...editableRecipe,
      id: editableRecipe.id,
      imageUrl: editableRecipe.imageUrl
        ? await imageUrlToDataUrl(editableRecipe.imageUrl)
        : '',
      ingredients: editableRecipe.ingredients.map(ingredient => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
      steps: editableRecipe.steps.map(step => ({
        instruction: step.instruction,
      })),
    }

    await recipeApi.update(payload)
    data.value = payload
    saveMessage.value = 'Recette enregistrée avec succès.'
    emit('updated', payload)
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

function addIngredient() {
  editableRecipe.ingredients.push(createEmptyIngredient())
}

function addStep() {
  editableRecipe.steps.push(createEmptyStep())
}

function createEmptyIngredient(): RecipeIngredient {
  return { name: '', quantity: null, unit: '' }
}

function createEmptyStep(): RecipeStep {
  return { instruction: '' }
}


function createTag(name: string): Tag {
  return { name: name.trim() }
}

function addTag() {
  const trimmedTag = newTag.value.trim()
  if (trimmedTag) {
    editableRecipe.tags.push(createTag(trimmedTag))
    newTag.value = ''
  }
}

function removeTag(index: number) {
  editableRecipe.tags.splice(index, 1)
}

</script>
<template>
    <div v-if="editableRecipe.title || editableRecipe.ingredients.length || editableRecipe.steps.length">
      <div class="rounded-2xl p-4 border border-line bg-surface shadow-card" v-if="editableRecipe.title || editableRecipe.ingredients.length || editableRecipe.steps.length">
        <h2 class="text-3xl font-display">Transmettre une Recette</h2>
        <p>Remplissez la fiche pour immortaliser votre secret de cuisine dans le carnet.</p>
        <div class="form-group form-row">
          <div>
            <label for="title">Titre</label>
            <input name="title" id="title" type="text" v-model="editableRecipe.title" placeholder="ex: Tarte Fine aux Pommes" required />
          </div>
        </div>

        <div class="form-group form-row">
          <div>
            <label for="description">Description</label>
            <textarea name="description" id="description" v-model="editableRecipe.description" rows="4" />
          </div>
        </div>

        <div class="form-group">
          <label>Photo du Plat</label>
          <div v-if="editableRecipe" class="h-72 p-4">
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
            
            <img v-if="editableRecipe.imageUrl" :src="editableRecipe.imageUrl" :alt="editableRecipe.title" class="recipe-hero-img">
            <div v-else class="h-72 flex items-center justify-center text-6xl text-stone-300">🍽️</div>
        </div>

      <div class="form-row form-group">
        <div>
          <label>Difficulté</label>
          <select v-model="editableRecipe.difficulty">
            <option value="">Sélectionner une difficulté</option>
            <option value="Facile">Facile</option>
            <option value="Moyen">Moyen</option>
            <option value="Difficile">Difficile</option>
          </select>
        </div>

        <div>
          <label>Saison</label>
          <select v-model="editableRecipe.season">
            <option value="">Sélectionner une saison</option>
            <option value="printemps">Printemps</option>
            <option value="été">Été</option>
            <option value="automne">Automne</option>
            <option value="hiver">Hiver</option>
            <option value="toutes saisons">Toutes saisons</option>
          </select>
        </div>
      </div>

      <div class="form-row form-group">
        <div>
          <label>Nombre de personnes</label>
          <input v-model.number="editableRecipe.servings" type="number" min="1" />
        </div>

        <div>
          <label>Temps de préparation (min)</label>
          <input v-model.number="editableRecipe.prepTime" type="number" min="0" />
        </div>

        <div>
          <label>Temps de cuisson (min)</label>
          <input v-model.number="editableRecipe.cookTime" type="number" min="0" />
        </div>
      </div>


      <div class="form-header">
        <h2>Ingrédients</h2>
        <AppButton variant="outline" @click="addIngredient">Ajouter</AppButton>
      </div>

      <div class="form-group">
        <div v-for="(ingredient, index) in editableRecipe.ingredients" :key="index" class="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto] form-group form-row">
          <input v-model="ingredient.name" type="text" placeholder="Nom" />
          <input v-model.number="ingredient.quantity" type="number" placeholder="Quantité" />
          <input v-model="ingredient.unit" type="text" placeholder="Unité" />
          <button type="button" class="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600" @click="editableRecipe.ingredients.splice(index, 1)">Retirer</button>
        </div>
      </div>

      <div class="form-header">
        <h2>Étapes</h2>
        <AppButton variant="outline" @click="addStep">Ajouter</AppButton>
      </div>

      <div class="space-y-3">
        <div v-for="(step, index) in editableRecipe.steps" :key="index" class="form-group">
          <textarea v-model="step.instruction" rows="3" :placeholder="`Étape ${index + 1}`" />
          <div class="flex justify-end">
            <button type="button" class="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600" @click="editableRecipe.steps.splice(index, 1)">Retirer</button>
          </div>
        </div>
      </div>

      <div class="form-header">
        <h2>Tags</h2>
      </div>

      <div class="space-y-3">
        <div class="flex gap-2">
          <input v-model="newTag" placeholder="Ajouter un tag" class="flex-1 rounded-xl border border-stone-300 px-4 py-3" @keyup.enter="addTag" />
          <AppButton variant="outline" @click="addTag">Ajouter</AppButton>
        </div>

        <div class="flex flex-wrap gap-2 mt-2 mb-4">
          <span v-for="(tag, index) in editableRecipe.tags" :key="index" class="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 text-xs bg-terracotta text-white hover:bg-[#a9432b]">
            {{ tag.name }}
            <button type="button" class="text-white hover:text-white" @click="removeTag(index)">✕</button>
          </span>
        </div>
      </div>
      
      <div class="form-header">
        <h2>Catégories</h2>
      </div>

      <div v-if="categories.isLoading.value" class="text-sm text-stone-600">Chargement des catégories...</div>

      <div v-else-if="categories.isError.value" class="text-sm text-red-600">Impossible de charger les catégories.</div>

      <div class="category-grid">
        <label class="category-card" v-for="category in categories.data.value" :key="category.id">
            <input
              type="checkbox"
              :checked="editableRecipe.categories.some(item => item.id === category.id)"
              @change="(e) => {
                if ((e.target as HTMLInputElement).checked) {
                  editableRecipe.categories.push(category)
                } else {
                  editableRecipe.categories = editableRecipe.categories.filter(item => item.id !== category.id)
                }
              }"
            />
            <span class="category-label">{{ category.name }}</span>
          </label>
        </div>
        <div class="flex items-center gap-3 mt-3">
          <AppButton type="button" variant="primary" size="lg" @click="updateRecipe">Mettre à jour la recette</AppButton>
          <span v-if="saveMessage" class="text-sm text-stone-600">{{ saveMessage }}</span>
        </div>
      </div>
    </div>
</template>