import { useThree } from '@react-three/fiber';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import * as THREE from 'three';

import door_lock from '../sounds/door_lock.mp3';
import door_open from '../sounds/door_open.mp3';
import door_locked from '../sounds/door_locked.mp3';
import win from '../sounds/win.mp3';
import { useSettings } from './Settings';

interface AudioContextType {
  loadSound: (id: string, url: string) => Promise<void>;
  playSound: (id: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const listener = useRef(null as THREE.AudioListener | null);
  const sounds = useRef(new Map<string, THREE.Audio>());
  const { camera } = useThree();
  const { volume } = useSettings();

  useEffect(() => {
    const listnr = new THREE.AudioListener();
    listener.current = listnr;
    camera.add(listnr);

    void Promise.all([
      loadSound('door_lock', door_lock),
      loadSound('door_open', door_open),
      loadSound('door_locked', door_locked),
      loadSound('win', win),
    ]).catch((err) => {
      console.error('Failed to load audio:', err);
    });

    return () => {
      camera.remove(listnr);
    };
  }, [camera]);

  const loadSound = async (id: string, url: string): Promise<void> => {
    if (!listener.current) return;

    return new Promise((resolve, reject) => {
      const audioLoader = new THREE.AudioLoader();
      const sound = new THREE.Audio(listener.current!);

      audioLoader.load(
        url,
        (buffer) => {
          sound.setBuffer(buffer);
          sound.setLoop(false);
          sound.setVolume(volume);
          sounds.current.set(id, sound);
          resolve();
        },
        undefined,
        reject,
      );
    });
  };

  const playSound = (id: string) => {
    const sound = sounds.current.get(id);
    sound?.setVolume(volume);
    if (sound?.isPlaying) {
      sound.stop();
    }
    if (sound) {
      sound.play();
    }
  };

  const value: AudioContextType = {
    loadSound,
    playSound,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
