import { z } from 'zod'

export const CreateUserBodySchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ message: 'Name cannot be empty.' })
    .max(24, { message: 'Name can have a maximum of 24 characters.' }),
  email: z
    .string()
    .trim()
    .nonempty({ message: 'Email cannot be empty.' })
    .email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(24, { message: 'Password cannot exceed 24 characters.' }),
  age: z.number().nullable().optional(),
})
