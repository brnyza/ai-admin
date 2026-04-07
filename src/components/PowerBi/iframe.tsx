import Image from 'next/legacy/image'
import type { Embed, Report, VisualDescriptor } from 'powerbi-client'
import { models } from 'powerbi-client'
import { PowerBIEmbed } from 'powerbi-client-react'
import { useEffect, useState } from 'react'
import 'powerbi-report-authoring'
import { Box } from '@mui/material'
import Head from 'next/head'
import { api } from '@/services/api'
import { createBoxMessage } from '@/utils/createLogMessage'

const pagesAlreadyOpened: string[] = []
let timesUpdated = 0
const eventosPbi: any[] = []

const { origin, pathname, search } = window.location

const Iframe = ({ props, preloader, page, filters }: any) => {
  const { id_relatorio, token, relatorio, usuario } = props as Record<string, string>
  const from = `clientePbi/${relatorio}/${usuario}`
  const dataPaginaAberta = new Date()
  let sessionId = '?'
  let ws: WebSocket

  const verificaEventosParaEnviar = () => {
    console.info('verificaEventosParaEnviar', eventosPbi.length)
    if (eventosPbi.length === 0) return
    for (let index = 0; index < eventosPbi.length; index++) {
      if (!ws) return
      if (ws.readyState !== WebSocket.OPEN) return
      sendWs({ cmd: eventosPbi[index]?.cmd, detail: eventosPbi[index]?.detail })
      delete eventosPbi[index]
    }
  }

  const Inicia_websocket = () => {
    if (ws) {
      if (ws.readyState === WebSocket.OPEN) return
    }
    ws = new WebSocket('wss://ws.bluemarble.com.br')
    ws.onmessage = (evt: any) => onMessage(evt)
    ws.onopen = (evt: any) => console.info('WS onopen.', evt)
    ws.onclose = (evt: any) => onClose(evt)
    ws.onerror = (evt: any) => console.error('WS onError', evt)
  }

  const onClose = (evt: any) => {
    console.info('WS Desconectado:', { code: evt.code })
    console.info(evt)
    setTimeout(VerificaConexao, 1000 * 60 * 2) // depois de 2 minutos tenta reconectar
  }
  const onMessage = async (evt: any) => {
    const { data } = evt
    try {
      const obj = JSON.parse(data)
      if (obj.cmd) {
        if (obj.cmd === 'connection') {
          if (obj.sessionId) {
            sessionId = obj.sessionId
            sendWs({ cmd: 'connection' })
          }
        } else if (obj.cmd === 'refresh') {
          window.location.reload()
        } else if (obj.cmd === 'reload') {
          // await updateReports()
          await reportRefresh('reportRefresh')
        } else if (obj.cmd === 'ping') {
          sendWs({ cmd: 'pong' })
        }
      }
    } catch (err: any) {
      console.error('catch dataJson', err.message)
    }
  }

  const VerificaConexao = () => {
    if (ws.readyState !== WebSocket.OPEN) {
      console.error('ws não está conectado, status ws: ', ws.readyState)
      console.info('Tentativa de conexão Websocket')
      // ws = new WebSocket(wsEndpoint, null, wsTimeout)
      Inicia_websocket()
    }
  }

  const sendWs = ({ cmd, detail }: { cmd: string; detail?: string }) => {
    if (!ws) return
    VerificaConexao()
    ws.send(
      JSON.stringify({
        cmd,
        dataPaginaAberta,
        from,
        sessionId,
        origin,
        pathname,
        search,
        detail
      })
    )
  }

  const [report, setReport] = useState<Report>()
  const [lastUpdateDate, setLastUpdateDate] = useState<Date>()
  const [tokenExpiresDate, setTokenExpiresDate] = useState<Date>()
  const [loading, setLoading] = useState(true)

  async function updatePage() {
    if (!report) return
    const pages = await report.getPages()
    pages[page]?.setActive()
  }

  async function filtrar(slicerVisuals: VisualDescriptor[], column: string, values: string[] | number[]) {
    try {
      const getSlicer = slicerVisuals.find((v) => v.title === column)
      const getSlicerState = await getSlicer?.getSlicerState()
      const targets = getSlicerState?.targets
      if (targets && targets.length > 0) {
        const filter: models.ISlicerFilter = {
          $schema: 'http://powerbi.com/product/schema#basic',
          target: {
            table: targets[0]?.table || '',
            column: (targets[0] as any)?.column
          },
          filterType: 1,
          operator: 'In',
          values
        }
        await getSlicer?.setSlicerState({ filters: [filter] })
      }
    } catch (e: any) {
      console.error(`erro no slicer ${column},`, e.message)
    }
  }

  async function setFilterToday(report: Report) {
    const pages = await report.getPages()
    const activePage = pages.find((page) => page.isActive)
    const nomePagina = activePage?.displayName
    console.info('página atual', nomePagina)
    const visuals = await activePage?.getVisuals()
    const slicerVisuals = visuals?.filter(({ type }) => type === 'slicer')
    if (slicerVisuals === undefined || slicerVisuals?.length === 0) return

    if (nomePagina === 'Performance Mensal') {
      const visualAteDia = visuals?.find(({ title }) => title === 'AteDia')
      if (visualAteDia) {
        await visualAteDia.setSlicerState({ filters: [] }) // Limpando ele coloca até o útlimo dia possível
      }
      const mesEAnoParaSetar = `${new Date().toLocaleString('pt-br', { month: '2-digit' })}/${new Date().getFullYear()}` // Ex.: '06/2025'
      await filtrar(slicerVisuals, 'MêsEAno', [mesEAnoParaSetar])
    }

    if (nomePagina !== 'Performance Mensal') await filtrar(slicerVisuals, 'Dia', [new Date().getDate()])
    await filtrar(slicerVisuals, 'Mês', [new Date().toLocaleString('pt-br', { month: 'long' })])
    await filtrar(slicerVisuals, 'Ano', [new Date().getFullYear()])

    if (nomePagina === 'Carregamento Navio') {
      const slicerNavio = slicerVisuals.find(({ title }) => title === 'Navio')
      if (slicerNavio) {
        const naviosArr = await retornaDadosDoVisual(slicerNavio)
        console.info('Último navio', naviosArr[0])
        if (naviosArr[0]) await filtrar(slicerVisuals, 'Navio', [naviosArr[0]])
      }
    }

    if (nomePagina === 'Descarga do Comboio') {
      const slicerComboio = slicerVisuals.find(({ title }) => title === 'Comboio')
      if (slicerComboio) {
        const comboiosArr = await retornaDadosDoVisual(slicerComboio)
        console.info('Último comboio', comboiosArr[0])
        if (comboiosArr[0]) await filtrar(slicerVisuals, 'Comboio', [comboiosArr[0]])
      }
    }
  }

  const retornaDadosDoVisual = async (visual: VisualDescriptor) => {
    const dados = await visual.exportData(models.ExportDataType.Summarized, 100)
    const dadosArr = dados.data.split('\r\n').slice(0, -1) // retira última linha
    const [, ...dadosArrSemCabecalho] = dadosArr // retira a primeira
    return dadosArrSemCabecalho
  }

  async function updateReports() {
    if (!tokenExpiresDate) return console.info(`xxx No expires Token date ${new Date().toLocaleString()}`)
    const expiresDateTokenPlus1Hour = new Date().setTime(tokenExpiresDate.getTime() + 1 * 60 * 60 * 1000)

    const updatedMessage = createBoxMessage(`Updated on ${new Date().toLocaleString()}`)
    if (expiresDateTokenPlus1Hour - 1000 * 10 < Date.now()) {
      try {
        const { data } = await api.get('/report/token', { params: { report: relatorio } })
        setTokenExpiresDate(new Date(data.data))
        await report?.setAccessToken(data.token)
        const updatedMessage = createBoxMessage(`T Refresh on ${new Date().toLocaleString()}`)
        await reportRefresh(updatedMessage)
      } catch (error) {
        console.error(`XXX Error trying get new token ${new Date().toLocaleString()}`)
        console.error(error)
      }
    } else {
      await reportRefresh(updatedMessage)
    }
  }

  async function reportRefresh(updatedMessage) {
    if (!report) console.error('reportRefresh, erro, !report')
    await report?.refresh()
    console.info(updatedMessage)
    timesUpdated += 1
  }

  async function verifyUpdateReport() {
    verificaEventosParaEnviar()

    try {
      const { reportLastUpdate } = await getReportLastUpdate({ report: relatorio as string })
      const lastUpadtedDateFromServer = new Date(reportLastUpdate)
      const expiresDateTokenPlus1Hour = new Date().setTime(Number(tokenExpiresDate?.getTime()) + 1 * 60 * 60 * 1000)
      const logMessage = `
┌─────────────────────────────────────┐
│ ≡ Summary                           │
├─────────────────────────────────────┤
│ Exp Token:     ${new Date(expiresDateTokenPlus1Hour).toLocaleString()}  │
│ From Server:   ${lastUpadtedDateFromServer.toLocaleString()}  │
│ Local:         ${lastUpdateDate?.toLocaleString()}  │
│ Times Updated: ${timesUpdated.toLocaleString('pt-br', {
        minimumIntegerDigits: 2
      })}                   |
└─────────────────────────────────────┘
`
      const hasUpdatedMessage = createBoxMessage('Updating')
      console.info(logMessage)
      if (new Date(reportLastUpdate).toLocaleString() === new Date(String(lastUpdateDate)).toLocaleString()) return
      console.info(hasUpdatedMessage)
      setLastUpdateDate(new Date(reportLastUpdate))
      updateReports()
    } catch (error) {
      console.info(error)
    }
  }

  async function getTokenExpiresDate() {
    try {
      const { data } = await api.get('/report/token', { params: { report: relatorio } })
      if (relatorio) {
        const { reportLastUpdate } = await getReportLastUpdate({ report: relatorio })
        setLastUpdateDate(new Date(reportLastUpdate))
      }
      const tokenExpiresDate = new Date(data.data)
      setTokenExpiresDate(tokenExpiresDate)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (loading) return
    if (report?.iframeLoaded) console.info('Carregado')
    updatePage()
    if (report) setFilterToday(report)
    getTokenExpiresDate()
    Inicia_websocket()
  }, [loading])

  // useEffect(() => {
  //   report?.on('loaded', () => setLoading(false))
  // }, [report])

  useEffect(() => {
    if (!tokenExpiresDate) return
    clearInterval(1)
    const updateInterval = setInterval(verifyUpdateReport, 60 * 1000) // cada 1min

    return () => clearInterval(updateInterval)
  }, [tokenExpiresDate, lastUpdateDate])

  return (
    <>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            left: 0,
            top: 0,
            backgroundColor: '#fff'
          }}
        >
          <Image src={preloader} alt="Preloader" width={500} height={500} />
        </Box>
      )}

      <Head>
        <style>
          {`#__next, body, html { width: 100%; height: 100% }
.report-style-class { height: 99%; border: 'none' }
iframe {
  border: 0;
}
          `}
        </style>
      </Head>
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          pageName: 'Carregamento',
          id: id_relatorio,
          accessToken: token,
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              },
              pageNavigation: { visible: false }
            }
          },
          filters
        }}
        eventHandlers={
          new Map([
            ['loaded', () => console.info('[PowerBI:loaded]')],
            [
              'pageChanged',
              (event, report) => {
                const pageName = event.detail.newPage.displayName
                console.info('[PowerBI:pageChanged]', pageName)
                eventosPbi.push({ cmd: 'pageChanged', detail: pageName })

                if (!pagesAlreadyOpened.includes(pageName)) {
                  pagesAlreadyOpened.push(pageName)
                  setFilterToday(report as Report)
                }
              }
            ],
            [
              'rendered',
              async () => {
                setLoading(false)
                console.info('[PowerBI:rendered]')
              }
            ],
            [
              'error',
              (event) => {
                console.error('[PowerBI:Error]', event?.detail)
                eventosPbi.push({ cmd: 'pbiError', detail: event?.detail })
              }
            ]
          ])
        }
        cssClassName={'report-style-class'}
        getEmbeddedComponent={(embeddedReport: Embed) => {
          setReport(embeddedReport as Report)
        }}
      />
    </>
  )
}

async function getReportLastUpdate({ report }: { report: string }) {
  const responseUpdate = await fetch(`https://sb.bluemarble.com.br/blank_powerbi_atualizacao/?ultimaAtualizacao&relatorio=${report}`)
  const reportLastUpdate = await responseUpdate.text()
  return { reportLastUpdate }
}

export default Iframe
