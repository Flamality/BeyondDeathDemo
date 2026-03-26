import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import {
  Container,
  Fullscreen,
  Portal,
} from "@react-three/uikit";
import React, { useEffect, useRef } from "react";
import { useInventory } from "../context/Inventory";
import { getItemComponent } from "../objects/map/items/Props";
import { usePlayerData } from "../context/PlayerData";
import { useConsole } from "../context/Console";
import { useXR } from "@react-three/xr";

export default function Inventory() {
  const { camera } = useThree();
  const { session } = useXR();
  const hand = useRef<any>(null);

  const { pos, rot } = usePlayerData();
  const { consoleLog } = useConsole();

  const {
    Inventory: invt,
    currentSlot,
    setCurrentSlot,
    MAX_INVENTORY_SLOTS,
    dropCurrentSlot,
  } = useInventory();

  const SelectedItemId = invt[currentSlot];
  const SelectedComponent = SelectedItemId
    ? getItemComponent(SelectedItemId)
    : null;

  /*
    Attach the "hand" group
    - If XR session → attach to right controller
    - If no XR → attach to camera
  */
  useEffect(() => {
    if (!hand.current) return;

    // // XR mode
    // if (session && controllers.length > 0) {
    //   const rightController = controllers[0].controller;
    //   rightController.add(hand.current);
    //   hand.current.position.set(0, 0, -0.1);

    //   return () => {
    //     rightController.remove(hand.current);
    //   };
    // }

    // Non-XR mode
    if (!session && camera) {
      camera.add(hand.current);
      hand.current.position.set(0.4, -0.3, -0.8);

      return () => {
        camera.remove(hand.current);
      };
    }
  }, [session, camera]);

  /*
    Drop logic (world space)
  */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "q") {
        const adjustedPos: [number, number, number] = [
          pos.current[0] + rot.current[0] * 5,
          pos.current[1] + 1,
          pos.current[2] + rot.current[2] * 5,
        ];
        dropCurrentSlot(adjustedPos);
        return;
      }

      if (e.key >= "1" && e.key <= String(MAX_INVENTORY_SLOTS)) {
        setCurrentSlot(parseInt(e.key) - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCurrentSlot, pos, rot, dropCurrentSlot]);

  return (
    <>
      {/* Held Item */}
      <group ref={hand}>
        {SelectedComponent && (
          <SelectedComponent
            data={{
              id: SelectedItemId,
              position: [0, 0, 0],
              mapId: "held",
              rotation: [0, 0, 0],
              noRigid: true,
            }}
          />
        )}
      </group>

      {/* UI */}
      <Fullscreen
        positionBottom={60}
        positionRight={60}
        pointerEvents="none"
        flexDirection="column"
        alignItems={!session ? "flex-end" : "center"}
        justifyContent={!session ? "flex-end" : "center"}
        distanceToCamera={10}
        depthTest={false}
      >
        <Container>
          {Array.from({ length: MAX_INVENTORY_SLOTS }, (_, i) => {
            const itemId = invt[i];
            const ItemComponent = itemId
              ? getItemComponent(itemId)
              : null;

            return (
              <Container
                key={i}
                onClick={() => setCurrentSlot(i)}
                height={70}
                width={70}
                borderColor={i === currentSlot ? "white" : "gray"}
                borderWidth={4}
                margin={5}
              >
                {ItemComponent && (
                  <Portal width={70} height={70}>
                    <ambientLight intensity={1} />
                    <pointLight position={[10, 10, 10]} intensity={8} />
                    <Physics gravity={[0, 0, 0]}>
                      <PerspectiveCamera
                        position={[1, 0.4, 1.8]}
                        rotation={[-0.3, 0.5, 0]}
                        makeDefault
                      />
                      <ItemComponent
                        data={{
                          id: itemId,
                          position: [0, 0, 0],
                          mapId: "inventory",
                          rotation: [0, 0, 0],
                          noRigid: true
                        }}
                      />
                    </Physics>
                  </Portal>
                )}
              </Container>
            );
          })}
        </Container>
      </Fullscreen>
    </>
  );
}
