'use client'
import React, { useRef, useState } from 'react'
import { FaChevronUp, FaSearchLocation } from 'react-icons/fa'
import { IoCloseOutline } from 'react-icons/io5'
import { useFormState } from 'react-dom'
import { searchCity } from '@/lib/actions'
import { useWeatherStore } from '@/store/zustand'
import LoadingComponent from './LoadingComponent'
import { useSpring, a } from '@react-spring/web'
import styles from './SearchBar.module.css'

export default function SearchBar() {
  const initialState = { results: [], error: '' }
  const [state, dispatch] = useFormState(searchCity, initialState)
  const [searchResultsVisible, setSearchResultsVisible] = useState(false)
  const inputRef = useRef(null)

  const handleResultsVisibilityClick = () => {
    api.start({ hideSearchResultsRotate: searchResultsVisible ? 1 : 0 })
    setSearchResultsVisible(!searchResultsVisible)
  }
  const [{ hideSearchResultsRotate }, api] = useSpring(() => ({
    hideSearchResultsRotate: 1,
  }))

  return (
    <a.div className={styles['search__result-container']}>
      <form action={dispatch}>
        <div className={styles['search__bar']}>
          <div className={styles['search__input-container']}>
            <FaSearchLocation style={{ color: 'black' }} />
            <input
              id='city-input'
              name='city-input'
              className={styles['search__input']}
              type='text'
              placeholder='Search for a city...'
              ref={inputRef}
            />
            <LoadingComponent />
            <IoCloseOutline
              className={styles['search__clear-icon']}
              onClick={() => {
                inputRef.current.value = ''
                inputRef.current.focus()
              }}
            />
          </div>
          <div className={styles['search__result-hide']} onClick={handleResultsVisibilityClick}>
            <a.div
              style={{
                transform: hideSearchResultsRotate.to([0, 1], [0, 180]).to((value) => `rotateZ(${value}deg)`),
              }}
            >
              <FaChevronUp />
            </a.div>
          </div>
        </div>
      </form>
      {searchResultsVisible && (
        <div className={styles['search__results']} style={{ touchAction: 'pan-y' }}>
          {state.results.length !== 0 &&
            state.results.map((item, index) => (
              <SearchResult
                key={item.place_id}
                placeId={item.place_id}
                placeName={item.display_name}
                data={{ lat: Number(item.lat), lon: Number(item.lon), placeName: item.name }}
                className={`${styles['search__result_item']} ${index === 0 ? styles['search__result_item-first'] : index === state.results.length - 1 ? styles['search__result_item-last'] : styles['search__result_item-middle']}`}
              />
            ))}
          {state.results.length === 0 && (
            <div className={`${styles['search__result_item']} ${styles['search__result_item-middle']}`}>
              No results found.
            </div>
          )}
        </div>
      )}
    </a.div>
  )
}

function SearchResult({ placeId, placeName, data, ...props }) {
  const setCoordinates = useWeatherStore((state) => state.setCoordinates)
  const setPlaceInfo = useWeatherStore((state) => state.setPlaceInfo)
  function handleClick(evt) {
    setPlaceInfo({ id: placeId, name: data.placeName, detailedName: placeName })
    setCoordinates(data.lat, data.lon)
  }

  return (
    <a.div {...props} onClick={handleClick}>
      <p>{placeName}</p>
    </a.div>
  )
}
