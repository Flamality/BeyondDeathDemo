import { Canvas } from "@react-three/fiber";
import Baseplate from "../objects/environment/Baseplate";
import { ACESFilmicToneMapping } from "three";
import { Physics, RigidBody } from "@react-three/rapier";
import Player from "../player/Player";
import ItemEngine from "./ItemEngine";
import WallMap from "../objects/map/walls/WallMap";
import { XR } from "@react-three/xr";
import { usePlayerData } from "../context/PlayerData";
import Doors from "../objects/map/doors/Doors";
import { AudioProvider } from "../context/Audio";
import Ceiling from "../objects/map/ceiling/Ceiling";
import { Suspense } from "react";
import {Stats} from '@react-three/drei';
import { Perf } from "r3f-perf";

export default function Engine() {
  const { store, paused } = usePlayerData();
  return (
    <div className='canvas'>
      <Suspense fallback={<p>Loading...</p>}>
      <Canvas
        dpr={window.devicePixelRatio}
        gl={{
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
          antialias: true,
          powerPreference: "high-performance",

        }}
        frameloop='demand'
        // frameloop={paused ? "never" : "always"}
        shadows
      >
        <Perf />
        <AudioProvider>
        <XR store={store}>
          
          {/* ENVIRONMENT */}

            {/* <Gltf src="/stuff/gay.gltf" position={[40,0.01,40]} scale={1} /> */}
            
            <ambientLight intensity={0.01}  />
            {/* <hemisphereLight intensity={0.1} /> */}
            {/* <pointLight
            position={[5, 3, 5]}
            intensity={20}
            distance={96}
            // castShadow
            /> */}
            <color attach='background' args={["#0f0b0b"]} />

          {/* MAP */}
          {/* <Mirror /> */}

          {/* PHYSICS */}
          <Physics gravity={[0, -9.81, 0]} paused={paused}>
            <Player />
            <WallMap />
            <Ceiling />
            {/* OBJECTS */}
            <ItemEngine />
            <Doors />
            <Baseplate />
          </Physics>
        </XR>
        </AudioProvider>
      </Canvas>
      </Suspense>
    </div>
  );
}
