import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import {
  createPrismaLink,
  createPrismaUser,
  getPrismaLink,
  getPrismaNickname,
  getPrismaPassword,
  getPrismaShortLink,
} from '../Model/model'
import { cryptoPass } from '../utils/cryptonPass'

async function createUsers(request: FastifyRequest, replay: FastifyReply) {
  const schemaNickname = z.object({
    nickname: z.string(),
    password: z.string(),
    rPassword: z.string(),
  })

  const { nickname, password, rPassword } = schemaNickname.parse(request.body)

  if (password !== rPassword) {
    return replay.status(409).send({
      message: `A senhas tem que ser iguais!`,
    })
  }

  const cryptonPass = await cryptoPass(password)

  const responseDB = await getPrismaNickname(nickname)

  if (responseDB) {
    return replay.status(409).send({
      message: `Nickname em uso!`,
    })
  }

  const responseCreate = await createPrismaUser(nickname, cryptonPass)

  replay.status(201).send(responseCreate)
}

async function loginUser(request: FastifyRequest, replay: FastifyReply) {
  const schemaLogin = z.object({
    nickname: z.string(),
    password: z.string(),
  })
  console.log(schemaLogin)
  const { nickname, password } = schemaLogin.parse(request.body)

  const cryptonPass = await cryptoPass(password)

  const passwordDB = await getPrismaPassword(nickname)

  if (cryptonPass !== passwordDB) {
    return replay.status(401).send({
      message: `Usuário ou senha inválidos!`,
    })
  }

  const user = await getPrismaNickname(nickname)

  const token = await replay.jwtSign(
    {},
    {
      sign: {
        sub: user?.id,
      },
    },
  )

  replay.status(200).send({
    messagae: `Login Feito!`,
    token,
  })
}

async function createLink(request: FastifyRequest, replay: FastifyReply) {
  const schemaID = z.string()
  await request.jwtVerify()

  const id = schemaID.parse(request.user.sub)

  const schemaLink = z.object({
    link: z.string(),
    shortLink: z.string(),
  })

  const { link, shortLink } = schemaLink.parse(request.body)

  const linkDB = await getPrismaLink(link)

  const shortLinkDB = await getPrismaShortLink(
    `http://localhost:2005/${shortLink}`,
  )

  if (linkDB) {
    return replay.status(409).send({
      message: `Link já em uso!`,
    })
  }

  if (shortLinkDB) {
    return replay.status(409).send({
      message: `mini link já em uso!`,
    })
  }

  const createShortLink = `http://localhost:2005/${shortLink}`

  const createLinkDB = await createPrismaLink(link, createShortLink, id)

  replay.send({
    link: createLinkDB,
  })
}

async function redirect(request: FastifyRequest, replay: FastifyReply) {
  const schemaLink = z.object({
    li: z.string(),
  })

  const { li } = schemaLink.parse(request.params)

  const redirect = await getPrismaShortLink(`http://localhost:2005/${li}`)

  if (redirect) {
    replay.redirect(redirect.link)
  } else {
    replay.status(404).send({
      message: `Pagina não encontrada`,
    })
  }
}

export { createUsers, loginUser, createLink, redirect }
