import React from 'react';
import { Box } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import Door from './Door';
import {
  useMapEditor,
  type OpeningKind,
  type WallDef,
  type WallOpening,
} from '../../../context/MapEditor';
import {
  material_metal_world,
  material_plaster_world,
  material_wood_world,
} from '../../../materials/Textures';
import { baseWalls } from '../walls/WallMap';

function getOpeningTransform(wall: WallDef, opening: WallOpening) {
  const width = wall.width ?? 0.4;
  const length = wall.length ?? 0.4;
  const isXAxis = width >= length;

  return {
    position: isXAxis
      ? ([
          wall.position[0] + opening.offset,
          wall.position[1],
          wall.position[2],
        ] as [number, number, number])
      : ([
          wall.position[0],
          wall.position[1],
          wall.position[2] + opening.offset,
        ] as [number, number, number]),
    rotation: (isXAxis ? 0 : 90) as 0 | 90,
  };
}

function WindowOpening({
  position,
  rotation,
  opening,
}: {
  position: [number, number, number];
  rotation: 0 | 90;
  opening: WallOpening;
}) {
  const sill = opening.sill ?? 1.25;
  const height = opening.height;
  const topHeight = Math.max(0.1, 5 - sill - height);

  return (
    <group position={position} rotation={[0, (rotation * Math.PI) / 180, 0]}>
      <RigidBody type="fixed" colliders="cuboid">
        <Box
          args={[opening.width, sill, 0.4]}
          position={[0, sill / 2, 0]}
          material={material_plaster_world}
        />
        <Box
          args={[opening.width, topHeight, 0.4]}
          position={[0, sill + height + topHeight / 2, 0]}
          material={material_plaster_world}
        />
      </RigidBody>
      <Box
        args={[opening.width, 0.08, 0.15]}
        position={[0, sill, 0]}
        material={material_wood_world}
      />
      <Box
        args={[opening.width, 0.08, 0.15]}
        position={[0, sill + height, 0]}
        material={material_wood_world}
      />
      <Box
        args={[0.08, height, 0.15]}
        position={[-opening.width / 2, sill + height / 2, 0]}
        material={material_wood_world}
      />
      <Box
        args={[0.08, height, 0.15]}
        position={[opening.width / 2, sill + height / 2, 0]}
        material={material_wood_world}
      />
      <Box
        args={[opening.width - 0.2, height - 0.2, 0.04]}
        position={[0, sill + height / 2, 0]}
      >
        <meshStandardMaterial
          color="#8bc7ff"
          transparent
          opacity={0.22}
          roughness={0.15}
        />
      </Box>
    </group>
  );
}

function BrokenWallOpening({
  position,
  rotation,
  opening,
}: {
  position: [number, number, number];
  rotation: 0 | 90;
  opening: WallOpening;
}) {
  const chunks = [
    [-opening.width / 2 - 0.05, 0.55, 0.02, 0.32, 1.1],
    [opening.width / 2 + 0.05, 0.8, -0.03, 0.26, 1.5],
    [-opening.width / 3, 2.45, 0.01, 0.7, 0.28],
    [opening.width / 3, 2.7, -0.02, 0.5, 0.22],
  ];

  return (
    <group position={position} rotation={[0, (rotation * Math.PI) / 180, 0]}>
      {chunks.map(([x, y, z, w, h], index) => (
        <Box
          key={index}
          args={[w, h, 0.42]}
          position={[x, y, z]}
          material={material_plaster_world}
        />
      ))}
    </group>
  );
}

function OpeningFixture({
  wall,
  opening,
}: {
  wall: WallDef;
  opening: WallOpening;
}) {
  const { position, rotation } = getOpeningTransform(wall, opening);
  const kind: OpeningKind = opening.kind;

  if (kind === 'door') {
    return (
      <Door
        position={position}
        rotation={rotation}
        locked={opening.locked}
        itemRequired={opening.itemRequired}
        takeItem={opening.takeItem}
      />
    );
  }

  if (kind === 'window') {
    return (
      <WindowOpening
        position={position}
        rotation={rotation}
        opening={opening}
      />
    );
  }

  return (
    <BrokenWallOpening
      position={position}
      rotation={rotation}
      opening={opening}
    />
  );
}

const Doors: React.FC = () => {
  const { customWalls } = useMapEditor();
  const openingWalls = [...baseWalls, ...customWalls].filter(
    (wall) => wall.openings?.length,
  );

  return (
    <>
      {/* <Door position={[1, 0, 3]} locked={true} itemRequired='Box2' takeItem={true} /> */}
      <Door position={[0, 0, 6.5]} rotation={90} />

      <Door position={[0, 0, -3.5]} rotation={90} locked={true} />

      <Door
        position={[-4, 0, 6.5]}
        rotation={-90}
        locked={true}
        takeItem={true}
        itemRequired="keym222"
      />

      <Door position={[-4, 0, -3.5]} rotation={-90} />

      <Door position={[0, 0, -13]} rotation={90} />

      {openingWalls.flatMap((wall) =>
        (wall.openings ?? []).map((opening) => (
          <OpeningFixture key={opening.id} wall={wall} opening={opening} />
        )),
      )}
    </>
  );
};

export default Doors;
