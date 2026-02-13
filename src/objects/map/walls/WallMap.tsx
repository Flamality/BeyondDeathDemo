import React from 'react'
import Wall from './Wall'

export default function WallMap() {
  return (
    <>
    <Wall position={[10, 0, 0]} width={20} />
    <Wall position={[10, 0, 0]} length={20} />
    </>
  )
}
