import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { CreateUserBodySchema } from '../@types/users.d'
import { SQL } from '../config/sqlite-connection'
import { createSessionId } from '../utils/create-session-id'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await SQL('users').select('*')

    return { users }
  })

  app.post('/', async (request, reply) => {
    const createUser = CreateUserBodySchema.safeParse(request.body)

    const sessionId = await createSessionId(request, reply)

    if (createUser.success) {
      const { name, email, password, age } = createUser.data

      const userExists = await SQL('users')
        .select('email')
        .where({ email })
        .first()

      if (!userExists) {
        await SQL('users').insert({
          id: crypto.randomUUID(),
          session_id: sessionId,
          name,
          email,
          password,
          age,
        })

        return reply.status(201).send()
      }
    }

    return reply
      .status(401)
      .send({ message: 'Conflict: user has been created.' })
  })
}
