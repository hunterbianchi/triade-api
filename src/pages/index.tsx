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
import Image from 'next/image'


const elliptic = require("elliptic").ec
const ec = new elliptic("secp256k1")

export type HomeType = {
  viewMobileMode?: boolean;
  method?: string;
  highlight?: boolean;
  isLoading?: boolean;
  readScreenPercent?: number;
  countDown?: number;
}


import image from "../images/universe.jpg"
//===================================================================

export default function Home(props: any) {

  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const [ method, setMethod ] = useState<string>('get')
  const [ endpoint, setEndpoint ] = useState<string>()
  const [ body, setBody ] = useState<string>()
  const [ rewardAddress, setRewardAddress ] = useState<string>()
  // const [ baseURL, setBaseURL ] = useState<string>(props.baseURL)
  // const [ pendings, setPendings ] = useState<any>({})
// 
  // const [ offerList, setOfferList ] = useState<any>(props.offerList)
  // const [ orderList, setOrderList ] = useState<any>(props.offerList)
  
  const [ myChainHeader, setMyChainHeader ] = useState<any>({})
  const [ myChain, setMyChain ] = useState<Array<any>>([])
  const [ openMethods, setOpenMethods ] = useState<boolean>(false)
  const [ showing, setShowing ] = useState<string>('chain')
  const [ baseURL, setBaseURL ] = useState<any>(process.env.NEXT_PUBLIC_BASE_URL)
  const [ pendingDatas, setPendingDatas ] = useState<Array<any>>([])
  const [ endpointList, setEndpointList ] = useState<Array<any>>([])
  const [ orderList, setOrderList ] = useState<Array<any>>([])
  const [ offerList, setOfferList ] = useState<Array<any>>([])
  
  const [ openReadyScreen, setOpenReadyScreen ] = useState<boolean>(false)

  const [ fullnodeList, setFullnodeList] = useState<Array<any>>([])
  const [ endPointList, setEndPointList] = useState<Array<any>>([])
  const [ metaverseList, setMetaverseList] = useState<Array<any>>([{
  }])


  
function treatResponse(response: any){
  const {type} = response
  if(type === 'new-offer-list'){
    const newOfferList = response.data
    setOfferList(newOfferList)
  } else if(type === 'new-order-list'){
    const newOrderList = response.data
    setOrderList(newOrderList)
  } else if(type === 'new-endpoint-list'){
    const newEndpointList = response.data
    setEndpointList(newEndpointList)
  } else if(type === 'new-pending-datas'){
    const newPendingDatas = response.data
    setPendingDatas(newPendingDatas)
  } else if(type === 'new-chain'){
    const newChain = response.data
    setMyChain(newChain)
  } else if(type === 'new-chain-header'){
    const newChainHeader = response.data
    setMyChainHeader(newChainHeader)
  }
}

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
   
/* 
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

*/

  async function dataFetch(e?: any){
    e?.preventDefault()
    setIsLoading(true)
    try {
      const newChainHeader = await fetch(`${baseURL}/chain`, {
        method: 'GET',
        headers: {
          'Content-Type':'application/json'
        }
      }).then(res=>res.json()).then(res=>{
        return res.data
      })
      setMyChainHeader(newChainHeader)

      console.log("new-chain-header\n",newChainHeader)

      const newChain = await fetch(`${baseURL}/chain`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          type: "get-chain",
          data: []
        })
      }).then(res=>res.json()).then(res=>{
        console.log(res.data)
        return res.data
      })
      setMyChain(newChain)
      console.log("new-chain\n",newChain)

      
      
    } catch (error) {
      alert(error)
    }
    setIsLoading(false)
    
  }


  async function postBlock(e?: any){

    e?.preventDefault()

    await fetch(`${baseURL}/chain`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        type: "get-chain-header",
        data: myChainHeader
      })
    }).then(res=>res.json()).then(res=>{
      console.log(`${res.type}:\n`, res)
      treatResponse(res)
      return
    })

    if(myChainHeader.chainLength > myChain.length && myChainHeader.genesisHash === myChain[0]?.hash ){
      await fetch(`${baseURL}/chain`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          type: "get-chain",
          data: myChain
        })
      }).then(res=>res.json()).then(res=>{
        console.log(`${res.type}:\n`, res)
        treatResponse(res)
        return
      })
    }

    const newBlock: any = {
      timestamp: new Date().getTime(),
      contracts: ['New Block'],
      previousHash: myChain[myChain.length-1].hash,
      nonce: 1732
    }
    newBlock.hash = SHA256(newBlock.timestamp+newBlock.previousHash+JSON.stringify(newBlock.contracts)+newBlock.nonce).toString()

    console.log(newBlock)

    await fetch(`${baseURL}/chain`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        rewardAddress: 'hunter.bianchi',
        type: "new-block",
        data: newBlock
      })
    }).then(res=>res.json()).then(res=>{
      console.log(`${res.type}:\n`, res)
      treatResponse(res)
      return
    })
  }

  /* 
    chainLength
    endpointList
    fee
    genesisHash
    lastHash
    pendingDatas
    target
  */

  useEffect(()=>{
    dataFetch()
    setMyChainHeader(myChainHeader)
    setMyChain(myChain)
    setInterval(()=>{
      dataFetch()
    }, 60000*1.8)
  }, [])

  //===================================================================




  return (
    <S.Wrapper isLoading={isLoading}>
      <S.ImageContainer>
        <Image
        quality={100}
        fill
        alt="Backgroun Space"
        src={image}
        />
      </S.ImageContainer>
      <S.Float>
        
        <S.ChainHeader>

          <S.HashWrapper>
            <S.ContentWrapper isLoading={isLoading}>
              {myChainHeader.genesisHash ? `Genesis Hash: ${myChainHeader.genesisHash}`
              :
              <S.Preloading/>}
            </S.ContentWrapper>
          </S.HashWrapper>
          
          <S.HashWrapper>
            <S.ContentWrapper isLoading={isLoading}>
              {myChainHeader.lastHash ? `Last Hash: ${myChainHeader.lastHash}`
              :
              <S.Preloading/>}
            </S.ContentWrapper>
          </S.HashWrapper>

          <S.NetworkInfoWrapper>
            <S.PendingsWrapper>
              {isLoading?
                <S.Preloading/>
              :
                <S.ContentWrapper isLoading={isLoading}>
                  {myChainHeader.pendingDatas?`Pending Tokens: ${myChainHeader.pendingDatas.length}`
                  :`Pendings Tokens: 0`}
                </S.ContentWrapper>
              }
            </S.PendingsWrapper>
            <S.PendingsWrapper>
              {isLoading?
                <S.Preloading/>
              :
                <S.ContentWrapper isLoading={isLoading}>
                  {myChainHeader.endpointList?`Nodes: ${myChainHeader.endpointList}`
                  :
                  <S.Preloading/>}
                </S.ContentWrapper>
              }
            </S.PendingsWrapper>
            <S.PendingsWrapper>
              {isLoading?
                <S.Preloading/>
              :
                <S.ContentWrapper isLoading={isLoading}>
                  {`Miners: ${352}Mi`}
                </S.ContentWrapper>
              }
            </S.PendingsWrapper>
          </S.NetworkInfoWrapper>

          <S.ChainInfoWrapper>
            <S.PendingsWrapper>
              {isLoading?
                <S.Preloading/>
              :
                <S.ContentWrapper isLoading={isLoading}>
                  {myChainHeader.chainLength && `Chain Length: ${myChainHeader.chainLength}`}
                </S.ContentWrapper>
              }
            </S.PendingsWrapper>
            <S.PendingsWrapper>
              {isLoading?
                <S.Preloading/>
              :
                <S.ContentWrapper isLoading={isLoading}>
                  {myChainHeader.target && `Target: ${myChainHeader.target}`}
                </S.ContentWrapper>
              }
            </S.PendingsWrapper>
            <S.PendingsWrapper>
              {isLoading?
                <S.Preloading/>
              :
                <S.ContentWrapper isLoading={isLoading}>
                  {`Fee: ${myChainHeader.fee}`}
                </S.ContentWrapper>
              }
            </S.PendingsWrapper>
          </S.ChainInfoWrapper>

        </S.ChainHeader>
        
        <S.ChainContainer>
          {myChain && myChain.map((block)=>{
            return(
              <Block key={Math.random()} data={block}/>
            )
          })}
        </S.ChainContainer>

        <S.Footer>
          <button onClick={dataFetch}>kjhgkjgkjhg</button>
          <form onSubmit={e=>postBlock(e)}>
            <input type={'text'}/>
            <button>Get Data API</button>
          </form>
        </S.Footer>
      </S.Float>

      {/*
      {isLoading && <Loading />}

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
    </S.Wrapper>
  )
}
