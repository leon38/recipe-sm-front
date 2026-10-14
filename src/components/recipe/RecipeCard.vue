<script setup lang="ts">
import type { Recipe } from '../../domain/recipe/Recipe'

const props = defineProps<{
  recipe: Recipe
}>()
</script>

<template>
  <RouterLink :to="`/recipes/${props.recipe.id}`" class="recipe-card">
    <div class="card-img-wrapper">
      <span class="card-category">{{ props.recipe.categories[0]?.name }}</span>
      <img
        v-if="props.recipe.imageUrl"
        :src="props.recipe.imageUrl"
        :alt="props.recipe.title"
        class="h-full w-full object-cover"
      />
      <div v-else class="flex h-full items-center justify-center text-5xl text-stone-400">
        🍽️
      </div>
    </div>
    <div class="card-body">
 
      <h2 class="card-title">{{ props.recipe.title }}</h2>
      <p v-if="props.recipe.description" class="card-excerpt line-clamp-2">
        {{ props.recipe.description }}
      </p>
      <div class="card-meta">
          <span>Prep: {{ props.recipe.prepTime }} min.</span>
          <span>Cuisson: {{props.recipe.cookTime }} min.</span>
      </div>  
    </div>
  </RouterLink>
</template>
