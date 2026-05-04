import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { CuboidCollider } from '@react-three/rapier';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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

type MaterialGroup = {
  material: THREE.Material;
  boxes: PropPart[];
};

function mergePartGeometries(parts: PropPart[]) {
  const geos = parts.map(({ size, position, shape, rotation }) => {
    let geo: THREE.BufferGeometry;
    switch (shape) {
      case 'cylinder':
        geo = new THREE.CylinderGeometry(size[0] / 2, size[0] / 2, size[1], 16);
        break;
      case 'sphere':
        geo = new THREE.SphereGeometry(size[0] / 2, 16, 16);
        break;
      default:
        geo = new THREE.BoxGeometry(...size);
    }
    if (rotation) {
      geo.rotateX(rotation[0]);
      geo.rotateY(rotation[1]);
      geo.rotateZ(rotation[2]);
    }
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

function getPartKey(part: PropPart, index: number) {
  return [
    index,
    part.shape ?? 'box',
    part.size.join(','),
    part.position.join(','),
    (part.rotation ?? [0, 0, 0]).join(','),
    part.collider === false ? 'no-collider' : 'collider',
  ].join(':');
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
    ></mesh>
  );
}

function RenderMergedParts({ parts }: { parts: PropPart[] }) {
  const groups = useMemo(() => groupPartsByMaterial(parts), [parts]);

  return (
    <>
      {groups.map((group, i) => (
        <MergedPartMesh key={i} boxes={group.boxes} material={group.material} />
      ))}
    </>
  );
}

function RenderPartColliders({ parts }: { parts: PropPart[] }) {
  return (
    <>
      {parts
        .filter((part) => part.collider !== false)
        .map((part, i) => (
          <CuboidCollider
            key={getPartKey(part, i)}
            args={[part.size[0] / 2, part.size[1] / 2, part.size[2] / 2]}
            rotation={part.rotation}
            position={part.position}
          />
        ))}
    </>
  );
}

export function ProceduralProp({
  parts,
  data,
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
