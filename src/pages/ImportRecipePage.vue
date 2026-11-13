<script setup lang="ts">
import { ref } from 'vue'
import { recipeApi } from '../api/recipe.api'
import { useImportRecipe } from '../composables/useImportRecipe'
import { useCategories } from '../composables/useCategories'
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import type { Recipe } from '../domain/recipe/Recipe'
import type { RecipeIngredient } from '../domain/recipe/RecipeIngredient'
import type { RecipeStep } from '../domain/recipe/RecipeStep'
import type { Tag } from '../domain/recipe/Tag'
import { Download } from '@lucide/vue'
import AppButton from '../components/ui/AppButton.vue'

const url = ref('')
const previewRecipe = ref<Recipe>(createEmptyRecipe())
const newTag = ref('')
const imageInput = ref<HTMLInputElement | null>(null)
const isDraggingImage = ref(false)
const uploadedImageName = ref('')
const mutation = useImportRecipe()
const categories = useCategories()
const saveMessage = ref('')
const authToken = ref<string | null>(localStorage.getItem('token'))
const router = useRouter()

function onAuthenticated(event: Event) {
  // CustomEvent dispatched from AuthPanel
  const ev = event as CustomEvent<{ token: string }>
  authToken.value = ev.detail?.token ?? localStorage.getItem('token')
}

onMounted(() => {
  window.addEventListener('authenticated', onAuthenticated as EventListener)
  if (!authToken.value) {
    // redirect to auth page and ask to come back here after login
    router.push({ path: '/auth', query: { redirect: '/recipes/import' } })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('authenticated', onAuthenticated as EventListener)
})

function createEmptyRecipe(): Recipe {
  return {
    id: '',
    title: '',
    description: '',
    prepTime: null,
    cookTime: null,
    totalTime: null,
    difficulty: null,
    servings: null,
    season: null,
    imageUrl: '',
    sourceUrl: '',
    ingredients: [],
    steps: [],
    tags: [],
    categories: [],
  }
}

function createEmptyIngredient(): RecipeIngredient {
  return { name: '', quantity: null, unit: '' }
}

function createEmptyStep(): RecipeStep {
  return { instruction: '' }
}

function addIngredient() {
  previewRecipe.value.ingredients.push(createEmptyIngredient())
}

function addStep() {
  previewRecipe.value.steps.push(createEmptyStep())
}

function createTag(name: string): Tag {
  return { name: name.trim() }
}

function addTag() {
  const trimmedTag = newTag.value.trim()
  if (trimmedTag) {
    previewRecipe.value.tags.push(createTag(trimmedTag))
    newTag.value = ''
  }
}

function removeTag(index: number) {
  previewRecipe.value.tags.splice(index, 1)
}

function openImagePicker() {
  imageInput.value?.click()
}

function processImageFile(file: File | null | undefined) {
  if (!file || !file.type.startsWith('image/')) {
    return
  }

  uploadedImageName.value = file.name

  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      previewRecipe.value.imageUrl = reader.result
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

async function submit() {
  saveMessage.value = ''
  const token = authToken.value ?? localStorage.getItem('token') ?? undefined
  await mutation.mutate(url.value, token)

  previewRecipe.value = {
    ...createEmptyRecipe(),
    ...mutation.data.value,
    ingredients: (mutation.data.value?.ingredients ?? []).map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity ?? null,
      unit: ingredient.unit ?? '',
    })),
    steps: (mutation.data.value?.steps ?? []).map(step => ({
      ...step,
      instruction: step.instruction ?? '',
    })),
    tags: (mutation.data.value?.tags ?? []).map(tag => {
      if (typeof tag === 'string') {
        return createTag(tag)
      }

      return {
        name: tag.name ?? '',
      }
    }),
    categories: (mutation.data.value?.categories ?? []),
  }
}

async function saveRecipe() {
  saveMessage.value = ''

  try {
    await recipeApi.create(previewRecipe.value)
    saveMessage.value = 'Recette enregistrée avec succès.'
  } catch (error) {
    saveMessage.value = 'Une erreur est survenue lors de l’enregistrement.'
    console.error(error)
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 my-8 sm:px-8 lg:px-12">
    <div class="form-card group overflow-hidden rounded-2xl p-4 border border-line bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <form v-if="authToken" @submit.prevent="submit">
        <div class="flex gap-2">
          <label class="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-line bg-surface px-4 py-3.5 transition focus-within:border-olive focus-within:ring-2 focus-within:ring-olive/10 sm:px-5">
            <Download :size="18" class="shrink-0 text-olive" aria-hidden="true" />
            <span class="sr-only">URL Instagram</span>
            <input v-model="url" type="search" placeholder="https://www.instagram.com/..." class="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/80" />
          </label>
          <AppButton variant="primary" type="submit" :disabled="mutation.isPending.value">
            <span v-if="mutation.isPending.value">Import en cours...</span>
            <span v-else>Importer et prévisualiser</span>
          </AppButton>
        </div>
      </form>
    </div>

    <div v-if="mutation.isError.value" class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
      Impossible d’importer cette recette. Vérifiez l’URL.
    </div>

    <div v-if="previewRecipe.title || previewRecipe.ingredients.length || previewRecipe.steps.length">
      <div class="rounded-2xl p-4 border border-line bg-surface shadow-card" v-if="previewRecipe.title || previewRecipe.ingredients.length || previewRecipe.steps.length">
        <h2 class="text-3xl font-display">Transmettre une Recette</h2>
        <p>Remplissez la fiche pour immortaliser votre secret de cuisine dans le carnet.</p>
        <div class="form-group form-row">
          <div>
            <label for="title">Titre</label>
            <input name="title" id="title" type="text" v-model="previewRecipe.title" placeholder="ex: Tarte Fine aux Pommes" required />
          </div>
        </div>

        <div class="form-group form-row">
          <div>
            <label for="description">Description</label>
            <textarea name="description" id="description" v-model="previewRecipe.description" rows="4" />
          </div>
        </div>

        <div class="form-group">
          <label>Photo du Plat</label>
          <div
            class="file-upload"
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

          <div v-if="previewRecipe.imageUrl" class="mt-3 flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
            <span class="text-sm text-stone-600">Une image est prête à être enregistrée.</span>
            <button type="button" class="text-sm text-red-600" @click.stop="previewRecipe.imageUrl = ''">Retirer</button>
          </div>
        </div>

      <div class="form-row form-group">
        <div>
          <label>Difficulté</label>
          <select v-model="previewRecipe.difficulty">
            <option value="">Sélectionner une difficulté</option>
            <option value="Facile">Facile</option>
            <option value="Moyen">Moyen</option>
            <option value="Difficile">Difficile</option>
          </select>
        </div>

        <div>
          <label>Saison</label>
          <select v-model="previewRecipe.season">
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
          <input v-model.number="previewRecipe.servings" type="number" min="1" />
        </div>

        <div>
          <label>Temps de préparation (min)</label>
          <input v-model.number="previewRecipe.prepTime" type="number" min="0" />
        </div>

        <div>
          <label>Temps de cuisson (min)</label>
          <input v-model.number="previewRecipe.cookTime" type="number" min="0" />
        </div>
      </div>


      <div class="form-header">
        <h2>Ingrédients</h2>
        <AppButton variant="outline" @click="addIngredient">Ajouter</AppButton>
      </div>

      <div class="form-group">
        <div v-for="(ingredient, index) in previewRecipe.ingredients" :key="index" class="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto] form-group form-row">
          <input v-model="ingredient.name" type="text" placeholder="Nom" />
          <input v-model.number="ingredient.quantity" type="number" placeholder="Quantité" />
          <input v-model="ingredient.unit" type="text" placeholder="Unité" />
          <button type="button" class="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600" @click="previewRecipe.ingredients.splice(index, 1)">Retirer</button>
        </div>
      </div>

      <div class="form-header">
        <h2>Étapes</h2>
        <AppButton variant="outline" @click="addStep">Ajouter</AppButton>
      </div>

      <div class="space-y-3">
        <div v-for="(step, index) in previewRecipe.steps" :key="index" class="form-group">
          <textarea v-model="step.instruction" rows="3" :placeholder="`Étape ${index + 1}`" />
          <div class="flex justify-end">
            <button type="button" class="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600" @click="previewRecipe.steps.splice(index, 1)">Retirer</button>
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
          <span v-for="(tag, index) in previewRecipe.tags" :key="index" class="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 text-xs bg-terracotta text-white hover:bg-[#a9432b]">
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
              :checked="previewRecipe.categories.some(item => item.id === category.id)"
              @change="(e) => {
                if ((e.target as HTMLInputElement).checked) {
                  previewRecipe.categories.push(category)
                } else {
                  previewRecipe.categories = previewRecipe.categories.filter(item => item.id !== category.id)
                }
              }"
            />
            <span class="category-label">{{ category.name }}</span>
          </label>
        </div>
        <div class="flex items-center gap-3 mt-3">
          <AppButton type="button" variant="primary" size="lg" @click="saveRecipe">Enregistrer la recette</AppButton>
          <span v-if="saveMessage" class="text-sm text-stone-600">{{ saveMessage }}</span>
        </div>
      </div>

      
    </div>
  </div>
</template>