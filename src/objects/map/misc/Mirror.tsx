import { MeshReflectorMaterial } from "@react-three/drei";

export function Mirror() {
  return (
    <mesh castShadow receiveShadow position={[-3, 0, 0]}>
      <planeGeometry args={[6, 10]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={50}
        roughness={0}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#ffffff"
        metalness={0.2}
      />
    </mesh>
  );
}
