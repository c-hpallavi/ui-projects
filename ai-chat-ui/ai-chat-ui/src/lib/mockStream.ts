import type { Message } from './types'

/**
 * Stand-in for a real model API. To go live, replace `streamReply` with a fetch to your
 * backend and yield decoded chunks (see README, "Connect a real model").
 */
const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')) }, { once: true })
  })

const REPLIES: { match: RegExp; text: string }[] = [
  {
    match: /code|react|hook|function/i,
    text: `Here is a small debounce hook in **TypeScript**:

\`\`\`ts
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}
\`\`\`

Use it to delay a search request until the user pauses typing.`,
  },
  {
    match: /compare|table|vs/i,
    text: `### Redux Toolkit vs Context

| | Redux Toolkit | Context |
|---|---|---|
| Best for | Large shared state | Theme, auth, small values |
| Devtools | Yes | No |
| Re-render control | Selectors | Split contexts |

Start with **Context**, and move to Redux Toolkit once state updates become frequent or hard to trace.`,
  },
  {
    match: /./,
    text: `Good question. A few things worth knowing:

- Keep UI state close to where it is used.
- Prefer *derived* values over duplicated state.
- Measure before you optimise.

Ask me for **code**, a **comparison**, or the **weather** in a city to see the other response types.`,
  },
]

export async function* streamReply(history: Message[], signal: AbortSignal): AsyncGenerator<string> {
  const prompt = history.filter((m) => m.role === 'user').at(-1)?.content ?? ''
  await sleep(500, signal) // "thinking" time before the first token

  if (/error|fail/i.test(prompt)) throw new Error('The model service is unavailable.')

  const reply = REPLIES.find((r) => r.match.test(prompt))!.text
  const tokens = reply.match(/\S+\s*|\s+/g) ?? []
  for (const token of tokens) {
    await sleep(25 + Math.random() * 45, signal)
    yield token
  }
}

/** Simulates a tool call: returns structured data the UI renders as a card. */
export async function maybeTool(prompt: string, signal: AbortSignal): Promise<Message['tool'] | undefined> {
  const m = prompt.match(/weather(?: in)? ([a-z ]+)/i)
  if (!m) return undefined
  await sleep(700, signal)
  const city = m[1].trim().replace(/\b\w/g, (c) => c.toUpperCase()) || 'Bengaluru'
  return {
    type: 'weather',
    data: {
      city,
      tempC: 27,
      summary: 'Partly cloudy',
      days: [['Sun', 27], ['Mon', 28], ['Tue', 25], ['Wed', 24], ['Thu', 26]].map(([day, tempC]) => ({ day: day as string, tempC: tempC as number })),
    },
  }
}
