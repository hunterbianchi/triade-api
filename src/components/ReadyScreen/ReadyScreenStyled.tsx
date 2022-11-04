import styled from "styled-components";
import { ReadyScreenType } from ".";

export const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: #000;
    position: absolute;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    font-size: 80px;
    font-weight: bold;
`

export const MetaverseList = styled.div`
    width: 100vw;
    height: 100px;
    background: #f00;
    position: absolute;
    top: 0px;

    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;
    color: #fff;
    font-size: 10px;
    font-weight: bold;
`

export const ReadyPreloadContainer = styled.div`
    color: #000;
    background: transparent;
`

export const Form = styled.form`
    width: 100vw;
    height: 1em;
    font-size: 100px;
    display: flex;
    flex-direction: column;
`

export const PlayerNameWrapper = styled.input<ReadyScreenType>`
    width: 100vw;
    height: 1em;
    text-align: center;
    background: transparent;
    border: none;
    outline: none;
    color: ${({isReady})=>isReady?'#fff':'#fff8'};
    font-size: 100px;
    font-weight: bold;
`

export const CursorWrapper = styled.div<ReadyScreenType>`
    width: 10px;
    height: 1em;
    background: transparent;

    animation-duration: 1s;
    animation-name: ${true? 'blink-transparency': 'blink'};
    animation-iteration-count: infinite;
    animation-play-state: running;

    @keyframes blink {
        0% {
            background: transparent;
        }
        50% {
            background: #fff;
        }
        100% {
            background: transparent;
        }
    }
    @keyframes blink-transparency {
        0% {
            background: transparent;
        }
        50% {
            background: #fff2;
        }
        100% {
            background: transparent;
        }
    }
`

export const CounterContainer = styled.div`
    text-align: center;
    color: #fff;
    font-size: 40px;
    font-weight: bold;
`