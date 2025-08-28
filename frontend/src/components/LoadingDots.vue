<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  character: {
    type: String
  }
})
const len = ref(0)

watchEffect(() => {
  if (len.value == 3) {
    setTimeout(() => {
      len.value = 0
    }, 500)
  } else if (len.value >= 0) {
    setTimeout(() => {
      len.value = len.value + 1
    }, 500)
  }
})
</script>

<template>
  <span class="header-text">
    <span v-for="l in len">{{ character ?? '.' }}</span>
  </span>
</template>
