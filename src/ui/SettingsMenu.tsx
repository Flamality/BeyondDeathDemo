import { useState } from 'react';
import { usePlayerData } from '../context/PlayerData';
import {
  useSettings,
  type KeybindAction,
  type QualityLevel,
} from '../context/Settings';

const actionLabels: Record<KeybindAction, string> = {
  forward: 'Move Forward',
  backward: 'Move Backward',
  left: 'Move Left',
  right: 'Move Right',
  jump: 'Jump',
  crouch: 'Crouch',
  sprint: 'Sprint',
  photo: 'Take Photo',
};

const qualityOptions: QualityLevel[] = ['low', 'medium', 'high'];

function keyName(code: string) {
  return code
    .replace('Key', '')
    .replace('Digit', '')
    .replace('ControlLeft', 'Left Ctrl')
    .replace('ShiftLeft', 'Left Shift');
}

export default function SettingsMenu() {
  const { menuPanel, setMenuPanel } = usePlayerData();
  const {
    quality,
    setQuality,
    mouseSensitivity,
    setMouseSensitivity,
    keybinds,
    setKeybind,
    resetSettings,
    volume,
    setVolume,
  } = useSettings();
  const [listeningFor, setListeningFor] = useState<KeybindAction | null>(null);

  if (menuPanel !== 'settings') return null;

  const captureKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!listeningFor) return;
    e.preventDefault();
    e.stopPropagation();
    setKeybind(listeningFor, e.code);
    setListeningFor(null);
  };

  return (
    <div
      className="menu-panel viewfinder-menu"
      tabIndex={-1}
      onKeyDown={captureKey}
    >
      <div className="viewfinder-corner top-left" />
      <div className="viewfinder-corner top-right" />
      <div className="viewfinder-corner bottom-left" />
      <div className="viewfinder-corner bottom-right" />
      <div className="viewfinder-rec">
        <span />
        SET
      </div>
      <div className="viewfinder-time">CONFIG</div>
      <section className="menu-panel-content">
        <header>
          <h2>Settings</h2>
          <button type="button" onClick={() => setMenuPanel(null)}>
            Back
          </button>
        </header>

        <div className="settings-row">
          <span>Quality</span>
          <div className="segmented-control">
            {qualityOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={quality === option ? 'active' : ''}
                onClick={() => setQuality(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <label className="settings-row">
          <span>Mouse Sensitivity</span>
          <input
            type="range"
            min="0.001"
            max="0.006"
            step="0.0005"
            value={mouseSensitivity}
            onChange={(e) => setMouseSensitivity(Number(e.target.value))}
          />
        </label>
        <label className="settings-row">
          <span>Volume</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </label>

        <div className="settings-keybinds">
          {Object.entries(actionLabels).map(([action, label]) => (
            <button
              key={action}
              type="button"
              className={listeningFor === action ? 'listening' : ''}
              onClick={() => setListeningFor(action as KeybindAction)}
            >
              <span>{label}</span>
              <strong>
                {listeningFor === action
                  ? 'Press key...'
                  : keyName(keybinds[action as KeybindAction])}
              </strong>
            </button>
          ))}
        </div>

        <button
          className="secondary-action"
          type="button"
          onClick={resetSettings}
        >
          Reset Defaults
        </button>
      </section>
    </div>
  );
}
