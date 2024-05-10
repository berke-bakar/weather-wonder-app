import { Html } from '@react-three/drei'
import { useRef, useState } from 'react'

function GlobeMarker({ children, position, scale, ...props }) {
  const markerRef = useRef()
  const [isVisible, setVisible] = useState(false)

  return (
    <group ref={markerRef}>
      <Html
        position={position}
        transform
        center
        occlude={true}
        onOcclude={(hidden) => setVisible(!hidden)}
        scale={scale}
        zIndexRange={[900, 999]}
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
