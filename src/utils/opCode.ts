export function getUpcodeFromJson(jsonObject: any){

    const protocol = Buffer.from(jsonObject.protocol).toString('base64')
    const owner = jsonObject.header.owner
    const toAddress = jsonObject.header.toAddress
    const amount = Buffer.from(jsonObject.header.amount).toString('base64')
    const signature = jsonObject.header.signature
    const timestamp = jsonObject.header.timestamp
    const payload = Buffer.from(jsonObject.payload).toString('base64')
    
    // Buffer.from("TAD-01").toString('base64')
    // 'VEFELTAx'
    // Buffer.from("VEFELTAx", 'base64').toString('ascii')
    // 'TAD-01'

    switch (protocol) {

        case 'VEFELTAw':
            // Test protocol 'TAD-00'

            const opCode = `${protocol}${timestamp}${owner}${toAddress}${amount}${payload}${signature}`
            return opCode
            
            break;
    
        case 'VEFELTAx':
            // Test protocol 'TAD-01'
            
            break;
    
        default:
            break;
    }
}