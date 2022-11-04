import React, { useState } from 'react'
import Lottie from 'react-lottie'
import * as S from './LoadingStyled'

import loading from '../../../public/loading.json'

export default function Loading () {
  const [animationState] = useState({
    isStopped: false,
    isPaused: false
  })

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  return (
    <S.Wrapper>
      <Lottie
        options={defaultOptions}
        height={400}
        width={400}
        isStopped={animationState.isStopped}
        isPaused={animationState.isPaused}
      />
    </S.Wrapper>
  )
}


