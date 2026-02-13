import React, { useEffect } from 'react'
import { usePlayerData } from '../../context/PlayerData'

export default function Debug() {
    const {pos, rot} = usePlayerData();
    const [displayPos, setDisplayPos] = React.useState(pos);
    const [displayRot, setDisplayRot] = React.useState(rot);

    useEffect(() => {
      const formatNumber = (num: number) => Math.round(num * 100) / 100;
      setDisplayPos([
      parseFloat(formatNumber(pos[0]).toFixed(2)),
      parseFloat(formatNumber(pos[1]).toFixed(2)),
      parseFloat(formatNumber(pos[2]).toFixed(2))
      ]);
      setDisplayRot([
      parseFloat(formatNumber(rot[0]).toFixed(2)),
      parseFloat(formatNumber(rot[1]).toFixed(2)),
      parseFloat(formatNumber(rot[2]).toFixed(2))
      ]);
    }, [pos, rot]);
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px', zIndex:10 }}>
      {displayPos.join(', ')}
      { " | " } 
    {displayRot.join(', ')}
    </div>
  )
}
