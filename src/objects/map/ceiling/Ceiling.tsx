import React from "react";

import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { ceiling_diff, makeTiledMaterial } from "../../../materials/Textures";

export default function Ceiling() {
  const texture_ceiling = React.useMemo(() => {
    return makeTiledMaterial(ceiling_diff, 8,8);
  },[]);
  return (
    <>
    <RigidBody type='fixed' position={[0, 5, 0]}>
        <Box args={[20, 0.1, 20]} position={[0,0,0]} material={texture_ceiling}>
        </Box>
     </RigidBody>
    </>
  );
}
