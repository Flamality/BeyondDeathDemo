import { Container, Fullscreen, Text } from "@react-three/uikit";
import React, { useEffect } from "react";
import { usePlayerData } from "../context/PlayerData";
import MenuButton from "./components/MenuButton";

export default function PauseMenu() {
  const { paused, setPaused, cameraController, setInMenu} = usePlayerData();

  useEffect(() => {
    if (paused && cameraController.current) {
      cameraController.current.unlock();
    }
  }, [paused]);

  return (
    <Fullscreen
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      gap={20}
      backgroundColor='rgba(0, 0, 0, 0.8)'
      visibility={paused ? "visible" : "hidden"}
      pointerEvents={paused ? "auto" : "none"}
      distanceToCamera={2}
      depthTest={false}
      zIndex={1000}
    >
      <Text fontSize={32} color='white' pointerEvents='none'>
        PAUSED
      </Text>

      <MenuButton
        onClick={(e: any) => {
          e.stopPropagation();
          setPaused(false);
          cameraController.current?.setPaused(false);
        }}
      >
        Resume
      </MenuButton>
      <MenuButton onClick={() => {
        setInMenu(true);
        setPaused(false);
        cameraController.current?.setPaused(false);
        }}>
        Main Menu
      </MenuButton>
    </Fullscreen>
  );
}
