import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Instances, Instance } from '@react-three/drei';
import { useMemo } from 'react';
import { material_plaster_world } from '../../../materials/Textures';
import { useMapEditor, type WallDef } from '../../../context/MapEditor';

export const baseWalls: WallDef[] = [
  // EXTENDED HALLWAY
  { position: [0, 0, 20], length: 20 },
  { position: [-4, 0, 20], length: 20 },

  // Room M223
  { position: [4, 0, 0], width: 8 },
  { position: [8, 0, 5], length: 10 },
  { position: [4, 0, 10], width: 8 },
  { position: [0, 0, 2.75], length: 5.5 },
  { position: [0, 0, 8.75], length: 2.5 },

  // Room M221
  { position: [8, 0, -5], length: 10 },
  { position: [4, 0, -10], width: 8 },
  { position: [0, 0, -7.25], length: 5.5 },
  { position: [0, 0, -1.25], length: 2.5 },

  // Room M222
  { position: [-8, 0, 0], width: 8 },
  { position: [-12, 0, 5], length: 10 },
  { position: [-8, 0, 10], width: 8 },
  { position: [-4, 0, 2.75], length: 5.5 },
  { position: [-4, 0, 8.75], length: 2.5 },

  // Room M220
  { position: [-12, 0, -5], length: 10 },
  { position: [-5, 0, -10], width: 2 },
  { position: [-11, 0, -10], width: 6 },
  { position: [-4, 0, -7.25], length: 5.5 },
  { position: [-4, 0, -1.25], length: 2.5 },

  // Bathroom
  { position: [-8, 0, -18], width: 8 },
  { position: [-12, 0, -14], length: 8 },
  { position: [-4, 0, -14], length: 8 },

  // Stairwell
  { position: [-4, 0, -18.25], length: 0.5 },
  { position: [-4, 0, -23.75], length: 0.5 },
  { position: [-7, 0, -21], width: 6 },
  { position: [-7, 0, -24], width: 6 },

  // Hallway Endcap
  { position: [-4, 0, -26], length: 4 },
  { position: [-2, 0, -28], width: 4 },

  // Closet
  { position: [0, 0, -11], length: 2 },
  { position: [0, 0, -15], length: 2 },
  { position: [2, 0, -16], width: 4 },
  { position: [4, 0, -13], length: 6 },
];

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

export default function WallMap() {
  const { customWalls } = useMapEditor();
  const wallSegments = useMemo(
    () => [...baseWalls, ...customWalls].flatMap(getWallSegments),
    [customWalls],
  );

  return (
    <>
      <RigidBody type="fixed">
        {wallSegments.map((wall, i) => {
          return (
            <CuboidCollider
              key={i}
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
              key={i}
              position={wall.position}
              scale={[wall.width, 5, wall.length]}
            />
          );
        })}
      </Instances>
    </>
  );
}
