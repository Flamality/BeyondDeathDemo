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
  inMenu: boolean;
  setInMenu: (inMenu: boolean) => void;
  character?: any;
  cameraController?: any;
  takingImage?: boolean;
  setTakingImage?: any;
  capturedImage?: string | null;
  setCapturedImage?: any;
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
  const [inMenu, setInMenu] = React.useState(false);
  const character = React.useRef<any>(null);
  const cameraController = React.useRef<any>(null);
  const [takingImage, setTakingImage] = React.useState<boolean>(false);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);

  const { consoleLog } = useConsole();
  useEffect(() => {
    consoleLog(`${pos.current.join(", ")}`);
  }, [pos]);

  const value: PlayerDataContextType = {
    pos,
    rot,
    paused,
    setPaused,
    inMenu,
    setInMenu,
    character,
    cameraController,
    takingImage,
    setTakingImage,
    capturedImage,
    setCapturedImage,
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
