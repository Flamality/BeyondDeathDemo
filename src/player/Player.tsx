import { FirstPersonControls, PerspectiveCamera, PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { usePlayerData } from "../context/PlayerData";
import { useXR, useXRInputSourceState, XROrigin, useXRControllerState } from "@react-three/xr";
import { useKeybinds } from "../context/Keybinds";
import Inventory from "../ui/Inventory";
import PauseMenu from "../ui/PauseMenu";

import Flashlight from "./Flashlight";
import PlayerCamera from "./PlayerCamera";
import CameraOverlay from "../ui/CameraOverlay";
import { useItems } from "../context/Items";

function getTargetObject(obj: any | null): THREE.Object3D | null {
  while (obj) {
    if (obj.userData.clickRoot) return obj;
    obj = obj.parent;
  }
  return null;
}

export default function Player() {
  const character = useRef<RapierRigidBody>(null);
  const { session } = useXR();
  const {currentHit, changeInCurrentHit} = useItems();
  const { lxrControllerRef, rxrControllerRef } = useKeybinds();
  const rController = useXRInputSourceState("controller", "right");
  const lController = useXRInputSourceState("controller", "left");
  lxrControllerRef.current = lController;
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  rxrControllerRef.current = rController;
  const last = useRef<string | null>(null);
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
      if (paused) return;
      e.preventDefault();
      if (e.code === "KeyW") moveForward.current = 1;
      if (e.code === "KeyS") moveBackward.current = 1;
      if (e.code === "KeyA") moveLeft.current = 1;
      if (e.code === "KeyD") moveRight.current = 1;
      if (e.code === "ControlLeft") crouch.current = true;
      if (e.code === "ShiftLeft") sprint.current = true;
      if (e.code === "KeyC") crouch.current = true;
      if (e.code === "Space") {
          jump.current = true;
          jumpDebounce.current = false;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (paused) return;
      e.preventDefault();
      if (e.code === "KeyW") moveForward.current = 0;
      if (e.code === "KeyS") moveBackward.current = 0;
      if (e.code === "KeyA") moveLeft.current = 0;
      if (e.code === "KeyD") moveRight.current = 0;
      if (e.code === "ControlLeft") crouch.current = false;
      if (e.code === "ShiftLeft") sprint.current = false;
      if (e.code === "KeyC") crouch.current = false;
      if (e.code === "Space") {
        jumpDebounce.current = false;
        jump.current = false;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [paused]);

  useFrame((state: any, delta: any) => {
    if (!character.current) return;
    if (paused) return;

    // GET CAMERA ROTATION
    const rot = camera.getWorldDirection(new THREE.Vector3());
    rot.y = 0;
    rot.normalize();


    // GET CAMERA POSITION
    const pos = character.current.translation();
    setPlayerPos.current = [pos.x, pos.y, pos.z];

    // GET CAMERA RIGHT
    const right = new THREE.Vector3()
      .crossVectors(rot, new THREE.Vector3(0, 1, 0))
      .normalize();

    // HANDLE CONTROLLER INPUT
    const thumbstick = lController?.gamepad?.["xr-standard-thumbstick"];
    if (thumbstick && !!session) {
      const yAxis = thumbstick.yAxis || 0;
      const xAxis = thumbstick.xAxis || 0;
      moveForward.current = 0;
      moveBackward.current = yAxis;
      moveLeft.current = 0;
      moveRight.current = xAxis;
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

    if (jump.current && Math.abs(character.current.linvel().y) < 0.05 && !crouch.current && !jumpDebounce.current) {
      jumpDebounce.current = true;
      const currentVel = character.current.linvel();
      character.current.setLinvel(
        { x: currentVel.x, y: 5, z: currentVel.z },
        true,
      );
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
    }
   const t = state.clock.getElapsedTime();
const totalVel = Math.sqrt(
  currentVel.x * currentVel.x +
  currentVel.y * currentVel.y +
  currentVel.z * currentVel.z
);

// 0 when standing still, ramps up as you move
const moveAmount = Math.min(totalVel * 0.15, 1);

// Bob settings
const bobSpeed = 8;     // how fast it bobs
const bobHeight = 0.05; // how high it bobs

const bob = Math.sin(t * bobSpeed) * bobHeight * moveAmount;

camera.position.set(
  pos.x,
  pos.y + bob + 1,
  pos.z
);

// RAYCASTING
// const temp = new THREE.Vector3();
// raycaster.set(
//   state.camera.position,
//   state.camera.getWorldDirection(temp)
// );

// let next: THREE.Object3D | null | any = null;

// const hits = raycaster.intersectObjects(state.scene.children, true);

// for (const hit of hits) {
//   const target = getTargetObject(hit.object);
//   if (!target) continue;
//   if (hit.distance > 5) continue;

//   next = target;
//   break;
// }

// console.log(currentHit.current?.userData.uuid)
// currentHit.current = next;
//   if (last.current !== (currentHit.current ? currentHit.current.userData.uuid : null)) {
//       changeInCurrentHit(last.current);
//       last.current = currentHit.current ? currentHit.current.userData.uuid : null;
//   }
});


  return (
    <>
      {/* <XROrigin> */}
        <RigidBody
          ref={character}
          colliders={false}
          lockRotations
          position={[5, 5, 5]}
        >
          {/* UI */}
          <Inventory />
          <PauseMenu />
          <CameraOverlay />
          
          <CapsuleCollider args={[0.2, crouch.current ? 0.1 : 0.5]} />
          {!session && (
            // <PointerLockControls
            //   onUnlock={() => setPaused(true)}
            //   unlock={paused}
            //   ref={cameraController}
            //   attach={character}
            //   makeDefault
            //   pointerSpeed={1}
            // />
            <PlayerCamera enabled={!session} paused={
              paused} onUnlock={() => setPaused(true)} />
          )}

          <mesh castShadow={false} receiveShadow={false}>
            <capsuleGeometry args={[0.5, 1.2, 8, 16]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        </RigidBody>

        <Flashlight />
      {/* </XROrigin> */}
    </>
  );
}
