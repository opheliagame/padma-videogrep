import { defineStore } from 'pinia'
import { useClipsStore } from './clips'
import { combineCuts } from '@/video-api'
import { useQueryStore } from './query'

const PADMA_API_URL = 'https://pad.ma/api'
const PADMA_MEDIA_URL = 'https://media.v2.pad.ma'

export const usePadmaRepositoryStore = defineStore('padma', {
  state: () => {
    return {
      apiUrl: PADMA_API_URL,
      mediaUrl: PADMA_MEDIA_URL
    }
  },

  actions: {
    async searchClipsByTranscript(query, duration) {
      const items = await this._getItemsByTranscript(query, duration)
      const clips = await Promise.all(items.map((item) => this._getClipById(item.id)))
      console.log('found clips')
      console.log(clips.flat())
      return clips.flat()
    },

    async createSupercut() {
      const clips = useClipsStore()
      console.log(clips)
      if (clips.length == 0) return 'No clips to combine'

      const url = await combineCuts(clips.items)
      return url
    },

    async _getItemsByTranscript(query, duration) {
      const findQueryPostData = {
        action: 'find',
        data: {
          keys: ['id', 'title'],
          query: {
            conditions: [{ key: 'transcripts', operator: '=', value: `${query}` }],
            operator: '&'
          },
          // TODO make range very large and not as an input
          range: [0, 100],
          sort: [{ key: 'title', operator: '+' }]
        }
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(findQueryPostData)
      })

      const result = await response.json()
      if (result.status.code == 200) {
        const items = result.data.items
        return items
      } else {
        throw Error('an unexpected error occured')
      }
    },

    async _getClipById(id) {
      const query = useQueryStore()
      const getQueryPostData = {
        action: 'get',
        data: {
          id: id,
          keys: ['id', 'title', 'duration', 'layers', 'streams', 'modified']
        }
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getQueryPostData)
      })

      const result = await response.json()
      if (result.status.code == 200) {
        const id = result.data.id
        const title = result.data.title
        const totalDuration = result.data.duration
        const layers = result.data.layers
        const transcripts = layers.transcripts
        const keywords = layers.keywords

        const items = transcripts
          .filter((t) => t.value.includes(query.queryTranscripts) && t.duration <= query.duration)
          .map((t) => {
            return {
              id: id,
              query: query.queryTranscripts,
              title: title,
              transcript: t.value,
              keywords: keywords.map((k) => k.value),
              url: `${this.mediaUrl}/${id}/240p1.webm`,
              ss: t.in,
              duration: t.duration,
              totalDuration: totalDuration
            }
          })

        return items
      } else {
        throw Error('an unexpected error occured')
      }
    }
  }
})
