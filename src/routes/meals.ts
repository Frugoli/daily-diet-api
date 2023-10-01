import { FastifyInstance } from 'fastify'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import { idParamsSchema } from '../@types/id.d'
import {
  CreateMealsBodySchema,
  UpdatedMealsBodySchema,
} from '../@types/meals.d'
import { SQL } from '../config/sqlite-connection'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    const meals = await SQL('meals').select().where('session_id', sessionId)

    return { meals }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies
    const { id } = idParamsSchema.parse(request.params)

    const getMealPlan = await SQL('meals')
      .select('*')
      .where('session_id', sessionId)
      .andWhere('id', id)

    return { getMealPlan }
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await SQL('meals')
        .count({ 'Total plans registered': '*' })
        .select({
          'Total in diet': SQL('meals').count('in_diet').where('in_diet', true),
          'Total not in diet': SQL('meals')
            .count('in_diet')
            .where('in_diet', false),
        })
        .where('session_id', sessionId)
        .first()
        .then(async (summaryResponse) => {
          const inDiets = await SQL('meals').select('*')

          let currentSequence = 0

          for (const inDiet of inDiets) {
            currentSequence =
              inDiet.in_diet === 1 ? ++currentSequence : inDiet.in_diet
          }

          return {
            ...summaryResponse,
            'Current sequence within the diet.': currentSequence,
          }
        })

      return { summary }
    },
  )

  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealPlan = CreateMealsBodySchema.safeParse(request.body)
      const { sessionId } = request.cookies

      if (createMealPlan.success) {
        const { name, description, mealInterval, inDiet } = createMealPlan.data

        await SQL('meals').insert({
          session_id: sessionId,
          id: crypto.randomUUID(),
          name,
          description,
          meal_interval: mealInterval,
          in_diet: inDiet,
        })

        return reply.status(201).send()
      }

      return reply.status(400).send(createMealPlan.error.format())
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const putMealPlan = UpdatedMealsBodySchema.safeParse(request.body)
      const { id } = idParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      if (putMealPlan.success) {
        const { name, description, mealInterval, inDiet } = putMealPlan.data

        await SQL('meals')
          .update({
            name,
            description,
            meal_interval: mealInterval,
            in_diet: inDiet,

            updated_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
          })
          .where('id', id)
          .andWhere('session_id', sessionId)

        return reply.status(200).send()
      }

      return reply.status(400).send(putMealPlan.error.format())
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { id } = idParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      await SQL('meals')
        .delete('*')
        .where('id', id)
        .andWhere('session_id', sessionId)

      return reply.status(200).send()
    },
  )
}
