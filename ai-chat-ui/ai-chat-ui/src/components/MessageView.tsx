import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from '../lib/types'
import { CodeBlock } from './CodeBlock'
import { WeatherCard } from './WeatherCard'

interface Props {
  message: Message
  isLast: boolean
  onRetry: () => void
}

export function MessageView({ message, isLast, onRetry }: Props) {
  if (message.role === 'user') {
    return (
      <li className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-mist">{message.content}</p>
      </li>
    )
  }

  const streaming = message.status === 'streaming'
  const thinking = streaming && !message.content && !message.tool

  return (
    <li className="max-w-[92%]" aria-busy={streaming}>
      {message.tool?.type === 'weather' && <WeatherCard data={message.tool.data} />}

      {thinking && <p className="text-soft">Thinking…</p>}

      {message.status === 'error' ? (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-900">
          <p className="font-bold">Couldn’t get a reply</p>
          <p className="text-sm">{message.content}</p>
          <button type="button" onClick={onRetry} className="mt-3 rounded-lg bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-900">
            Try again
          </button>
        </div>
      ) : (
        <div className={`prose-chat ${streaming && message.content ? 'streaming-caret' : ''}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: ({ children }) => <CodeBlock>{children}</CodeBlock> }}>
            {message.content}
          </ReactMarkdown>
        </div>
      )}

      {message.status === 'stopped' && <p className="text-sm italic text-soft">Stopped.</p>}
      {isLast && message.status === 'done' && (
        <button type="button" onClick={onRetry} className="mt-1 text-sm font-semibold text-teal underline-offset-4 hover:underline">
          Regenerate
        </button>
      )}
    </li>
  )
}
