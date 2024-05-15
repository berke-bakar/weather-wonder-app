'use client'
import { useWeatherStore } from '@/store/zustand'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from './CurrentWeatherCard.module.css'
import Image from 'next/image'
import humidityIcon from '/public/img/weather/humidity.svg'
import pressureIcon from '/public/img/weather/barometer.svg'
import windsockIcon from '/public/img/weather/windsock.svg'
import { FcCalendar, FcClock, FcGlobe } from 'react-icons/fc'
import { fetchWeatherDescription, fetchWeatherResourceName } from '@/helpers/utils'
import MoreButton from '../dom/MoreButton'

export default function CurrentWeatherCard({ style }) {
  const [weatherData, setWeatherData] = useState(null)
  const [isMoreItemShown, setIsMoreItemShown] = useState(false)
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
            weatherImg: fetchWeatherResourceName(data.data.current.weather_code, data.data.current.is_day),
            weatherDesc: fetchWeatherDescription(data.data.current.weather_code),
            units: data.data.current_units,
            elevation: data.data.elevation,
            timezone: data.data.timezone,
          })
        })
    }
  }, [coordinates, tempUnit, windUnit])

  return (
    <>
      {weatherData !== null && weatherData.current !== null && (
        <div className={styles['weather__current--container']} style={style}>
          <div className={styles['weather__current--status']}>
            <div className={styles['weather__current--img']}>
              <Image
                alt='Icon representing the current weather'
                src={weatherData.weatherImg}
                objectFit='contain'
                layout='fill'
                style={{ display: 'block' }}
              />
            </div>
            <div className={styles['weather__current--status-container']}>
              <div className={styles['weather__current--temp-container']}>
                <p className={styles['weather__current--temp']}>{weatherData.current.temperature_2m}</p>
                <hr />
                <p className={styles['weather__current--apptemp']}>
                  Feels like {weatherData.current.apparent_temperature}°
                </p>
                <hr />
                <p className={styles['weather__current--apptemp']}>{weatherData.weatherDesc}</p>
              </div>
              <span className={styles['weather__current--unit']}>{weatherData.units.temperature_2m}</span>
            </div>
          </div>
          <div className={styles['weather__current--misc-container']}>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <Image
                  className={styles['weather__current--misc-icon']}
                  src={humidityIcon}
                  width={50}
                  height={50}
                  alt='Drop of water icon represents humidity'
                />
                <strong>Humidity:</strong>
              </div>
              <p className={styles['weather__current--misc-value']}>
                {`${weatherData.current.relative_humidity_2m} ${weatherData.units.relative_humidity_2m}`}
              </p>
            </div>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <Image
                  className={styles['weather__current--misc-icon']}
                  src={pressureIcon}
                  width={50}
                  height={50}
                  alt='Barometer icon to represent pressure'
                />
                <strong className={styles['weather__current--misc-bold']}> Pressure:</strong>
              </div>
              <p
                className={styles['weather__current--misc-value']}
              >{`${weatherData.current.pressure_msl} ${weatherData.units.pressure_msl}`}</p>
            </div>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <Image
                  className={styles['weather__current--misc-icon']}
                  src={windsockIcon}
                  width={50}
                  height={50}
                  alt='Windsok image for wind speed illustration'
                />
                <strong className={styles['weather__current--misc-bold']}> Wind:</strong>
              </div>
              <p
                className={styles['weather__current--misc-value']}
              >{`${weatherData.current.wind_speed_10m} ${weatherData.units.wind_speed_10m}`}</p>
            </div>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <FcCalendar className={styles['weather__current--misc-icon']} size={39} />
                <strong className={styles['weather__current--misc-bold']}> Local Date:</strong>
              </div>
              <p
                className={styles['weather__current--misc-value']}
              >{`${new Date(weatherData.current.time).toLocaleDateString()}`}</p>
            </div>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <FcClock className={styles['weather__current--misc-icon']} size={50} />
                <strong className={styles['weather__current--misc-bold']}> Time: </strong>
              </div>
              <p className={styles['weather__current--misc-value']}>
                {`${new Date(weatherData.current.time).toLocaleTimeString()}`}
              </p>
            </div>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <FcGlobe className={styles['weather__current--misc-icon']} size={50} />
                <strong className={styles['weather__current--misc-bold']}> TZ:</strong>
              </div>
              <p className={styles['weather__current--misc-value']}>{`${weatherData.timezone}`}</p>
            </div>
          </div>
          <MoreButton
            onClick={() => {
              setIsMoreItemShown(!isMoreItemShown)
            }}
            clicked={isMoreItemShown}
          />
        </div>
      )}
      {weatherData === null && <div>No data available</div>}
    </>
  )
}
