import { Environment, PointerLockControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Baseplate from '../objects/environment/Baseplate'
import { ACESFilmicToneMapping } from 'three'
import { Physics } from '@react-three/rapier'
import Player from '../player/Player'

function Cube() {
    return (
        <mesh>
            <boxGeometry args={[1,1,1]} ></boxGeometry>
            <meshStandardMaterial color={'red'} />
        </mesh>
    )
}

export default function Engine() {
  return (
    <div className='canvas'>
        <Canvas dpr={window.devicePixelRatio} gl={{
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.2
      }}>
            {/* ENVIRONMENT */}
            <Environment preset='dawn'  />
            <color attach="background" args={["#1b242c"]} />

            {/* PLAYER */}
            <Player />
            
            {/* PHYSICS */}
            <Physics gravity={[0, -9.81, 0]}>

            {/* OBJECTS */}
                <Baseplate />
                <Cube />
            </Physics>
        </Canvas>
    </div>
  )
}