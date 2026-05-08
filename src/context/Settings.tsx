import React, { createContext, useContext, type ReactNode } from 'react';

export type QualityLevel = 'low' | 'medium' | 'high';

export type KeybindAction =
  | 'forward'
  | 'backward'
  | 'left'
  | 'right'
  | 'jump'
  | 'crouch'
  | 'sprint'
  | 'photo';

export type KeybindSettings = Record<KeybindAction, string>;

type SettingsContextType = {
  quality: QualityLevel;
  setQuality: (quality: QualityLevel) => void;
  mouseSensitivity: number;
  setMouseSensitivity: (sensitivity: number) => void;
  keybinds: KeybindSettings;
  volume: number;
  setVolume: (volume: number) => void;
  setKeybind: (action: KeybindAction, code: string) => void;
  resetSettings: () => void;
};

const defaultKeybinds: KeybindSettings = {
  forward: 'KeyW',
  backward: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
  jump: 'Space',
  crouch: 'ControlLeft',
  sprint: 'ShiftLeft',
  photo: 'KeyE',
};

const defaultSettings = {
  quality: 'medium' as QualityLevel,
  mouseSensitivity: 0.0025,
  keybinds: defaultKeybinds,
  volume: 0.5,
};

const storageKey = 'beyond-death-settings';
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = React.useState(defaultSettings);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  const setQuality = React.useCallback((quality: QualityLevel) => {
    setSettings((prev) => ({ ...prev, quality }));
  }, []);

  const setMouseSensitivity = React.useCallback((mouseSensitivity: number) => {
    setSettings((prev) => ({ ...prev, mouseSensitivity }));
  }, []);

  const setKeybind = React.useCallback(
    (action: KeybindAction, code: string) => {
      setSettings((prev) => ({
        ...prev,
        keybinds: { ...prev.keybinds, [action]: code },
      }));
    },
    [],
  );

  const setVolume = React.useCallback((volume: number) => {
    setSettings((prev) => ({ ...prev, volume }));
  }, []);
  const resetSettings = React.useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        quality: settings.quality,
        setQuality,
        mouseSensitivity: settings.mouseSensitivity,
        setMouseSensitivity,
        keybinds: settings.keybinds,
        setKeybind,
        resetSettings,
        volume: settings.volume,
        setVolume,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
