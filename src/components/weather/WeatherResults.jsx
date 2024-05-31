'use client'
import React, { useEffect, useState } from 'react'
import { useWeatherStore } from '@/store/zustand'
import CurrentWeatherCard from './CurrentWeatherCard'
import DailyWeatherCard from './DailyWeatherCard'
import { useSpring, a } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import FavoriteStar from '../star/FavoriteStar'
import HourlyWeatherCard from './HourlyWeatherCard'
import { fetchWeatherDescription, fetchWeatherResourceName } from '@/helpers/utils'
import axios from 'axios'
import styles from './WeatherResults.module.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const LOCAL_STORAGE_KEY = 'favoritePlaces'

export default function WeatherResults() {
  // Store items
  const placeInfo = useWeatherStore((state) => state.placeInfo)
  const coordinates = useWeatherStore((state) => state.coordinates)
  const tempUnit = useWeatherStore((state) => state.tempUnit)
  const windUnit = useWeatherStore((state) => state.windUnit)
  // Weather data states
  const [currentData, setCurrentData] = useState(null)
  const [hourlyData, setHourlyData] = useState(null)
  const [dailyData, setDailyData] = useState(null)
  // Tab selection, and favorite places
  const [selectedTab, setSelectedTab] = useState(0)
  const [isFavAnimPlaying, setIsFavAnimPlaying] = useState(false)
  const [favoritePlaces, setFavoritePlaces] = useState(null)
  const [weatherInfo, setWeatherInfo] = useState({})

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
  const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y, immediate: true }))
  const starColor =
    placeInfo !== null ? (favoritePlaces?.find((val) => val.id === placeInfo.id) ? 'yellow' : 'lightgray') : 'lightgray'

  function handleFavoritePlaceClick(evt) {
    if (placeInfo !== null) {
      const resultArr = favoritePlaces ? [...favoritePlaces] : []
      let index = resultArr.findIndex((value) => {
        return value.id === placeInfo.id
      })
      // Remove from favorite places if it exists
      if (index !== -1) {
        resultArr.splice(index, 1)
      }
      // Add to favorite places if it does not exists
      else {
        resultArr.push({ ...placeInfo, ...coordinates })
      }
      setFavoritePlaces(resultArr)
      setIsFavAnimPlaying(true)
    }
  }

  // On mount, get data
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (storedData) {
      setFavoritePlaces(JSON.parse(storedData))
    }
  }, [])

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
            daily: [
              'weather_code',
              'temperature_2m_max',
              'temperature_2m_min',
              'sunrise',
              'sunset',
              'daylight_duration',
              'uv_index_max',
              'wind_speed_10m_max',
              'precipitation_probability_max',
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
              date: new Date(data.data.daily.time[i]),
              weatherImg: fetchWeatherResourceName(data.data.daily.weather_code[i]),
              weatherDesc: fetchWeatherDescription(data.data.daily.weather_code[i]),
              temperature_2m_max: data.data.daily.temperature_2m_max[i],
              temperature_2m_min: data.data.daily.temperature_2m_min[i],
              sunrise: data.data.daily.sunrise[i],
              sunset: data.data.daily.sunset[i],
              daylight_duration: `${Math.floor(data.data.daily.daylight_duration[i] / 3600)}h ${Math.floor((data.data.daily.daylight_duration[i] % 3600) / 60)}m`,
              uv_index_max: data.data.daily.uv_index_max[i],
              wind_speed_10m_max: data.data.daily.wind_speed_10m_max[i],
              chance_of_rain: data.data.daily.precipitation_probability_max[i],
            })
          }
          setWeatherInfo({
            ...weatherInfo,
            current_units: data.data.current_units,
            daily_units: data.data.daily_units,
            timezone: data.data.timezone,
          })
          setCurrentData({
            current: data.data.current,
            weatherImg: fetchWeatherResourceName(data.data.current.weather_code, data.data.current.is_day),
            weatherDesc: fetchWeatherDescription(data.data.current.weather_code),
            elevation: data.data.elevation,
            timezone: data.data.timezone,
          })
          setDailyData(weatherByDay)
        })

      axios
        .get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            hourly: [
              'temperature_2m',
              'relative_humidity_2m',
              'apparent_temperature',
              'precipitation_probability',
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
          const weatherByDay = []
          let currentDay = {
            day: new Date(data.data.hourly.time[0]).getDay(),
            temperature_2m: [],
            relative_humidity_2m: [],
            apparent_temperature: [],
            precipitation_probability: [],
            wind_speed_10m: [],
            weather_img: [],
            weather_desc: [],
          }
          for (let i = 0; i < data.data.hourly.time.length; i++) {
            // TODO: Parse data according to days and hours
            if (i !== 0 && i % 24 === 0) {
              weatherByDay.push(currentDay)
              currentDay = {
                day: new Date(data.data.hourly.time[i + 1]).getDay(),
                temperature_2m: [],
                relative_humidity_2m: [],
                apparent_temperature: [],
                precipitation_probability: [],
                wind_speed_10m: [],
                weather_img: [],
                weather_desc: [],
              }
            }

            currentDay.temperature_2m.push(data.data.hourly.temperature_2m[i])
            currentDay.relative_humidity_2m.push(data.data.hourly.relative_humidity_2m[i])
            currentDay.apparent_temperature.push(data.data.hourly.apparent_temperature[i])
            currentDay.precipitation_probability.push(data.data.hourly.precipitation_probability[i])
            currentDay.wind_speed_10m.push(data.data.hourly.wind_speed_10m[i])
            currentDay.weather_img.push(
              fetchWeatherResourceName(data.data.hourly.weather_code[i], data.data.hourly.is_day[i]),
            )
            currentDay.weather_desc.push(fetchWeatherDescription(data.data.hourly.weather_code[i]))
          }
          weatherByDay.push(currentDay)
          setHourlyData({ data: weatherByDay, units: data.data.hourly_units })
        })
    }
  }, [coordinates, tempUnit, windUnit])

  // Favorite star animation
  useEffect(() => {
    // We need to clean up the favorite animation
    if (isFavAnimPlaying) {
      setTimeout(() => {
        setIsFavAnimPlaying(false)
      }, 1000)
    }
  }, [isFavAnimPlaying])

  // Favorite places update
  useEffect(() => {
    if (favoritePlaces !== null) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favoritePlaces))
    }
  }, [favoritePlaces])

  return (
    <a.div
      className={styles['weather__container']}
      {...bind()}
      style={{ x, y, display: placeInfo === null ? 'none' : 'flex' }}
    >
      <div className={styles['weather__header']}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 className={styles['weather__city_name']}>{placeInfo?.name}</h1>
          <FavoriteStar
            color={starColor}
            onClick={handleFavoritePlaceClick}
            showSparkles={isFavAnimPlaying}
            sparkleCount={3}
          />
        </div>
        <TabWeatherTypeSelection selectedTab={selectedTab} notify={setSelectedTab} />
        <CounterWeatherTypeSelection selectedTab={selectedTab} notify={setSelectedTab} />
      </div>

      <div className={styles['weather__data']}>
        <CurrentWeatherCard
          key={0}
          data={currentData}
          timezone={currentData?.timezone}
          units={weatherInfo?.current_units}
          style={{ display: `${selectedTab == 0 ? 'flex' : 'none'}` }}
        />
        <HourlyWeatherCard
          key={1}
          data={hourlyData?.data}
          units={hourlyData?.units}
          style={{ display: `${selectedTab == 1 ? 'flex' : 'none'}` }}
        />
        <DailyWeatherCard
          key={2}
          data={dailyData}
          units={weatherInfo?.daily_units}
          style={{ display: `${selectedTab == 2 ? 'flex' : 'none'}` }}
        />
      </div>
      <p className='attribution'>
        Weather data by{' '}
        <a href='https://open-meteo.com'>
          <code>Open-Meteo.com</code>
        </a>
      </p>
    </a.div>
  )
}

function TabWeatherTypeSelection({ selectedTab, notify }) {
  return (
    <div className={styles['weather__type-container']}>
      <div
        id={0}
        className={`${styles['weather__header-item']} ${selectedTab === 0 ? styles['weather__header-item-active'] : ''}`}
        onClick={() => notify(0)}
      >
        Current
      </div>
      <div
        id={1}
        className={`${styles['weather__header-item']} ${selectedTab === 1 ? styles['weather__header-item-active'] : ''}`}
        onClick={() => notify(1)}
      >
        Hourly
      </div>
      <div
        id={2}
        className={`${styles['weather__header-item']} ${selectedTab === 2 ? styles['weather__header-item-active'] : ''}`}
        onClick={() => notify(2)}
      >
        Daily
      </div>
    </div>
  )
}

function CounterWeatherTypeSelection({ selectedTab, notify }) {
  return (
    <div className={`${styles['weather__type-container--counter']} ${styles['weather__type-container']}`}>
      <div
        id={0}
        className={`${styles['weather__header-item--counter']}`}
        onClick={() => notify((((selectedTab - 1) % 3) + 3) % 3)}
      >
        <FaChevronLeft size={16} />
      </div>
      <div id={1} className={`${styles['weather__header-item--counter']}`}>
        {selectedTab === 0 ? 'Current' : selectedTab === 1 ? 'Hourly' : 'Daily'}
      </div>
      <div
        id={2}
        className={`${styles['weather__header-item--counter']}`}
        onClick={() => notify((selectedTab + 1) % 3)}
      >
        <FaChevronRight size={16} />
      </div>
    </div>
  )
}
