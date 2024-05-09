'use client'
import React, { Suspense, memo, useCallback, useEffect, useState } from 'react'
import { useWeatherStore } from '@/store/zustand'
import CurrentWeatherCard from './CurrentWeatherCard'
import DailyWeatherCard from './DailyWeatherCard'
import { useSpring, a } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

function Loading() {
  return (
    <div>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  )
}

export default function WeatherResults() {
  const placeName = useWeatherStore((state) => state.placeName)
  const [selectedTab, setSelectedTab] = useState(0)

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
  const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y, immediate: true }))

  function handleClick(evt) {
    setSelectedTab(Number(evt.target.id))
  }

  return (
    <a.div className='weather__container' {...bind()} style={{ x, y, display: placeName === '' ? 'none' : 'flex' }}>
      <h1 className='weather__city_name'>{placeName}</h1>
      <div className='weather__tab_container'>
        <div id={0} onClick={handleClick} className={`weather__tab ${selectedTab === 0 ? 'weather__tab-active' : ''}`}>
          Current
        </div>
        <div id={1} onClick={handleClick} className={`weather__tab ${selectedTab === 1 ? 'weather__tab-active' : ''}`}>
          Daily
        </div>
      </div>
      <div className='weather__data'>
        <CurrentWeatherCard style={{ display: `${selectedTab == 0 ? 'block' : 'none'}` }} />
        <DailyWeatherCard style={{ display: `${selectedTab == 1 ? 'flex' : 'none'}` }} />
      </div>
    </a.div>
  )
}
