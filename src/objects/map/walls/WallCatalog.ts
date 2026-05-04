import { useSyncExternalStore } from 'react';
import type { WallDef } from '../../../context/MapEditor';
import { baseWalls as loadedBaseWalls } from './WallData';

type WallDataModule = typeof import('./WallData');

const listeners = new Set<() => void>();
let currentBaseWalls: WallDef[] = loadedBaseWalls;
let version = 0;

function emitChange() {
  version += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return version;
}

function replaceBaseWalls(nextBaseWalls: WallDef[]) {
  currentBaseWalls = nextBaseWalls;
  emitChange();
}

export function getBaseWalls() {
  return currentBaseWalls;
}

export function useBaseWalls() {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return currentBaseWalls;
}

if (import.meta.hot) {
  import.meta.hot.accept('./WallData', (nextModule) => {
    const nextWallDataModule = nextModule as WallDataModule | undefined;
    if (nextWallDataModule) {
      replaceBaseWalls(nextWallDataModule.baseWalls);
    }
  });
}
