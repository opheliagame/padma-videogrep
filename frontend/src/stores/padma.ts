import { defineStore } from 'pinia'
import { useClipsStore } from '@/stores/clips'
import { useQueryStore } from '@/stores/query'

const PADMA_API_URL = 'https://pad.ma/api'
const PADMA_MEDIA_URL = 'https://media.v2.pad.ma'

interface ClipItem {
  id: string
  title: string
}

export interface Clip {
  id: string
  query: string
  title: string
  transcript: string
  keywords: string[]
  url: string
  ss: number
  duration: number
  totalDuration: number
  posterUrl: string
}

interface LayerItem {
  id: string
  value: string
  duration: number
  in: number
  out: number
}

export const usePadmaRepositoryStore = defineStore('padma', {
  state: () => {
    return {
      apiUrl: PADMA_API_URL,
      mediaUrl: PADMA_MEDIA_URL,
    }
  },

  actions: {
    async searchClipsByTranscript(query: string, duration: number) {
      const items = await this._getItemsByTranscript(query, duration)
      const clips = await Promise.all(items.map((item) => this._getClipById(item.id)))
      console.log('found clips')
      console.log(clips.flat())
      return clips.flat()
    },

    // TODO remove later because not being used
    // async createSupercut() {
    //   const clips = useClipsStore()
    //   console.log(clips)
    //   if (clips.length == 0) return 'No clips to combine'

    //   const url = await combineCuts(clips.items)
    //   return url
    // },

    async _getItemsByTranscript(query: string, duration: number): Promise<ClipItem[]> {
      const queryWithSpaces = ` ${query} `
      const findQueryPostData = {
        action: 'find',
        data: {
          keys: ['id', 'title'],
          query: {
            conditions: [{ key: 'transcripts', operator: '=', value: queryWithSpaces }],
            operator: '&',
          },
          // TODO make range very large and not as an input
          range: [0, 100],
          sort: [{ key: 'title', operator: '+' }],
        },
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(findQueryPostData),
      })

      const result = await response.json()
      if (result.status.code == 200) {
        const items: ClipItem[] = result.data.items
        return items
      } else {
        throw Error('an unexpected error occured')
      }
    },

    async _getClipById(id: string): Promise<Clip[]> {
      const query = useQueryStore()
      const getQueryPostData = {
        action: 'get',
        data: {
          id: id,
          keys: ['id', 'title', 'duration', 'layers', 'streams', 'modified', 'posterFrame'],
        },
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getQueryPostData),
      })

      const result = await response.json()
      if (result.status.code == 200) {
        const id = result.data.id
        const title = result.data.title
        const totalDuration = result.data.duration
        const layers = result.data.layers
        const transcripts: LayerItem[] = layers.transcripts
        const keywords: LayerItem[] = layers.keywords
        const posterFrame: number = Math.trunc(result.data.posterFrame) // remove decimal part
        const modified = result.data.modified

        const items: Clip[] = transcripts
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
              totalDuration: totalDuration,
              posterUrl: `${this.mediaUrl}/${id}/240p${posterFrame}.jpg?${modified}`,
            }
          })

        return items
      } else {
        throw Error('an unexpected error occured')
      }
    },
  },
})
