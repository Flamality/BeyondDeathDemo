import React, { createContext, useContext, type ReactNode } from 'react';
// import { usePlayerData } from './PlayerData';
import { useItems } from './Items';
// import { useConsole } from './Console';

interface InventoryContextType {
    AddToInventory: (id: string) => boolean;
    Inventory: string[];
    MAX_INVENTORY_SLOTS: number;
    currentSlot: number;
    setCurrentSlot: (slot: number) => void;
    dropCurrentSlot: (pos: [number, number, number]) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const MAX_INVENTORY_SLOTS = 4;

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {addItemToMap} = useItems();
    const [Inventory, setInventory] = React.useState<string[]>([]);
    const [currentSlot, setCurrentSlot] = React.useState<number>(0);
    const AddToInventory = (id: string) =>  {
        if (Inventory.length < MAX_INVENTORY_SLOTS) {
            setInventory((prevInventory: string[]) => [...prevInventory, id]);
            return true;
        } else {
            return false;
        }
    }


    const dropCurrentSlot = (pos: [number, number, number]) => {
        const item = Inventory[currentSlot];
        if  (!item) return;
        addItemToMap(item, pos);
        setInventory((prevInventory: string[]) => {
            const newInventory = [...prevInventory];
            newInventory.splice(currentSlot, 1);
            return newInventory;
        });
    }
    
    const value: InventoryContextType = {
        AddToInventory,
        Inventory,
        MAX_INVENTORY_SLOTS,
        currentSlot,
        setCurrentSlot,
        dropCurrentSlot
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
        throw new Error('useInventory must be used within a InventoryProvider');
    }
    return context;
};