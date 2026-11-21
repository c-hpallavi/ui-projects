import { describe, expect, it } from 'vitest'
import { streamReply } from './mockStream'
import type { Message } from './types'

const history = (content: string): Message[] => [{ id: '1', role: 'user', content, status: 'done' }]

describe('streamReply', () => {
  it('rejects with AbortError when cancelled', async () => {
    const ctrl = new AbortController()
    const run = (async () => { for await (const _ of streamReply(history('hello'), ctrl.signal)) void _ })()
    ctrl.abort()
    await expect(run).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('throws for error prompts', async () => {
    const ctrl = new AbortController()
    const run = (async () => { for await (const _ of streamReply(history('force an error'), ctrl.signal)) void _ })()
    await expect(run).rejects.toThrow('unavailable')
  })
})
