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
  photoJournal: string[];
  addPhotoToJournal: (image: string) => void;
  revealingPhotoSecrets: boolean;
  setRevealingPhotoSecrets: (revealing: boolean) => void;
  gameSessionId: number;
  startGame: () => void;
  safeKeypadOpen: boolean;
  safeKeypadCode: string;
  safeKeypadError: boolean;
  openSafeKeypad: (onUnlock: () => void) => void;
  closeSafeKeypad: () => void;
  pressSafeKey: (key: string) => void;
  submitSafeKeypad: () => void;
  menuPanel: "settings" | "credits" | null;
  setMenuPanel: (panel: "settings" | "credits" | null) => void;
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
  const [inMenu, setInMenu] = React.useState(true);
  const [gameSessionId, setGameSessionId] = React.useState(0);
  const character = React.useRef<any>(null);
  const cameraController = React.useRef<any>(null);
  const [takingImage, setTakingImage] = React.useState<boolean>(false);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [photoJournal, setPhotoJournal] = React.useState<string[]>([]);
  const [revealingPhotoSecrets, setRevealingPhotoSecrets] = React.useState(false);
  const [safeKeypadOpen, setSafeKeypadOpen] = React.useState(false);
  const [safeKeypadCode, setSafeKeypadCode] = React.useState("");
  const [safeKeypadError, setSafeKeypadError] = React.useState(false);
  const safeUnlockRef = React.useRef<(() => void) | null>(null);
  const [menuPanel, setMenuPanel] = React.useState<"settings" | "credits" | null>(null);

  const addPhotoToJournal = React.useCallback((image: string) => {
    setPhotoJournal((prev) => [image, ...prev]);
  }, []);

  const startGame = React.useCallback(() => {
    setPaused(false);
    setInMenu(false);
    setMenuPanel(null);
    setGameSessionId((prev) => prev + 1);
  }, []);

  const openSafeKeypad = React.useCallback((onUnlock: () => void) => {
    safeUnlockRef.current = onUnlock;
    setSafeKeypadCode("");
    setSafeKeypadError(false);
    setSafeKeypadOpen(true);
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, []);

  const closeSafeKeypad = React.useCallback(() => {
    setSafeKeypadOpen(false);
    setSafeKeypadCode("");
    setSafeKeypadError(false);
    safeUnlockRef.current = null;
  }, []);

  const pressSafeKey = React.useCallback((key: string) => {
    setSafeKeypadError(false);
    if (key === "clear") {
      setSafeKeypadCode("");
      return;
    }
    if (key === "backspace") {
      setSafeKeypadCode((prev) => prev.slice(0, -1));
      return;
    }
    setSafeKeypadCode((prev) => (prev.length >= 4 ? prev : `${prev}${key}`));
  }, []);

  const submitSafeKeypad = React.useCallback(() => {
    setSafeKeypadCode((currentCode) => {
      if (currentCode === "9115") {
        safeUnlockRef.current?.();
        closeSafeKeypad();
        return "";
      }

      setSafeKeypadError(true);
      return "";
    });
  }, [closeSafeKeypad]);

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
    photoJournal,
    addPhotoToJournal,
    revealingPhotoSecrets,
    setRevealingPhotoSecrets,
    gameSessionId,
    startGame,
    safeKeypadOpen,
    safeKeypadCode,
    safeKeypadError,
    openSafeKeypad,
    closeSafeKeypad,
    pressSafeKey,
    submitSafeKeypad,
    menuPanel,
    setMenuPanel,
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
