# AI Chat UI

A streaming chat interface in React + TypeScript. It runs on a mock model so it works offline, and you can swap in a real API with one function.

## Features

- Token-by-token streaming with a caret, and a "Thinking…" state before the first token
- **Stop** mid-reply (uses `AbortController`), **Regenerate**, and **Try again** after an error
- Markdown rendering with GitHub tables and code blocks that have a Copy button
- Generative UI: asking about the weather returns structured data that renders as a `WeatherCard` component instead of text
- Smart auto-scroll that stops following when you scroll up
- Auto-growing textarea, Enter to send, Shift+Enter for a new line
- Screen reader friendly: live region for new messages, labelled controls

## Try these prompts

`Write a React debounce hook` · `Compare Redux Toolkit vs Context` · `What is the weather in Bengaluru` · `Show me an error state`

## Connect a real model

Replace `streamReply` in `src/lib/mockStream.ts` with a call to **your own backend** (keep API keys on the server, never in the browser):

```ts
export async function* streamReply(history: Message[], signal: AbortSignal) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
    signal,
  })
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    yield decoder.decode(value, { stream: true })
  }
}
```

## Stack

React 19, TypeScript, Tailwind CSS 4, react-markdown, remark-gfm, Vite, Vitest

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # run the tests
npm run build     # production build in dist/
```

## Deploy

1. Push this folder to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new). If it lives inside a larger repo, set **Root Directory** to this project's folder.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
4. Paste the live URL at the top of this README.

**Live demo:** _add your link here_

![Screenshot](./public/screenshot.png)
_Add a screenshot or GIF at `public/screenshot.png`._
