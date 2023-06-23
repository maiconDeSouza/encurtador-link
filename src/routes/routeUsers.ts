import { FastifyInstance } from 'fastify'
import {
  createLink,
  createUsers,
  loginUser,
  redirect,
} from '../Controllers/controllersUsers'

export async function routeUsers(app: FastifyInstance) {
  app.post('/', createUsers)
  app.post('/login', loginUser)
  app.post('/links', createLink)
  app.get('/:li', redirect)
}
