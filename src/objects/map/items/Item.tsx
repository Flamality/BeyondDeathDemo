import { RigidBody } from "@react-three/rapier";
import React, { useEffect, useRef, useCallback } from "react";
import { useConsole } from "../../../context/Console";
import { useInventory } from "../../../context/Inventory";
import { useItems } from "../../../context/Items";
import { usePlayerData } from "../../../context/PlayerData";
import * as THREE from "three";
import { eventBus } from "../../../context/Bus";

export default function Item({
  data,
  gravity = true,
  grabbable = true,
  children,
}: {
  data: any;
  gravity?: boolean;
  grabbable?: boolean;
  children: React.ReactNode;
}) {
  const { consoleLog } = useConsole();
  const { AddToInventory } = useInventory();
  const { removeItemFromMap } = useItems();
  const { paused } = usePlayerData();

  const handleClickRef = useRef(false);
  const thisItem = useRef<THREE.Group>(null);
  const uuidRef = useRef(crypto.randomUUID());

  const rotation: [number, number, number] = [
    THREE.MathUtils.degToRad(data.rotation[0]),
    THREE.MathUtils.degToRad(data.rotation[1]),
    THREE.MathUtils.degToRad(data.rotation[2]),
  ];

  useEffect(() => {
    if (!thisItem.current) return;

    thisItem.current.userData.clickRoot = true;
    thisItem.current.userData.name = data.id;
    thisItem.current.userData.uuid = uuidRef.current;
    thisItem.current.userData.type = "item";
  }, [data.id]);

  const handleClick = useCallback(() => {
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
  }, [AddToInventory, consoleLog, data, grabbable, paused, removeItemFromMap]);

  useEffect(() => {
    const unsub = eventBus.on("itemClicked", (payload) => {
      if (!payload?.uuid) return;
      if (payload.uuid === uuidRef.current) {
        handleClick();
      }
    });

    return unsub;
  }, [handleClick]);

  const content = (
    <group ref={thisItem}>
      {children}
    </group>
  );

  if (!!data.noRigid || !gravity) {
    return (
      <group position={data.position} rotation={rotation}>
        {content}
      </group>
    );
  }

  return (
    <RigidBody
      type="dynamic"
      colliders={false}
      position={data.position}
      rotation={rotation}
    >
      {content}
    </RigidBody>
  );
}