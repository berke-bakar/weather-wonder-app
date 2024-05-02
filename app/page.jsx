'use client'

import { Html } from '@react-three/drei'
import { useControls } from 'leva'
import dynamic from 'next/dynamic'
import { Perf } from 'r3f-perf'
import { Suspense, forwardRef, useEffect, useRef } from 'react'
import globeImage from 'public/img/earth-blue-marble.jpg'
import globeBumpImage from 'public/img/earth-topology.png'

const Globe = dynamic(() => import('@/components/globe/Globe').then((mod) => mod.default), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const viewRef = useRef()

  const { perfVisible } = useControls('debug', {
    perfVisible: false,
  })

  useEffect(() => {
    console.log('usefect', viewRef.current)
  }, [])

  return (
    <>
      <View orbit className='relative h-full sm:w-full' innerRef={viewRef}>
        {perfVisible && <Perf position='top-left' />}
        <Html
          position={[0, 150, 0]}
          transform
          center
          wrapperClass='page__title'
          className='text-5xl lg:text-6xl xl:text-8xl'
          as='h1'
          distanceFactor={100}
        >
          What is the weather at ...?
        </Html>
        <Suspense fallback={null}>
          <Common color={'#000011'} />
          <Globe
            globeImageUrl={globeImage.src}
            bumpImageUrl={globeBumpImage.src}
            showGraticules={true}
            responsiveness={20}
          />
        </Suspense>
      </View>
    </>
  )
}
