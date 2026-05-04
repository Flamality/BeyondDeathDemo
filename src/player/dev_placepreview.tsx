import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRapier } from '@react-three/rapier';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useConsole } from '../context/Console';
import { useItems } from '../context/Items';
import { useMapEditor, type OpeningKind } from '../context/MapEditor';
import {
  getItemComponent,
  useItemIds,
} from '../objects/map/items/PropCatalog';

type DevMode = 'prop' | 'wall' | 'door' | 'window' | 'broken';

const modes: DevMode[] = ['prop', 'wall', 'door', 'window', 'broken'];
const maxPlaceDistance = 8;
const snap = 0.25;

function snapValue(value: number) {
  return Math.round(value / snap) * snap;
}

function getYawDegrees(camera: THREE.Camera) {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  return Math.abs(direction.x) > Math.abs(direction.z) ? 90 : 0;
}

function getWallSize(
  mode: DevMode,
  yaw: number,
  length: number,
): { width: number; length: number } {
  const openingWidth = mode === 'door' ? 2 : mode === 'window' ? 1.8 : 2.3;
  const wallLength =
    mode === 'wall' ? length : Math.max(length, openingWidth + 1.2);

  return yaw === 0
    ? { width: wallLength, length: 0.4 }
    : { width: 0.4, length: wallLength };
}

function getOpening(mode: OpeningKind) {
  if (mode === 'door') {
    return { kind: mode, offset: 0, width: 2, height: 3 };
  }

  if (mode === 'window') {
    return { kind: mode, offset: 0, width: 1.8, height: 1.4, sill: 1.25 };
  }

  return { kind: mode, offset: 0, width: 2.3, height: 3.2 };
}

export default function DevPlacePreview() {
  const { camera, gl } = useThree();
  const { rapier, world } = useRapier();
  const { rawItems, setRawItems } = useItems();
  const { addWall, addOpeningWall, clearCustomWalls } = useMapEditor();
  const { consoleLog } = useConsole();

  const itemIds = useItemIds();
  const placementRaycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseNdc = useRef(new THREE.Vector2(0, 0));
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<DevMode>('prop');
  const [itemIndex, setItemIndex] = useState(() =>
    Math.max(0, itemIds.indexOf('bed')),
  );
  const [rotation, setRotation] = useState(0);
  const [wallLength, setWallLength] = useState(4);
  const [placement, setPlacement] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [hitDistance, setHitDistance] = useState(maxPlaceDistance);

  const currentItem = itemIds[itemIndex] ?? 'bed';
  const ItemComponent = getItemComponent(currentItem);

  useFrame(() => {
    if (!enabled) return;

    if (document.pointerLockElement === gl.domElement) {
      mouseNdc.current.set(0, 0);
    }

    placementRaycaster.setFromCamera(mouseNdc.current, camera);
    const origin = placementRaycaster.ray.origin.clone();
    const direction = placementRaycaster.ray.direction.clone().normalize();
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, maxPlaceDistance, true);
    const hitTime = hit ? hit.timeOfImpact : maxPlaceDistance;
    const distance = Math.max(0.75, hitTime - 0.2);
    const target = origin.add(direction.multiplyScalar(distance));

    const nextDistance = Math.round(distance * 10) / 10;
    const nextPlacement: [number, number, number] = [
      snapValue(target.x),
      mode === 'prop' ? snapValue(target.y) : 0,
      snapValue(target.z),
    ];

    setHitDistance((prev) => (prev === nextDistance ? prev : nextDistance));
    setPlacement((prev) =>
      prev[0] === nextPlacement[0] &&
      prev[1] === nextPlacement[1] &&
      prev[2] === nextPlacement[2]
        ? prev
        : nextPlacement,
    );
  });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouseNdc.current.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      );
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [gl]);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setMode((prev) => modes[(modes.indexOf(prev) + 1) % modes.length]);
        return;
      }

      if (e.key === '[') {
        setItemIndex((prev) => (prev - 1 + itemIds.length) % itemIds.length);
      }

      if (e.key === ']') {
        setItemIndex((prev) => (prev + 1) % itemIds.length);
      }

      if (e.key.toLowerCase() === 'r') {
        setRotation((prev) => (prev + 90) % 360);
      }

      if (e.key === '=' || e.key === '+') {
        setWallLength((prev) => Math.min(20, prev + 0.5));
      }

      if (e.key === '-' || e.key === '_') {
        setWallLength((prev) => Math.max(1, prev - 0.5));
      }

      if (e.key === 'Backspace') {
        clearCustomWalls();
        consoleLog('Cleared dev-placed wall/opening pieces.');
      }

      if (e.key === 'Enter') {
        if (mode === 'prop') {
          const nextItems = [
            ...rawItems,
            {
              item: currentItem,
              pos: placement,
              rot: [0, rotation, 0],
            },
          ];

          setRawItems(nextItems);
          navigator.clipboard
            ?.writeText(JSON.stringify(nextItems))
            .catch(() => undefined);
          consoleLog(
            `Placed ${currentItem} at [${placement.map((v) => v.toFixed(2)).join(', ')}].`,
          );
          return;
        }

        const yaw = mode === 'wall' ? rotation : getYawDegrees(camera);
        const size = getWallSize(mode, yaw, wallLength);
        const wall = { position: placement, ...size };

        if (mode === 'wall') {
          addWall(wall);
          consoleLog(`Placed wall length ${wallLength.toFixed(1)}.`);
          return;
        }

        addOpeningWall(wall, getOpening(mode));
        consoleLog(`Placed ${mode} wall opening.`);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    addOpeningWall,
    addWall,
    camera,
    clearCustomWalls,
    consoleLog,
    currentItem,
    enabled,
    itemIds.length,
    mode,
    placement,
    rawItems,
    rotation,
    setRawItems,
    wallLength,
  ]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setEnabled((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!enabled) return null;

  const previewYaw = mode === 'wall' ? rotation : getYawDegrees(camera);
  const previewSize = getWallSize(mode, previewYaw, wallLength);

  return (
    <>
      <group
        position={placement}
        rotation={[
          0,
          THREE.MathUtils.degToRad(mode === 'prop' ? rotation : 0),
          0,
        ]}
      >
        {mode === 'prop' && ItemComponent && (
          <ItemComponent
            data={{
              id: currentItem,
              mapId: 'dev-preview',
              position: [0, 0, 0],
              rotation: [0, 0, 0],
              noRigid: true,
              noColliders: true,
            }}
          />
        )}

        {mode !== 'prop' && (
          <mesh rotation={[0, THREE.MathUtils.degToRad(previewYaw), 0]}>
            <boxGeometry args={[previewSize.width, 5, previewSize.length]} />
            <meshStandardMaterial
              color={
                mode === 'wall'
                  ? '#aeb4b8'
                  : mode === 'door'
                    ? '#5577aa'
                    : mode === 'window'
                      ? '#6aaecf'
                      : '#b27a6a'
              }
              transparent
              opacity={0.42}
            />
          </mesh>
        )}

        <Html
          position={[0, 1.8, 0]}
          center
          distanceFactor={7}
          pointerEvents="none"
        >
          <div className="dev-place-hud">
            <strong>Dev Place</strong>
            <span>F1 toggle</span>
            <span>Tab {mode}</span>
            <span>[ ] {currentItem}</span>
            <span>R {rotation}</span>
            <span>+/- {wallLength.toFixed(1)}</span>
            <span>{hitDistance.toFixed(1)}m</span>
            <span>Enter</span>
          </div>
        </Html>
      </group>
    </>
  );
}
