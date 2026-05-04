import React from "react";
import { usePlayerData } from "../context/PlayerData";

function renderInteractionMessage(message: string) {
  return message.split(/(~[^~]+~)/g).map((part, index) => {
    const isVariable = part.startsWith("~") && part.endsWith("~");

    if (!isVariable) {
      return part;
    }

    return (
      <span key={`${part}-${index}`} className="interaction-variable">
        {part.slice(1, -1)}
      </span>
    );
  });
}

export default function InteractionOverlay() {
  const { interactionLog } = usePlayerData();
  const [now, setNow] = React.useState(Date.now());
  const visibleEntries = interactionLog.filter(
    (entry) => entry.timestamp > now - 4000,
  );

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className='interaction-log' aria-live='polite'>
      {visibleEntries.slice(-2).map((entry) => (
        <div
          key={`${entry.timestamp}-${entry.message}`}
          className='interaction-entry'
        >
          {renderInteractionMessage(entry.message)}
        </div>
      ))}
    </div>
  );
}
