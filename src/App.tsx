import React from "react";
import "./App.css";
import Engine from "./engine/Engine";
import { ConsoleProvider } from "./context/Console";
import Console from "./components/Console/Console";
import { InventoryProvider } from "./context/Inventory";
import { ItemsProvider } from "./context/Items";
import { PlayerDataProvider } from "./context/PlayerData";
import Debug from "./components/Debug/Debug";
import { KeybindsProvider } from "./context/Keybinds";
import PhotoHud from "./ui/PhotoHud";
import { MapEditorProvider } from "./context/MapEditor";
import PauseMenu from "./ui/PauseMenu";
import MainMenu from "./ui/MainMenu";
import SafeKeypad from "./ui/SafeKeypad";
import { usePlayerData } from "./context/PlayerData";
import { SettingsProvider } from "./context/Settings";
import SettingsMenu from "./ui/SettingsMenu";
import CreditsMenu from "./ui/CreditsMenu";
import LoadingScreen from "./ui/LoadingScreen";
import InteractionOverlay from "./ui/InteractionOverlay";
import EndingOverlay from "./ui/EndingOverlay";

function AppShell() {
  const { inMenu, gameSessionId, introActive } = usePlayerData();
  const [loading, setLoading] = React.useState(false);
  const loadingStartedAt = React.useRef(0);

  React.useEffect(() => {
    if (!inMenu) {
      loadingStartedAt.current = performance.now();
      setLoading(true);
    }
  }, [gameSessionId, inMenu]);

  const handleEngineReady = React.useCallback(() => {
    const elapsed = performance.now() - loadingStartedAt.current;
    window.setTimeout(() => setLoading(false), Math.max(0, 850 - elapsed));
  }, []);

  return (
    <>
      <Debug />
      <Console />
      {!inMenu && <Engine key={gameSessionId} onReady={handleEngineReady} />}
      {loading && <LoadingScreen />}
      <MainMenu />
      <PauseMenu />
      <SettingsMenu />
      <CreditsMenu />
      <SafeKeypad />
      <EndingOverlay />
      {!loading && introActive && <div key={gameSessionId} className="intro-fade" />}
      {!inMenu && !introActive && (
        <div className="gameplay-ui-fade">
          <PhotoHud />
          <InteractionOverlay />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <>
      <ConsoleProvider>
        <PlayerDataProvider>
          <KeybindsProvider>
            <SettingsProvider>
              <ItemsProvider>
                <InventoryProvider>
                  <MapEditorProvider>
                    <AppShell />
                  </MapEditorProvider>
                </InventoryProvider>
              </ItemsProvider>
            </SettingsProvider>
            </KeybindsProvider>
          </PlayerDataProvider>
        </ConsoleProvider>
    </>
  );
}

export default App;
