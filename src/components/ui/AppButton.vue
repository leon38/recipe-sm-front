<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'accent' | 'outline' | 'text'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})
</script>
<template>
  <button :type="type" class="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" :class="[variant === 'primary' ? 'bg-olive text-white hover:bg-olive-dark' : variant === 'accent' ? 'bg-terracotta text-white hover:bg-[#a9432b]' : variant === 'outline' ? 'border border-line bg-surface text-ink hover:border-olive hover:text-olive' : 'text-olive hover:bg-sage', size === 'sm' ? 'px-4 py-2 text-xs' : size === 'lg' ? 'px-6 py-3.5 text-sm' : 'px-5 py-3 text-sm']"><slot /></button>
</template>
