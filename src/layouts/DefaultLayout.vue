<script setup lang="ts">
import FlashMessage from '../components/ui/FlashMessage.vue'
</script>

<template>
  <div class="container">
      <!-- En-tête -->
      <header>
          <h1>Les Carnets de Doune</h1>
          <nav>
              <ul>
                  <li><RouterLink to="/" class="active">Les Recettes</RouterLink></li>
                  <li><RouterLink to="/seasons">Les Saisons</RouterLink></li>
                  <li><RouterLink to="/family-stories">Histoires de Famille</RouterLink></li>
                  <li><RouterLink to="/journal">Mon Journal</RouterLink></li>
              </ul>
          </nav>
      </header>
      
      <FlashMessage />

      <RouterView />
    </div>
    <RouterLink to="/recipes/import" class="fab-import">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span>Importer</span>
    </RouterLink>
</template>