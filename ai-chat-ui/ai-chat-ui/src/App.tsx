import { useEffect, useRef } from 'react'
import { Composer } from './components/Composer'
import { MessageView } from './components/MessageView'
import { useChat } from './hooks/useChat'

const SUGGESTIONS = ['Write a React debounce hook', 'Compare Redux Toolkit vs Context', 'What is the weather in Bengaluru', 'Show me an error state']

export default function App() {
  const { messages, isStreaming, send, stop, regenerate, clear } = useChat()
  const scroller = useRef<HTMLDivElement>(null)
  const stickToBottom = useRef(true)

  // Follow the stream, but stop following if the reader scrolls up.
  useEffect(() => {
    const el = scroller.current
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col px-4">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-xl font-extrabold">Chat</h1>
        <button type="button" onClick={clear} disabled={!messages.length} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-soft hover:text-ink disabled:opacity-40">
          New chat
        </button>
      </header>

      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget
          stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
        }}
        className="flex-1 overflow-y-auto pb-6"
      >
        {messages.length === 0 ? (
          <div className="grid h-full place-content-center gap-4 text-center">
            <p className="text-2xl font-extrabold">What are you building today?</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => send(s)} className="rounded-full border border-edge bg-white px-4 py-2 text-sm font-semibold hover:border-teal">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ol className="space-y-6" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
            {messages.map((m, i) => (
              <MessageView key={m.id} message={m} isLast={i === messages.length - 1} onRetry={regenerate} />
            ))}
          </ol>
        )}
      </div>

      <div className="pb-4">
        <Composer isStreaming={isStreaming} onSend={send} onStop={stop} />
      </div>
    </div>
  )
}
