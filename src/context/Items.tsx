import React, { createContext, useContext, type ReactNode } from 'react';
import { useConsole } from './Console';

interface ItemsContextType {
    Items: any[];
    addItemToMap: (id: string, position: [number, number, number]) => void;
    removeItemFromMap: (mapId: string) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export interface ItemsList {
    id: string;
    position: [number, number, number];
    mapId: string
}

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [Items, setItems] = React.useState<ItemsList[]>([{ id: "Box", position: [0, 2, 0], mapId: Math.random().toString() }, {
        id: "Box2", position: [2, 2, 0], mapId: Math.random().toString()
    }]);
const {consoleLog} = useConsole();
    const addItemToMap = (id: string, position: [number, number, number]) => {
        consoleLog(`Added item ${id} at position ${position.join(', ')}`);
        setItems((prevItems: any) => [...prevItems, { id, position, mapId: Math.random().toString() }]);
    }

    const removeItemFromMap = (mapId: string) => {
        setItems((prevItems: any) => prevItems.filter((item: ItemsList) => item.mapId !== mapId));
    }
    
    const value: ItemsContextType = {
        Items,
        addItemToMap,
        removeItemFromMap
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