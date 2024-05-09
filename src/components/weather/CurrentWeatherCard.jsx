'use client'
import { useWeatherStore } from '@/store/zustand'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function CurrentWeatherCard({ style }) {
  const [weatherData, setWeatherData] = useState(null)
  const coordinates = useWeatherStore((state) => state.coordinates)
  const tempUnit = useWeatherStore((state) => state.tempUnit)
  const windUnit = useWeatherStore((state) => state.windUnit)
  useEffect(() => {
    if (coordinates.lat !== null) {
      axios
        .get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            current: [
              'temperature_2m',
              'relative_humidity_2m',
              'apparent_temperature',
              'pressure_msl',
              'wind_speed_10m',
              'is_day',
              'weather_code',
            ],
            timezone: 'auto',
            temperature_unit: tempUnit.param,
            wind_speed_unit: windUnit.param,
          },
        })
        .then((data) => {
          setWeatherData({
            current: data.data.current,
            units: data.data.current_units,
            elevation: data.data.elevation,
            timezone: data.data.timezone,
          })
          // console.log(data.data)
        })
    }
  }, [coordinates, tempUnit, windUnit])

  return (
    <div className='weather__current-container' style={style}>
      <h1 className='weather__title'>Current</h1>
      {weatherData !== null && (
        <div>
          <p>
            <strong>Temperature:</strong> {weatherData.current.temperature_2m} {weatherData.units.temperature_2m}
          </p>
          <p>
            <strong>Feels Like:</strong>{' '}
            {`${weatherData.current.apparent_temperature} ${weatherData.units.apparent_temperature}`}
          </p>
          <p>
            <strong>Humidity:</strong>{' '}
            {`${weatherData.current.relative_humidity_2m} ${weatherData.units.relative_humidity_2m}`}
          </p>
          <p>
            <strong>Pressure:</strong> {`${weatherData.current.pressure_msl} ${weatherData.units.pressure_msl}`}
          </p>
          <p>
            <strong>Wind Speed:</strong> {`${weatherData.current.wind_speed_10m} ${weatherData.units.wind_speed_10m}`}
          </p>
          <p>
            <strong>Local Date:</strong> {`${new Date(weatherData.current.time).toLocaleDateString()}`}
          </p>
          <p>
            <strong>Local Time:</strong> {`${new Date(weatherData.current.time).toLocaleTimeString()}`}
          </p>
          <p>
            <strong>Timezone:</strong> {`${weatherData.timezone}`}
          </p>
        </div>
      )}
      {weatherData === null && <div>No data available</div>}
    </div>
  )
}
