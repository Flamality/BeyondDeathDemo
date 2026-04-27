import type { ComponentType } from "react";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { CuboidCollider } from "@react-three/rapier";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {Box as Bbox} from "@react-three/drei";
import type { ItemsList } from "../../../context/Items";
import Item from "./Item";
import {

  material_fabric_world,
  material_metal_world,
  material_plaster_world,
  material_table_world,
  material_wood_world,
} from "../../../materials/Textures";

type Vec3 = [number, number, number];

type PropPart = {
  size: Vec3;
  position: Vec3;
  material: THREE.Material;
  collider?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  noColliders?: boolean;
  shape?: "box" | "cylinder" | "sphere";
  rotation?: Vec3;
};

type MaterialGroup = {
  material: THREE.Material;
  boxes: PropPart[];
};

  const material_transparent = new THREE.MeshStandardMaterial({
    color: "white",
    transparent: true,
    opacity: 0.5,
  });

function mergePartGeometries(parts: PropPart[]) {
  const geos = parts.map(({ size, position, shape, rotation }) => {
    let geo: THREE.BufferGeometry;
    switch (shape) {
      case "cylinder":
        geo = new THREE.CylinderGeometry(size[0] / 2, size[0] / 2, size[1], 16);
        break;
      case "sphere":
        geo = new THREE.SphereGeometry(size[0] / 2, 16, 16);
        break;
      default:
        geo = new THREE.BoxGeometry(...size);
    }
    geo.translate(...position);
    if (rotation) {
      geo.rotateX(rotation[0]);
      geo.rotateY(rotation[1]);
      geo.rotateZ(rotation[2]);
    }
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

function MergedPartMesh({
  boxes,
  material,
}: {
  boxes: PropPart[];
  material: THREE.Material;
}) {
  const geometry = useMemo(() => mergePartGeometries(boxes), [boxes]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  const castShadow = boxes.some((p) => p.castShadow !== false);
  const receiveShadow = boxes.some((p) => p.receiveShadow !== false);

  return (
    <mesh
      geometry={geometry}
      material={material}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      dispose={null}
    >
      
      </mesh>
  );
}

function RenderMergedParts({ parts }: { parts: PropPart[] }) {
  const groups = useMemo(() => groupPartsByMaterial(parts), [parts]);

  return (
    <>
      {groups.map((group, i) => (
        <MergedPartMesh
          key={i}
          boxes={group.boxes}
          material={group.material}
        />
      ))}
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
            rotation={part.rotation}
            position={part.position}
          />
          

        ))}
    </>
  );
}

function ProceduralProp({
  parts,
  data
}: {
  parts: PropPart[];
  data: any;
}) {
  if (data.noColliders) {
    return <RenderMergedParts parts={parts} />;
  }
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

const BROKEN_WALL_PARTS: PropPart[] = [
  {
    size: [1, 0.5, 1],
    position: [0,0,0],
    rotation: [0,0,0],
    material: material_plaster_world
  }
]

const WHEELCHAIR_PARTS: PropPart[] = [
  {
    size: [1, 0.1, 1],
    position: [0, 0, 0],
    rotation: [Math.PI / 2, 0, 0],
    material: material_metal_world,
    shape: "cylinder",
  }, 
  {
    size: [1, 0.1, 1],
    position: [0, 1, 0],
    rotation: [Math.PI / 2, 0, 0],
    material: material_metal_world,
    shape: "cylinder",
  }, 
  {
    size: [0.8, 0.1, 1],
    position: [0, 0.1, 0.5],
    material: material_metal_world,
  },
  {
    size: [0.05, 1, 1],
    position: [0.5, 0.6, 0.5],
    material: material_metal_world,
  },
]

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
    position: [1.5,0.2,0],
    rotation: [-21.8 * (Math.PI / 180), 0, 0],
    material: material_transparent
  }
]

const KEY_PARTS_M123: PropPart[] = [
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
  }
  ,
  {
    size: [0.05, 0.05, 0.07],
    position: [-0.22, 0, -0.07],
    material: material_metal_world,
  }
]

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

/* -------------------------------- COMPONENTS ------------------------------- */

export const BrokenWall = ({data}: {data: ItemsList}) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={BROKEN_WALL_PARTS} data={data} />
    </Item>
  )
}

export const Wheelchair = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={WHEELCHAIR_PARTS} data={data} />
    </Item>
  );
}

export const Stair = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={false} grabbable={false}>
      <ProceduralProp parts={STAIR_PARTS} data={data} />
    </Item>
  );
}

export const KeyM123 = ({ data }: { data: ItemsList }) => {
  return (
    <Item data={data} gravity={true} grabbable={true}>
      <ProceduralProp parts={KEY_PARTS_M123} data={data} />
    </Item>
  );
}

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

export const itemById: Record<string, ComponentType<{ data: ItemsList }>> = {
  wheelchair: Wheelchair,
  stair: Stair,
  keym123: KeyM123,
  box: Box,
  box2: Box2,
  book: Book,
  shelf: Shelf,
  bed: Bed,
  table: Table,
};

export const nameById: Record<string, string> = {
  wheelchair: "Wheelchair",
  stair: "Stair",
  keym123: "Key [M123]",
  box: "Box",
  box2: "Box2",
  book: "Green Book",
  shelf: "Shelf",
  bed: "Bed",
  table: "Table",
};  

export const getItemComponent = (id: string) => itemById[id];