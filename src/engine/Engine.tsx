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
import Dev_placepreview from "../player/dev_placepreview";
import PhotoSecrets from "../objects/map/items/PhotoSecrets";
import { useSettings } from "../context/Settings";

export default function Engine({ onReady }: { onReady?: () => void }) {
  const [worldReady, setWorldReady] = useState(false);
  const { paused } = usePlayerData();
  const showDevTools = import.meta.env.VITE_DEV;
  const { quality } = useSettings();
  const dpr: [number, number] =
    quality === "low" ? [0.75, 1] : quality === "high" ? [1, 2] : [1, 1.5];
  const shadowType =
    quality === "low" ? THREE.BasicShadowMap : THREE.PCFShadowMap;

  useEffect(() => {
    const id = requestAnimationFrame(() => setWorldReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (worldReady) {
      onReady?.();
    }
  }, [onReady, worldReady]);

  return (
    <div className='canvas'>
      <Suspense fallback={<p>Loading...</p>}>
        <Canvas
          dpr={dpr}
          gl={{
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
            antialias: quality !== "low",
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
          }}
          frameloop='demand'
          shadows={quality === "low" ? false : { type: shadowType }}
        >
          <ambientLight intensity={0.01} />
          <fogExp2 attach='fog' args={["#000000", 0.1]} />
          <color attach='background' args={["#0f0b0b"]} />
          <Suspense fallback={null}>
            {showDevTools && <Perf showGraph={false} position='top-right' />}
            <AudioProvider>
              <Physics gravity={[0, -9.81, 0]} paused={paused} debug={false}>
                <Dev_placepreview />
                <WallMap />
                <Ceiling />
                <Doors />
                <Baseplate />
                <PhotoSecrets />
                {worldReady && (
                  <>
                    <ItemEngine />
                    <Player />
                  </>
                )}
              </Physics>
            </AudioProvider>
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
}
