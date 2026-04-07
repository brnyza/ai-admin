import type { GetServerSideProps } from 'next'
import { config } from '@/utils/config'

function Page() {
  return <div />
}

export default Page

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: config.PAGINA_APOS_LOGIN
    },
    props: {}
  }
}
