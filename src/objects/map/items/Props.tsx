import type { ComponentType } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import type { ItemsList } from '../../../context/Items';
import Item from './Item';
import { eventBus } from '../../../context/Bus';
import { useInventory } from '../../../context/Inventory';
import { usePlayerData } from '../../../context/PlayerData';
import {
  material_fabric_world,
  material_metal_world,
  material_plaster_world,
  material_table_world,
  material_wood_world,
} from '../../../materials/Textures';
import { ProceduralProp } from './PropUtils';

const material_transparent = new THREE.MeshStandardMaterial({
  color: 'white',
  transparent: true,
  opacity: 0.5,
});

type Vec3 = [number, number, number];

type PropPart = {
  size: Vec3;
  position: Vec3;
  material: THREE.Material;
  collider?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  noColliders?: boolean;
  shape?: 'box' | 'cylinder' | 'sphere';
  rotation?: Vec3;
};

/* ----------------------------- SHARED / TEST MATERIALS ---------------------------- */

const blueMaterial = new THREE.MeshStandardMaterial({ color: 'blue' });
const greenMaterial = new THREE.MeshStandardMaterial({ color: 'green' });
const ceramicMaterial = new THREE.MeshStandardMaterial({
  color: '#d8d5c8',
  roughness: 0.72,
});
const darkRubberMaterial = new THREE.MeshStandardMaterial({
  color: '#111111',
  roughness: 0.85,
});
const signMaterial = new THREE.MeshStandardMaterial({
  color: '#25282b',
  roughness: 0.55,
});
const glassMaterial = new THREE.MeshStandardMaterial({
  metalness: 1,
  roughness: 0,
  color: '#3a3a3a',
});

/* -------------------------------- PROP DATA -------------------------------- */

const BROKEN_WALL_PARTS: PropPart[] = [
  {
    size: [0.42, 1.6, 0.28],
    position: [-0.95, 0.8, 0],

    rotation: [0, 0, 0.1],
    material: material_plaster_world,
  },
  {
    size: [0.36, 1.3, 0.26],
    position: [0.95, 0.65, 0],
    rotation: [0, 0, -0.08],
    material: material_plaster_world,
  },
  {
    size: [1.9, 0.28, 0.25],
    position: [0, 1.9, 0],
    rotation: [0, 0, 0.06],
    material: material_plaster_world,
  },
  {
    size: [0.38, 0.24, 0.3],
    position: [-0.35, 0.12, 0.1],
    rotation: [0.2, 0.1, 0.25],
    material: material_plaster_world,
  },
  {
    size: [0.3, 0.18, 0.2],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    material: material_plaster_world,
  },
  {
    size: [2, 3, 0.3],
    position: [0, 3.5, -0.2],
    rotation: [0, 0, 0],
    material: material_plaster_world,
  },
];

const WHEELCHAIR_PARTS: PropPart[] = [
  {
    size: [0.95, 0.08, 0.95],
    position: [-0.62, 0.48, 0],
    rotation: [0, 0, Math.PI / 2],
    material: darkRubberMaterial,
    shape: 'cylinder',
  },
  {
    size: [0.62, 0.05, 0.62],
    position: [-0.62, 0.48, 0],
    rotation: [0, 0, Math.PI / 2],
    material: material_metal_world,
    shape: 'cylinder',
    collider: false,
  },
  {
    size: [0.95, 0.08, 0.95],
    position: [0.62, 0.48, 0],
    rotation: [0, 0, Math.PI / 2],
    material: darkRubberMaterial,
    shape: 'cylinder',
  },
  {
    size: [0.62, 0.05, 0.62],
    position: [0.62, 0.48, 0],
    rotation: [0, 0, Math.PI / 2],
    material: material_metal_world,
    shape: 'cylinder',
    collider: false,
  },
  {
    size: [0.28, 0.05, 0.28],
    position: [-0.48, 0.14, 0.75],
    rotation: [0, 0, Math.PI / 2],
    material: darkRubberMaterial,
    shape: 'cylinder',
  },
  {
    size: [0.28, 0.05, 0.28],
    position: [0.48, 0.14, 0.75],
    rotation: [0, 0, Math.PI / 2],
    material: darkRubberMaterial,
    shape: 'cylinder',
  },
  {
    size: [1.05, 0.12, 0.82],
    position: [0, 0.72, 0.12],
    material: material_fabric_world,
  },
  {
    size: [1.05, 1.15, 0.12],
    position: [0, 1.24, -0.34],
    rotation: [-0.18, 0, 0],
    material: material_fabric_world,
  },
  {
    size: [1.22, 0.06, 0.06],
    position: [0, 0.78, -0.35],
    material: material_metal_world,
  },
  {
    size: [0.06, 0.9, 0.06],
    position: [-0.55, 0.85, -0.18],
    rotation: [0.22, 0, 0],
    material: material_metal_world,
  },
  {
    size: [0.06, 0.9, 0.06],
    position: [0.55, 0.85, -0.18],
    rotation: [0.22, 0, 0],
    material: material_metal_world,
  },
  {
    size: [0.08, 0.08, 0.52],
    position: [-0.58, 1.72, -0.66],
    material: material_metal_world,
  },
  {
    size: [0.08, 0.08, 0.52],
    position: [0.58, 1.72, -0.66],
    material: material_metal_world,
  },
  {
    size: [0.5, 0.06, 0.38],
    position: [-0.36, 0.28, 0.92],
    rotation: [0.2, 0, 0],
    material: material_metal_world,
  },
  {
    size: [0.5, 0.06, 0.38],
    position: [0.36, 0.28, 0.92],
    rotation: [0.2, 0, 0],
    material: material_metal_world,
  },
];

const STAIR_PARTS: PropPart[] = [
  {
    size: [3, 0.2, 0.5],
    position: [1.5, 0.1, 0],
    material: material_wood_world,
  },
  {
    size: [3, 0.2, 0.5],
    position: [1.5, 0.3, 0.5],
    material: material_wood_world,
  },

  {
    size: [3, 0.2, 0.5],
    position: [1.5, 0.5, 1],
    material: material_wood_world,
  },
  {
    size: [3, 0.2, 0.5],
    position: [1.5, 0.7, 1.5],
    material: material_wood_world,
  },
  {
    size: [3, 0.2, 0.5],
    position: [1.5, 0.9, 2],
    material: material_wood_world,
  },
  {
    size: [3, 0.2, 0.5],
    position: [1.5, 1.1, 2.5],
    material: material_wood_world,
  },
  {
    size: [3, 0.2, 0.5],
    position: [1.5, 1.3, 3],
    material: material_wood_world,
  },
  {
    size: [3, 0.2, 0.5],
    position: [1.5, 1.5, 3.5],
    material: material_wood_world,
  },
  {
    size: [3, 0.2, 0.5],
    position: [1.5, 1.7, 4],
    material: material_wood_world,
  },
  {
    size: [3, 0.2, 0.5],
    position: [1.5, 1.9, 4.5],
    material: material_wood_world,
  },
  {
    size: [3, 0.2, 0.5],
    position: [1.5, 2.1, 5],
    material: material_wood_world,
  },
  {
    size: [3, 0.2, 11.3085],
    position: [1.5, 0.2, 0],
    rotation: [-21.8 * (Math.PI / 180), 0, 0],
    material: material_transparent,
  },
];

const KEY_PARTS: PropPart[] = [
  {
    size: [0.5, 0.05, 0.07],
    position: [0, 0, 0],
    material: material_metal_world,
  },
  {
    size: [0.15, 0.05, 0.15],
    position: [0.25, 0, 0],
    material: material_metal_world,
  },
  {
    size: [0.05, 0.05, 0.05],
    position: [-0.15, 0, -0.06],
    material: material_metal_world,
  },
  {
    size: [0.05, 0.05, 0.07],
    position: [-0.22, 0, -0.07],
    material: material_metal_world,
  },
];

const BOX_PARTS: PropPart[] = [
  {
    size: [0.2, 0.2, 3],
    position: [0, 0, 0],
    material: blueMaterial,
  },
];

const BOX2_PARTS: PropPart[] = [
  {
    size: [1, 1, 1],
    position: [0, 0, 0],
    material: material_wood_world,
  },
];

const BOOK_PARTS: PropPart[] = [
  {
    size: [0.1, 0.7, 0.5],
    position: [0, 0, 0],
    material: greenMaterial,
  },
];

const shelfMat = material_wood_world;
const SHELF_PARTS: PropPart[] = [
  { size: [3, 3, 0.05], position: [1.5, 1.5, -0.2], material: shelfMat },

  { size: [0.1, 3, 0.5], position: [0, 1.5, 0], material: shelfMat },
  { size: [0.1, 3, 0.5], position: [3, 1.5, 0], material: shelfMat },
  { size: [3, 0.6, 0.5], position: [1.5, 0.3, 0], material: shelfMat },
  { size: [3, 0.1, 0.5], position: [1.5, 1.25, 0], material: shelfMat },
  { size: [3, 0.1, 0.5], position: [1.5, 2, 0], material: shelfMat },
  { size: [3, 0.1, 0.5], position: [1.5, 2.75, 0], material: shelfMat },
];

const bedMatMetal = material_metal_world;
const bedMatFabric = material_fabric_world;
const BED_PARTS: PropPart[] = [
  { size: [3, 0.1, 0.1], position: [1.5, 0.5, 0], material: bedMatMetal },
  { size: [3, 0.1, 0.1], position: [1.5, 0.5, 1.25], material: bedMatMetal },

  { size: [0.1, 0.1, 1.25], position: [0, 0.5, 0.625], material: bedMatMetal },
  { size: [0.1, 0.1, 1.25], position: [0, 1, 0.625], material: bedMatMetal },
  { size: [0.1, 0.1, 1.25], position: [3, 1, 0.625], material: bedMatMetal },
  { size: [0.1, 0.1, 1.25], position: [3, 0.5, 0.625], material: bedMatMetal },

  { size: [0.1, 1, 0.1], position: [0, 0.5, 0], material: bedMatMetal },
  { size: [0.1, 1, 0.1], position: [3, 0.5, 0], material: bedMatMetal },
  { size: [0.1, 1, 0.1], position: [3, 0.5, 1.25], material: bedMatMetal },
  { size: [0.1, 1, 0.1], position: [0, 0.5, 1.25], material: bedMatMetal },

  { size: [3, 0.2, 1.25], position: [1.5, 0.6, 0.625], material: bedMatFabric },
];

const tableWoodMat = material_wood_world;
const tableMat = material_table_world;
const TABLE_PARTS: PropPart[] = [
  { size: [3, 0.1, 1.5], position: [1.5, 1, 0.75], material: tableMat },

  { size: [0.1, 1, 0.1], position: [0.1, 0.5, 0.1], material: tableWoodMat },
  { size: [0.1, 1, 0.1], position: [2.9, 0.5, 0.1], material: tableWoodMat },
  { size: [0.1, 1, 0.1], position: [2.9, 0.5, 1.4], material: tableWoodMat },
  { size: [0.1, 1, 0.1], position: [0.1, 0.5, 1.4], material: tableWoodMat },
];

const METAL_SHELF_PARTS: PropPart[] = [
  {
    size: [3, 0.08, 0.55],
    position: [1.5, 0.45, 0],
    material: material_metal_world,
  },
  {
    size: [3, 0.08, 0.55],
    position: [1.5, 1.15, 0],
    material: material_metal_world,
  },
  {
    size: [3, 0.08, 0.55],
    position: [1.5, 1.85, 0],
    material: material_metal_world,
  },
  {
    size: [3, 0.08, 0.55],
    position: [1.5, 2.55, 0],
    material: material_metal_world,
  },
  {
    size: [0.08, 2.7, 0.08],
    position: [0, 1.35, -0.24],
    material: material_metal_world,
  },
  {
    size: [0.08, 2.7, 0.08],
    position: [3, 1.35, -0.24],
    material: material_metal_world,
  },
  {
    size: [0.08, 2.7, 0.08],
    position: [0, 1.35, 0.24],
    material: material_metal_world,
  },
  {
    size: [0.08, 2.7, 0.08],
    position: [3, 1.35, 0.24],
    material: material_metal_world,
  },
  {
    size: [3.1, 0.04, 0.04],
    position: [1.5, 2.9, -0.24],
    material: material_metal_world,
  },
  {
    size: [3.1, 0.04, 0.04],
    position: [1.5, 2.9, 0.24],
    material: material_metal_world,
  },
];

const SAFE_PARTS: PropPart[] = [
  {
    size: [0.2, 1.2, 1],
    position: [-0.5, 0.6, 0],
    material: material_metal_world,
  },
  {
    size: [0.2, 1.2, 1],
    position: [0.5, 0.6, 0],
    material: material_metal_world,
  },
  {
    size: [0.2, 1.2, 1],
    position: [-0.5, 0.6, 0],
    material: material_metal_world,
  },
  {
    size: [1, 1.2, 0.2],
    position: [0, 0.6, -0.5],
    material: material_metal_world,
  },
  {
    size: [1, 0.2, 1],
    position: [0, 0.1, 0],
    material: material_metal_world,
  },
  {
    size: [1.2, 0.2, 1],
    position: [0, 1.3, 0],
    material: material_metal_world,
  },
];

const SINK_PARTS: PropPart[] = [
  {
    size: [1.25, 0.22, 0.72],
    position: [0, 0.92, 0],
    material: ceramicMaterial,
  },
  {
    size: [0.78, 0.16, 0.48],
    position: [0, 0.98, 0.02],
    material: darkRubberMaterial,
  },
  {
    size: [0.18, 0.72, 0.18],
    position: [0, 0.42, 0],
    material: ceramicMaterial,
  },
  {
    size: [0.12, 0.42, 0.12],
    position: [0, 1.25, -0.18],
    material: material_metal_world,
  },
  {
    size: [0.38, 0.08, 0.08],
    position: [0, 1.45, 0.02],
    material: material_metal_world,
  },
  {
    size: [0.1, 0.08, 0.1],
    position: [-0.32, 1.1, -0.14],
    material: material_metal_world,
    shape: 'cylinder',
  },
  {
    size: [0.1, 0.08, 0.1],
    position: [0.32, 1.1, -0.14],
    material: material_metal_world,
    shape: 'cylinder',
  },
];

const TOILET_PARTS: PropPart[] = [
  {
    size: [0.78, 0.48, 0.92],
    position: [0, 0.38, 0.12],
    material: ceramicMaterial,
    shape: 'cylinder',
  },
  {
    size: [0.48, 0.24, 0.58],
    position: [0, 0.48, 0.12],
    material: darkRubberMaterial,
    shape: 'cylinder',
  },
  {
    size: [0.84, 0.16, 0.98],
    position: [0, 0.78, 0.12],
    material: ceramicMaterial,
  },
  {
    size: [0.82, 0.86, 0.24],
    position: [0, 1.12, -0.44],
    material: ceramicMaterial,
  },
  {
    size: [0.72, 0.12, 0.26],
    position: [0, 1.62, -0.42],
    material: ceramicMaterial,
  },
];

const STALL_PARTS: PropPart[] = [
  {
    size: [0.08, 2.25, 2.1],
    position: [-0.8, 1.12, 0],
    material: material_metal_world,
  },
  {
    size: [0.08, 2.25, 2.1],
    position: [0.8, 1.12, 0],
    material: material_metal_world,
  },
  {
    size: [1.5, 2.05, 0.08],
    position: [0, 1.08, -1.02],
    material: material_metal_world,
  },
  {
    size: [0.64, 1.75, 0.06],
    position: [-0.38, 0.98, 1.02],
    material: material_metal_world,
  },
  {
    size: [0.64, 1.75, 0.06],
    position: [0.38, 0.98, 1.02],
    material: material_metal_world,
  },
  {
    size: [0.18, 0.08, 0.08],
    position: [0.18, 1.1, 1.08],
    material: material_metal_world,
  },
];

const HAMMER_PARTS: PropPart[] = [
  {
    size: [0.13, 1.05, 0.13],
    position: [0, 0.48, 0],
    rotation: [0, 0, 0.18],
    material: material_wood_world,
  },
  {
    size: [0.82, 0.22, 0.28],
    position: [0.1, 1.05, 0],
    rotation: [0, 0, 0.18],
    material: material_metal_world,
  },
  {
    size: [0.2, 0.3, 0.3],
    position: [-0.38, 1.06, 0],
    rotation: [0, 0, 0.18],
    material: material_metal_world,
  },
];

const AXE_PARTS: PropPart[] = [
  {
    size: [0.14, 1.35, 0.14],
    position: [0, 0.62, 0],
    rotation: [0, 0, -0.16],
    material: material_wood_world,
  },
  {
    size: [0.52, 0.32, 0.12],
    position: [0.18, 1.28, 0],
    rotation: [0, 0, -0.16],
    material: material_metal_world,
  },
  {
    size: [0.2, 0.42, 0.1],
    position: [-0.2, 1.27, 0],
    rotation: [0, 0, -0.16],
    material: material_metal_world,
  },
  {
    size: [0.16, 0.16, 0.16],
    position: [0.04, 1.12, 0],
    rotation: [0, 0, -0.16],
    material: material_metal_world,
  },
];

const BOARDS_PARTS: PropPart[] = [
  {
    size: [1.65, 0.16, 0.18],
    position: [0, 0.7, 0],
    rotation: [0, 0, 0.24],
    material: material_wood_world,
  },
  {
    size: [1.75, 0.16, 0.18],
    position: [0, 1.08, 0.02],
    rotation: [0, 0, -0.18],
    material: material_wood_world,
  },
  {
    size: [1.55, 0.16, 0.18],
    position: [0, 1.46, -0.02],
    rotation: [0, 0, 0.16],
    material: material_wood_world,
  },
];

const BROKEN_BOARDS_PARTS: PropPart[] = [
  {
    size: [0.85, 0.14, 0.16],
    position: [-0.35, 0.18, 0.18],
    rotation: [0.1, 0.55, 0.12],
    material: material_wood_world,
  },
  {
    size: [0.95, 0.14, 0.16],
    position: [0.45, 0.14, -0.12],
    rotation: [-0.08, -0.7, -0.16],
    material: material_wood_world,
  },
  {
    size: [0.75, 0.14, 0.16],
    position: [0.1, 0.1, 0.32],
    rotation: [0.2, 0.1, 0.75],
    material: material_wood_world,
  },
];

const STAIR_GATE_PARTS: PropPart[] = [
  {
    size: [3.2, 0.08, 0.08],
    position: [0, 0.12, 0],
    material: material_metal_world,
  },
  {
    size: [3.2, 0.08, 0.08],
    position: [0, 2.2, 0],
    material: material_metal_world,
  },
  {
    size: [0.08, 2.3, 0.08],
    position: [-1.6, 1.15, 0],
    material: material_metal_world,
  },
  {
    size: [0.08, 2.3, 0.08],
    position: [1.6, 1.15, 0],
    material: material_metal_world,
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    size: [0.04, 2.2, 0.04] as Vec3,
    position: [-1.2 + i * 0.34, 1.15, 0] as Vec3,
    rotation: [0, 0, 0.25] as Vec3,
    material: material_metal_world,
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    size: [0.04, 2.2, 0.04] as Vec3,
    position: [-1.2 + i * 0.34, 1.15, 0] as Vec3,
    rotation: [0, 0, -0.25] as Vec3,
    material: material_metal_world,
  })),
];

const MIRROR_PARTS: PropPart[] = [
  {
    size: [1.2, 1.5, 0.06],
    position: [0, 1.55, 0],
    material: glassMaterial,
    collider: false,
  },
  {
    size: [1.28, 0.08, 0.08],
    position: [0, 0.78, 0],
    material: material_metal_world,
  },
  {
    size: [1.28, 0.08, 0.08],
    position: [0, 2.32, 0],
    material: material_metal_world,
  },
  {
    size: [0.08, 1.6, 0.08],
    position: [-0.64, 1.55, 0],
    material: material_metal_world,
  },
  {
    size: [0.08, 1.6, 0.08],
    position: [0.64, 1.55, 0],
    material: material_metal_world,
  },
];

/* -------------------------------- COMPONENTS ------------------------------- */

export const BrokenWall = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={BROKEN_WALL_PARTS} data={data} />
    </Item>
  );
};

export const Wheelchair = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={WHEELCHAIR_PARTS} data={data} />
    </Item>
  );
};

export const Stair = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={STAIR_PARTS} data={data} />
    </Item>
  );
};

export const Key = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={true} grabbable={true}>
      <ProceduralProp parts={KEY_PARTS} data={data} />
    </Item>
  );
};

export const KeyM222 = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={true} grabbable={true}>
      <ProceduralProp parts={KEY_PARTS} data={data} />
    </Item>
  );
};

export const KeyM220 = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={true} grabbable={true}>
      <ProceduralProp parts={KEY_PARTS} data={data} />
    </Item>
  );
};

export const Box = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={true}>
      <ProceduralProp parts={BOX_PARTS} data={data} />
    </Item>
  );
};

export const Box2 = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={true} grabbable={true}>
      <ProceduralProp parts={BOX2_PARTS} data={data} />
    </Item>
  );
};

export const Book = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={true} grabbable={true}>
      <ProceduralProp parts={BOOK_PARTS} data={data} />
    </Item>
  );
};

export const Shelf = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={SHELF_PARTS} data={data} />
    </Item>
  );
};

export const MetalShelf = ({ data }: { data: ItemsList }) => (
  <Item data={data} gravity={false} grabbable={false}>
    <ProceduralProp parts={METAL_SHELF_PARTS} data={data} />
  </Item>
);

export const Bed = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={BED_PARTS} data={data} />
    </Item>
  );
};

export const Table = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={TABLE_PARTS} data={data} />
    </Item>
  );
};

export const Safe = ({ data }: { data: ItemsList }) => {
  const keypadRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Group>(null);
  const uuidRef = useRef(crypto.randomUUID());
  const [open, setOpen] = useState(false);
  const { openSafeKeypad } = usePlayerData();

  const handleSafeUse = useCallback(() => {
    if (open) return;
    openSafeKeypad(() => setOpen(true));
  }, [open, openSafeKeypad]);

  useEffect(() => {
    if (!keypadRef.current) return;
    keypadRef.current.userData.clickRoot = true;
    keypadRef.current.userData.name = 'safe';
    keypadRef.current.userData.uuid = uuidRef.current;
    keypadRef.current.userData.type = 'item';
  }, []);

  useEffect(() => {
    const unsub = eventBus.on('itemClicked', (payload) => {
      if (payload?.uuid === uuidRef.current) {
        handleSafeUse();
      }
    });

    return unsub;
  }, [handleSafeUse]);

  useEffect(() => {
    let frame = 0;

    const animateDoor = () => {
      if (!doorRef.current) return;
      const target = open ? -Math.PI * 0.62 : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(
        doorRef.current.rotation.y,
        target,
        0.12,
      );
      frame = requestAnimationFrame(animateDoor);
    };

    frame = requestAnimationFrame(animateDoor);
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <Item data={data} gravity={false} grabbable={false}>
      <group>
        <ProceduralProp parts={SAFE_PARTS} data={data} />
        <group ref={doorRef} position={[-0.51, 0.18, 0.54]}>
          <mesh position={[0.51, 0.52, 0]}>
            <boxGeometry args={[1.02, 1.05, 0.08]} />
            <meshStandardMaterial color="#151515" roughness={0.7} />
          </mesh>
          <mesh position={[0.14, 0.52, 0.075]}>
            <boxGeometry args={[0.12, 0.12, 0.12]} />
            <meshStandardMaterial
              color="#44494d"
              metalness={0.8}
              roughness={0.25}
            />
          </mesh>
          <group ref={keypadRef} position={[0.72, 0.66, 0.08]}>
            <mesh>
              <boxGeometry args={[0.36, 0.28, 0.08]} />
              <meshStandardMaterial color={'#161616'} />
            </mesh>
            <Text
              position={[0, 0, 0.055]}
              fontSize={0.075}
              color="#d9f5d6"
              anchorX="center"
              anchorY="middle"
            >
              {open ? 'OPEN' : 'CODE'}
            </Text>
          </group>
        </group>
      </group>
    </Item>
  );
};

export const Sink = ({ data }: { data: ItemsList }) => (
  <Item data={data} gravity={false} grabbable={false}>
    <ProceduralProp parts={SINK_PARTS} data={data} />
  </Item>
);

export const Toilet = ({ data }: { data: ItemsList }) => (
  <Item data={data} gravity={false} grabbable={false}>
    <ProceduralProp parts={TOILET_PARTS} data={data} />
  </Item>
);

export const Stall = ({ data }: { data: ItemsList }) => (
  <Item data={data} gravity={false} grabbable={false}>
    <ProceduralProp parts={STALL_PARTS} data={data} />
  </Item>
);

export const Hammer = ({ data }: { data: ItemsList }) => (
  <Item data={data} gravity={true} grabbable={true}>
    <ProceduralProp parts={HAMMER_PARTS} data={data} />
  </Item>
);

export const Axe = ({ data }: { data: ItemsList }) => (
  <Item data={data} gravity={true} grabbable={true}>
    <ProceduralProp parts={AXE_PARTS} data={data} />
  </Item>
);

export const Boards = ({ data }: { data: ItemsList }) => {
  const boardRef = useRef<THREE.Group>(null);
  const uuidRef = useRef(crypto.randomUUID());
  const [broken, setBroken] = useState(false);
  const { Inventory, currentSlot } = useInventory();

  useEffect(() => {
    if (!boardRef.current) return;
    boardRef.current.userData.clickRoot = true;
    boardRef.current.userData.name = 'boards';
    boardRef.current.userData.uuid = uuidRef.current;
    boardRef.current.userData.type = 'item';
  }, []);

  useEffect(() => {
    const unsub = eventBus.on('itemClicked', (payload) => {
      if (payload?.uuid !== uuidRef.current) return;
      if (Inventory[currentSlot] === 'axe') {
        setBroken(true);
      }
    });

    return unsub;
  }, [Inventory, currentSlot]);

  return (
    <Item data={data} gravity={false} grabbable={false}>
      <group ref={boardRef}>
        <ProceduralProp
          parts={broken ? BROKEN_BOARDS_PARTS : BOARDS_PARTS}
          data={data}
        />
      </group>
    </Item>
  );
};

export const StairGate = ({ data }: { data: ItemsList }) => (
  <Item data={data} gravity={false} grabbable={false}>
    <ProceduralProp parts={STAIR_GATE_PARTS} data={data} />
  </Item>
);

export const FacilityMirror = ({ data }: { data: ItemsList }) => (
  <Item data={data} gravity={false} grabbable={false}>
    <ProceduralProp parts={MIRROR_PARTS} data={data} />
  </Item>
);

function RoomLabel({ data, label }: { data: ItemsList; label: string }) {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <group>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[0.78, 0.34, 0.05]} />
          <meshStandardMaterial color="#25282b" roughness={0.65} />
        </mesh>
        <mesh position={[0, 1.6, 0.031]}>
          <boxGeometry args={[0.66, 0.23, 0.02]} />
          <meshStandardMaterial color="#d5d0bd" roughness={0.5} />
        </mesh>
        <Text
          position={[0, 1.6, 0.05]}
          fontSize={0.16}
          color="#101010"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Item>
  );
}

export const RoomLabelM220 = ({ data }: { data: ItemsList }) => (
  <RoomLabel data={data} label="M220" />
);
export const RoomLabelM221 = ({ data }: { data: ItemsList }) => (
  <RoomLabel data={data} label="M221" />
);
export const RoomLabelM222 = ({ data }: { data: ItemsList }) => (
  <RoomLabel data={data} label="M222" />
);
export const RoomLabelM223 = ({ data }: { data: ItemsList }) => (
  <RoomLabel data={data} label="M223" />
);

export const itemById: Record<string, ComponentType<{ data: ItemsList }>> = {
  brokenwall: BrokenWall,
  safe: Safe,
  metalshelf: MetalShelf,
  sink: Sink,
  mirror: FacilityMirror,
  stall: Stall,
  toilet: Toilet,
  hammer: Hammer,
  axe: Axe,
  boards: Boards,
  stairgate: StairGate,
  roomlabelm220: RoomLabelM220,
  roomlabelm221: RoomLabelM221,
  roomlabelm222: RoomLabelM222,
  roomlabelm223: RoomLabelM223,
  wheelchair: Wheelchair,
  stair: Stair,
  key: Key,
  keym222: KeyM222,
  box: Box,
  box2: Box2,
  book: Book,
  shelf: Shelf,
  bed: Bed,
  table: Table,
};

export const nameById: Record<string, string> = {
  brokenwall: 'Broken Wall',
  safe: 'Safe',
  metalshelf: 'Metal Shelf',
  sink: 'Sink',
  mirror: 'Mirror',
  stall: 'Bathroom Stall',
  toilet: 'Toilet',
  hammer: 'Hammer',
  axe: 'Axe',
  boards: 'Boards',
  stairgate: 'Stair Gate',
  roomlabelm220: 'Room Label M220',
  roomlabelm221: 'Room Label M221',
  roomlabelm222: 'Room Label M222',
  roomlabelm223: 'Room Label M223',
  wheelchair: 'Wheelchair',
  stair: 'Stair',
  key: 'Key',
  keym222: 'Key [M222]',
  box: 'Box',
  box2: 'Box2',
  book: 'Green Book',
  shelf: 'Shelf',
  bed: 'Bed',
  table: 'Table',
};

export const getItemComponent = (id: string) => itemById[id];
