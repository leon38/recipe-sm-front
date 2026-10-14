<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthPanel from '../components/auth/AuthPanel.vue'

const router = useRouter()
const route = useRoute()

function onAuthenticated(event: Event) {
  const ev = event as CustomEvent<{ token: string }>
  // token already stored by AuthPanel in localStorage
  const redirect = (route.query.redirect as string) || '/'
  const flash = 'Connexion réussie'
  const target = redirect.includes('?') ? `${redirect}&flash=${encodeURIComponent(flash)}` : `${redirect}?flash=${encodeURIComponent(flash)}`
  router.push(target)
}

onMounted(() => {
  window.addEventListener('authenticated', onAuthenticated as EventListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('authenticated', onAuthenticated as EventListener)
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-8">
    <AuthPanel />
  </div>
</template>
