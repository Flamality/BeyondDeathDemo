import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier'
import { usePlayerData } from '../context/PlayerData'

export default function Player() {
  const rb = useRef<RapierRigidBody>(null);
  const { setPos, setRot: setPlayerRot }  = usePlayerData();
  const { camera } = useThree();
  
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const jump = useRef(false);
  const crouch = useRef(false);
  const jumpDebounce = useRef(false);
  const onSurface = useRef(false);

  useEffect(() => {
    const onKeyDown = (e: any) => {
      e.preventDefault();
      if (e.code === 'KeyW') moveForward.current = true;
      if (e.code === 'KeyS') moveBackward.current = true;
      if (e.code === 'KeyA') moveLeft.current = true;
      if (e.code === 'KeyD') moveRight.current = true;
      if (e.code === 'ControlLeft') crouch.current = true;
      if (e.code === 'Space') {
        if (!jumpDebounce.current) {
        jump.current = true;
        jumpDebounce.current = true;
      }
    }
    };
    const onKeyUp = (e: any) => {
      if (e.code === 'KeyW') moveForward.current = false;
      if (e.code === 'KeyS') moveBackward.current = false;
      if (e.code === 'KeyA') moveLeft.current = false;
      if (e.code === 'KeyD') moveRight.current = false;
      if (e.code === 'ControlLeft') crouch.current = false;
      if (e.code === 'Space') jumpDebounce.current = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    }
  }, []);

  useFrame((state, delta) => {
   if (!rb.current) return;

  const rot = camera.getWorldDirection(new THREE.Vector3());
  rot.y = 0;
  rot.normalize();
  setPlayerRot([rot.x, rot.y, rot.z]);
  

  const targetVel = new THREE.Vector3();
  const speed = 10;
  const pos = rb.current.translation();
  setPos([pos.x, pos.y, pos.z]);


if (moveForward.current) targetVel.add(rot);
if (moveBackward.current) targetVel.sub(rot);
if (moveLeft.current) targetVel.add(new THREE.Vector3().crossVectors(camera.up, rot));
if (moveRight.current) targetVel.add(new THREE.Vector3().crossVectors(rot, camera.up));
if (jump.current) {
  const currentVel = rb.current.linvel();
  rb.current.setLinvel({ x: currentVel.x, y: 5, z: currentVel.z }, true);
  jump.current = false;
  jumpDebounce.current = true;
}

targetVel.normalize().multiplyScalar(speed);

const currentVel = rb.current.linvel();

const acceleration = 12;
const deceleration = 20;
const dt = 1 / 60;

const accelRate = targetVel.length() > 0 ? acceleration : deceleration;

const newVelX = THREE.MathUtils.lerp(currentVel.x, targetVel.x, accelRate * dt);
const newVelZ = THREE.MathUtils.lerp(currentVel.z, targetVel.z, accelRate * dt);

rb.current.setLinvel(
  { x: newVelX, y: currentVel.y, z: newVelZ },
  true
);

camera.position.set(pos.x, pos.y + 1, pos.z);

  });

  return (
    <RigidBody ref={rb} colliders={false} scale={1} enabledRotations={[false, false, false]} position={[5, 5, 5]}>
      <CapsuleCollider args={[0.5, crouch.current ? 0.1 : 0.5]} />
      <PointerLockControls />
      <mesh>
        <capsuleGeometry args={[0.5, 1.25]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  )
}
