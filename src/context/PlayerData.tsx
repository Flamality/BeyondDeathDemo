import { createXRStore } from '@react-three/xr';
import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
// import { useConsole } from './Console';

interface PlayerDataContextType {
    pos: [number, number, number];
    setPos: (pos: [number, number, number]) => void;
    rot: [number, number, number];
    setRot: (rot: [number, number, number]) => void;
    store: any;
    setStore: (store: any) => void;
}

const PlayerDataContext = createContext<PlayerDataContextType | undefined>(undefined);

export const PlayerDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [pos, setPos] = React.useState<[number, number, number]>([0, 8, 0]);
    const [rot, setRot] = React.useState<[number, number, number]>([0, 0, 0]);
    const character = React.useRef<any>(null);

    const [store, setStore] = React.useState<any>(null);
    // const { consoleLog } = useConsole();
    useEffect(() => {
        // consoleLog(`${pos.join(', ')}`);
    },[pos]);

    useEffect(() => {
        const VRStore = createXRStore({
            controller:{
                left: true,
                right: true
            }
        });
        setStore(VRStore);
    },[])
    
    
    const value: PlayerDataContextType = {
        pos,
        setPos,
        rot,
        setRot,
        store,
        setStore
    };

    return (
        <PlayerDataContext.Provider value={value}>
            {children}
        </PlayerDataContext.Provider>
    );
};

export const usePlayerData = (): PlayerDataContextType => {
    const context = useContext(PlayerDataContext);
    if (context === undefined) {
        throw new Error('usePlayerData must be used within a PlayerDataProvider');
    }
    return context;
};