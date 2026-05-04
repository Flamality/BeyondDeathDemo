import { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { material_concrete_world } from "../../materials/Textures";
const width = 8;
const depth = 8;
export default function Baseplate() {
  const geometry = useMemo(() => {
    const r223 = new THREE.BoxGeometry(8, 1, 10);
    r223.translate(4, 0, 5);

    const r224 = new THREE.BoxGeometry(8, 1, 10);
    r224.translate(-8, 0, 5);

    const r222 = new THREE.BoxGeometry(8, 1, 10);
    r222.translate(-8, 0, -5);

    const hallway = new THREE.BoxGeometry(4, 1, 64);
    hallway.translate(-2, 0, 3);

    const nurse = new THREE.BoxGeometry(10, 1, 12);
    nurse.translate(5, 0, -22);

    const closet = new THREE.BoxGeometry(6, 1, 6);
    closet.translate(3, 0, -13);

    const bathroom = new THREE.BoxGeometry(8, 1, 8);
    bathroom.translate(-8, 0, -14);

    return mergeGeometries([
      r223,
      r224,
      r222,
      hallway,
      nurse,
      closet,
      bathroom,
    ]);
  }, []);

  return (
    <RigidBody type='fixed'>
      <mesh
        geometry={geometry}
        position={[0, -0.5, 0]}
        material={material_concrete_world}
        receiveShadow
      />
    </RigidBody>
  );
}
