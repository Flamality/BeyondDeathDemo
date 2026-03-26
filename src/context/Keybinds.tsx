import React, {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { usePlayerData } from "./PlayerData";

type ActionStates = Record<string, number>;

interface Keybind {
  keys?: string[];
  buttons?: number[];
  axis?: { index: number; scale?: number }[];
}
type KeybindsMap = Record<string, Keybind>;

interface KeybindsContextType {
  actions: ActionStates;
  bindKey: (action: string, bind: Keybind) => void;

  lxrControllerRef: React.RefObject<any>;
  rxrControllerRef: React.RefObject<any>;
}

const KeybindsContext = createContext<KeybindsContextType | undefined>(
  undefined,
);

export const KeybindsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [actions, setActions] = useState<ActionStates>({});
  const [keybinds, setKeybinds] = useState<KeybindsMap>({});
  const { paused } = usePlayerData();
  const lxrControllerRef = React.useRef<any>(null);
  const rxrControllerRef = React.useRef<any>(null);

  const bindKey = (action: string, bind: Keybind) => {
    setKeybinds((prev) => ({ ...prev, [action]: bind }));
    setActions((prev) => ({ ...prev, [action]: 0 }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (paused) return;
      Object.entries(keybinds).forEach(([action, bind]) => {
        if (bind.keys?.includes(e.key)) {
          setActions((prev) => ({ ...prev, [action]: 1 }));
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (paused) return;
      Object.entries(keybinds).forEach(([action, bind]) => {
        if (bind.keys?.includes(e.key)) {
          setActions((prev) => ({ ...prev, [action]: 0 }));
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keybinds, paused]);

  useEffect(() => {
    const pollGamepads = () => {
      const gps = navigator.getGamepads?.() || [];
      gps.forEach((gp) => {
        if (!gp) return;
        Object.entries(keybinds).forEach(([action, bind]) => {
          let value = 0;

          if (bind.buttons) {
            bind.buttons.forEach((idx) => {
              if (gp.buttons[idx]?.pressed) value = 1;
            });
          }

          if (bind.axis) {
            bind.axis.forEach(({ index, scale = 1 }) => {
              const axisVal = gp.axes[index] || 0;
              value += axisVal * scale;
            });
          }

          value = Math.max(-1, Math.min(1, value));
          setActions((prev) => ({ ...prev, [action]: value }));
        });
      });
      requestAnimationFrame(pollGamepads);
    };
    pollGamepads();
  }, [keybinds]);

  useEffect(() => {
    bindKey("forward", {
      keys: ["w", "ArrowUp"],
      axis: [{ index: 1, scale: -1 }],
    });
    bindKey("backward", {
      keys: ["s", "ArrowDown"],
      axis: [{ index: 1, scale: 1 }],
    });
    bindKey("left", {
      keys: ["a", "ArrowLeft"],
      axis: [{ index: 0, scale: -1 }],
    });
    bindKey("right", {
      keys: ["d", "ArrowRight"],
      axis: [{ index: 0, scale: 1 }],
    });
    bindKey("jump", { keys: [" ", "Space"], buttons: [0] });
    bindKey("crouch", { keys: ["ControlLeft", "c"], buttons: [1] });
    bindKey("sprint", { keys: ["ShiftLeft"], buttons: [2] });
  }, []);

  return (
    <KeybindsContext.Provider
      value={{ actions, bindKey, lxrControllerRef, rxrControllerRef }}
    >
      {children}
    </KeybindsContext.Provider>
  );
};

export const useKeybinds = (): KeybindsContextType => {
  const context = useContext(KeybindsContext);
  if (!context)
    throw new Error("useKeybinds must be used within KeybindsProvider");
  return context;
};
