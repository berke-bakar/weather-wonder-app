import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import GlobeMarker from './GlobeMarker'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Vector3, MathUtils, Euler } from 'three'
import { useDrag } from '@use-gesture/react'
import { a, useSpring } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import { useCoordinateStore } from '@/store/zustand'
import { latLngToCartesian, latLngToSpherical } from '@/helpers/utils'

export default function Earth(props) {
  const groupRef = useRef(null)
  const [globeRendered, setGlobeRendered] = useState(false)
  const [markerPosition, setMarkerPosition] = useState(new Vector3(0, 0, 0))
  const [playZoomAnimation, setPlayZoomAnimation] = useState(false)
  const { size } = useThree()

  const cameraStartPos = new Vector3()
  let zoomAnimationPercentage = 0

  const euler = useMemo(() => new Euler(0, 0, 0, 'YXZ'), [])
  const cameraTarget = useMemo(() => new Vector3(0, 0, 160), [])
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

  const coordinates = useCoordinateStore((state) => state.coordinates)
  useEffect(() => {
    if (coordinates.lat) {
      const cartesianCoords = latLngToCartesian(coordinates.lat, coordinates.lng, 100)
      setMarkerPosition(cartesianCoords)
      const [phi, theta] = latLngToSpherical(coordinates.lat, coordinates.lng)
      // Set globe to correct angle
      euler.set(Math.PI / 2 - phi, -(Math.PI / 2 - theta), 0, 'YXZ')
      globeApi.start({ rotation: euler.toArray().slice(0, 3) })
      setPlayZoomAnimation(true)
    }
  }, [coordinates])

  useFrame(({ camera, controls }, delta) => {
    if (playZoomAnimation) {
      // Zooming start, save the original position for correct lerping
      if (zoomAnimationPercentage === 0) {
        cameraStartPos.copy(camera.position)
        controls.enabled = false
      }
      // While target is not reached
      if (zoomAnimationPercentage < 1) {
        zoomAnimationPercentage += 0.05
        camera.position.z = MathUtils.lerp(cameraStartPos.z, cameraTarget.z, 1, zoomAnimationPercentage)
        // console.log(MathUtils.damp(cameraStartPos.z, cameraTarget.z, 1, delta))
      } else {
        // Target reached
        zoomAnimationPercentage = 0
        controls.enabled = true
        setPlayZoomAnimation(false)
      }
    }
    // console.log(MathUtils.damp(cameraStartPos.z, cameraTarget.z, 0.1, delta))
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
      <GlobeMarker position={markerPosition} scale={15}>
        <FaMapMarkerAlt style={{ color: 'indianred' }} />
      </GlobeMarker>
    </a.group>
  )
}

useGLTF.preload('/Earth.glb')
