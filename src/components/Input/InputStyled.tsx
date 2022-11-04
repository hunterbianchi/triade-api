import styled from 'styled-components'
import { HomeType } from '../../pages'


export const InputStyled = styled.input<HomeType>`
    width: 100%;
    height: min(100%, 500px);
    padding: 12px;
    border-radius: 8px;
    border: none;
    border-top: ${({theme})=>theme === 'dark'? '2px solid #000': '2px solid #232388'};
    border-bottom: ${({theme})=>theme === 'dark'? '2px solid #bbf': '2px solid #ffffff'};
    outline: none;
    color: ${({theme})=>theme === 'dark'? '#fff': '#000'};
    font-weight: bold;
    word-break: break-all;
    background: ${({theme})=>theme === 'dark'? 'linear-gradient( #224 0%, #446 30%, #446 100% )': 'linear-gradient( #626269 0%, #cecee4 25%, #e2f4ff 50%, #cecee4 100% )'} ;
    box-shadow: ${({theme})=>theme === 'dark'? '0px 0px 40px #b0b0bb': '0px 8px 16px 8px #000000c5'};

    :focus{
        background: ${({theme})=>theme === 'dark'? 'linear-gradient( #224 0%, #446 30%, #446 100% )': 'linear-gradient( #e1e1f3 10%, #ffffff 25%, #ffffff 70%, #d4d4ff 80%, #446 95% )'};
        box-shadow: ${({theme})=>theme === 'dark'? '0px 0px 40px #b0b0bb': '10px 20px 40px 16px #000000c5'};
        color: #224;
        border-top: ${({theme})=>theme === 'dark'? '2px solid #bbf': '2px solid #ffffff'};
        border-bottom: ${({theme})=>theme === 'dark'? '2px solid #000': '2px solid #1a1a3b'};
    }

    ::placeholder{
        color: ${({theme})=>theme === 'dark'? '#fff8': '#000'};
    }
`