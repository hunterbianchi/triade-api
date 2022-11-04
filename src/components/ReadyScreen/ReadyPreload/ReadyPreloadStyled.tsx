import styled from "styled-components";
import { PreloadType } from ".";

export const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background: transparent;
`

export const Preload = styled.div<PreloadType>`
    width: 100%;
    height: 100%;
    position: relative;
    top: 0px;
    border-top: solid 1px #888;
    color: #000;
    background: ${({readScreenPercent})=>readScreenPercent?`linear-gradient(360deg, #fff 0%, #fff ${readScreenPercent}%, #000 ${readScreenPercent+4}%, #000 100%)`:'#fff'};
`