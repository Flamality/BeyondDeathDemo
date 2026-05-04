import React, { createContext, useContext, type ReactNode } from "react";

export type OpeningKind = "door" | "window" | "broken";

export type WallOpening = {
  id: string;
  kind: OpeningKind;
  offset: number;
  width: number;
  height: number;
  sill?: number;
  locked?: boolean;
  itemRequired?: string;
  takeItem?: boolean;
};

export type WallDef = {
  id?: string;
  position: [number, number, number];
  width?: number;
  length?: number;
  floor?: number;
  openings?: WallOpening[];
};

type MapEditorContextType = {
  customWalls: WallDef[];
  addWall: (wall: Omit<WallDef, "id">) => void;
  addOpeningWall: (wall: Omit<WallDef, "id" | "openings">, opening: Omit<WallOpening, "id">) => void;
  clearCustomWalls: () => void;
};

const MapEditorContext = createContext<MapEditorContextType | undefined>(undefined);
const storageKey = "beyond-death-dev-walls";

export const MapEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customWalls, setCustomWalls] = React.useState<WallDef[]>(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(customWalls));
  }, [customWalls]);

  const addWall = React.useCallback((wall: Omit<WallDef, "id">) => {
    setCustomWalls((prev) => [
      ...prev,
      { ...wall, id: crypto.randomUUID() },
    ]);
  }, []);

  const addOpeningWall = React.useCallback((
    wall: Omit<WallDef, "id" | "openings">,
    opening: Omit<WallOpening, "id">,
  ) => {
    setCustomWalls((prev) => [
      ...prev,
      {
        ...wall,
        id: crypto.randomUUID(),
        openings: [{ ...opening, id: crypto.randomUUID() }],
      },
    ]);
  }, []);

  const clearCustomWalls = React.useCallback(() => {
    setCustomWalls([]);
  }, []);

  return (
    <MapEditorContext.Provider value={{ customWalls, addWall, addOpeningWall, clearCustomWalls }}>
      {children}
    </MapEditorContext.Provider>
  );
};

export const useMapEditor = (): MapEditorContextType => {
  const context = useContext(MapEditorContext);
  if (!context) {
    throw new Error("useMapEditor must be used within MapEditorProvider");
  }
  return context;
};
