import { Fullscreen, Text } from "@react-three/uikit";

import {usePlayerData} from "../context/PlayerData";
import MenuButton from "./components/MenuButton";

export default function MainMenu() {
    const {inMenu, setInMenu} = usePlayerData();


    if (!inMenu) return null;
  return (
    <>
  

    {/* <mesh position={[-5, 0, -5]}>
        <boxGeometry args={[10, 0.1, 10]} />
        <meshStandardMaterial color="#ffffff" />
     </mesh> */}
         <Fullscreen
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      gap={20}
      distanceToCamera={2}
      depthTest={false}
      zIndex={1000}
      pointerEvents='auto'
          >
      <Text fontSize={32} color='white' pointerEvents='none'>
        Beyond Death
      </Text>
      <MenuButton onClick={() => {
        setInMenu(false);
      }}>
        Play
      </MenuButton>

       <MenuButton onClick={() => {
        setInMenu(false);
      }}>
        Settings
      </MenuButton>
    </Fullscreen>
    </>
  );
}