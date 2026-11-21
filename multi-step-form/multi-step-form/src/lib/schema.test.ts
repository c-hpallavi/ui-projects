import { describe, expect, it } from 'vitest'
import { schema } from './schema'

const valid = {
  fullName: 'Pallavi R', email: 'p@example.com', phone: '9876543210', role: 'Frontend developer' as const,
  experience: 2, skills: ['React'], sessions: ['Lightning talks'], consent: true,
}

describe('registration schema', () => {
  it('accepts valid data', () => expect(schema.safeParse(valid).success).toBe(true))
  it('rejects a bad phone number', () => expect(schema.safeParse({ ...valid, phone: '12345' }).success).toBe(false))
  it('requires consent', () => expect(schema.safeParse({ ...valid, consent: false }).success).toBe(false))
  it('requires at least one skill', () => expect(schema.safeParse({ ...valid, skills: [] }).success).toBe(false))
})
