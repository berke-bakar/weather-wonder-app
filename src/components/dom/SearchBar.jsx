'use client'
import React, { useEffect } from 'react'
import { FaSearchLocation } from 'react-icons/fa'
import { useFormState, useFormStatus } from 'react-dom'
import { searchCity } from '@/lib/actions'
import { useCoordinateStore } from '@/store/zustand'
import LoadingComponent from './LoadingComponent'
import { useDrag } from '@use-gesture/react'
import { useSpring, a } from '@react-spring/web'

export default function SearchBar() {
  const initialState = { results: [], error: '' }
  const [state, dispatch] = useFormState(searchCity, initialState)

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
  const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y, immediate: true }))

  return (
    <a.div className='search__container' {...bind()} style={{ x, y }}>
      <form action={dispatch}>
        <div>
          <label htmlFor='city-input' className='search__title'>
            Search for city:
          </label>
          <div className='search__input-container'>
            <FaSearchLocation style={{ color: 'black' }} />
            <input id='city-input' name='city-input' className='search__input' type='text' placeholder='City Name' />
            <LoadingComponent />
          </div>
        </div>
      </form>
      <div className='search__results'>
        {state.results &&
          state.results.map((result, index) => {
            return (
              <SearchResult
                key={result.place_id}
                placeId={result.place_id}
                placeName={result.display_name}
                data={{ lat: Number(result.lat), lon: Number(result.lon), placeName: result.name }}
                className={`search__result_item ${index === 0 ? 'search__result_item-first' : index === state.results.length - 1 ? 'search__result_item-last' : 'search__result_item-middle'}`}
              />
            )
          })}
        {state.results.length === 0 && (
          <div className='search__result_item search__result_item-middle'>No results found.</div>
        )}
      </div>
    </a.div>
  )
}

function SearchResult({ placeId, placeName, data, ...props }) {
  const setCoordinates = useCoordinateStore((state) => state.setCoordinates)
  const setPlaceName = useCoordinateStore((state) => state.setPlaceName)
  function handleClick(evt) {
    setPlaceName(data.placeName)
    setCoordinates(data.lat, data.lon)
  }

  return (
    <div {...props} onClick={handleClick}>
      {placeName}
    </div>
  )
}
