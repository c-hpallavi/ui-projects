import { useId } from 'react'

interface Props {
  label: string
  description?: string
  checked: boolean
  onChange: (next: boolean) => void
}

export function Switch({ label, description, checked, onChange }: Props) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <label id={`${id}-label`} htmlFor={id} className="font-semibold">{label}</label>
        {description && <p id={`${id}-desc`} className="text-sm text-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-desc` : undefined}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-muted'}`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-0.5 top-0.5 size-6 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  )
}
