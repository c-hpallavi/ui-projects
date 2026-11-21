import { useState } from 'react'
import { Accordion, Button, Combobox, Dialog, Switch, Tabs, ToastProvider, useToast } from './components'

const cities = ['Bengaluru', 'Chennai', 'Delhi', 'Hyderabad', 'Kochi', 'Kolkata', 'Mumbai', 'Pune']

function Section({ id, title, keys, children }: { id: string; title: string; keys: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-8 border-t border-line py-10">
      <h2 id={`${id}-h`} className="font-display text-2xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted">Keyboard: {keys}</p>
      <div className="mt-6 max-w-xl">{children}</div>
    </section>
  )
}

function Demo() {
  const toast = useToast()
  const [dialog, setDialog] = useState(false)
  const [notify, setNotify] = useState(true)
  const [city, setCity] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const save = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); toast('Preferences saved') }, 1200)
  }

  return (
    <>
      <Section id="button" title="Button" keys="Enter or Space activates. Loading state sets aria-busy and blocks repeat clicks.">
        <div className="flex flex-wrap gap-3">
          <Button onClick={save} loading={loading}>Save preferences</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger" onClick={() => setDialog(true)}>Delete account</Button>
        </div>
      </Section>

      <Section id="switch" title="Switch" keys="Space toggles. Announced as “on” or “off”, not “checked”.">
        <Switch label="Email notifications" description="Get a summary every Monday morning." checked={notify} onChange={setNotify} />
      </Section>

      <Section id="tabs" title="Tabs" keys="Left and Right move between tabs. Home and End jump to the first and last. Tab moves into the panel.">
        <Tabs
          label="Account settings"
          items={[
            { id: 'profile', label: 'Profile', content: 'Update your name, photo and public links.' },
            { id: 'security', label: 'Security', content: 'Change your password and review active sessions.' },
            { id: 'billing', label: 'Billing', content: 'Download invoices and manage your plan.' },
          ]}
        />
      </Section>

      <Section id="accordion" title="Accordion" keys="Enter or Space opens a section. Each header is a real heading, so screen reader users can jump between them.">
        <Accordion
          items={[
            { id: 'a', title: 'Can I use this in a commercial project?', content: 'Yes. It is MIT licensed.' },
            { id: 'b', title: 'Does it work without a mouse?', content: 'Every component is fully operable from the keyboard.' },
            { id: 'c', title: 'Which screen readers were tested?', content: 'NVDA with Firefox and VoiceOver with Safari.' },
          ]}
        />
      </Section>

      <Section id="combobox" title="Combobox" keys="Type to filter. Up and Down move through options, Enter selects, Esc closes.">
        <Combobox label="Home city" options={cities} value={city} onChange={setCity} />
        <p className="mt-16 text-sm text-muted" aria-live="polite">{city ? `Selected: ${city}` : 'Nothing selected yet.'}</p>
      </Section>

      <Section id="dialog" title="Dialog" keys="Tab and Shift+Tab stay inside. Esc closes. Focus returns to the button that opened it.">
        <Button variant="secondary" onClick={() => setDialog(true)}>Open dialog</Button>
      </Section>

      <Dialog open={dialog} onClose={() => setDialog(false)} title="Delete your account?">
        <p className="text-muted">This removes your projects and cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDialog(false)}>Keep account</Button>
          <Button variant="danger" onClick={() => { setDialog(false); toast('Account deleted') }}>Delete account</Button>
        </div>
      </Dialog>
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-[12rem_1fr]">
        <header className="md:sticky md:top-12 md:self-start">
          <h1 className="font-display text-3xl font-extrabold leading-tight">Accessible component kit</h1>
          <p className="mt-3 text-sm text-muted">Seven React and TypeScript components, each tested with axe and built to the WAI-ARIA patterns.</p>
          <nav aria-label="Components" className="mt-6">
            <ul className="space-y-1">
              {['button', 'switch', 'tabs', 'accordion', 'combobox', 'dialog'].map((s) => (
                <li key={s}><a href={`#${s}`} className="inline-block py-1 font-semibold capitalize text-accent underline-offset-4 hover:underline">{s}</a></li>
              ))}
            </ul>
          </nav>
        </header>
        <main id="main"><Demo /></main>
      </div>
    </ToastProvider>
  )
}
