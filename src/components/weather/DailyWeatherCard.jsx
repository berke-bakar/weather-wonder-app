'use client'
import { useWeatherStore } from '@/store/zustand'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CapsuleTabSelection from '../dom/CapsuleTabSelection'
import { IoRainyOutline, IoSunnyOutline } from 'react-icons/io5'
import thermometerIcon from '/public/img/weather/thermometer.svg'
import windsockIcon from '/public/img/weather/windsock.svg'
import sunriseIcon from '/public/img/weather/sunrise.svg'
import sunsetIcon from '/public/img/weather/sunset.svg'

import Image from 'next/image'
import styles from './DailyWeatherCard.module.css'
import { FaClock } from 'react-icons/fa'
import { fetchWeatherDescription, fetchWeatherResourceName } from '@/helpers/utils'

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
              'precipitation_probability_max',
            ],
            timezone: 'auto',
            temperature_unit: tempUnit.param,
            wind_speed_unit: windUnit.param,
          },
        })
        .then((data) => {
          console.log(data)
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
              daylight_duration: `${Math.floor(data.data.daily.daylight_duration[i] / 3600)}:${Math.floor((data.data.daily.daylight_duration[i] % 3600) / 60)}`,
              uv_index_max: data.data.daily.uv_index_max[i],
              wind_speed_10m_max: data.data.daily.wind_speed_10m_max[i],
              chance_of_rain: data.data.daily.precipitation_probability_max[i],
            })
          }
          setWeatherInfo({ ...data.data.daily_units, timezone: data.data.timezone })
          setWeatherData(weatherByDay)
        })
    }
  }, [coordinates, tempUnit, windUnit])

  return (
    <div className='weather__daily-container' style={style}>
      <div>
        {weatherData !== null && (
          <div className={styles['weather__daily--container']} style={style}>
            <div className={styles['weather__daily--status']}>
              <div className={styles['weather__daily--img']}>
                <Image
                  alt='Icon representing the daily weather'
                  src={weatherData[selectedDayIndex].weatherImg}
                  objectFit='contain'
                  layout='fill'
                />
              </div>
              <div className={styles['weather__daily--status-container']}>
                <div className={styles['weather__daily--temp-container']}>
                  <p className={styles['weather__daily--temp']}>{weatherData[selectedDayIndex].temperature_2m_max}</p>
                  <hr />
                  <p className={styles['weather__daily--desc']}>{weatherData[selectedDayIndex].weatherDesc}</p>
                </div>
                <span className={styles['weather__daily--unit']}>{weatherInfo.temperature_2m_max}</span>
              </div>
            </div>
            <div className={styles['weather__daily--misc-container']}>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <Image
                    className={styles['weather__daily--misc-icon']}
                    src={thermometerIcon}
                    width={50}
                    height={50}
                    alt='Thermometer icon'
                  />
                  <strong>Temp:</strong>
                </div>
                <p className={styles['weather__daily--misc-value']}>
                  {`${weatherData[selectedDayIndex].temperature_2m_max} ${weatherInfo.temperature_2m_max} / ${weatherData[selectedDayIndex].temperature_2m_min} ${weatherInfo.temperature_2m_min}`}
                </p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <Image
                    className={styles['weather__daily--misc-icon']}
                    src={windsockIcon}
                    width={50}
                    height={50}
                    alt='Windsok image for wind speed illustration'
                  />
                  <strong className={styles['weather__daily--misc-bold']}> Wind:</strong>
                </div>
                <p
                  className={styles['weather__daily--misc-value']}
                >{`${weatherData[selectedDayIndex].wind_speed_10m_max} ${weatherInfo.wind_speed_10m_max}`}</p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <IoRainyOutline className={styles['weather__daily--misc-icon']} size={39} />
                  <strong className={styles['weather__daily--misc-bold']}> Chance of rain:</strong>
                </div>
                <p
                  className={styles['weather__daily--misc-value']}
                >{`${weatherData[selectedDayIndex].chance_of_rain} ${weatherInfo.precipitation_probability_max} `}</p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <IoSunnyOutline className={styles['weather__daily--misc-icon']} size={39} />
                  <strong className={styles['weather__daily--misc-bold']}> UV Index: </strong>
                </div>
                <p className={styles['weather__daily--misc-value']}>
                  {`${weatherData[selectedDayIndex].uv_index_max} ${weatherInfo.uv_index_max}`}
                </p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <Image
                    className={styles['weather__daily--misc-icon']}
                    src={sunriseIcon}
                    width={50}
                    height={50}
                    alt='Sunrise icon'
                  />
                  <strong className={styles['weather__daily--misc-bold']}> Sunrise:</strong>
                </div>
                <p
                  className={styles['weather__daily--misc-value']}
                >{`${new Date(weatherData[selectedDayIndex].sunrise).toLocaleTimeString()}`}</p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <Image
                    className={styles['weather__daily--misc-icon']}
                    src={sunsetIcon}
                    width={50}
                    height={50}
                    alt='Sunset icon'
                  />
                  <strong className={styles['weather__daily--misc-bold']}> Sunset:</strong>
                </div>
                <p
                  className={styles['weather__daily--misc-value']}
                >{`${new Date(weatherData[selectedDayIndex].sunset).toLocaleTimeString()}`}</p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <FaClock className={styles['weather__daily--misc-icon']} size={39} />
                  <strong className={styles['weather__daily--misc-bold']}> Day Light Duration:</strong>
                </div>
                <p
                  className={styles['weather__daily--misc-value']}
                >{`${weatherData[selectedDayIndex].daylight_duration}`}</p>
              </div>
            </div>
          </div>
        )}
        {weatherData === null && <div>No data available</div>}
      </div>
      <CapsuleTabSelection
        tabNames={
          weatherData
            ? weatherData.map((value) => {
                return value.date.getDay()
              })
            : ['No Data']
        }
        onClickHandler={setSelectedDayIndex}
        activeIndex={selectedDayIndex}
      />
    </div>
  )
}
