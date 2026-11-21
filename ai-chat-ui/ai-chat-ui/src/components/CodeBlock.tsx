import { useState, type ReactNode } from 'react'

export function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false)

  const text = (node: ReactNode): string =>
    typeof node === 'string' ? node : Array.isArray(node) ? node.map(text).join('') : (node as { props?: { children?: ReactNode } })?.props?.children ? text((node as { props: { children: ReactNode } }).props.children) : ''

  const copy = async () => {
    await navigator.clipboard.writeText(text(children))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative mb-3">
      <pre className="overflow-x-auto rounded-xl bg-ink p-4 pr-20 font-mono text-sm leading-relaxed text-mist">{children}</pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span role="status" className="sr-only">{copied ? 'Code copied to clipboard' : ''}</span>
    </div>
  )
}
