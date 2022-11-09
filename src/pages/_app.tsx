
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import GlobalStyles from '../styles/global'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
      <title>TRÍADE API</title>
      <meta name="description" content="Tríade's API" />
      <link rel="icon" href="/favicon.ico" />

      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#ff00ff" />
      <meta name="theme-color" content="#ff00ff" />

    </Head>
    <GlobalStyles />
    <Component {...pageProps} />
    </>
  )
}
/* 
export async function getServerSideProps(context: any) {

  const cookies = parseCookies(context)

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL

  const chain: Array<any> = require('../json/chain.json')
  const genesis = chain[0]
  console.log(genesis)

  const orderList = {}
  const offerList = {}
  const chainHeader = {}

  // console.log(`\nGENESIS HASH:\n${SHA256(genesis.timestamp + genesis.previousHash + JSON.stringify(genesis.data) + genesis.nonce).toString()}\n`)

  try {
    await fetch(`${baseURL}/chain`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        type: 'get-chain-header',
        data: {}
      })
    }).then((res: any) => res.json()).then((res: any)=>{
      const { data } = res
      const newChainHeader = data

      Object.assign(chainHeader, newChainHeader)
    })
  } catch (error) {
    throw new Error(`Error while fetching chain from ${baseURL}/chain`)
  } finally {
    try {
      await fetch(`${baseURL}/chain`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          type: 'get-chain',
          data: chain
        })
      }).then((response: any) => response.json()).then((response: any)=>{
        const { data } = response
        const newChain = data
  
        Object.assign(chain, newChain)
  
      })
    }catch (err) {
      throw new Error(`Error while fetching chain from ${baseURL}/chain`)
    }

    return {
      props: {
        baseURL,
        chain,
        privateKey: cookies.PRIVATE_KEY ? cookies.PRIVATE_KEY : '',
        offerList,
        orderList,
        chainHeader,
        countDown: 10,
      },
    }
  }

} */