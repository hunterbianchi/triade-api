// Styles
import * as S from '../styles/styles'

// Cookies
import { setCookie, parseCookies, destroyCookie } from 'nookies'

// React
import { useEffect, useState } from 'react'

import { SHA256 } from 'crypto-js'

// API services
import {
  api,
  deletePendingsWithAxios,
  getChainWithFetch,
  getPendingsWithAxios,
  postChainWithAxios,
  postPendingsWithAxios
} from '../services/api'

import Input from '../components/Input'
import { RequestInit } from 'next/dist/server/web/spec-extension/request'
import PendingDisplay from '../components/PendingDisplay'
import MineBtn from '../components/MineBtn'
import ReadyScreen from '../components/ReadyScreen'
import Block from '../components/Block'


const elliptic = require("elliptic").ec
const ec = new elliptic("secp256k1")

export type HomeType = {
  viewMobileMode?: boolean;
  method?: string;
  highlight?: boolean;
  readScreenPercent?: number;
  countDown?: number;
}

//===================================================================

export default function Home(props: any) {

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [method, setMethod] = useState<string>('get')
  const [endpoint, setEndpoint] = useState<string>()
  const [body, setBody] = useState<string>()
  const [rewardAddress, setRewardAddress] = useState<string>()
  const [baseURL, setBaseURL] = useState<string>(props.baseURL)
  const [chain, setChain] = useState<Array<any>>(props.chain)
  const [pendings, setPendings] = useState<any>({})

  const [offerList, setOfferList] = useState<any>(props.offerList)
  const [orderList, setOrderList] = useState<any>(props.offerList)
  const [chainHeader, setChainHeader] = useState<any>(props.chainHeader)

  const [openMethods, setOpenMethods] = useState<boolean>(false)
  const [showing, setShowing] = useState<string>('chain')
  
  const [openReadyScreen, setOpenReadyScreen] = useState<boolean>(false)

  const [fullnodeList, setFullnodeList] = useState<Array<any>>([])
  const [endPointList, setEndPointList] = useState<Array<any>>([])
  const [metaverseList, setMetaverseList] = useState<Array<any>>([{
  }])


  

  function addFullnode({newFullnode}:any){

  }

  function getFullnodeList(){

  }

  function getChainHeader(){

  }


  /* 
    function getBalanceOf(walletAddres:string){
  
      console.log('target wallet', walletAddres)
      let balance:number = 0
  
      for (let i = 0; i < chain.length; i++) {
  
        const block = chain[i]
        
        for(const dataHash in block.data){
  
          const data = block.data[dataHash]
          console.log('data', data)
  
          if(data.toAddress && data.toAddress === walletAddres){
  
            console.log('to address?', walletAddres === data.toAddress)
            balance = balance + data.amount
  
          }else if (data.fromAddress && data.fromAddress === walletAddres){
  
            console.log('from address?', walletAddres === data.fromAddress)
            balance = balance - data.amount
  
          }
        }
      }
      return balance
    }
    */

  async function fetchEndpoint(e: any) {

    e.preventDefault()

    if (!endpoint) {
      setEndpoint(`${baseURL}api/chain`)
    }


    if (method === 'get') {

      try {
        await fetch(endpoint ? endpoint : `${baseURL}api/chain`).then(res => res.json())
          .then(res => {
            if (res.length > 0) {
              console.log('chain', res)
              setChain(res)
            } else if (Object.keys(res).length > 0) {
              console.log('pending', res)
              setPendings(res)
            }
          })

      } catch (error) { }

    } else if (method === 'post') {

      const data = () => {

        if (body) {
          console.log(method, eval(body), ' at ', endpoint)
          return eval(body)
        } else {
          return []
        }
      }

      const options: RequestInit = {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json'
        }
      }

      if (endpoint === `${baseURL}api/chain`) {

        options.body = JSON.stringify({
          type: 'new-block',
          rewardAddress,
          data: data()
        })

      } else if (endpoint === `${baseURL}api/pendings`) {
        options.body = JSON.stringify(data())

      }

      try {

        await fetch(endpoint ? endpoint : `${baseURL}api/pendings`, options).then(res => res.json())
          .then(res => {
            if (res.length > 0) {
              console.log('chain', res)
              setChain(res)
              setMethod('get')
            } else if (Object.keys(res).length > 0) {
              console.log('pending', res)
              setPendings(res)
              setMethod('get')
            }
        })

      } catch (error) { }

    } else if (method === 'delete') {

      console.log('endpoint', endpoint)

      try {
        await fetch(endpoint ? endpoint : `${baseURL}api/pendings`, {
          method: method.toUpperCase(),
        })
          .then(res => res.json())
          .then(res => {
            if (typeof (res.length) === 'number') {
              console.log('chain', res)
              setChain(res)
            } else if (typeof (Object.keys(res).length) === 'number') {
              console.log('pending', res)
              setPendings(res)
            }
          })

      } catch (error) { }
    }

  }

  useEffect(()=>{
    alert(JSON.stringify(chain))
    alert(JSON.stringify(chainHeader))
    alert(JSON.stringify(offerList))
    alert(JSON.stringify(orderList))
    alert(JSON.stringify(pendings))
  }, [])

  const mock:any[] = [{
    index: 104830,
    timestamp: new Date().getTime(),
    nonce: 3872,
    hash: 'c40238097fd7ebb8d345217548bf274fe7ab71bec899a2d82e872f1dc441001e'
  },{
    index: 104831,
    timestamp: new Date().getTime(),
    nonce: 173972,
    hash: 'c40238097fd7ebb8d345217548bf274fe7ab71bec899a2d82e872f1dc441001e'
  },{
    index: 104832,
    timestamp: new Date().getTime(),
    nonce: 124573,
    hash: 'c40238097fd7ebb8d345217548bf274fe7ab71bec899a2d82e872f1dc441001e'
  },{
    index: 104833,
    timestamp: new Date().getTime(),
    nonce: 7344,
    hash: 'c40238097fd7ebb8d345217548bf274fe7ab71bec899a2d82e872f1dc441001e'
  }]


  //===================================================================


  return (
    <S.Wrapper>
      <S.Float>
        <S.ChainHeader>
          <S.HashWrapper>
            {`Genesis Hash: ${SHA256('TRÍADE').toString()}`}
          </S.HashWrapper>
          <S.HashWrapper>
            {`Last Hash: ${SHA256('META').toString()}`}
          </S.HashWrapper>
          <S.NetworkInfoWrapper>
            {`Pending Tokens: ${2345}`}
            {` - `}
            {`Nodes: ${325}Mi`}
            {` - `}
            {`Miners: ${352}Mi`}
          </S.NetworkInfoWrapper>
          <S.ChainInfoWrapper>
            {`Chain Length: ${104833}`}
            {` - `}
            {`Target: ${0x00017320}`}
            {` - `}
            {`Fee: ${50}`}
          </S.ChainInfoWrapper>
        </S.ChainHeader>
        <S.ChainContainer>
          {mock.map((element)=>{
            return(
              <Block key={Math.random()} data={element}/>
            )
          })}
          
        </S.ChainContainer>
        <S.Footer>
        
        {JSON.stringify({
            test: "json"
          })}
          {JSON.stringify(offerList)}
          {JSON.stringify(orderList)}
          {JSON.stringify(chainHeader)}
          <label>
            <p>:</p>
            <input type={'text'}/>
          </label>
        </S.Footer>
      </S.Float>

      {/* {isLoading && <Loading />}

      <S.Form onSubmit={fetchEndpoint}>
        <S.InputContainer>
          {openMethods && <S.MethodOptions >
            <div onClick={e => chooseMethod(e, 'get')} >{`GET`}</div>
            <div onClick={e => chooseMethod(e, 'post')} >{`POST`}</div>
            <div onClick={e => chooseMethod(e, 'delete')} >{`DELETE`}</div>
          </S.MethodOptions>}
          <S.Methods onClick={openMethod}>{method.toUpperCase()}</S.Methods>
          <Input placeHolder={`${baseURL}api/chain`} value={endpoint} handleValue={setURL} />
          <S.SendBtn>Send request</S.SendBtn>
        </S.InputContainer>
        {method === 'post' && <><S.InputContainer>
          <Input placeHolder={`miner wallet`} value={rewardAddress} handleValue={handleWallet} />
        </S.InputContainer>
          <S.BodyContainer>
            <textarea placeholder={`[{"key":"value"}]`} value={body} onChange={setBodyValue} style={{ width: '100%', height: '100%', resize: 'none' }} />
          </S.BodyContainer></>}
      </S.Form>

      <S.SwitchWrapper>
        <S.SwitchChainBtn highlight={showing === 'chain'} onClick={e=>setShowing('chain')}>Chain</S.SwitchChainBtn>
        <S.SwitchChainBtn highlight={showing === 'pendings'} onClick={e=>setShowing('pendings')}>Pendings</S.SwitchChainBtn>
      </S.SwitchWrapper>

      <S.MineBtnContainer>
        <MineBtn/>
      </S.MineBtnContainer>

      {chain.length > 0 && showing === 'chain' && <S.ChainContainer>
      
        {chain.map((block) => (
        <div key={block.hash}>
          {`block:
            Mined at: ${new Date(block.timestamp)}
            Hash: ${block.hash}
            Nonce: ${block.nonce}
            Ndata: ${Object.keys(block.data).length}`}
        </div>
        ))}

      </S.ChainContainer>}

      {Object.keys(pendings).length > 0 && showing === 'pendings' && <S.PendingsContainer>
        
        {Object.keys(pendings).map((dataHash) => {
        console.log('jdhafjzsgh ', dataHash)
        const pending = pendings[dataHash]
        console.log(pendings[dataHash])
        return (
          <PendingDisplay key={dataHash} data={pending} />
        )
      })}</S.PendingsContainer>}
 */}

    {openReadyScreen && <ReadyScreen/>}
    </S.Wrapper>
  )
}


//===================================================================


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

}
