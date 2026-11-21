import { useMemo, useState } from 'react'
import type { Order } from '../lib/data'
import { inr } from '../lib/data'

/** Hand-rolled SVG line chart: no chart library, keyboard-focusable points, and a screen-reader table. */
export function RevenueChart({ orders }: { orders: Order[] }) {
  const [hover, setHover] = useState<number | null>(null)

  const series = useMemo(() => {
    const byDay = new Map<string, number>()
    for (const o of orders) if (o.status !== 'Cancelled') byDay.set(o.date, (byDay.get(o.date) ?? 0) + o.amount)
    return [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, total]) => ({ date, total }))
  }, [orders])

  if (series.length < 2) return <p className="py-10 text-center text-muted">Not enough data for a chart. Try clearing the filters.</p>

  const W = 640, H = 220, P = { l: 8, r: 8, t: 12, b: 24 }
  const max = Math.max(...series.map((s) => s.total))
  const x = (i: number) => P.l + (i / (series.length - 1)) * (W - P.l - P.r)
  const y = (v: number) => P.t + (1 - v / max) * (H - P.t - P.b)
  const line = series.map((s, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(s.total).toFixed(1)}`).join(' ')
  const area = `${line} L${x(series.length - 1)},${H - P.b} L${x(0)},${H - P.b} Z`
  const active = hover !== null ? series[hover] : null

  return (
    <div>
      <div className="mb-2 h-6 text-sm text-muted" aria-hidden="true">
        {active ? <><strong className="text-ink">{inr(active.total)}</strong> on {new Date(active.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</> : 'Hover or focus a point'}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Daily revenue, ${series.length} days, peak ${inr(max)}`} className="w-full">
        <path d={area} fill="var(--accent-soft)" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />
        {series.map((s, i) => (
          <circle
            key={s.date}
            cx={x(i)} cy={y(s.total)} r={hover === i ? 6 : 3.5}
            fill="var(--surface)" stroke="var(--accent)" strokeWidth="2"
            tabIndex={0}
            aria-label={`${s.date}: ${inr(s.total)}`}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)} onBlur={() => setHover(null)}
          />
        ))}
      </svg>
      <table className="sr-only">
        <caption>Daily revenue</caption>
        <thead><tr><th>Date</th><th>Revenue</th></tr></thead>
        <tbody>{series.map((s) => <tr key={s.date}><td>{s.date}</td><td>{inr(s.total)}</td></tr>)}</tbody>
      </table>
    </div>
  )
}
