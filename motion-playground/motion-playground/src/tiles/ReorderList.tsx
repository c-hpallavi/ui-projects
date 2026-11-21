import { useState } from 'react'
import { Reorder } from 'motion/react'

/** Drag to reorder. Arrow buttons give keyboard and touch users the same ability. */
export function ReorderList() {
  const [items, setItems] = useState(['Design tokens', 'Component states', 'Accessibility pass', 'Ship it'])

  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]]
    setItems(next)
  }

  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems} className="w-full max-w-xs space-y-2" aria-label="Launch checklist, drag to reorder">
      {items.map((item, i) => (
        <Reorder.Item
          key={item} value={item}
          whileDrag={{ scale: 1.04, boxShadow: '0 8px 0 var(--color-ink)' }}
          className="flex cursor-grab items-center justify-between rounded-xl border-2 border-ink bg-mint px-4 py-2.5 font-semibold active:cursor-grabbing"
        >
          {item}
          <span className="flex gap-1">
            <button type="button" aria-label={`Move ${item} up`} disabled={i === 0} onClick={() => move(i, -1)} className="rounded px-1.5 disabled:opacity-30">↑</button>
            <button type="button" aria-label={`Move ${item} down`} disabled={i === items.length - 1} onClick={() => move(i, 1)} className="rounded px-1.5 disabled:opacity-30">↓</button>
          </span>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}
