import { RigidBody } from '@react-three/rapier'
import React, { useEffect, useRef } from 'react'
import { useConsole } from '../../../context/Console'
import { useInventory } from '../../../context/Inventory';
import { useItems } from '../../../context/Items';
import { usePlayerData } from '../../../context/PlayerData'

import * as THREE from 'three';



export default function Item({data, gravity = true, grabbable = true, children}: { data: any, gravity?: boolean, grabbable?: boolean, children: React.ReactNode}) {
const {consoleLog} = useConsole();
const {AddToInventory} = useInventory();
const handleClickRef = useRef(false);
const thisItem = useRef<THREE.Object3D | null>(null);
const {removeItemFromMap} = useItems();
const { paused } = usePlayerData();
const uuidRef = useRef(crypto.randomUUID());

useEffect(() => {
  if (!thisItem.current) return
  thisItem.current.userData.clickRoot = true;
},[])

const handleClick = () => {
    if (handleClickRef.current || !grabbable || paused || data?.noRigid) return;

    handleClickRef.current = true;
    const picked = AddToInventory(data.id);
    if (picked) {
        consoleLog(`Picked up ${data.id}`);
        removeItemFromMap(data.mapId);
    } else {
        consoleLog(`Could not pick up ${data.id}`);
    }
    handleClickRef.current = false;
}



const rotation = new THREE.Euler(
  THREE.MathUtils.degToRad(data.rotation[0]),
  THREE.MathUtils.degToRad(data.rotation[1]),
  THREE.MathUtils.degToRad(data.rotation[2])
);
const Group = () => {
  return (
   <group 
        position={data.position} 
        rotation={rotation}
        ref={thisItem}
        userData={{
          clickRoot: true,
          name: data.id,
          uuid: uuidRef.current
        }}

        >
          {children}
      </group>
  )
} 
  return (
    !!(data.noRigid) ? (
        <Group />
    ) : (
      <RigidBody type={gravity ? "dynamic" : "fixed"}>
        <Group />
      </RigidBody>
    )
   
  )
}


