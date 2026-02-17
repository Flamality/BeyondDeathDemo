import { RigidBody } from '@react-three/rapier'
import React from 'react'

export default function Wall({position, width = 0.05, length = 0.05, floor = 1}: {position: [number, number, number], width?: number, length?: number, floor?: number}) {
  return (
    <>
    <RigidBody type='fixed'>
    <mesh position={[position[0], position[1] + ((floor - 1) * 10), position[2]]} castShadow receiveShadow>
        <boxGeometry args={[width, 10, length]} />
        <meshStandardMaterial color={'#888888'} />
    </mesh>
    </RigidBody>
    </>
  )
}
