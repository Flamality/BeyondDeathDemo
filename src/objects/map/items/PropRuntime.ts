import { useSyncExternalStore, type ComponentType } from "react";
import type { ItemsList } from "../../../context/Items";

// RANDOM THING FOR DEVELOPMENT, REMOVE BEFORE BUILDING. ALSO DOESNT WORK FOR SOME REASON SO DISREGARD

export type ItemComponent = ComponentType<{ data: ItemsList }>;

export type ItemCatalog = {
  itemById: Record<string, ItemComponent>;
  nameById: Record<string, string>;
};

const listeners = new Set<() => void>();
let version = 0;
let catalog: ItemCatalog = {
  itemById: {},
  nameById: {},
};

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

function normalizeId(id: string) {
  return id.toLowerCase();
}

export function replaceItemCatalog(nextCatalog: ItemCatalog) {
  catalog = nextCatalog;
  emitChange();
}

export function getItemComponent(id: string | undefined | null) {
  if (!id) return undefined;
  return catalog.itemById[normalizeId(id)];
}

export function getItemName(id: string | undefined | null) {
  if (!id) return undefined;
  return catalog.nameById[normalizeId(id)];
}

export function getItemIds() {
  return Object.keys(catalog.itemById);
}

export function useItemCatalogVersion() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useItemIds() {
  useItemCatalogVersion();
  return getItemIds();
}
