<script setup>
import { useSequenceStore } from '../stores/sequencer'
import { watchEffect, onMounted, useTemplateRef } from 'vue'

// const clips = useClipsStore()
const sequencer = useSequenceStore()
let currentVideo = sequencer.currentUrl
let currentTranscript = sequencer.currentTranscript
let isPlaying = sequencer.playing
console.log(isPlaying)
const videoRef = useTemplateRef('video')
const preloadVideoRef = useTemplateRef('preloadVideo')

// if(sequencer.playing) {
//   videoRef.value.play()
// } else {
//   videoRef.value.pause()
// }

function onTimeUpdate(event) {
  // console.log('time update', event)

  if (
    event.target.currentTime >= sequencer.currentEndTime ||
    event.target.currentTime >= event.target.duration
  ) {
    console.log('playing next')
    // sequencer.setPlaying(false)
    sequencer.playNext()
  }
}

watchEffect(() => {
  if (videoRef.value == null) {
    return
  }

  console.log('playing', sequencer.playing)
  console.log('seeking video at ', sequencer.currentStartTime)
  videoRef.value.volume = 0.5
  videoRef.value.currentTime = sequencer.currentStartTime

  preloadVideoRef.value.src = sequencer.nextClipUrl

  if (sequencer.playing == false) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
})

onMounted(() => {
  console.log('mounted')
  console.log(videoRef.value)

  // videoRef.value.play()
})
</script>

<template>
  <div class="w-full h-full p-6 relative">
    <video
      class="w-full h-full overflow-hidden"
      ref="video"
      crossorigin="anonymous"
      v-if="sequencer.currentSequence != null"
      @timeupdate="onTimeUpdate"
    >
      <source :src="currentVideo" type="video/mp4" />
      Your browser does not support the video tag.

      <!-- TODO add transcript -->
      <!-- <track default kind="captions" src="captions.vtt" /> -->
    </video>
    <div class="absolute bottom-0 inset-x-0 w-full h-1/5 p-4 text-amber-300 font-bold text-xl">
      <p>{{ currentTranscript }}</p>
    </div>

    <!-- preload next video -->
    <video
      crossorigin="anonymous"
      ref="preloadVideo"
      class="hidden"
      :src="sequencer.nextClipUrl"
      preload="auto"
    ></video>
  </div>
</template>
