import { Box } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import React from 'react'
import { useConsole } from '../../../context/Console'
import { useInventory } from '../../../context/Inventory';
import { useItems } from '../../../context/Items';



export default function Item({position = [0,0,0], mapId = "", gravity = true, grabbable = true, id, children}: {position?: [number, number, number], mapId?: string, gravity?: boolean, grabbable?: boolean, id: string, children: React.ReactNode}) {
const {consoleLog} = useConsole();
const {AddToInventory} = useInventory();
const handleClickRef = React.useRef(false);
const {removeItemFromMap} = useItems();

const handleClick = () => {
    if (handleClickRef.current || !grabbable) return;
    
    handleClickRef.current = true;
    const picked = AddToInventory(id);
    if (picked) {
        consoleLog(`Picked up ${id}`);
        removeItemFromMap(mapId);
    } else {
        consoleLog(`Could not pick up ${id}`);
    }
    handleClickRef.current = false;
}

  return (
    <RigidBody type={gravity ? "dynamic" : "fixed"}>
        <group onClick={handleClick}>
            {children}
        </group>
    </RigidBody>
  )
}
