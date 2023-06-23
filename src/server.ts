import fastify from 'fastify'
import { routeUsers } from './routes/routeUsers'
import fastifyJwt from '@fastify/jwt'
import { z } from 'zod'

import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.string()

export const app = fastify()

app.register(fastifyJwt, {
  secret: envSchema.parse(process.env.SECRET),
})

app.register(routeUsers, {
  prefix: '/users',
})

app
  .listen({
    port: 2005,
  })
  .then(() => console.log(`Server on...`))
