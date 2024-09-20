import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import cors from 'cors'
import fs from 'fs'
import { SHA256 } from 'crypto-js'

import { BlockChain, Block, Contract } from '../../utils/blockchain'
import { getKeyPair, signHash, verifySignature } from '../../utils/wallet'
import { opCodeToObject } from '../../utils/opCode'

const triade = new BlockChain()

type TokenHeaderType = {
    timestamp: number;
    owner: string;
    toAddress: string;
    amount: number;
    type?: string;
    status?: string;
    hash?: string;
    signature?: string;
}


type TokenPayloadType = {
    businessName: string;
    businessService: string;
    businessWallet?: string;
    businessProducts?: Array<any>;
    businessImage?: string;
    businessRating?: number;
    dataHash?: string;
    businessAddress?: any;
    addressHash?: string;
}

type TokenType = {
    header: TokenHeaderType;
    data: TokenPayloadType;
}

type BusinessHeaderType = {
    timestamp: number;
    owner: string;
    toAddress: string;
    amount: number;
    type?: string;
    status?: string;
    hash: string;
    signature: string;
}

type BusinessPayloadType = {
    businessName: string;
    businessService: string;
    businessWallet?: string;
    businessProducts?: Array<any>;
    businessImage?: string;
    businessRating?: number;
    dataHash?: string;
    businessAddress?: any;
    addressHash?: string;
}

type BusinessType = {
    header: BusinessHeaderType;
    data: BusinessPayloadType;
}


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


export default async function handle (req: NextApiRequest, res: NextApiResponse){

    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, *'
    )
    
    const { method } = req

    // console.log(method)
    
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    
    res.setHeader('Access-Control-Allow-Origin','*')

    if(method === 'POST'){
        // console.log(typeof(req.body))
        // console.log(req.body)
        
        const body = typeof(req.body)==='object'?req.body:JSON.parse(req.body)
        const type = body.type
        
        // console.log(body)
        
/* 
        {
            type: 'get-token-post-price',
            data: {
                header: {
                type: 'new-business',
                timestamp: 1681524697788,
                owner: '04ed3612fed259eb416cdeb01b2fd8d8bdc02e547756041e0d4889ff049aebb25a6f10cb1a3142a28c6121d9bf6501bb1d1dd2476198101f3fbac6448a843aaacf',
                toAddress: '00000000',
                amount: 0,
                hash: 'a995703c196889361272a2e79220e1a9aa5fbc059d65974d867c376563ff1400'
                },
                data: {
                businessName: 'Anonymous',
                businessService: 'commerce',
                businessProducts: [],
                businessImage: '',
                dataHash: '7d55d7989c2bcdb4d5eb36f944d169b725495e2ef4345ebed83e0495a227bdbc'
                }
            }
        }
 */
        
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

          // const wallet = body.data
          const wallet = '04aeed00ae475d1ffed773774321267db1128833d72010c192bf8fe51bcac7fe75e34de763921d7aec7771c3dbcce7abdf2a27e51f96d8f4024ccb463b402e79df'
          const balance = triade.getBalanceOfAddress(wallet)

            return res.json({
                type: 'balance',
                data: {
                    balance,
                    wallet,
                }
            })

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
        }else if(type === 'get-token-post-price' ){
            /* 
            {
            header: {
                type: 'new-business',
                timestamp: 1681524697788,
                owner: '04ed3612fed259eb416cdeb01b2fd8d8bdc02e547756041e0d4889ff049aebb25a6f10cb1a3142a28c6121d9bf6501bb1d1dd2476198101f3fbac6448a843aaacf',
                toAddress: '00000000',
                amount: 0,
                hash: 'a995703c196889361272a2e79220e1a9aa5fbc059d65974d867c376563ff1400'
            },
            data: {
                businessName: 'Anonymous',
                businessService: 'commerce',
                businessProducts: [],
                businessImage: '',
                dataHash: '7d55d7989c2bcdb4d5eb36f944d169b725495e2ef4345ebed83e0495a227bdbc'
            }
            }
            */

            const price = 0.0007
            const gas = 0.0001
            const total = price+gas
            const token: TokenType = body.data

            const newToken: TokenType = {
                header: {
                    type: "new-business-token",
                    status: 'generating',
                    timestamp: token.header.timestamp,
                    owner: token.header.owner,
                    toAddress: token.header.toAddress,
                    amount: total,
                },
                data: {
                    businessWallet: undefined,
                    businessName: token.data.businessName === ""?"Anonymous":token.data.businessName,
                    businessService: token.data.businessService,
                    businessProducts: token.data.businessProducts,
                    businessImage: token.data.businessImage,
                    businessRating: undefined,
                }
            }
        
            if(token.data.businessAddress){
                newToken.data.businessAddress = {
                    businessCountry: token.data.businessAddress.businessCountry,
                    businessState: token.data.businessAddress.businessState,
                    businessCity: token.data.businessAddress.businessCity,
                    businessNeighbourhood: token.data.businessAddress.businessNeighbourhood,
                    businessStreet: token.data.businessAddress.businessStreet,
                    businessZipCode: token.data.businessAddress.businessZipCode,
                    businessNumber: token.data.businessAddress.businessNumber
                }
        
            }
            
            newToken.data.dataHash = SHA256(`${newToken.data.businessRating}${newToken.data.businessWallet}${newToken.data.businessName}${newToken.data.businessImage}${newToken.data.businessService}${newToken.data.businessProducts?JSON.stringify(newToken.data.businessProducts):null}${newToken.data.businessAddress?newToken.data.addressHash:null}`).toString()
                        
            newToken.header.hash = SHA256(`${newToken.header.timestamp}${newToken.header.owner}${newToken.header.toAddress}${newToken.header.amount}${newToken.data.dataHash}`).toString()
            
            // console.log(newToken)

            return res.json({
                type: 'new-token-post-price',
                token,
                data: {
                    price,
                    gas,
                    total,
                }
            })

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

            // console.log(body.data)

            /* 
                {
                    header:{
                        status:"pending",
                        timestamp:1676468468698,
                        owner:"04a122c1b690f6d4f3d4cfdb99b7d8e878ab155147b0208946c9f7ca029a3561d5f6af3726141f463f94a52e52fa95633a37114bc6eeca28ea3e2c3afc78c2b3f3",
                        toAddress:"00000000",
                        amount:0,
                        hash:"037f8fe3af521ef3e73db6f0cfb0db8dbd43a32e53574de2b5fbe44d1fa82688",
                        signature:"3046022100c78d0fce415300c82addb1a72d8df5347867691f8789206de617893c1468fab0022100b9c7dfb1178ce0974584e6aba2ab9ad5d9d4855c11927bfb428a20ffd71d7c7f"
                    },
                    data:{
                        businessRating:5,
                        businessWallet:"04eae14ab1d7c22ec612502bb6f953cdc87ea1fad8c257780700fa875149b357fc14afc7766b378b7320df8bd93bcd5bd7b2544c73755ad4f58a502a5c1ce0bda3",
                        businessName:"Anonymous",
                        businessService:"commerce",
                        businessProducts:["TRÍADE","Business","Products"],
                        businessImage:"",
                        dataHash:"7d2010bc778969383d7ff224a596022c8a1231fdec1b2f36a8fd8c4896cd594d"
                    }
                }

            */

            const token: BusinessType = body.data
            /* 
                {
                    header: {
                        type: 'creating-business',
                        status: 'generating',
                        timestamp: 1682109126443,
                        owner: '04aeed00ae475d1ffed773774321267db1128833d72010c192bf8fe51bcac7fe75e34de763921d7aec7771c3dbcce7abdf2a27e51f96d8f4024ccb463b402e79df',
                        toAddress: '00000000',
                        amount: 0.0008,
                        hash: '3f14728d6cae358ef94635d2a2c7192a4865f489975e10d16368985c788ef053'
                        signature:"3046022100c78d0fce415300c82addb1a72d8df5347867691f8789206de617893c1468fab0022100b9c7dfb1178ce0974584e6aba2ab9ad5d9d4855c11927bfb428a20ffd71d7c7f"
                    },
                    data: {
                        businessWallet: undefined,
                        businessName: 'Anonymous',
                        businessService: 'commerce',
                        businessProducts: [],
                        businessImage: '',
                        businessRating: 5,
                        dataHash: '7d55d7989c2bcdb4d5eb36f944d169b725495e2ef4345ebed83e0495a227bdbc'
                    }
                }
                
                {
                    header: {
                        type: 'new-business-token',
                        status: 'generating',
                        timestamp: 1682109126443,
                        owner: '04aeed00ae475d1ffed773774321267db1128833d72010c192bf8fe51bcac7fe75e34de763921d7aec7771c3dbcce7abdf2a27e51f96d8f4024ccb463b402e79df',
                        toAddress: '00000000',
                        amount: 0.0008,
                        hash: '92b0cfa996528c28a4fe7bf54b5eeff827ce0c4dd5d249df97e52c89e89f9589'
                    },
                    data: {
                        businessWallet: undefined,
                        businessName: 'Anonymous',
                        businessService: 'commerce',
                        businessProducts: [],
                        businessImage: '',
                        businessRating: undefined,
                        dataHash: '7d55d7989c2bcdb4d5eb36f944d169b725495e2ef4345ebed83e0495a227bdbc'
                    }
                }
             */

            // console.log(token)

            const newToken: BusinessType = {
                header:{
                    type: "new-business-token",
                    status: token.header.status,
                    timestamp: token.header.timestamp,
                    owner: token.header.owner,
                    toAddress: token.header.toAddress,
                    amount: token.header.amount,
                    hash: token.header.hash,
                    signature: token.header.signature,
                },
                data:{
                    dataHash:token.data.dataHash,
                    businessWallet: token.data.businessWallet,
                    businessName: token.data.businessName === ""?"Anonymous":token.data.businessName,
                    businessService: token.data.businessService,
                    businessProducts: token.data.businessProducts,
                    businessImage: token.data.businessImage,
                    businessRating: token.data.businessRating?token.data.businessRating:5,
                }
            }
        
            if(token.data.businessAddress){
                newToken.data.businessAddress = {
                    businessCountry: token.data.businessAddress.businessCountry,
                    businessState: token.data.businessAddress.businessState,
                    businessCity: token.data.businessAddress.businessCity,
                    businessNeighbourhood: token.data.businessAddress.businessNeighbourhood,
                    businessStreet: token.data.businessAddress.businessStreet,
                    businessZipCode: token.data.businessAddress.businessZipCode,
                    businessNumber: token.data.businessAddress.businessNumber
                }
            }

            newToken.data.dataHash = SHA256(`${newToken.data.businessRating}${newToken.data.businessWallet}${newToken.data.businessName}${newToken.data.businessImage}${newToken.data.businessService}${newToken.data.businessProducts?JSON.stringify(newToken.data.businessProducts):null}${newToken.data.businessAddress?newToken.data.addressHash:null}`).toString()
            
            newToken.header.hash = SHA256(`${newToken.header.timestamp}${newToken.header.owner}${newToken.header.toAddress}${newToken.header.amount}${newToken.data.dataHash}`).toString()

            // console.log(newToken)

            const timestamp = newToken.header.timestamp
            const owner = newToken.header.owner
            const toAddress = newToken.header.toAddress
            const amount = newToken.header.amount
            const signature = newToken.header.signature
            const hash = newToken.header.hash
            const dataHash = newToken.data.dataHash
            

            // console.log(`\n\nData hash: ${dataHash}`)
            // console.log(`Hash: ${hash}`)
            // console.log(`Signature: ${signature}`)
            // console.log(`Balance: ${triade.getBalanceOfAddress(owner)}`)
            // console.log(`Is sig val?: ${verifySignature(owner, hash, signature)}\n`)

                    
                    if(verifySignature(newToken.header.owner, newToken.header.hash, newToken.header.signature)){
                        // console.log("Valid Signature")
                        
                        if(triade.getBalanceOfAddress(owner) >= amount){
                            // const contract = new Contract(owner, toAddress, amount, token, token.header.signature)
                            const contract = new Contract(timestamp, owner, toAddress, amount, token, signature)

                            // console.log(`New Contract:\n${JSON.stringify(contract)}`)

                            if(contract.isValid()){

                                // console.log(`Is Valid?: ${(contract.isValid())}`)
                                triade.addContract(contract)
                                // "8297e903759c97801f36618bbf14327bf0121e8a54c6fb5002ed831a3bcbd505"
                        triade.minePendingContracts("042ef6646dacb5c148271654305981d5d96324624328a17a819f81ae30b44bf9ce898e2bf955b3fdc6c5404ac0bd96e98e5569d871fdee5c44d2fe7abb3e565a37")
                                // console.log(triade.pendingContracts)
                                
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
                                    message: "YOU ARE BROKE!!! Hehe...\n\nCheck your balance or buy some TADs",
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

        }else if(type === 'get-chain' ){

            // console.log(req.body)
            if(triade.chain.length < 16){
             triade.minePendingContracts("042ef6646dacb5c148271654305981d5d96324624328a17a819f81ae30b44bf9ce898e2bf955b3fdc6c5404ac0bd96e98e5569d871fdee5c44d2fe7abb3e565a37")
            }

            return res.json({
                type: 'new-chain',
                data: triade.chain
            })

        }else if(type === 'new-chain' ){
            
            const clientChain = body.data
            
            if(clientChain.length > triade.chain.length){

                console.log(`${clientChain.length}`)
                
                if(clientChain[0].hash === triade.chain[0].hash){
                    const lenghtDiff = clientChain.length - triade.chain.length

                    if(lenghtDiff > 6){
                        
                        Object.assign(triade.chain, clientChain)

                        res.json({
                            type: 'new-chain-assign',
                            data: triade.chain
                        })
                        return
                    } else if(clientChain[triade.chain.length - 1].hash === triade.chain[triade.chain.length - 1].hash){
                        for( let i = triade.chain.length -1 ; i < clientChain.length ; i++ ){
                            const remoteBlock = clientChain[i]
                            const block = new Block(remoteBlock.timestamp, remoteBlock.contracts, remoteBlock.previousHash, remoteBlock.nonce)
                            
                            // console.log("New Block", block)
                            // console.log("New Hash", block.hash)
                            // console.log("New Previous Hash", block.previousHash)
        
                            if(block.previousHash === triade.chain[triade.chain.length - 1].hash && block.hash === SHA256(block.timestamp+block.previousHash+JSON.stringify(block.contracts)+block.nonce).toString()){
                                triade.chain.push(block)
                                
                                res.json({
                                    type: 'new-chain',
                                    data: triade.chain
                                })
                                return
                            } else {
                                res.json({
                                    type: 'error',
                                    error: {
                                        message: "Your chain are broken!",
                                        code: "0001"
                                    },
                                    data: triade.chain
                                })
                                return
                            }
                        }
                        res.json({
                            type: 'new-chain-test',
                            data: triade.chain
                        })
                        return
                    } else {
                        res.json({
                            type: 'error',
                            error: {
                                message: "Your chain are broken! Last hash not equal",
                                code: "0001"
                            },
                            data: triade.chain
                        })
                        return
                    }
                } else {
                    res.json({
                        type: 'error',
                        error: {
                            message: "Your chain are broken! Genesis hash not equal",
                            code: "0001"
                        },
                        data: triade.chain
                    })
                    return
                }
            } else {
                res.json({
                    type: 'new-chain-test',
                    data: triade.chain
                })
                return
            }
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

            const block = new Block(clientBlock.timestamp, clientBlock.contracts, clientBlock.previousHash, clientBlock.nonce)
            
            // console.log("New Block", block)
            // console.log("New Hash", block.hash)
            // console.log("New Previous Hash", block.previousHash)

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
