import { z } from 'zod'

export const ROLES = ['Student', 'Frontend developer', 'Designer', 'Full-stack developer', 'Other'] as const
export const SKILLS = ['React', 'TypeScript', 'CSS and Tailwind', 'Accessibility', 'Testing', 'Performance'] as const
export const SESSIONS = ['Building design systems', 'Streaming AI interfaces', 'Accessibility audits live', 'Lightning talks'] as const

export const schema = z.object({
  // Step 1
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().min(1, 'Enter your email address').email('Enter an email like name@example.com'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit mobile number starting with 6 to 9'),
  // Step 2
  role: z.enum(ROLES, { error: 'Choose the option closest to your role' }),
  experience: z.number({ error: 'Enter your years of experience, or 0' }).min(0, 'Years cannot be negative').max(40, 'Enter a number up to 40'),
  skills: z.array(z.string()).min(1, 'Pick at least one skill'),
  // Step 3
  sessions: z.array(z.string()).min(1, 'Choose at least one session'),
  notes: z.string().max(200, 'Keep this under 200 characters').optional(),
  consent: z.boolean().refine((v) => v === true, 'Agree to the code of conduct to register'),
})

export type FormValues = z.infer<typeof schema>

export const STEPS = [
  { title: 'About you', fields: ['fullName', 'email', 'phone'] },
  { title: 'Your work', fields: ['role', 'experience', 'skills'] },
  { title: 'Sessions', fields: ['sessions', 'notes', 'consent'] },
  { title: 'Review', fields: [] },
] as const satisfies readonly { title: string; fields: readonly (keyof FormValues)[] }[]
