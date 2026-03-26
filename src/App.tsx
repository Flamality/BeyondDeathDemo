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

function App() {
  return (
    <>
      <ConsoleProvider>
        <PlayerDataProvider>
          <KeybindsProvider>
            <ItemsProvider>
              <InventoryProvider>
                {/* <Debug /> */}
                <Console />
                <Engine />
              </InventoryProvider>
            </ItemsProvider>
            </KeybindsProvider>
          </PlayerDataProvider>
        </ConsoleProvider>
    </>
  );
}

export default App;
