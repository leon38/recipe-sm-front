<script setup lang="ts">
import FlashMessage from '../components/ui/FlashMessage.vue'
import SiteHeader from '../components/ui/SiteHeader.vue';
</script>

<template>
  <div class="min-h-screen bg-paper text-ink">
      <!-- En-tête -->
      <SiteHeader />
      
      <FlashMessage />

      <RouterView />
      <footer class="border-t border-line bg-paper">
        <div class="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <RouterLink to="/" class="font-display text-lg font-semibold tracking-[-.04em]">Les Carnets <span class="text-olive">de Doune</span></RouterLink>
          <p class="text-xs text-muted">De bonnes choses, faites maison et partagées avec cœur.</p>
          <p class="text-xs text-muted">© {{ new Date().getFullYear() }} Les Carnets de Doune</p>
        </div>
      </footer>   
    </div>
    <RouterLink to="/recettes/import" class="fab-import">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span>Importer</span>
    </RouterLink>
</template>