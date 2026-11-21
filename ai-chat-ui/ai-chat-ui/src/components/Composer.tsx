import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'

interface Props {
  isStreaming: boolean
  onSend: (text: string) => void
  onStop: () => void
}

export function Composer({ isStreaming, onSend, onStop }: Props) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    const value = text.trim()
    if (!value || isStreaming) return
    onSend(value)
    setText('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) submit(e)
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2 rounded-2xl border border-edge bg-white p-2">
      <label htmlFor="prompt" className="sr-only">Message</label>
      <textarea
        id="prompt"
        ref={ref}
        rows={1}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          e.target.style.height = 'auto'
          e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
        }}
        onKeyDown={onKeyDown}
        placeholder="Ask something. Shift+Enter for a new line"
        className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 outline-none placeholder:text-soft"
      />
      {isStreaming ? (
        <button type="button" onClick={onStop} className="min-h-10 rounded-xl bg-ink px-4 font-bold text-white">Stop</button>
      ) : (
        <button type="submit" disabled={!text.trim()} className="min-h-10 rounded-xl bg-teal px-4 font-bold text-white hover:bg-teal-deep disabled:opacity-50">Send</button>
      )}
    </form>
  )
}
