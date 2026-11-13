<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, BookOpen } from 'lucide-vue-next'
const open = ref<boolean>(false)
interface NavigationLink { label: string; href: string }
const links: NavigationLink[] = [{ label: 'Les recettes', href: '/recettes' }, { label: 'Les saisons', href: '/seasons' }, { label: 'Les catégories', href: '#categories' }, { label: 'Mon journal', href: '/journal' }]
</script>
<template>
  <header class="relative">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
      <RouterLink to="/" class="group flex items-center gap-3" aria-label="Les Carnets de Doune, accueil">
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-olive text-paper"><BookOpen :size="19" stroke-width="1.7" /></span>
        <span class="font-display text-lg font-semibold leading-tight tracking-[-.04em] text-ink sm:text-xl">Les Carnets <span class="text-olive">de Doune</span></span>
      </RouterLink>
      <nav class="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
        <RouterLink v-for="(link, i) in links" :key="link.label" :to="link.href" class="nav-link" :class="i === 0 ? 'active' : ''">{{ link.label }}</RouterLink>
      </nav>
      <RouterLink to="/favoris" class="hidden items-center gap-2 rounded-full border border-line px-4 py-2.5 text-xs font-semibold text-olive transition hover:border-olive hover:bg-white sm:inline-flex"><BookOpen :size="14" />Mes favoris</RouterLink>
      <button class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden" :aria-label="open ? 'Fermer le menu' : 'Ouvrir le menu'" :aria-expanded="open" @click="open = !open"><X v-if="open" :size="20"/><Menu v-else :size="20"/></button>
    </div>
    <nav v-if="open" class="grid gap-1 border-t border-line px-5 py-3 lg:hidden" aria-label="Navigation mobile"><a v-for="link in links" :key="link.label" :href="link.href" class="rounded-xl px-3 py-3 text-sm text-ink hover:bg-sage" @click="open = false">{{ link.label }}</a></nav>
  </header>
</template>
