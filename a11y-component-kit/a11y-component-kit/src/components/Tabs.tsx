import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

/** WAI-ARIA tabs pattern: roving tabindex, arrow keys, Home/End. */
export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const base = useId()
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const focusTab = (i: number) => {
    const next = (i + items.length) % items.length
    setActive(next)
    refs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: items.length - 1,
    }
    if (e.key in keys) {
      e.preventDefault()
      focusTab(keys[e.key])
    }
  }

  return (
    <div>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex gap-1 border-b border-line">
        {items.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el }}
            role="tab"
            id={`${base}-tab-${t.id}`}
            aria-selected={active === i}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={`-mb-px min-h-11 border-b-2 px-4 font-semibold transition-colors ${
              active === i ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={active !== i}
          tabIndex={0}
          className="py-4"
        >
          {t.content}
        </div>
      ))}
    </div>
  )
}
