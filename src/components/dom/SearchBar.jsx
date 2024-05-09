'use client'
import React, { useState } from 'react'
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

  const handleBarVisibilityClick = () => {
    setSearchBarVisible(!searchBarVisible)
  }
  const handleResultsVisibilityClick = () => {
    setSearchResultsVisible(!searchResultsVisible)
  }
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
  const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y, immediate: true }))

  return (
    <a.div className='search__container' {...bind()} style={{ x, y }}>
      {searchBarVisible && (
        <div className='search__result-container'>
          <form action={dispatch}>
            <div>
              <label htmlFor='city-input' className='search__title'>
                Search for city:
              </label>
              <div className='search__bar'>
                <div className='search__input-container'>
                  <FaSearchLocation style={{ color: 'black' }} />
                  <input
                    id='city-input'
                    name='city-input'
                    className='search__input'
                    type='text'
                    placeholder='City Name'
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
        </div>
      )}
      <div className='search__hide-container' onClick={handleBarVisibilityClick}>
        {searchBarVisible ? <FaArrowLeft /> : <FaArrowRight />}
      </div>
    </a.div>
  )
}

function SearchResult({ placeId, placeName, data, ...props }) {
  const setCoordinates = useWeatherStore((state) => state.setCoordinates)
  const setPlaceName = useWeatherStore((state) => state.setPlaceName)
  function handleClick(evt) {
    setPlaceName(data.placeName)
    setCoordinates(data.lat, data.lon)
  }

  return (
    <a.div {...props} onClick={handleClick}>
      {placeName}
    </a.div>
  )
}
