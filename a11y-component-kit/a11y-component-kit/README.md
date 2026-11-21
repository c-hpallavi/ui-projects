# Accessible Component Kit

Seven React + TypeScript + Tailwind components built to the WAI-ARIA Authoring Practices, with automated accessibility tests.

## Components

| Component | What is handled |
|---|---|
| Button | Loading state with `aria-busy`, 44px minimum touch target |
| Switch | `role="switch"`, labelled and described, Space toggles |
| Tabs | Roving tabindex, Left/Right/Home/End keys, linked panels |
| Accordion | Real headings, `aria-expanded`, `aria-controls` |
| Combobox | Listbox autocomplete using `aria-activedescendant` |
| Dialog | Focus trap, Esc to close, focus returns to the trigger, scroll lock |
| Toast | Polite live region that never steals focus |

## Testing

`vitest-axe` runs axe on each component, and Testing Library checks keyboard behaviour (arrow keys in Tabs, Esc in Dialog, Space on Switch).

## Stack

React 19, TypeScript, Tailwind CSS 4, Vite, Vitest, Testing Library, vitest-axe

## Ideas to extend it

- Add Storybook and publish it alongside the demo
- Add a Tooltip, Menu button and Date picker
- Add a dark theme using CSS variables

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
