import React, { useEffect } from 'react'
import { usePlayerData } from '../../context/PlayerData'

import styles from './Menu.module.css';

export default function Menu() {
    const {paused, setPaused, store} = usePlayerData();

    useEffect(() => {
      setPaused(true);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'p') {
          setPaused(!paused);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    },[])
    const toggleVR = () => {
      if (store.isPresenting) {
        store.exitVR();
      } else {
        store.enterVR();
      }
    }
  return (
    <div className={`${paused ? styles.paused : styles.active} ${styles.menu}`}>
        <p>Beyond Death <span>DEMO</span></p>
        {/* <button onClick={toggleVR}>{store.isPresenting ? "Exit VR" : "Turn on VR"}</button> */}
        <button onClick={() => {setPaused(false)}}>Resume</button>
    </div>
  )
}
