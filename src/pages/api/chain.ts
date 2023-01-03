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

            // curl http://localhost:3001/api/chain -d '{"type":"new-business","data":{"header":{"timestamp":1672647250275,"owner":"04b9b7ba66b2bfc141fc9cdf20bff80a83406a04d5b7344d60c32ecb39dd1395792c8c5783c6b9893a0f2a2f84dbb7cb3b52f4d7e27957db6bdaecde180baca7a0","toAddress":"00000000","amount":0,"hash":"53e0d6e1180b0491fe4e95e44575cbe5391ff63bbc1d0117e39e486f9f25632f"},"data":{"businessRating":5,"businessWallet":"04c69ea6f77652f436b3625f360d611f1448f38d6cd992505b41d1edefff225bc8c61de554231e7b9d828948a3bddcd8005c88af439753cb51f72688b901324fa5","businessName":"","businessService":"commerce","businessProducts":null,"businessImage":"","businessAddress":{"businessCountry":"","businessState":"","businessCity":"","businessNeighbourhood":"","businessStreet":"","businessZipCode":"","businessNumber":""},"addressHash":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","dataHash":"503eaf0171092663bbf65c2daa3c706a2bfd7e4f72bdd93bbda479cd1af039f2"}}}' -H 'Content-Type':'application/json' -X POST
/* 
            const token: any = {
                header:{
                    timestamp:new Date().getTime(),
                    owner: getPublicKey(privateKey),
                    toAddress: "00000000",
                    amount,
                    hash,
                    signature,
                },
                data:{
                    businessRating:5,
                    businessWallet: businessPair.publicKey,
                    businessName,
                    businessService,
                    businessProducts: businessService==="Commerce"?[]:null,
                    businessImage,
                    businessAddress,
                    dataHash,
                }
            }
*/

            console.log(JSON.stringify(body.data))

            const token = body.data
            const tokenHeader = token.header
            const tokenData = token.data

            if(tokenHeader.hash === SHA256("").toString()){
                
            }
            
            const timestamp = token.header.timestamp
            const owner = token.header.owner
            const toAddress = token.header.toAddress
            const amount = token.header.amount
            const signature = token.header.signature
            const hash = token.header.hash

            return res.json({
                type: 'new-business',
                data: body.data
            })
        
/* 
{
  "type": "new-business",
  "data": {
    "type": "new-business",
    "data": {
      "header": {
        "timestamp": 1672647250275,
        "owner": "04b9b7ba66b2bfc141fc9cdf20bff80a83406a04d5b7344d60c32ecb39dd1395792c8c5783c6b9893a0f2a2f84dbb7cb3b52f4d7e27957db6bdaecde180baca7a0",
        "toAddress": "00000000",
        "amount": 0,
        "hash": "53e0d6e1180b0491fe4e95e44575cbe5391ff63bbc1d0117e39e486f9f25632f"
      },
      "data": {
        "businessRating": 5,
        "businessWallet": "04c69ea6f77652f436b3625f360d611f1448f38d6cd992505b41d1edefff225bc8c61de554231e7b9d828948a3bddcd8005c88af439753cb51f72688b901324fa5",
        "businessName": "",
        "businessService": "commerce",
        "businessProducts": null,
        "businessImage": "",
        "businessAddress": {
          "businessCountry": "",
          "businessState": "",
          "businessCity": "",
          "businessNeighbourhood": "",
          "businessStreet": "",
          "businessZipCode": "",
          "businessNumber": ""
        },
        "addressHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "dataHash": "503eaf0171092663bbf65c2daa3c706a2bfd7e4f72bdd93bbda479cd1af039f2"
      }
    }
  }
}
*/

            const payload = body.data.payload
            
            const opCode = payload.opCode

            const business = opCodeToObject(opCode)

            const newHash = SHA256(`${business?.owner}${business?.businessWallet}${business?.businessName}${business?.businessAddress?.country}${business?.businessAddress?.state}${business?.businessAddress?.city}${business?.businessAddress?.neighbourhood}${business?.businessAddress?.street}${business?.businessAddress?.zipCode}${business?.businessAddress?.number}`).toString()

            

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