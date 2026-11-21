import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LikeBurst } from './tiles/LikeBurst'

describe('LikeBurst', () => {
  it('toggles and updates the count', async () => {
    const user = userEvent.setup()
    render(<LikeBurst />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    expect(btn).toHaveAccessibleName('Like, 129 likes')
  })
})
