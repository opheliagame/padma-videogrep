import { defineStore } from 'pinia'
import { useClipsStore } from './clips'
import { computed, ref } from 'vue'
import type { Clip } from './padma'

export const useSequenceStore = defineStore('sequencer', () => {
  const clips = useClipsStore()
  const bpm = ref(120)
  const playing = ref(clips.items.length > 0 ? true : false)
  const currentSequence = ref(0)

  const currentClip = ref<Clip | null>(
    clips.items.length > 0 ? clips.items[currentSequence.value] : null
  )

  const currentClipId = computed(() => (currentClip.value != null ? currentClip.value.id : null))
  const currentUrl = computed(() => (currentClip.value != null ? currentClip.value.url : null))
  const currentStartTime = computed(() => (currentClip.value != null ? currentClip.value.ss : null))
  const currentDuration = computed(() =>
    currentClip.value != null ? currentClip.value.duration : null
  )
  const currentEndTime = computed(() =>
    currentClip.value != null ? currentClip.value.ss + currentClip.value.duration : null
  )
  const currentTranscript = computed(() =>
    currentClip.value != null ? currentClip.value.transcript : null
  )

  const nextClip = ref<Clip>(clips.items[(currentSequence.value + 1) % clips.items.length])
  const nextClipUrl = computed(() => (clips.items.length > 0 ? nextClip.value.url : null))
  const nextClipStartTime = computed(() => (clips.items.length > 0 ? nextClip.value.ss : null))

  const playNext = () => {
    // if (playing.value) {
    let nextSequence = (currentSequence.value + 1) % clips.items.length
    setCurrentSequence(nextSequence)
    setCurrentClip(clips.items[nextSequence])
    setPlaying(true)

    let nextToNextSequence = (nextSequence + 1) % clips.items.length
    setNextClip(clips.items[nextToNextSequence])
    // }
  }

  const setNextClip = (clip: Clip) => {
    nextClip.value = clip
  }

  const setCurrentClip = (clip: Clip) => {
    currentClip.value = clip
  }

  const setCurrentSequence = (sequence: number) => {
    currentSequence.value = sequence
  }

  const setPlaying = (isPlaying: boolean) => {
    playing.value = isPlaying
  }

  return {
    bpm,
    playing,
    currentSequence,

    currentClipId,
    currentUrl,

    currentStartTime,
    currentDuration,
    currentEndTime,
    currentTranscript,

    nextClip,
    nextClipUrl,
    nextClipStartTime,

    playNext,
    setCurrentClip,
    setCurrentSequence,
    setPlaying
  }
})

// export const useSequenceStore = defineStore('sequencer', {
//   state: () => ({
//     bpm: 120,
//     playing: false,
//     currentSequence: null,

//   }),

//   actions: {

//     playNext() {
//       const clips = useClipsStore()
//       if(this.playing) {
//         let nextSequence = (this.currentSequence + 1) % clips.items.length;
//         this.setCurrentSequence(nextSequence);
//       }

//     },

//     setCurrentSequence(sequence) {
//       this.currentSequence = sequence;
//     }

//   }
// })
