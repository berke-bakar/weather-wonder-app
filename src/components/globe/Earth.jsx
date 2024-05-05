import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import GlobeMarker from './GlobeMarker'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Vector3, MathUtils, Euler } from 'three'
import { useDrag } from '@use-gesture/react'
import { a, useSpring } from '@react-spring/three'
import { useThree } from '@react-three/fiber'
import { useCoordinateStore } from '@/store/zustand'
import { latLngToCartesian, latLngToSpherical } from '@/helpers/utils'

export default function Earth(props) {
  const groupRef = useRef(null)
  const [globeRendered, setGlobeRendered] = useState(false)
  const [markerPosition, setMarkerPosition] = useState(new Vector3(0, 0, 0))
  const { size } = useThree()

  const euler = useMemo(() => new Euler(0, 0, 0, 'YXZ'), [])
  const [spring, api] = useSpring(() => ({
    rotation: [0, 0, 0],
  }))
  const bind = useDrag(({ delta: [dx, dy] }) => {
    // TODO: Add this as configurable option
    const responsiveness = 20
    euler.y += (dx / size.width) * responsiveness
    euler.x += (dy / size.width) * responsiveness
    euler.x = MathUtils.clamp(euler.x, -Math.PI / 2, Math.PI / 2)
    api.start({ rotation: euler.toArray().slice(0, 3) })
  })

  const coordinates = useCoordinateStore((state) => state.coordinates)
  useEffect(() => {
    if (coordinates.lat) {
      const cartesianCoords = latLngToCartesian(coordinates.lat, coordinates.lng, 100)
      setMarkerPosition(cartesianCoords)
      const [phi, theta] = latLngToSpherical(coordinates.lat, coordinates.lng)
      // Set globe to correct angle
      euler.set(Math.PI / 2 - phi, -(Math.PI / 2 - theta), 0, 'YXZ')
      //TODO: Zoom to globe
      api.start({ rotation: euler.toArray().slice(0, 3) })
    }
  }, [coordinates])

  useEffect(() => {
    if (!globeRendered) setGlobeRendered(true)
  }, [])

  const { nodes, materials } = useGLTF('/Earth.glb')
  return (
    <a.group ref={groupRef} {...props} dispose={null} position={new Vector3(0, 0, 0)} {...bind()} {...spring}>
      <mesh
        geometry={nodes.Cube001.geometry}
        material={materials['Default OBJ']}
        scale={0.2}
        rotation={[0, -Math.PI, 0]}
      />
      <GlobeMarker position={markerPosition} scale={15}>
        <FaMapMarkerAlt style={{ color: 'indianred' }} />
      </GlobeMarker>
    </a.group>
  )
}

useGLTF.preload('/Earth.glb')
