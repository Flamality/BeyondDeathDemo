import { Container as Div, Fullscreen, Text } from '@react-three/uikit'
import React, { useEffect, useState } from 'react'
import { useItems } from '../context/Items'

export default function CameraOverlay() {
  const [time, setTime] = React.useState<string>('[ Error ]')
  const [recordDotOpacity, setRecordDotOpacity] = React.useState<number>(0)
  const { currentHit } = useItems();
  const [hovered, setHovered] = useState(false);
  const offset = 50
    const size = 66
    const thickness = 5
    const color = 'white'

    let distance = 90
    const crosshairThickness = 3
    const crosshairSize = 34
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
      }
      if (!currentHit.current && hovered) {
        setHovered(false)
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
      <Div
        positionType="absolute"
        inset={0 as any}
        backgroundColor="rgba(0, 0, 0, 0.035)"
      />
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
      <Div positionType={"absolute"} display={"flex"} flexDirection={"row"} alignItems={"center"} positionTop={offset + 18} positionLeft={offset + 28}  >
        <Div width={14} height={14} backgroundColor="#ff1616" borderRadius={10} opacity={recordDotOpacity} />
        <Text color="white" fontSize={16} fontWeight={800} marginLeft={8}>REC</Text>
      </Div>

      <Div positionType={"absolute"} display={"flex"} flexDirection={"row"} alignItems={"center"} positionBottom={offset + 14} positionLeft={offset + 14}  >
        <Text color="white" fontSize={18} fontWeight={900} marginLeft={5}>{time}</Text>
      </Div>

      <Div positionType={"absolute"} display={"flex"} flexDirection={"row"} alignItems={"center"} positionBottom={offset + 14} positionRight={offset + 14}  >
        <Text color="white" fontSize={14} fontWeight={800}>BD-CAM</Text>
      </Div>
    </Fullscreen>
  )
}
