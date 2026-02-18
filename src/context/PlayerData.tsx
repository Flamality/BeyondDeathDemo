import { createXRStore } from "@react-three/xr";
import React, {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  type RefObject,
} from "react";
import { useConsole } from "./Console";
// import { useConsole } from './Console';

interface PlayerDataContextType {
  pos: RefObject<[number, number, number]>;
  rot: RefObject<[number, number, number]>;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  store: any;
  setStore: (store: any) => void;
  character?: any;
  cameraController?: any;
}

const PlayerDataContext = createContext<PlayerDataContextType | undefined>(
  undefined,
);

export const PlayerDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const pos = React.useRef<[number, number, number]>([0, 8, 0]);
  const rot = React.useRef<[number, number, number]>([0, 0, 0]);
  const [paused, setPaused] = React.useState(false);
  const character = React.useRef<any>(null);
  const cameraController = React.useRef<any>(null);

  const [store, setStore] = React.useState<any>(null);
  const { consoleLog } = useConsole();
  useEffect(() => {
    consoleLog(`${pos.current.join(", ")}`);
  }, [pos]);

  useEffect(() => {
    const VRStore = createXRStore({
      emulate: true,
      hand: {
        teleportPointer: false,
        rayPointer: {
          rayModel: {
            color: "red",
          },
        },
      },
      controller: {
        left: true,
        right: true,
        teleportPointer: false,
      },
    });
    setStore(VRStore);
  }, []);

  const value: PlayerDataContextType = {
    pos,
    rot,
    paused,
    setPaused,
    store,
    setStore,
    character,
    cameraController,
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
    throw new Error("usePlayerData must be used within a PlayerDataProvider");
  }
  return context;
};
