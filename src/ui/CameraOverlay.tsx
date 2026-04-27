import { Container as Div, Fullscreen, Text } from '@react-three/uikit'
import React, { useEffect, useState } from 'react'
import { useItems } from '../context/Items'
import { useConsole } from '../context/Console'
import type { lessThan } from 'three/src/nodes/TSL.js'

export default function CameraOverlay() {
  const [time, setTime] = React.useState<string>('[ Error ]')
  const [recordDotOpacity, setRecordDotOpacity] = React.useState<number>(0)
  const { currentHit } = useItems();
  const [hovered, setHovered] = useState(false);
  const {consoleLog} = useConsole();
  const offset = 50
    const size = 65
    const thickness = 6
    const color = 'white'

    let distance = 90
    const crosshairThickness = 4
    const crosshairSize = 36
    const squareLength = 31
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (currentHit.current && !hovered) {
        setHovered(true)
        consoleLog("hovered")
      }
      if (!currentHit.current && hovered) {
        setHovered(false)
        consoleLog("stop hovered")
      }

  },[currentHit, hovered])

  useEffect(() => {
    let frameId = 0
    const durationMs = 3200

    // distance = currentHit.current === null ? 70 : 90

    
    const animate = () => {
      const progress = (performance.now() % durationMs) / durationMs
      const opacity = (Math.sin(progress * Math.PI * 2 - Math.PI / 2) + 1) / 2
      setRecordDotOpacity(opacity)
      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [])

  

  return (
    <Fullscreen
      distanceToCamera={1}
      depthTest={false}
      pointerEvents="none"
      zIndex={99}
      {...{'*': { userSelect: 'none' }} as any} 
    >
      {/* top-left */}
      <Div
        positionType="absolute"
        width={size}
        height={thickness}
        backgroundColor={color}
        positionTop={offset}
        positionLeft={offset}
      />
      <Div
        positionType="absolute"
        width={thickness}
        height={size}
        backgroundColor={color}
        positionTop={offset}
        positionLeft={offset}
      />

      {/* top-right */}
      <Div
        positionType="absolute"
        width={size}
        height={thickness}
        backgroundColor={color}
        positionTop={offset}
        positionRight={offset}
      />
      <Div
        positionType="absolute"
        width={thickness}
        height={size}
        backgroundColor={color}
        positionTop={offset}
        positionRight={offset}
      />

      {/* bottom-right */}
      <Div
        positionType="absolute"
        width={size}
        height={thickness}
        backgroundColor={color}
        positionBottom={offset}
        positionRight={offset}
      />
      <Div
        positionType="absolute"
        width={thickness}
        height={size}
        backgroundColor={color}
        positionBottom={offset}
        positionRight={offset}
      />

      {/* bottom-left */}
      <Div
        positionType="absolute"
        width={size}
        height={thickness}
        backgroundColor={color}
        positionBottom={offset}
        positionLeft={offset}
      />
      <Div
        positionType="absolute"
        width={thickness}
        height={size}
        backgroundColor={color}
        positionBottom={offset}
        positionLeft={offset}
      />

      {/* CENTER AREA */}

        {/* crosshair */}
      <Div
        positionType="absolute"
        width={crosshairSize}
        height={crosshairThickness}
        backgroundColor={color}
        positionTop={'50%'}
        positionLeft={'50%'}
        transformTranslateX={'-50%'}
        transformTranslateY={'-50%'}
      />
      <Div
        positionType="absolute"
        width={crosshairThickness}
        height={crosshairSize}
        backgroundColor={color}
        positionTop={'50%'}
        positionLeft={'50%'}
        transformTranslateX={'-50%'}
        transformTranslateY={'-50%'}
      />

      {/* Center Square */}
      <Div positionType="absolute" width={hovered ? distance * 0.8 : distance} height={hovered ? distance * 0.8 : distance} positionTop={'50%'} positionLeft={'50%'} transformTranslateX={'-50%'} transformTranslateY={'-50%'}>
        <Div positionType="relative" width="100%" height="100%"> 
           {/* top-left */}
      <Div
        positionType="absolute"
        width={squareLength}
        height={crosshairThickness}
        backgroundColor={color}
        positionTop={0}
        positionLeft={0}
      />
      <Div
        positionType="absolute"
        width={crosshairThickness}
        height={squareLength}
        backgroundColor={color}
        positionTop={0}
        positionLeft={0}
      />

      {/* top-right */}
      <Div
        positionType="absolute"
        width={squareLength}
        height={crosshairThickness}
        backgroundColor={color}
        positionTop={0}
        positionRight={0}
      />
      <Div
        positionType="absolute"
        width={crosshairThickness}
        height={squareLength}
        backgroundColor={color}
        positionTop={0}
        positionRight={0}
      />

      {/* bottom-right */}
      <Div
        positionType="absolute"
        width={squareLength}
        height={crosshairThickness}
        backgroundColor={color}
        positionBottom={0}
        positionRight={0}
      />
      <Div
        positionType="absolute"
        width={crosshairThickness}
        height={squareLength}
        backgroundColor={color}
        positionBottom={0}
        positionRight={0}
      />

      {/* bottom-left */}
      <Div
        positionType="absolute"
        width={squareLength}
        height={crosshairThickness}
        backgroundColor={color}
        positionBottom={0}
        positionLeft={0}
      />
      <Div
        positionType="absolute"
        width={crosshairThickness}
        height={squareLength}
        backgroundColor={color}
        positionBottom={0}
        positionLeft={0}
      />
        </Div>

      </Div>
      {/* Decor */}
      <Div positionType={"absolute"} display={"flex"} flexDirection={"row"} alignItems={"center"} positionTop={offset + 20} positionLeft={offset + 20}  >
        <Div width={20} height={20} backgroundColor="red" borderRadius={10} opacity={recordDotOpacity} />
        <Text color="white" fontSize={18} marginLeft={5}>Rec</Text>
      </Div>

      <Div positionType={"absolute"} display={"flex"} flexDirection={"row"} alignItems={"center"} positionBottom={offset + 10} positionLeft={offset + 10}  >
        <Text color="white" fontSize={18} fontWeight={900} marginLeft={5}>{time}</Text>
      </Div>
    </Fullscreen>
  )
}