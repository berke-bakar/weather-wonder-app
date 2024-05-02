import { a, useSpring } from '@react-spring/three'
import { Html } from '@react-three/drei'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ThreeGlobe from 'three-globe'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Vector3, Euler, MathUtils } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useDrag, useWheel } from '@use-gesture/react'

function GlobeModel({ responsiveness, ...props }) {
  const globeRef = useRef(null)
  const { size, camera, controls } = useThree()
  const euler = useMemo(() => new Euler(), [])
  const [spring, setSpring] = useSpring(() => ({
    rotation: [0, 0, 0],
  }))
  const bindDrag = useDrag(
    ({ delta: [dx, dy] }) => {
      euler.y += (dx / size.width) * responsiveness
      euler.x += (dy / size.width) * responsiveness
      euler.x = MathUtils.clamp(euler.x, -Math.PI / 4, Math.PI / 4)
      setSpring({ rotation: euler.toArray().slice(0, 3) })
    },
    { axis: 'x' | 'y' },
  )

  const bindWheel = useWheel(() => {})

  const [markerPosition, setMarkerPosition] = useState(null)
  // const markerSvg = `<svg viewBox=\"-4 0 36 36\">
  //     <path fill=\"currentColor\" d=\"M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z\"></path>
  //     <circle fill=\"black\" cx=\"14\" cy=\"14\" r=\"7\"></circle>
  //   </svg>`

  const handleClick = useCallback((event) => {
    let clickable = true

    return () => {
      setTimeout(() => {
        clickable = true
      }, 800)

      if (clickable) {
        // Process click
      }
      clickable = false
    }
  }, [])
  const myGlobe = new ThreeGlobe()
  for (const key in props) {
    if (key in myGlobe) {
      myGlobe[key](props[key])
    }
  }

  const myPrimitive = useMemo(() => {
    return <primitive object={myGlobe} />
  }, [])

  return (
    <>
      <a.group ref={globeRef} {...bindDrag()} {...spring} onClick={handleClick}>
        {myPrimitive}
        {markerPosition && (
          <Marker position={markerPosition}>
            <FaMapMarkerAlt style={{ color: 'indianred' }} />
          </Marker>
        )}
      </a.group>
    </>
  )
}

function Marker({ children, ...props }) {
  const ref = useRef()
  // This holds the local occluded state
  const [isOccluded, setOccluded] = useState()
  const [isInRange, setInRange] = useState()
  const isVisible = isInRange && !isOccluded
  // Test distance
  const vec = new Vector3()
  useFrame((state) => {
    const range = state.camera.position.distanceTo(ref.current.getWorldPosition(vec)) <= 1000
    if (range !== isInRange) setInRange(range)
  })
  return (
    <a.group ref={ref}>
      <Html
        // 3D-transform contents
        transform
        // Hide contents "behind" other meshes
        occlude
        // Tells us when contents are occluded (or not)
        onOcclude={setOccluded}
        // We just interpolate the visible state into css opacity and transforms
        style={{ transition: 'all 0.2s', opacity: 1, transform: `scale(10) translateY(-8px)` }}
        {...props}
      >
        {children}
      </Html>
    </a.group>
  )
}

export default GlobeModel
