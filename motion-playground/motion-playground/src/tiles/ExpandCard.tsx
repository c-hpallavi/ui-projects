import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const CARDS = [
  { id: 'perf', title: 'Performance', color: 'bg-sun', body: 'Split routes, compress images, and measure Core Web Vitals before and after every change.' },
  { id: 'a11y', title: 'Accessibility', color: 'bg-mint', body: 'Use real buttons and labels, keep a visible focus ring, and test with a keyboard first.' },
  { id: 'motion', title: 'Motion', color: 'bg-tomato', body: 'Animate in response to an action, keep it short, and honour reduced-motion settings.' },
]

/** Shared-layout animation: the tile you click grows into a detail panel. */
export function ExpandCard() {
  const [open, setOpen] = useState<string | null>(null)
  const card = CARDS.find((c) => c.id === open)

  return (
    <div className="relative w-full">
      <ul className="grid grid-cols-3 gap-3">
        {CARDS.map((c) => (
          <li key={c.id}>
            <motion.button type="button" layoutId={c.id} onClick={() => setOpen(c.id)} style={{ borderRadius: 16 }} className={`${c.color} h-24 w-full border-2 border-ink p-3 text-left font-bold`}>
              <motion.span layoutId={`${c.id}-t`}>{c.title}</motion.span>
            </motion.button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {card && (
          <div className="absolute inset-0 z-10 grid" role="dialog" aria-label={card.title} onKeyDown={(e) => e.key === 'Escape' && setOpen(null)}>
            <motion.div layoutId={card.id} style={{ borderRadius: 16 }} className={`${card.color} flex flex-col justify-between border-2 border-ink p-5`}>
              <div>
                <motion.h3 layoutId={`${card.id}-t`} className="text-xl font-bold">{card.title}</motion.h3>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }} exit={{ opacity: 0, transition: { duration: 0.05 } }} className="mt-2">{card.body}</motion.p>
              </div>
              <button type="button" autoFocus onClick={() => setOpen(null)} className="self-end rounded-full border-2 border-ink bg-white px-4 py-1.5 font-bold">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
