import { describe, expect, it } from 'vitest'
import { inr, makeOrders } from './data'

describe('orders data', () => {
  it('is deterministic between loads', () => {
    expect(makeOrders(20)).toEqual(makeOrders(20))
  })
  it('formats rupees with Indian grouping', () => {
    expect(inr(123456)).toContain('1,23,456')
  })
})
