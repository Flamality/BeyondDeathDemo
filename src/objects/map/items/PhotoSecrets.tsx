import { Text } from '@react-three/drei';
import { usePlayerData } from '../../../context/PlayerData';

export default function PhotoSecrets() {
  const { revealingPhotoSecrets } = usePlayerData();

  if (!revealingPhotoSecrets) return null;

  return (
    <group>
      <Text
        position={[4.2, 2.2, 1.2]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.45}
        color="#f5f2e8"
        anchorX="center"
        anchorY="middle"
      >
        9115
      </Text>
    </group>
  );
}
