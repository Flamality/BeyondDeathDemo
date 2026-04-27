import { Canvas } from "@react-three/fiber";
import Baseplate from "../objects/environment/Baseplate";
import { ACESFilmicToneMapping } from "three";
import { Physics } from "@react-three/rapier";
import Player from "../player/Player";
import ItemEngine from "./ItemEngine";
import WallMap from "../objects/map/walls/WallMap";
import { usePlayerData } from "../context/PlayerData";
import Doors from "../objects/map/doors/Doors";
import { AudioProvider } from "../context/Audio";
import Ceiling from "../objects/map/ceiling/Ceiling";
import { Suspense, useEffect, useState } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import MainMenu from "../ui/MainMenu";
import { PerspectiveCamera } from "@react-three/drei";
import Dev_placepreview from "../player/dev_placepreview";

export default function Engine() {
  const [worldReady, setWorldReady] = useState(false);
  const { paused, inMenu } = usePlayerData();

  useEffect(() => {
    const id = requestAnimationFrame(() => setWorldReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className='canvas'>
      <Suspense fallback={<p>Loading...</p>}>
      <Canvas
  dpr={[1, 2]}
  gl={{
    toneMapping: ACESFilmicToneMapping,
    toneMappingExposure: 1.25,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  }}
  onCreated={({ gl }) => {
    gl.shadowMap.enabled = true;
  }}
  frameloop="demand"
  shadows={{ type: THREE.PCFShadowMap }}
>
        <ambientLight intensity={0.01}  />
          <fogExp2 attach="fog" args={['#000000', 0.1]} />
          <color attach='background' args={["#0f0b0b"]} />

          {/* MENY */}
          <PerspectiveCamera makeDefault={inMenu} position={[0, 1, 0]} rotation={[0, 0, 0]} />
          <MainMenu  />

        {!inMenu &&(
          <Suspense fallback={null}>
            <Perf showGraph={false} position="top-right" />
            <AudioProvider>
              <Physics gravity={[0, -9.81, 0]} paused={paused} debug={true}>
                <Dev_placepreview />
                <WallMap />
                <Ceiling />
                <Doors />
                <Baseplate />
                {worldReady && (
                  <>
                    <ItemEngine />
                    <Player />
                  </>
                )}
              </Physics>
            </AudioProvider>
        </Suspense>
        )}
      </Canvas>
      </Suspense>
    </div>
  );
}
