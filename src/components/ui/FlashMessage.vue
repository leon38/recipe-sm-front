<template>
  <transition name="fade">
    <div v-if="visible" class="flash fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const message = ref('')
const visible = ref(false)
let timeoutId: number | undefined

function clearFlashFromUrl() {
  const q = { ...route.query } as Record<string, any>
  if (q.flash) {
    delete q.flash
    router.replace({ path: route.path, query: q }).catch(() => {})
  }
}

watch(
  () => route.query.flash,
  (val) => {
    if (val) {
      message.value = String(val)
      visible.value = true
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        visible.value = false
        clearFlashFromUrl()
      }, 3500)
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (route.query.flash) {
    // trigger watch
  }
})
</script>

<style scoped>
.flash { z-index: 60; }
.fade-enter-active, .fade-leave-active { transition: opacity .25s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
