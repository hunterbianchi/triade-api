import { SHA256 } from 'crypto-js'
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

export class Block3 {
    
    timestamp: number
    contracts: any
    previousHash: string
    nonce: number
    hash: string

    constructor(timestamp: number, contracts: any, previousHash: string = '') {
        this.timestamp = timestamp
        this.contracts = contracts
        this.previousHash = previousHash
        this.nonce = 0
        this.hash = this.calculateHash()
    }
    hasValidTransactions() {
        for (const tx of this.contracts) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
    mineBlock(difficulty: number) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }

    calculateHash() {
        return SHA256(`${this.previousHash}${this.timestamp}${JSON.stringify(this.contracts)}${this.nonce}`).toString();
    }

}

export class Block {

    timestamp: number    
    contracts: any    
    previousHash: string    
    nonce: number    
    hash: string        

    constructor(timestamp: number, contracts: any, previousHash: string = '', nonce: number = 0) {
        this.timestamp = timestamp
        this.contracts = contracts
        this.previousHash = previousHash
        this.nonce = nonce
        this.hash = this.calculateHash()
    }

    hasValidContracts(): boolean {
        for (const contract of this.contracts) {
            if (!contract.isValid()) {
                return false;
            }
        }
        return true;
    }

    mine(target: number): void {
        while (this.hash.substring(0, target) !== Array(target + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
    }

    calculateHash() {
        // console.log(this.timestamp)
        // console.log(this.previousHash)
        // console.log(this.contracts)
        // console.log(this.nonce)

        const bl = {
            timestamp: this.timestamp,
            previousHash: this.previousHash,
            contracts: this.contracts,
            nonce: this.nonce,
        }
        // console.log(SHA256(`${bl.timestamp}${bl.previousHash}${JSON.stringify(bl.contracts)}${bl.nonce}`).toString())
        return SHA256(`${bl.timestamp}${bl.previousHash}${JSON.stringify(bl.contracts)}${bl.nonce}`).toString()
    }

}

export class BlockChain {

    chain: Array<any>
    target: number
    pendingContracts: Array<any>
    fee: number
    nodes: Array<any>

    constructor(
    ) {
        this.chain = [this.createGenesisBlock()]
        this.target = this.getDifficulty()
        this.pendingContracts = []
        this.fee = 50000000000000
        this.nodes = ["https://triade-api.vercel.app/api/chain"]
    }
  
    
    updateChain(newChain: Array<any>){

        if(newChain.length > this.chain.length){
            // console.log(`\t\t|\tReceived a larger (size: ${newChain.length}) chain...\n`)
            // console.log(`${newChain[0].hash}\n${this.chain[0].hash}`)
            // console.log(`${newChain[0].contracts}\n${this.chain[0].contracts}` )
            
            if(newChain[0].hash === this.chain[0].hash){
                // console.log(`\t\t|\t...with the same genesis hash ${this.chain[0].hash}...`)

                if(newChain[this.chain.length - 1].hash === this.chain[this.chain.length - 1].hash){

                    // console.log(`\t\t|\t...and the hash of the smallest chain is the same in the same position of the largest one. ${this.chain[this.chain.length - 1].hash}`)
                    
                    const chainLength = this.chain.length
                    const newChainLength = newChain.length

                    for (let i = chainLength; i < newChainLength; i++) {

                        const block = newChain[i]

                        // // console.log(block)

                        const newBlock = new Block(block.timestamp, block.contracts, block.previousHash, block.nonce)

                        
                        if (block.hash.substring(0, this.target) === Array(this.target + 1).join("0")){
                            
                            // console.log(`\n\t\t|\tPOW!\n\n\n`)
                            
                            this.chain.push(newBlock)
                        }
                    }

                }else{
                    Object.assign(this.chain, newChain)
                }
            }
        }else{
            alert(`chain no longer ${this.chain.length} !> ${JSON.stringify(newChain.length)}`)
        }
    }


    getDifficulty(): number {
        let currentDifficulty: number = 2;
        
        /* if (this.chain.length > 2015) {
            const latest_block = this.getLatestBlock();
            const twoweeks = 1209600;
            const period = (latest_block.timestamp - under2016_block.timestamp);
            const calc = period%twoweeks;
            const under2016_block = this.chain[this.chain.length - 2016];

            
            if(calc == 0){
                const ttltime = (latest_block.timestamp - under2016_block.timestamp);

                // console.log(`bloco: ${this.chain.length-1}`)
            }
        } */
        return currentDifficulty;
    }

    addContract(contract: any) {
        if (!contract.fromAddress ) {
            throw new Error('Contract must include From and To address')
        }

        if (this.getBalanceOfAddress(contract.fromAddress) >= contract.amount) {
            
            if (contract.isValid()) {
                // console.log(`Nice!`)
            }
            
            if (!contract.isValid()) {
                throw new Error('Cannot add invalid contract to the chain');
            }
            
            const isMined = this.chain.some((block: any)=>{
                block.contracts.some((minedContract: any)=>{
                    return (minedContract.hash === contract.hash && minedContract.timestamp === contract.timestamp)
                })
            })
            
            let isPending = this.pendingContracts.some(pendingContract=>{
                return (pendingContract.hash === contract.hash && pendingContract.timestamp === contract.timestamp) && !isMined
            })
            
            if(isMined && isPending){
                const currentPendingList = this.pendingContracts.find(currentContract=>{
                    return currentContract.hash !== contract.hash && currentContract.timestamp !== contract.timestamp
                })
                
                Object.assign(this.pendingContracts, currentPendingList)
                isPending = false
            }
            
            if (!isPending) {
                this.pendingContracts.push(contract);
            }
            
        } else {throw new Error('No founds')}
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    
    minePendingContracts(miningRewardAddress: string) {
        let block = new Block(Date.now(), this.pendingContracts, this.getLatestBlock().hash)
        block.mine(this.target)
        this.chain.push(block)
        this.pendingContracts = [new Contract(new Date().getTime(), null, miningRewardAddress, this.fee)]
    }

    getBalanceOfAddress(address: string) {
        let balance: number = 0;
        for (const block of this.chain) {
            for (const contract of block.contracts) {
                if (contract.fromAddress === address) {
                    balance -= contract.amount;
                }
                if (contract.toAddress === address) {
                    balance += contract.amount;
                }
            }
        }
        return balance
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if(currentBlock.previousHash !== previousBlock.hash){
                return false
            }            
            if (!currentBlock.hasValidContracts()) {
                return false
            }
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.error("hash not equal: " + JSON.stringify(currentBlock))
                return false
            }
            if (currentBlock.previousHash !== previousBlock.calculateHash()) {
                console.error("previous hash not right: " + JSON.stringify(currentBlock))
                return false
            }
            return true
        }

    }
    
    createGenesisBlock() {
        // 2022-12-19T21:12:48.585Z
        const newBlock: any = {
            timestamp: new Date('2022-08-27T00:00:00.000Z').getTime(),
            previousHash: "",
            contracts: ["TRÍADE-Blockchain"],
            nonce: 0
        }
        newBlock.hash=SHA256(newBlock.timestamp + newBlock.previousHash + JSON.stringify(newBlock.contracts) + newBlock.nonce).toString()
        // console.log(newBlock.hash)
        return new Block(newBlock.timestamp, newBlock.contracts, undefined, newBlock.nonce);
    }

}

export class Contract {

    timestamp: number;
    fromAddress: string | null;
    toAddress: string;
    amount: number;
    payload?: any;
    signature?: string;


    constructor( timestamp: number, fromAddress: string | null, toAddress: string , amount: number, payload?: any | undefined, signature?: string) {

        this.timestamp = timestamp;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.payload = payload;
        this.signature = signature;
    }

    calculateHash(): string {
        if(this.payload){
            const newDataHash = SHA256(`${this.payload.data.businessRating}${this.payload.data.businessWallet}${this.payload.data.businessName}${this.payload.data.businessImage}${this.payload.data.businessService}${this.payload.data.businessProducts?JSON.stringify(this.payload.data.businessProducts):null}${this.payload.data.businessAddress?this.payload.data.addressHash:null}`).toString()
            
            if(newDataHash === this.payload.data.dataHash){
                return SHA256(`${this.payload.header.timestamp}${this.payload.header.owner}${this.payload.header.toAddress}${this.payload.header.amount}${newDataHash}`).toString()
            }
            
        }
        return SHA256(`${this.timestamp}${this.fromAddress}${this.toAddress}${this.amount}`).toString()
    }


    isValid(): boolean {
        // console.log(`\n\n${(JSON.stringify(this.signature))}\n\n`)
        if (this.fromAddress === null) return true

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this contract')
        }

        const key = ec.keyFromPublic(this.fromAddress, 'hex')
        return key.verify(this.calculateHash(), this.signature)
    }
}

// const constract = new Contract()

/* const block = new Block(new Date().getTime(), pendingDatas, chain[chain.length - 1].hash)

block.mineBlock(chainHeader.target)

const alicePrivateKey = '815eeac8fcb9aee5d097ad6cedc3d2310c1c258d67b50bda9377c1badddd33bc'
const alicePublicKey = '04a9d3154a24b2aebb23f30f920ded627e131e0a3eb2624c4506842f6299ed1b29a51bd772ca0208c638c37224409e9d51b476989995482ec0f5fc4a93d3c034e0'


// console.log(block)
 */

/* 
// wallet:
const myPrivateKey = '1c258d67b50bda9377c1badddd33bc815eeac8fcb9aee5d097ad6cedc3d2310c';
const myPublicKey = ec.keyFromPrivate(myPrivateKey);
const myWalletAddress = myPublicKey.getPublic('hex');
const alicePrivateKey = '815eeac8fcb9aee5d097ad6cedc3d2310c1c258d67b50bda9377c1badddd33bc'
const alicePublicKey = '04a9d3154a24b2aebb23f30f920ded627e131e0a3eb2624c4506842f6299ed1b29a51bd772ca0208c638c37224409e9d51b476989995482ec0f5fc4a93d3c034e0'
const triade = new BlockChain();
const tx1 = new Transaction(myWalletAddress, alicePublicKey, 60);
tx1.signTransaction(myPrivateKey);
triade.addTransaction(tx1);

// Tunelling transactions and asingnment to full nodes
triade.minePendingTransactions(myWalletAddress);
// console.log("Balance of Alice's account is: ", triade.getBalanceOfAddress(alicePublicKey));
const tx2 = new Transaction(alicePublicKey, myWalletAddress, 20);
tx2.signTransaction(alicePrivateKey);
triade.minePendingTransactions(myWalletAddress);
// console.log("Balance of Alice's account is: ", triade.getBalanceOfAddress(alicePublicKey));
const tx3 = new Transaction(myWalletAddress, alicePublicKey, 60);
tx3.signTransaction(myPrivateKey);
triade.addTransaction(tx3);
triade.minePendingTransactions(myWalletAddress);
// console.log("Balance of Alice's account is: ", triade.getBalanceOfAddress(alicePublicKey));
const tx4 = new Transaction(alicePublicKey, myWalletAddress, 20);
tx4.signTransaction(alicePrivateKey);
triade.addTransaction(tx4);
triade.minePendingTransactions(myWalletAddress);
// console.log("Balance of Alice's account is: ", triade.getBalanceOfAddress(alicePublicKey)); */

