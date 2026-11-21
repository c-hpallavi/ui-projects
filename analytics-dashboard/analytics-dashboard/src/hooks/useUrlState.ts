import { useCallback, useEffect, useState } from 'react'

/**
 * Keeps a flat object of string params in sync with the URL query string,
 * so filtered views can be bookmarked, shared and survive refresh.
 */
export function useUrlState<T extends Record<string, string>>(defaults: T) {
  const read = useCallback((): T => {
    const q = new URLSearchParams(window.location.search)
    const out = { ...defaults }
    for (const key of Object.keys(defaults)) {
      const v = q.get(key)
      if (v !== null) (out as Record<string, string>)[key] = v
    }
    return out
  }, [defaults])

  const [state, setState] = useState<T>(read)

  const update = useCallback((patch: Partial<T>) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      const q = new URLSearchParams()
      for (const [k, v] of Object.entries(next)) if (v !== defaults[k]) q.set(k, v)
      const qs = q.toString()
      window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
      return next
    })
  }, [defaults])

  // Back/forward support
  useEffect(() => {
    const onPop = () => setState(read())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [read])

  return [state, update] as const
}
