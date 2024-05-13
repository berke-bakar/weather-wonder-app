import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import GlobeMarker from './GlobeMarker'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Vector3, MathUtils, Euler } from 'three'
import { useDrag } from '@use-gesture/react'
import { a, useSpring } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import { useWeatherStore } from '@/store/zustand'
import { latLngToCartesian, latLngToSpherical } from '@/helpers/utils'
import { damp } from 'maath/easing'

export default function Earth(props) {
  const groupRef = useRef(null)
  const [globeRendered, setGlobeRendered] = useState(false)
  const [markerPosition, setMarkerPosition] = useState(new Vector3(0, 0, 0))
  const [playZoomAnimation, setPlayZoomAnimation] = useState(false)
  const { size } = useThree()

  const euler = useMemo(() => new Euler(0, 0, 0, 'YXZ'), [])
  const [globeSpring, globeApi] = useSpring(() => ({
    rotation: [0, 0, 0],
  }))
  const bind = useDrag(({ delta: [dx, dy] }) => {
    // TODO: Add this as configurable option
    const responsiveness = 20
    euler.y += (dx / size.width) * responsiveness
    euler.x += (dy / size.width) * responsiveness
    euler.x = MathUtils.clamp(euler.x, -Math.PI / 2, Math.PI / 2)
    globeApi.start({ rotation: euler.toArray().slice(0, 3) })
  })

  const coordinates = useWeatherStore((state) => state.coordinates)
  useEffect(() => {
    if (coordinates.lat) {
      const cartesianCoords = latLngToCartesian(coordinates.lat, coordinates.lng, 100)
      setMarkerPosition(markerPosition.clone().set(...cartesianCoords))
      const [phi, theta] = latLngToSpherical(coordinates.lat, coordinates.lng)
      // Set globe to correct angle
      euler.set(Math.PI / 2 - phi, -(Math.PI / 2 - theta), 0, 'YXZ')
      globeApi.start({ rotation: euler.toArray().slice(0, 3) })
      setPlayZoomAnimation(true)
    }
  }, [coordinates])

  useFrame(({ camera, controls }, delta) => {
    if (playZoomAnimation) {
      if (damp(camera.position, 'z', 220, 0.25, delta)) {
        controls.enabled = false
      } else {
        controls.enabled = true
        setPlayZoomAnimation(false)
      }
    }
  })

  useEffect(() => {
    if (!globeRendered) setGlobeRendered(true)
  }, [])

  const { nodes, materials } = useGLTF('/Earth.glb')
  return (
    <a.group ref={groupRef} {...props} dispose={null} position={new Vector3(0, 0, 0)} {...bind()} {...globeSpring}>
      <mesh
        geometry={nodes.Cube001.geometry}
        material={materials['Default OBJ']}
        scale={0.2}
        rotation={[0, -Math.PI, 0]}
      />
      <GlobeMarker position={markerPosition} scale={3}>
        <FaMapMarkerAlt style={{ color: 'indianred' }} className='marker' />
      </GlobeMarker>
    </a.group>
  )
}

useGLTF.preload('/Earth.glb')
