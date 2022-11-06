import styled from 'styled-components'

import { HomeType } from '../pages'

export const Wrapper = styled.main<HomeType>`
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #bbd;

    @media (max-width: 768px) {
        width: 100vw;
        height: 100vh;
    }
`

export const Float = styled.div<HomeType>`
    width: 100vw;
    position: absolute;
    top: 0px;
    background: #bbd;
`

export const ChainHeader = styled.div<HomeType>`
    width: 100vw;
    height: 20vh;
    position: relative;
    top: 0px;
    background: #fff8;
    font-size: 8px;
    border: 1px solid #08f8;
`

export const HashWrapper = styled.div<HomeType>`
    width: 100vw;
    height: 5vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff8;
    border: 1px solid #08f8;
`

export const NetworkInfoWrapper = styled.div<HomeType>`
    width: 100vw;
    height: 5vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff8;
    border: 1px solid #08f8;
`

export const ChainInfoWrapper = styled.div<HomeType>`
    width: 100vw;
    height: 5vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff8;
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
    background: #fff8;
    font-size: 10px;
    border: 1px solid #08f8;
    overflow: auto;
    z-index: 1;
`

export const Footer = styled.div<HomeType>`
    width: 100vw;
    height: 25vh;
    background: #fff8;
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
    background: #bbd;
`

export const SendBtn = styled.button<HomeType>`
    height: 100%;
    background: #88f;
    border: none;
`

export const BodyContainer = styled.div<HomeType>`
    width: 100vw;
    height: 200px;
    background: #bbd;
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

export const ChainContainer2 = styled.div<HomeType>`

    width: 100%;
    height: calc(100vh - 3em - 60px);
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: calc(3em + 60px);
    overflow: auto;
    background: #000;
    padding-top: 20px;
    color: white;

    ::-webkit-scrollbar{
        display: none;
    }
    -ms-overflow-style:none;
    scrollbar-width: none;
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
    background: #000;
    padding-top: 20px;


    ::-webkit-scrollbar{
        display: none;
    }
    -ms-overflow-style:none;
    scrollbar-width: none;
`
