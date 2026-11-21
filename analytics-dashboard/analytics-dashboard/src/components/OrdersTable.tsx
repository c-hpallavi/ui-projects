import type { Order, Status } from '../lib/data'
import { inr } from '../lib/data'

export type SortKey = 'date' | 'customer' | 'amount' | 'status'

const badge: Record<Status, string> = {
  Delivered: 'text-ok', Shipped: 'text-accent', Processing: 'text-warn', Cancelled: 'text-bad',
}

interface Props {
  rows: Order[]
  sort: SortKey
  dir: 'asc' | 'desc'
  onSort: (key: SortKey) => void
}

export function OrdersTable({ rows, sort, dir, onSort }: Props) {
  const th = (key: SortKey, label: string, right = false) => (
    <th scope="col" aria-sort={sort === key ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`px-4 py-3 font-semibold ${right ? 'text-right' : 'text-left'}`}>
      <button type="button" onClick={() => onSort(key)} className="inline-flex items-center gap-1 rounded hover:text-accent">
        {label}
        <span aria-hidden="true" className="text-xs">{sort === key ? (dir === 'asc' ? '▲' : '▼') : ''}</span>
      </button>
    </th>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-line text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-semibold">Order</th>
            {th('customer', 'Customer')}
            <th scope="col" className="px-4 py-3 text-left font-semibold">City</th>
            {th('date', 'Date')}
            {th('status', 'Status')}
            {th('amount', 'Amount', true)}
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3 font-medium">{o.id}</td>
              <td className="px-4 py-3">{o.customer}</td>
              <td className="px-4 py-3 text-muted">{o.city}</td>
              <td className="px-4 py-3 text-muted">{new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
              <td className={`px-4 py-3 font-semibold ${badge[o.status]}`}>{o.status}</td>
              <td className="px-4 py-3 text-right tabular-nums">{inr(o.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="px-4 py-12 text-center text-muted">No orders match these filters. Clear the search or pick a different status.</p>}
    </div>
  )
}
