import { Container, Fullscreen, Text } from "@react-three/uikit";
import React, { useEffect } from "react";
import { usePlayerData } from "../context/PlayerData";
import { useXR } from "@react-three/xr";

export default function PauseMenu() {
  const { paused, setPaused, cameraController, store } = usePlayerData();
  const { session } = useXR();

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
      backgroundColor='rgba(0, 0, 0, 0.7)'
      visibility={paused ? "visible" : "hidden"}
      pointerEvents={paused ? "auto" : "none"}
      distanceToCamera={10}
      depthTest={false}
    >
      <Text fontSize={32} color='white' pointerEvents='none'>
        PAUSED
      </Text>

      <Text
        fontSize={16}
        color='white'
        borderColor='white'
        borderWidth={2}
        padding={10}
        cursor='pointer'
        hover={{ backgroundColor: "white", color: "black" }}
        minWidth={150}
        textAlign='center'
        onClick={(e) => {
          e.stopPropagation();
          setPaused(false);
          cameraController.current?.setPaused(false);
        }}
      >
        Resume
      </Text>

      <Text
        fontSize={16}
        color='white'
        borderColor='white'
        borderWidth={2}
        padding={10}
        cursor='pointer'
        hover={{ backgroundColor: "white", color: "black" }}
        minWidth={150}
        textAlign='center'
        onClick={(e) => {
          e.stopPropagation();
          if (!session) {
            store?.enterVR();
          } else {
            session?.end();
          }
        }}
      >
        {!session ? "Enable VR" : "Exit VR"}
      </Text>
    </Fullscreen>
  );
}
