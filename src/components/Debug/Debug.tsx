import React, { useEffect } from "react";
import { usePlayerData } from "../../context/PlayerData";
import { useKeybinds } from "../../context/Keybinds";

export default function Debug() {
  const { pos, rot } = usePlayerData();
  const { actions } = useKeybinds();
  const [displayPos, setDisplayPos] = React.useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [displayRot, setDisplayRot] = React.useState<[number, number, number]>([
    0, 0, 0,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const format = (n: number) => Math.round(n * 100) / 100;

      setDisplayPos([
        format(pos.current[0]),
        format(pos.current[1]),
        format(pos.current[2]),
      ]);

      setDisplayRot([
        format(rot.current[0]),
        format(rot.current[1]),
        format(rot.current[2]),
      ]);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "5px",
        zIndex: 10,
      }}
    >
      {displayPos.join(", ")}
      {" | "}
      {displayRot.join(", ")}
      <br />
      {JSON.stringify(actions)}
    </div>
  );
}
