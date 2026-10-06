import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useClipsStore } from '../src/stores/clips'
import { useSequenceStore } from '../src/stores/sequencer'

vi.mock('@/video-api', () => ({
  combineCuts: vi.fn()
}))

describe('sequencer store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('advances through clips and wraps to the beginning', () => {
    const firstClip = { url: 'first.webm', ss: 2, duration: 3, transcript: 'first' }
    const secondClip = { url: 'second.webm', ss: 4, duration: 5, transcript: 'second' }
    useClipsStore().setClips([firstClip, secondClip])
    const sequencer = useSequenceStore()

    expect(sequencer.currentUrl).toBe(firstClip.url)
    expect(sequencer.currentEndTime).toBe(5)
    expect(sequencer.nextClipUrl).toBe(secondClip.url)

    sequencer.playNext()
    expect(sequencer.currentSequence).toBe(1)
    expect(sequencer.currentTranscript).toBe('second')
    expect(sequencer.nextClipUrl).toBe(firstClip.url)

    sequencer.playNext()
    expect(sequencer.currentSequence).toBe(0)
    expect(sequencer.currentTranscript).toBe('first')
  })

  it('does not advance while playback is stopped', () => {
    const clips = [
      { url: 'first.webm', ss: 0, duration: 2, transcript: 'first' },
      { url: 'second.webm', ss: 2, duration: 2, transcript: 'second' }
    ]
    useClipsStore().setClips(clips)
    const sequencer = useSequenceStore()
    sequencer.setPlaying(false)

    sequencer.playNext()

    expect(sequencer.currentSequence).toBe(0)
    expect(sequencer.currentUrl).toBe('first.webm')
  })

  it('starts empty when there are no clips', () => {
    const sequencer = useSequenceStore()

    expect(sequencer.playing).toBe(false)
    expect(sequencer.currentUrl).toBeNull()
    expect(sequencer.nextClipUrl).toBeNull()
  })
})
