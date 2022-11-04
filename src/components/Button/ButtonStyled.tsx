import styled from 'styled-components'

export const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const Button = styled.button`
    width: 100%;
    height: min(100%, 3em);
    border-radius: 8px;
    border: none;
    outline: none;
    font-weight: bold;
    color: #fff;
    border-top: 1px solid #88b;
    border-bottom: 2px solid #004;
    background: var(--button-background);
    box-shadow: 0px 4px 8px #000b;
    cursor: pointer;
    
    :hover{
        color: #004;
        background: var(--button-hover-background);
        box-shadow: 0px 0px 32px #bbf;
        border: 1px solid #88b;
    }
`