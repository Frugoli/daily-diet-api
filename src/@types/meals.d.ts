import { z } from 'zod'

export const CreateMealsBodySchema = z.object({
  name: z.string().trim(),
  description: z.string().nonempty({ message: 'Please, enter description.' }),
  mealInterval: z.string().optional(),
  inDiet: z.boolean().default(true),
})

export const UpdatedMealsBodySchema = z.object({
  name: z.string(),
  description: z.string().nonempty({ message: 'Please, enter description.' }),
  mealInterval: z
    .string()
    .nonempty({ message: 'Please, enter meal interval.' }),
  inDiet: z.boolean(),
})
