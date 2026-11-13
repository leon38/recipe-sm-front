<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRecipes } from '../composables/useRecipes'
import { useCategories } from '../composables/useCategories'

import RecipeGrid from '../components/recipe/RecipeGrid.vue'
import RecipeGridSkeleton from '../components/recipe/RecipeGridSkeleton.vue'

const { recipes, isLoading, pagination, currentPage, totalPages, hasMultiplePages, goToPage, refetch } = useRecipes()
const { data: availableCategories } = useCategories()

import { computed, ref } from 'vue'
import { ArrowDownRight, ArrowRight, Leaf, Sparkles } from 'lucide-vue-next'
import AppButton from '../components/ui/AppButton.vue'
import RecipeSearch from '../components/recipe/RecipeSearch.vue'
import CategoryFilters from '../components/ui/CategoryFilters.vue'

const query = ref<string>('')
const category = ref<string>('Toutes')
const categories = computed(() => ['Toutes', ...availableCategories.value.map(item => item.name)])
const filteredRecipes = computed(() => recipes.value.filter(recipe => {
  const matchesCategory = category.value === 'Toutes' || recipe.categories[0]?.name === category.value
  const haystack = `${recipe.title} ${recipe.description ?? ''} ${recipe.categories.map(item => item.name).join(' ')} ${recipe.season ?? ''}`.toLocaleLowerCase('fr')
  return matchesCategory && haystack.includes(query.value.trim().toLocaleLowerCase('fr'))
}))

const filterRecipes = (categoryValue: string) => {
  category.value = categoryValue
  const selectedCategory = availableCategories.value.find(item => item.name === categoryValue)
  void refetch(1, { categories: selectedCategory ? [selectedCategory] : [] })
}

</script>

<template>
  <main>
    <section id="accueil" class="relative overflow-hidden">
      <div class="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-sage/60 blur-3xl"></div>
      <div class="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[.82fr_1.18fr] lg:gap-14 lg:px-12 lg:pb-24 lg:pt-20">
        <div class="relative z-10">
          <div class="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-terracotta"><Leaf :size="15"/> Cuisine en famille, au fil des saisons</div>
          <h1 class="max-w-xl font-display text-5xl font-medium leading-[1.08] tracking-[-.055em] text-ink sm:text-6xl xl:text-7xl">La cuisine du quotidien, <span class="italic text-olive">avec un peu de soleil en plus.</span></h1>
          <p class="mt-6 max-w-md text-base leading-7 text-muted sm:text-lg sm:leading-8">Des recettes généreuses, des produits de saison et des histoires à partager autour de la table.</p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <RouterLink to="/recettes">
                <AppButton size="lg">Explorer les recettes <ArrowRight :size="16"/></AppButton>
            </RouterLink>
            <RouterLink to="/saisons">
                <AppButton variant="text" size="lg">Au fil des saisons <ArrowDownRight :size="16"/></AppButton>
            </RouterLink>
        </div>
          <div class="mt-10 flex items-center gap-3 border-t border-line pt-5"><span class="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-olive"><Sparkles :size="17"/></span><p class="text-xs leading-5 text-muted"><strong class="block font-semibold text-ink">Des recettes testées et approuvées</strong>Pour les petits et les grands gourmands.</p></div>
        </div>
        <div class="relative mx-auto w-full max-w-2xl lg:ml-auto">
          <div class="absolute -right-3 -top-4 hidden h-24 w-24 z-1 items-center justify-center rounded-full border border-olive bg-olive text-paper text-center font-display text-sm italic leading-tight text-olive shadow-card sm:flex">Fait maison<br/>avec amour</div>
          <div class="relative aspect-5/4 overflow-hidden rounded-2rem bg-sand shadow-lift sm:aspect-[1.18/1]"><img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1500&q=90" alt="Pâtes fraîches aux herbes sur une table ensoleillée" class="h-full w-full object-cover"/><div class="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent"></div><div class="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 sm:bottom-7 sm:left-7 sm:right-7"><div class="text-white"><p class="mb-2 text-[10px] font-bold uppercase tracking-[.18em]">À cuisiner cette semaine</p><p class="font-display text-2xl sm:text-3xl">Les saveurs de l’Italie</p></div><RouterLink to="/recettes" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-olive transition hover:bg-white" aria-label="Découvrir les recettes"><ArrowRight :size="19"/></RouterLink></div></div>
        </div>
      </div>
    </section>

    <section id="recettes" class="border-y border-line py-14 sm:py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div class="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
          <div><p class="eyebrow">Le carnet de recettes</p><h2 class="section-title mt-3">De bonnes choses <span class="italic text-olive">à partager.</span></h2><p class="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">Des idées simples et gourmandes, à piocher selon l’envie du jour.</p></div>
          <p class="text-xs font-semibold text-muted">{{ filteredRecipes.length }} recette{{ filteredRecipes.length > 1 ? 's' : '' }}</p>
        </div>
        <div class="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <RecipeSearch v-model="query"/>
          <CategoryFilters :model-value="category" :categories="categories" @update:model-value="filterRecipes" />
        </div>
        <RecipeGridSkeleton v-if="isLoading" />
        <RecipeGrid
          v-else
          :recipes="filteredRecipes"
          :pagination="pagination"
          :current-page="currentPage"
          :total-pages="totalPages"
          :has-multiple-pages="hasMultiplePages"
          @page-change="goToPage"
        />
        </div>
    </section>

    <section id="saisons" class="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12">
      <div class="relative overflow-hidden rounded-[1.75rem] bg-sage"><img src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=85" alt="Fruits et ingrédients frais de saison" loading="lazy" class="aspect-[5/3] h-full w-full object-cover mix-blend-multiply"/></div>
      <div class="py-2"><p class="eyebrow">Au rythme de la nature</p><h2 class="section-title mt-3">Les saisons donnent <span class="italic text-olive">le ton.</span></h2><p class="mt-4 max-w-lg text-sm leading-7 text-muted sm:text-base">Des produits à leur meilleur, des idées qui suivent le calendrier et le plaisir de cuisiner avec ce que la nature nous offre.</p><RouterLink to="/recettes" class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-olive transition hover:gap-3">Découvrir les recettes de saison <ArrowRight :size="16"/></RouterLink></div>
    </section>

    <section id="histoires" class="bg-sage/65 py-14 sm:py-20"><div class="mx-auto max-w-4xl px-5 text-center sm:px-8"><p class="eyebrow">Plus qu’une recette</p><h2 class="section-title mt-3">Des plats, des souvenirs <span class="italic text-olive">et des histoires.</span></h2><p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">Parce que certaines recettes racontent une famille, une saison ou un moment précieux. Ici, chaque carnet garde une place pour les souvenirs qui se transmettent à table.</p><RouterLink id="journal" to="/journal" class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-olive hover:underline">Entrer dans le journal <ArrowRight :size="16"/></RouterLink></div></section>
  </main>
    
</template>