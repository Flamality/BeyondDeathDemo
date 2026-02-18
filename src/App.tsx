import React from "react";
import "./App.css";
import Engine from "./engine/Engine";
import { ConsoleProvider } from "./context/Console";
import Console from "./components/Console/Console";
import Inventory from "./components/Inventory/Inventory";
import { InventoryProvider } from "./context/Inventory";
import Pointer from "./components/Pointer/Pointer";
import { ItemsProvider } from "./context/Items";
import { PlayerDataProvider } from "./context/PlayerData";
import Debug from "./components/Debug/Debug";
import Menu from "./components/Menu/Menu";
import { KeybindsProvider } from "./context/Keybinds";

function App() {
  return (
    <>
      <KeybindsProvider>
        <ConsoleProvider>
          <PlayerDataProvider>
            <ItemsProvider>
              <InventoryProvider>
                {/* <Menu /> */}
                <Debug />
                <Console />
                {/* <Inventory /> */}
                <Pointer />
                <Engine />
              </InventoryProvider>
            </ItemsProvider>
          </PlayerDataProvider>
        </ConsoleProvider>
      </KeybindsProvider>
    </>
  );
}

export default App;
