# Motion Playground

Five micro-interactions in React, Tailwind and Motion. Each animation answers something the user does, and each has a keyboard path.

## Interactions

| Tile | Technique |
|---|---|
| Magnetic button | `useMotionValue` + `useSpring` following the pointer |
| Like burst | Spring scale and particles with `AnimatePresence` |
| Reorder | `Reorder.Group` drag, plus up/down buttons for keyboard and touch |
| Checklist | SVG `pathLength` check mark and animated strike-through |
| Expand | Shared `layoutId` transition from tile to detail panel |

## Accessibility

`MotionConfig reducedMotion="user"` makes transform animations respect the operating system's reduced-motion setting. Decorative elements are `aria-hidden`, and toggles expose their state with `aria-pressed` and `aria-checked`.

## Stack

React 19, TypeScript, Tailwind CSS 4, Motion, Vite, Vitest

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
