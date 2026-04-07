import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies } from 'nookies'
import { config } from './config'

export function withSSRGuest<P extends { [key: string]: any }>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)

    if (cookies[config.token]) {
      return {
        redirect: {
          destination: config.PAGINA_APOS_LOGIN,
          permanent: false
        }
      }
    }

    return await fn(ctx)
  }
}
