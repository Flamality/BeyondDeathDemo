import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier'
import { usePlayerData } from '../context/PlayerData'
import { useXRInputSourceState, XROrigin } from '@react-three/xr'
// import { controll } from '@react-three/xr';

export default function Player() {
  const rb = useRef<RapierRigidBody>(null);
  // const rController = useXRInputSourceState('controller', 'right');
  // const lController = useXRInputSourceState('controller', 'left');
  const { setPos, setRot: setPlayerRot, paused, setPaused }  = usePlayerData();
  const { camera } = useThree();
  
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const jump = useRef(false);
  const crouch = useRef(false);
  const jumpDebounce = useRef(false);
  const sprint = useRef(false);
  const onSurface = useRef(false);

  useEffect(() => {
    const onKeyDown = (e: any) => {
      e.preventDefault();
      if (e.code === 'KeyW') moveForward.current = true;
      if (e.code === 'KeyS') moveBackward.current = true;
      if (e.code === 'KeyA') moveLeft.current = true;
      if (e.code === 'KeyD') moveRight.current = true;
      if (e.code === 'ControlLeft') crouch.current = true;
      if (e.code === 'ShiftLeft') sprint.current = true;
      if (e.code === 'KeyC') crouch.current = true;
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
      if (e.code === 'ShiftLeft') sprint.current = false;
      if (e.code === 'KeyC') crouch.current = false;
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

  // const thumbstickState = rController?.gamepad['xr-standard-thumbstick'] || { xAxis: 0, yAxis: 0 };
  // if (thumbstickState) {
  //   moveForward.current = (thumbstickState.yAxis ?? 0) < -0.5;
  //   moveBackward.current = (thumbstickState.yAxis ?? 0) > 0.5;
  //   moveLeft.current = (thumbstickState.xAxis ?? 0) < -0.5;
  //   moveRight.current = (thumbstickState.xAxis ?? 0) > 0.5;
  // }
  const targetVel = new THREE.Vector3();
  let speed = 2;
  if (sprint.current && crouch.current) {
    speed = 2;
  } else if (sprint.current) {
    speed = 5;
  }
    else if (crouch.current) {
      speed = 1;
    }
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

const acceleration = 24;
const deceleration = 8;
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

  return (<>
  {/* <Controllers /> */}
    <RigidBody 
      ref={rb} 
      colliders={false} 
      lockRotations
      position={[5, 5, 5]}
    >
      {/* <XROrigin /> */}
      <CapsuleCollider args={[0.5, crouch.current ? 0.1 : 0.5]} />
      <PointerLockControls onUnlock={() => setPaused(true)} onLock={() => setPaused(false)} isLocked={paused}  />
      <mesh>
      <capsuleGeometry args={[0.5, crouch.current ? 0.75 : 1.5]} />
      <meshStandardMaterial color="blue" wireframe={false} />
      </mesh>
    </RigidBody>
    </>
  )
}
