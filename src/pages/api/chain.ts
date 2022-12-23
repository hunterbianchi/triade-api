const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

import fs from 'fs'
import { SHA256 } from 'crypto-js'


import { BlockChain, Block, Contract } from '../../utils/blockchain'
import { getKeyPair, signHash, verifySignature } from '../../utils/wallet'
import { opCodeToObject } from '../../utils/opCode'

const triade = new BlockChain()


const offerList: any[] = [{
    type: 'transaction',
    fromAddress: '0xE54a2Ba0518a52E7d5f753C40a4aC514CFBaA0f7',
    toAddress: '',
    amount: 20,
}]

const orderList: any[] = [{
    type: 'transaction',
    fromAddress: '0xE54a2Ba0518a52E7d5f753C40a4aC514CFBaA0f7',
    toAddress: '',
    amount: 20,
}]


function addOrder(order:any){
    if(!orderList.every((value)=>(value.hash === order.hash)) || order.hash === SHA256(order.amount + order.fromAddress).toString()){
        orderList.push(order)
    }
}
function removeOrder(order:any){}


function addOffer(offer:any){
    if(!offerList.every((value)=>(value.hash === offer.hash)) || offer.hash === SHA256(offer.amount + offer.fromAddress).toString()){
        offerList.push(offer)
    }
}
function removeOffer(offer:any){}


function getChainHeader(){

    const chainHeader: any = {

        genesisHash: triade.chain[0].hash,
        lastHash: triade.chain[triade.chain.length-1].hash,
        pendingDatas: triade.pendingContracts.length,
        endpointList: triade.nodes.length,
        chainLength: triade.chain.length,
        target: triade.target,
        fee: triade.fee,
    }

    return chainHeader
}


const observers: any = []

function subscribeObserver(command:any){
    observers.push(command)
}

function notifyObservers(command:any){
    for (const observerFunction of observers) {
        observerFunction(command)
    }
}


export default async function handle (req: any, res: any){

    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    const { method } = req
    
    res.setHeader('Access-Control-Allow-Origin','*')

    if(method === 'POST'){
        
        const body = req.body
        const type = body.type
        
        if(type === 'new-offer' ){
            addOffer(body.data)
            res.json({
                type: 'new-offer-list',
                data: {
                    offerList,
                    orderList,
                    chainHeader: getChainHeader()
                }
            })
            return
        }else if(type === 'new-order' ){
            addOrder(body.data)
            res.json({
                type: 'new-order-list',
                data: {
                    offerList,
                    orderList,
                    chainHeader: getChainHeader()
                }
            })
            return
        }else if(type === 'get-endpoint-list' ){
            
            res.json({
                type: 'new-endpoint-list',
                data: Array.from(getChainHeader().endpointList)
            })
            return
        }else if(type === 'get-pending-datas' ){
            
            res.json({
                type: 'new-pending-datas',
                data: getChainHeader().pendingDatas
            })
            return
        }else if(type === 'new-business' ){

            // curl -X POST -d '{"type":"new-business","data":{"header":{"owner":"04817b5ba328e3e2c7d50c4726572b0fd8a518f08cae361d05f07e83d4b584eb10ecd010be823eab085daed129f4aab02800ba85e377a2d6ab753bc4e1ff3652cb","toAddress":"","amount":0.0007,"signature":"3045022100f237d0f68ace2895e5c382d3141c24045876ad433c1d95d7c8695a5e832643e202204312c00c9ad641bf7df9726ffedf3883c7f01cc690ea8b75c6cbc34876243988"},"payload":{"hash":"efc9e923fc16cda2446214dc00fda19093e11913a2ec49aef92f56dad6c81396","data":"TRÍADE"}}}' -H 'Content-Type':'application/json' localhost:3000/api/chain
            
            const header = body.data.header
            const owner = header.owner
            const toAddress = header.toAddress
            const amount = header.amount
            const signature = header.signature

            const payload = body.data.payload
            
            const opCode = payload.opCode

            opCodeToObject(opCode)

            const hash = payload.hash

            const newHash = SHA256(opCode).toString()

            console.log(`header: ${header}`)
            console.log(`owner: ${owner}`)
            console.log(`toAddress: ${toAddress}`)
            console.log(`amount: ${amount}`)
            console.log(`signature: ${signature}`)
            console.log(`payload: ${payload}`)
            console.log(`data: ${opCode}`)
            console.log(`hash: ${hash}`)
            console.log(`newHash: ${newHash}`)
            

            if(hash !== newHash){
                return res.json({
                    type: 'error',
                    message: `Wrong Hash in Payload "${hash}"`
                })
            }else if(signature){
                if(owner){
                    if (verifySignature(owner, hash, signature)) {
                        
                        const contract = new Contract(owner, '', amount, opCode, signature)
                        
                        console.log(contract.fromAddress)
                        console.log(contract.toAddress)

                        console.log(contract.isValid())
                        
                        try {
                            
                            triade.addContract(contract)

                            return res.json({
                                type: 'new-business',
                                data: hash
                            })

                        } catch (error: any) {

                            return res.json({
                                type: 'error',
                                message: error.message
                            })

                        }
                        
                    } else{
                        return res.json({
                            type: 'error',
                            message: 'Signature undefined '
                        })
                    }
                    
                }else{
                    return res.json({
                        type: 'error',
                        message: 'Owner undefined '
                    })
                }
            }else{
                return res.json({
                    type: 'error',
                    message: 'Signature undefined '
                })
            }

        }else if(type === 'get-chain' ){

            res.json({
                type: 'new-chain',
                data: triade.chain
            })
            return

        }else if(type === 'get-chain-header' ){

            if(body.data.genesisHash === getChainHeader().genesisHash){
                res.json({
                    type: 'new-chain-header',
                    data: getChainHeader()
                })
            } else {
                res.json({
                    type: 'new-chain-header',
                    data: getChainHeader()
                })          
            }

        }else if(type === 'new-block' ){

            const clientBlock = body.data

            const block = new Block(clientBlock.timestamp, clientBlock.contracts, clientBlock.previousHash, clientBlock.nonce, clientBlock.hash)
            
            console.log("New Block", block)
            console.log("New Hash", block.hash)
            console.log("New Previous Hash", block.previousHash)

            if(block.previousHash === triade.chain[triade.chain.length - 1].hash && block.hash === SHA256(block.timestamp+block.previousHash+JSON.stringify(block.contracts)+block.nonce).toString()){
                triade.chain.push(block)
                res.json({
                    type: 'new-chain',
                    data: triade.chain
                })
                return
            } else {
                res.json({
                    type: 'new-chain',
                    data: triade.chain
                })
                return
            }

        }
        
    }else if(method === 'GET'){
        res.json({
            type: "new-chain-header",
            data: getChainHeader()
        })
    }
}