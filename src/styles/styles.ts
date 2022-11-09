import styled from 'styled-components'

import { HomeType } from '../pages'

export const Preloading = styled.div<HomeType>`
    width: 100%;
    height: 100%;
    background: transparent;
`

export const Wrapper = styled.main<HomeType>`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #000;

    @media (max-width: 768px) {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: #000;
    }
`

export const ImageContainer = styled.div<HomeType>`
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0px;
    background: transparent;
`
export const Float = styled.div<HomeType>`
    width: 100vw;
    position: absolute;
    top: 0px;
    background: transparent;
    z-index: 2;
`

export const ChainHeader = styled.div<HomeType>`
    width: 100vw;
    height: 20vh;
    position: relative;
    top: 0px;
    background: transparent;
    font-size: 8px;
    border: 1px solid #08f8;
    z-index: 1;
`

export const HashWrapper = styled.div<HomeType>`
    width: 100vw;
    height: 5vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid #08f8;
`

export const ContentWrapper = styled.div<HomeType>`
    width: 100%;
    height: 100%;
    background: #fff;
    opacity: ${({isLoading})=>isLoading?'0':'0.95'};
    transition: 0.1s ease-in-out;
`

export const NetworkInfoWrapper = styled.div<HomeType>`
    width: 100vw;
    height: 5vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid #08f8;
`

export const PendingsWrapper = styled.div<HomeType>`
    width: 33.33%;
    height: 100%;
`

export const ChainInfoWrapper = styled.div<HomeType>`
    width: 100vw;
    height: 5vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid #08f8;
`


export const ChainContainer = styled.div<HomeType>`
    width: 100%;
    height: 55vh;
    padding: 0px 8px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    background: transparent;
    font-size: 10px;
    border: 1px solid #08f8;
    overflow: auto;
    z-index: 3;
`

export const Footer = styled.div<HomeType>`
    width: 100vw;
    height: 25vh;
    background: transparent;
    font-size: 8px;
    border: 1px solid #08f8;
`

export const Methods = styled.div<HomeType>`
    height: 3em;
    background: #bbd;
    border: none;
    cursor: pointer;
`

export const MethodOptions = styled.div<HomeType>`
    height: 9em;
    background: #bbd;
    border: none;
    display: flex;
    gap: 8px;
    flex-direction: column;
    position: absolute;
`

export const InputContainer = styled.div<HomeType>`
    width: 100%;
    height: 3em;
    gap: 16px;
    display: flex;
    background: transparent;
`

export const SendBtn = styled.button<HomeType>`
    height: 100%;
    background: transparent;
    border: none;
`

export const BodyContainer = styled.div<HomeType>`
    width: 100vw;
    height: 200px;
    background: transparent;
`

export const MineBtnContainer = styled.div<HomeType>`
    width: 60px;
    min-height: 60px;

    position: fixed;
    bottom: 1em;
    right: 1em;

    z-index: 3;

    display: flex;
    justify-content: space-evenly;
    cursor: pointer;
`


export const SwitchWrapper = styled.div<HomeType>`
    width: 100%;
    min-height: 60px;

    position: fixed;
    top: 3em;
    
    display: flex;
    justify-content: space-evenly;
`

export const SwitchChainBtn = styled.button<HomeType>`
    width: 50%;
    min-height: 60px;

    border-radius: ${({highlight})=>highlight? '60px 60px 0px 0px': '0px'};
    
    display: flex;
    align-items: center;
    justify-content: center;

    color: ${({highlight})=>highlight? '#fff': '#000'};
    font-weight: bold;
    background: ${({highlight})=>highlight? '#000': 'transparent'};
    border: none;
    cursor: pointer;
    transition: 0.2s ease-in-out;
`

export const PendingsContainer = styled.div<HomeType>`
    width: 100%;
    height: calc(100vh - 3em - 60px);
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: calc(3em + 60px);
    overflow: auto;
    background: transparent;
    padding-top: 20px;


    ::-webkit-scrollbar{
        display: none;
    }
    -ms-overflow-style:none;
    scrollbar-width: none;
`
