import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Box(props: any) {

  const mesh: any = useRef(null)

  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  useFrame((state, delta) => {
    mesh.current.rotation.y += delta
    return
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.2 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[4, 4, 4]} />
      <meshStandardMaterial color={hovered ? '#645' : '#465'} />
    </mesh>
  )
}


export default function Room() {

  const [cLientW, setCLientW] = useState(0)
  const [cLientH, setCLientH] = useState(0)

  useEffect(()=>{
    setCLientW(window.innerWidth)
    setCLientH(window.innerHeight)
  },[])
  
  return (
    <Canvas style={{width: `${cLientW}px`, height: `${cLientH}px`, position: 'absolute', background: '#1327'}}>
      <ambientLight />
      <pointLight position={[1, 1, 1]} />
      <Box position={[5, -5, 0]} />
      <Box position={[5, 0, 0]} />
    </Canvas>
  )
}
