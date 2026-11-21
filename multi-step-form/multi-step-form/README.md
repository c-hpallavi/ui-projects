# Multi-step Registration Form

A four-step form for a meetup, built with React Hook Form and Zod, with a focus on accessible validation.

## Features

- One Zod schema is the single source of truth for validation and TypeScript types
- Per-step validation: **Continue** only validates that step's fields and moves focus to the first error
- Every control has a label, optional hint and error linked with `aria-describedby`; invalid fields set `aria-invalid`
- Errors are announced through a live region
- Focus moves to the step heading on each step change
- **Autosave**: progress is saved to `localStorage` (debounced) and restored after a refresh
- Review step with an Edit link per section
- Progress indicator uses `aria-current="step"`

## Where to look

| File | Why it is interesting |
|---|---|
| `src/lib/schema.ts` | Schema, step-to-field map, and error copy |
| `src/components/Field.tsx` | Reusable label, hint and error wiring |
| `src/hooks/useDraft.ts` | Debounced autosave and restore |

## Stack

React 19, TypeScript, Tailwind CSS 4, React Hook Form, Zod, Vite, Vitest

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
