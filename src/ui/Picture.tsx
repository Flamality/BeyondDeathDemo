import { Container, Fullscreen, Image } from "@react-three/uikit";
import React, { useEffect } from "react";
import { usePlayerData } from "../context/PlayerData";

const waitFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export default function Picture({ imageRef }: any) {
  const { takingImage, setTakingImage } = usePlayerData();

  useEffect(() => {
    if (!takingImage) return;

    let cancelled = false;

    const run = async () => {
      await waitFrame();
      await waitFrame();
      await waitFrame();

      if (!cancelled) {
        setTakingImage(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [takingImage, setTakingImage]);

  return (
    <Fullscreen
      distanceToCamera={1}
      depthTest={false}
      pointerEvents="none"
      zIndex={99}
      {...({ "*": { userSelect: "none" } } as any)}
    >
      <Container>
        {imageRef.current && (
          <Image src={imageRef.current} height="50%" width="50%" />
        )}
      </Container>
    </Fullscreen>
  );
}