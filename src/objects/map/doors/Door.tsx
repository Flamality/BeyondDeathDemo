import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
    import React, { useEffect, useRef, useState } from 'react';

import * as Three from 'three';
import { useInventory } from '../../../context/Inventory';
import { useConsole } from '../../../context/Console';
import { useAudio } from '../../../context/Audio';
import { texture_metal, texture_plaster, texture_wood } from '../../../materials/Textures';

import { eventBus } from '../../../context/Bus.ts';
import { EffectComposer, Outline } from '@react-three/postprocessing';

interface DoorProps {
  position: [number, number, number];
  rotation?: 0 | 90 | -90;
  locked?: boolean;
  itemRequired?: string;
  takeItem?: boolean;
}

const HEIGHT = 3;

const Door: React.FC<DoorProps> = ({position, rotation = 0,  locked = false, itemRequired, takeItem = false}: DoorProps) => {
    const rotRad = Three.MathUtils.degToRad(rotation);
    const [pos, setPos] = useState<[number, number, number]>(position);
    const {playSound} = useAudio();
    const [doorOpen, setDoorOpen] = useState(false);
    const {Inventory, currentSlot, clearCurrentSlot} = useInventory();
    const {consoleLog} = useConsole();
    const [doorLocked, setDoorLocked] = useState(locked);
    const doorRef = useRef(null);
    const objRef = useRef(null);
    const uuidRef = useRef(crypto.randomUUID());
    const [hovered, setHovered] = useState(false);
     useEffect(() => {
        setPos([
            position[0],
            position[1] + HEIGHT / 2,
            position[2]
        ]);
     },[position])
    useEffect(() => {
        const unsub1 = eventBus.on("doorInteract", (payload) => {
            if (!doorRef.current || !payload.uuid) return;
            if (payload.uuid === uuidRef.current) {
                toggleDoor();
            }
        });

        return unsub1;
    }, [locked, doorLocked, Inventory, currentSlot, itemRequired, takeItem, clearCurrentSlot, consoleLog, playSound]);

    useEffect(() => {
        const unsub2 = eventBus.on("hover", (payload) => {
            if (!doorRef.current || !payload.uuid) return;
            if (payload.uuid === uuidRef.current) {
                setHovered(true);
            }
        });

        return unsub2;
    }, []);

     useEffect(() => {
        const unsub3 = eventBus.on("unhover", (payload) => {
            if (!doorRef.current || !payload.uuid) return;
            if (payload.uuid === uuidRef.current) {
                setHovered(false);
            }
        });

        return unsub3;
    }, []);

    useFrame(() => {
        if (doorRef.current) {
            const doorBody = doorRef.current as any;
            const baseRotation = Three.MathUtils.degToRad(rotation);
            let targetRotation = doorOpen ? baseRotation - Math.PI / 2 : baseRotation;
            let targetX = doorOpen ? position[0] + 1 : position[0];
            let targetZ = doorOpen ? position[2] - 1 : position[2];
            if (rotation === 90) {
                targetX = doorOpen ? position[0] + 1 : position[0];
                targetZ = doorOpen ? position[2] + 1 : position[2];
            }
            if (rotation === -90) {
                targetX = doorOpen ? position[0] - 1 : position[0];
                targetZ = doorOpen ? position[2] + 1 : position[2];
                targetRotation = doorOpen ? baseRotation + Math.PI / 2 : baseRotation;
            }
            
            // Get Rapier quaternion and convert to Three.js Quaternion
            const rapierQuat = doorBody.rotation();
            const threeQuat = new Three.Quaternion(rapierQuat.x, rapierQuat.y, rapierQuat.z, rapierQuat.w);
            const currentEuler = new Three.Euler().setFromQuaternion(threeQuat);
            
            currentEuler.y += (targetRotation - currentEuler.y) * 0.1;
            const newQuat = new Three.Quaternion().setFromEuler(currentEuler);
            doorBody.setRotation(newQuat, true);
            
            const currentPos = doorBody.translation();
            doorBody.setTranslation({
                x: currentPos.x + (targetX - currentPos.x) * 0.1,
                y: position[1],
                z: currentPos.z + (targetZ - currentPos.z) * 0.1
            }, true);
        }
    });

    const toggleDoor = () => {
        console.log('door is', doorOpen, 'and is locked', locked)
         if (doorLocked === false) {
            setDoorOpen(prev => !prev);
            playSound('door_open');
        } else {
            if (Inventory[currentSlot] === itemRequired) {
                playSound('door_lock');
                setDoorLocked(false);
                if (takeItem) {
                    clearCurrentSlot();
                }
            } else {
                playSound('door_locked');
                consoleLog(`Door is locked. You need ${itemRequired} to open it.`);
            }
        }
    }
  return (
    <>
    <group ref={objRef} position={pos} rotation={[0, rotRad, 0]} userData={{
          clickRoot: true,
          name: "door",
          uuid: uuidRef.current
        }}
        >
        {/* FRAME */}
        <RigidBody type='fixed' position={[0,0,0]} rotation={[0, 0, 0]}>
        <Box args={[0.1, HEIGHT, 0.15]} position={[-1,0,0]} material={texture_wood}>
        </Box>
        <Box args={[0.1, HEIGHT, 0.15]} position={[1,0,0]} material={texture_wood}>
        </Box>
        <Box args={[2, 0.1, 0.15]} position={[0, HEIGHT / 2, 0]} material={texture_wood}>
        </Box>
        </RigidBody>
        {/* WALL */}
        <RigidBody type='fixed'  position={[0, HEIGHT - (.5), 0]} rotation={[0, 0, 0]}>
            <Box args={[2, 5 - HEIGHT, 0.4]} position={[0, 0, 0]} material={texture_plaster}>
            </Box>
        </RigidBody>
        {/* DOOR */}
        <RigidBody type='fixed' position={[0, 0, 0]} rotation={[0, rotRad, 0]} ref={doorRef}>
            <Box args={[2, HEIGHT, 0.1]} position={[0, 0, 0]} material={texture_metal}>
            </Box>
        </RigidBody>
        <EffectComposer>
            <Outline 
                 selection={[objRef]}
                edgeStrength={5}
                visibleEdgeColor={2}
                hiddenEdgeColor="white"
            />
        </EffectComposer>
        </group>
    </>
  );
}

export default Door;