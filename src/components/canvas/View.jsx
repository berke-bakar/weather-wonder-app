'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useEnvironment,
  useHelper,
  View as ViewImpl,
} from '@react-three/drei'
import { Three } from '@/helpers/components/Three'
import { PointLightHelper } from 'three'
import { useControls } from 'leva'
import envMapImage from 'public/img/night-sky.jpg'

export const Common = ({ color }) => {
  const refLight = useRef()
  useHelper(refLight, PointLightHelper, 0.5, 'red')

  const { intensity } = useControls('Lighting', {
    intensity: { value: 8.5, step: 0.1 },
  })

  const envMap = useEnvironment({ files: envMapImage.src })

  return (
    <Suspense fallback={null}>
      <Environment background map={envMap} />
      <ambientLight intensity={intensity} />
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 500]} />
    </Suspense>
  )
}

const View = forwardRef(({ children, orbit, innerRef, ...props }, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(
    ref,
    () => {
      return localRef.current
    },
    [],
  )

  return (
    <>
      <div ref={innerRef} {...props} />
      <Three>
        <ViewImpl track={innerRef}>
          {children}
          {orbit && (
            <OrbitControls
              makeDefault
              enablePan={false}
              enableRotate={false}
              target={[0, 0, 0]}
              enableZoom={true}
              zoomSpeed={2}
              dampingFactor={1}
            />
          )}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
