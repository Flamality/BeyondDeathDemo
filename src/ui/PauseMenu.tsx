import { useEffect } from 'react';
import { usePlayerData } from '../context/PlayerData';

export default function PauseMenu() {
  const { paused, setPaused, setInMenu, setMenuPanel, menuPanel } =
    usePlayerData();

  useEffect(() => {
    if (paused && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [paused]);

  if (!paused || menuPanel) return null;

  return (
    <div className="pause-menu viewfinder-menu">
      <div className="viewfinder-corner top-left" />
      <div className="viewfinder-corner top-right" />
      <div className="viewfinder-corner bottom-left" />
      <div className="viewfinder-corner bottom-right" />
      <div className="viewfinder-rec">
        <span />
        PAUSE
      </div>
      <div className="viewfinder-menu-stack">
        <h1>PAUSED</h1>
        <button type="button" onClick={() => setPaused(false)}>
          Resume
        </button>
        <button type="button" onClick={() => setMenuPanel('settings')}>
          Settings
        </button>
        <button
          type="button"
          onClick={() => {
            setPaused(false);
            setMenuPanel(null);
            setInMenu(true);
          }}
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}
