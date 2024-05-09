'use client'
import { useWeatherStore } from '@/store/zustand'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaCircle, FaDotCircle } from 'react-icons/fa'

export default function DailyWeatherCard({ style }) {
  const [weatherData, setWeatherData] = useState(null)
  const [weatherInfo, setWeatherInfo] = useState(null)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
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
            daily: [
              'weather_code',
              'temperature_2m_max',
              'temperature_2m_min',
              'sunrise',
              'sunset',
              'daylight_duration',
              'uv_index_max',
              'wind_speed_10m_max',
            ],
            timezone: 'auto',
            temperature_unit: tempUnit.param,
            wind_speed_unit: windUnit.param,
          },
        })
        .then((data) => {
          const weatherByDay = []
          for (let i = 0; i < data.data.daily.time.length; i++) {
            weatherByDay.push({
              date: data.data.daily.time[i],
              weatherCode: data.data.daily.weather_code[i],
              temperature_2m_max: data.data.daily.temperature_2m_max[i],
              temperature_2m_min: data.data.daily.temperature_2m_min[i],
              sunrise: data.data.daily.sunrise[i],
              sunset: data.data.daily.sunset[i],
              daylight_duration: data.data.daily.daylight_duration[i],
              uv_index_max: data.data.daily.uv_index_max[i],
              wind_speed_10m_max: data.data.daily.wind_speed_10m_max[i],
            })
          }
          setWeatherInfo({ ...data.data.daily_units })
          setWeatherData(weatherByDay)
        })
    }
  }, [coordinates, tempUnit, windUnit])
  // weatherData.daily.time.map((val, index) => {
  //           return <DailyWeather key={val.date} data={val}/>
  //         })}
  return (
    <div className='weather__daily-container' style={style}>
      <div>
        <h1 className='weather__title'>Daily</h1>
        {weatherData !== null && (
          <div>
            <p>
              <strong>Local Date:</strong> {`${new Date(weatherData[selectedDayIndex].date).toLocaleDateString()}`}
            </p>
            <p>
              <strong>Max. Temperature:</strong> {weatherData[selectedDayIndex].temperature_2m_max}{' '}
              {weatherInfo.temperature_2m_max}
            </p>
            <p>
              <strong>Min. Temperature:</strong> {weatherData[selectedDayIndex].temperature_2m_min}{' '}
              {weatherInfo.temperature_2m_min}
            </p>
            <p>
              <strong>Max. Wind Speed:</strong> {weatherData[selectedDayIndex].wind_speed_10m_max}{' '}
              {weatherInfo.wind_speed_10m_max}
            </p>
            <p>
              <strong>Sunrise:</strong> {weatherData[selectedDayIndex].sunrise}
            </p>
            <p>
              <strong>Sunset:</strong> {weatherData[selectedDayIndex].sunset}
            </p>
            <p>
              <strong>UV Index Max:</strong> {weatherData[selectedDayIndex].uv_index_max}
            </p>
          </div>
        )}
        {weatherData === null && <div>No data available</div>}
      </div>
      <div className='weather__daily-selection'>
        {weatherData !== null &&
          weatherData.map((val, index) => {
            return selectedDayIndex === index ? (
              <FaDotCircle
                key={index}
                onClick={() => {
                  setSelectedDayIndex(index)
                }}
              />
            ) : (
              <FaCircle
                key={index}
                onClick={() => {
                  setSelectedDayIndex(index)
                }}
              />
            )
          })}
      </div>
    </div>
  )
}
