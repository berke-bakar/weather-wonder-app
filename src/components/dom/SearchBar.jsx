import React, { useEffect } from 'react'
import { FaSearchLocation } from 'react-icons/fa'
import { useFormState, useFormStatus } from 'react-dom'
import { searchCity } from '@/lib/actions'

export default function SearchBar() {
  const initialState = { results: [], error: '' }
  const [state, dispatch] = useFormState(searchCity, initialState)

  return (
    <div className='search__container'>
      <form action={dispatch}>
        <label htmlFor='city-input' className='search__title'>
          Search for city:
        </label>
        <div className='search__input-container'>
          <FaSearchLocation style={{ color: 'black' }} />
          <input id='city-input' name='city-input' className='search__input' type='text' placeholder='City Name' />
          <LoadingComponent />
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
                data={{ lat: Number(result.lat), lon: Number(result.lon) }}
                className={`search__result_item ${index === 0 ? 'search__result_item-first' : index === state.results.length - 1 ? 'search__result_item-last' : 'search__result_item-middle'}`}
              />
            )
          })}
        {state.results.length === 0 && (
          <div className='search__result_item search__result_item-middle'>No results found.</div>
        )}
      </div>
    </div>
  )
}

function LoadingComponent() {
  const { pending } = useFormStatus()

  return (
    <div>
      {pending && (
        <div className='search__loading'>
          <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        </div>
      )}
    </div>
  )
}

function SearchResult({ placeId, placeName, data, ...props }) {
  function handleClick(evt) {
    //data: {lat: 35.45324, lng: 42.3114}
  }

  return (
    <div {...props} onClick={handleClick}>
      {placeName}
    </div>
  )
}
