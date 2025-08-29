import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQueryStore = defineStore('query', () => {
  const queryTranscripts = ref('love')
  const queryKeywords = ref('')
  const range = ref(10)
  const duration = ref(10)

  function setQueryTranscripts(value) {
    queryTranscripts.value = value
  }
  function setRange(value) {
    range.value = value
  }
  function setDuration(value) {
    duration.value = value
  }
  function reset() {
    queryTranscripts.value = 'love'
    queryKeywords.value = ''
    // TODO make range and duration dynamic
    range.value = 10
    duration.value = 10
  }

  return {
    queryTranscripts,
    queryKeywords,
    range,
    duration,
    setQueryTranscripts,
    setRange,
    setDuration,
    reset
  }
})
