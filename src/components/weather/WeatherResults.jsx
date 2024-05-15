'use client'
import React, { useEffect, useState } from 'react'
import { useWeatherStore } from '@/store/zustand'
import CurrentWeatherCard from './CurrentWeatherCard'
import DailyWeatherCard from './DailyWeatherCard'
import { useSpring, a } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import FavoriteStar from '../star/FavoriteStar'

const LOCAL_STORAGE_KEY = 'favoritePlaces'

export default function WeatherResults() {
  const placeInfo = useWeatherStore((state) => state.placeInfo)
  const [selectedTab, setSelectedTab] = useState(0)
  const [isFavAnimPlaying, setIsFavAnimPlaying] = useState(false)
  const [favoritePlaces, setFavoritePlaces] = useState([])

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
  const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y, immediate: true }))
  const starColor =
    placeInfo !== null ? (favoritePlaces?.find((val) => val.id === placeInfo.id) ? 'yellow' : 'lightgray') : 'lightgray'

  function handleClick(evt) {
    setSelectedTab(Number(evt.target.id))
  }

  function handleFavoritePlaceClick(evt) {
    if (placeInfo !== null) {
      const resultArr = [...favoritePlaces]
      let index = resultArr.findIndex((value) => {
        return value.id === placeInfo.id
      })
      // Remove from favorite places if it exists
      if (index !== -1) {
        resultArr.splice(index, 1)
      }
      // Add to favorite places if it does not exists
      else {
        resultArr.push({ id: placeInfo.id, name: placeInfo.name })
      }
      setFavoritePlaces(resultArr)
      setIsFavAnimPlaying(true)
    }
  }

  useEffect(() => {
    // We need to clean up the favorite animation
    if (isFavAnimPlaying) {
      setTimeout(() => {
        setIsFavAnimPlaying(false)
      }, 1000)
    }
  }, [isFavAnimPlaying])

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (storedData) {
      setFavoritePlaces(JSON.parse(storedData))
    }
  }, [])

  useEffect(() => {
    if (favoritePlaces.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favoritePlaces))
    }
  }, [favoritePlaces])

  return (
    <a.div className='weather__container' {...bind()} style={{ x, y, display: placeInfo === null ? 'none' : 'flex' }}>
      <div className='weather__header'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 className='weather__city_name'>{placeInfo?.name}</h1>
          <FavoriteStar
            color={starColor}
            onClick={handleFavoritePlaceClick}
            showSparkles={isFavAnimPlaying}
            sparkleCount={3}
          />
        </div>

        <div className='weather__type-container'>
          <div
            id={0}
            className={`weather__header-item ${selectedTab === 0 ? 'weather__header-item-active' : ''}`}
            onClick={handleClick}
          >
            Current
          </div>
          <div
            id={1}
            className={`weather__header-item ${selectedTab === 1 ? 'weather__header-item-active' : ''}`}
            onClick={handleClick}
          >
            Daily
          </div>
        </div>
      </div>

      <div className='weather__data'>
        <CurrentWeatherCard style={{ display: `${selectedTab == 0 ? 'flex' : 'none'}` }} />
        <DailyWeatherCard style={{ display: `${selectedTab == 1 ? 'flex' : 'none'}` }} />
      </div>
    </a.div>
  )
}
