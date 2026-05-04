import { Text } from "@react-three/drei";
import { usePlayerData } from "../../../context/PlayerData";

export default function PhotoSecrets() {
  const { revealingPhotoSecrets, safeCode } = usePlayerData();

  return (
    <group>
      <Text
        position={[-8.25, 2, -17.74]}
        rotation={[0, 0, 0.1]}
        fontSize={0.28}
        color='#b15353'
        anchorX='center'
        anchorY='middle'
        fillOpacity={revealingPhotoSecrets ? 0.5 : 0}
        outlineOpacity={0}
      >
        {safeCode}
      </Text>
    </group>
  );
}
