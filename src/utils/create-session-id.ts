import { FastifyReply, FastifyRequest } from 'fastify'
import crypto from 'node:crypto'

export async function createSessionId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  let sessionId = request.cookies.sessionId

  if (!sessionId) {
    sessionId = crypto.randomUUID()

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
    })
  }

  return sessionId
}
