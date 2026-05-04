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
    hitDist: React.RefObject<number>;
    rawItems: any[];
    setRawItems: React.Dispatch<React.SetStateAction<any[]>>;
    updateMap: () => void;
}

import { getItemComponent } from '../objects/map/items/PropCatalog';
import { useDefaultItemMap } from '../objects/map/items/ItemMapCatalog';
import { usePlayerData } from './PlayerData';

import { eventBus } from './Bus';

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export interface ItemsList {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    mapId: string;
    noRigid?: boolean;
    noColliders?: boolean;
}

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [worldItems, setWorldItems] = React.useState<THREE.Object3D[]>([]);
    const [Items, setItems] = React.useState<ItemsList[]>([]);
    const [rawItems, setRawItems] = React.useState<any[]>([]);
    const defaultItemMap = useDefaultItemMap();
    const {paused} = usePlayerData();
    const currentHit = useRef<THREE.Object3D | null>(null);
    const {consoleLog} = useConsole();
    const hitDist = useRef<number>(0);


    useEffect(() => {
        const handleClick = () => {
            if (paused) return;
            if (currentHit.current?.userData?.type === "item") {
                eventBus.emit("itemClicked", { uuid: currentHit.current.userData.uuid });
            } else if (currentHit.current?.userData?.type === "door") {
                eventBus.emit("doorInteract", { uuid: currentHit.current.userData.uuid });
            }

        }

        const handleE = () => {
            if (paused) return;
           
        }
        window.addEventListener("click", handleClick);
        window.addEventListener("keydown", (e) => {
            if (e.code === "KeyE") {
                handleE();
            }
        });
        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("keydown", (e) => {
                if (e.code === "KeyE") {
                    handleE();
                }
            });
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
        const prop = getItemComponent(id); 
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

    const setup_map = () => {
        debug_clearmapofitems();
        for (const item of rawItems) {
            addItemToMap(item.item, item.pos as [number, number, number], item.rot as [number, number, number]);
        }
    }

   useEffect(() => {
        setRawItems(defaultItemMap);
   },[defaultItemMap])
    
    useEffect(() => {
        debug_clearmapofitems();
        setup_map();
    }, [rawItems])

    const updateMap = () => {
        debug_clearmapofitems();
        setup_map();
    }
    
    const value: ItemsContextType = {
        Items,
        addItemToMap,
        removeItemFromMap
        ,worldItems,
        setWorldItems,
        currentHit,
        changeInCurrentHit,
        hitDist,
        rawItems,
        setRawItems,
        updateMap,
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
