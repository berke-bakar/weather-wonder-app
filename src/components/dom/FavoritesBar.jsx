'use client'
import React, { useEffect, useState } from 'react'
import styles from './FavoritesBar.module.css'
import { useWeatherStore } from '@/store/zustand'
const LOCAL_STORAGE_KEY = 'favoritePlaces'

export default function FavoritesBar() {
  const [favoritePlaces, setFavoritePlaces] = useState([])
  const setCoordinates = useWeatherStore((state) => state.setCoordinates)
  const setPlaceInfo = useWeatherStore((state) => state.setPlaceInfo)
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (storedData) {
      setFavoritePlaces(JSON.parse(storedData))
    }
  }, [])

  return (
    <div>
      {favoritePlaces.length !== 0 &&
        favoritePlaces.map((item, index) => (
          <div
            key={item.id}
            className={`search__result_item ${index === 0 ? 'search__result_item-first' : index === favoritePlaces.length - 1 ? 'search__result_item-last' : 'search__result_item-middle'}`}
            onClick={() => {
              setPlaceInfo({ id: item.id, name: item.name, detailedName: item.detailedName })
              setCoordinates(item.lat, item.lng)
            }}
          >
            {item.detailedName}
          </div>
        ))}
      {favoritePlaces.length === 0 && (
        <div className='search__result_item search__result_item-middle'>
          You can access your favorite places easily from here. Start by clicking star icon on selected places weather
          card
        </div>
      )}
    </div>
  )
}
