import { MeshReflectorMaterial } from '@react-three/drei'

export function Mirror() {
  return (
    <mesh castShadow receiveShadow>
      <planeGeometry args={[10, 10]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={100}
        mixBlur={1}
        mixStrength={50}
        roughness={0}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#ffffff"
        metalness={0.8}
      />
    </mesh>
  )
}
