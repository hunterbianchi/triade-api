import base58 from "bs58"
import CryptoJS from "crypto-js"
import { SHA256 } from "crypto-js"
import base64 from 'crypto-js/enc-base64'

export function slicePrivate(privateKey:string){
        const firs = privateKey.slice(0, 8)
        const second = privateKey.slice(8, 16)
        const tird = privateKey.slice(16, 24)
        const fourth = privateKey.slice(24, 32)
        const fifth = privateKey.slice(32, 40)
        const sixth = privateKey.slice(40, 48)
        const seventh = privateKey.slice(48, 56)
        const eighth = privateKey.slice(56, 64)

        const sliced = `${firs} - ${second} - ${tird} - ${fourth} - ${fifth} - ${sixth} - ${seventh} - ${eighth}`
        
        return sliced
}

export function getP2PKHAddress(privateKey:string){
        
}
export function getP2SHAddress(privateKey:string){
        
}
export function getWif(privateKey:string){
        const hexPrefix = '80'
        const versionAndPrivateKey = hexPrefix + privateKey
        const firstSHA = SHA256(versionAndPrivateKey).toString()
        const secondSHA = SHA256(firstSHA).toString()
        const wif = hexPrefix + privateKey + secondSHA.substring(0, 8)
        return wif
}