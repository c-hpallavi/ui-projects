import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

/** The button leans toward the pointer, then springs back when it leaves. */
export function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 14, mass: 0.4 })

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <div onPointerMove={onMove} onPointerLeave={reset} className="p-8">
      <motion.button
        ref={ref}
        type="button"
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.92 }}
        className="rounded-full border-2 border-ink bg-sun px-8 py-4 text-lg font-bold"
      >
        Get started
      </motion.button>
    </div>
  )
}
