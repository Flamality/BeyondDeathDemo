import { useEffect, useState } from "react";
import { useInventory } from "../context/Inventory";
import { useItems } from "../context/Items";
import { usePlayerData } from "../context/PlayerData";

export default function EndingOverlay() {
  const {
    endingActive,
    finishEnding,
    setInMenu,
    setPaused,
    setMenuPanel,
    startGame,
  } = usePlayerData();
  const { updateMap } = useItems();
  const { resetInventory } = useInventory();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!endingActive) {
      setShowContent(false);
      return;
    }

    const timer = window.setTimeout(() => setShowContent(true), 2600);
    return () => window.clearTimeout(timer);
  }, [endingActive]);

  if (!endingActive) return null;

  const restart = () => {
    resetInventory();
    updateMap();
    finishEnding();
    startGame();
  };

  const quit = () => {
    resetInventory();
    updateMap();
    finishEnding();
    setPaused(false);
    setMenuPanel(null);
    setInMenu(true);
  };

  return (
    <div className="ending-overlay">
      {showContent && (
        <div className="ending-panel">
          <h1>You escaped the facility</h1>
          <div className="ending-actions">
            <button type="button" onClick={restart}>
              Keep your soul alive
            </button>
            <button type="button" onClick={quit}>
              Quit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
