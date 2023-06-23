import { prismaClient } from '../../prisma/prismaClient'

async function getPrismaNickname(nickname: string) {
  const responseDB = await prismaClient.user.findUnique({
    where: {
      nickname,
    },
  })
  return responseDB
}

async function getPrismaPassword(nickname: string) {
  const responseDB = await prismaClient.user.findUnique({
    where: {
      nickname,
    },
  })

  return responseDB?.password
}

async function getPrismaLink(link: string) {
  const responseDB = await prismaClient.links.findFirst({
    where: {
      link,
    },
  })

  return responseDB
}

async function getPrismaShortLink(shortLink: string) {
  const responseDB = await prismaClient.links.findFirst({
    where: {
      short: shortLink,
    },
  })

  return responseDB
}

async function createPrismaUser(nickname: string, password: string) {
  const responseDB = await prismaClient.user.create({
    data: {
      nickname,
      password,
    },
  })
  return responseDB
}

async function createPrismaLink(link: string, short: string, userId: string) {
  const responseDB = await prismaClient.links.create({
    data: {
      link,
      short,
      userId,
    },
  })

  return responseDB
}

export {
  getPrismaNickname,
  createPrismaUser,
  getPrismaPassword,
  getPrismaLink,
  getPrismaShortLink,
  createPrismaLink,
}
