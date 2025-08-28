<script setup>
import DynamicVideo from '@/components/DynamicVideo.vue'
import Timeline from '@/components/Timeline.vue'
</script>

<template>
  <div class="h-full w-full flex flex-col justify-center">
    <div class="h-1/2">
      <DynamicVideo />
    </div>

    <div class="h-1/2">
      <Timeline />
    </div>
  </div>
</template>
