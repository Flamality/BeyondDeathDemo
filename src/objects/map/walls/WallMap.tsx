import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Instances, Instance } from '@react-three/drei';
import { useMemo } from 'react';
import { material_plaster_world } from '../../../materials/Textures';
import { useMapEditor, type WallDef } from '../../../context/MapEditor';
import { useBaseWalls } from './WallCatalog';

type WallSegment = {
  position: [number, number, number];
  width: number;
  length: number;
};

function getWallSegments(wall: WallDef): WallSegment[] {
  const width = wall.width ?? 0.4;
  const length = wall.length ?? 0.4;
  const floor = wall.floor ?? 1;
  const centerY = (floor - 1) * 10 + 2.5 + wall.position[1];
  const isXAxis = width >= length;
  const total = isXAxis ? width : length;
  const thickness = isXAxis ? length : width;
  const openings = [...(wall.openings ?? [])]
    .map((opening) => ({
      start: Math.max(-total / 2, opening.offset - opening.width / 2),
      end: Math.min(total / 2, opening.offset + opening.width / 2),
    }))
    .filter((opening) => opening.end > opening.start)
    .sort((a, b) => a.start - b.start);

  const segments: WallSegment[] = [];
  let cursor = -total / 2;

  for (const opening of openings) {
    if (opening.start > cursor) {
      const size = opening.start - cursor;
      const localCenter = cursor + size / 2;
      segments.push({
        position: isXAxis
          ? [wall.position[0] + localCenter, centerY, wall.position[2]]
          : [wall.position[0], centerY, wall.position[2] + localCenter],
        width: isXAxis ? size : thickness,
        length: isXAxis ? thickness : size,
      });
    }
    cursor = Math.max(cursor, opening.end);
  }

  if (cursor < total / 2) {
    const size = total / 2 - cursor;
    const localCenter = cursor + size / 2;
    segments.push({
      position: isXAxis
        ? [wall.position[0] + localCenter, centerY, wall.position[2]]
        : [wall.position[0], centerY, wall.position[2] + localCenter],
      width: isXAxis ? size : thickness,
      length: isXAxis ? thickness : size,
    });
  }

  return segments;
}

function getWallSegmentKey(wall: WallSegment, index: number) {
  return `${index}:${wall.position.join(',')}:${wall.width}:${wall.length}`;
}

export default function WallMap() {
  const baseWalls = useBaseWalls();
  const { customWalls } = useMapEditor();
  const wallSegments = useMemo(
    () => [...baseWalls, ...customWalls].flatMap(getWallSegments),
    [baseWalls, customWalls],
  );

  return (
    <>
      <RigidBody type="fixed">
        {wallSegments.map((wall, i) => {
          return (
            <CuboidCollider
              key={getWallSegmentKey(wall, i)}
              args={[wall.width / 2, 2.5, wall.length / 2]}
              position={wall.position}
            />
          );
        })}
      </RigidBody>

      <Instances
        limit={Math.max(wallSegments.length, 1)}
        material={material_plaster_world}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        {wallSegments.map((wall, i) => {
          return (
            <Instance
              key={getWallSegmentKey(wall, i)}
              position={wall.position}
              scale={[wall.width, 5, wall.length]}
            />
          );
        })}
      </Instances>
    </>
  );
}
