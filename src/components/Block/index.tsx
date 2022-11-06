import * as S from './BlockStyled'
import * as F from 'react-icons/fa'
import { useEffect } from 'react'

export default function Block(props: any){
    /* const data = {
        index: 378,
        timestamp: ``,
        nonce: 7752,
        hash: `efc9e923fc16cda2446214dc00fda19093e11913a2ec49aef92f56dad6c81396`,
    } */
    const {data} = props


    return (
        <S.Wrapper>
            <S.Topbar>
                <S.TopSec1>
                    <S.TopCol1>
                        <S.VisualIdWrapper/>
                    </S.TopCol1>
                    <S.TopCol2>
                        <S.TopLn1>
                            <S.IndexWrapper>
                                {`#${data.index}`}
                            </S.IndexWrapper>
                            <S.TimestampWrapper>
                                {`Time: ${data.timestamp}`}
                            </S.TimestampWrapper>
                            <S.NonceWrapper>
                                {`Nonce: ${data.nonce}`}
                            </S.NonceWrapper>
                        </S.TopLn1>
                        <S.TopLn2>
                            <S.DataSizeWrapper>
                                {`Size: ${10} MB`}
                            </S.DataSizeWrapper>
                            <S.DataSizeWrapper>
                                {`Amount: TAD ${273} Mi`}
                            </S.DataSizeWrapper>
                            <S.DataSizeWrapper>
                                {`Tax: TAD ${273*0.004} Mi`}
                            </S.DataSizeWrapper>
                        </S.TopLn2>
                    </S.TopCol2>
                </S.TopSec1>
                <S.TopSec2>
                    <S.HashWrapper>
                        {`Hash: ${data.hash}`}
                    </S.HashWrapper>
                    <S.CopyHashBtn>
                        <F.FaCopy/>
                    </S.CopyHashBtn>
                </S.TopSec2>
            </S.Topbar>
        </S.Wrapper>
    )
}