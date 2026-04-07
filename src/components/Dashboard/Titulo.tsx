import { IconButton, Stack, Typography } from '@mui/material'
import Head from 'next/head'
import Image from 'next/legacy/image'
import { MdInfo } from 'react-icons/md'
import logoImg from '@/assets/logo-site-branco.png'

export const Titulo = ({ nomeTitulo, nome, height, dataHora, estadaId }: { nomeTitulo: string; nome: string; height: string; dataHora: string; estadaId?: number }) => {
  const isRelatorioOperacionalNavio = nome.includes('Relatório Operacional de Carregamento Navio')
  const isRelatorioOperacionalBarcaca = nome.includes('Descarga do Comboio')
  return (
    <Stack sx={{ width: '99%', height: { height }, alignItems: 'center', flexDirection: 'row' }}>
      <Head>
        <title>{nomeTitulo}</title>
      </Head>

      <Typography fontSize={20} color="#c9c9c9" sx={{ textAlign: 'left', ml: 3, width: '90%', height: '40px', alignContent: 'center' }}>
        {nome}
      </Typography>
      {isRelatorioOperacionalNavio && estadaId && (
        <IconButton href={`/relatorio-operacional-navio/eventos?id=${estadaId}`}>
          <MdInfo color="#c9c9c9" size={20} title="Análise Eventos Navio" />
        </IconButton>
      )}
      {isRelatorioOperacionalBarcaca && estadaId && (
        <IconButton href={`/relatorio-operacional-barcaca/eventos?id=${estadaId}`}>
          <MdInfo color="#c9c9c9" size={20} title="Análise Eventos Barcaça" />
        </IconButton>
      )}
      <Stack sx={{ width: '10%', height: '100%', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography fontSize={11} color="#c9c9c9" sx={{ textAlign: 'center', alignContent: 'center' }}>
          Última Atualização
        </Typography>
        <Typography fontSize={11} color="#c9c9c9" sx={{ textAlign: 'center', alignContent: 'center' }}>
          {dataHora}
        </Typography>
      </Stack>
      <Image src={logoImg} alt="a" objectFit="contain" width={55} height={55} />
    </Stack>
  )
}
