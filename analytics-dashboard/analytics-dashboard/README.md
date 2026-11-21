# Orders Dashboard

A data-heavy dashboard for a fictional online store, with table state that lives in the URL.

## Features

- Sortable columns with `aria-sort`, search, status filter and pagination
- **Filters persist in the URL**, so a filtered view can be bookmarked, shared and survives refresh
- KPI cards that recalculate from the filtered data
- Hand-written SVG line chart (no chart library) with keyboard-focusable points and a hidden data table for screen readers
- Skeleton loaders while data loads
- Light and dark themes with no flash on load, remembering your choice
- CSV export of the filtered rows
- Rupee formatting with Indian digit grouping

## Where to look

| File | Why it is interesting |
|---|---|
| `src/hooks/useUrlState.ts` | Syncs state with the query string and supports back/forward |
| `src/components/RevenueChart.tsx` | Accessible SVG chart from scratch |
| `src/lib/data.ts` | Seeded random data, so the demo is the same on every load |

## Stack

React 19, TypeScript, Tailwind CSS 4, Vite, Vitest

## Ideas to extend it

- Swap the mock `fetchOrders` for a real API using TanStack Query
- Add a date range filter
- Virtualise the table for thousands of rows

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # run the tests
npm run build     # production build in dist/
```

## Deploy

1. Push this folder to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new). If it lives inside a larger repo, set **Root Directory** to this project's folder.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
4. Paste the live URL at the top of this README.

**Live demo:** _add your link here_

![Screenshot](./public/screenshot.png)
_Add a screenshot or GIF at `public/screenshot.png`._
