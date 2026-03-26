import { RigidBody } from '@react-three/rapier'
import React from 'react'
import { texture_plaster } from '../../../materials/Textures'

export default function Wall({position, width = 0.4, length = 0.4, floor = 1}: {position: [number, number, number], width?: number, length?: number, floor?: number}) {
  return (
    <>
    <RigidBody type='fixed'>
    <mesh   position={[position[0], (position[1] + ((floor - 1) * 10) + 2.5), position[2]]} castShadow receiveShadow material={texture_plaster}>
        <boxGeometry args={[width, 5, length]} />
    </mesh>
    </RigidBody>
    </>
  )
}
