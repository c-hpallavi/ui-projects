import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, inputClass } from './components/Field'
import { Stepper } from './components/Stepper'
import { clearDraft, loadDraft, useDraftSave } from './hooks/useDraft'
import { ROLES, SESSIONS, SKILLS, STEPS, schema, type FormValues } from './lib/schema'

const initial = loadDraft()

function CheckGroup({ legend, name, options, register, error }: {
  legend: string; name: 'skills' | 'sessions'; options: readonly string[]
  register: ReturnType<typeof useForm<FormValues>>['register']; error?: { message?: string }
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-2 font-bold">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 border-rule bg-white px-3 has-[:checked]:border-orchid">
            <input type="checkbox" value={o} {...register(name)} className="size-5 accent-orchid" />
            {o}
          </label>
        ))}
      </div>
      {error && <p id={`${name}-error`} className="mt-1 text-sm font-semibold text-danger">{error.message}</p>}
    </fieldset>
  )
}

export default function App() {
  const [step, setStep] = useState(Math.min(initial.step, STEPS.length - 1))
  const [done, setDone] = useState(false)
  const [announce, setAnnounce] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)

  const { register, handleSubmit, trigger, watch, getValues, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { skills: [], sessions: [], consent: false, ...initial.values },
  })

  const savedAt = useDraftSave(watch, step)

  // Move focus to the step heading whenever the step changes, so keyboard and screen reader users land at the top.
  useEffect(() => { heading.current?.focus() }, [step, done])

  const next = async () => {
    const ok = await trigger([...STEPS[step].fields], { shouldFocus: true })
    if (!ok) {
      const count = STEPS[step].fields.filter((f) => errors[f]).length
      setAnnounce(`${count || 'Some'} ${count === 1 ? 'field needs' : 'fields need'} attention before you continue.`)
      return
    }
    setAnnounce('')
    setStep((s) => s + 1)
  }

  const submit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 900)) // pretend API call
    clearDraft()
    setDone(true)
  })

  if (done) {
    return (
      <main className="mx-auto max-w-xl px-5 py-16">
        <h1 ref={heading} tabIndex={-1} className="font-display text-4xl font-bold outline-none">You’re registered</h1>
        <p className="mt-3 text-hush">We sent a confirmation to {getValues('email')}. See you at the meetup.</p>
        <button type="button" onClick={() => { reset({ skills: [], sessions: [], consent: false }); setStep(0); setDone(false) }} className="mt-6 min-h-12 rounded-lg border-2 border-rule px-5 font-bold">
          Register someone else
        </button>
      </main>
    )
  }

  const v = getValues()

  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <p className="text-hush">Bengaluru Frontend Meetup</p>
      <h1 ref={heading} tabIndex={-1} className="mb-6 font-display text-4xl font-bold outline-none">
        {STEPS[step].title}
      </h1>
      <Stepper current={step} />
      <p role="alert" className="mt-4 min-h-6 font-semibold text-danger">{announce}</p>

      <form onSubmit={submit} noValidate className="mt-2 space-y-6">
        {step === 0 && (
          <>
            <Field id="fullName" label="Full name" error={errors.fullName}>
              {(a) => <input {...a} autoComplete="name" {...register('fullName')} className={inputClass(!!errors.fullName)} />}
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              {(a) => <input {...a} type="email" autoComplete="email" {...register('email')} className={inputClass(!!errors.email)} />}
            </Field>
            <Field id="phone" label="Mobile number" hint="10 digits, no country code" error={errors.phone}>
              {(a) => <input {...a} type="tel" inputMode="numeric" autoComplete="tel-national" {...register('phone')} className={inputClass(!!errors.phone)} />}
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field id="role" label="Your role" error={errors.role}>
              {(a) => (
                <select {...a} {...register('role')} className={inputClass(!!errors.role)}>
                  <option value="">Choose one</option>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              )}
            </Field>
            <Field id="experience" label="Years of experience" error={errors.experience}>
              {(a) => <input {...a} type="number" inputMode="numeric" min={0} {...register('experience', { valueAsNumber: true })} className={inputClass(!!errors.experience)} />}
            </Field>
            <CheckGroup legend="Skills you use" name="skills" options={SKILLS} register={register} error={errors.skills} />
          </>
        )}

        {step === 2 && (
          <>
            <CheckGroup legend="Sessions you want to attend" name="sessions" options={SESSIONS} register={register} error={errors.sessions} />
            <Field id="notes" label="Anything we should know? (optional)" hint="Food preferences, access needs, or a question for the speakers." error={errors.notes}>
              {(a) => <textarea {...a} rows={3} {...register('notes')} className={inputClass(!!errors.notes)} />}
            </Field>
            <div>
              <label className="flex items-start gap-3">
                <input type="checkbox" {...register('consent')} aria-describedby={errors.consent ? 'consent-error' : undefined} aria-invalid={!!errors.consent} className="mt-1 size-5 accent-orchid" />
                I agree to follow the code of conduct.
              </label>
              {errors.consent && <p id="consent-error" className="mt-1 text-sm font-semibold text-danger">{errors.consent.message}</p>}
            </div>
          </>
        )}

        {step === 3 && (
          <dl className="divide-y divide-rule rounded-xl border-2 border-rule bg-white">
            {([
              ['Name', v.fullName, 0], ['Email', v.email, 0], ['Mobile', v.phone, 0],
              ['Role', `${v.role}, ${v.experience} yrs`, 1], ['Skills', v.skills?.join(', '), 1],
              ['Sessions', v.sessions?.join(', '), 2], ['Notes', v.notes || 'None', 2],
            ] as const).map(([k, val, s]) => (
              <div key={k} className="flex items-start justify-between gap-4 p-4">
                <div><dt className="text-sm text-hush">{k}</dt><dd className="font-semibold">{val}</dd></div>
                <button type="button" onClick={() => setStep(s)} className="text-sm font-bold text-orchid underline underline-offset-4">
                  Edit<span className="sr-only"> {k}</span>
                </button>
              </div>
            ))}
          </dl>
        )}

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="min-h-12 rounded-lg border-2 border-rule px-5 font-bold disabled:invisible">
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="min-h-12 rounded-lg bg-orchid px-6 font-bold text-white hover:bg-orchid-deep">Continue</button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="min-h-12 rounded-lg bg-orchid px-6 font-bold text-white hover:bg-orchid-deep disabled:opacity-60">
              {isSubmitting ? 'Registering…' : 'Register'}
            </button>
          )}
        </div>
      </form>

      <p aria-live="polite" className="mt-6 text-sm text-hush">
        {savedAt ? `Draft saved at ${savedAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}` : 'Your progress saves automatically.'}
      </p>
    </main>
  )
}
