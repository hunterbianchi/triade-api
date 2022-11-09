import fs from 'fs'
import { SHA256 } from 'crypto-js'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

const genesisBlock: any = createGenesisBlock()

function createGenesisBlock(){

    const genesisBlock: any = {
        timestamp: 1658880000989,
        nonce:0,
        contracts:['TRÍADE-CONTRACT'],
    }

    genesisBlock.hash = SHA256(genesisBlock.timestamp + genesisBlock.nonce + SHA256(JSON.stringify(genesisBlock.contracts)).toString()).toString()
    console.log(`Genesis Hash: ${genesisBlock.hash}`)
    return genesisBlock
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

const target: number = retarget()

function retarget(){
    const target = 0x0001
    return target
}

const fee: number = getFee()

function getFee(){
    const fee: number = 50
    return fee
}

const pendingDatas: any = []

function addPendingDatas(clientPendingList: Array<any>){

    const myPendingSet = new Set(pendingDatas)

    for (const pending of clientPendingList) {
        if(!myPendingSet.has(pending)){
            pendingDatas.push(pending)
        }
    }
}

function removePendingDatas(deletationPendingList: Array<any>){

    const myPendingSet = new Set(pendingDatas)

    for (const pending of deletationPendingList) {
        if(myPendingSet.has(pending)){
            myPendingSet.delete(pending)
            Object.assign(chain, Array.from(myPendingSet))
        }
    }
}

const chain: any[] = [genesisBlock]

function addBlock(block: any){
    chain.push(block)
}

const endpointList: any[] = [baseUrl]

function getChainHeader(){
    const ch: any = {
        chainLength: chain.length,
        lastHash: chain[chain.length - 1].hash,
        genesisHash: chain[0].hash,
        pendingDatas: pendingDatas.length,
        endpointList: endpointList.length,
        target,
        fee,
    }

    return ch
}

const chainHeader: any = getChainHeader()

const observers: any = []

function subscribeObserver(command:any){
    observers.push(command)
}

function notifyObservers(command:any){
    for (const observerFunction of observers) {
        observerFunction(command)
    }
}



const getReward: Function = ()=> {
   
    if(chain.length < 210000){

        const reward = 50
        return  reward

    }else if(chain.length < 420000){

        const reward = 25
        return  reward

    }else if(chain.length < 630000){

        const reward = 12.5
        return  reward

    }else if(chain.length < 840000){

        const reward = 6.25
        return  reward

    }else{

        const reward = 3.125
        return reward

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
                    chainHeader,
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
                    chainHeader,
                }
            })
            return
        }else if(type === 'get-endpoint-list' ){

            const myEndpointListSet = new Set(endpointList)

            console.log('endpoint-list',body.data)

            for(const element of body.data){
                
                if(!myEndpointListSet.has(element)){
                    endpointList.push(element)
                }
            }
            
            res.json({
                type: 'new-endpoint-list',
                data: Array.from(endpointList)
            })
            return
        }else if(type === 'get-pending-datas' ){
            
            const myPendingDatasSet = new Set(pendingDatas)

            for(const element of body.data){
                
                if(!myPendingDatasSet.has(element)){
                    pendingDatas.push(element)
                }
            }
            
            res.json({
                type: 'new-pending-datas',
                data: pendingDatas
            })
            return
        }else if(type === 'get-chain' ){

            const clientChain = body.data

            if(clientChain.length>chain.length &&
                chain[0].hash === clientChain[0].hash &&
                chain[chain.length-1].hash === clientChain[chain.length-1].hash){

                for(let i = chain.length; i < clientChain.length; i++){
                    const block = clientChain[i]
                    if(block.previousHash === chain[chain.length -1].hash && block.hash === SHA256(block.timestamp + block.previousHash + JSON.stringify(block.data) + block.nonce).toString()){
                        chain.push(block)
                    }
                    addBlock(block)
                }

                res.json({
                    type: 'new-chain',
                    data: chain
                })
                return
            }else{
                res.json({
                    type: 'new-chain',
                    data: chain
                })
                return
            }
        }else if(type === 'get-new-chain' ){

            const clientChainHeader = body.data

            if (clientChainHeader.chainLength < chain.length &&
            chain[0].hash === clientChainHeader.genesisHash &&
            chain[chain.length-1].hash === clientChainHeader.lastHash){

                const restant = []

                for(let i = clientChainHeader.chainLength -1 ; i<chain.length; i++){
                    const block = chain[i]
                    restant.push(block)
                }
                
                res.json({
                    type: 'new-chain',
                    data: restant
                })
                return
            }else{
                res.json({
                    type: 'new-chain',
                    data: chain
                })
                return
            }
        }else if(type === 'get-chain-header' ){

            console.log('\n\nchain header', body.data,'\n')

            if(body.data.genesisHash === chainHeader.genesisHash){
                res.json({
                    type: 'new-chain-header',
                    data: chainHeader
                })
            } else {
                res.json({
                    type: 'new-chain-header',
                    data: chainHeader
                })          
            }

        }else if(type === 'new-endpoint' ){

            const set = new Set(endpointList)

            if(!set.has(body.data)){
                
                endpointList.push(body.data)
                
                res.json({
                    type: 'new-endpoint-list',
                    data: endpointList
                })
                return
            }
            
            res.json({
                type: 'new-endpoint-list',
                data: endpointList
            })
            return

        }else if(type === 'new-block' ){

            const block = body.data
            
            console.log("New Block", block)
            console.log("New Hash", block.hash)
            console.log("New Previous Hash", block.previousHash)

            if(block.previousHash === chain[chain.length -1].hash && block.hash === SHA256(block.timestamp+block.previousHash+JSON.stringify(block.contracts)+block.nonce).toString()){
                addBlock(block)
                res.json({
                    type: 'new-chain',
                    data: chain
                })
                return
            } else {
                res.json({
                    type: 'new-chain',
                    data: chain
                })
                return
            }

        }
        
    }else if(method === 'GET'){
        res.json({
            type: "new-chain-header",
            data: chainHeader})
    }
}