import { Canvas } from '@react-three/fiber'
import React from 'react'

function Cube() {
    return (
        <mesh>
            <boxGeometry args={[2,2,2]}></boxGeometry>
            <meshStandardMaterial color={'hotpink'} />
        </mesh>
    )
}

export default function Engine() {

  return (
    <Canvas dpr={window.devicePixelRatio} >
        <color attach="background" args={["#B0DAFF"]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Cube />
    </Canvas>
  )
}