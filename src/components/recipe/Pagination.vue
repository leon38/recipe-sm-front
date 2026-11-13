<script setup lang="ts">

const props = defineProps({
    totalPages: { type: Number, required: true },
    currentPage: { type: Number, required: true },
})

const emit = defineEmits<{ 'page-change': [page: number] }>()

</script>
<template>
  <button
    type="button"
    class="rounded-full border border-olive px-4 py-2.5 text-xs font-semibold text-olive cursor-pointer transition hover:border-olive hover:bg-olive hover:text-white"
    :disabled="currentPage <= 1"
    @click="emit('page-change', currentPage - 1)"
  >
    Précédent
  </button>
  <button
    v-for="page in totalPages"
    :key="page"
    type="button"
    class="rounded-full border border-olive px-4.5 py-2.5 text-xs font-semibold text-olive cursor-pointer transition hover:border-olive hover:bg-olive hover:text-white"
    :class="page === currentPage ? 'border-olive text-white bg-olive' : ''"
    @click="emit('page-change', page)"
  >
    {{ page }}
  </button>

  <button
    type="button"
    class="rounded-full border border-olive px-4 py-2.5 text-xs font-semibold text-olive cursor-pointer transition hover:border-olive hover:bg-olive hover:text-white"
    :disabled="currentPage >= totalPages"
    @click="emit('page-change', currentPage + 1)"
  >
    Suivant
  </button>
</template>