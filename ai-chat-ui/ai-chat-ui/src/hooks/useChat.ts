import { useCallback, useRef, useState } from 'react'
import { maybeTool, streamReply } from '../lib/mockStream'
import type { Message } from '../lib/types'

const uid = () => crypto.randomUUID()

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const controller = useRef<AbortController | null>(null)
  const isStreaming = messages.some((m) => m.status === 'streaming')

  const patch = (id: string, change: Partial<Message> | ((m: Message) => Partial<Message>)) =>
    setMessages((all) => all.map((m) => (m.id === id ? { ...m, ...(typeof change === 'function' ? change(m) : change) } : m)))

  const run = useCallback(async (history: Message[]) => {
    const assistant: Message = { id: uid(), role: 'assistant', content: '', status: 'streaming' }
    setMessages([...history, assistant])
    const ctrl = new AbortController()
    controller.current = ctrl

    try {
      const prompt = history.at(-1)?.content ?? ''
      const tool = await maybeTool(prompt, ctrl.signal)
      if (tool) patch(assistant.id, { tool })
      for await (const token of streamReply(history, ctrl.signal)) {
        patch(assistant.id, (m) => ({ content: m.content + token }))
      }
      patch(assistant.id, { status: 'done' })
    } catch (err) {
      if ((err as Error).name === 'AbortError') patch(assistant.id, { status: 'stopped' })
      else patch(assistant.id, { status: 'error', content: (err as Error).message })
    }
  }, [])

  const send = useCallback((text: string) => {
    const user: Message = { id: uid(), role: 'user', content: text, status: 'done' }
    void run([...messages.filter((m) => m.status !== 'error'), user])
  }, [messages, run])

  const stop = useCallback(() => controller.current?.abort(), [])

  /** Drop the last assistant message and ask again. Used for both retry and regenerate. */
  const regenerate = useCallback(() => {
    const lastUser = messages.findLastIndex((m) => m.role === 'user')
    if (lastUser >= 0) void run(messages.slice(0, lastUser + 1))
  }, [messages, run])

  const clear = useCallback(() => { controller.current?.abort(); setMessages([]) }, [])

  return { messages, isStreaming, send, stop, regenerate, clear }
}
