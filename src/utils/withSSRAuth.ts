import type { sec_groups } from 'generated/prisma/client'
import jwt from 'jsonwebtoken'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies } from 'nookies'
import { prisma } from '@/libs/prisma'
import { validateUserPermissions } from '@/utils/validateUserPermissions'
import { config } from './config'

type WithSSRAuthOptions = {
  groups?: string[]
}

type UserProps = {
  id: string
  groups: sec_groups[]
}

export function withSSRAuth<P>(fn: (ctx: GetServerSidePropsContext, user: UserProps) => Promise<GetServerSidePropsResult<P>>, options?: WithSSRAuthOptions) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)
    const token = cookies[config.token]

    if (!token) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false
        }
      }
    }

    const sessionToken = jwt.decode(token) as { sub: string }
    const storageUser = await prisma.sec_users.findUnique({
      where: {
        login: sessionToken.sub
      },
      include: {
        sec_users_groups: {
          select: {
            sec_groups: true
          }
        }
      }
    })
    // await prisma.$disconnect()

    if (!storageUser) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false
        }
      }
    }

    const user = {
      id: storageUser.login,
      groups: storageUser.sec_users_groups.map((groups) => groups.sec_groups)
    }

    if (options) {
      const { groups } = options
      const userHasValidPermissions = validateUserPermissions({
        user,
        groups
      })

      if (!userHasValidPermissions) {
        return {
          notFound: true
        }
      }
    }

    try {
      return await fn(ctx, user)
    } catch (error) {
      // if (error instanceof AuthTokenError) {
      //     destroyCookie(ctx, 'geopi.token')
      //     destroyCookie(ctx, 'geopi.refreshToken')
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
      // }
    }
  }
}
