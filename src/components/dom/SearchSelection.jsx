import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import { useDrag } from '@use-gesture/react'
import { useSpring, a } from '@react-spring/web'
import { FaArrowLeft, FaMapMarkerAlt, FaSearchLocation } from 'react-icons/fa'
import styles from './SearchSelection.module.css'
import FavoritesBar from './FavoritesBar'

export default function SearchSelection() {
  const [searchBarVisible, setSearchBarVisible] = useState(true)
  const [isSearchBarOffScreen, setIsSearchBarOffScreen] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const SelectedTab = selectedTabIndex === 0 ? SearchBar : FavoritesBar

  const handleBarVisibilityClick = () => {
    if (isSearchBarOffScreen) {
      setSearchBarVisible(true)
    } else {
      setSearchBarVisible(false)
    }
  }

  const [{ x, y, width, opacity, color, hideSearchBarRotate }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    width: '100%',
    opacity: 1,
    color: 'white',
    hideSearchBarRotate: 0,
  }))

  const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y, immediate: true }))

  useEffect(() => {
    if (!searchBarVisible) {
      api.start({ color: 'transparent', immediate: true })
      api.start({ x: 0, y: 0, immediate: true })
      api.start({
        width: '0%',
        opacity: 0,
        hideSearchBarRotate: 1,
        immediate: false,
        onResolve: () => {
          setIsSearchBarOffScreen(true)
        },
      })
    } else {
      setIsSearchBarOffScreen(false)
      api.start({
        width: '100%',
        opacity: 1,
        hideSearchBarRotate: 0,
        color: 'white',
        immediate: false,
      })
    }
  }, [searchBarVisible, api])

  return (
    <a.div className={styles['selection__flex']} {...bind()} style={{ x, y }}>
      {!isSearchBarOffScreen && (
        <a.div style={{ width, opacity, color }}>
          <div className={styles['selection__tabs--container']}>
            <div
              className={`${styles['selection__tabs--item']} ${selectedTabIndex === 0 ? styles['selection__tabs--active'] : ''}`}
              onClick={() => setSelectedTabIndex(0)}
            >
              <FaSearchLocation />
              <p>Search</p>
            </div>
            <div
              className={`${styles['selection__tabs--item']} ${selectedTabIndex === 1 ? styles['selection__tabs--active'] : ''}`}
              onClick={() => setSelectedTabIndex(1)}
            >
              <FaMapMarkerAlt />
              <p>Favorite</p>
            </div>
          </div>
          <div className={styles['selection__item--container']}>
            <SelectedTab />
          </div>
        </a.div>
      )}
      <div className={styles['hide__container']} onClick={handleBarVisibilityClick}>
        <a.div
          style={{
            transform: hideSearchBarRotate.to([0, 1], [0, 180]).to((value) => `rotateZ(${value}deg)`),
          }}
        >
          <FaArrowLeft />
        </a.div>
      </div>
    </a.div>
  )
}
