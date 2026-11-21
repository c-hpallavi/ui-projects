import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const ANGLES = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2)

export function LikeBurst() {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(128)

  const toggle = () => {
    setLiked((l) => !l)
    setCount((c) => c + (liked ? -1 : 1))
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={liked} aria-label={`Like, ${count} likes`} className="relative flex items-center gap-3 rounded-full border-2 border-ink px-6 py-3 text-lg font-bold">
      <motion.svg
        key={String(liked)}
        viewBox="0 0 24 24" className="size-7"
        initial={{ scale: liked ? 0.4 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 12 }}
        aria-hidden="true"
      >
        <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2 0 3.7 1.1 5.4 3 1.7-1.9 3.4-3 5.4-3 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z" fill={liked ? 'var(--color-tomato)' : 'none'} stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
      </motion.svg>
      <span className="tabular-nums">{count}</span>

      <AnimatePresence>
        {liked && ANGLES.map((a, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute left-9 top-1/2 size-2 rounded-full bg-tomato"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(a) * 34, y: Math.sin(a) * 34, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </button>
  )
}
