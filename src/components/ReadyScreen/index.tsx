import Image from "next/image";
import { useEffect, useState } from "react"
import * as S from "./ReadyScreenStyled"
import metabook from '../../images/meta-logo.png'
import oasisBeta from '../../images/oasis-beta-logo.png'
import ReadyPreload from "./ReadyPreload";
import CountDown from "./CountDown";

export type ReadyScreenType = {
    isReady?: boolean;
    cursor?: boolean;
    readScreenPercent?: number;
}

export default function ReadyScreen({}: any){

    const [isReady, setIsReady] = useState(true)
    const [playerName, setPlayerName] = useState('Player 1')
    const [cursor, setCursor] = useState(true)

    function te(e:any){
        e.preventDefault()
    }

    return (
        <S.Wrapper>
            <S.MetaverseList>
                <Image
                src={metabook}
                quality={100}
                layout={'intrinsic'} />
            OASIS (Ontologically Anthropocentric Sensory Immersive Simulation)
            </S.MetaverseList>

            <S.ReadyPreloadContainer>
                <ReadyPreload/>
            </S.ReadyPreloadContainer>
            <S.Form onSubmit={te}>
                <S.PlayerNameWrapper disabled={!isReady} isReady={isReady} value={playerName} onChange={e=>setPlayerName(e.target.value)} />
                <button style={{display: 'none'}}>Enter</button>
            </S.Form>
            <S.CounterContainer>
                <CountDown/>
            </S.CounterContainer>
        </S.Wrapper>
    )
}