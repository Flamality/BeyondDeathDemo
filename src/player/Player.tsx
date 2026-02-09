import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier'

export default function Player() {
  const rb = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'KeyW') moveForward.current = true;
      if (e.code === 'KeyS') moveBackward.current = true;
      if (e.code === 'KeyA') moveLeft.current = true;
      if (e.code === 'KeyD') moveRight.current = true;
    };
    const onKeyUp = (e) => {
      if (e.code === 'KeyW') moveForward.current = false;
      if (e.code === 'KeyS') moveBackward.current = false;
      if (e.code === 'KeyA') moveLeft.current = false;
      if (e.code === 'KeyD') moveRight.current = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!rb.current) return;

    // 1. Get camera direction
    const rot = camera.getWorldDirection(new THREE.Vector3());
    rot.y = 0;
    rot.normalize();

    // 2. Calculate movement
    const vel = new THREE.Vector3();
    const speed = 10;

    if (moveForward.current) vel.add(rot);
    if (moveBackward.current) vel.sub(rot);
    if (moveLeft.current) vel.add(new THREE.Vector3().crossVectors(camera.up, rot));
    if (moveRight.current) vel.add(new THREE.Vector3().crossVectors(rot, camera.up));

    vel.normalize().multiplyScalar(speed);

    // 3. Apply velocity to Physics (keeping the existing Y velocity for gravity!)
    const currentVel = rb.current.linvel();
    rb.current.setLinvel({ x: vel.x, y: currentVel.y, z: vel.z }, true);

    // 4. Make camera follow the physics body
    const pos = rb.current.translation();
    camera.position.set(pos.x, pos.y + 1, pos.z);
  });

  return (
    <RigidBody ref={rb} colliders={false} enabledRotations={[false, false, false]} position={[0, 5, 0]}>
      <CapsuleCollider args={[0.5, 0.5]} />
      <PointerLockControls />
      {/* Visual representation */}
      <mesh>
        <capsuleGeometry args={[0.5, 1.5]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  )
}
