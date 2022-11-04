import * as S from './ButtonStyled'

export default function Button({value, clicked}:any){
    return(
        <S.Button onClick={clicked}>
            {value}
        </S.Button>
    )
}