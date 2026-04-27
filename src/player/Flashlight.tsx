import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const flashlight_width = 0.5

export default function Flashlight() {
  const group = useRef<THREE.Group>(null!);

  const innerLight = useRef<THREE.SpotLight>(null!);
  const midLight = useRef<THREE.SpotLight>(null!);
  const outerLight = useRef<THREE.SpotLight>(null!);

  const innerTarget = useRef(new THREE.Object3D());
  const midTarget = useRef(new THREE.Object3D());
  const outerTarget = useRef(new THREE.Object3D());

  const { camera, scene } = useThree();

  const desiredWorldPos = useMemo(() => new THREE.Vector3(), []);
  const desiredWorldQuat = useMemo(() => new THREE.Quaternion(), []);
  const desiredWorldScale = useMemo(() => new THREE.Vector3(), []);

  const temp = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const g = group.current;

    scene.add(g);

    g.add(innerTarget.current);
    g.add(midTarget.current);
    g.add(outerTarget.current);

    innerLight.current.target = innerTarget.current;
    midLight.current.target = midTarget.current;
    outerLight.current.target = outerTarget.current;

    innerTarget.current.position.set(0, 0, -10);
    midTarget.current.position.set(0, 0, -10);
    outerTarget.current.position.set(0, 0, -10);

    return () => {
      scene.remove(g);
    };
  }, [scene]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    temp.position.set(0, -0.8, -0.8);
    temp.quaternion.identity();
    temp.scale.set(1, 1, 1);

    temp.updateMatrix();
    temp.matrix.compose(temp.position, temp.quaternion, temp.scale);

    const camMatrix = camera.matrixWorld.clone();
    const finalMatrix = camMatrix.multiply(temp.matrix);

    finalMatrix.decompose(desiredWorldPos, desiredWorldQuat, desiredWorldScale);

    const posLerp = 1 - Math.exp(-14 * delta);
    const rotSlerp = 1 - Math.exp(-14 * delta);

    g.position.lerp(desiredWorldPos, posLerp);
    g.quaternion.slerp(desiredWorldQuat, rotSlerp);
  });

  return (
    <group ref={group}>
      <spotLight
        ref={innerLight}
        intensity={28}
        decay={1.4}
        distance={40}
        angle={flashlight_width}
        penumbra={0.25}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <spotLight
        ref={midLight}
        intensity={12}
        decay={1.6}
        distance={32}
        angle={flashlight_width * 1.75}
        penumbra={0.5}
      />

      <spotLight
        ref={outerLight}
        intensity={4}
        decay={1.8}
        distance={22}
        angle={flashlight_width * 2}
        penumbra={0.9}
      />

      <pointLight intensity={0.35} distance={4} position={[0, 0, 0]} />
    </group>
  );
}