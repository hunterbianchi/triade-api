export function getUpcodeFromJson(jsonObject: any){

    const protocol = Buffer.from(jsonObject.protocol).toString('base64')
    const header = Buffer.from(jsonObject.header).toString('base64')
    const payload = Buffer.from(jsonObject.payload).toString('base64')
    
    const protocolLengthBs64 = protocol.length
    const headerLengthBs64 = header.length
    const payloadLengthBs64 = payload.length

    // Buffer.from("TAD-01").toString('base64')
    // 'VEFELTAx'
    // Buffer.from("VEFELTAx", 'base64').toString('ascii')
    // 'TAD-01'

    switch (protocol) {

        case 'VEFELTAw':
            // Test protocol 'TAD-00'

            const opCode = `${protocol}${header}${payload}`
            return opCode
            
            break;
    
        case 'VEFELTAx':
            // Test protocol 'TAD-01'
            
            break;
    
        default:
            break;
    }

    const opCode = `${protocol}${header}${payload}`
    return opCode
}