import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import {
  Container,
  Content,
  Fullscreen,
  Portal,
  Text,
} from "@react-three/uikit";
import React, { useEffect } from "react";
import { useInventory } from "../context/Inventory";
import * as Props from "../objects/map/items/Props";
import { usePlayerData } from "../context/PlayerData";
import { useConsole } from "../context/Console";
import { useXR } from "@react-three/xr";

export default function Inventory() {
  const { pos, rot } = usePlayerData();
  const { consoleLog } = useConsole();
  const { session } = useXR();
  const {
    Inventory: invt,
    currentSlot,
    setCurrentSlot,
    MAX_INVENTORY_SLOTS,
    dropCurrentSlot,
  } = useInventory();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "q") {
        consoleLog(rot.current.join(", "));
        const adjustedPos = [
          pos.current[0] + rot.current[0] * 2,
          pos.current[1] + 1,
          pos.current[2] + rot.current[2] * 2,
        ];
        dropCurrentSlot(adjustedPos as [number, number, number]);
        return;
      }
      if (e.key >= "1" && e.key <= String(MAX_INVENTORY_SLOTS)) {
        setCurrentSlot(parseInt(e.key) - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCurrentSlot, pos, rot, dropCurrentSlot]);

  return (
    <Fullscreen
      positionBottom={0}
      pointerEvents='none'
      flexDirection='column'
      alignItems={!session ? "flex-end" : "center"}
      justifyContent={!session ? "flex-end" : "center"}
      distanceToCamera={10}
      depthTest={false}
    >
      <Container>
        {Array.from({ length: MAX_INVENTORY_SLOTS }, (_, i) => {
          const itemId = invt[i];
          const ItemComponent = itemId ? (Props as any)[itemId] : null;
          return (
            <Container
              key={i}
              onClick={() => setCurrentSlot(i)}
              height={80}
              width={80}
              borderColor={i === currentSlot ? "yellow" : "white"}
              borderWidth={2}
              margin={5}
            >
              {ItemComponent && (
                <Portal width={80} height={80}>
                  <ambientLight intensity={0.5} />
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
  );
}
