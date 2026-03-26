import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function Flashlight() {
  const light = useRef<THREE.SpotLight>(null!);
  const { camera } = useThree();
  useEffect(() => {
    const l = light.current as any;

    camera.add(l);
    camera.add(l.target);

    l.position.set(0, 0, 0);
    l.target.position.set(0, 0, -1);
    return () => {
      camera.remove(l);
      camera.remove(l.target);
    };

  }, [camera]);

  

  return (
    <spotLight
      ref={light}
      intensity={50}
      decay={1}
      distance={500}
      angle={0.7}
      penumbra={1.1}
      castShadow
      receiveShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  );
}