<template>
  <div
    class="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
      2xl:grid-cols-3
      gap-8
    "
  >
    <div
      v-for="n in 6"
      :key="n"
      class="
        bg-white
        rounded-[32px]
        overflow-hidden
        animate-pulse
      "
    >
      <div class="h-72 bg-stone-200" />

      <div class="p-6">
        <div class="h-8 bg-stone-200 rounded mb-4" />

        <div class="h-5 bg-stone-200 rounded w-2/3 mb-6" />

        <div class="flex gap-3">
          <div
            v-for="i in 2"
            :key="i"
            class="
              w-14
              h-14
              rounded-2xl
              bg-stone-200
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>