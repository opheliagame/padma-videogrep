<script setup>
import AboutSection from '@/components/AboutSection.vue'
import AppHeader from '@/components/AppHeader.vue'
import ConnectionsGraph from '@/components/ConnectionsGraph.vue'
import MainSection from '@/components/MainSection.vue'
import SearchForm from '@/components/SearchForm.vue'
import Timeline from '@/components/Timeline.vue'
import { useClipsStore } from '@/stores/clips'

const clips = useClipsStore()
</script>

<template>
  <div class="flex flex-col w-full h-screen relative overflow-hidden">
    <AppHeader>
      <SearchForm />
    </AppHeader>

    <!-- <div class="absolute top-0 left-0 w-full h-full -z-10">
      <ConnectionsGraph />
    </div> -->

    <div v-if="clips.items.length > 0" class="w-full h-full">
      <MainSection />
    </div>
    <div v-else>
      <AboutSection />
    </div>
  </div>
</template>
