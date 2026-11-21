import { useEffect, useMemo, useState } from 'react'
import { OrdersTable, type SortKey } from './components/OrdersTable'
import { RevenueChart } from './components/RevenueChart'
import { fetchOrders, inr, STATUS_LIST, type Order } from './lib/data'
import { useTheme } from './hooks/useTheme'
import { useUrlState } from './hooks/useUrlState'

const PAGE_SIZE = 10
const DEFAULTS = { q: '', status: 'All', sort: 'date', dir: 'desc', page: '1' }

function toCsv(rows: Order[]) {
  const head = 'id,customer,city,date,status,amount'
  return [head, ...rows.map((r) => [r.id, r.customer, r.city, r.date, r.status, r.amount].join(','))].join('\n')
}

export default function App() {
  const { theme, toggle } = useTheme()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [f, setF] = useUrlState(DEFAULTS)

  useEffect(() => { fetchOrders().then(setOrders) }, [])

  const filtered = useMemo(() => {
    if (!orders) return []
    const q = f.q.toLowerCase()
    const list = orders.filter((o) =>
      (f.status === 'All' || o.status === f.status) &&
      (!q || o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.city.toLowerCase().includes(q)),
    )
    const sign = f.dir === 'asc' ? 1 : -1
    const key = f.sort as SortKey
    return list.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign)
  }, [orders, f.q, f.status, f.sort, f.dir])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(Math.max(1, Number(f.page) || 1), pages)
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const revenue = filtered.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0)
  const cancelRate = filtered.length ? Math.round((filtered.filter((o) => o.status === 'Cancelled').length / filtered.length) * 100) : 0

  const sortBy = (key: SortKey) =>
    setF({ sort: key, dir: f.sort === key && f.dir === 'desc' ? 'asc' : 'desc', page: '1' })

  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([toCsv(filtered)], { type: 'text/csv' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: 'orders.csv' })
    a.click()
    URL.revokeObjectURL(url)
  }

  const loading = orders === null

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Orders</h1>
          <p className="text-muted">Last 30 days · Masala Lane online store</p>
        </div>
        <button type="button" onClick={toggle} aria-pressed={theme === 'dark'} className="min-h-10 rounded-lg border border-line bg-surface px-4 font-semibold">
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </header>

      <section aria-label="Summary" className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ['Revenue', inr(revenue)],
          ['Orders', String(filtered.length)],
          ['Cancelled', `${cancelRate}%`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line bg-surface p-5">
            <p className="text-sm text-muted">{label}</p>
            {loading ? <div className="skeleton mt-2 h-8 w-28" /> : <p className="mt-1 text-3xl font-bold tabular-nums">{value}</p>}
          </div>
        ))}
      </section>

      <section aria-labelledby="rev-h" className="mt-6 rounded-xl border border-line bg-surface p-5">
        <h2 id="rev-h" className="mb-3 font-bold">Revenue by day</h2>
        {loading ? <div className="skeleton h-56 w-full" /> : <RevenueChart orders={filtered} />}
      </section>

      <section aria-labelledby="tbl-h" className="mt-6 rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-end gap-3 border-b border-line p-4">
          <h2 id="tbl-h" className="mr-auto font-bold">All orders</h2>
          <div>
            <label htmlFor="q" className="mb-1 block text-sm text-muted">Search</label>
            <input id="q" type="search" value={f.q} onChange={(e) => setF({ q: e.target.value, page: '1' })} placeholder="Name, city or order ID" className="min-h-10 w-56 rounded-lg border border-line bg-bg px-3" />
          </div>
          <div>
            <label htmlFor="status" className="mb-1 block text-sm text-muted">Status</label>
            <select id="status" value={f.status} onChange={(e) => setF({ status: e.target.value, page: '1' })} className="min-h-10 rounded-lg border border-line bg-bg px-3">
              <option>All</option>
              {STATUS_LIST.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button type="button" onClick={exportCsv} disabled={loading || !filtered.length} className="min-h-10 rounded-lg bg-accent px-4 font-semibold text-bg disabled:opacity-50">Export CSV</button>
        </div>

        {loading ? (
          <div className="space-y-3 p-4">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton h-8 w-full" />)}</div>
        ) : (
          <OrdersTable rows={rows} sort={f.sort as SortKey} dir={f.dir as 'asc' | 'desc'} onSort={sortBy} />
        )}

        <nav aria-label="Pagination" className="flex items-center justify-between border-t border-line p-4 text-sm">
          <p aria-live="polite" className="text-muted">Page {page} of {pages}</p>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setF({ page: String(page - 1) })} className="min-h-10 rounded-lg border border-line px-4 font-semibold disabled:opacity-40">Previous</button>
            <button type="button" disabled={page >= pages} onClick={() => setF({ page: String(page + 1) })} className="min-h-10 rounded-lg border border-line px-4 font-semibold disabled:opacity-40">Next</button>
          </div>
        </nav>
      </section>
    </div>
  )
}
