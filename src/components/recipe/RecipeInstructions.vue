<script setup lang="ts">
import { type Recipe } from '../../domain/recipe/Recipe';
const props = defineProps<{
  recipe: Recipe
}>()

const recipe = props.recipe
</script>
<template>
    <h3 class="text-2xl font-display text-olive">Instructions</h3>
    <ol>
        <li v-for="(step, idx) in recipe.steps" :key="idx" class="flex gap-8 border-b border-line py-8 items-center last:border-0">
            <span class="flex shrink-0 w-8 h-8 items-center justify-center border border-ink rounded-full text-ink text-sm font-medium ">{{ idx }}</span>
            <p class="block">{{ step.instruction }}</p>
        </li>
    </ol>
</template>