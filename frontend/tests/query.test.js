import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQueryStore } from '../src/stores/query'

describe('query store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with defaults and restores them after reset', () => {
    const query = useQueryStore()

    expect(query.$state).toEqual({
      queryTranscripts: 'love',
      queryKeywords: '',
      range: 10,
      duration: 10
    })

    query.setQueryTranscripts('water')
    query.setRange(25)
    query.setDuration(4)
    query.reset()

    expect(query.queryTranscripts).toBe('love')
    expect(query.queryKeywords).toBe('')
    expect(query.range).toBe(10)
    expect(query.duration).toBe(10)
  })
})
