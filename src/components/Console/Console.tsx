import { useEffect, useState } from "react";
import { useConsole } from "../../context/Console";

import styles from './Console.module.css';
import { useItems } from "../../context/Items";
import { usePlayerData } from "../../context/PlayerData";

export default function Console() {
    const { console, consoleLog } = useConsole();
    const { pos, rot} = usePlayerData();
    const { addItemToMap } = useItems();
    const [input, setInput] = useState("");
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        consoleLog("Console initialized");

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 't') {
                setShowInput(true);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

  return (
    <div className={styles.console}>
      
    {showInput && <input
        type="text"
        value={input}
        autoFocus
        onChange={(e) => setInput(e.target.value)}
        onBlur={() => {setShowInput(false)}}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                consoleLog(`> ${input}`);
                const [command, ...args] = input.split(' ');
                if (command === 'additem' && args.length > 0) {
                    addItemToMap(args[0], pos.current, rot.current);
                } else {
                    consoleLog(`Unknown command: ${command}`);
                }
                setInput("");
                setShowInput(false);
            }
        }}
    />}
     {console.map((msg, index) => <div key={index}>{msg}</div>)}
    </div>
  )
}
