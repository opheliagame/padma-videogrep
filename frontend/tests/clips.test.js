import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useClipsStore } from '../src/stores/clips'
import { usePadmaRepositoryStore } from '../src/stores/padma'
import { useQueryStore } from '../src/stores/query'

vi.mock('@/video-api', () => ({
  combineCuts: vi.fn()
}))

describe('clips store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('replaces clips with the results of a transcript search', async () => {
    const clips = useClipsStore()
    const query = useQueryStore()
    const padma = usePadmaRepositoryStore()
    const results = [{ id: 'clip-1' }]
    let resolveSearch

    clips.setClips([{ id: 'stale-clip' }])
    query.setQueryTranscripts('water')
    query.setRange(25)
    const search = vi.spyOn(padma, 'searchClipsByTranscript').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSearch = resolve
        })
    )

    const request = clips.findClips()

    expect(clips.items).toEqual([])
    expect(search).toHaveBeenCalledWith('water', 25)

    resolveSearch(results)
    await request

    expect(clips.items).toEqual(results)
  })
})
