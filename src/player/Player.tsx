import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, PerspectiveCamera } from "@react-three/drei";
import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { usePlayerData } from "../context/PlayerData";
import Inventory from "../ui/Inventory";

import Flashlight from "./Flashlight";
import PlayerCamera from "./PlayerCamera";
import CameraOverlay from "../ui/CameraOverlay";
import { useItems } from "../context/Items";
import { useSettings } from "../context/Settings";

function getTargetObject(obj: any | null): THREE.Object3D | null {
  while (obj) {
    if (obj.userData.clickRoot) return obj;
    obj = obj.parent;
  }
  return null;
}

const waitFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const waitMs = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const smoothStep = (value: number) => {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const introEase = (progress: number, start: number, end: number) =>
  smoothStep((progress - start) / (end - start));

export default function Player() {
  const character = useRef<RapierRigidBody>(null);
  const {currentHit, changeInCurrentHit, hitDist} = useItems();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const last = useRef<string | null>(null);
  const captureInProgress = useRef(false);
  const [introActive, setIntroActive] = useState(true);
  const introStartedAt = useRef<number | null>(null);
  const introAnchor = useRef<{ x: number; y: number; z: number } | null>(null);
  const {
    pos: setPlayerPos,
    rot: setPlayerRot,
    setPaused,
    paused,
    inMenu,
    takingImage,
    setTakingImage,
    setCapturedImage,
    addPhotoToJournal,
    setRevealingPhotoSecrets,
    safeKeypadOpen,
    menuPanel,
  } = usePlayerData();
  const { keybinds } = useSettings();
  const { gl, scene, camera, invalidate } = useThree()

  const handleCapture = async () => {
    if (captureInProgress.current || takingImage || inMenu) return;
    captureInProgress.current = true;

    try {
      flushSync(() => {
        setTakingImage(true);
        setRevealingPhotoSecrets(false);
      });
      invalidate();

      await waitMs(120);
      await waitFrame();

      flushSync(() => {
        setRevealingPhotoSecrets(true);
      });
      invalidate();

      await waitFrame();
      await waitFrame();

      gl.render(scene, camera);

      const dataUrl = gl.domElement.toDataURL("image/png");
      setCapturedImage(dataUrl);
      addPhotoToJournal(dataUrl);

      await waitFrame();
    } finally {
      flushSync(() => {
        setRevealingPhotoSecrets(false);
        setTakingImage(false);
      });
      invalidate();
      captureInProgress.current = false;
    }

};

  const moveForward = useRef(0);
  const moveBackward = useRef(0);
  const moveLeft = useRef(0);
  const moveRight = useRef(0);
  const jump = useRef(false);
  const crouch = useRef(false);
  const jumpDebounce = useRef(false);
  const sprint = useRef(false);
  const picture = useRef(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape" && !inMenu) {
        e.preventDefault();
        setPaused(!paused);
        if (!paused && document.pointerLockElement) {
          document.exitPointerLock();
        }
        return;
      }

      if (paused || inMenu || safeKeypadOpen || menuPanel || introActive) return;
      e.preventDefault();
      if (e.code === keybinds.forward) moveForward.current = 1;
      if (e.code === keybinds.backward) moveBackward.current = 1;
      if (e.code === keybinds.left) moveLeft.current = 1;
      if (e.code === keybinds.right) moveRight.current = 1;
      if (e.code === keybinds.crouch) crouch.current = true;
      if (e.code === keybinds.sprint) sprint.current = true;
      if (e.code === "KeyC") crouch.current = true;
      if (e.code === keybinds.jump) {
          jump.current = true;
          jumpDebounce.current = false;
      }
      if (e.code === keybinds.photo) picture.current = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (paused || inMenu || safeKeypadOpen || menuPanel || introActive) return;
      e.preventDefault();
      if (e.code === keybinds.forward) moveForward.current = 0;
      if (e.code === keybinds.backward) moveBackward.current = 0;
      if (e.code === keybinds.left) moveLeft.current = 0;
      if (e.code === keybinds.right) moveRight.current = 0;
      if (e.code === keybinds.crouch) crouch.current = false;
      if (e.code === keybinds.sprint) sprint.current = false;
      if (e.code === "KeyC") crouch.current = false;
      if (e.code === keybinds.jump) {
        jumpDebounce.current = false;
        jump.current = false;
      }
      if (e.code === keybinds.photo) picture.current = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [paused, inMenu, setPaused, keybinds, safeKeypadOpen, menuPanel, introActive]);

  useFrame((state: any, delta: any) => {
    if (!character.current) return;
    if (paused || inMenu) return;

    // GET CAMERA POSITION
    const pos = character.current.translation();
    setPlayerPos.current = [pos.x, pos.y, pos.z];

    if (introActive) {
      if (!introAnchor.current) {
        introAnchor.current = { x: pos.x, y: 0, z: pos.z };
      }

      moveForward.current = 0;
      moveBackward.current = 0;
      moveLeft.current = 0;
      moveRight.current = 0;
      jump.current = false;
      character.current.setTranslation(
        { x: introAnchor.current.x, y: 0.75, z: introAnchor.current.z },
        true,
      );
      character.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

      if (introStartedAt.current === null) {
        introStartedAt.current = state.clock.getElapsedTime();
      }
      const introStart = introStartedAt.current ?? state.clock.getElapsedTime();

      const introDuration = 8.2;
      const progress = THREE.MathUtils.clamp(
        (state.clock.getElapsedTime() - introStart) / introDuration,
        0,
        1,
      );
      const elapsed = state.clock.getElapsedTime() - introStart;
      const straighten = introEase(progress, 0.05, 0.34);
      const lookDown = introEase(progress, 0.3, 0.48);
      const rise = introEase(progress, 0.42, 0.78);
      const lookForward = introEase(progress, 0.72, 0.96);
      const disorientation = 1 - smoothStep(progress / 0.62);
      const breath = Math.sin(elapsed * 2.1) * 0.008 * disorientation;
      const tremor = Math.sin(elapsed * 8.5) * 0.004 * disorientation;
      const anchor = introAnchor.current;

      const floorPos = new THREE.Vector3(anchor.x - 0.44, anchor.y + 0.055 + breath, anchor.z + 0.22);
      const standingPos = new THREE.Vector3(anchor.x, anchor.y + 1.75, anchor.z);
      const cameraPos = floorPos.clone().lerp(standingPos, rise);
      cameraPos.y += tremor;
      camera.position.copy(cameraPos);

      const sidewaysQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0.04 + tremor, -0.18, -Math.PI / 2, "YXZ"),
      );
      const straightFloorQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0.02, -0.12, 0, "YXZ"),
      );
      const downQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(-0.72, -0.05, 0, "YXZ"),
      );
      const forwardQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, 0, 0, "YXZ"),
      );

      const cameraQuat = sidewaysQuat
        .clone()
        .slerp(straightFloorQuat, straighten)
        .slerp(downQuat, lookDown)
        .slerp(forwardQuat, lookForward);
      camera.quaternion.copy(cameraQuat);

      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      perspectiveCamera.fov = THREE.MathUtils.lerp(88, 80, lookForward);
      perspectiveCamera.updateProjectionMatrix();

      if (progress >= 1) {
        setIntroActive(false);
      }
      return;
    }

    if (pos && pos.y < -20) {
      character.current.setTranslation({ x: 5, y: 5, z: 5 }, true);
      character.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

      return;
    }

    // GET CAMERA ROTATION
    const rot = camera.getWorldDirection(new THREE.Vector3());
    rot.y = 0;
    rot.normalize();

    const euler = new THREE.Euler().setFromVector3(rot);
    setPlayerRot.current = [euler.x, euler.y, euler.z];

    // GET CAMERA RIGHT
    const right = new THREE.Vector3()
      .crossVectors(rot, new THREE.Vector3(0, 1, 0))
      .normalize();

    // HANDLE CONTROLLER INPUT
    // const thumbstick = lController?.gamepad?.["xr-standard-thumbstick"];
    // if (thumbstick && !!session) {
    //   const yAxis = thumbstick.yAxis || 0;
    //   const xAxis = thumbstick.xAxis || 0;
    //   moveForward.current = 0;
    //   moveBackward.current = yAxis;
    //   moveLeft.current = 0;
    //   moveRight.current = xAxis;
    // }

    // HANDLE SPEED
    const speed = (sprint.current ? 6 : 2) * (crouch.current ? 0.5 : 1);
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

   const t = state.clock.getElapsedTime();
const totalVel = Math.sqrt(
  currentVel.x * currentVel.x +
  currentVel.y * currentVel.y +
  currentVel.z * currentVel.z
);

const moveAmount = Math.min(totalVel * 0.15, 1);

// BOBBING
const bobSpeed = 8;     // how fast it bobs
const bobHeight = 0.15; // how high it bobs

const bob = Math.sin(t * bobSpeed) * bobHeight * moveAmount;

const heightOffset = crouch.current ? 0.5 : 1;

camera.position.set(
  pos.x,
  pos.y + bob + heightOffset,
  pos.z
);

// RAYCASTING
const temp = new THREE.Vector3();
raycaster.set(
  state.camera.position,
  state.camera.getWorldDirection(temp)
);

let next: THREE.Object3D | null | any = null;

const hits = raycaster.intersectObjects(state.scene.children, true);

for (const hit of hits) {
  const target = getTargetObject(hit.object);
  if (!target) continue;
  if (hit.distance > 5) continue;

  next = target;
  break;
}

currentHit.current = next;
hitDist.current = hits.length > 0 ? hits[0].distance : 0;
  if (last.current !== (currentHit.current ? currentHit.current.userData.uuid : null)) {
      changeInCurrentHit(last.current as any);
      last.current = currentHit.current ? currentHit.current.userData.uuid : null;
  }


  if (picture.current) {
    handleCapture();
    picture.current = false;
  }
});


  return (
    <>
        <PerspectiveCamera makeDefault={!inMenu} fov={80} />

        <RigidBody
          ref={character}
          colliders={false}
          lockRotations
          enabledRotations={[false, false, false]}
          friction={0}
          position={[5, 5, 5]}
        >
          {/* UI */}
          {!takingImage && !inMenu && !introActive && (
            <>
              <Inventory />
              <CameraOverlay />
            </>
          )}
          
          <CapsuleCollider args={[0.2, crouch.current ? 0.1 : 0.5]} />
            <PlayerCamera
              enabled={!inMenu}
              paused={paused || inMenu || introActive}
              onUnlock={() => {
                if (!inMenu) setPaused(true);
              }}
              fov={80}
              />

          <mesh castShadow={false} receiveShadow={false} dispose={null}>
            <capsuleGeometry args={[0.5, 1.6, 10, 28]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        </RigidBody>

        <Flashlight />
        {introActive && (
          <Html fullscreen zIndexRange={[1400, 0]}>
            <div className="intro-fade" />
          </Html>
        )}
    </>
  );
}
