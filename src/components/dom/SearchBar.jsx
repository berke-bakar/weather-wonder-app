'use client'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaChevronDown, FaChevronUp, FaSearchLocation } from 'react-icons/fa'
import { useFormState } from 'react-dom'
import { searchCity } from '@/lib/actions'
import { useWeatherStore } from '@/store/zustand'
import LoadingComponent from './LoadingComponent'
import { useDrag } from '@use-gesture/react'
import { useSpring, a } from '@react-spring/web'

export default function SearchBar() {
  const initialState = { results: [], error: '' }
  const [state, dispatch] = useFormState(searchCity, initialState)
  const [searchBarVisible, setSearchBarVisible] = useState(true)
  const [searchResultsVisible, setSearchResultsVisible] = useState(true)
  const [isSearchBarOffScreen, setIsSearchBarOffScreen] = useState(false)

  const handleBarVisibilityClick = () => {
    if (isSearchBarOffScreen) {
      setSearchBarVisible(true)
    } else {
      setSearchBarVisible(false)
    }
  }
  const handleResultsVisibilityClick = () => {
    setSearchResultsVisible(!searchResultsVisible)
  }
  const [{ x, y, width, opacity }, api] = useSpring(() => ({ x: 0, y: 0, width: '100%', opacity: 1 }))
  const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y, immediate: true }))

  useEffect(() => {
    if (!searchBarVisible) {
      api.start({ x: 0, y: 0, immediate: false })
      api.start({
        width: '0%',
        opacity: 0,
        immediate: false,
        onResolve: () => {
          setIsSearchBarOffScreen(true)
        },
      })
    } else {
      api.start({ width: '100%', opacity: 1, immediate: false })
      setIsSearchBarOffScreen(false)
    }
  }, [searchBarVisible, api])

  return (
    <a.div className='search__container' {...bind()} style={{ x, y }}>
      {!isSearchBarOffScreen && (
        <a.div className='search__result-container' style={{ width, opacity }}>
          <form action={dispatch}>
            <div>
              {/* <label htmlFor='city-input' className='search__title'>
                Search for city:
              </label> */}
              <div className='search__bar'>
                <div className='search__input-container'>
                  <FaSearchLocation style={{ color: 'black' }} />
                  <input
                    id='city-input'
                    name='city-input'
                    className='search__input'
                    type='text'
                    placeholder='Search for a city...'
                  />
                  <LoadingComponent />
                </div>
                <div onClick={handleResultsVisibilityClick}>
                  {searchResultsVisible ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
            </div>
          </form>
          {searchResultsVisible && (
            <div className='search__results'>
              {state.results.length !== 0 &&
                state.results.map((item, index) => (
                  <SearchResult
                    key={item.place_id}
                    placeId={item.place_id}
                    placeName={item.display_name}
                    data={{ lat: Number(item.lat), lon: Number(item.lon), placeName: item.name }}
                    className={`search__result_item ${index === 0 ? 'search__result_item-first' : index === state.results.length - 1 ? 'search__result_item-last' : 'search__result_item-middle'}`}
                  />
                ))}
              {state.results.length === 0 && (
                <div className='search__result_item search__result_item-middle'>No results found.</div>
              )}
            </div>
          )}
        </a.div>
      )}
      <div className='search__hide-container' onClick={handleBarVisibilityClick}>
        {searchBarVisible ? <FaArrowLeft /> : <FaArrowRight />}
      </div>
    </a.div>
  )
}

function SearchResult({ placeId, placeName, data, ...props }) {
  const setCoordinates = useWeatherStore((state) => state.setCoordinates)
  const setPlaceInfo = useWeatherStore((state) => state.setPlaceInfo)
  function handleClick(evt) {
    setPlaceInfo({ id: placeId, name: data.placeName })
    setCoordinates(data.lat, data.lon)
  }

  return (
    <a.div {...props} onClick={handleClick}>
      {placeName}
    </a.div>
  )
}
