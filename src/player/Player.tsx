import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three';
import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber';

export default function Player() {
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);

    useEffect(() => {
  const onKeyDown = (event: any) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        moveForward.current = true;
        break;
      // ... similar cases for 'KeyS', 'KeyA', 'KeyD', etc.
    }
  };
  const onKeyUp = (event: any) => {
     switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        moveForward.current = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  return () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  };
}, []);

useFrame((state, delta) => {
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * delta;

  direction.z = Number(moveForward.current) - Number(moveBackward.current);
  direction.x = Number(moveRight.current) - Number(moveLeft.current);
  direction.normalize();

  if (moveForward.current || moveBackward.current) velocity.z -= direction.z * 400.0 * delta;
  if (moveLeft.current || moveRight.current) velocity.x -= direction.x * 400.0 * delta;

  state?.controls?.moveRight(-velocity.x * delta);
  state?.controls?.moveForward(-velocity.z * delta);
});
  return (
    <PointerLockControls selector='canvas' moveForward={10} attach={undefined}  />
  )
}
