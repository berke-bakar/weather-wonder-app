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
    <div className={styles['fav__container']}>
      {favoritePlaces.length !== 0 &&
        favoritePlaces.map((item, index) => (
          <div
            key={item.id}
            className={`${styles['search__result_item']} ${index === 0 ? styles['search__result_item-first'] : index === favoritePlaces.length - 1 ? styles['search__result_item-last'] : styles['search__result_item-middle']}`}
            onClick={() => {
              setPlaceInfo({ id: item.id, name: item.name, detailedName: item.detailedName })
              setCoordinates(item.lat, item.lng)
            }}
          >
            {item.detailedName}
          </div>
        ))}
      {favoritePlaces.length === 0 && (
        <div className={`${styles['search__result_item']} ${styles['search__result_item-middle']}`}>
          You can access your favorite places easily from here.
          <br />
          <br />
          <ol className={styles['fav__ins-list']}>
            <li className={styles['fav__ins-item']}>
              Search for a place in previous <code>Search</code> tab
            </li>
            <li className={styles['fav__ins-item']}>Click on desired location</li>
            <li className={styles['fav__ins-item']}>Click on the star icon next to the location name</li>
            <li className={styles['fav__ins-item']}>Profit ???</li>
            <li className={styles['fav__ins-item']}>Check this tab again</li>
          </ol>
        </div>
      )}
    </div>
  )
}
