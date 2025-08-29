<script setup>
import SearchForm from '../components/SearchForm.vue'
import AppHeader from '../components/AppHeader.vue'
import MainSection from '../components/MainSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import ConnectionsGraph from '@/components/ConnectionsGraph.vue'
import { useClipsStore } from '../stores/clips'

const clips = useClipsStore()
</script>

<template>
  <div class="flex flex-col w-full h-screen relative">
    <AppHeader>
      <SearchForm />
    </AppHeader>

    <div class="absolute top-0 left-0 w-full h-full -z-10">
      <ConnectionsGraph />
    </div>

    <div v-if="clips.items.length > 0" class="w-full h-full">
      <MainSection />
    </div>
    <div v-else>
      <AboutSection />
    </div>
  </div>
</template>
