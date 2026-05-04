import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Three from 'three';

import { useInventory } from '../../../context/Inventory';
import { useConsole } from '../../../context/Console';
import { useAudio } from '../../../context/Audio';
import {
  material_metal_world,
  material_plaster_world,
  material_table_world,
  material_wood_world,
} from '../../../materials/Textures';

import { eventBus } from '../../../context/Bus.ts';
import { nameById } from '../items/Props.tsx';

interface DoorProps {
  position: [number, number, number];
  rotation?: 0 | 90 | -90;
  locked?: boolean;
  itemRequired?: string;
  takeItem?: boolean;
}

const HEIGHT = 3;
const WIDTH = 2;
const THICKNESS = 0.1;

const Door: React.FC<DoorProps> = ({
  position,
  rotation = 0,
  locked = false,
  itemRequired,
  takeItem = false,
}) => {
  const rotRad = Three.MathUtils.degToRad(rotation);

  const { playSound } = useAudio();
  const { Inventory, currentSlot, clearCurrentSlot } = useInventory();
  const { consoleLog } = useConsole();

  const [doorOpen, setDoorOpen] = useState(false);
  const [doorLocked, setDoorLocked] = useState(locked);
  const [hovered, setHovered] = useState(false);

  const uuidRef = useRef(crypto.randomUUID());
  const hingeRef = useRef<Three.Group>(null);

  useEffect(() => {
    const unsub = eventBus.on('doorInteract', (payload) => {
      if (!payload?.uuid) return;
      if (payload.uuid === uuidRef.current) {
        toggleDoor();
      }
    });

    return unsub;
  }, [
    doorLocked,
    Inventory,
    currentSlot,
    itemRequired,
    takeItem,
    clearCurrentSlot,
    consoleLog,
    playSound,
  ]);

  useEffect(() => {
    const unsub = eventBus.on('hover', (payload) => {
      if (!payload?.uuid) return;
      if (payload.uuid === uuidRef.current) {
        setHovered(true);
      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    const unsub = eventBus.on('unhover', (payload) => {
      if (!payload?.uuid) return;
      if (payload.uuid === uuidRef.current) {
        setHovered(false);
      }
    });

    return unsub;
  }, []);

  useFrame((_, delta) => {
    if (!hingeRef.current) return;

    let targetY = 0;

    if (doorOpen) {
      if (rotation === -90) {
        targetY = Math.PI / 2;
      } else {
        targetY = -Math.PI / 2;
      }
    }

    const t = 1 - Math.exp(-6 * delta);
    hingeRef.current.rotation.y = Three.MathUtils.lerp(
      hingeRef.current.rotation.y,
      targetY,
      t,
    );
  });

  const toggleDoor = () => {
    if (!doorLocked) {
      setDoorOpen((prev) => !prev);
      playSound('door_open');
      return;
    }

    if (
      Inventory[currentSlot] === itemRequired &&
      itemRequired !== undefined &&
      itemRequired !== null
    ) {
      playSound('door_lock');
      setDoorLocked(false);

      if (takeItem) {
        clearCurrentSlot();
      }

      return;
    }

    playSound('door_locked');
    const itemName =
      nameById[itemRequired?.toLowerCase() || ''] || 'required item';
    consoleLog(`Door is locked. You need ${itemName} to open it.`);
  };

  return (
    <group position={position} rotation={[0, rotRad, 0]}>
      {/* FRAME COLLIDERS */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, HEIGHT / 2, 0]}>
        <Box
          args={[0.1, HEIGHT, 0.15]}
          position={[-1, 0, 0]}
          material={material_wood_world}
        />
        <Box
          args={[0.1, HEIGHT, 0.15]}
          position={[1, 0, 0]}
          material={material_wood_world}
        />
        <Box
          args={[2, 0.1, 0.15]}
          position={[0, HEIGHT / 2, 0]}
          material={material_wood_world}
        />
      </RigidBody>

      {/* WALL */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        position={[0, HEIGHT + (5 - HEIGHT) / 2, 0]}
      >
        <Box
          args={[2, 5 - HEIGHT, 0.4]}
          material={material_plaster_world}
        ></Box>
      </RigidBody>

      {/* DOOR */}
      <group position={[-WIDTH / 2, HEIGHT / 2, 0]} ref={hingeRef}>
        <Box
          args={[WIDTH, HEIGHT, THICKNESS]}
          position={[WIDTH / 2, 0, 0]}
          material={material_metal_world}
          userData={{
            clickRoot: true,
            name: 'door',
            uuid: uuidRef.current,
            type: 'door',
            hovered,
          }}
        />
      </group>

      {!doorOpen && (
        <RigidBody
          type="fixed"
          colliders="cuboid"
          position={[0, HEIGHT / 2, 0]}
        >
          <Box args={[WIDTH, HEIGHT, THICKNESS]} visible={true}>
            <meshStandardMaterial
              color="transparent"
              opacity={0}
              transparent={true}
            />
          </Box>
        </RigidBody>
      )}
    </group>
  );
};

export default Door;
