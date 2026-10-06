import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useClipsStore } from '../src/stores/clips'
import { usePadmaRepositoryStore } from '../src/stores/padma'
import { useQueryStore } from '../src/stores/query'
import { combineCuts } from '../src/video-api'

vi.mock('@/video-api', () => ({
  combineCuts: vi.fn()
}))

const responseWith = (data, code = 200) => ({
  json: async () => ({ status: { code }, data })
})

describe('Padma repository store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('sends the transcript find request using the documented range', async () => {
    const padma = usePadmaRepositoryStore()
    fetch.mockResolvedValue(responseWith({ items: [] }))

    await expect(padma._getItemsByTranscript('water', 25)).resolves.toEqual([])

    expect(fetch).toHaveBeenCalledWith('https://pad.ma/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.any(String)
    })
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
      action: 'find',
      data: {
        keys: ['id', 'title'],
        query: {
          conditions: [{ key: 'transcripts', operator: '=', value: 'water' }],
          operator: '&'
        },
        range: [0, 100],
        sort: [{ key: 'title', operator: '+' }]
      }
    })
  })

  it('maps only matching transcripts within the query duration', async () => {
    const padma = usePadmaRepositoryStore()
    const query = useQueryStore()
    query.setQueryTranscripts('love')
    query.setDuration(8)
    fetch
      .mockResolvedValueOnce(responseWith({ items: [{ id: 'item-1', title: 'Film' }] }))
      .mockResolvedValueOnce(
        responseWith({
          id: 'item-1',
          title: 'Film',
          duration: 120,
          layers: {
            transcripts: [
              { value: 'I love this', duration: 6, in: 12 },
              { value: 'love for too long', duration: 9, in: 30 },
              { value: 'no match', duration: 3, in: 45 }
            ],
            keywords: [{ value: 'memory' }]
          }
        })
      )

    const clips = await padma.searchClipsByTranscript('love', 10)

    expect(clips).toEqual([
      {
        id: 'item-1',
        title: 'Film',
        transcript: 'I love this',
        keywords: ['memory'],
        url: 'https://media.v2.pad.ma/item-1/240p1.webm',
        ss: 12,
        duration: 6,
        totalDuration: 120
      }
    ])
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({
      action: 'get',
      data: {
        id: 'item-1',
        keys: ['id', 'title', 'duration', 'layers', 'streams', 'modified']
      }
    })
  })

  it('rejects unsuccessful API responses', async () => {
    const padma = usePadmaRepositoryStore()
    fetch.mockResolvedValue(responseWith({}, 500))

    await expect(padma._getItemsByTranscript('water', 10)).rejects.toThrow(
      'an unexpected error occured'
    )
  })

  it('passes stored clips to the supercut service', async () => {
    const clips = [{ id: 'clip-1' }]
    const padma = usePadmaRepositoryStore()
    useClipsStore().setClips(clips)
    combineCuts.mockResolvedValue('blob:supercut')

    await expect(padma.createSupercut()).resolves.toBe('blob:supercut')

    expect(combineCuts).toHaveBeenCalledWith(clips)
  })
})
