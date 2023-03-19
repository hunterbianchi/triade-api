import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import cors from 'cors'
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


async function handle (req: any, res: any){

    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*, https://triade-group.vercel.app/*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, *'
    )
    
    const { method } = req
    
    if (req.method === 'OPTIONS') {

        const token = await fetch("https://api.vercel.com/v3/user/tokens", {
            "headers": {
            "Authorization": "Bearer <TOKEN>"
        },
        "method": "post"
        }).then(res=>res.json()).then(res=>{
            console.log(res)
            return res
        })

        res.status(200).end()
        return token
    }
    
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
        }else if(type === 'get-balance'){

          const wallet = body.data
          const balance = triade.getBalanceOfAddress(wallet)

            res.json({
                type: 'balance',
                data: {
                    balance,
                    wallet,
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
                data: triade.pendingContracts
            })
            return
        }else if(type === 'new-business' ){

            // curl http://localhost:3000/api/chain  -H 'Content-Type':'application/json' -X POST -d '{"type":"new-business","data":{"header":{"timestamp":1672934475153,"owner":"04f731c8a283a95770c0541dbe9d477724ea8321153934c9734876699c23f0b3c8b4de30cb87385aa561045e30639ae5718e8cee1a7cc6499765c4135da21bcb21","toAddress":"00000000","amount":0,"hash":"f1989dd4310cb0ec724f0b883dddf7b3306ad20f5261d666854b5957d3f7fcb9","signature":"3045022018e142aba95d932b6e66535c492b835624976efe25ec6d400d739d68bd598d5d022100fb08bebda5b61e03e5963949d5c9234f1d611f4f5d71bf4b8ab9226e5208170e"},"data":{"businessRating":5,"businessWallet":"047721abc10f1bc6bc42539dc731b35159cb4c22fbc9086255e5c01cd2e46d435cd07c491bde9ad541afdc6e1fb7ccb57fef96adb410fda6ef1edf164dc4bc7036","businessName":"Anonymous","businessService":"commerce","businessProducts":[],"businessImage":"","dataHash":"7ea0fc36b8fade4fa2d1bffd66c92c80332704bc6175706f31cd1615d796d60e"}}}'


            /*
            {
                "header":{
                    "timestamp": 1672934475153,
                    "owner": "04f731c8a283a95770c0541dbe9d477724ea8321153934c9734876699c23f0b3c8b4de30cb87385aa561045e30639ae5718e8cee1a7cc6499765c4135da21bcb21",
                    "toAddress": "00000000",
                    "amount": 0,
                    "hash": "f1989dd4310cb0ec724f0b883dddf7b3306ad20f5261d666854b5957d3f7fcb9",
                    "signature": "3045022018e142aba95d932b6e66535c492b835624976efe25ec6d400d739d68bd598d5d022100fb08bebda5b61e03e5963949d5c9234f1d611f4f5d71bf4b8ab9226e5208170e"
                },
                "data": {
                    "businessRating":5,
                    "businessWallet": "047721abc10f1bc6bc42539dc731b35159cb4c22fbc9086255e5c01cd2e46d435cd07c491bde9ad541afdc6e1fb7ccb57fef96adb410fda6ef1edf164dc4bc7036",
                    "businessName": "Anonymous",
                    "businessService": "commerce",
                    "businessProducts": [],
                    "businessImage": "",
                    "dataHash": "7ea0fc36b8fade4fa2d1bffd66c92c80332704bc6175706f31cd1615d796d60e"
                }
            }

            token.data.dataHash = SHA256(`${token.data.businessRating}${token.data.businessWallet}${token.data.businessName}${token.data.businessImage}${token.data.businessService}${token.data.businessProducts?JSON.stringify(token.data.businessProducts):null}${isPhysical?token.data.addressHash:null}`).toString()
                
            token.header.hash = SHA256(`${token.header.timestamp}${token.header.owner}${token.header.toAddress}${token.header.amount}${token.data.dataHash}`).toString()

            */

            console.log(JSON.stringify(body.data))

            /* 
                {
                    "header":{
                        "status":"pending",
                        "timestamp":1676468468698,
                        "owner":"04a122c1b690f6d4f3d4cfdb99b7d8e878ab155147b0208946c9f7ca029a3561d5f6af3726141f463f94a52e52fa95633a37114bc6eeca28ea3e2c3afc78c2b3f3",
                        "toAddress":"00000000",
                        "amount":0,
                        "hash":"037f8fe3af521ef3e73db6f0cfb0db8dbd43a32e53574de2b5fbe44d1fa82688",
                        "signature":"3046022100c78d0fce415300c82addb1a72d8df5347867691f8789206de617893c1468fab0022100b9c7dfb1178ce0974584e6aba2ab9ad5d9d4855c11927bfb428a20ffd71d7c7f"
                    },
                    "data":{
                        "businessRating":5,
                        "businessWallet":"04eae14ab1d7c22ec612502bb6f953cdc87ea1fad8c257780700fa875149b357fc14afc7766b378b7320df8bd93bcd5bd7b2544c73755ad4f58a502a5c1ce0bda3",
                        "businessName":"Anonymous",
                        "businessService":"commerce",
                        "businessProducts":["TRÍADE","Business","Products"],
                        "businessImage":"",
                        "dataHash":"7d2010bc778969383d7ff224a596022c8a1231fdec1b2f36a8fd8c4896cd594d"
                    }
                }

            */

            const token = body.data
            const tokenHeader = token.header
            const tokenData = token.data

            const timestamp = tokenHeader.timestamp
            const owner = tokenHeader.owner
            const toAddress = tokenHeader.toAddress
            const amount = tokenHeader.amount
            const signature = tokenHeader.signature
            const hash = tokenHeader.hash

            const newDataHash = SHA256(`${tokenData.businessRating}${tokenData.businessWallet}${tokenData.businessName}${tokenData.businessImage}${tokenData.businessService}${tokenData.businessProducts?JSON.stringify(tokenData.businessProducts):null}${tokenData.businessAddress?tokenData.addressHash:null}`).toString()
            
            const newHash = SHA256(`${tokenHeader.timestamp}${tokenHeader.owner}${tokenHeader.toAddress}${tokenHeader.amount}${tokenData.dataHash}`).toString()
            
            console.log(`\n\nData hash: ${newDataHash}\n`)
            console.log(`Hash: ${newHash}\n`)
            console.log(`Signature: ${signature}\n`)
            console.log(`Balance: ${triade.getBalanceOfAddress(owner)}\n`)

            if(tokenData.dataHash === newDataHash){
                console.log("Hash matches")
                
                if(tokenHeader.hash === newHash){
                    console.log("Hash matches")
                    
                    if(verifySignature(owner, hash, signature)){
                        console.log("Valid Signature")
                        
                        if(triade.getBalanceOfAddress(owner) >= amount){
                            if(timestamp>triade.chain[triade.chain.length-1].timestamp){
                                // const contract = new Contract(owner, toAddress, amount, token, token.header.signature)
                                const contract = new Contract(timestamp, owner, toAddress, amount, token, signature)

                                console.log(`New Contract:\n${JSON.stringify(contract)}`)

                                if(contract.isValid()){

                                    console.log(`Is Valid?: ${(contract.isValid())}`)
                                    triade.addContract(contract)
                                    "8297e903759c97801f36618bbf14327bf0121e8a54c6fb5002ed831a3bcbd505"
                                    
                                    triade.minePendingContracts("04aeed00ae475d1ffed773774321267db1128833d72010c192bf8fe51bcac7fe75e34de763921d7aec7771c3dbcce7abdf2a27e51f96d8f4024ccb463b402e79df")
                                    console.log(triade.pendingContracts)
                                    
                                    return res.json({
                                        type: 'new-business',
                                        data: contract
                                    })
                                }else{

                                    return res.json({
                                        type: 'error',
                                        error: {
                                            message: "\tContract is not valid.\nIt means that it ain't no signature, addresses or signature not related to owner's address",
                                            code: "0001"
                                        }
                                    })
                                }

                            }else{
                                return res.json({
                                    type: 'error',
                                    error: {
                                        message: "You cannot create contracts in the past.\n\nVerify you contract's timestamp",
                                        code: "0001"
                                    }
                                })
                            }
                        }else{
                            return res.json({
                                type: 'error',
                                error: {
                                    message: "YOU ARE A BROKE!!! Hehe...\n\nCheck your balance or buy some TADs",
                                    code: "0001"
                                }
                            })
                        }
                    }else{
                        return res.json({
                            type: 'error',
                            error: {
                                message: "Your signature does not sign this contrat or is not your signature.",
                                code: "0001"
                            }
                        })
                    }
                }else{
                    return res.json({
                        type: 'error',
                        error: {
                            message: "Hash doesn't match",
                            code: "0001"
                        }
                    })
                }
            }else{
                return res.json({
                    type: 'error',
                    error: {
                        message: "Data hash doesn't match",
                        code: "0001"
                    }
                })
            }

        }else if(type === 'get-chain' ){
            
            triade.minePendingContracts("04aeed00ae475d1ffed773774321267db1128833d72010c192bf8fe51bcac7fe75e34de763921d7aec7771c3dbcce7abdf2a27e51f96d8f4024ccb463b402e79df")

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

export default withApiAuthRequired(
  cors()(handler)
)
