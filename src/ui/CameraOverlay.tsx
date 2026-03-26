import { Container as Div, Fullscreen, Text } from '@react-three/uikit'
import React, { useEffect } from 'react'

export default function CameraOverlay() {
  const [time, setTime] = React.useState<string>('[ Error ]')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const offset = 50
  const size = 65
  const thickness = 6
  const color = 'white'

  const distance = 90
  const crosshairThickness = 4
  const crosshairSize = distance * 0.4
  const squareLength = distance * 0.35

  return (
    <Fullscreen
      distanceToCamera={10}
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
      <Div positionType="absolute" width={distance} height={distance} positionTop={'50%'} positionLeft={'50%'} transformTranslateX={'-50%'} transformTranslateY={'-50%'}>
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
        <Div width={20} height={20} backgroundColor="red" borderRadius={10} />
        <Text color="white" fontSize={18} marginLeft={5}>Rec</Text>
      </Div>

      <Div positionType={"absolute"} display={"flex"} flexDirection={"row"} alignItems={"center"} positionBottom={offset + 10} positionLeft={offset + 10}  >
        <Text color="white" fontSize={18} fontWeight={900} marginLeft={5}>{time}</Text>
      </Div>
    </Fullscreen>
  )
}