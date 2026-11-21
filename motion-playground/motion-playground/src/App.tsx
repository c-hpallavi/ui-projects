import { MotionConfig } from 'motion/react'
import { Tile } from './tiles/Tile'
import { MagneticButton } from './tiles/MagneticButton'
import { LikeBurst } from './tiles/LikeBurst'
import { ReorderList } from './tiles/ReorderList'
import { CheckList } from './tiles/CheckList'
import { ExpandCard } from './tiles/ExpandCard'

export default function App() {
  return (
    // reducedMotion="user" makes every transform animation respect the OS setting.
    <MotionConfig reducedMotion="user">
      <main className="mx-auto max-w-5xl px-5 py-12">
        <h1 className="max-w-2xl text-5xl font-bold leading-[1.05]">Small interactions that make an interface feel alive</h1>
        <p className="mt-4 max-w-xl text-lg">Five micro-interactions built with React, Tailwind and Motion. Each one responds to something you do, and each has a keyboard path.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-6">
          <Tile title="Magnetic button" hint="Move your pointer close." className="md:col-span-3"><MagneticButton /></Tile>
          <Tile title="Like" hint="Click or press Space." className="md:col-span-3"><LikeBurst /></Tile>
          <Tile title="Reorder" hint="Drag a row, or use the arrows." className="md:col-span-2"><ReorderList /></Tile>
          <Tile title="Checklist" hint="Tick a task off." className="md:col-span-2"><CheckList /></Tile>
          <Tile title="Expand" hint="Open a card, Esc to close." className="md:col-span-2"><ExpandCard /></Tile>
        </div>
      </main>
    </MotionConfig>
  )
}
