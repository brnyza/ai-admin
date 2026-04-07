import { useAlert } from '@bluemarble/bm-components'
import { useEffect, useState } from 'react'
import { withSSRAuth } from '@/utils/withSSRAuth'
import type { IProfile } from './api/profiles/index.api'

function Page() {
  const [data, setData] = useState<IProfile[]>([])
  const { createAlert } = useAlert()

  useEffect(() => {
    fetch('/api/profiles')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setData(data.result)
      })
      .catch((error) => {
        createAlert(error.message, 'error')
      })
  }, [])

  return (
    <div>
      Profiles:
      {data.map((item) => (
        <div key={item.id}>
          {item.id} - {item.name} - {item.apikey}
        </div>
      ))}
    </div>
  )
}

export default Page
export const getServerSideProps = withSSRAuth(async () => ({ props: {} }))
