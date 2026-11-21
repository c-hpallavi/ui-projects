import { useEffect, useRef, useState } from 'react'
import type { UseFormWatch } from 'react-hook-form'
import type { FormValues } from '../lib/schema'

const KEY = 'meetup-registration-draft'

export function loadDraft(): { values?: Partial<FormValues>; step: number } {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { step: 0 }
  } catch {
    return { step: 0 }
  }
}

export const clearDraft = () => { try { localStorage.removeItem(KEY) } catch { /* ignore */ } }

/** Debounced autosave so a refresh or closed tab never loses progress. */
export function useDraftSave(watch: UseFormWatch<FormValues>, step: number) {
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const save = (values: Partial<FormValues>) => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        try {
          localStorage.setItem(KEY, JSON.stringify({ values, step }))
          setSavedAt(new Date())
        } catch { /* storage full or blocked */ }
      }, 600)
    }
    save(watch())
    const sub = watch((values) => save(values as Partial<FormValues>))
    return () => { sub.unsubscribe(); clearTimeout(timer.current) }
  }, [watch, step])

  return savedAt
}
