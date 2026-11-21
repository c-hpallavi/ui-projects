import { useId, useState, type ReactNode } from 'react'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const base = useId()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="divide-y divide-line rounded-xl border border-line bg-white">
      {items.map((item) => {
        const isOpen = open === item.id
        return (
          <section key={item.id}>
            <h3>
              <button
                type="button"
                id={`${base}-${item.id}-btn`}
                aria-expanded={isOpen}
                aria-controls={`${base}-${item.id}-panel`}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="flex min-h-12 w-full items-center justify-between gap-4 px-4 text-left font-semibold"
              >
                {item.title}
                <span aria-hidden="true" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
              </button>
            </h3>
            <div
              id={`${base}-${item.id}-panel`}
              role="region"
              aria-labelledby={`${base}-${item.id}-btn`}
              hidden={!isOpen}
              className="px-4 pb-4 text-muted"
            >
              {item.content}
            </div>
          </section>
        )
      })}
    </div>
  )
}
