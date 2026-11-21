import type { ReactNode } from 'react'
import type { FieldError } from 'react-hook-form'

interface Props {
  id: string
  label: string
  hint?: string
  error?: FieldError
  children: (aria: { id: string; 'aria-invalid': boolean; 'aria-describedby': string | undefined }) => ReactNode
}

/** Wires label, hint and error to the control so screen readers announce all three. */
export function Field({ id, label, hint, error, children }: Props) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-bold">{label}</label>
      {hint && <p id={`${id}-hint`} className="mb-1 text-sm text-hush">{hint}</p>}
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy })}
      {error && <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-danger">{error.message}</p>}
    </div>
  )
}

export const inputClass = (invalid?: boolean) =>
  `min-h-12 w-full rounded-lg border-2 bg-white px-3 ${invalid ? 'border-danger' : 'border-rule'}`
