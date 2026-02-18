import { Canvas } from '@react-three/fiber'
import Baseplate from '../objects/environment/Baseplate'
import { ACESFilmicToneMapping } from 'three'
import { Physics, RigidBody } from '@react-three/rapier'
import Player from '../player/Player'
import ItemEngine from './ItemEngine'
import WallMap from '../objects/map/walls/WallMap'
import { XR } from '@react-three/xr'
import { usePlayerData } from '../context/PlayerData'
import {Mirror} from '../objects/map/misc/Mirror'

export default function Engine() {
    const {store, paused } = usePlayerData();
  return (
    <div className='canvas'>
        <Canvas dpr={window.devicePixelRatio} gl={{
                toneMapping: ACESFilmicToneMapping,
                toneMappingExposure: 1.25,
                antialias: true,
                powerPreference: 'high-performance',
            }}
            frameloop={paused ? 'never' : 'always'}
            >
            <XR store={store}>
                {/* ENVIRONMENT */}
                {/* <Environment preset='warehouse'  /> */}
                <ambientLight castShadow intensity={1} />
                <color attach="background" args={["#0f0b0b"]} />

                {/* MAP */}
                <Mirror />
                
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