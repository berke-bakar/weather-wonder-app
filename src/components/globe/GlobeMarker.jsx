import { Html } from '@react-three/drei'
import { useState } from 'react'

function GlobeMarker({ children, position, scale = 3, ...props }) {
  const [isVisible, setVisible] = useState(false)

  return (
    <group position={position}>
      <Html
        center
        occlude={true}
        onOcclude={(hidden) => setVisible(!hidden)}
        zIndexRange={[900, 999]}
        {...props}
        style={{
          transition: 'all 0.4s',
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isVisible ? scale : 0.25}) translateY(-4px)`,
        }}
      >
        {children}
      </Html>
    </group>
  )
}

export default GlobeMarker
