import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { usePlayerData } from "../context/PlayerData";
import { useXR, useXRInputSourceState, XROrigin } from "@react-three/xr";
import { useKeybinds } from "../context/Keybinds";

export default function Player() {
  const character = useRef<RapierRigidBody>(null);
  const { session } = useXR();
  const { lxrControllerRef, rxrControllerRef } = useKeybinds();
  const rController = useXRInputSourceState("controller", "right");
  const lController = useXRInputSourceState("controller", "left");
  lxrControllerRef.current = lController;
  rxrControllerRef.current = rController;
  const {
    pos: setPlayerPos,
    rot: setPlayerRot,
    setPaused,
    cameraController,
    paused,
  } = usePlayerData();
  const { camera } = useThree();

  const moveForward = useRef(0);
  const moveBackward = useRef(0);
  const moveLeft = useRef(0);
  const moveRight = useRef(0);
  const jump = useRef(false);
  const crouch = useRef(false);
  const jumpDebounce = useRef(false);
  const sprint = useRef(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.code === "KeyW") moveForward.current = 1;
      if (e.code === "KeyS") moveBackward.current = 1;
      if (e.code === "KeyA") moveLeft.current = 1;
      if (e.code === "KeyD") moveRight.current = 1;
      if (e.code === "ControlLeft") crouch.current = true;
      if (e.code === "ShiftLeft") sprint.current = true;
      if (e.code === "KeyC") crouch.current = true;
      if (e.code === "Space") {
        if (!jumpDebounce.current) {
          jump.current = true;
          jumpDebounce.current = true;
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyW") moveForward.current = 0;
      if (e.code === "KeyS") moveBackward.current = 0;
      if (e.code === "KeyA") moveLeft.current = 0;
      if (e.code === "KeyD") moveRight.current = 0;
      if (e.code === "ControlLeft") crouch.current = false;
      if (e.code === "ShiftLeft") sprint.current = false;
      if (e.code === "KeyC") crouch.current = false;
      if (e.code === "Space") jumpDebounce.current = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!character.current) return;

    // GET CAMERA ROTATION
    const rot = camera.getWorldDirection(new THREE.Vector3());
    rot.y = 0;
    rot.normalize();

    // GET CAMERA POSITION
    const pos = character.current.translation();
    setPlayerRot.current = [rot.x, rot.y, rot.z];
    setPlayerPos.current = [pos.x, pos.y, pos.z];

    // GET CAMERA RIGHT
    const right = new THREE.Vector3()
      .crossVectors(rot, new THREE.Vector3(0, 1, 0))
      .normalize();

    // HANDLE CONTROLLER INPUT
    const thumbstick = lController?.gamepad["xr-standard-thumbstick"];
    if (thumbstick && !!session) {
      const yAxis = thumbstick.yAxis || 0;
      const xAxis = thumbstick.xAxis || 0;
      moveForward.current = 0;
      moveBackward.current = yAxis;
      moveLeft.current = 0;
      moveRight.current = xAxis;

      console.log(`Thumbstick state: x=${xAxis}, y=${yAxis}`);
      // console.log(pos, rot);
    }

    // HANDLE SPEED
    const speed = 5;
    const forward = rot
      .clone()
      .multiplyScalar((moveForward.current - moveBackward.current) * speed);
    const strafe = right
      .clone()
      .multiplyScalar((moveRight.current - moveLeft.current) * speed);
    const targetVel = forward.add(strafe);

    if (jump.current) {
      const currentVel = character.current.linvel();
      character.current.setLinvel(
        { x: currentVel.x, y: 5, z: currentVel.z },
        true,
      );
      jump.current = false;
    }

    // HANDLE MOVEMENT
    const currentVel = character.current.linvel();
    const newVelX = THREE.MathUtils.lerp(currentVel.x, targetVel.x, 0.1);
    const newVelZ = THREE.MathUtils.lerp(currentVel.z, targetVel.z, 0.1);

    character.current.setLinvel(
      { x: newVelX, y: currentVel.y, z: newVelZ },
      true,
    );

    // SYNC CAMERA WITH CHARACTER
    if (!!session) {
      const xrOrigin = camera.parent;
      if (xrOrigin) {
        xrOrigin.position.set(pos.x, pos.y, pos.z);
      }
    } else {
      camera.position.set(pos.x, pos.y + 1, pos.z);
    }
  });

  return (
    <XROrigin>
      <RigidBody
        ref={character}
        colliders={false}
        lockRotations
        position={[5, 5, 5]}
      >
        <CapsuleCollider args={[0.5, crouch.current ? 0.1 : 0.5]} />
        {!session && !paused && (
          <PointerLockControls
            onUnlock={() => setPaused(true)}
            onLock={() => setPaused(false)}
            ref={cameraController}
          />
        )}
        <mesh>
          <capsuleGeometry args={[0.5, 1.2, 8, 16]} />
          <meshStandardMaterial color='blue' />
        </mesh>
      </RigidBody>
    </XROrigin>
  );
}
