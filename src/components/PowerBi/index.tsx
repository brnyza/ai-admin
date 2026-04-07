import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('./iframe'), { ssr: false }) as any

const PowerBi = ({ props, preloader = '', page = 2, filters = [] }: any) => {
  return <DynamicComponentWithNoSSR props={props} preloader={preloader} page={page} filters={filters} />
}

export { PowerBi }
