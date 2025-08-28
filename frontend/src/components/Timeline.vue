<script setup>
import { useClipsStore } from '@/stores/clips'
import { useSequenceStore } from '@/stores/sequencer'
import { watchEffect } from 'vue'

const sequencer = useSequenceStore()
const clips = useClipsStore()

watchEffect(() => {
  console.log('inside timeline')
  // console.log(currentClipId)
  // if (currentClipId == null) {
  //   return
  // }

  // const currentClipDivId = `timeline-clip-${currentClipId}`

  // const currentDiv = document.getElementById(currentClipDivId)
  // if (currentDiv == null) {
  //   return
  // }

  // const x = currentDiv.offsetLeft + currentDiv.offsetWidth / 2

  // console.log(`scrolling to ${currentClipDivId} ${x}`)
  // scrollTo(x)
})
</script>

<template>
  <div class="w-full h-24 overflow-scroll flex flex-row flex-nowrap gap-x-2">
    <!-- <p>{{ clip.title }}</p> -->

    <!-- <img :src="clip.posterUrl" class="object-cover h-full w-full" alt="" /> -->
    <img
      v-for="clip in clips.items"
      :id="`timeline-clip-${clip.id}`"
      class="border h-full flex-1 object-cover"
      :class="[sequencer.currentClipId == clip.id ? ' border-red-500 ' : ' border-white ']"
      :src="clip.posterUrl"
      alt=""
    />

    <!-- <div v-for="clip in clips" class="border border-white h-full flex-1">

      <img :src="clip.posterUrl" class="object-cover h-full w-full" alt="" />
    </div> -->
  </div>
</template>
