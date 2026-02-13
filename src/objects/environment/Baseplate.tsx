import { Grid } from '@react-three/drei'

export default function Baseplate() {
  return (
    <>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Grid args={[100, 100]} position={[0, 0.001, 0]} cellSize={1} cellColor="#6f6f6f" sectionSize={5} sectionColor="#9d4edd" />
    </>
  )
}
