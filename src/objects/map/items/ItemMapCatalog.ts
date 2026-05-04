import { useSyncExternalStore } from 'react';
import itemMap from './item_map.json';

export type RawItemDef = {
  item: string;
  pos: [number, number, number];
  rot: [number, number, number];
};

type ItemMapModule = {
  default: RawItemDef[];
};

const listeners = new Set<() => void>();
let currentItemMap = itemMap as RawItemDef[];
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

function replaceItemMap(nextItemMap: RawItemDef[]) {
  currentItemMap = nextItemMap;
  emitChange();
}

export function useDefaultItemMap() {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return currentItemMap;
}

if (import.meta.hot) {
  import.meta.hot.accept(
    './item_map.json',
    (nextModule) => {
      const nextItemMapModule = nextModule as ItemMapModule | undefined;
      if (nextItemMapModule) {
        replaceItemMap(nextItemMapModule.default);
      }
    },
  );
}
