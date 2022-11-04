import { useEffect, useState } from 'react'
import * as S from './ReadyPreloadStyled'

export type PreloadType = {
    readScreenPercent?: number;
}

export default function ReadyPreload({}: any){

    const [readScreenPercent, setReadScreenPercent] = useState<number>(0)

    return (
        <S.Wrapper>
            <S.Preload readScreenPercent={readScreenPercent}>
                {'Ready'}
            </S.Preload>
        </S.Wrapper>
    )
}