import { usePlayerData } from "../context/PlayerData";
import { useItems } from "../context/Items";

export default function MainMenu() {
  const { inMenu, startGame, setMenuPanel, menuPanel } = usePlayerData();
  const { updateMap } = useItems();

  if (!inMenu || menuPanel) return null;

  const play = () => {
    updateMap();
    startGame();
  };

  return (
    <div className="main-menu viewfinder-menu">
      <div className="viewfinder-corner top-left" />
      <div className="viewfinder-corner top-right" />
      <div className="viewfinder-corner bottom-left" />
      <div className="viewfinder-corner bottom-right" />
      <div className="viewfinder-rec">
        <span />
        MENU
      </div>
      <div className="viewfinder-time">00:00:00</div>
      <div className="main-menu-scene" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="viewfinder-menu-stack">
        <img className="main-menu-logo" src="/assets/BeyondDeathLongTransparent.png" alt="Beyond Death" />
        <button type="button" onClick={play}>
          Play
        </button>
        <button type="button" onClick={() => setMenuPanel("settings")}>
          Settings
        </button>
        <button type="button" onClick={() => setMenuPanel("credits")}>
          Credits
        </button>
      </div>
    </div>
  );
}
