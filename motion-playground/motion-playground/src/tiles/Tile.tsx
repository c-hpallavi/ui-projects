import type { ReactNode } from 'react'

export function Tile({ title, hint, className = '', children }: { title: string; hint: string; className?: string; children: ReactNode }) {
  return (
    <section className={`tile flex flex-col p-5 ${className}`}>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mb-4 text-sm opacity-70">{hint}</p>
      <div className="grid flex-1 place-items-center">{children}</div>
    </section>
  )
}
