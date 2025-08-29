import { defineStore } from 'pinia'
import { usePadmaRepositoryStore } from './padma'
import { useQueryStore } from './query'

export const useClipsStore = defineStore('clips', {
  state: () => {
    return {
      items: [],
      connections: {},
      graphData: { nodes: [], links: [] }
    }
  },

  actions: {
    async findClips() {
      console.log('findClips')
      const query = useQueryStore()
      const padma = usePadmaRepositoryStore()
      const clips = await padma.searchClipsByTranscript(query.queryTranscripts, query.range)
      this.addClips(clips)
      this.findConnections(query.queryTranscripts)
      this.getGraphData()
    },

    addClips(clips) {
      this.items = [...this.items, ...clips]
    },

    findConnections(query) {
      const connectedQueries = this.items
        .filter((clip) => clip.query != query && clip.transcript.includes(query))
        .map((c) => c.query)

      this.connections[query] = connectedQueries
    },

    // findConnections(clips) {
    //   const query = clips[0].query

    //   clips.forEach((clip) => {
    //     const clipConnections = this.items.filter(
    //       (c) => c.id != clip.id && c.transcript.includes(clip.query)
    //     )
    //     const connections = clipConnections.map((c) => c.id)

    //     // this.connections[clip.id] = Array.from(new Set(connections))

    //     this.connections[clip.query]
    //   })
    // },

    getGraphData() {
      const queries = Array.from(new Set(this.items.map((clip) => clip.query)))

      const nodes = queries.map((query) => {
        return {
          id: query,
          query: query
        }
      })
      const links = []

      // this.items.forEach((clip) => {
      //   nodes.push({
      //     id: clip.id,
      //     query: clip.query,
      //     title: clip.title,
      //     transcript: clip.transcript
      //   })
      // })

      Object.entries(this.connections).forEach(([key, value]) => {
        value.forEach((v) => {
          links.push({ source: key, target: v })
        })
      })

      this.graphData = { nodes, links }
    }
  }
})
