import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type MouseLookProps = {
  enabled?: boolean;
  paused?: boolean;
  onUnlock?: () => void;
  fov?: number;
};

export default function PlayerCamera({
  enabled = true,
  paused = false,
  onUnlock,
  fov = 80,
}: MouseLookProps) {
  const { camera, gl } = useThree();

  const targetFov = useRef(fov);

  const yaw = useRef(0);
  const pitch = useRef(0);

  const targetYaw = useRef(0);
  const targetPitch = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;

    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
    yaw.current = euler.y;
    pitch.current = euler.x;
    targetYaw.current = euler.y;
    targetPitch.current = euler.x;

    const lockPointer = async () => {
      if (!enabled || paused) return;

      try {
        const anyCanvas = canvas as any;
        if (anyCanvas.requestPointerLock) {
          await anyCanvas.requestPointerLock({
            unadjustedMovement: true,

          });
        }
      } catch {
        canvas.requestPointerLock();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enabled || paused) return;
      if (document.pointerLockElement !== canvas) return;

      const dx = e.movementX ?? 0;
      const dy = e.movementY ?? 0;

      // reject cursed spikes
      const maxDelta = 100;
      if (Math.abs(dx) > maxDelta || Math.abs(dy) > maxDelta) return;

      const sensitivity = 0.0025;

      targetYaw.current -= dx * sensitivity;
      targetPitch.current -= dy * sensitivity;

      const pitchLimit = Math.PI / 2 - 0.01;
      targetPitch.current = THREE.MathUtils.clamp(
        targetPitch.current,
        -pitchLimit,
        pitchLimit,
      );
    };

    const handlePointerLockChange = () => {
      if (document.pointerLockElement !== canvas) {
        onUnlock?.();
      }
    };

    canvas.addEventListener("click", lockPointer);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      canvas.removeEventListener("click", lockPointer);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
    };
  }, [camera, gl, enabled, paused, onUnlock]);

  useEffect(() => {
    targetFov.current = fov;
  }, [fov]);


  useFrame((_, delta) => {
    if (!enabled || paused) return;

    // light smoothing so it feels nicer, not mushy
    const smooth = Math.min(1, delta * 20);

    yaw.current = THREE.MathUtils.lerp(yaw.current, targetYaw.current, smooth);
    pitch.current = THREE.MathUtils.lerp(
      pitch.current,
      targetPitch.current,
      smooth,
    );

    camera.quaternion.setFromEuler(
      new THREE.Euler(pitch.current, yaw.current, 0, "YXZ"),
    );

     const cam = camera as THREE.PerspectiveCamera;
      cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov.current, delta * 10);
      cam.updateProjectionMatrix();
  });

  return null;
}