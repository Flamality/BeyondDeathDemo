import { Canvas } from '@react-three/fiber'
import Baseplate from '../objects/environment/Baseplate'
import { ACESFilmicToneMapping } from 'three'
import { Physics, RigidBody } from '@react-three/rapier'
import Player from '../player/Player'
import { Box } from '../objects/map/items/Props'
import ItemEngine from './ItemEngine'

function Cube() {
    return (
        <RigidBody type='dynamic'>
        <mesh>
            <boxGeometry args={[1,1,1]} ></boxGeometry>
            <meshStandardMaterial color={'green'} />
        </mesh></RigidBody>
    )
}

export default function Engine() {
  return (
    <div className='canvas'>
        <Canvas dpr={window.devicePixelRatio} gl={{
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.25
      }}>
            {/* ENVIRONMENT */}
            {/* <Environment preset='warehouse'  /> */}
            <ambientLight castShadow intensity={1} />
            <color attach="background" args={["#0f0b0b"]} />

            {/* PLAYER */}
            
            {/* PHYSICS */}
            <Physics gravity={[0, -9.81, 0]}>
                <Player />
                {/* OBJECTS */}
                <ItemEngine />
                <RigidBody type='fixed'><Baseplate /></RigidBody>
            </Physics>
        </Canvas>
    </div>
  )
}