import type { ComponentType } from "react";
import { useMemo } from "react";
import * as THREE from "three";
import { CuboidCollider } from "@react-three/rapier";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import type { ItemsList } from "../../../context/Items";
import Item from "./Item";
import {
  texture_fabric,
  texture_metal,
  texture_table,
  texture_wood,
} from "../../../materials/Textures";

type Vec3 = [number, number, number];

type PropPart = {
  size: Vec3;
  position: Vec3;
  material: THREE.Material;
  collider?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
};

type MaterialGroup = {
  material: THREE.Material;
  boxes: PropPart[];
};

function mergePartGeometries(parts: PropPart[]) {
  const geos = parts.map(({ size, position }) => {
    const geo = new THREE.BoxGeometry(...size);
    geo.translate(...position);
    return geo;
  });

  const merged = mergeGeometries(geos, false);
  geos.forEach((g) => g.dispose());
  return merged;
}

function groupPartsByMaterial(parts: PropPart[]): MaterialGroup[] {
  const map = new Map<THREE.Material, PropPart[]>();

  for (const part of parts) {
    const existing = map.get(part.material);
    if (existing) {
      existing.push(part);
    } else {
      map.set(part.material, [part]);
    }
  }

  return Array.from(map.entries()).map(([material, boxes]) => ({
    material,
    boxes,
  }));
}

function RenderMergedParts({
  parts,
}: {
  parts: PropPart[];
}) {
  const groups = useMemo(() => groupPartsByMaterial(parts), [parts]);

  return (
    <>
      {groups.map((group, i) => {
        const geometry = useMemo(() => mergePartGeometries(group.boxes), [group.boxes]);

        const castShadow = group.boxes.some((p) => p.castShadow !== false);
        const receiveShadow = group.boxes.some((p) => p.receiveShadow !== false);

        return (
          <mesh
            key={i}
            geometry={geometry}
            material={group.material}
            castShadow={castShadow}
            receiveShadow={receiveShadow}
          />
        );
      })}
    </>
  );
}

function RenderPartColliders({
  parts,
}: {
  parts: PropPart[];
}) {
  return (
    <>
      {parts
        .filter((part) => part.collider !== false)
        .map((part, i) => (
          <CuboidCollider
            key={i}
            args={[
              part.size[0] / 2,
              part.size[1] / 2,
              part.size[2] / 2,
            ]}
            position={part.position}
          />
        ))}
    </>
  );
}

function ProceduralProp({
  parts,
}: {
  parts: PropPart[];
}) {
  return (
    <>
      <RenderMergedParts parts={parts} />
      <RenderPartColliders parts={parts} />
    </>
  );
}

/* ----------------------------- SHARED MATERIALS ---------------------------- */

const blueMaterial = new THREE.MeshStandardMaterial({ color: "blue" });
const greenMaterial = new THREE.MeshStandardMaterial({ color: "green" });

/* -------------------------------- PROP DATA -------------------------------- */

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
    material: texture_metal,
  },
];

const BOOK_PARTS: PropPart[] = [
  {
    size: [0.5, 0.1, 0.7],
    position: [0, 0, 0],
    material: greenMaterial,
  },
];

const SHELF_PARTS: PropPart[] = [
  { size: [3, 3, 0.05], position: [1.5, 1.5, -0.2], material: texture_table },

  { size: [0.1, 3, 0.5], position: [0, 1.5, 0], material: texture_wood },
  { size: [0.1, 3, 0.5], position: [3, 1.5, 0], material: texture_wood },
  { size: [3, 0.6, 0.5], position: [1.5, 0.3, 0], material: texture_wood },
  { size: [3, 0.1, 0.5], position: [1.5, 1.25, 0], material: texture_wood },
  { size: [3, 0.1, 0.5], position: [1.5, 2, 0], material: texture_wood },
  { size: [3, 0.1, 0.5], position: [1.5, 2.75, 0], material: texture_wood },
];

const BED_PARTS: PropPart[] = [
  { size: [3, 0.1, 0.1], position: [1.5, 0.5, 0], material: texture_metal },
  { size: [3, 0.1, 0.1], position: [1.5, 0.5, 1.25], material: texture_metal },

  { size: [0.1, 0.1, 1.25], position: [0, 0.5, 0.625], material: texture_metal },
  { size: [0.1, 0.1, 1.25], position: [0, 1, 0.625], material: texture_metal },
  { size: [0.1, 0.1, 1.25], position: [3, 1, 0.625], material: texture_metal },
  { size: [0.1, 0.1, 1.25], position: [3, 0.5, 0.625], material: texture_metal },

  { size: [0.1, 1, 0.1], position: [0, 0.5, 0], material: texture_metal },
  { size: [0.1, 1, 0.1], position: [3, 0.5, 0], material: texture_metal },
  { size: [0.1, 1, 0.1], position: [3, 0.5, 1.25], material: texture_metal },
  { size: [0.1, 1, 0.1], position: [0, 0.5, 1.25], material: texture_metal },

  { size: [3, 0.4, 1.25], position: [1.5, 0.6, 0.625], material: texture_fabric },
];

const TABLE_PARTS: PropPart[] = [
  { size: [3, 0.1, 1.5], position: [1.5, 1, 0.75], material: texture_table },

  { size: [0.1, 1, 0.1], position: [0.1, 0.5, 0.1], material: texture_wood },
  { size: [0.1, 1, 0.1], position: [2.9, 0.5, 0.1], material: texture_wood },
  { size: [0.1, 1, 0.1], position: [2.9, 0.5, 1.4], material: texture_wood },
  { size: [0.1, 1, 0.1], position: [0.1, 0.5, 1.4], material: texture_wood },
];

/* -------------------------------- COMPONENTS ------------------------------- */

export const Box = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={true}>
      <ProceduralProp parts={BOX_PARTS} />
    </Item>
  );
};

export const Box2 = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={true} grabbable={true}>
      <ProceduralProp parts={BOX2_PARTS} />
    </Item>
  );
};

export const Book = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={true} grabbable={true}>
      <ProceduralProp parts={BOOK_PARTS} />
    </Item>
  );
};

export const Shelf = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={SHELF_PARTS} />
    </Item>
  );
};

export const Bed = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={BED_PARTS} />
    </Item>
  );
};

export const Table = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={TABLE_PARTS} />
    </Item>
  );
};

const itemById: Record<string, ComponentType<{ data: ItemsList }>> = {
  box: Box,
  box2: Box2,
  book: Book,
  shelf: Shelf,
  bed: Bed,
  table: Table,
};

export const getItemComponent = (id: string) => itemById[id.toLowerCase()];