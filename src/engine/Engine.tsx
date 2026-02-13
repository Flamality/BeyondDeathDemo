import { Canvas } from '@react-three/fiber'
import Baseplate from '../objects/environment/Baseplate'
import { ACESFilmicToneMapping } from 'three'
import { Physics, RigidBody } from '@react-three/rapier'
import Player from '../player/Player'
import ItemEngine from './ItemEngine'
import WallMap from '../objects/map/walls/WallMap'
    import { createXRStore, VRButton, XR } from '@react-three/xr'

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
    const store = createXRStore({
        controller:{
            left: true,
            right: true
        }
    })
  return (
    <div className='canvas'>
        <VRButton store={store} />
        <Canvas dpr={window.devicePixelRatio} gl={{
                toneMapping: ACESFilmicToneMapping,
                toneMappingExposure: 1.25,
            }}>
            <XR store={store}>
                {/* ENVIRONMENT */}
                {/* <Environment preset='warehouse'  /> */}
                <ambientLight castShadow intensity={1} />
                <color attach="background" args={["#0f0b0b"]} />

                {/* MAP */}

                
                {/* PHYSICS */}
                <Physics gravity={[0, -9.81, 0]}>
                    <WallMap />
                    <Player />
                    {/* OBJECTS */}
                    <ItemEngine />
                    <RigidBody type='fixed'><Baseplate /></RigidBody>
                </Physics>
            </XR>
        </Canvas>
    </div>
  )
}