import { Canvas } from "@react-three/fiber";
import Baseplate from "../objects/environment/Baseplate";
import { ACESFilmicToneMapping } from "three";
import { Physics, RigidBody } from "@react-three/rapier";
import Player from "../player/Player";
import ItemEngine from "./ItemEngine";
import WallMap from "../objects/map/walls/WallMap";
import { XR } from "@react-three/xr";
import { usePlayerData } from "../context/PlayerData";
import { Mirror } from "../objects/map/misc/Mirror";
import type { Material } from "three";
import PauseMenu from "../ui/PauseMenu";
import Inventory from "../ui/Inventory";

export default function Engine() {
  const { store, paused } = usePlayerData();
  return (
    <div className='canvas'>
      <Canvas
        dpr={window.devicePixelRatio}
        gl={{
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
          antialias: true,
          powerPreference: "high-performance",
        }}
        // frameloop={paused ? "never" : "always"}
        shadows
      >
        <XR store={store}>
          {/* UI */}
          <PauseMenu />
          <Inventory />
          {/* ENVIRONMENT */}
          <ambientLight intensity={0.1} />
          <pointLight
            position={[5, 3, 5]}
            intensity={3}
            distance={96}
            castShadow
          />
          <color attach='background' args={["#0f0b0b"]} />

          {/* MAP */}
          {/* <Mirror /> */}

          {/* PHYSICS */}
          <Physics gravity={[0, -9.81, 0]} paused={paused}>
            <WallMap />
            <Player />
            {/* OBJECTS */}
            <ItemEngine />
            <Baseplate />
          </Physics>
        </XR>
      </Canvas>
    </div>
  );
}
