import { defineStore } from 'pinia'
import { useClipsStore } from './clips'
import { computed, ref } from 'vue'

export const useSequenceStore = defineStore('sequencer', () => {
  const clips = useClipsStore()
  const bpm = ref(120)
  const playing = ref(clips.items.length > 0 ? true : false)
  const currentSequence = ref(clips.items.length > 0 ? 0 : null)

  const currentClip = ref(clips.items.length > 0 ? clips.items[currentSequence.value] : null)

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

  const nextClip = ref(
    clips.items.length > 0 ? clips.items[(currentSequence.value + 1) % clips.items.length] : null
  )
  const nextClipUrl = computed(() => (clips.items.length > 0 ? nextClip.value.url : null))
  const nextClipStartTime = computed(() => (clips.items.length > 0 ? nextClip.value.ss : null))

  const playNext = () => {
    if (playing.value) {
      let nextSequence = (currentSequence.value + 1) % clips.items.length
      setCurrentSequence(nextSequence)
      setCurrentClip(clips.items[nextSequence])
      setPlaying(true)

      let nextToNextSequence = (nextSequence + 1) % clips.items.length
      setNextClip(clips.items[nextToNextSequence])
    }
  }

  const setNextClip = (clip) => {
    nextClip.value = clip
  }

  const setCurrentClip = (clip) => {
    currentClip.value = clip
  }

  const setCurrentSequence = (sequence) => {
    currentSequence.value = sequence
  }

  const setPlaying = (isPlaying) => {
    playing.value = isPlaying
  }

  return {
    bpm,
    playing,
    currentSequence,
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
