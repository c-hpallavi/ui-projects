import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface ToastItem { id: number; message: string }
const ToastContext = createContext<(message: string) => void>(() => {})

export const useToast = () => useContext(ToastContext)

/** Messages are announced politely by a persistent live region; they never steal focus. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const push = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-lg bg-ink px-4 py-3 text-white shadow-lg">
            <span>{t.message}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
              className="rounded px-1 text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
