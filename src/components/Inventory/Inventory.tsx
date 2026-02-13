import React, { useEffect, type JSX } from 'react'
import { useInventory } from '../../context/Inventory'

import * as Props from "../../objects/map/items/Props";

import styles from './Inventory.module.css';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { PerspectiveCamera } from '@react-three/drei';
import { usePlayerData } from '../../context/PlayerData';
import { useConsole } from '../../context/Console';

export default function Inventory() {
  const {pos, rot}= usePlayerData();
  const {consoleLog} = useConsole();  
    const { Inventory: invt, MAX_INVENTORY_SLOTS, currentSlot, setCurrentSlot, dropCurrentSlot } = useInventory();
    useEffect(() => { 
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'q') {
            consoleLog(rot.join(', '));
            const adjustedPos = [
               pos[0] + rot[0] * 2,
              pos[1] + 1,
              pos[2] + rot[2] * 2
            ];
            dropCurrentSlot(adjustedPos as [number, number, number]);
            return;
          }
            if (e.key >= '1' && e.key <= String(MAX_INVENTORY_SLOTS)) {
                setCurrentSlot(parseInt(e.key) - 1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setCurrentSlot, pos, rot]);

        
   return (
  <div className={styles.inventory}>
    {Array.from({ length: MAX_INVENTORY_SLOTS }, (_, i) => {
      const itemId = invt[i];
      const ItemComponent = itemId ? (Props as any)[itemId] : null;
      return (
        <div
          key={i}
          className={i === currentSlot ? styles.selectedSlot : styles.slot}
          onClick={() => setCurrentSlot(i)}
        >
          {ItemComponent && (
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={8} />
              <Physics gravity={[0,0,0]}>
                <PerspectiveCamera position={[0.8, 1.4, 1.6]} rotation={[-0.3, 0.5, 0]} makeDefault />
                <ItemComponent data={{ id: itemId, position: [0, 0, 0], mapId: "inventory"  }} />
              </Physics>
            </Canvas>
          )}
        </div>
      );
    })}
  </div>
);

}
