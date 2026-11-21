import { STEPS } from '../lib/schema'

export function Stepper({ current }: { current: number }) {
  return (
    <nav aria-label="Progress">
      <ol className="flex gap-2">
        {STEPS.map((s, i) => (
          <li key={s.title} aria-current={i === current ? 'step' : undefined} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= current ? 'bg-orchid' : 'bg-rule'}`} />
            <p className={`mt-2 text-sm ${i === current ? 'font-extrabold' : 'text-hush'}`}>
              <span className="sr-only">Step {i + 1} of {STEPS.length}: </span>
              {s.title}
              {i < current && <span className="sr-only"> (completed)</span>}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  )
}
