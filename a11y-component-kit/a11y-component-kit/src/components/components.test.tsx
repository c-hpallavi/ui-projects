import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { expect, it, describe, vi } from 'vitest'
import { Accordion, Button, Combobox, Dialog, Switch, Tabs } from '.'


const tabItems = [
  { id: 'a', label: 'One', content: 'First' },
  { id: 'b', label: 'Two', content: 'Second' },
]

describe('axe: no detectable violations', () => {
  it('Button', async () => {
    const { container } = render(<Button>Save</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Switch', async () => {
    const { container } = render(<Switch label="Alerts" checked onChange={() => {}} />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Tabs', async () => {
    const { container } = render(<Tabs label="Demo" items={tabItems} />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Accordion', async () => {
    const { container } = render(<Accordion items={[{ id: 'x', title: 'Q', content: 'A' }]} />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Combobox', async () => {
    const { container } = render(<Combobox label="City" options={['Pune']} value={null} onChange={() => {}} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('keyboard behaviour', () => {
  it('Tabs: arrow keys move selection', async () => {
    const user = userEvent.setup()
    render(<Tabs label="Demo" items={tabItems} />)
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
  })

  it('Dialog: Escape closes', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Dialog open onClose={onClose} title="Confirm"><button>OK</button></Dialog>)
    expect(screen.getByRole('dialog', { name: 'Confirm' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('Switch: Space toggles', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch label="Alerts" checked={false} onChange={onChange} />)
    await user.tab()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
