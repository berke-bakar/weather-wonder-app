import { a, useSpring } from '@react-spring/three'
import { Html } from '@react-three/drei'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ThreeGlobe from 'three-globe'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Vector3, Euler, MathUtils, Quaternion, Matrix3 } from 'three'
import { events, useFrame, useThree } from '@react-three/fiber'
import { useDrag, useWheel } from '@use-gesture/react'

function GlobeModel({ responsiveness, ...props }) {
  const globeRef = useRef(null)
  const myGlobe = useMemo(() => new ThreeGlobe(), [])
  const { size } = useThree()
  const euler = useMemo(() => new Euler(), [])
  const [springs, api] = useSpring(() => ({
    rotation: [0, 0, 0],
  }))
  const bindDrag = useDrag(
    ({ delta: [dx, dy] }) => {
      euler.y += (dx / size.width) * responsiveness
      euler.x += (dy / size.width) * responsiveness
      euler.x = MathUtils.clamp(euler.x, -75 * MathUtils.DEG2RAD, 75 * MathUtils.DEG2RAD)
      api.start({ rotation: euler.toArray().slice(0, 3) })
    },
    { axis: 'x' | 'y', threshold: 0.5 },
  )

  // const bindWheel = useWheel(() => {})

  const [markerPosition, setMarkerPosition] = useState(null)
  // const markerSvg = `<svg viewBox=\"-4 0 36 36\">
  //     <path fill=\"currentColor\" d=\"M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z\"></path>
  //     <circle fill=\"black\" cx=\"14\" cy=\"14\" r=\"7\"></circle>
  //   </svg>`
  let clickable = true
  const handleDoubleClick = useCallback((event) => {
    setTimeout(() => {
      clickable = true
    }, 800)

    if (clickable) {
      // Process click
      const { x, y, z } = event.point
      const radius = Math.sqrt(x ** 2 + y ** 2 + z ** 2)
      // console.log('radius', radius)
      const azimuth = Math.atan2(x, z)
      const polar = Math.acos(y / radius)

      euler.set(-globeRef.current.rotation.x, -globeRef.current.rotation.y, 0, 'YXZ')
      const reversedRotation = { x: -globeRef.current.rotation.x, y: -globeRef.current.rotation.y }
      const pointWithoutRotation = event.point.clone().applyEuler(euler)

      const reversedCoordinates = myGlobe.toGeoCoords(pointWithoutRotation)

      const targetRotation = new Euler().setFromVector3(globeRef.current.rotation, 'YXZ')
      targetRotation.y -= azimuth
      targetRotation.x += Math.PI / 2 - polar
      // targetRotation.y -= globeRef.current.rotation.y
      // targetRotation.x -= globeRef.current.rotation.x
      api.start({ rotation: targetRotation.toArray().slice(0, 3) })
    }
    clickable = false
  }, [])

  useEffect(() => {
    for (const key in props) {
      if (key in myGlobe) {
        myGlobe[key](props[key])
      }
    }
  }, [])

  return (
    <>
      <group {...bindDrag()}>
        <a.primitive
          position={[0, 0, 0]}
          ref={globeRef}
          object={myGlobe}
          {...springs}
          onDoubleClick={handleDoubleClick}
        />
        {markerPosition && (
          <Marker position={markerPosition}>
            <FaMapMarkerAlt style={{ color: 'indianred' }} />
          </Marker>
        )}
        <axesHelper args={[120, 120, 150]} />
      </group>
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
        style={{ transition: 'all 0.2s', opacity: 1, transform: `scale(20) translateY(-8px)` }}
        {...props}
      >
        {children}
      </Html>
    </a.group>
  )
}

export default GlobeModel
