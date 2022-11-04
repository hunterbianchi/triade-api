import { useState } from 'react'
import * as S from './InputStyled'



export default function Input(props:any){

    const [ onfocus, setOnfocus ] = useState<boolean>(false)

    return(
        <S.InputStyled
        {...props}
        theme={props.theme}
        type={props.type === undefined? 'text': props.type}
        placeholder={props.placeHolder}
        onChange={props.handleValue}
        value={props.value}
        onFocus={e=>setOnfocus(true)}
        onBlur={e=>setOnfocus(false)}/>        
    )
}