import { useThree } from "@react-three/fiber";
import {
  Container,
  Fullscreen,
  Portal,
  Text,
} from "@react-three/uikit";
import { useEffect, useRef } from "react";
import { useInventory } from "../context/Inventory";
import { getItemComponent, nameById } from "../objects/map/items/Props";
import { usePlayerData } from "../context/PlayerData";

export default function Inventory() {
  const { camera } = useThree();
  const hand = useRef<any>(null);

  const { pos, rot } = usePlayerData();

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

  useEffect(() => {
    if (!hand.current) return;
    if (camera) {
      camera.add(hand.current);
      hand.current.position.set(0.5, -0.4, -1);

      return () => {
        camera.remove(hand.current);
      };
    }
  }, [camera]);

  /*
    Drop logic (world space)
  */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "q") {
        console.log(pos.current, rot.current);
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
              noColliders: true,
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
        alignItems={"flex-end"}
        justifyContent={"flex-end"}
        distanceToCamera={1}
        gap={0}
        depthTest={false}
      >
        {SelectedItemId && (
            <Container
              key={SelectedItemId}
              pointerEvents="none"
              padding={10}
              borderRadius={5}
              marginRight={0}
              marginBottom={0}
            >
              <Text key={SelectedItemId} color={"#ffffff"} fontWeight={800}>
                {nameById[SelectedItemId.toLowerCase()]}
              </Text>
            </Container>
          )}
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

                    <group position={[0, -0.5, 0]}>
                      <ItemComponent
                        data={{
                          id: itemId,
                          position: [0, 0, 0],
                          mapId: "inventory",
                          rotation: [0, 0, 0],
                          noRigid: true,
                          noColliders: true
                        }}
                      />
                    </group>
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
