<script setup lang="ts">
import { type Recipe } from '../../domain/recipe/Recipe';
import AppButton from '../ui/AppButton.vue';
const props = defineProps<{
  recipe: Recipe
}>()

const recipe = props.recipe
const currentServings = recipe.servings
</script>
<template>
<div class="rounded-xl bg-line text-ink p-8">
  <h3 class="text-xl font-display text-olive mb-8">Ingrédients</h3>
  <form class="flex flex-wrap md:flex-nowrap justify-between items-center">
    <span class="font-semibold text-sm">Pour</span>
    <div class="flex flex-wrap md:flex-nowrap gap-2 items-center">
        <AppButton variant="outline"> - </AppButton>
        <span class="font-semibold text-sm">{{ currentServings }} pers.</span>
        <AppButton variant="primary"> + </AppButton>
    </div>
  </form>
  <ul>
    <li v-for="ingredient in recipe.ingredients" class="border-b border-ink-200 pb-4 pt-4 text-sm last:border-0">{{ ingredient.quantity }}{{ ingredient.unit }} {{ ingredient.name }}</li>
  </ul>
</div>
<div class="flex gap-2 mt-4">
  <span v-for="tag in recipe.tags" class="border border-line text-ink bg-white rounded-full px-2 py-2 text-sm">{{ tag.name }}</span>
</div>
</template>