import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'

interface Props {
  label: string
  options: string[]
  value: string | null
  onChange: (value: string) => void
}

/** WAI-ARIA combobox with list autocomplete (aria-activedescendant keeps focus in the input). */
export function Combobox({ label, options, value, onChange }: Props) {
  const id = useId()
  const [query, setQuery] = useState(value ?? '')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  )

  const select = (opt: string) => {
    onChange(opt)
    setQuery(opt)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter' && open && filtered[active]) { e.preventDefault(); select(filtered[active]) }
    else if (e.key === 'Escape') { setOpen(false) }
  }

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1 block font-semibold">{label}</label>
      <input
        ref={inputRef}
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={open && filtered[active] ? `${id}-opt-${active}` : undefined}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="min-h-11 w-full rounded-lg border border-line bg-white px-3"
      />
      <ul
        id={`${id}-list`}
        role="listbox"
        aria-label={label}
        hidden={!open}
        className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-line bg-white py-1 shadow-lg"
      >
        {filtered.length === 0 && <li role="presentation" className="px-3 py-2 text-muted">No matches</li>}
        {filtered.map((o, i) => (
          <li
            key={o}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={value === o}
            onMouseDown={(e) => { e.preventDefault(); select(o) }}
            onMouseEnter={() => setActive(i)}
            className={`cursor-pointer px-3 py-2 ${i === active ? 'bg-accent text-white' : ''}`}
          >
            {o}
          </li>
        ))}
      </ul>
    </div>
  )
}
