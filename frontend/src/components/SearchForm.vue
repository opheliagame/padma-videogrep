<script setup>
import { ref } from 'vue'
import LoadingDots from './LoadingDots.vue'
import { useQueryStore } from '../stores/query'
import { useClipsStore } from '../stores/clips'

const query = useQueryStore()
const clips = useClipsStore()

const error = ref(false)
const isClicked = ref(false)
const isFinished = ref(false)

const onInput = (e) => {
  error.value = false
  query.setQueryTranscripts(e.target.value)
}

const onClick = async (e) => {
  e.preventDefault()

  error.value = false
  isClicked.value = true
  isFinished.value = false

  console.log('search form: on click method called')
  console.log(query.queryTranscripts, query.range, query.duration)

  await clips.findClips()

  if (clips.items.length == 0) {
    error.value = true
    isFinished.value = true
  } else {
    // reset form params
    console.log('resetting params')
    isClicked.value = false
    isFinished.value = true
  }
}
</script>

<template>
  <form
    @submit="onClick"
    class="w-full flex md:flex-row flex-col gap-2 header-text dark:inputDarkModeOverride"
  >
    <div class="flex md:block justify-between gap-2">
      <input
        type="text"
        name="query"
        id="input-query"
        :value="query.queryTranscripts"
        placeholder="What are you thinking about"
        @input="onInput($event)"
        class="dark:text-slate-400 dark:inputDarkModeOverride rounded-full px-2 py-1 flex-1 lg:min-w-96"
      />

      <div class="md:hidden">
        <button class="header-button" @click="onClick">search</button>
      </div>
    </div>

    <div class="hidden md:block">
      <button class="header-button" @click="onClick">search</button>
    </div>
  </form>

  <div v-if="isClicked && !isFinished" class="header-text">
    <p>
      You are looking for some
      <span class="green-underline">{{ query.queryTranscripts }}</span> <LoadingDots />
    </p>
  </div>

  <div v-if="isFinished && error" class="py-2 header-text">
    <p>We came up empty. Please try again.</p>
  </div>
</template>
