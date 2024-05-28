'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronUp, FaSearchLocation } from 'react-icons/fa'
import { IoCloseOutline } from 'react-icons/io5'
import { useWeatherStore } from '@/store/zustand'
import LoadingComponent from './LoadingComponent'
import { useSpring, a } from '@react-spring/web'
import styles from './SearchBar.module.css'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'

export default function SearchBar() {
  const initialState = { results: [], error: '' }
  const [selectedCity, setSelectedCity] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(initialState)
  const [searchResultsVisible, setSearchResultsVisible] = useState(false)
  const inputRef = useRef(null)
  const formRef = useRef(null)

  const handleResultsVisibilityAnim = (isOpen) => {
    api.start({ hideSearchResultsRotate: !isOpen ? 1 : 0 })
    setSearchResultsVisible(isOpen)
  }

  const [{ hideSearchResultsRotate }, api] = useSpring(() => ({
    hideSearchResultsRotate: 1,
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedCity !== inputRef.current.value) {
      setIsLoading(true)
      setSelectedCity(inputRef.current.value)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            city: selectedCity,
            format: 'jsonv2',
            limit: 10,
            featureType: 'settlement',
            'accept-language': 'en-US',
          },
        })
        setSearchResults({ results: data.data, error: '' })
      } catch (e) {
        setSearchResults({ results: [], error: 'Error happened while getting city information.' })
      } finally {
        setIsLoading(false)
        handleResultsVisibilityAnim(true)
      }
    }

    if (selectedCity) {
      fetchData()
    }
  }, [selectedCity])

  return (
    <a.div className={styles['search__result-container']}>
      <form ref={formRef} onSubmit={handleSubmit}>
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
              onKeyUp={(e) => {
                if (e.bubbles && !e.cancelable && e.key === 'Unidentified') {
                  formRef.current.requestSubmit()
                  handleResultsVisibilityAnim(true)
                }
              }}
            />
            <LoadingComponent enabled={isLoading} />
            <IoCloseOutline
              className={styles['search__clear-icon']}
              onClick={() => {
                inputRef.current.value = ''
                inputRef.current.focus()
              }}
            />
          </div>
          <div
            className={styles['search__result-hide']}
            onClick={() => handleResultsVisibilityAnim(!searchResultsVisible)}
          >
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
          {searchResults.results.length !== 0 &&
            searchResults.results.map((item, index) => (
              <SearchResult
                key={item.place_id}
                placeId={item.place_id}
                placeName={item.display_name}
                data={{ lat: Number(item.lat), lon: Number(item.lon), placeName: item.name }}
                className={`${styles['search__result_item']} ${index === 0 ? styles['search__result_item-first'] : index === searchResults.results.length - 1 ? styles['search__result_item-last'] : styles['search__result_item-middle']}`}
                notify={handleResultsVisibilityAnim}
              />
            ))}
          {searchResults.results.length === 0 && (
            <div className={`${styles['search__result_item']} ${styles['search__result_item-middle']}`}>
              {searchResults.error ? searchResults.error : 'No results found.'}
            </div>
          )}
        </div>
      )}
    </a.div>
  )
}

function SearchResult({ placeId, placeName, data, notify, ...props }) {
  const setCoordinates = useWeatherStore((state) => state.setCoordinates)
  const setPlaceInfo = useWeatherStore((state) => state.setPlaceInfo)
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  function handleClick(evt) {
    setPlaceInfo({ id: placeId, name: data.placeName, detailedName: placeName })
    setCoordinates(data.lat, data.lon)
    if (isTabletOrMobile) {
      notify(false)
    }
  }

  return (
    <a.div {...props} onClick={handleClick}>
      <p>{placeName}</p>
    </a.div>
  )
}
