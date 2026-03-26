import { RigidBody } from "@react-three/rapier";
import { texture_concrete, texture_wood } from "../../materials/Textures";

export default function Baseplate() {
  return (
    <>
      <RigidBody type='fixed'>
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          material={texture_concrete}
        >
          <planeGeometry args={[100, 100]} />
        </mesh>
      </RigidBody>
    </>
  );
}
