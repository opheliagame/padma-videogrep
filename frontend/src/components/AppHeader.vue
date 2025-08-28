<script setup>
const title = 'Sequince'
</script>

<template>
  <div class="w-full py-2 flex flex-col gap-y-2">
    <div class="overflow-clip">
      <h1 class="font-display text-white text-5xl uppercase font-bold">
        {{ title }}
      </h1>
    </div>

    <slot />
  </div>
</template>
