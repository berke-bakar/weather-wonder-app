import { useCoordinateStore } from '@/store/zustand'
import { a, useSpring } from '@react-spring/three'
import { Html } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'

function GlobeMarker({ children, position, scale, ...props }) {
  const markerRef = useRef()
  const [isVisible, setVisible] = useState(false)

  // const coordinates = useCoordinateStore((state) => state.coordinates)
  // useEffect(() => {
  //   if (coordinates.lat) {
  //     const lat = coordinates.lat
  //     const lng = coordinates.lng
  //     // Converting lattitude and longitude to radians
  //     const phi = ((90 - lat) * Math.PI) / 180
  //     const theta = ((90 - lng) * Math.PI) / 180
  //     // Converting polar coordinates to Cartesian
  //     const x = (globeRadius + 0.5) * Math.sin(phi) * Math.cos(theta)
  //     const y = (globeRadius + 0.5) * Math.cos(phi)
  //     const z = (globeRadius + 0.5) * Math.sin(phi) * Math.sin(theta)
  //     // Set selected location's marker position
  //     setPosition(new Vector3(x, y, z))
  //   }
  // }, [coordinates])

  return (
    <group ref={markerRef}>
      <Html
        position={position}
        transform
        center
        occlude={true}
        onOcclude={(hidden) => setVisible(!hidden)}
        scale={scale}
        {...props}
        style={{
          transition: 'all 0.2s',
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isVisible ? 1 : 0.25}) translateY(-8px)`,
        }}
      >
        {children}
      </Html>
    </group>
  )
}

export default GlobeMarker
