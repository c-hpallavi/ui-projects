export type Status = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled'

export interface Order {
  id: string
  customer: string
  city: string
  amount: number
  status: Status
  date: string // ISO yyyy-mm-dd
}

// Small seeded RNG so the demo data is identical on every load.
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const NAMES = ['Aarav Nair', 'Diya Rao', 'Kabir Shetty', 'Meera Iyer', 'Rohan Gupta', 'Ananya Das', 'Vihaan Joshi', 'Isha Menon', 'Arjun Reddy', 'Saanvi Patel', 'Neel Kulkarni', 'Tara Bose']
const CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Pune', 'Chennai', 'Hyderabad', 'Kochi']
const STATUSES: Status[] = ['Delivered', 'Delivered', 'Delivered', 'Shipped', 'Processing', 'Cancelled']

export const STATUS_LIST: Status[] = ['Delivered', 'Shipped', 'Processing', 'Cancelled']

export function makeOrders(count = 240): Order[] {
  const rnd = mulberry32(42)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)]
  const end = new Date('2026-11-20T00:00:00Z').getTime()
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${String(1001 + i)}`,
    customer: pick(NAMES),
    city: pick(CITIES),
    amount: Math.round(300 + rnd() * 4700),
    status: pick(STATUSES),
    date: new Date(end - Math.floor(rnd() * 30) * 86400000).toISOString().slice(0, 10),
  }))
}

/** Pretend network call so the skeleton loaders are visible. */
export const fetchOrders = () => new Promise<Order[]>((res) => setTimeout(() => res(makeOrders()), 900))

export const inr = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
