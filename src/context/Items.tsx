import React, { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useConsole } from './Console';

import * as THREE from 'three';

interface ItemsContextType {
    Items: any[];
    addItemToMap: (id: string, position: [number, number, number], rotation: [number, number, number]) => void;
    removeItemFromMap: (mapId: string) => void;
    worldItems: THREE.Object3D[];
    setWorldItems: React.Dispatch<React.SetStateAction<THREE.Object3D[]>>;
    currentHit: React.RefObject<THREE.Object3D | null>;
    changeInCurrentHit: (prev: string) => void;
}

import * as Props from '../objects/map/items/Props';
import { usePlayerData } from './PlayerData';

import { eventBus } from './Bus';

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export interface ItemsList {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    mapId: string;
    noRigid?: boolean;
}

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [worldItems, setWorldItems] = React.useState<THREE.Object3D[]>([]);
    const [Items, setItems] = React.useState<ItemsList[]>([]);
    const {paused} = usePlayerData();
    const currentHit = useRef<THREE.Object3D | null>(null);
    const {consoleLog} = useConsole();


    useEffect(() => {
        const handleClick = () => {
            if (paused) return;
            eventBus.emit("doorInteract", { uuid: currentHit.current?.userData.uuid });
        }
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        }
    },[])


    const changeInCurrentHit = (prev: string) => {
        if (currentHit.current) {
            eventBus.emit("hover", {uuid: currentHit.current.userData.uuid});
            if (prev) {
                eventBus.emit("unhover", {uuid: prev});
            }
        }
    }


    const addItemToMap = (id: string, position: [number, number, number], rotation: [number, number, number]) => {
        const prop = (Props as Record<string, any>)[id];
        if (!prop) {
            consoleLog(`Item ${id} does not exist.`);
            return;
        }
        consoleLog(`Created ${id}`);
        setItems((prevItems: any) => [...prevItems, { id, position, rotation, mapId: Math.random().toString() }]);
    }

    const removeItemFromMap = (mapId: string) => {
        setItems((prevItems: any) => prevItems.filter((item: ItemsList) => item.mapId !== mapId));
    }

    const debug_clearmapofitems = () => {
        setItems([]);
    }

    useEffect(() => {
        debug_clearmapofitems();
        addItemToMap('Box', [0, 0, 0], [0, 0, 0]);
        addItemToMap('Box2', [2, 2, 2], [0, 0, 0]);
        addItemToMap('Book', [1, 0, 4], [0, 0, 0]);

        // ROOM M123
        addItemToMap('Bed', [1, 0, 3.1], [0,90,0])
        addItemToMap('Bed', [3.5, 0, 3.1], [0,90,0])
        addItemToMap('Bed', [6, 0, 3.1], [0,90,0])

        addItemToMap('Shelf', [7.5, 0, 9.5], [0, 180, 0])

        addItemToMap("Table", [1, 0, 8.5], [0, 12, 0])

        // ROOM M121
    },[])
    
    const value: ItemsContextType = {
        Items,
        addItemToMap,
        removeItemFromMap
        ,worldItems,
        setWorldItems,
        currentHit,
        changeInCurrentHit
    };

    return (
        <ItemsContext.Provider value={value}>
            {children}
        </ItemsContext.Provider>
    );
};

export const useItems = (): ItemsContextType => {
    const context = useContext(ItemsContext);
    if (context === undefined) {
        throw new Error('useItems must be used within a ItemsProvider');
    }
    return context;
};