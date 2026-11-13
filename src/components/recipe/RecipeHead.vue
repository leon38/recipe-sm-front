<script setup lang="ts">
import { computed } from 'vue';
import { SAISONS, type Recipe } from '../../domain/recipe/Recipe';
import { Sun, Clock, CookingPot, Hourglass, Users, Bookmark, Printer, SquarePen } from '@lucide/vue';
import AppButton from '../ui/AppButton.vue';
const props = defineProps<{
  recipe: Recipe
}>()

const recipe = props.recipe

const duration = (minutes: number) => minutes === 0 ? '—' : minutes >= 60 ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60}` : ''}` : `${minutes} min`
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(${import.meta.env.VITE_API_BASE_URL}${props.recipe.imageUrl})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }
})

const emit = defineEmits(['editing'])

const baseUrl = import.meta.env.VITE_API_BASE_URL;
console.log("Base URL :", baseUrl); // Vérifiez ce que le console.log affiche !


</script>
<template>
    <div class="grid gap-y-8 md:grid-cols-2 md:gap-12 border-b border-line pb-8 mb-12">
        
        <div class="informations order-2 md:order-1">
            <div class="flex justify-between">
                <div>
                    <span v-for= "category in recipe.categories" class="rounded-full border-terracotta bg-terracotta text-white px-4.5 py-2.5 text-xs font-semibold">{{ category.name }}</span>
                </div>
                <AppButton variant="outline" size="sm" @click="emit('editing')">
                    <SquarePen size="16" /> Editer
                </AppButton>
            </div>
            <h1 class="text-5xl text-olive mt-4 font-display">{{ recipe.title }}</h1>
            <p class="my-12">{{ recipe.description }}</p>
            <div class="flex flex-row flex-wrap items-center gap-2">
                <span><Sun class="text-terracotta"></Sun></span><span>Saison</span><span v-for="season in SAISONS" class="rounded-full border border-olive px-4.5 py-2.5 text-xs font-semibold" :class="season === recipe.season ? 'bg-olive text-olive-200' : 'text-olive'">{{ season }}</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 my-4">
                <div class="rounded-xl bg-line text-ink p-4 flex items-center gap-3 md:block">
                    <Clock class="text-terracotta mb-0 md:mb-4 shrink-0" :size="22" />
                    <span class="text-xs text-ink md:block">Préparation</span>
                    <span class="ml-auto text-sm font-semibold md:ml-0 md:block">{{ duration(recipe.prepTime ?? 0) }}</span>
                </div>
                <div class="rounded-xl bg-line text-ink p-4 flex items-center gap-3 md:block">
                    <CookingPot class="text-terracotta mb-0 md:mb-4 shrink-0" :size="22" />
                    <span class="text-xs text-ink md:block">Cuisson</span>
                    <span class="ml-auto text-md font-semibold md:ml-0 md:block">{{ duration(recipe.cookTime ?? 0) }}</span>
                </div>
                <div class="rounded-xl bg-line text-ink p-4 flex items-center gap-3 md:block">
                    <Hourglass class="text-terracotta mb-0 md:mb-4 shrink-0" :size="22" />
                    <span class="text-xs text-ink md:block">Durée totale</span>
                    <span class="ml-auto text-md font-semibold md:ml-0 md:block">{{ duration(recipe.totalTime ?? 0) }}</span>
                </div>
                <div class="rounded-xl bg-line text-ink p-4 flex items-center gap-3 md:block">
                    <Users class="text-terracotta mb-0 md:mb-4 shrink-0" :size="22" />
                    <span class="text-xs text-ink md:block">Pour</span>
                    <span class="ml-auto text-md font-bold md:ml-0 md:block">{{ recipe.servings }} pers.</span>
                </div>
            </div>
            <div class="flex flex-column gap-4">
                <AppButton variant="primary">
                    <Bookmark />
                    Enregistrer dans mon journal
                </AppButton>
                <AppButton variant="outline">
                    <Printer class="text-olive" />
                    Imprimer
                </AppButton>
            </div>
        </div>
        <div class="order-1 md:order-2 image rounded-xl min-h-64" :style="backgroundStyle"></div>
    </div>
</template>