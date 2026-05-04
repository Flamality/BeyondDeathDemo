import React, { createContext, useContext, type ReactNode } from "react";
// import { usePlayerData } from './PlayerData';
import { useItems } from "./Items";
import { usePlayerData } from "./PlayerData";
// import { useConsole } from './Console';

import * as THREE from "three";

interface InventoryContextType {
  AddToInventory: (id: string) => boolean;
  Inventory: string[];
  MAX_INVENTORY_SLOTS: number;
  currentSlot: number;
  setCurrentSlot: (slot: number) => void;
  dropCurrentSlot: (pos: [number, number, number]) => void;
  clearCurrentSlot: () => void;
  resetInventory: () => void;
}



const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

const MAX_INVENTORY_SLOTS = 4;

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { addItemToMap } = useItems();
  const {pos, rot} = usePlayerData();
  const [Inventory, setInventory] = React.useState<string[]>([]);
  const [currentSlot, setCurrentSlot] = React.useState<number>(0);
  const AddToInventory = (id: string) => {
    if (Inventory.length < MAX_INVENTORY_SLOTS) {
      setInventory((prevInventory: string[]) => [...prevInventory, id]);
      return true;
    } else {
      return false;
    }
  };

  const dropCurrentSlot = React.useCallback(
    () => {
      const item = Inventory[currentSlot];
      const position = pos.current;
      const rotation = rot.current;

      const adjustedPos: [number, number, number] = [
          position[0] + rotation[0] * 2,
          position[1] + 1,
          position[2] + rotation[2] * 2,
        ];

      const adjustedRot = [0, THREE.MathUtils.radToDeg(Math.atan2(rotation[0], rotation[2])), 0] as [number, number, number];
      if (!item) return;
      addItemToMap(item, adjustedPos, adjustedRot);
      setInventory((prevInventory: string[]) => {
        const newInventory = [...prevInventory];
        newInventory.splice(currentSlot, 1);
        return newInventory;
      });
    },
    [Inventory, currentSlot, addItemToMap, rot, pos],
  );

  const clearCurrentSlot = () => {
    setInventory((prevInventory: string[]) => {
      const newInventory = [...prevInventory];
      newInventory.splice(currentSlot, 1);
      return newInventory;
    }
    );
  };

  const resetInventory = React.useCallback(() => {
    setInventory([]);
    setCurrentSlot(0);
  }, []);

  const value: InventoryContextType = {
    AddToInventory,
    Inventory,
    MAX_INVENTORY_SLOTS,
    currentSlot,
    setCurrentSlot,
    dropCurrentSlot,
    clearCurrentSlot,
    resetInventory,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within a InventoryProvider");
  }
  return context;
};
