import { useState } from 'react'
import { motion } from 'motion/react'

const TASKS = ['Write the README', 'Add a live demo link', 'Record a short GIF']

export function CheckList() {
  const [done, setDone] = useState<Record<string, boolean>>({})

  return (
    <ul className="w-full max-w-xs space-y-3">
      {TASKS.map((t) => {
        const on = !!done[t]
        return (
          <li key={t}>
            <button type="button" role="checkbox" aria-checked={on} onClick={() => setDone((d) => ({ ...d, [t]: !on }))} className="flex w-full items-center gap-3 text-left text-lg font-semibold">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg border-2 border-ink" style={{ background: on ? 'var(--color-mint)' : '#fff' }}>
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                  <motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.25 }} />
                </svg>
              </span>
              <span className="relative">
                {t}
                <motion.span aria-hidden="true" className="absolute left-0 top-1/2 h-0.5 bg-ink" initial={false} animate={{ width: on ? '100%' : '0%' }} transition={{ duration: 0.25 }} />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
