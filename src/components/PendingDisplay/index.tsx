import * as S from './PendingDisplayStyled'

export default function PendingDisplay({data}:any){
    const {timestamp} = data
    const {amount} = data
    const {fromAddress} = data
    const {toAddress} = data
    const {hash} = data
    const {signature} = data
    return (
        <S.Wrapper>
            <S.Topbar>
                {timestamp && <S.TimestampWrapper>{`time: ${timestamp}`}</S.TimestampWrapper>}
                {amount && <S.AmountWrapper>{`TAD: ${amount}`}</S.AmountWrapper>}
            </S.Topbar>
            {fromAddress && <S.FromAddressWrapper>{`From: ${fromAddress}`}</S.FromAddressWrapper>}
            {toAddress && <S.ToAddressWrapper>{`To: ${toAddress}`}</S.ToAddressWrapper>}
            {signature && <S.SignatureWrapper>{`Sig: ${signature}`}</S.SignatureWrapper>}
            {hash && <S.HashWrapper>{`hash: ${hash}`}</S.HashWrapper>}
        </S.Wrapper>
    )
}