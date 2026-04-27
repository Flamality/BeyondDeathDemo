import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Instances, Instance } from "@react-three/drei";
import { makeTiledMaterial, plaster_diff, material_plaster_world } from "../../../materials/Textures";
import { useMemo } from "react";

type wall = {
  position: [number, number, number];
  width?: number;
  length?: number;
  floor?: number;
};

const walls: wall[] = [
  // EXTENDED HALLWAY
  { position: [0, 0, 20], length: 20 },
  { position: [-4, 0, 20], length: 20 },

  // Room M223
  { position: [4, 0, 0], width: 8 },
  { position: [8, 0, 5], length: 10 },
  { position: [4, 0, 10], width: 8 },
  { position: [0, 0, 2.75], length: 5.5 },
  { position: [0, 0, 8.75], length: 2.5 },

  // Room M221
  { position: [8, 0, -5], length: 10 },
  { position: [4, 0, -10], width: 8 },
  { position: [0, 0, -7.25], length: 5.5 },
  { position: [0, 0, -1.25], length: 2.5 },

  // Room M222
  { position: [-8, 0, 0], width: 8 },
  { position: [-12, 0, 5], length: 10 },
  { position: [-8, 0, 10], width: 8 },
  { position: [-4, 0, 2.75], length: 5.5 },
  { position: [-4, 0, 8.75], length: 2.5 },

  // Room M220
  { position: [-12, 0, -5], length: 10 },
  { position: [-8, 0, -10], width: 8 },
  { position: [-4, 0, -7.25], length: 5.5 },
  { position: [-4, 0, -1.25], length: 2.5 },

  // Bathroom
  { position: [-8, 0, -18], width: 8 },
  { position: [-12, 0, -14], length: 8 },
  { position: [-4, 0, -14], length: 8 },

  // Stairwell
  {position: [-4, 0, -18.25], length: 0.5 },
  {position: [-4, 0, -23.75], length: 0.5 },
  { position: [-7, 0, -21], width: 6 },
  { position: [-7, 0, -24], width: 6 },

  // Hallway Endcap
  {position: [-4, 0, -26], length: 4},
  {position: [-2, 0, -28], width: 4},

  // Closet
  {position: [0, 0, -11], length: 2},
  {position: [0, 0, -15], length: 2},
  {position: [2, 0, -16], width: 4},
  {position: [4, 0, -13], length: 6},
];

export default function WallMap() {
  const texture_plaster = useMemo(() => {
  return makeTiledMaterial(plaster_diff, 8,8);
  }, []); 
  return (
    <>
      <RigidBody type="fixed">
        {walls.map((wall, i) => {
          const width = wall.width ?? 0.4;
          const length = wall.length ?? 0.4;
          const y = (((wall?.floor || 1) - 1) * 10) + 2.5;

          return (
            <CuboidCollider
              key={i}
              args={[width / 2, 2.5, length / 2]}
              position={[wall.position[0], wall.position[1] + y, wall.position[2]]}
            />
          );
        })}
      </RigidBody>

      <Instances limit={walls.length} material={material_plaster_world} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        {walls.map((wall, i) => {
          const width = wall.width ?? 0.4;
          const length = wall.length ?? 0.4;
          const y = (((wall?.floor || 1) - 1) * 10) + 2.5;

          return (
            <Instance
              key={i}
              position={[wall.position[0], wall.position[1] + y, wall.position[2]]}
              scale={[width, 5, length]}
            />
          );
        })}
      </Instances>
    </>
  );
}